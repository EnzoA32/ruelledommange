(function(){
  "use strict";
  var SB_URL = "__SUPABASE_URL__", SB_KEY = "__SUPABASE_KEY__";
  var CATEGORIES = ["Bouteille 75cl","Bulles de Vanille","Coffret","Demi-Bouteille","Magnum","Ratafia","Merchandising"];
  var STATUS = {paid:"Payée", preparing:"En préparation", shipped:"Expédiée", delivered:"Livrée", refunded:"Remboursée", cancelled:"Annulée"};
  var app = document.getElementById("app");
  var sb = window.supabase.createClient(SB_URL, SB_KEY);
  var S = {tab:"products", products:[], events:[], orders:[], user:null, dirty:false};

  /* ---------- utilitaires ---------- */
  function esc(t){ return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function euro(c){ return (c/100).toFixed(2).replace(".", ",") + " €"; }
  function toast(msg, bad){
    var t = $("#toast"); t.textContent = msg; t.className = "show" + (bad ? " bad" : "");
    clearTimeout(toast.t); toast.t = setTimeout(function(){ t.className = ""; }, 3200);
  }
  function slug(s){
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  }
  function fmtDate(iso){
    return new Date(iso).toLocaleString("fr-FR", {timeZone:"Europe/Paris", day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit"});
  }
  function toLocalInput(iso){          /* ISO -> valeur d'un <input datetime-local> en heure de Paris */
    var o = {};
    new Intl.DateTimeFormat("fr-FR",{timeZone:"Europe/Paris",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(iso)).forEach(function(x){ o[x.type]=x.value; });
    return o.year+"-"+o.month+"-"+o.day+"T"+o.hour+":"+o.minute;
  }
  function fromLocalInput(v){          /* valeur saisie (heure de Paris) -> ISO UTC */
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); if(!m) return null;
    var guess = Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5]);
    var parisAtGuess = toLocalInput(new Date(guess).toISOString()).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    var shown = Date.UTC(+parisAtGuess[1], +parisAtGuess[2]-1, +parisAtGuess[3], +parisAtGuess[4], +parisAtGuess[5]);
    return new Date(guess - (shown - guess)).toISOString();
  }
  function compress(file, maxW){
    return new Promise(function(resolve, reject){
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function(){
        var r = Math.min(1, maxW / img.width), c = document.createElement("canvas");
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function(b){ b ? resolve(b) : reject(new Error("Conversion de l'image impossible")); }, "image/webp", 0.86);
      };
      img.onerror = function(){ reject(new Error("Fichier image illisible")); };
      img.src = url;
    });
  }
  function uploadImage(file, folder, name){
    return compress(file, 1600).then(function(blob){
      var path = folder + "/" + name + "-" + Date.now() + ".webp";
      return sb.storage.from("media").upload(path, blob, {contentType:"image/webp", cacheControl:"31536000"}).then(function(r){
        if(r.error) throw r.error;
        return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
      });
    });
  }

  /* ---------- connexion ---------- */
  function showLogin(msg, recovery){
    app.innerHTML = '<form class="login" id="loginForm">' +
      '<h1>Ruelle-Dommange</h1><p>' + (recovery ? "Choisissez un nouveau mot de passe." : "Espace d'administration") + '</p>' +
      (recovery
        ? '<label for="pw">Nouveau mot de passe</label><input id="pw" type="password" minlength="8" required autocomplete="new-password">'
        : '<label for="em">Adresse e-mail</label><input id="em" type="email" required autocomplete="username">' +
          '<label for="pw">Mot de passe</label><input id="pw" type="password" required autocomplete="current-password">') +
      '<p class="err" id="loginErr">' + esc(msg || "") + '</p>' +
      '<div class="actions"><button class="btn" type="submit">' + (recovery ? "Enregistrer" : "Se connecter") + '</button>' +
      (recovery ? '' : '<button class="btn ghost" type="button" id="forgot">Mot de passe oublié</button>') + '</div></form>';
    $("#loginForm").onsubmit = function(e){
      e.preventDefault();
      var err = $("#loginErr"); err.textContent = "";
      if(recovery){
        sb.auth.updateUser({password:$("#pw").value}).then(function(r){
          if(r.error){ err.textContent = r.error.message; return; }
          location.hash = ""; start();
        });
        return;
      }
      sb.auth.signInWithPassword({email:$("#em").value.trim(), password:$("#pw").value}).then(function(r){
        if(r.error){ err.textContent = "E-mail ou mot de passe incorrect."; return; }
        start();
      });
    };
    var f = $("#forgot");
    if(f) f.onclick = function(){
      var em = $("#em").value.trim(), err = $("#loginErr");
      if(!em){ err.textContent = "Saisissez d'abord votre adresse e-mail."; return; }
      sb.auth.resetPasswordForEmail(em, {redirectTo: location.origin + "/admin/"}).then(function(){
        err.style.color = "#2f6b2a"; err.textContent = "Si ce compte existe, un e-mail de réinitialisation vient d'être envoyé.";
      });
    };
  }

  function start(){
    sb.auth.getSession().then(function(r){
      var session = r.data && r.data.session;
      if(!session) return showLogin();
      S.user = session.user;
      sb.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle().then(function(a){
        if(a.error || !a.data){
          sb.auth.signOut().then(function(){ showLogin("Ce compte n'a pas les droits d'administration."); });
          return;
        }
        loadAll().then(render);
      });
    });
  }
  sb.auth.onAuthStateChange(function(ev){ if(ev === "PASSWORD_RECOVERY") showLogin("", true); });

  /* ---------- données ---------- */
  function loadAll(){
    return Promise.all([
      sb.from("products").select("*").order("sort_order"),
      sb.from("events").select("*").order("starts_at", {ascending:false}),
      sb.from("orders").select("*").order("created_at", {ascending:false}).limit(200)
    ]).then(function(r){
      S.products = r[0].data || []; S.events = r[1].data || []; S.orders = r[2].data || [];
      var e = r[0].error || r[1].error || r[2].error; if(e) toast("Erreur de chargement : " + e.message, true);
    });
  }
  function reload(){ return loadAll().then(render); }

  /* ---------- rendu ---------- */
  function render(){
    app.innerHTML =
      '<div class="topbar"><h1>Administration · Ruelle-Dommange</h1><span class="who">' + esc(S.user.email) + '</span>' +
      '<a class="btn sm" href="/" target="_blank" rel="noopener">Voir le site</a><button class="btn sm" id="logout">Déconnexion</button></div>' +
      '<div class="tabs">' + [["products","Produits"],["events","Événements"],["orders","Commandes"]].map(function(t){
        return '<button data-tab="' + t[0] + '" class="' + (S.tab === t[0] ? "on" : "") + '">' + t[1] + '</button>'; }).join("") + '</div>' +
      '<main>' + (S.dirty ? '<div class="notice"><span>Vos modifications sont visibles tout de suite sur le site. Pour que Google voie aussi les nouveaux produits et événements, mettez à jour les pages (2 minutes).</span><button class="btn sm" id="redeploy">Mettre à jour pour Google</button></div>' : '') +
      (S.tab === "products" ? productsView() : S.tab === "events" ? eventsView() : ordersView()) + '</main>';
    $("#logout").onclick = function(){ sb.auth.signOut().then(function(){ showLogin(); }); };
    document.querySelectorAll(".tabs button").forEach(function(b){ b.onclick = function(){ S.tab = b.dataset.tab; render(); }; });
    var rd = $("#redeploy"); if(rd) rd.onclick = redeploy;
    bindView();
  }

  function productsView(){
    var rows = S.products.map(function(p){
      return '<tr><td>' + (p.photo_url ? '<img src="' + esc(p.photo_url) + '" alt="">' : '') + '</td>' +
        '<td><strong>' + esc(p.name) + '</strong><div class="hint">' + esc(p.id) + '</div></td><td>' + esc(p.category) + '</td>' +
        '<td>' + euro(p.price_cents) + '</td>' +
        '<td>' + (p.stock == null ? '<span class="pill">non suivi</span>' : p.stock === 0 ? '<span class="pill warn">épuisé</span>' : p.stock) + '</td>' +
        '<td>' + (p.active ? '<span class="pill ok">en ligne</span>' : '<span class="pill off">masqué</span>') + '</td>' +
        '<td><button class="btn ghost sm" data-edit-product="' + esc(p.id) + '">Modifier</button></td></tr>';
    }).join("");
    return '<div class="bar"><h2>Produits</h2><button class="btn" id="newProduct">+ Nouveau produit</button></div>' +
      (rows ? '<div class="tablewrap"><table><thead><tr><th></th><th>Produit</th><th>Catégorie</th><th>Prix TTC</th><th>Stock</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
            : '<div class="empty">Aucun produit pour le moment.</div>');
  }
  function eventsView(){
    var rows = S.events.map(function(e){
      var past = new Date(e.starts_at) < new Date();
      return '<tr><td><strong>' + esc(e.title) + '</strong></td><td>' + esc(fmtDate(e.starts_at)) + '</td><td>' + esc(e.place) + '</td>' +
        '<td>' + (!e.published ? '<span class="pill off">brouillon</span>' : past ? '<span class="pill">passé</span>' : '<span class="pill ok">en ligne</span>') + '</td>' +
        '<td><button class="btn ghost sm" data-edit-event="' + esc(e.id) + '">Modifier</button></td></tr>';
    }).join("");
    return '<div class="bar"><h2>Événements</h2><button class="btn" id="newEvent">+ Nouvel événement</button></div>' +
      (rows ? '<div class="tablewrap"><table><thead><tr><th>Événement</th><th>Date</th><th>Lieu</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
            : '<div class="empty">Aucun événement. Ajoutez le premier : il apparaîtra sur le site dès qu\'il sera publié.</div>') +
      '<p class="hint">Seuls les événements publiés et à venir sont affichés sur le site.</p>';
  }
  function ordersView(){
    var rows = S.orders.map(function(o){
      var items = (o.items || []).map(function(i){ return esc((i.qty || i.quantity || 1) + " × " + (i.name || i.id)); }).join("<br>");
      var sh = o.shipping || {}, a = sh.address || sh;
      var addr = [sh.name || o.customer_name, a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.country].filter(Boolean).map(esc).join("<br>");
      return '<tr><td>' + esc(fmtDate(o.created_at)) + '</td><td>' + esc(o.customer_name || "") + '<div class="hint">' + esc(o.email || "") + (o.phone ? '<br>' + esc(o.phone) : '') + '</div></td>' +
        '<td>' + items + '</td><td>' + addr + '</td><td>' + euro(o.amount_total_cents || 0) + '</td>' +
        '<td><select data-order="' + esc(o.id) + '">' + Object.keys(STATUS).map(function(k){ return '<option value="' + k + '"' + (o.status === k ? " selected" : "") + '>' + STATUS[k] + '</option>'; }).join("") + '</select></td></tr>';
    }).join("");
    return '<div class="bar"><h2>Commandes</h2></div>' +
      (rows ? '<div class="tablewrap"><table><thead><tr><th>Date</th><th>Client</th><th>Articles</th><th>Livraison</th><th>Total TTC</th><th>Statut</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
            : '<div class="empty">Aucune commande pour le moment.</div>');
  }

  function bindView(){
    var np = $("#newProduct"); if(np) np.onclick = function(){ productForm(null); };
    var ne = $("#newEvent"); if(ne) ne.onclick = function(){ eventForm(null); };
    document.querySelectorAll("[data-edit-product]").forEach(function(b){ b.onclick = function(){ productForm(S.products.find(function(p){ return p.id === b.dataset.editProduct; })); }; });
    document.querySelectorAll("[data-edit-event]").forEach(function(b){ b.onclick = function(){ eventForm(S.events.find(function(e){ return e.id === b.dataset.editEvent; })); }; });
    document.querySelectorAll("[data-order]").forEach(function(sel){
      sel.onchange = function(){
        sb.from("orders").update({status: sel.value}).eq("id", sel.dataset.order).then(function(r){
          r.error ? toast("Erreur : " + r.error.message, true) : toast("Statut mis à jour");
        });
      };
    });
  }

  /* ---------- formulaires ---------- */
  function modal(html){
    var o = document.createElement("div"); o.className = "overlay"; o.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(o);
    o.addEventListener("mousedown", function(e){ if(e.target === o) o.remove(); });
    return o;
  }
  function photoField(url){
    return '<label for="f_photo">Photo</label><input id="f_photo" type="file" accept="image/*">' +
      '<p class="hint">JPG, PNG ou WebP. L\'image est automatiquement optimisée.</p>' +
      '<img class="photo-prev" id="prev" alt="" ' + (url ? 'src="' + esc(url) + '"' : 'style="display:none"') + '>';
  }
  function bindPhotoPreview(o){
    var f = $("#f_photo", o);
    f.onchange = function(){ if(f.files[0]){ var p = $("#prev", o); p.src = URL.createObjectURL(f.files[0]); p.style.display = "block"; } };
  }

  function productForm(p){
    var isNew = !p; p = p || {name:"", id:"", price_cents:0, category:CATEGORIES[0], tag:"Nos champagnes", description:"", stock:null, active:true, sort_order:(S.products.length + 1), photo_url:null};
    var o = modal('<h2>' + (isNew ? "Nouveau produit" : "Modifier le produit") + '</h2>' +
      '<form id="pf"><label for="f_name">Nom</label><input id="f_name" required value="' + esc(p.name) + '">' +
      '<div class="grid2"><div><label for="f_price">Prix TTC (€)</label><input id="f_price" required inputmode="decimal" value="' + esc((p.price_cents / 100).toFixed(2).replace(".", ",")) + '"></div>' +
      '<div><label for="f_stock">Stock</label><input id="f_stock" inputmode="numeric" placeholder="vide = non suivi" value="' + (p.stock == null ? "" : p.stock) + '"><p class="hint">0 = affiché « Épuisé ».</p></div></div>' +
      '<div class="grid2"><div><label for="f_cat">Catégorie</label><select id="f_cat">' + CATEGORIES.map(function(c){ return '<option' + (c === p.category ? " selected" : "") + '>' + esc(c) + '</option>'; }).join("") + '</select></div>' +
      '<div><label for="f_tag">Rubrique affichée</label><input id="f_tag" value="' + esc(p.tag) + '"></div></div>' +
      '<label for="f_desc">Description</label><textarea id="f_desc">' + esc(p.description) + '</textarea><p class="hint">Une ligne vide ou un retour à la ligne = nouveau paragraphe.</p>' +
      photoField(p.photo_url) +
      '<div class="grid2"><div><label for="f_order">Ordre d\'affichage</label><input id="f_order" type="number" value="' + p.sort_order + '"></div>' +
      '<div><label for="f_id">Identifiant (adresse de la page)</label><input id="f_id" ' + (isNew ? "" : "readonly") + ' value="' + esc(p.id) + '" pattern="[a-z0-9]+(-[a-z0-9]+)*"></div></div>' +
      '<label class="check"><input type="checkbox" id="f_active"' + (p.active ? " checked" : "") + '> Visible sur le site</label>' +
      '<p class="err" id="ferr"></p>' +
      '<div class="actions"><div>' + (isNew ? "" : '<button type="button" class="btn danger" id="del">Supprimer</button>') + '</div>' +
      '<div class="right"><button type="button" class="btn ghost" id="cancel">Annuler</button><button class="btn" type="submit" id="save">Enregistrer</button></div></div></form>');
    bindPhotoPreview(o);
    var name = $("#f_name", o), id = $("#f_id", o);
    if(isNew) name.oninput = function(){ id.value = slug(name.value); };
    $("#cancel", o).onclick = function(){ o.remove(); };
    if(!isNew) $("#del", o).onclick = function(){
      if(!confirm("Supprimer définitivement « " + p.name + " » ?\nAstuce : décochez « Visible sur le site » pour simplement le masquer.")) return;
      sb.from("products").delete().eq("id", p.id).then(function(r){
        if(r.error) return toast("Erreur : " + r.error.message, true);
        o.remove(); S.dirty = true; toast("Produit supprimé"); reload();
      });
    };
    $("#pf", o).onsubmit = function(e){
      e.preventDefault();
      var err = $("#ferr", o); err.textContent = "";
      var price = parseFloat($("#f_price", o).value.replace(/\s/g, "").replace(",", "."));
      if(!isFinite(price) || price < 0){ err.textContent = "Prix invalide."; return; }
      var stockRaw = $("#f_stock", o).value.trim();
      if(stockRaw !== "" && !/^\d+$/.test(stockRaw)){ err.textContent = "Le stock doit être un nombre entier (ou vide)."; return; }
      if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id.value)){ err.textContent = "Identifiant invalide (lettres minuscules, chiffres et tirets)."; return; }
      var row = {name:name.value.trim(), price_cents:Math.round(price * 100), category:$("#f_cat", o).value, tag:$("#f_tag", o).value.trim() || $("#f_cat", o).value,
        description:$("#f_desc", o).value.trim(), stock:stockRaw === "" ? null : parseInt(stockRaw, 10), active:$("#f_active", o).checked, sort_order:parseInt($("#f_order", o).value, 10) || 0};
      var save = $("#save", o); save.disabled = true; save.textContent = "Enregistrement…";
      var file = $("#f_photo", o).files[0];
      (file ? uploadImage(file, "products", id.value) : Promise.resolve(p.photo_url)).then(function(url){
        row.photo_url = url || null;
        return isNew ? sb.from("products").insert(Object.assign({id:id.value}, row)) : sb.from("products").update(row).eq("id", p.id);
      }).then(function(r){
        if(r.error) throw r.error;
        o.remove(); S.dirty = true; toast("Produit enregistré"); reload();
      }).catch(function(ex){
        save.disabled = false; save.textContent = "Enregistrer";
        err.textContent = /duplicate key/.test(ex.message) ? "Un produit avec cet identifiant existe déjà." : "Erreur : " + ex.message;
      });
    };
  }

  function eventForm(ev){
    var isNew = !ev; ev = ev || {title:"", place:"", address:"", starts_at:null, text:"", image_url:null, published:true};
    var o = modal('<h2>' + (isNew ? "Nouvel événement" : "Modifier l'événement") + '</h2>' +
      '<form id="ef"><label for="e_title">Titre</label><input id="e_title" required value="' + esc(ev.title) + '">' +
      '<div class="grid2"><div><label for="e_date">Date et heure</label><input id="e_date" type="datetime-local" required value="' + (ev.starts_at ? toLocalInput(ev.starts_at) : "") + '"></div>' +
      '<div><label for="e_place">Lieu (ville)</label><input id="e_place" required value="' + esc(ev.place) + '" placeholder="Thulin 7350"></div></div>' +
      '<label for="e_addr">Adresse</label><input id="e_addr" value="' + esc(ev.address) + '">' +
      '<label for="e_text">Description</label><textarea id="e_text">' + esc(ev.text) + '</textarea>' +
      photoField(ev.image_url) +
      '<label class="check"><input type="checkbox" id="e_pub"' + (ev.published ? " checked" : "") + '> Publié sur le site</label>' +
      '<p class="err" id="ferr"></p>' +
      '<div class="actions"><div>' + (isNew ? "" : '<button type="button" class="btn danger" id="del">Supprimer</button>') + '</div>' +
      '<div class="right"><button type="button" class="btn ghost" id="cancel">Annuler</button><button class="btn" type="submit" id="save">Enregistrer</button></div></div></form>');
    bindPhotoPreview(o);
    $("#cancel", o).onclick = function(){ o.remove(); };
    if(!isNew) $("#del", o).onclick = function(){
      if(!confirm("Supprimer définitivement cet événement ?")) return;
      sb.from("events").delete().eq("id", ev.id).then(function(r){
        if(r.error) return toast("Erreur : " + r.error.message, true);
        o.remove(); S.dirty = true; toast("Événement supprimé"); reload();
      });
    };
    $("#ef", o).onsubmit = function(e){
      e.preventDefault();
      var err = $("#ferr", o); err.textContent = "";
      var iso = fromLocalInput($("#e_date", o).value);
      if(!iso){ err.textContent = "Date invalide."; return; }
      var row = {title:$("#e_title", o).value.trim(), starts_at:iso, place:$("#e_place", o).value.trim(), address:$("#e_addr", o).value.trim(), text:$("#e_text", o).value.trim(), published:$("#e_pub", o).checked};
      var save = $("#save", o); save.disabled = true; save.textContent = "Enregistrement…";
      var file = $("#f_photo", o).files[0];
      (file ? uploadImage(file, "events", slug(row.title) || "evenement") : Promise.resolve(ev.image_url)).then(function(url){
        row.image_url = url || null;
        return isNew ? sb.from("events").insert(row) : sb.from("events").update(row).eq("id", ev.id);
      }).then(function(r){
        if(r.error) throw r.error;
        o.remove(); S.dirty = true; toast("Événement enregistré"); reload();
      }).catch(function(ex){
        save.disabled = false; save.textContent = "Enregistrer";
        err.textContent = "Erreur : " + ex.message;
      });
    };
  }

  /* ---------- mise à jour des pages pour Google (redéploiement) ---------- */
  function redeploy(){
    var b = $("#redeploy"); b.disabled = true; b.textContent = "Envoi…";
    sb.auth.getSession().then(function(r){
      return fetch("/api/redeploy", {method:"POST", headers:{Authorization:"Bearer " + r.data.session.access_token}});
    }).then(function(res){
      if(!res.ok) throw new Error("HTTP " + res.status);
      S.dirty = false; render(); toast("Mise à jour lancée : les pages seront à jour dans 1 à 2 minutes");
    }).catch(function(ex){
      b.disabled = false; b.textContent = "Mettre à jour pour Google";
      toast("Impossible de lancer la mise à jour (" + ex.message + ")", true);
    });
  }

  start();
})();
