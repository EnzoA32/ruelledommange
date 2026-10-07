(function(){
  "use strict";

  /* ---------------- CONFIG SEO ---------------- */
  var SITE_URL = "https://www.ruelle-dommange.fr";                    /* remplacé au build (site.config.json) */
  if(SITE_URL.indexOf("__")===0) SITE_URL = location.origin;
  var SITE_NAME = "Ruelle-Dommange";
  var EVENTS_PUBLISHED = false;   /* passer à true quand les vrais événements remplacent les exemples → la page sera indexée */
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
  /* ---------------- CMS (Google Sheet) CONFIG ----------------
     Pour brancher le catalogue sur un Google Sheet géré par la cliente :
     1. Créer un Google Sheet avec les colonnes : id, nom, prix, categorie, tag, description
        (le fichier catalogue-ruelle-dommange.csv fourni sert de point de départ à importer)
     2. Fichier > Partager > Publier sur le web > choisir l'onglet > format CSV > Publier
     3. Coller l'URL obtenue ci-dessous (celle qui se termine par output=csv)
     Tant que cette URL est vide, le site utilise les données par défaut codées ci-dessous.
     ✔ Branché : le catalogue est lu au build (pages pré-rendues pour Google) ET au chargement (prix à jour). */
  var SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTM2BPI4FLqndsQIM8Wwoob9T8hbp9hM6yfb40UoDt-bWUeEgbk_j-yANZ4H1-ioe0z8lEIj73hi54O/pub?output=csv";

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

  /* ---------------- CSV PARSER (gère les champs entre guillemets, virgules et retours à la ligne) ---------------- */
  function parseCSV(text){
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for(var i=0;i<text.length;i++){
      var c = text[i];
      if(inQuotes){
        if(c === '"'){
          if(text[i+1] === '"'){ field += '"'; i++; }
          else { inQuotes = false; }
        } else { field += c; }
      } else {
        if(c === '"'){ inQuotes = true; }
        else if(c === ','){ row.push(field); field = ""; }
        else if(c === '\n'){ row.push(field); rows.push(row); row = []; field = ""; }
        else if(c === '\r'){ /* ignore */ }
        else { field += c; }
      }
    }
    if(field.length || row.length){ row.push(field); rows.push(row); }
    if(!rows.length) return [];
    var headers = rows[0].map(function(h){ return h.trim().toLowerCase(); });
    var out = [];
    for(var r=1;r<rows.length;r++){
      if(rows[r].length===1 && rows[r][0]==="") continue;
      var obj = {};
      headers.forEach(function(h,idx){ obj[h] = (rows[r][idx]||"").trim(); });
      out.push(obj);
    }
    return out;
  }

  /* ---------------- Fusionne les lignes du Google Sheet avec les produits par défaut ---------------- */
  function mergeSheetProducts(rows){
    rows.forEach(function(row){
      if(!row.id) return;
      var existing = PRODUCTS.find(function(p){ return p.id === row.id; });
      var descParagraphs = row.description ? row.description.split(/\n+/).filter(Boolean) : null;
      if(existing){
        if(row.nom) existing.name = row.nom;
        if(row.prix) existing.price = parseFloat(row.prix.replace(",", "."));
        if(row.categorie) existing.cat = row.categorie;
        if(row.tag) existing.tag = row.tag;
        if(descParagraphs) existing.desc = descParagraphs;
      } else {
        PRODUCTS.push({
          id: row.id,
          name: row.nom || row.id,
          price: row.prix ? parseFloat(row.prix.replace(",", ".")) : 0,
          cat: row.categorie || "Bouteille 75cl",
          tag: row.tag || row.categorie || "Nos champagnes",
          desc: descParagraphs || [],
          bottleColor:"#e7d9a8"
        });
      }
    });
  }

  function loadProductsFromSheet(){
    if(!SHEET_CSV_URL){ sheetState = "done"; if(window.__rdResolve) window.__rdResolve(); return; }
    fetch(SHEET_CSV_URL, {cache:"no-cache"})
      .then(function(res){ if(!res.ok) throw new Error("network"); return res.text(); })
      .then(function(text){
        var rows = parseCSV(text);
        if(rows.length){
          mergeSheetProducts(rows);
          sheetState = "done";
          if(productsSig() !== app.getAttribute("data-sig") || app.getAttribute("data-route")!==routeSig(resolveRoute())){
            render({keepScroll:true});
          } else { setSEO(resolveRoute().route, findProduct(resolveRoute().id)); }
        }
      })
      .catch(function(err){
        console.warn("Catalogue Google Sheet indisponible, affichage des données par défaut.", err);
      })
      .then(function(){
        if(sheetState==="pending"){ sheetState = "done"; render({keepScroll:true}); }
        if(window.__rdResolve) window.__rdResolve();
      });
  }

  var EVENTS = [
    {title:"Salon de dégustation de vin de Thulin", place:"Thulin 7350", date:"02 Mars", time:"16h00", day:"01", month:"mai", address:"Rue Ferrer n°20, Thulin 7350",
      text:"Un grain de folie, un peu d'imagination, telle est l'histoire de ce produit unique et exceptionnel."},
    {title:"Exposition de vin & spiritueux", place:"Thulin 7350", date:"02 Mars", time:"16h00", day:"01", month:"mai", address:"Adresse de l'événement, Thulin 7350",
      text:"Un grain de folie, un peu d'imagination, telle est l'histoire de ce produit unique et exceptionnel."},
    {title:"Salon de dégustation de vin de Thulin", place:"Thulin 7350", date:"02 Mars", time:"16h00", day:"01", month:"mai", address:"Adresse de l'événement, Thulin 7350",
      text:"Un grain de folie, un peu d'imagination, telle est l'histoire de ce produit unique et exceptionnel."},
    {title:"Salon de dégustation de vin de Thulin", place:"Thulin 7350", date:"02 Mars", time:"16h00", day:"01", month:"mai", address:"Adresse de l'événement, Thulin 7350",
      text:"Un grain de folie, un peu d'imagination, telle est l'histoire de ce produit unique et exceptionnel."},
    {title:"Salon de dégustation de vin de Thulin", place:"Thulin 7350", date:"02 Mars", time:"16h00", day:"01", month:"mai", address:"Adresse de l'événement, Thulin 7350",
      text:"Un grain de folie, un peu d'imagination, telle est l'histoire de ce produit unique et exceptionnel."},
    {title:"Salon de dégustation de vin de Thulin", place:"Thulin 7350", date:"02 Mars", time:"16h00", day:"01", month:"mai", address:"Adresse de l'événement, Thulin 7350",
      text:"Un grain de folie, un peu d'imagination, telle est l'histoire de ce produit unique et exceptionnel."}
  ];

  var FAQ = [
    {q:"Où sont élaborés vos champagnes ?", a:"Nos produits sont élaborés avec passion dans le respect du savoir-faire traditionnel champenois."},
    {q:"Proposez-vous des créations originales ?", a:"Oui, notre gamme comprend également des créations uniques comme les Bulles de Vanille."},
    {q:"Peut-on commander pour des événements ?", a:"Oui, nos bouteilles peuvent accompagner mariages, anniversaires, réceptions et événements professionnels."},
    {q:"Peut-on personnaliser certaines bouteilles ?", a:"Nous proposons la personnalisation d'étiquettes pour certaines cuvées afin de rendre vos événements encore plus uniques."}
  ];

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
    var existing = cart.find(function(i){return i.id===id;});
    if(existing){ existing.qty += qty; } else { cart.push({id:id, qty:qty}); }
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
    if(it){ it.qty = Math.max(1, qty); saveCart(); render({keepScroll:true}); }
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

  var ROUTE_TO_URL = {"/":"/","/produits":"/produits/","/evenements":"/evenements/","/etiquette":"/creation-etiquette/","/apropos":"/a-propos/","/contact":"/contact/","/panier":"/panier/"};
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
  }
  function routeSig(r){ return r.route==="product" ? "product:"+r.id : r.route; }
  function productsSig(){
    var s = JSON.stringify(PRODUCTS.map(function(p){return [p.id,p.name,p.price,p.cat,p.tag,p.desc];}));
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
  var sheetState = SHEET_CSV_URL ? "pending" : "done";

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
        if(sheetState==="pending"){          /* produit peut-être ajouté dans le Sheet : on attend le chargement */
          app.innerHTML = '<div class="wrap"><section class="section center"><p class="lede">Chargement…</p></section></div>';
          navActive("/produits"); return;
        }
        r = {route:"404"};
      }
    }
    if(r.route==="product"){
      if(!hydrate) app.innerHTML = pageProduit(p.id);
      bindProduit(p.id);
      navActive("/produits");
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

  /* Instantané du catalogue embarqué dans chaque page pré-rendue : le site reste complet même si le Google Sheet est injoignable */
  function writeCatalogSnapshot(){
    var el = document.getElementById("rd-catalog");
    if(!el){ el = document.createElement("script"); el.type = "application/json"; el.id = "rd-catalog"; document.body.appendChild(el); }
    el.textContent = JSON.stringify(PRODUCTS).replace(/</g,"\\u003c");
  }
  function readCatalogSnapshot(){
    var el = document.getElementById("rd-catalog");
    if(!el) return;
    try{
      var arr = JSON.parse(el.textContent);
      if(Array.isArray(arr) && arr.length){ PRODUCTS.length = 0; arr.forEach(function(x){ PRODUCTS.push(x); }); }
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
    "/produits":  {title:"Nos champagnes, magnums & Bulles de Vanille | Ruelle-Dommange",
                   desc:"Toute la gamme Ruelle-Dommange : champagne Brut, Blanc de blancs, Demi-sec, Millésime, magnum, ratafia et Bulles de Vanille. Livraison offerte dès 100 €.", type:"CollectionPage", crumb:"Nos produits"},
    "/etiquette": {title:"Étiquette de champagne personnalisée | Ruelle-Dommange",
                   desc:"Personnalisez l'étiquette de votre champagne pour un mariage, un baptême, un anniversaire ou un événement d'entreprise. Une bouteille unique Ruelle-Dommange.", type:"WebPage", crumb:"Création d'étiquette"},
    "/evenements":{title:"Événements et salons de dégustation | Ruelle-Dommange",
                   desc:"Retrouvez Ruelle-Dommange lors de salons et de dégustations de vin et de champagne.", type:"WebPage", crumb:"Événements", noindex:!EVENTS_PUBLISHED},
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
    var src = (p.photo && MEDIA[p.photo]) ? MEDIA[p.photo] : MEDIA.bottleIllustration;
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
    if(routeKey==="/produits"){
      page.mainEntity = {"@type":"ItemList","itemListElement":PRODUCTS.map(function(x,i){
        return {"@type":"ListItem","position":i+1,"url":SITE_URL+"/produits/"+x.id+"/","name":x.name};
      })};
    }
    g.push(page);

    var crumbs = [{"@type":"ListItem","position":1,"name":"Accueil","item":SITE_URL+"/"}];
    if(routeKey==="product"){
      crumbs.push({"@type":"ListItem","position":2,"name":"Nos produits","item":SITE_URL+"/produits/"});
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
                  "availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition",
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
    var canonical = null;
    if(routeKey==="product") canonical = SITE_URL + "/produits/" + p.id + "/";
    else if(routeKey!=="404") canonical = SITE_URL + ROUTE_TO_URL[routeKey];

    document.title = seo.title;
    upsertMeta("name","description", seo.desc);
    upsertMeta("name","robots", noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    upsertLink("canonical", canonical);

    var img = DEFAULT_OG;
    if(routeKey==="product"){ img = (p.photo && OG_BY_PHOTO[p.photo]) ? OG_BY_PHOTO[p.photo] : DEFAULT_OG; }
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
    var featured = PRODUCTS.slice(0,8);
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
    '</div></section>'+

    '<section class="section" style="padding-top:0;"><div class="wrap center">'+
      '<h2 class="eyebrow-title">Venez à nos futurs <em>événements</em></h2>'+
      '<p class="lede">Retrouvez-nous lors de dégustations, salons et événements afin de découvrir notre univers, nos produits et notre passion du champagne.</p>'+
      '<div class="events-grid" style="text-align:left;">'+ EVENTS.slice(0,4).map(function(e,i){
        return '<div class="event-card"><div class="event-thumb"><img src="'+eventPhoto(i)+'" alt="'+e.title+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>'+
          '<div class="event-meta"><span>'+metaIcon("pin")+' '+e.place+'</span><span>'+metaIcon("calendar")+' '+e.date+'</span><span>'+metaIcon("clock")+' '+e.time+'</span></div>'+
          '<h4>'+e.title+'</h4><p>'+e.text+'</p>'+
          '<a href="/evenements/" class="more">En savoir plus...</a></div>';
      }).join("") +'</div>'+
    '</div></section>'+

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
  var currentFilter = "Tous les produits";
  route("/produits", function(){
    return '<div class="wrap">'+
      '<section style="padding-top:44px;">'+
        '<div class="remark-box">Remarque : la livraison est offerte dès 100€ d\'achat sur l\'ensemble de notre gamme de champagnes et créations.</div>'+
      '</section>'+
      '<section class="section center" style="padding-bottom:0;">'+
        '<h1 class="eyebrow-title"><em>Découvrez</em> nos bouteilles</h1>'+
        '<p class="lede">Viticulteur de champagne de père en fils, nous vous offrons une gamme de produits de qualité à des prix défiant toute concurrence.</p>'+
      '</section>'+
      '<section class="section" style="padding-top:0;">'+
        '<div class="filter-row">'+
          '<div class="filter-tabs" id="filterTabs">'+ CATEGORIES.map(function(c){
            return '<button data-cat="'+c+'" class="'+(c===currentFilter?"active":"")+'">'+c+'</button>';
          }).join("") +'</div>'+
          '<select class="sort-select" id="sortSelect">'+
            '<option value="default">Trier par</option>'+
            '<option value="price-asc">Prix croissant</option>'+
            '<option value="price-desc">Prix décroissant</option>'+
            '<option value="name">Nom (A-Z)</option>'+
          '</select>'+
        '</div>'+
        '<div class="grid-products" id="productsGrid"></div>'+
      '</section>'+
    '</div>';
  });

  function renderProductsGrid(){
    var grid = document.getElementById("productsGrid");
    if(!grid) return;
    var list = PRODUCTS.filter(function(p){
      return currentFilter==="Tous les produits" || p.cat===currentFilter;
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
    var others = PRODUCTS.filter(function(x){return x.id!==p.id;}).slice(0,4);
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
              '<button class="btn" id="addToCartBtn">Ajouter au panier</button>'+
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
        '<h2 class="eyebrow-title"><em>Nos autres</em> bouteilles</h2>'+
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
      qty = qty+1; qtyVal.textContent = qty;
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
        EVENTS.map(function(e,i){
          return '<div class="event-row">'+
            '<div class="date-badge"><div class="d">'+e.day+'</div><div class="m">'+e.month+'</div></div>'+
            '<div><div class="event-meta"><span>'+metaIcon("pin")+' '+e.place+'</span><span>'+metaIcon("calendar")+' '+e.date+'</span><span>'+metaIcon("clock")+' '+e.time+'</span></div>'+
              '<h4 style="font-size:1.3rem;">'+e.title+'</h4>'+
              '<p style="margin-bottom:6px;">'+e.address+'</p>'+
              '<p>'+e.text+' <a href="/contact/" class="more">En savoir plus...</a></p>'+
              '<button class="btn" style="margin-top:14px;" onclick="window.__rdToast()">Voir l\'événement</button>'+
            '</div>'+
            '<div class="er-media"><img src="'+eventPhoto(i)+'" alt="'+e.title+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>'+
          '</div>';
        }).join("")+
        '<div class="pagination">'+
          '<button aria-label="Page précédente"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 18l-6-6 6-6"/></svg></button>'+
          '<div class="page-nums"><span class="active">1</span><span>2</span><span>3</span></div>'+
          '<button aria-label="Page suivante"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg></button>'+
        '</div>'+
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
      carouselHTML("aboutCarousel", PRODUCTS.slice(0,8), "text-align:left;margin-top:40px;justify-content:center;") +
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
    var tva = subtotal*0.20;
    var shipping = subtotal >= 100 ? 0 : 5.90;
    var total = subtotal+tva+shipping;
    return '<div class="wrap"><section class="section">'+
      '<h1 class="eyebrow-title">Panier <em>d\'achat</em></h1>'+
      '<div class="cart-grid">'+
        '<table class="cart-table"><thead><tr><th>Articles</th><th>Quantité</th><th>Total</th><th>Action</th></tr></thead>'+
        '<tbody id="cartRows">'+rows+'</tbody></table>'+
        '<div class="summary-box">'+
          '<h3>Résumé de la commande</h3>'+
          '<div class="summary-line"><span>Sous-total</span><span>'+euro(subtotal)+'</span></div>'+
          '<div class="summary-line"><span>TVA (20%)</span><span>'+euro(tva)+'</span></div>'+
          '<div class="summary-line"><span>Frais de livraison</span><span>'+(shipping===0?"Offerts":euro(shipping))+'</span></div>'+
          '<div class="summary-total"><span>Total</span><span>'+euro(total)+'</span></div>'+
          '<p class="small">Nous restons disponible pour toutes éventuelles questions. Pour nous contacter, remplissez ce formulaire de contact et nous vous y répondrons le plus vite possible.</p>'+
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
    if(path==="/produits") bindProduitsPage();
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
    pages:["/","/produits","/etiquette","/evenements","/apropos","/contact","/panier"], urls:ROUTE_TO_URL
  };
  render({hydrate:prerendered, keepScroll:true});
  loadProductsFromSheet();
  updateCartCount();
})();
