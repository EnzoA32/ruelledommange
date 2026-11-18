(function(){
  "use strict";

  /* ---------------- CONFIG SEO ---------------- */
  var SITE_URL = "__SITE_URL__";                    /* remplacé au build (site.config.json) */
  if(SITE_URL.indexOf("__")===0) SITE_URL = location.origin;
  var SITE_NAME = "Ruelle-Dommange";
  var SOCIAL = [];                /* URLs de vos réseaux sociaux, ex. ["https://www.instagram.com/…","https://www.facebook.com/…"] */
  var DEFAULT_OG = "/assets/og/og-default.jpg";
  var OG_BY_PHOTO = {
  "photoBullesVanille": "/assets/og/photoBullesVanille.jpg",
  "photoBlancDeBlancs": "/assets/og/photoBlancDeBlancs.jpg",
  "photoDemiBouteille": "/assets/og/photoDemiBouteille.jpg",
  "photoMagnum": "/assets/og/photoMagnum.jpg",
  "photoRatafia": "/assets/og/photoRatafia.jpg",
  "photoDemiSec": "/assets/og/photoDemiSec.jpg",
  "photoMillesime": "/assets/og/photoMillesime.jpg",
  "photoBrut": "/assets/og/photoBrut.jpg",
  "photoPinkFlower": "/assets/og/photoPinkFlower.jpg",
  "photoBullesVanilleRose": "/assets/og/photoBullesVanilleRose.jpg"
};
  var MEDIA_DIM = {"/assets/img/etiquetteMockup.07e58ec4.webp": [1100, 618], "/assets/img/giftBag.c62f390f.webp": [788, 900], "/assets/img/weddingToast.1e3b94ea.webp": [788, 900], "/assets/img/eventsBadge.3bedfbd1.webp": [700, 263], "/assets/img/photoBullesVanille.045c4c92.webp": [735, 1100], "/assets/img/photoBullesVanilleRose.6158600e.webp": [734, 1100], "/assets/img/photoBrut.8f2ba26c.webp": [733, 1100], "/assets/img/photoBlancDeBlancs.53316b12.webp": [733, 1100], "/assets/img/photoDemiSec.7e53dff6.webp": [733, 1100], "/assets/img/photoMillesime.8de023d6.webp": [733, 1100], "/assets/img/photoPinkFlower.c13de20e.webp": [600, 900], "/assets/img/photoDemiBouteille.c863b474.webp": [600, 900], "/assets/img/photoMagnum.0e0ad256.webp": [600, 900], "/assets/img/photoRatafia.626eebb0.webp": [600, 900], "/assets/img/aleksandra.f5d598e8.webp": [960, 1200], "/assets/img/crate.8e1a05c6.webp": [801, 1200], "/assets/img/kevin.9a894405.webp": [800, 1200], "/assets/img/lukas.846e4729.webp": [1200, 800], "/assets/img/sven.e3a4fa2a.webp": [1200, 900], "/assets/img/rodrigo1.ec54fb63.webp": [800, 1200], "/assets/img/rodrigo2.f5b6cedd.webp": [800, 1200], "/assets/img/bottleIllustration.c6bb231c.webp": [309, 882]};

  /* ---------------- DATA ---------------- */
  /* ---------------- CMS (Supabase) ----------------
     Produits, prix, stock et événements sont gérés par la cliente depuis /admin/ (base Supabase).
     Remplacés au build (site.config.json). Seule la clé PUBLIQUE (publishable) est ici :
     les droits d'écriture sont protégés côté Supabase (RLS), jamais par cette clé.
     Les données sont lues au build (pages pré-rendues pour Google) ET au chargement (prix et stock à jour).
     Si Supabase est injoignable, le site affiche les données par défaut codées ci-dessous. */
  var SUPABASE_URL = "__SUPABASE_URL__";
  var SUPABASE_KEY = "__SUPABASE_KEY__";
  if(SUPABASE_URL.indexOf("__")===0){ SUPABASE_URL = ""; SUPABASE_KEY = ""; }

  var DEFAULT_PRODUCTS = [
    {id:"blanc-de-blancs", photo:"photoBlancDeBlancs", name:"Blanc de blancs", accent:"blancs", price:22.90, cat:"Bouteille 75cl", tag:"Nos champagnes",
      region:"Vallée de la Marne, France",
      desc:["Ce champagne d'une finesse rare est élaboré exclusivement à partir des meilleurs crus du cépage blanc champenois, le Chardonnay.",
            "Il apporte l'élégance racée et la finesse et des arômes d'agrumes.",
            "Cru très minéral aux notes fumées qui donne rondeur et légèreté.",
            "Le blanc de blancs fera grande sensation lors d'un apéritif raffiné et sublimera la dégustation de volailles et de poissons tel un tartare de Saint-Pierre ou une truite saumonée."],
      specs:[{label:"Cépage",value:"100% Chardonnay"},{label:"Format",value:"75 cl"},{label:"Service",value:"7-8°C"}],
      notes:[
        {icon:"grapes", title:"Cépage & style", text:"Élaboré exclusivement à partir des meilleurs crus du cépage blanc champenois, le Chardonnay. Cru très minéral aux notes fumées, qui donne rondeur et légèreté."},
        {icon:"aroma", title:"Notes de dégustation", text:"Élégance racée, finesse et arômes d'agrumes."},
        {icon:"pairing", title:"Accords mets & vins", text:"Grande sensation à l'apéritif ; sublime la dégustation de volailles et de poissons, comme un tartare de Saint-Pierre ou une truite saumonée."}
      ],
      bottleColor:"#e7d9a8"},
    {id:"champagne-brut", photo:"photoBrut", name:"Champagne Brut", accent:"Brut", price:22.90, cat:"Bouteille 75cl", tag:"Nos champagnes",
      region:"Vallée de la Marne, France",
      desc:["Ce champagne de caractère allie avec harmonie les trois cépages champenois : le Chardonnay, le Pinot Noir et le Pinot Meunier.",
            "Assemblage : 20 à 25 % de Chardonnay pour l'élégance et la finesse, 25 à 30 % de Pinot Noir pour la structure et environ 50 % de Pinot Meunier pour le fruité. Plus de 20 crus entrent dans sa composition, avec 25 à 30 % de vins de réserve suivant les années.",
            "Vieillissement : 3 ans en caves centenaires taillées à même la craie, à l'abri de la lumière, pour offrir un vin à la maturité parfaite.",
            "Notes de dégustation : robe dorée, couleur or chaud presque ambré ; nez aux parfums d'épices et de beurre frais ; bouche fraîche, puissante et charpentée.",
            "Accords mets/vins : parfait à l'apéritif, il constitue aussi l'accord idéal avec de nombreux mets, notamment les viandes tendres comme un magret de canard parfumé au miel et baies sauvages.",
            "Servir frais à 7-8°C."],
      specs:[{label:"Assemblage",value:"Chardonnay · Pinot Noir · Pinot Meunier"},{label:"Crus",value:"Plus de 20 crus"},{label:"Vieillissement",value:"3 ans"},{label:"Service",value:"7-8°C"}],
      notes:[
        {icon:"grapes", title:"Élaboration", text:"Assemblage des trois cépages champenois, avec 25 à 30 % de vins de réserve suivant les années. Vieilli 3 ans en caves centenaires taillées à même la craie, à l'abri de la lumière — bien au-delà du minimum légal de 15 mois."},
        {icon:"aroma", title:"Notes de dégustation", text:"Robe dorée, couleur or chaud presque ambré. Nez aux parfums d'épices et de beurre frais. Bouche fraîche, puissante et charpentée."},
        {icon:"pairing", title:"Accords mets & vins", text:"Parfait à l'apéritif ; se marie aussi avec les viandes tendres, comme un magret de canard parfumé au miel et baies sauvages."}
      ],
      bottleColor:"#e7d9a8"},
    {id:"champagne-demi-sec", photo:"photoDemiSec", name:"Champagne Demi-sec", accent:"Demi-sec", price:22.90, cat:"Bouteille 75cl", tag:"Nos champagnes",
      region:"Vallée de la Marne, France",
      desc:["Ce champagne de caractère allie avec harmonie les trois cépages champenois : le Chardonnay, le Pinot Noir et le Pinot Meunier.",
            "Assemblage : 25 à 30 % de Chardonnay pour l'élégance et la finesse, 20 % de Pinot Noir pour la structure et environ 50 % de Pinot Meunier pour le fruité. Plus de 20 crus entrent dans sa composition, avec 30 à 35 % de vins de réserve suivant les années.",
            "Vieillissement : 3 ans en caves centenaires taillées à même la craie, à l'abri de la lumière, pour une maturité parfaite.",
            "Notes de dégustation : un or jaune lumineux à l'effervescence langoureuse ; nez de meringue et de praline ; bouche aux notes d'agrumes confits.",
            "Accords mets/vins : s'associe divinement avec de nombreux desserts, comme une crème vanillée caramélisée à la cassonade ou de succulentes pralines. Se marie aussi aisément avec un foie gras.",
            "Servir frais à 7-8°C."],
      specs:[{label:"Assemblage",value:"Chardonnay · Pinot Noir · Pinot Meunier"},{label:"Crus",value:"Plus de 20 crus"},{label:"Vieillissement",value:"3 ans"},{label:"Service",value:"7-8°C"}],
      notes:[
        {icon:"grapes", title:"Élaboration", text:"Les trois cépages champenois assemblés avec 30 à 35 % de vins de réserve suivant les années, puis vieilli 3 ans en caves centenaires taillées à même la craie."},
        {icon:"aroma", title:"Notes de dégustation", text:"Un or jaune lumineux à l'effervescence langoureuse. Nez de meringue et de praline. Bouche aux notes d'agrumes confits."},
        {icon:"pairing", title:"Accords mets & vins", text:"S'associe divinement avec de nombreux desserts, comme une crème vanillée caramélisée à la cassonade ou de succulentes pralines. Se marie aussi aisément avec un foie gras."}
      ],
      bottleColor:"#e7d9a8"},
    {id:"champagne-millesime", photo:"photoMillesime", name:"Champagne Millésime", accent:"Millésime", price:29.90, cat:"Bouteille 75cl", tag:"Nos champagnes",
      region:"Vallée de la Marne, France",
      desc:["Ce champagne met en évidence l'expression d'une année de vendange exceptionnelle. Ce vin rare invite à la découverte de nouvelles sensations.",
            "Assemblage : 45 % de Chardonnay pour l'élégance et la finesse, 55 % de Pinot Noir pour la structure. Ces cépages sont exclusivement issus de la vendange d'une même année. Près de 10 crus entrent dans sa composition, exclusivement issus des 1ers et Grands Crus champenois.",
            "Vieillissement : 7 ans, stocké à l'abri de la lumière dans des caves centenaires taillées à même la craie.",
            "Notes de dégustation : reflets dorés ; nez de pains grillés ; bouche aux saveurs d'agrumes, association rare de fraîcheur et de longueur.",
            "Accords mets/vins : champagne de début de repas, il se déguste aussi avec un veau de lait rôti, jus à l'huile de noisette et champignons des bois, ou avec un foie gras.",
            "Servir frais à 7-8°C."],
      specs:[{label:"Assemblage",value:"45% Chardonnay · 55% Pinot Noir"},{label:"Crus",value:"1ers & Grands Crus"},{label:"Vieillissement",value:"7 ans"},{label:"Service",value:"7-8°C"}],
      notes:[
        {icon:"grapes", title:"Élaboration", text:"Cépages exclusivement issus de la vendange d'une même année. Près de 10 crus entrent dans sa composition, exclusivement issus des 1ers et Grands Crus champenois. Vieilli 7 ans à l'abri de la lumière dans des caves centenaires taillées à même la craie."},
        {icon:"aroma", title:"Notes de dégustation", text:"Reflets dorés. Nez de pains grillés. Bouche aux saveurs d'agrumes, association rare de fraîcheur et de longueur."},
        {icon:"pairing", title:"Accords mets & vins", text:"Champagne de début de repas ; se déguste aussi avec un veau de lait rôti, jus à l'huile de noisette et champignons des bois, ou avec un foie gras."}
      ],
      bottleColor:"#e7d9a8"},
    {id:"champagne-pink-flower", photo:"photoPinkFlower", name:"Champagne Pink Flower", accent:"Pink Flower", price:34.50, cat:"Bouteille 75cl", tag:"Nos champagnes",
      region:"Vallée de la Marne, France",
      desc:["Ce champagne séduction, à la robe rose-framboise, est gage de tendresse et d'harmonie. Ce n'est pas un rosé brut classique : nous avons recherché un équilibre entre le brut et le demi-sec, avec une vinification en rouge à partir de pinots de plus de 40 ans, qui lui donne ses arômes de fruits rouges.",
            "Assemblage : 40 % de Chardonnay pour l'élégance et la finesse, 50 % de Pinot Noir pour la structure et la couleur, 10 % de Pinot Meunier pour le fruité. Une vingtaine de crus entrent dans sa composition, avec 20 à 25 % de vins de réserve suivant les années.",
            "Apparence : une robe d'un rose chatoyant, presque envoûtant, qui met en évidence le caractère fruité de ce vin rare et unique.",
            "Notes de dégustation : nez de fruits rouges et de fraises des bois ; bouche onctueuse et fruitée développant des arômes de rose, de miel et de cannelle.",
            "Accords mets/vins : idéal en toutes occasions à l'apéritif, il trouve aussi sa place au dessert, avec une feuillantine de fraises des bois ou un macaron aux framboises.",
            "Servir frais à 7-8°C."],
      specs:[{label:"Assemblage",value:"40% Chardonnay · 50% Pinot Noir · 10% Meunier"},{label:"Crus",value:"Environ 20 crus"},{label:"Style",value:"Entre Brut & Demi-sec"},{label:"Service",value:"7-8°C"}],
      notes:[
        {icon:"grapes", title:"Élaboration", text:"Un équilibre recherché entre le brut et le demi-sec, avec une vinification en rouge à partir de pinots de plus de 40 ans, qui lui donne ses arômes de fruits rouges. 20 à 25 % de vins de réserve suivant les années."},
        {icon:"aroma", title:"Notes de dégustation", text:"Robe rose chatoyante, presque envoûtante. Nez de fruits rouges et de fraises des bois. Bouche onctueuse et fruitée, arômes de rose, de miel et de cannelle."},
        {icon:"pairing", title:"Accords mets & vins", text:"Idéal en toutes occasions à l'apéritif ; trouve aussi sa place au dessert, avec une feuillantine de fraises des bois ou un macaron aux framboises."}
      ],
      bottleColor:"#e6b8bf"},
    {id:"bulles-de-vanille", photo:"photoBullesVanille", name:"Bulles de Vanille", accent:"Vanille", price:24.90, cat:"Bulles de Vanille", tag:"Bulles de Vanille",
      region:"Effervescent élaboré dans le Vercors",
      desc:["Une création unique au monde, née d'une envie d'innover autour du champagne : un effervescent élaboré dans le Vercors, dans lequel macère une gousse de vanille bourbon de Madagascar — un savoir-faire que nous avons fait breveter.",
            "Cépages : Muscat Blanc à petits grains 75 %, Clairette Blanche 25 %, menés en culture raisonnée.",
            "Vinification — Méthode Ancestrale : après un débourbage d'une semaine, la fermentation lente est effectuée à partir de levures indigènes sous contrôle de température. La prise de mousse en bouteille se fait à partir du sucre résiduel du raisin, sans adjonction de liqueur de tirage. L'élimination du dépôt intervient au minimum 4 mois après la mise en bouteille, sans liqueur d'expédition, avant l'ajout de la gousse de vanille.",
            "Titrage : 8,5 à 9° suivant les années. Sucre résiduel : 55 à 60 g/l, sans sucres ajoutés. À boire jeune.",
            "Conseil de dégustation : vin naturellement effervescent à la robe pâle et aux reflets argentés. À servir frais, entre amis à l'apéritif ou sur un dessert comme une tarte aux pommes ou une crème brûlée."],
      specs:[{label:"Cépages",value:"75% Muscat · 25% Clairette"},{label:"Titrage",value:"8,5 à 9°"},{label:"Sucre résiduel",value:"55-60 g/l"},{label:"Garde",value:"À boire jeune"}],
      notes:[
        {icon:"leaf", title:"Une création brevetée", text:"Un effervescent élaboré dans le Vercors — et non un champagne — dans lequel macère une gousse de vanille bourbon de Madagascar. Un savoir-faire unique au monde que nous avons fait breveter."},
        {icon:"grapes", title:"Vinification", text:"Méthode Ancestrale : après un débourbage d'une semaine, fermentation lente à partir de levures indigènes sous contrôle de température. Prise de mousse en bouteille à partir du sucre résiduel du raisin, sans liqueur de tirage ni liqueur d'expédition."},
        {icon:"aroma", title:"Conseil de dégustation", text:"Robe pâle aux reflets argentés. À servir frais, entre amis à l'apéritif ou sur un dessert comme une tarte aux pommes ou une crème brûlée."}
      ],
      bottleColor:"#f2e7c9"},
    {id:"bulles-de-vanille-rose", photo:"photoBullesVanilleRose", name:"Bulles de Vanille Rosé", accent:"Rosé", price:26.90, cat:"Bulles de Vanille", tag:"Bulles de Vanille",
      region:"Effervescent élaboré dans le Vercors",
      desc:["La version rosée de notre effervescent breveté à la vanille bourbon de Madagascar, tout en douceur et en fraîcheur.",
            "Cépages : Muscat Blanc à petits grains 85 %, Clairette Blanche 10 %, Gamay 5 %, menés en culture raisonnée.",
            "Vinification — Méthode Ancestrale : élaborée à partir d'une sélection de terroirs de marnes blanches, exposés sud-ouest, pour favoriser la vivacité plutôt que le côté muscat. Le Gamay subit une macération à froid d'une semaine et son pressurage est effectué en cours de fermentation. La fermentation lente de la totalité des jus est effectuée à partir de levures indigènes sous contrôle de température, avant l'ajout de la gousse de vanille.",
            "Titrage : 7,5 à 8° suivant les années. Sucre résiduel : 55 à 60 g/l, sans sucres ajoutés. À boire jeune.",
            "Conseil de dégustation : vin naturellement effervescent à la robe rose saumon soutenue. À servir frais, entre amis à l'apéritif ou sur un dessert comme une tarte aux fraises ou une salade de fruits."],
      specs:[{label:"Cépages",value:"85% Muscat · 10% Clairette · 5% Gamay"},{label:"Titrage",value:"7,5 à 8°"},{label:"Sucre résiduel",value:"55-60 g/l"},{label:"Garde",value:"À boire jeune"}],
      notes:[
        {icon:"leaf", title:"Une création brevetée", text:"La version rosée de notre effervescent breveté du Vercors, où macère une gousse de vanille bourbon de Madagascar."},
        {icon:"grapes", title:"Vinification", text:"Élaborée à partir de terroirs de marnes blanches exposés sud-ouest. Le Gamay subit une macération à froid d'une semaine, pressuré en cours de fermentation, pour une couleur et une vivacité subtiles."},
        {icon:"aroma", title:"Conseil de dégustation", text:"Robe rose saumon soutenue. À servir frais, entre amis à l'apéritif ou sur un dessert comme une tarte aux fraises ou une salade de fruits."}
      ],
      bottleColor:"#eccdd6"},
    {id:"coffret-2-verres", name:"Coffret + 2 verres", accent:"verres", price:12.00, cat:"Coffret", tag:"Coffret",
      desc:["Un coffret élégant associant une bouteille de votre choix à deux flûtes de dégustation.",
            "L'idée cadeau prête à offrir, pensée pour un moment à deux."],
      specs:[{label:"Contenu",value:"1 bouteille au choix + 2 flûtes"},{label:"Format",value:"75 cl"}],
      notes:[{icon:"pairing", title:"L'idée cadeau", text:"Un coffret élégant associant une bouteille de votre choix à deux flûtes de dégustation — prêt à offrir, pensé pour un moment à deux."}],
      bottleColor:"#e7d9a8"},
    {id:"demi-bouteille-brut", photo:"photoDemiBouteille", name:"Demi-bouteille Brut", accent:"Brut", price:14.50, cat:"Demi-Bouteille", tag:"Demi-Bouteille",
      desc:["Le format idéal pour une dégustation en petit comité.",
            "Même exigence et même savoir-faire que notre cuvée Brut classique, dans un format de 37,5cl."],
      specs:[{label:"Format",value:"37,5 cl"},{label:"Style",value:"Brut"}],
      notes:[{icon:"grapes", title:"Même exigence, format réduit", text:"Le format idéal pour une dégustation en petit comité, avec le même savoir-faire que notre cuvée Brut classique."}],
      bottleColor:"#e7d9a8"},
    {id:"magnum-brut", photo:"photoMagnum", name:"Magnum Brut", accent:"Magnum", price:49.90, cat:"Magnum", tag:"Magnum",
      desc:["Le format Magnum (1,5L) permet un vieillissement plus lent et harmonieux du champagne.",
            "Idéal pour marquer les grandes occasions et impressionner vos invités.",
            "Une pièce maîtresse pour votre table de fête."],
      specs:[{label:"Format",value:"1,5 L"},{label:"Style",value:"Brut"}],
      notes:[{icon:"grapes", title:"Le format des grandes occasions", text:"Le format Magnum permet un vieillissement plus lent et harmonieux du champagne — une pièce maîtresse pour votre table de fête."}],
      bottleColor:"#e7d9a8"},
    {id:"ratafia", photo:"photoRatafia", name:"Ratafia", accent:"Ratafia", price:16.50, cat:"Ratafia", tag:"Ratafia",
      desc:["Vin de liqueur traditionnel champenois, élaboré à partir de moût de raisin et d'eau-de-vie de marc.",
            "Une boisson de caractère à déguster à l'apéritif, bien frais, ou en accompagnement d'un dessert."],
      specs:[{label:"Type",value:"Vin de liqueur"},{label:"Format",value:"70 cl"},{label:"Service",value:"Frais ou en cocktail"}],
      notes:[
        {icon:"grapes", title:"Élaboration", text:"Vin de liqueur traditionnel champenois, élaboré à partir de moût de raisin et d'eau-de-vie de marc."},
        {icon:"pairing", title:"Accords & suggestions", text:"À déguster à l'apéritif nature ou en cocktail (par exemple 4 cl de ratafia + Schweppes tonic), avec jambon-melon, foie gras, fromage bleu ou en dessert. En cuisine, il sublime aussi des noix de Saint-Jacques ou des crevettes déglacées."}
      ],
      bottleColor:"#c98a3e"}
  ];

  var PRODUCTS = DEFAULT_PRODUCTS.slice();

  /* ---------------- DONNÉES SUPABASE ---------------- */
  function sbGet(path){
    return fetch(SUPABASE_URL + "/rest/v1/" + path, {headers:{apikey:SUPABASE_KEY}, cache:"no-cache"})
      .then(function(res){ if(!res.ok) throw new Error("supabase " + res.status); return res.json(); });
  }
  function escHtml(t){
    return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  /* Construit la liste des produits : la base fait foi ; les fiches détaillées codées (spécifications, notes…) sont conservées pour les produits existants */
  function applyProducts(rows){
    var base = {};
    DEFAULT_PRODUCTS.forEach(function(p){ base[p.id] = p; });
    PRODUCTS = rows.filter(function(r){ return r && r.id; }).map(function(r){
      var d = base[r.id];
      var p = d ? Object.assign({}, d) : {accent:"", region:"Champagne, France", specs:[], notes:[], bottleColor:"#e7d9a8"};
      p.id = r.id;
      p.name = r.name || r.id;
      p.price = (r.price_cents || 0) / 100;
      p.cat = r.category || "Bouteille 75cl";
      p.tag = r.tag || p.cat;
      var paras = (r.description || "").split(/\n+/).filter(Boolean);
      p.desc = paras.length ? paras : (p.desc || []);
      if(Array.isArray(r.specs) && r.specs.length) p.specs = r.specs;
      if(Array.isArray(r.notes) && r.notes.length) p.notes = r.notes;
      p.stock = (r.stock === null || r.stock === undefined) ? null : r.stock;
      if(r.photo_url){
        var key = null;
        Object.keys(MEDIA).forEach(function(k){ if(MEDIA[k] === r.photo_url) key = k; });
        if(key){ p.photo = key; p.photoUrl = null; } else { p.photoUrl = r.photo_url; p.photo = null; }
      }
      return p;
    });
  }
  function applyEvents(rows){
    var fmt = new Intl.DateTimeFormat("fr-FR", {timeZone:"Europe/Paris", day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit", hourCycle:"h23"});
    EVENTS = rows.filter(function(r){ return r && r.starts_at; }).map(function(r){
      var o = {};
      fmt.formatToParts(new Date(r.starts_at)).forEach(function(x){ o[x.type] = x.value; });
      var monthShort = o.month.length > 4 ? o.month.slice(0,3) + "." : o.month;
      return {
        title: escHtml(r.title), place: escHtml(r.place), address: escHtml(r.address || r.place), text: escHtml(r.text),
        image: r.image_url ? escHtml(r.image_url) : null,
        day: o.day, month: monthShort,
        date: o.day + " " + o.month.charAt(0).toUpperCase() + o.month.slice(1) + " " + o.year,
        time: o.hour + "h" + o.minute
      };
    });
  }

  function loadFromSupabase(){
    if(!SUPABASE_URL){ dataState = "done"; if(window.__rdResolve) window.__rdResolve(); return; }
    var nowIso = new Date().toISOString();
    Promise.all([
      sbGet("products?select=*&order=sort_order.asc").catch(function(err){ console.warn("Catalogue Supabase indisponible, données par défaut.", err); return null; }),
      sbGet("events?select=*&published=eq.true&starts_at=gte." + encodeURIComponent(nowIso) + "&order=starts_at.asc").catch(function(err){ console.warn("Événements Supabase indisponibles.", err); return null; })
    ]).then(function(res){
      var ok = false;
      if(res[0] && res[0].length){ applyProducts(res[0]); ok = true; }
      if(res[1]){ applyEvents(res[1]); ok = true; }
      var wasPending = dataState === "pending";
      dataState = "done";
      if(ok && (productsSig() !== app.getAttribute("data-sig") || app.getAttribute("data-route") !== routeSig(resolveRoute()))){
        render({keepScroll:true});
      } else if(wasPending){
        render({keepScroll:true});
      } else { setSEO(resolveRoute().route, findProduct(resolveRoute().id)); }
    }).catch(function(err){
      console.warn("Chargement des données impossible.", err);
      if(dataState === "pending"){ dataState = "done"; render({keepScroll:true}); }
    }).then(function(){
      if(window.__rdResolve) window.__rdResolve();
    });
  }

  var EVENTS = [];   /* alimenté par Supabase (table events) */

  var FAQ = [
    {q:"Où sont élaborés vos champagnes ?", a:"Nos produits sont élaborés avec passion dans le respect du savoir-faire traditionnel champenois."},
    {q:"Proposez-vous des créations originales ?", a:"Oui, notre gamme comprend également des créations uniques comme les Bulles de Vanille."},
    {q:"Peut-on commander pour des événements ?", a:"Oui, nos bouteilles peuvent accompagner mariages, anniversaires, réceptions et événements professionnels."},
    {q:"Peut-on personnaliser certaines bouteilles ?", a:"Nous proposons la personnalisation d'étiquettes pour certaines cuvées afin de rendre vos événements encore plus uniques."}
  ];

  function isVanille(p){ return /vanille/i.test((p && p.cat) || ""); }   /* Bulles de Vanille = gamme distincte, jamais mélangée aux champagnes */
  var CATEGORIES = ["Tous les produits","Bouteille 75cl","Bulles de Vanille","Coffret","Demi-Bouteille","Magnum","Ratafia","Merchandising"];

  var MEDIA = {
    etiquetteMockup: "/assets/img/etiquetteMockup.07e58ec4.webp",
    giftBag: "/assets/img/giftBag.c62f390f.webp",
    weddingToast: "/assets/img/weddingToast.1e3b94ea.webp",
    eventsBadge: "/assets/img/eventsBadge.3bedfbd1.webp",
    photoBullesVanille: "/assets/img/photoBullesVanille.045c4c92.webp",
    photoBullesVanilleRose: "/assets/img/photoBullesVanilleRose.6158600e.webp",
    photoBrut: "/assets/img/photoBrut.8f2ba26c.webp",
    photoBlancDeBlancs: "/assets/img/photoBlancDeBlancs.53316b12.webp",
    photoDemiSec: "/assets/img/photoDemiSec.7e53dff6.webp",
    photoMillesime: "/assets/img/photoMillesime.8de023d6.webp",
    photoPinkFlower: "/assets/img/photoPinkFlower.c13de20e.webp",
    photoDemiBouteille: "/assets/img/photoDemiBouteille.c863b474.webp",
    photoMagnum: "/assets/img/photoMagnum.0e0ad256.webp",
    photoRatafia: "/assets/img/photoRatafia.626eebb0.webp",
    aleksandra: "/assets/img/aleksandra.f5d598e8.webp",
    crate: "/assets/img/crate.8e1a05c6.webp",
    kevin: "/assets/img/kevin.9a894405.webp",
    lukas: "/assets/img/lukas.846e4729.webp",
    sven: "/assets/img/sven.e3a4fa2a.webp",
    rodrigo1: "/assets/img/rodrigo1.ec54fb63.webp",
    rodrigo2: "/assets/img/rodrigo2.f5b6cedd.webp",
    bottleIllustration: "/assets/img/bottleIllustration.c6bb231c.webp",
  };
  var HERO_VIDEO = "/assets/video/hero.3add0ead.mp4";

  /* ---------------- STATE (cart is per-viewer, stored locally) ---------------- */
  var cart = [];
  try{
    var saved = localStorage.getItem("rd_cart");
    if(saved) cart = JSON.parse(saved);
  }catch(e){ cart = []; }

  function saveCart(){
    try{ localStorage.setItem("rd_cart", JSON.stringify(cart)); }catch(e){}
    updateCartCount();
  }
  function updateCartCount(){
    var n = cart.reduce(function(s,i){return s+i.qty;},0);
    document.getElementById("cartCount").textContent = n;
  }
  function addToCart(id, qty){
    var pr = findProduct(id); var max = (pr && pr.stock!=null) ? pr.stock : 999;
    if(max <= 0){ showToast("Produit épuisé"); return; }
    var existing = cart.find(function(i){return i.id===id;});
    if(existing){ existing.qty = Math.min(max, existing.qty + qty); } else { cart.push({id:id, qty:Math.min(max, qty)}); }
    saveCart();
    showToast("Ajouté au panier");
  }
  function removeFromCart(id){
    cart = cart.filter(function(i){return i.id!==id;});
    saveCart();
    render();
  }
  function setQty(id, qty){
    var it = cart.find(function(i){return i.id===id;});
    if(it){ var pr = findProduct(id); it.qty = Math.max(1, (pr && pr.stock!=null) ? Math.min(pr.stock, qty) : qty); saveCart(); render({keepScroll:true}); }
  }

  var toastTimer;
  function showToast(msg){
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove("show"); }, 2200);
  }

  function euro(n){ return n.toFixed(2).replace(".", ",") + " €"; }

  /* ---------------- SVG BOTTLE ---------------- */
  function noteIcon(key){
    var icons = {
      grapes:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="2.4"/><circle cx="15" cy="8" r="2.4"/><circle cx="6" cy="13" r="2.4"/><circle cx="12" cy="13" r="2.4"/><circle cx="18" cy="13" r="2.4"/><circle cx="9" cy="18" r="2.4"/><circle cx="15" cy="18" r="2.4"/><path d="M12 3v2.5"/></svg>',
      aroma:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 3h10l-1 8a4 4 0 01-8 0z"/><path d="M12 15v6"/><path d="M8 21h8"/></svg>',
      pairing:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3v7a2 2 0 002 2 2 2 0 002-2V3M8 12v9"/><path d="M17 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v10"/></svg>',
      leaf:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 4c-9 0-16 5-16 14 9 0 16-5 16-14z"/><path d="M6 18C10 12 14 9 20 4"/></svg>'
    };
    return icons[key] || icons.grapes;
  }
  function metaIcon(key){
    var icons = {
      pin:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.5-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
      calendar:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4M16 3v4"/></svg>',
      clock:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>'
    };
    return icons[key] || "";
  }
  function bottleSVG(color){
    color = color || "#e7d9a8";
    return '<svg viewBox="0 0 120 300" xmlns="http://www.w3.org/2000/svg">'+
      '<rect x="50" y="0" width="20" height="34" rx="3" fill="#c9a227"/>'+
      '<rect x="46" y="30" width="28" height="14" rx="2" fill="#8a6d1f"/>'+
      '<path d="M46 44 L46 88 C46 96 40 100 38 112 L34 260 C34 278 44 288 60 288 C76 288 86 278 86 260 L82 112 C80 100 74 96 74 88 L74 44 Z" fill="#2f4a22" opacity="0.94"/>'+
      '<path d="M40 118 L36 260 C36 274 46 284 60 284" stroke="rgba(255,255,255,0.08)" stroke-width="3" fill="none"/>'+
      '<rect x="32" y="150" width="56" height="70" rx="2" fill="'+color+'" opacity="0.96"/>'+
      '<rect x="32" y="150" width="56" height="4" fill="#8a6d1f"/>'+
      '<rect x="32" y="216" width="56" height="4" fill="#8a6d1f"/>'+
      '<text x="60" y="178" font-family="Georgia, serif" font-size="9" fill="#2b2410" text-anchor="middle" letter-spacing="1">CHAMPAGNE</text>'+
      '<text x="60" y="200" font-family="Georgia, serif" font-style="italic" font-size="7" fill="#2b2410" text-anchor="middle">Ruelle-Dommange</text>'+
      '</svg>';
  }
  function bagSVG(){
    return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">'+
      '<rect width="200" height="150" fill="#182710"/>'+
      '<g opacity="0.9" transform="translate(60,20)">'+
      '<path d="M8 22 h64 l6 88 h-76 z" fill="#22351a"/>'+
      '<path d="M20 22 v-8 a20 14 0 0 1 40 0 v8" stroke="#d7d48f" stroke-width="3" fill="none"/>'+
      '<text x="40" y="70" font-family="Georgia, serif" font-size="8" fill="#d7d48f" text-anchor="middle">CHAMPAGNE</text>'+
      '</g></svg>';
  }
  function eventImg(e,i){ return e.image || eventPhoto(i); }
  function emptyEvents(){
    return '<div class="center" style="padding:30px 0 20px;"><p class="lede">Aucun événement n\'est programmé pour le moment. Revenez bientôt, ou contactez-nous pour organiser une dégustation.</p>'+
      '<div class="cta-row"><a href="/contact/" class="btn">Nous contacter</a> <a href="/produits/" class="btn btn-outline">Voir nos champagnes</a></div></div>';
  }
  function eventPhoto(i){
    var arr = [MEDIA.kevin, MEDIA.rodrigo1, MEDIA.rodrigo2, MEDIA.crate];
    return arr[i % arr.length];
  }
  function celebrationSVG(seed){
    var c1 = ["#3c4a2c","#2c3f1d","#233417"][seed%3];
    var c2 = ["#1c2515","#151f0e","#111a0b"][seed%3];
    return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">'+
      '<defs><linearGradient id="g'+seed+'" x1="0" y1="0" x2="1" y2="1">'+
      '<stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs>'+
      '<rect width="200" height="150" fill="url(#g'+seed+')"/>'+
      '<circle cx="'+(30+seed*20)+'" cy="40" r="2" fill="#d7d48f" opacity="0.8"/>'+
      '<circle cx="'+(150-seed*10)+'" cy="70" r="1.4" fill="#d7d48f" opacity="0.6"/>'+
      '<circle cx="'+(90+seed*8)+'" cy="110" r="1.8" fill="#d7d48f" opacity="0.7"/>'+
      '<path d="M20 120 Q100 70 180 120" stroke="rgba(215,212,143,0.35)" stroke-width="1.5" fill="none"/>'+
      '</svg>';
  }

  /* ---------------- ROUTER (History API : vraies URLs, indexables) ---------------- */
  var routes = {};
  function route(path, fn){ routes[path]=fn; }
  var app = document.getElementById("app");

  var ROUTE_TO_URL = {"/":"/","/produits":"/produits/","/bulles-de-vanille":"/bulles-de-vanille/","/mentions-legales":"/mentions-legales/","/cgv":"/cgv/","/confidentialite":"/confidentialite/","/evenements":"/evenements/","/etiquette":"/creation-etiquette/","/apropos":"/a-propos/","/contact":"/contact/","/panier":"/panier/"};
  var URL_TO_ROUTE = {};
  Object.keys(ROUTE_TO_URL).forEach(function(k){ URL_TO_ROUTE[ROUTE_TO_URL[k]] = k; });

  function normPath(){
    var p = location.pathname.replace(/index\.html$/,"");
    if(p.charAt(p.length-1)!=="/") p += "/";
    return p;
  }
  function resolveRoute(){
    var p = normPath();
    if(URL_TO_ROUTE[p]) return {route:URL_TO_ROUTE[p]};
    var m = p.match(/^\/produits\/([^\/]+)\/$/);
    if(m) return {route:"product", id:decodeURIComponent(m[1])};
    return {route:"404"};
  }
  function findProduct(id){ return PRODUCTS.find(function(x){return x.id===id;}); }
  function navActive(key){
    document.querySelectorAll("[data-nav]").forEach(function(a){
      var on = a.getAttribute("data-nav")===key;
      a.classList.toggle("active", on);
      if(on) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
    });
    var parent = document.querySelector("[data-nav-parent]");
    if(parent) parent.classList.toggle("active", key==="/produits" || key==="/bulles-de-vanille");
  }
  function routeSig(r){ return r.route==="product" ? "product:"+r.id : r.route; }
  function productsSig(){
    var s = JSON.stringify([PRODUCTS.map(function(p){return [p.id,p.name,p.price,p.cat,p.tag,p.desc,p.stock,p.photo,p.photoUrl];}), EVENTS.map(function(e){return [e.title,e.date,e.time,e.place,e.address,e.text,e.image];})]);
    var h = 5381; for(var i=0;i<s.length;i++){ h = ((h<<5)+h + s.charCodeAt(i)) | 0; }
    return String(h);
  }
  function notFoundPage(){
    return '<div class="wrap"><section class="section center">'+
      '<p class="section-kicker">Erreur 404</p>'+
      '<h1 class="eyebrow-title">Cette page <em>n\'existe pas</em></h1>'+
      '<p class="lede">La page que vous cherchez a été déplacée ou n\'existe plus. Retrouvez nos champagnes ou revenez à l\'accueil.</p>'+
      '<div class="cta-row"><a href="/produits/" class="btn">Voir nos champagnes</a> <a href="/" class="btn btn-outline">Retour à l\'accueil</a></div>'+
    '</section></div>';
  }
  var dataState = SUPABASE_URL ? "pending" : "done";

  function render(opts){
    opts = (opts && opts.constructor===Object) ? opts : {};
    var hydrate = opts.hydrate === true;
    var r = resolveRoute();
    if(!opts.keepScroll && !hydrate){ try{ window.scrollTo(0,0); }catch(e){} }
    document.getElementById("mobileMenu").classList.remove("open");
    var p = null;
    if(r.route==="product"){
      p = findProduct(r.id);
      if(!p){
        if(dataState==="pending"){          /* produit peut-être ajouté depuis l'admin : on attend le chargement */
          app.innerHTML = '<div class="wrap"><section class="section center"><p class="lede">Chargement…</p></section></div>';
          navActive("/produits"); return;
        }
        r = {route:"404"};
      }
    }
    if(r.route==="product"){
      if(!hydrate) app.innerHTML = pageProduit(p.id);
      bindProduit(p.id);
      navActive(isVanille(p) ? "/bulles-de-vanille" : "/produits");
    } else if(r.route==="404"){
      if(!hydrate) app.innerHTML = notFoundPage();
      navActive("");
    } else {
      if(!hydrate) app.innerHTML = routes[r.route]();
      navActive(r.route);
      afterRender(r.route);
    }
    if(!hydrate){
      decorateImages(app, r.route);
      app.setAttribute("data-route", routeSig(r));
      app.setAttribute("data-sig", productsSig());
      writeCatalogSnapshot();
    }
    setSEO(r.route, p);
    updateCartCount();
  }

  /* Instantané du catalogue embarqué dans chaque page pré-rendue : le site reste complet même si Supabase est injoignable */
  function writeCatalogSnapshot(){
    var el = document.getElementById("rd-catalog");
    if(!el){ el = document.createElement("script"); el.type = "application/json"; el.id = "rd-catalog"; document.body.appendChild(el); }
    el.textContent = JSON.stringify({p:PRODUCTS, e:EVENTS}).replace(/</g,"\\u003c");
  }
  function readCatalogSnapshot(){
    var el = document.getElementById("rd-catalog");
    if(!el) return;
    try{
      var snap = JSON.parse(el.textContent);
      var arr = Array.isArray(snap) ? snap : snap.p;
      if(Array.isArray(arr) && arr.length){ PRODUCTS.length = 0; arr.forEach(function(x){ PRODUCTS.push(x); }); }
      if(snap && Array.isArray(snap.e)) EVENTS = snap.e;
    }catch(e){}
  }

  function go(url){
    history.pushState({}, "", url);
    render();
  }
  /* Navigation interne sans rechargement, sur de vraies URLs (le clic-droit / ouvrir dans un onglet fonctionnent) */
  document.addEventListener("click", function(e){
    if(e.defaultPrevented || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if(!a) return;
    if(a.target && a.target!=="_self") return;
    var href = a.getAttribute("href");
    if(!href || href.charAt(0)!=="/" || href.charAt(1)==="/") return;
    if(/\.[a-z0-9]+$/i.test(href.split("?")[0].split("#")[0])) return;
    e.preventDefault();
    if(href===location.pathname){ try{ window.scrollTo(0,0); }catch(err){} return; }
    go(href);
  });
  window.addEventListener("popstate", function(){ render(); });

  /* ---------------- IMAGES : dimensions (anti-CLS) + priorité de chargement ---------------- */
  function decorateImages(root, routeKey){
    root.querySelectorAll("img").forEach(function(im){
      var src = im.getAttribute("src");
      var d = MEDIA_DIM[src];
      if(d && !im.getAttribute("width")){ im.setAttribute("width", d[0]); im.setAttribute("height", d[1]); }
      im.setAttribute("decoding","async");
    });
    var first = null;
    if(routeKey==="product"){ first = root.querySelectorAll(".pd-media img"); }
    else if(routeKey==="/produits"){ first = root.querySelectorAll(".product-card img"); }
    if(first && first.length){
      Array.prototype.slice.call(first,0,routeKey==="product"?1:4).forEach(function(im,i){
        im.setAttribute("loading","eager");
        if(i===0) im.setAttribute("fetchpriority","high");
      });
    }
  }

  /* ---------------- SEO : title, meta, Open Graph, JSON-LD (mis à jour à chaque page) ---------------- */
  var PAGE_SEO = {
    "/":          {title:"Champagne Ruelle-Dommange | Vignerons à Domptin",
                   desc:"Champagne de vignerons à Domptin, vallée de la Marne : Brut, Blanc de blancs, Millésime, Bulles de Vanille. Quatre générations de savoir-faire. Vente en ligne.", type:"WebPage"},
    "/produits":  {title:"Nos champagnes, magnum & ratafia | Ruelle-Dommange",
                   desc:"La gamme de champagnes Ruelle-Dommange : Brut, Blanc de blancs, Demi-sec, Millésime, Pink Flower, magnum et ratafia. Livraison offerte dès 100 €.", type:"CollectionPage", crumb:"Nos produits"},
    "/bulles-de-vanille": {title:"Bulles de Vanille, une création Ruelle-Dommange",
                   desc:"Découvrez les Bulles de Vanille et Bulles de Vanille Rosé : une création originale de Ruelle-Dommange à Domptin, distincte de nos champagnes.", type:"CollectionPage", crumb:"Bulles de Vanille", noindex:false},
    "/mentions-legales": {title:"Mentions légales | Ruelle-Dommange",
                   desc:"Mentions légales du site Ruelle-Dommange : éditeur, hébergeur, propriété intellectuelle, responsabilité et droit applicable.", type:"WebPage", crumb:"Mentions légales", noindex:false},
    "/cgv":       {title:"Conditions générales de vente | Ruelle-Dommange",
                   desc:"Conditions générales de vente de Ruelle-Dommange : commande, prix, paiement, livraison, droit de rétractation, garanties et médiation de la consommation.", type:"WebPage", crumb:"Conditions générales de vente", noindex:false},
    "/confidentialite": {title:"Confidentialité et cookies | Ruelle-Dommange",
                   desc:"Politique de confidentialité et de cookies de Ruelle-Dommange : données collectées, finalités, durées de conservation et exercice de vos droits (RGPD).", type:"WebPage", crumb:"Confidentialité et cookies", noindex:false},
    "/etiquette": {title:"Étiquette de champagne personnalisée | Ruelle-Dommange",
                   desc:"Personnalisez l'étiquette de votre champagne pour un mariage, un baptême, un anniversaire ou un événement d'entreprise. Une bouteille unique Ruelle-Dommange.", type:"WebPage", crumb:"Création d'étiquette"},
    "/evenements":{title:"Événements et salons de dégustation | Ruelle-Dommange",
                   desc:"Retrouvez Ruelle-Dommange lors de salons et de dégustations de vin et de champagne.", type:"WebPage", crumb:"Événements", noindex:false},
    "/apropos":   {title:"Quatre générations de vignerons à Domptin | Ruelle-Dommange",
                   desc:"Exploitation familiale à Domptin, près de Château-Thierry : trois hectares de vignes, quatre générations de vignerons, Chardonnay, Pinot Noir et Pinot Meunier.", type:"AboutPage", crumb:"À propos"},
    "/contact":   {title:"Contact et visite de l'exploitation | Ruelle-Dommange",
                   desc:"Contactez Ruelle-Dommange à Domptin (02310) : téléphone, formulaire et visite de l'exploitation sur rendez-vous. Nous répondons au plus vite.", type:"ContactPage", crumb:"Contact"},
    "/panier":    {title:"Votre panier | Ruelle-Dommange",
                   desc:"Votre panier Ruelle-Dommange.", type:"WebPage", crumb:"Panier", noindex:true},
    "404":        {title:"Page introuvable | Ruelle-Dommange",
                   desc:"Cette page n'existe pas ou a été déplacée.", type:"WebPage", noindex:true}
  };

  function absUrl(path){ return /^https?:/.test(path) ? path : SITE_URL + path; }
  function clip(s, n){
    s = String(s||"").replace(/\s+/g," ").trim();
    if(s.length<=n) return s;
    s = s.slice(0,n-1);
    s = s.slice(0, s.lastIndexOf(" ")>60 ? s.lastIndexOf(" ") : s.length);
    s = s.replace(/[\s,;:.\-–—]+$/,"");
    var stop = /\s(le|la|les|l'|un|une|des|de|du|d'|et|ou|à|au|aux|en|par|pour|avec|dans|sur|qui|que)$/i;
    while(stop.test(s)) s = s.replace(stop,"").replace(/[\s,;:.\-–—]+$/,"");
    return s + "…";
  }
  function productSEO(p){
    var title = p.name;
    if(/^Bouteille/i.test(p.cat||"") && !/champagne/i.test(title)) title = "Champagne " + title;
    if(p.cat && title.toLowerCase().indexOf(p.cat.toLowerCase())===-1) title += " – " + p.cat;
    title += " | " + SITE_NAME;
    var first = (p.desc && p.desc[0]) ? p.desc[0] : "";
    var lead = p.name + " Ruelle-Dommange à " + p.price.toFixed(2).replace(".",",") + " €. ";
    var desc = clip(lead + first, 158);
    return {title:title, desc:desc};
  }
  function productImageUrl(p){
    var src = (p.photo && MEDIA[p.photo]) ? MEDIA[p.photo] : (p.photoUrl || MEDIA.bottleIllustration);
    return absUrl(src);
  }
  function upsertMeta(attr, key, content){
    var el = document.head.querySelector('meta['+attr+'="'+key+'"]');
    if(!el){ el = document.createElement("meta"); el.setAttribute(attr,key); document.head.appendChild(el); }
    el.setAttribute("content", content);
  }
  function upsertLink(rel, href, extra){
    var sel = 'link[rel="'+rel+'"]' + (extra&&extra.id ? '#'+extra.id : '');
    var el = document.head.querySelector(sel);
    if(!href){ if(el) el.parentNode.removeChild(el); return; }
    if(!el){ el = document.createElement("link"); el.setAttribute("rel",rel); document.head.appendChild(el); }
    el.setAttribute("href", href);
    if(extra) Object.keys(extra).forEach(function(k){ el.setAttribute(k, extra[k]); });
  }
  function buildGraph(routeKey, p, canonical, seo){
    var winery = {
      "@type":"Winery", "@id":SITE_URL+"/#winery",
      "name":SITE_NAME, "alternateName":"Champagne Ruelle-Dommange",
      "url":SITE_URL+"/", "logo":absUrl("/assets/img/logo.svg"), "image":absUrl(DEFAULT_OG),
      "description":PAGE_SEO["/"].desc, "telephone":"+33682123766", "email":"info@corbillonnerie.com",
      "address":{"@type":"PostalAddress","streetAddress":"47 Rue de la Fontaine","postalCode":"02310","addressLocality":"Domptin","addressCountry":"FR"}
    };
    if(SOCIAL.length) winery.sameAs = SOCIAL;
    var site = {"@type":"WebSite","@id":SITE_URL+"/#website","url":SITE_URL+"/","name":SITE_NAME,"inLanguage":"fr-FR","publisher":{"@id":SITE_URL+"/#winery"}};
    var g = [winery, site];
    if(routeKey==="404") return g;

    var page = {"@type":(PAGE_SEO[routeKey]||PAGE_SEO["/"]).type, "@id":canonical+"#webpage", "url":canonical, "name":seo.title, "description":seo.desc, "inLanguage":"fr-FR", "isPartOf":{"@id":SITE_URL+"/#website"}, "about":{"@id":SITE_URL+"/#winery"}};
    if(routeKey==="/produits" || routeKey==="/bulles-de-vanille"){
      var fam = PRODUCTS.filter(function(x){ return isVanille(x) === (routeKey==="/bulles-de-vanille"); });
      page.mainEntity = {"@type":"ItemList","itemListElement":fam.map(function(x,i){
        return {"@type":"ListItem","position":i+1,"url":SITE_URL+"/produits/"+x.id+"/","name":x.name};
      })};
    }
    g.push(page);

    var crumbs = [{"@type":"ListItem","position":1,"name":"Accueil","item":SITE_URL+"/"}];
    if(routeKey==="product"){
      crumbs.push(isVanille(p)
        ? {"@type":"ListItem","position":2,"name":"Bulles de Vanille","item":SITE_URL+"/bulles-de-vanille/"}
        : {"@type":"ListItem","position":2,"name":"Nos champagnes","item":SITE_URL+"/produits/"});
      crumbs.push({"@type":"ListItem","position":3,"name":p.name,"item":canonical});
    } else if(routeKey!=="/" && PAGE_SEO[routeKey]){
      crumbs.push({"@type":"ListItem","position":2,"name":PAGE_SEO[routeKey].crumb,"item":canonical});
    }
    if(crumbs.length>1) g.push({"@type":"BreadcrumbList","itemListElement":crumbs});

    if(routeKey==="product"){
      g.push({
        "@type":"Product", "@id":canonical+"#product", "name":p.name,
        "description":(p.desc&&p.desc.length)? p.desc.join(" ") : (p.name+" – "+p.cat+" "+SITE_NAME),
        "sku":p.id, "category":p.cat, "image":[productImageUrl(p)],
        "brand":{"@type":"Brand","name":SITE_NAME},
        "offers":{"@type":"Offer","url":canonical,"priceCurrency":"EUR","price":p.price.toFixed(2),
                  "availability":(p.stock===0?"https://schema.org/OutOfStock":"https://schema.org/InStock"),"itemCondition":"https://schema.org/NewCondition",
                  "seller":{"@id":SITE_URL+"/#winery"}}
      });
    }
    if(routeKey==="/" || routeKey==="/contact"){
      g.push({"@type":"FAQPage","mainEntity":FAQ.map(function(f){
        return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};
      })});
    }
    return g;
  }
  function setSEO(routeKey, p){
    var seo = (routeKey==="product" && p) ? productSEO(p) : (PAGE_SEO[routeKey] || PAGE_SEO["404"]);
    var noindex = (routeKey==="product") ? false : !!(PAGE_SEO[routeKey] && PAGE_SEO[routeKey].noindex);
    if(routeKey==="/evenements" && !EVENTS.length) noindex = true;   /* page indexée seulement s'il y a de vrais événements à venir */
    var canonical = null;
    if(routeKey==="product") canonical = SITE_URL + "/produits/" + p.id + "/";
    else if(routeKey!=="404") canonical = SITE_URL + ROUTE_TO_URL[routeKey];

    document.title = seo.title;
    upsertMeta("name","description", seo.desc);
    upsertMeta("name","robots", noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    upsertLink("canonical", canonical);

    var img = DEFAULT_OG;
    if(routeKey==="product"){ img = (p.photo && OG_BY_PHOTO[p.photo]) ? OG_BY_PHOTO[p.photo] : (p.photoUrl || DEFAULT_OG); }
    upsertMeta("property","og:type", routeKey==="product" ? "product" : "website");
    upsertMeta("property","og:site_name", SITE_NAME);
    upsertMeta("property","og:locale","fr_FR");
    upsertMeta("property","og:title", seo.title);
    upsertMeta("property","og:description", seo.desc);
    upsertMeta("property","og:url", canonical || SITE_URL + "/");
    upsertMeta("property","og:image", absUrl(img));
    upsertMeta("property","og:image:width","1200");
    upsertMeta("property","og:image:height","630");
    upsertMeta("property","og:image:alt", routeKey==="product" ? productAlt(p) : "Vignoble Ruelle-Dommange, vallée de la Marne");
    upsertMeta("name","twitter:card","summary_large_image");
    upsertMeta("name","twitter:title", seo.title);
    upsertMeta("name","twitter:description", seo.desc);
    upsertMeta("name","twitter:image", absUrl(img));
    if(routeKey==="product"){
      upsertMeta("property","product:price:amount", p.price.toFixed(2));
      upsertMeta("property","product:price:currency","EUR");
    } else {
      ["product:price:amount","product:price:currency"].forEach(function(k){
        var el = document.head.querySelector('meta[property="'+k+'"]'); if(el) el.parentNode.removeChild(el);
      });
    }
    /* image LCP de l'accueil : préchargée dans le <head> pré-rendu */
    upsertLink("preload", routeKey==="/" ? absUrl(MEDIA.sven) : null, {id:"lcp-preload", "as":"image", "fetchpriority":"high"});

    var ld = document.getElementById("ld-json");
    if(!ld){ ld = document.createElement("script"); ld.type="application/ld+json"; ld.id="ld-json"; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({"@context":"https://schema.org","@graph":buildGraph(routeKey, p, canonical||SITE_URL+"/", seo)});
  }

  /* ---------------- PAGE: HOME ---------------- */
  route("/", function(){
    var featured = PRODUCTS.filter(function(x){ return !isVanille(x); }).slice(0,8);
    return ''+
    '<section class="hero">'+
      '<video class="hero-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1" poster="'+MEDIA.sven+'"><source src="'+HERO_VIDEO+'" type="video/mp4"></video>'+
      '<div class="wrap hero-inner">'+
      '<p class="kicker">RUELLE — DOMMANGE</p>'+
      '<h1>L\'authenticité <em>du champagne</em>, de génération en génération</h1>'+
      '<p class="lede">Depuis plusieurs générations, Ruelle-Dommange cultive avec passion un savoir-faire familial autour du champagne. Découvrez une gamme pensée avec exigence, authenticité et caractère afin de partager des moments de convivialité et d\'exception.</p>'+
      '<div class="cta-row"><a href="/produits/" class="btn">Découvrir la gamme</a></div>'+
    '</div></section>'+

    '<section class="section section-olive"><div class="wrap">'+
      '<div class="valueprops">'+
        '<div class="valueprop"><div class="vp-icon-circle"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c-1.5 3-4 4.5-7 4.5 0 6 3 10 7 12.5 4-2.5 7-6.5 7-12.5-3 0-5.5-1.5-7-4.5z"/><path d="M12 8v9"/></svg></div><h4>Savoir-faire familial</h4><p>Un métier transmis de père en fils depuis plusieurs générations.</p></div>'+
        '<div class="valueprop"><div class="vp-icon-circle"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L7 21l5-2.5L17 21l-1.5-8.5"/></svg></div><h4>Qualité &amp; exigence</h4><p>Des raisins sélectionnés et un travail soigné à chaque étape.</p></div>'+
        '<div class="valueprop"><div class="vp-icon-circle"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h4l-.5 8a1.5 1.5 0 01-1.5 1.4H8a1.5 1.5 0 01-1.5-1.4L6 3z"/><path d="M8 12.5V21"/><path d="M5.5 21h5"/><path d="M16 4l4 1-1 6.5a2 2 0 01-2 1.7 2 2 0 01-2-1.7L14 5z"/><path d="M17 13.2V21"/><path d="M14.5 21h5"/></svg></div><h4>Moments de partage</h4><p>Des champagnes pensés pour accompagner vos plus belles occasions.</p></div>'+
      '</div>'+
    '</div></section>'+

    '<section class="section" style="padding-top:88px;"><div class="wrap center">'+
      '<h2 class="eyebrow-title"><em>Découvrez</em> nos bouteilles</h2>'+
      '<p class="lede">Explorez notre sélection de champagnes et créations originales, élaborées avec passion afin de proposer des produits accessibles, élégants et authentiques.</p>'+
      '<div class="carousel-track" id="homeCarousel" style="text-align:left;">'+ featured.map(productCard).join("") +'</div>'+
      '<div class="carousel-arrows">'+
        '<button class="carousel-arrow" data-track="homeCarousel" data-dir="-1" aria-label="Bouteilles précédentes"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 18l-6-6 6-6"/></svg></button>'+
        '<button class="carousel-arrow" data-track="homeCarousel" data-dir="1" aria-label="Bouteilles suivantes"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg></button>'+
      '</div>'+
      '<div class="see-all-row"><a href="/produits/" class="btn btn-outline">Voir la gamme complète</a></div>'+
    '</div></section>'+

    '<section class="section" style="padding-top:0;"><div class="wrap center">'+
      '<h2 class="eyebrow-title"><em>Découvrez</em> notre gamme spéciale</h2>'+
      '<div class="feature-duo">'+
        '<div class="feature-card vanille" style="background-image:linear-gradient(180deg, rgba(10,10,4,.25), rgba(8,8,4,.86)), url(' + MEDIA.crate + ');background-size:cover;background-position:center;"><h3>Bulles de Vanille</h3><p>Une création originale née d\'un grain de folie et d\'une envie d\'innover autour du champagne. Une expérience surprenante mêlant finesse et notes gourmandes de vanille.</p><a href="/produits/bulles-de-vanille/" class="btn">Voir le produit</a></div>'+
        '<div class="feature-card rose" style="background-image:linear-gradient(180deg, rgba(10,10,4,.25), rgba(8,8,4,.86)), url(' + MEDIA.aleksandra + ');background-size:cover;background-position:center;"><h3>Bulles de Vanille Rosé</h3><p>Une version rosée tout en douceur et en fraîcheur, pensée pour offrir une dégustation originale et raffinée.</p><a href="/produits/bulles-de-vanille-rose/" class="btn">Voir le produit</a></div>'+
      '</div>'+
      '<div class="see-all-row"><a href="/bulles-de-vanille/" class="btn btn-outline">Découvrir les Bulles de Vanille</a></div>'+
    '</div></section>'+

    (EVENTS.length ?     '<section class="section" style="padding-top:0;"><div class="wrap center">'+
      '<h2 class="eyebrow-title">Venez à nos futurs <em>événements</em></h2>'+
      '<p class="lede">Retrouvez-nous lors de dégustations, salons et événements afin de découvrir notre univers, nos produits et notre passion du champagne.</p>'+
      '<div class="events-grid" style="text-align:left;">'+ EVENTS.slice(0,4).map(function(e,i){
        return '<div class="event-card"><div class="event-thumb"><img src="'+eventImg(e,i)+'" alt="'+e.title+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>'+
          '<div class="event-meta"><span>'+metaIcon("pin")+' '+e.place+'</span><span>'+metaIcon("calendar")+' '+e.date+'</span><span>'+metaIcon("clock")+' '+e.time+'</span></div>'+
          '<h4>'+e.title+'</h4><p>'+e.text+'</p>'+
          '<a href="/evenements/" class="more">En savoir plus...</a></div>';
      }).join("") +'</div>'+
    '</div></section>' : '')+

    '<section class="section section-dark"><div class="wrap">'+
      '<div class="divider-title"><h2 class="eyebrow-title"><em>Découvrez</em> notre processus</h2><span class="rule"></span></div>'+
      processGrid() +
    '</div></section>'+

    '<div class="wrap"><section class="section" style="padding-top:56px;padding-bottom:56px;">'+
      '<div class="split-feature" style="grid-template-columns:1fr;"><div class="media" style="aspect-ratio:21/7;"><img src="'+MEDIA.kevin+'" alt="Dégustation de champagne au coucher du soleil" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div></div>'+
    '</section></div>'+

    '<section class="section section-dark"><div class="wrap">'+
      '<h2 class="eyebrow-title">Les <em>questions</em> fréquentes</h2>'+
      '<div class="faq-wrap"><div></div><div class="faq-list">'+ faqList() +'</div></div>'+
    '</div></section>';
  });

  function productAlt(p){
    var a = p.name;
    if(p.cat && a.toLowerCase().indexOf(p.cat.toLowerCase())===-1) a += " – " + p.cat;
    if(a.toLowerCase().indexOf("ruelle")===-1) a += " Ruelle-Dommange";
    return a;
  }
  function productImg(p){
    if(p.photo && MEDIA[p.photo]){
      return '<img src="'+MEDIA[p.photo]+'" alt="'+productAlt(p)+'" loading="lazy">';
    }
    if(p.photoUrl){
      return '<img src="'+p.photoUrl+'" alt="'+productAlt(p)+'" loading="lazy">';
    }
    return '<img src="'+MEDIA.bottleIllustration+'" alt="'+productAlt(p)+'" loading="lazy">';
  }
  function productCard(p){
    return '<a href="/produits/'+p.id+'/" class="product-card">'+
      '<div class="product-media">'+productImg(p)+
        '<button class="wish" aria-label="Ajouter aux favoris" onclick="event.preventDefault();this.classList.toggle(\'active\')">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.1C.6 8.6 2.2 5 5.6 5c2 0 3.4 1.1 4.4 2.6C11 6.1 12.4 5 14.4 5c3.4 0 5 3.6 3.6 6.9C19.5 16.4 12 21 12 21z"/></svg>'+
        '</button>'+
      '</div>'+
      '<h4>'+p.name+'</h4><p class="price">'+euro(p.price)+'</p>'+
    '</a>';
  }

  function processGrid(){
    var steps = [
      {n:"01",t:"Le terroir",d:"Nous accordons une attention particulière à la qualité des raisins et au respect du terroir champenois."},
      {n:"02",t:"L'élaboration",d:"Chaque cuvée est élaborée avec soin afin de garantir équilibre, finesse et authenticité."},
      {n:"03",t:"Le vieillissement",d:"Le temps joue un rôle essentiel dans le développement des arômes et du caractère de nos champagnes."},
      {n:"04",t:"La dégustation",d:"Chaque bouteille est pensée pour offrir un moment de plaisir, de partage et de convivialité."}
    ];
    return '<div class="process-grid">'+steps.map(function(s){
      return '<div class="process-step"><div class="num">'+s.n+'</div><h4>'+s.t+'</h4><p>'+s.d+'</p></div>';
    }).join("")+'</div>';
  }

  function faqList(){
    return FAQ.map(function(f,i){
      return '<div class="faq-item" data-i="'+i+'">'+
        '<button class="faq-q" aria-expanded="false"><span>'+f.q+'</span><span class="chev">'+
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></span></button>'+
        '<div class="faq-a"><p style="margin:0;">'+f.a+'</p></div>'+
      '</div>';
    }).join("");
  }

  function bindFaq(){
    document.querySelectorAll(".faq-item").forEach(function(item){
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      btn.addEventListener("click", function(){
        var open = item.classList.contains("open");
        var group = item.parentElement.querySelectorAll(".faq-item");
        group.forEach(function(i){
          i.classList.remove("open");
          i.querySelector(".faq-q").setAttribute("aria-expanded","false");
          i.querySelector(".faq-a").style.maxHeight = "0px";
        });
        if(!open){
          item.classList.add("open");
          btn.setAttribute("aria-expanded","true");
          panel.style.maxHeight = panel.scrollHeight + 24 + "px";
        }
      });
    });
  }

  /* ---------------- PAGE: PRODUITS (liste) ---------------- */
  /* ---------------- PAGES LÉGALES ---------------- */
  /* Les informations de l'entreprise viennent de site.config.json > "legal" (injectées au build). Tout champ vide s'affiche en jaune « À compléter ». */
  var LEGAL = {};/*__LEGAL__*/
  var FREE_SHIPPING_FROM = 100, SHIPPING_FEE = 5.90;
  var ALCOHOL_MSG = "L'abus d'alcool est dangereux pour la santé. À consommer avec modération.";
  function lg(k, label){ var v = LEGAL[k]; return v ? escHtml(v) : '<span class="todo">[À compléter : '+label+']</span>'; }
  function legalPage(kicker, title, inner){
    return '<div class="wrap"><section class="section legal">'+
      '<p class="section-kicker">'+kicker+'</p><h1 class="eyebrow-title">'+title+'</h1>'+
      '<p class="legal-date">Dernière mise à jour : '+escHtml(LEGAL.updatedAt || "")+'</p>'+
      '<div class="legal-body">'+inner+'</div></section></div>';
  }
  function siteHost(){ return SITE_URL.replace(/^https?:\/\//,"").replace(/\/$/,""); }
  function mailLink(){ var m = LEGAL.email || "info@corbillonnerie.com"; return '<a href="mailto:'+escHtml(m)+'">'+escHtml(m)+'</a>'; }
  function identityBlock(){
    return '<ul>'+
      '<li>Dénomination : <strong>'+lg("companyName","raison sociale")+'</strong> ('+lg("legalForm","forme juridique")+'), au capital de '+lg("capital","capital social")+'</li>'+
      '<li>Siège social : '+lg("address","adresse du siège")+'</li>'+
      '<li>SIRET : '+lg("siret","n° SIRET")+' — RCS : '+lg("rcs","ville du RCS et numéro")+'</li>'+
      '<li>N° de TVA intracommunautaire : '+lg("vatNumber","n° de TVA")+'</li>'+
      (LEGAL.exciseNumber ? '<li>N° d\'accises : '+escHtml(LEGAL.exciseNumber)+'</li>' : '')+
      '<li>Téléphone : '+lg("phone","téléphone")+'</li>'+
      '<li>E-mail : '+mailLink()+'</li>'+
    '</ul>';
  }

  route("/mentions-legales", function(){
    return legalPage("Informations légales","Mentions <em>légales</em>",
      '<h2>1. Éditeur du site</h2>'+
      '<p>Le site <strong>'+siteHost()+'</strong> est édité par :</p>'+ identityBlock() +
      '<p>Directeur de la publication : '+lg("publisherName","nom du directeur de la publication")+'.</p>'+
      '<h2>2. Hébergement et prestataires techniques</h2>'+
      '<ul>'+
        '<li>Hébergement du site : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — <a href="https://vercel.com" rel="noopener" target="_blank">vercel.com</a>.</li>'+
        '<li>Base de données et stockage des images : Supabase — <a href="https://supabase.com" rel="noopener" target="_blank">supabase.com</a>.</li>'+
        '<li>Paiement en ligne : Stripe Payments Europe, Ltd. (Irlande) — <a href="https://stripe.com/fr" rel="noopener" target="_blank">stripe.com</a>.</li>'+
      '</ul>'+
      '<h2>3. Conception</h2>'+
      '<p>Conception et développement du site : Studio Onze.</p>'+
      '<h2>4. Propriété intellectuelle</h2>'+
      '<p>L\'ensemble des contenus du site (textes, photographies, vidéos, logos, marques, éléments graphiques, noms de cuvées) est la propriété de '+lg("companyName","raison sociale")+' ou de ses partenaires et est protégé par le droit d\'auteur et le droit des marques. Toute reproduction, représentation, adaptation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.</p>'+
      '<h2>5. Responsabilité</h2>'+
      '<p>Nous apportons le plus grand soin à l\'exactitude des informations publiées, mais ne pouvons garantir l\'absence d\'erreur ou d\'omission. Les photographies sont non contractuelles. Le site peut contenir des liens vers des sites tiers dont nous ne contrôlons pas le contenu ; nous déclinons toute responsabilité à leur égard. L\'accès au site peut être interrompu pour maintenance ou en cas de force majeure.</p>'+
      '<h2>6. Données personnelles et cookies</h2>'+
      '<p>Le traitement de vos données personnelles est décrit dans notre <a href="/confidentialite/">politique de confidentialité et de cookies</a>.</p>'+
      '<h2>7. Consommation d\'alcool</h2>'+
      '<div class="boxed"><p><strong>'+ALCOHOL_MSG+'</strong> La vente d\'alcool aux mineurs de moins de 18 ans est interdite. La consommation de boissons alcoolisées pendant la grossesse, même en faible quantité, peut avoir des conséquences graves sur la santé de l\'enfant.</p></div>'+
      '<h2>8. Droit applicable</h2>'+
      '<p>Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français sont compétents, sous réserve des règles protectrices applicables aux consommateurs.</p>'
    );
  });

  route("/cgv", function(){
    var zones = lg("deliveryZones","zones de livraison");
    return legalPage("Vente en ligne","Conditions générales <em>de vente</em>",
      '<p>Les présentes conditions générales de vente (« CGV ») régissent les ventes de produits conclues à distance, sur le site <strong>'+siteHost()+'</strong>, entre le vendeur et toute personne physique majeure agissant en qualité de consommateur (« le Client »).</p>'+
      '<h2>1. Vendeur</h2>'+ identityBlock() +
      '<h2>2. Produits</h2>'+
      '<p>Les produits proposés sont les champagnes, les Bulles de Vanille, le ratafia, les coffrets et accessoires présentés sur le site, dans la limite des stocks disponibles. Les caractéristiques essentielles de chaque produit (format, cépage, notes de dégustation…) figurent sur sa fiche. Les photographies sont non contractuelles. Les millésimes et habillages peuvent légèrement évoluer.</p>'+
      '<h2>3. Vente réservée aux personnes majeures</h2>'+
      '<p>Conformément à l\'article L. 3342-1 du Code de la santé publique, la vente d\'alcool aux mineurs de moins de 18 ans est interdite. En passant commande, le Client déclare avoir au moins 18 ans. La livraison peut être refusée ou la commande annulée et remboursée si la majorité du destinataire ne peut être établie. '+ALCOHOL_MSG+'</p>'+
      '<h2>4. Prix</h2>'+
      '<p>Les prix sont indiqués en euros, toutes taxes comprises (TVA à 20 % incluse), hors frais de livraison. Les frais de livraison sont de '+euro(SHIPPING_FEE)+' pour toute commande inférieure à '+euro(FREE_SHIPPING_FROM)+' et offerts à partir de '+euro(FREE_SHIPPING_FROM)+' d\'achat. Les droits d\'accises sont inclus dans le prix pour les livraisons en France. Le vendeur peut modifier ses prix à tout moment ; les produits sont facturés au prix en vigueur lors de la validation de la commande.</p>'+
      '<h2>5. Commande</h2>'+
      '<p>Le Client sélectionne ses produits, les ajoute au panier, vérifie son contenu et le prix total, renseigne ses coordonnées et son adresse de livraison, accepte les présentes CGV, puis valide sa commande en cliquant sur le bouton de paiement : cette validation vaut commande avec obligation de paiement. Un e-mail de confirmation récapitulant la commande est envoyé au Client. Le vendeur peut refuser ou annuler toute commande anormale, en cas de litige existant avec le Client ou de rupture de stock (le Client est alors remboursé).</p>'+
      '<h2>6. Paiement</h2>'+
      '<p>Le paiement s\'effectue en ligne, par carte bancaire, via la plateforme sécurisée Stripe. Le vendeur n\'a pas accès aux données complètes de votre carte. Le paiement est exigible immédiatement à la commande ; le vendeur reste propriétaire des produits jusqu\'à leur paiement intégral.</p>'+
      '<h2>7. Livraison</h2>'+
      '<p>Les produits sont livrés à l\'adresse indiquée par le Client, dans les zones suivantes : '+zones+'. Délai indicatif d\'expédition et de livraison : '+lg("deliveryDelay","délai de livraison indicatif")+' à compter de la validation du paiement. Le Client doit être majeur pour réceptionner le colis. À la livraison, le Client vérifie l\'état du colis en présence du transporteur ; en cas de casse, de manquant ou d\'avarie, il formule des <strong>réserves précises et motivées sur le bon de livraison</strong> et les confirme au transporteur par lettre recommandée dans les 3 jours ouvrés suivant la réception, avec copie au vendeur à l\'adresse '+mailLink()+'.</p>'+
      '<h2>8. Droit de rétractation</h2>'+
      '<p>Conformément aux articles L. 221-18 et suivants du Code de la consommation, le Client dispose d\'un délai de <strong>14 jours</strong> à compter de la réception des produits pour exercer son droit de rétractation, sans avoir à justifier de motif. Pour l\'exercer, il notifie sa décision de manière non équivoque par e-mail à '+mailLink()+' ou par courrier à l\'adresse du vendeur (un modèle de formulaire est disponible sur demande). Les produits doivent être retournés sans retard excessif, au plus tard 14 jours après la notification, dans leur emballage d\'origine et en parfait état, aux frais du Client. Le vendeur rembourse l\'intégralité des sommes versées, y compris les frais de livraison standard, dans un délai de 14 jours à compter de la réception de la rétractation, en utilisant le même moyen de paiement ; il peut différer le remboursement jusqu\'à la récupération des produits.</p>'+
      '<p><strong>Exceptions (art. L. 221-28 du Code de la consommation) :</strong> le droit de rétractation ne peut être exercé pour les produits personnalisés, notamment les bouteilles à étiquette personnalisée réalisées selon les spécifications du Client, ni pour les produits descellés ou entamés après la livraison, qui ne peuvent être renvoyés pour des raisons de protection de la santé.</p>'+
      '<h2>9. Garanties légales</h2>'+
      '<p>Le vendeur est tenu de la garantie légale de conformité (articles L. 217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil). Le Client peut demander la mise en conformité du bien, ou, à défaut, son remplacement, une réduction du prix ou la résolution du contrat. La garantie légale de conformité s\'applique pendant 2 ans à compter de la délivrance du bien, sans que le Client ait à prouver l\'existence du défaut pendant cette période.</p>'+
      '<h2>10. Responsabilité</h2>'+
      '<p>Le vendeur n\'est pas responsable de l\'inexécution du contrat en cas de force majeure, de fait imputable au Client ou à un tiers, ni des retards imputables au transporteur. Les produits doivent être conservés et consommés avec modération, selon les indications de leur fiche.</p>'+
      '<h2>11. Données personnelles</h2>'+
      '<p>Les données collectées lors de la commande sont traitées conformément à notre <a href="/confidentialite/">politique de confidentialité</a>.</p>'+
      '<h2>12. Propriété intellectuelle</h2>'+
      '<p>Les contenus du site sont protégés (voir les <a href="/mentions-legales/">mentions légales</a>). Aucune cession de droit n\'est consentie au Client du fait de sa commande.</p>'+
      '<h2>13. Médiation de la consommation</h2>'+
      '<p>En cas de litige, le Client s\'adresse en priorité au vendeur : '+mailLink()+'. À défaut de solution amiable, le Client peut recourir gratuitement au médiateur de la consommation suivant : <strong>'+lg("mediatorName","nom du médiateur de la consommation")+'</strong>, '+
        (LEGAL.mediatorUrl ? '<a href="'+escHtml(LEGAL.mediatorUrl)+'" rel="noopener" target="_blank">'+escHtml(LEGAL.mediatorUrl)+'</a>' : lg("mediatorUrl","site internet du médiateur"))+
        (LEGAL.mediatorAddress ? ', '+escHtml(LEGAL.mediatorAddress) : '')+'.</p>'+
      '<h2>14. Droit applicable</h2>'+
      '<p>Les présentes CGV sont soumises au droit français. Le Client consommateur bénéficie des dispositions impératives protectrices de son pays de résidence. Tout litige relève des juridictions compétentes en application des règles du Code de la consommation.</p>'
    );
  });

  route("/confidentialite", function(){
    return legalPage("Vos données","Confidentialité <em>et cookies</em>",
      '<h2>1. Responsable du traitement</h2>'+
      '<p>Le responsable du traitement de vos données personnelles est <strong>'+lg("companyName","raison sociale")+'</strong>, '+lg("address","adresse du siège")+'. Contact : '+mailLink()+'.</p>'+
      '<h2>2. Données collectées, finalités et bases légales</h2>'+
      '<ul>'+
        '<li><strong>Commande</strong> (nom, prénom, adresse de livraison et de facturation, e-mail, téléphone, contenu de la commande) : exécution du contrat de vente, livraison, facturation, service après-vente. <em>Base légale : exécution du contrat ; obligations légales comptables et fiscales.</em></li>'+
        '<li><strong>Paiement</strong> : traité directement par Stripe ; nous ne conservons pas votre numéro de carte. <em>Base légale : exécution du contrat.</em></li>'+
        '<li><strong>Formulaire de contact et demandes de personnalisation d\'étiquette</strong> (nom, e-mail, téléphone, message) : répondre à votre demande. <em>Base légale : intérêt légitime / mesures précontractuelles.</em></li>'+
        '<li><strong>Vérification de l\'âge</strong> : votre confirmation de majorité est mémorisée dans votre navigateur uniquement ; aucune donnée n\'est envoyée à nos serveurs.</li>'+
      '</ul>'+
      '<p>Nous ne faisons ni profilage, ni publicité ciblée, et ne vendons pas vos données.</p>'+
      '<h2>3. Durées de conservation</h2>'+
      '<ul>'+
        '<li>Données de commande et de facturation : 10 ans (obligations comptables), en archivage à accès restreint après la livraison.</li>'+
        '<li>Messages de contact : 3 ans à compter du dernier échange.</li>'+
      '</ul>'+
      '<h2>4. Destinataires</h2>'+
      '<p>Vos données sont accessibles aux personnes habilitées de '+lg("companyName","raison sociale")+' et à nos prestataires, uniquement pour les finalités ci-dessus : Stripe (paiement), Supabase (base de données), Vercel (hébergement), le prestataire d\'envoi d\'e-mails du site et les transporteurs (nom, adresse, téléphone pour la livraison). Certains prestataires sont situés hors de l\'Union européenne (notamment aux États-Unis) ; les transferts sont encadrés par les garanties prévues par le RGPD (clauses contractuelles types ou décision d\'adéquation).</p>'+
      '<h2>5. Vos droits</h2>'+
      '<p>Vous disposez d\'un droit d\'accès, de rectification, d\'effacement, de limitation, d\'opposition et de portabilité de vos données, ainsi que du droit de définir des directives sur leur sort après votre décès. Pour les exercer, écrivez à '+mailLink()+' en joignant, si nécessaire, un justificatif d\'identité. Vous pouvez introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" rel="noopener" target="_blank">cnil.fr</a>).</p>'+
      '<h2 id="cookies">6. Cookies et stockage local</h2>'+
      '<p>Ce site <strong>n\'utilise aucun cookie publicitaire ni outil de mesure d\'audience</strong>. Il enregistre uniquement dans votre navigateur (stockage local) :</p>'+
      '<ul>'+
        '<li><code>rd_cart</code> : le contenu de votre panier ;</li>'+
        '<li><code>rd_age_ok</code> : la confirmation que vous êtes majeur (conservée 30 jours).</li>'+
      '</ul>'+
      '<p>Ces éléments sont strictement nécessaires au service que vous demandez et ne requièrent donc pas votre consentement. Les polices de caractères sont hébergées sur notre propre site (aucune requête vers des serveurs tiers à l\'affichage). Lors du paiement, vous êtes redirigé vers Stripe, qui peut déposer des cookies nécessaires à la sécurité du paiement et à la prévention de la fraude, selon <a href="https://stripe.com/fr/privacy" rel="noopener" target="_blank">sa propre politique</a>. Si nous ajoutons un jour un outil de mesure d\'audience, cette page sera mise à jour et votre consentement sera demandé au préalable.</p>'+
      '<h2>7. Sécurité</h2>'+
      '<p>Le site est servi en HTTPS ; l\'accès aux données de commande est réservé aux administrateurs authentifiés et protégé par des règles d\'accès au niveau de la base de données.</p>'
    );
  });

  /* ---------------- VÉRIFICATION DE L'ÂGE (vente d'alcool interdite aux mineurs) ---------------- */
  var AGE_KEY = "rd_age_ok", AGE_NO_KEY = "rd_age_no", AGE_DAYS = 30;
  function ageOk(){
    try{ var t = parseInt(localStorage.getItem(AGE_KEY) || "0", 10); return !!t && (Date.now() - t) < AGE_DAYS * 864e5; }
    catch(e){ return !!window.__rdAgeSession; }
  }
  function setAgeOk(){
    try{ localStorage.setItem(AGE_KEY, String(Date.now())); }catch(e){ window.__rdAgeSession = true; }
    try{ sessionStorage.removeItem(AGE_NO_KEY); }catch(e){}
  }
  function ageRefused(){ try{ return sessionStorage.getItem(AGE_NO_KEY) === "1"; }catch(e){ return !!window.__rdAgeNo; } }
  function setAgeRefused(){ try{ sessionStorage.setItem(AGE_NO_KEY, "1"); }catch(e){ window.__rdAgeNo = true; } }
  function ageGate(){
    if(/jsdom/i.test(navigator.userAgent) || ageOk()) return;      /* pas de fenêtre dans les pages pré-rendues */
    var blocks = document.querySelectorAll("header.site-header, main, footer");
    var o = document.createElement("div");
    o.className = "age-gate"; o.id = "ageGate";
    o.setAttribute("role","dialog"); o.setAttribute("aria-modal","true"); o.setAttribute("aria-labelledby","ageTitle");
    document.documentElement.classList.add("age-lock");
    blocks.forEach(function(b){ b.setAttribute("inert",""); b.setAttribute("aria-hidden","true"); });
    document.body.appendChild(o);
    function release(){
      o.remove(); document.documentElement.classList.remove("age-lock");
      blocks.forEach(function(b){ b.removeAttribute("inert"); b.removeAttribute("aria-hidden"); });
    }
    function showQuestion(){
      o.innerHTML = '<div class="age-box">'+
        '<p class="kicker">RUELLE — DOMMANGE</p>'+
        '<h2 id="ageTitle">Avez-vous 18 ans ou plus ?</h2>'+
        '<p>Ce site propose la vente de boissons alcoolisées, réservée aux personnes majeures. Merci de confirmer votre âge pour accéder au site.</p>'+
        '<div class="age-actions"><button type="button" class="btn" id="ageYes">Oui, j\'ai 18 ans ou plus</button>'+
        '<button type="button" class="btn btn-outline" id="ageNo">Non, j\'ai moins de 18 ans</button></div>'+
        '<p class="age-legal">'+ALCOHOL_MSG+' La vente d\'alcool aux mineurs est interdite.</p></div>';
      document.getElementById("ageYes").addEventListener("click", function(){ setAgeOk(); release(); });
      document.getElementById("ageNo").addEventListener("click", function(){ setAgeRefused(); showRefused(); });
      document.getElementById("ageYes").focus();
    }
    function showRefused(){
      o.innerHTML = '<div class="age-box">'+
        '<p class="kicker">RUELLE — DOMMANGE</p>'+
        '<h2 id="ageTitle" tabindex="-1">Accès réservé aux personnes majeures</h2>'+
        '<p>Vous devez avoir 18 ans ou plus pour consulter ce site. La vente et la consommation d\'alcool sont interdites aux mineurs.</p>'+
        '<p class="age-legal">'+ALCOHOL_MSG+'</p></div>';
      document.getElementById("ageTitle").focus();
    }
    o.addEventListener("keydown", function(e){                      /* le focus reste dans la fenêtre */
      if(e.key !== "Tab") return;
      var f = o.querySelectorAll("button"); if(!f.length){ e.preventDefault(); return; }
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
    ageRefused() ? showRefused() : showQuestion();
  }

  var currentFilter = "Tous les produits";
  var CHAMPAGNE_CATEGORIES = CATEGORIES.filter(function(c){ return c !== "Bulles de Vanille"; });
  var SORT_SELECT = '<select class="sort-select" id="sortSelect">'+
      '<option value="default">Trier par</option>'+
      '<option value="price-asc">Prix croissant</option>'+
      '<option value="price-desc">Prix décroissant</option>'+
      '<option value="name">Nom (A-Z)</option>'+
    '</select>';
  route("/produits", function(){
    return '<div class="wrap">'+
      '<section style="padding-top:44px;">'+
        '<div class="remark-box">Remarque : la livraison est offerte dès '+FREE_SHIPPING_FROM+'€ d\'achat sur l\'ensemble de notre gamme de champagnes.</div>'+
      '</section>'+
      '<section class="section center" style="padding-bottom:0;">'+
        '<h1 class="eyebrow-title"><em>Découvrez</em> nos champagnes</h1>'+
        '<p class="lede">Viticulteur de champagne de père en fils, nous vous offrons une gamme de produits de qualité à des prix défiant toute concurrence.</p>'+
      '</section>'+
      '<section class="section" style="padding-top:0;">'+
        '<div class="filter-row">'+
          '<div class="filter-tabs" id="filterTabs">'+ CHAMPAGNE_CATEGORIES.map(function(c){
            return '<button data-cat="'+c+'" class="'+(c===currentFilter?"active":"")+'">'+c+'</button>';
          }).join("") +'</div>'+
          SORT_SELECT+
        '</div>'+
        '<div class="grid-products" id="productsGrid" data-family="champagne"></div>'+
      '</section>'+
      '<section class="section center" style="padding-top:0;">'+
        '<div class="remark-box" style="text-align:center;">Notre création à part : les <strong>Bulles de Vanille</strong>, une gamme distincte de nos champagnes. '+
          '<a href="/bulles-de-vanille/" class="btn btn-outline" style="margin-left:12px;">Découvrir les Bulles de Vanille</a></div>'+
      '</section>'+
    '</div>';
  });

  route("/bulles-de-vanille", function(){
    return '<div class="wrap">'+
      '<section style="padding-top:44px;">'+
        '<div class="remark-box">Remarque : la livraison est offerte dès '+FREE_SHIPPING_FROM+'€ d\'achat.</div>'+
      '</section>'+
      '<section class="section center" style="padding-bottom:0;">'+
        '<h1 class="eyebrow-title"><em>Nos</em> Bulles de Vanille</h1>'+
        '<p class="lede">Une création originale née d\'un grain de folie et d\'une envie d\'innover. Les Bulles de Vanille forment une gamme à part, distincte de nos champagnes : une expérience surprenante mêlant finesse et notes gourmandes de vanille.</p>'+
      '</section>'+
      '<section class="section" style="padding-top:0;">'+
        '<div class="filter-row" style="justify-content:flex-end;">'+ SORT_SELECT +'</div>'+
        '<div class="grid-products" id="productsGrid" data-family="vanille"></div>'+
      '</section>'+
      '<section class="section center" style="padding-top:0;">'+
        '<div class="remark-box" style="text-align:center;">Vous cherchez nos champagnes ? '+
          '<a href="/produits/" class="btn btn-outline" style="margin-left:12px;">Voir nos champagnes</a></div>'+
      '</section>'+
    '</div>';
  });

  function renderProductsGrid(){
    var grid = document.getElementById("productsGrid");
    if(!grid) return;
    var vanille = grid.getAttribute("data-family") === "vanille";
    var list = PRODUCTS.filter(function(p){
      if(isVanille(p) !== vanille) return false;          /* les deux gammes ne sont jamais mélangées */
      return vanille || currentFilter==="Tous les produits" || p.cat===currentFilter;
    });
    var sortVal = document.getElementById("sortSelect") ? document.getElementById("sortSelect").value : "default";
    if(sortVal==="price-asc") list = list.slice().sort(function(a,b){return a.price-b.price;});
    if(sortVal==="price-desc") list = list.slice().sort(function(a,b){return b.price-a.price;});
    if(sortVal==="name") list = list.slice().sort(function(a,b){return a.name.localeCompare(b.name);});
    grid.innerHTML = list.length ? list.map(productCard).join("") : '<p style="color:var(--ink-soft);grid-column:1/-1;">Aucun produit dans cette catégorie pour le moment.</p>';
  }

  function bindProduitsPage(){
    document.querySelectorAll("#filterTabs button").forEach(function(btn){
      btn.addEventListener("click", function(){
        currentFilter = btn.getAttribute("data-cat");
        document.querySelectorAll("#filterTabs button").forEach(function(b){b.classList.remove("active");});
        btn.classList.add("active");
        renderProductsGrid();
      });
    });
    var sortSel = document.getElementById("sortSelect");
    if(sortSel) sortSel.addEventListener("change", renderProductsGrid);
    renderProductsGrid();
  }

  /* ---------------- PAGE: FICHE PRODUIT ---------------- */
  function titleHTML(p){
    if(!p.accent) return p.name;
    var i = p.name.lastIndexOf(p.accent);
    if(i===-1) return p.name;
    return p.name.slice(0,i) + '<span class="accent">' + p.accent + '</span>' + p.name.slice(i+p.accent.length);
  }
  function pageProduit(id){
    var p = PRODUCTS.find(function(x){return x.id===id;}) || PRODUCTS[0];
    var others = PRODUCTS.filter(function(x){return x.id!==p.id && isVanille(x)===isVanille(p);}).slice(0,4);
    var specsHTML = p.specs ? '<div class="pd-specs">'+ p.specs.map(function(s){
        return '<div class="pd-spec"><div class="label">'+s.label+'</div><div class="value">'+s.value+'</div></div>';
      }).join("") +'</div>' : '';
    var notesHTML = p.notes ?
      '<div class="pd-notes">'+ p.notes.map(function(n){
        return '<div class="pd-note"><div class="ic">'+noteIcon(n.icon)+'</div><div><h5>'+n.title+'</h5><p>'+n.text+'</p></div></div>';
      }).join("") +'</div>' :
      '<div class="pd-desc">'+ p.desc.map(function(d){return "<p>"+d+"</p>";}).join("") +'</div>';
    return '<div class="wrap">'+
      '<section style="padding-top:44px;">'+
        '<div class="pd-grid">'+
          '<div class="pd-media">'+productImg(p)+
            '<button class="wish" style="top:16px;right:16px;" aria-label="Ajouter aux favoris" onclick="this.classList.toggle(\'active\')">'+
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.1C.6 8.6 2.2 5 5.6 5c2 0 3.4 1.1 4.4 2.6C11 6.1 12.4 5 14.4 5c3.4 0 5 3.6 3.6 6.9C19.5 16.4 12 21 12 21z"/></svg>'+
            '</button>'+
          '</div>'+
          '<div>'+
            '<p class="pd-kicker">'+p.tag+ (p.region ? ' — '+p.region : '') +'</p>'+
            '<h1 class="pd-title">'+titleHTML(p)+'</h1>'+
            '<p class="pd-price">'+euro(p.price)+'</p>'+
            specsHTML +
            notesHTML +
            '<div class="qty-row">'+
              '<span class="qty-label">Quantité :</span>'+
              '<div class="stepper">'+
                '<button id="qtyMinus" aria-label="Diminuer">−</button>'+
                '<span id="qtyVal">1</span>'+
                '<button id="qtyPlus" aria-label="Augmenter">+</button>'+
              '</div>'+
              (p.stock===0 ? '<button class="btn" id="addToCartBtn" disabled style="opacity:.5;cursor:not-allowed;">Épuisé</button>' : '<button class="btn" id="addToCartBtn">Ajouter au panier</button>')+
            '</div>'+
            '<p class="added-msg" id="addedMsg">Ajouté à votre panier avec succès.</p>'+
          '</div>'+
        '</div>'+
      '</section>'+

      '<section class="section section-dark" style="margin-top:70px;border-radius:2px;">'+
        '<div class="divider-title" style="padding:0 40px;"><h2 class="eyebrow-title"><em>Découvrez</em> notre processus</h2><span class="rule"></span></div>'+
        '<div style="padding:0 40px;">'+ processGrid() +'</div>'+
      '</section>'+

      '<section class="section">'+
        '<h2 class="eyebrow-title"><em>Nos autres</em> '+(isVanille(p) ? "Bulles de Vanille" : "bouteilles")+'</h2>'+
        '<div class="grid-products">'+ others.map(productCard).join("") +'</div>'+
      '</section>'+
    '</div>';
  }

  function bindProduit(id){
    var qty = 1;
    var qtyVal = document.getElementById("qtyVal");
    document.getElementById("qtyMinus").addEventListener("click", function(){
      qty = Math.max(1, qty-1); qtyVal.textContent = qty;
    });
    document.getElementById("qtyPlus").addEventListener("click", function(){
      var pr = findProduct(id); var max = (pr && pr.stock!=null) ? Math.max(1, pr.stock) : 99;
      qty = Math.min(max, qty+1); qtyVal.textContent = qty;
    });
    document.getElementById("addToCartBtn").addEventListener("click", function(){
      addToCart(id, qty);
      var msg = document.getElementById("addedMsg");
      msg.classList.add("show");
      setTimeout(function(){ msg.classList.remove("show"); }, 2400);
    });
  }

  /* ---------------- PAGE: EVENEMENTS ---------------- */
  route("/evenements", function(){
    return '<div class="wrap">'+
      '<section class="section center">'+
        '<h1 class="eyebrow-title"><em>Venez</em> à nos futurs événements</h1>'+
        '<p class="lede">Viticulteur de champagne de père en fils, nous vous offrons une gamme de produits de qualité à des prix défiant toute concurrence.</p>'+
      '</section>'+
      '<section style="padding-bottom:70px;">'+
        (EVENTS.length ?         EVENTS.map(function(e,i){
          return '<div class="event-row">'+
            '<div class="date-badge"><div class="d">'+e.day+'</div><div class="m">'+e.month+'</div></div>'+
            '<div><div class="event-meta"><span>'+metaIcon("pin")+' '+e.place+'</span><span>'+metaIcon("calendar")+' '+e.date+'</span><span>'+metaIcon("clock")+' '+e.time+'</span></div>'+
              '<h4 style="font-size:1.3rem;">'+e.title+'</h4>'+
              '<p style="margin-bottom:6px;">'+e.address+'</p>'+
              '<p>'+e.text+' <a href="/contact/" class="more">En savoir plus...</a></p>'+
              '<a class="btn" style="margin-top:14px;display:inline-block;" href="/contact/">Nous contacter</a>'+
            '</div>'+
            '<div class="er-media"><img src="'+eventImg(e,i)+'" alt="'+e.title+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>'+
          '</div>';
        }).join("") : emptyEvents())+
      '</section>'+
    '</div>';
  });

  /* ---------------- PAGE: ETIQUETTE ---------------- */
  route("/etiquette", function(){
    return ''+
    '<section class="hero" style="min-height:56vh;background-image:url(' + MEDIA.lukas + ');background-size:cover;background-position:center;"><div class="wrap hero-inner">'+
      '<h1>Personnalisez <em>votre étiquette</em> !</h1>'+
      '<p class="lede">Chez Ruelle-Dommange, créez une bouteille qui vous ressemble. Mariage, baptême, anniversaire, communion, naissance ou événement d\'entreprise : personnalisez votre étiquette afin d\'offrir à vos invités un souvenir unique et intemporel.</p>'+
      '<div class="cta-row"><a href="/contact/" class="btn">Créez votre étiquette</a></div>'+
    '</div></section>'+

    '<section class="section section-dark"><div class="wrap">'+
      '<h2 class="eyebrow-title"><em>Comment</em> s\'y prendre ?</h2>'+
      '<div class="process-grid">'+
        [["01","Choisissez votre événement","Sélectionnez l'occasion que vous souhaitez célébrer : mariage, baptême, anniversaire, baby shower, fête privée ou événement professionnel."],
         ["02","Imaginez votre design","Ajoutez vos prénoms, une date, un message ou même une photo afin de créer une étiquette entièrement personnalisée."],
         ["03","Validez votre création","Une fois votre projet finalisé, nous préparons votre maquette avec soin avant impression."],
         ["04","Recevez vos bouteilles","Vos bouteilles personnalisées sont ensuite préparées avec attention et prêtes à accompagner vos plus beaux moments."]
        ].map(function(s){return '<div class="process-step"><div class="num">'+s[0]+'</div><h4>'+s[1]+'</h4><p>'+s[2]+'</p></div>';}).join("")+
      '</div>'+
    '</div></section>'+

    '<div class="wrap"><section class="section">'+
      '<div class="etq-mock"><img src="'+MEDIA.etiquetteMockup+'" alt="Personnalisation d\'étiquette de champagne Ruelle-Dommange" loading="lazy"></div>'+
    '</section></div>'+

    '<div class="wrap"><section class="section" style="padding-top:0;">'+
      '<div class="split-feature">'+
        '<div class="media"><img src="'+MEDIA.giftBag+'" alt="Sac cadeau Champagne Ruelle-Dommange" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>'+
        '<div><h3>Le cadeau personnalisé qui fait la différence</h3>'+
          '<p>Offrir une bouteille personnalisée, c\'est offrir bien plus qu\'un champagne : c\'est immortaliser un moment, une rencontre ou une émotion.</p>'+
          '<p>Une idée cadeau originale et raffinée pour célébrer une naissance, remercier un proche ou marquer une occasion particulière avec élégance.</p>'+
          '<a href="/contact/" class="btn">Créez votre étiquette</a>'+
        '</div>'+
      '</div>'+
    '</section></div>'+

    '<div class="wrap"><section class="section" style="padding-top:0;">'+
      '<div class="split-feature reverse">'+
        '<div class="media"><img src="'+MEDIA.weddingToast+'" alt="Toast au champagne lors d\'un mariage" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>'+
        '<div><h3>Une bouteille unique pour une journée inoubliable</h3>'+
          '<p>Transformez une bouteille en véritable souvenir de votre événement. Grâce à nos étiquettes personnalisées, offrez à vos invités une attention élégante et originale qui marquera les esprits bien après la célébration.</p>'+
          '<p>Mariages, baptêmes, anniversaires ou fêtes privées : chaque bouteille devient une pièce unique imaginée spécialement pour vous.</p>'+
          '<a href="/contact/" class="btn">Créez votre étiquette</a>'+
        '</div>'+
      '</div>'+
    '</section></div>'+

    '<div class="wrap"><section class="section center" style="padding-top:0;">'+
      '<div class="events-badge"><img src="'+MEDIA.eventsBadge+'" alt="Pour tous vos événements" loading="lazy"></div>'+
      '<h2 class="eyebrow-title"><em>Créez</em> pour vos événements</h2>'+
      '<p class="lede">Chaque événement mérite une attention particulière. Chez Ruelle-Dommange, nous vous aidons à concevoir des bouteilles personnalisées qui reflètent votre histoire et rendent chaque moment encore plus mémorable.</p>'+
      '<div class="three-panels">'+
        '<div class="panel" style="background-image:url('+MEDIA.lukas+');background-size:cover;background-position:center;"></div>'+
        '<div class="panel" style="background-image:url('+MEDIA.sven+');background-size:cover;background-position:center;"></div>'+
        '<div class="panel" style="background-image:url('+MEDIA.kevin+');background-size:cover;background-position:center;"></div>'+
      '</div>'+
    '</section></div>';
  });

  /* ---------------- PAGE: A PROPOS (simple, non fourni en PDF) ---------------- */
  route("/apropos", function(){
    return ''+
    '<section class="hero" style="min-height:64vh;background-image:url(' + MEDIA.sven + ');background-size:cover;background-position:center;"><div class="wrap hero-inner">'+
      '<p class="kicker">RUELLE-DOMMANGE</p>'+
      '<h1>Quatre générations <em>de vignerons</em></h1>'+
      '<p class="lede">Nichés au bout de la vallée de la Marne, nous cultivons la même vigne depuis quatre générations, avec la même exigence.</p>'+
      '<div class="cta-row"><a href="/produits/" class="btn">Découvrir nos champagnes</a></div>'+
    '</div></section>'+

    '<div class="wrap"><section class="section">'+
      '<div class="about-intro">'+
        '<div><p class="section-kicker">La Maison</p><h2 class="eyebrow-title">Une histoire <em>de famille</em></h2></div>'+
        '<div><p class="lede">Nichée à Domptin, au bout de la vallée de la Marne, à deux pas de Château-Thierry, notre exploitation familiale cultive trois hectares de vignes depuis quatre générations. Ici, chaque cépage — Chardonnay, Pinot Noir, Pinot Meunier — est vinifié avec la même exigence, dans le respect du savoir-faire traditionnel champenois.</p>'+
        '<div class="cta-row" style="margin-top:22px;"><a href="/contact/" class="btn btn-outline">Nous rendre visite</a></div></div>'+
      '</div>'+
      '<div class="about-collage">'+
        '<div class="ph small"><img src="'+MEDIA.crate+'" alt="Dégustation en famille à Domptin" loading="lazy"></div>'+
        '<div class="ph big"><img src="'+MEDIA.lukas+'" alt="Vignoble de Ruelle-Dommange dans la vallée de la Marne" loading="lazy"></div>'+
      '</div>'+
    '</section></div>'+

    '<div class="wrap"><section class="section">'+
      '<div class="about-quote">'+
        '<div class="ph"><img src="'+MEDIA.aleksandra+'" alt="Moment de partage en famille autour du champagne" loading="lazy"></div>'+
        '<div><blockquote>« La vigne, on la travaille de père en fils. Chaque bouteille raconte cette histoire de famille et de patience. »</blockquote><cite>— Hervé &amp; Christine, Ruelle-Dommange</cite></div>'+
      '</div>'+
    '</section></div>'+

    '<div class="wrap"><section class="section center">'+
      '<p class="section-kicker">Nos cuvées</p>'+
      '<h2 class="eyebrow-title">Découvrez nos <span class="u-accent">champagnes</span></h2>'+
      '<p class="lede">Minéralité, fraîcheur et caractère : chacune de nos cuvées exprime un équilibre précis entre les trois cépages champenois.</p>'+
      carouselHTML("aboutCarousel", PRODUCTS.filter(function(x){ return !isVanille(x); }).slice(0,8), "text-align:left;margin-top:40px;justify-content:center;") +
      '<div class="see-all-row"><a href="/produits/" class="btn btn-outline">Voir la gamme complète</a></div>'+
    '</section></div>'+

    '<div style="padding:20px 0;"><div class="about-banner">'+
      '<img src="'+MEDIA.sven+'" alt="Terroir champenois au lever du soleil" loading="lazy">'+
      '<div class="wrap"><div class="content">'+
        '<h3>En harmonie avec le <em>terroir</em></h3>'+
        '<p>Nos vignes sont menées en culture raisonnée, dans le respect du terroir champenois et de son sol crayeux, pour préserver l\'authenticité et le caractère de chaque cuvée.</p>'+
        '<a href="/creation-etiquette/" class="btn">Créez votre étiquette</a>'+
      '</div></div>'+
    '</div></div>'+

    '<div class="wrap"><section class="section">'+
      '<p class="section-kicker">Infos pratiques</p>'+
      '<h2 class="eyebrow-title">Venez <em>nous rencontrer</em></h2>'+
      '<div class="about-practical">'+
        '<div class="item"><h5>Visite sur rendez-vous</h5><p>Nous vous accueillons à Domptin pour découvrir l\'exploitation et le pressoir, sur simple rendez-vous.</p></div>'+
        '<div class="item"><h5>Vente directe & en ligne</h5><p>Nos champagnes se commandent directement à la maison sur rendez-vous, ou sur ce site.</p></div>'+
      '</div>'+
      '<div class="cta-row" style="margin-top:30px;"><a href="/contact/" class="btn">Nous contacter</a></div>'+
    '</section></div>';
  });

  /* ---------------- PAGE: CONTACT ---------------- */
  route("/contact", function(){
    return '<div class="wrap">'+
      '<div class="contact-hero" style="background-image:linear-gradient(180deg, rgba(9,14,6,.5), rgba(9,14,6,.85)), url(' + MEDIA.sven + ');background-size:cover;background-position:center;"><div><h1><em>Besoin d\'infos ?</em> Contactez-nous</h1>'+
        '<p>Nous restons disponible pour toutes éventuelles questions. Pour nous contacter, remplissez ce formulaire de contact et nous vous y répondrons le plus vite possible.</p></div></div>'+

      '<form class="form-grid" id="contactForm">'+
        '<div class="field"><label for="fPrenom">Prénom</label><input id="fPrenom" required></div>'+
        '<div class="field"><label for="fNom">Nom</label><input id="fNom" required></div>'+
        '<div class="field"><label for="fEmail">E-mail</label><input id="fEmail" type="email" required></div>'+
        '<div class="field"><label for="fTel">N° de tél. (facultatif)</label><input id="fTel" type="tel"></div>'+
        '<div class="field full"><label for="fSujet">Sujet / Objet</label><input id="fSujet"></div>'+
        '<div class="field full"><label for="fMsg">Message</label><textarea id="fMsg" rows="5" required></textarea></div>'+
        '<p class="form-note-legal" style="grid-column:1/-1;font-size:.8rem;color:var(--ink-soft);margin:0;">Les informations saisies servent uniquement à répondre à votre demande (voir notre <a href="/confidentialite/" style="text-decoration:underline;">politique de confidentialité</a>).</p>'+
        '<div class="form-submit-row"><button type="submit" class="btn">Envoyez le message</button></div>'+
        '<p class="form-note" id="formNote">Merci, votre message a bien été envoyé ! Nous vous répondrons rapidement.</p>'+
      '</form>'+
    '</div>'+

    '<section class="section section-dark"><div class="wrap">'+
      '<h2 class="eyebrow-title">Les <em>questions</em> fréquentes</h2>'+
      '<div class="faq-wrap"><div></div><div class="faq-list">'+ faqList() +'</div></div>'+
    '</div></section>'+

    '<section class="section section-olive"><div class="wrap center other-needs">'+
      '<h2 class="eyebrow-title"><em>Vous avez</em> d\'autres besoins ?</h2>'+
      '<p class="lede">N\'hésitez pas à nous contacter directement par téléphone ou à venir nous rendre visite, nous serons ravis de vous accueillir.</p>'+
      '<div class="oc-grid">'+
        '<div class="oc-card"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 3a2 2 0 01-.4 2.1L8 10.3a16 16 0 006 6l1.5-1.5a2 2 0 012.1-.4c1 .4 2 .6 3 .7a2 2 0 011.7 2z"/></svg></div>'+
          '<h4>Contactez-nous</h4><p><a href="mailto:info@corbillonnerie.com">info@corbillonnerie.com</a><br><a href="tel:+33682123766">+33 6 82 12 37 66</a> (Hervé)<br><a href="tel:+33781176739">+33 7 81 17 67 39</a> (Christine)</p></div>'+
        '<div class="oc-card"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>'+
          '<h4>Retrouvez-nous</h4><address style="font-style:normal;margin:0;">47 Rue de la Fontaine<br>02310 Domptin, France</address></div>'+
      '</div>'+
    '</div></section>';
  });

  function bindContact(){
    var form = document.getElementById("contactForm");
    if(!form) return;
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      document.getElementById("formNote").classList.add("show");
      form.reset();
    });
  }

  /* ---------------- PAGE: PANIER ---------------- */
  route("/panier", function(){
    if(cart.length===0){
      return '<div class="wrap"><section class="section">'+
        '<h1 class="eyebrow-title">Panier <em>d\'achat</em></h1>'+
        '<div class="empty-cart"><p>Votre panier est actuellement vide.</p><a href="/produits/" class="btn" style="margin-top:14px;">Découvrir nos produits</a></div>'+
      '</section></div>';
    }
    var rows = cart.map(function(item){
      var p = PRODUCTS.find(function(x){return x.id===item.id;});
      if(!p) return "";
      return '<tr data-id="'+p.id+'">'+
        '<td><div class="ci-name">'+p.name+'</div><div class="ci-cat">'+p.tag+'</div></td>'+
        '<td><div class="stepper"><button class="row-minus" aria-label="Diminuer">−</button><span>'+item.qty+'</span><button class="row-plus" aria-label="Augmenter">+</button></div></td>'+
        '<td>'+euro(p.price*item.qty)+'</td>'+
        '<td><button class="remove-btn" aria-label="Retirer du panier">×</button></td>'+
      '</tr>';
    }).join("");
    var subtotal = cart.reduce(function(s,item){
      var p = PRODUCTS.find(function(x){return x.id===item.id;});
      return s + (p ? p.price*item.qty : 0);
    },0);
    var shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    var total = subtotal+shipping;              /* prix affichés TTC */
    var tva = total*20/120;                      /* TVA 20 % incluse */
    return '<div class="wrap"><section class="section">'+
      '<h1 class="eyebrow-title">Panier <em>d\'achat</em></h1>'+
      '<div class="cart-grid">'+
        '<table class="cart-table"><thead><tr><th>Articles</th><th>Quantité</th><th>Total</th><th>Action</th></tr></thead>'+
        '<tbody id="cartRows">'+rows+'</tbody></table>'+
        '<div class="summary-box">'+
          '<h3>Résumé de la commande</h3>'+
          '<div class="summary-line"><span>Sous-total</span><span>'+euro(subtotal)+'</span></div>'+
          '<div class="summary-line"><span>Frais de livraison</span><span>'+(shipping===0?"Offerts":euro(shipping))+'</span></div>'+
          '<div class="summary-total"><span>Total TTC</span><span>'+euro(total)+'</span></div>'+
          '<div class="summary-line"><span>dont TVA (20 %)</span><span>'+euro(tva)+'</span></div>'+
          '<p class="small">Nous restons disponible pour toutes éventuelles questions. Pour nous contacter, remplissez ce formulaire de contact et nous vous y répondrons le plus vite possible.</p>'+
          '<p class="small" style="margin-top:14px;">En poursuivant, vous confirmez avoir 18 ans ou plus et acceptez nos <a href="/cgv/" style="text-decoration:underline;">conditions générales de vente</a>. '+ALCOHOL_MSG+'</p>'+
          '<button class="btn" style="width:100%;" id="checkoutBtn">Procéder au paiement</button>'+
        '</div>'+
      '</div>'+
    '</section></div>';
  });

  function bindPanier(){
    var rows = document.getElementById("cartRows");
    if(!rows) return;
    rows.querySelectorAll("tr").forEach(function(tr){
      var id = tr.getAttribute("data-id");
      var item = cart.find(function(i){return i.id===id;});
      tr.querySelector(".row-plus").addEventListener("click", function(){ setQty(id, item.qty+1); });
      tr.querySelector(".row-minus").addEventListener("click", function(){ setQty(id, item.qty-1); });
      tr.querySelector(".remove-btn").addEventListener("click", function(){ removeFromCart(id); });
    });
    var checkoutBtn = document.getElementById("checkoutBtn");
    if(checkoutBtn){
      checkoutBtn.addEventListener("click", function(){
        showToast("Le paiement en ligne sera bientôt disponible");
      });
    }
  }

  /* ---------------- AFTER RENDER hooks ---------------- */
  function afterRender(path){
    bindFaq();
    if(path==="/") bindCarousel("homeCarousel");
    if(path==="/apropos") bindCarousel("aboutCarousel");
    if(path==="/produits" || path==="/bulles-de-vanille") bindProduitsPage();
    if(path==="/contact") bindContact();
    if(path==="/panier") bindPanier();
  }

  function carouselHTML(trackId, products, extraStyle){
    return '<div class="carousel-track" id="'+trackId+'" style="'+(extraStyle||"")+'">'+ products.map(productCard).join("") +'</div>'+
      '<div class="carousel-arrows">'+
        '<button class="carousel-arrow" data-track="'+trackId+'" data-dir="-1" aria-label="Bouteilles précédentes"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 18l-6-6 6-6"/></svg></button>'+
        '<button class="carousel-arrow" data-track="'+trackId+'" data-dir="1" aria-label="Bouteilles suivantes"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg></button>'+
      '</div>';
  }
  function bindCarousel(trackId){
    var track = document.getElementById(trackId);
    if(!track) return;
    function step(){
      var card = track.querySelector("a");
      return card ? card.getBoundingClientRect().width + 26 : 260;
    }
    document.querySelectorAll('.carousel-arrow[data-track="'+trackId+'"]').forEach(function(btn){
      btn.addEventListener("click", function(){
        var dir = parseInt(btn.getAttribute("data-dir"),10);
        track.scrollBy({left:dir*step(), behavior:"smooth"});
      });
    });
  }

  window.__rdToast = function(){ showToast("Détails de l'événement à venir"); };

  /* ---------------- NAV / MENU ---------------- */
  document.getElementById("burgerBtn").addEventListener("click", function(){
    document.getElementById("mobileMenu").classList.toggle("open");
  });
  document.getElementById("cartBtn").addEventListener("click", function(){
    go("/panier/");
  });

  /* Pages pré-rendues au build : si le <main> contient déjà la bonne page, on "hydrate" (liaison des événements) sans la redessiner */
  readCatalogSnapshot();
  var initial = resolveRoute();
  var prerendered = app.getAttribute("data-route")===routeSig(initial) && app.children.length>0;
  window.__rdReady = new Promise(function(resolve){ window.__rdResolve = resolve; });
  window.__RD = {
    get products(){ return PRODUCTS; }, absUrl:absUrl, productImageUrl:productImageUrl, productsSig:productsSig,
    pages:["/","/produits","/bulles-de-vanille","/etiquette","/evenements","/apropos","/contact","/panier"], urls:ROUTE_TO_URL
  };
  render({hydrate:prerendered, keepScroll:true});
  ageGate();
  loadFromSupabase();
  updateCartCount();
})();
