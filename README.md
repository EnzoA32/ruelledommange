# Site Ruelle-Dommange — version optimisée SEO

Site statique **pré-rendu** : chaque page (accueil, produits, chaque fiche produit, à propos…) est un vrai fichier HTML
avec son propre titre, sa description, son URL, ses données structurées — lisible par Google sans exécuter de JavaScript.
Le catalogue (prix, descriptions, nouveaux produits) vient de ton **Google Sheet**.

## Structure

```
src/                  ← LE CODE SOURCE (c'est ici qu'on modifie le site)
  assets/js/app.js      pages, textes, SEO, lecture du Google Sheet
  assets/css/style.css  design
  assets/img|fonts|video|og   médias (images WebP compressées, polices, vidéo, visuels de partage)
  body.html / head.html       en-tête, menu, pied de page
build.mjs             ← génère le site final dans dist/
site.config.json      ← ⚠ NOM DE DOMAINE (à vérifier, voir ci-dessous)
vercel.json           ← config Vercel (build, cache, redirections, en-têtes de sécurité)
dist/                 ← le site prêt à publier (généré)
```

## 1. À faire AVANT la mise en ligne

1. **Domaine** : ouvre `site.config.json` et mets le vrai domaine (par défaut : `https://www.ruelle-dommange.fr`, une hypothèse).
   Il sert aux balises canonical, au sitemap, aux images de partage et aux données structurées.
2. **Contenus à confirmer** (voir « Points à valider » dans la réponse) : e-mail, réseaux sociaux, événements.

## 2. Publier sur Vercel (recommandé : le Sheet est relu à chaque déploiement)

1. Mets tout le dossier (sans `node_modules`) sur GitHub.
2. Sur vercel.com/new : importe le dépôt. Les réglages sont déjà dans `vercel.json`
   (Install `npm install`, Build `npm run build`, Output `dist`) → clique sur **Deploy**.
3. Domaine : *Settings → Domains*. Configure aussi la redirection `ruelle-dommange.fr` → `www.ruelle-dommange.fr` (ou l'inverse) ;
   une seule version doit répondre.

> Alternative sans build : envoie uniquement le contenu de `dist/` (mais les pages ne seront pas régénérées avec le Sheet).

## 3. Google Sheet = catalogue

Colonnes attendues (1re ligne) : `id, nom, prix, categorie, tag, description`

- Modifier un prix / une description : modifier la ligne du Sheet (l'`id` doit rester identique).
- Nouveau produit : ajouter une ligne avec un `id` unique en minuscules-avec-tirets (ex. `champagne-rose`). Une page `/produits/champagne-rose/` est créée.
- Dans la description, un retour à la ligne = un nouveau paragraphe.
- Le Sheet doit rester **publié sur le web** (*Fichier → Partager → Publier sur le web*, format CSV).

Fonctionnement : les visiteurs voient toujours les prix du Sheet en direct. Google, lui, voit les prix du **dernier déploiement**.
Pour que les pages indexées se mettent à jour après un changement de prix : *Vercel → Settings → Git → Deploy Hooks*,
ou simplement relancer un déploiement (*Redeploy*). Un produit tout juste ajouté n'a sa page indexable qu'après un déploiement.

## 4. Après la mise en ligne (20 minutes, très important)

1. **Google Search Console** → ajouter le domaine → *Sitemaps* → envoyer `https://TON-DOMAINE/sitemap.xml`.
2. *Inspection d'URL* sur la page d'accueil → *Demander une indexation*.
3. Tester une fiche produit sur https://search.google.com/test/rich-results (doit afficher « Produit » et « Fil d'Ariane »).
4. Créer/revendiquer la fiche **Google Business Profile** (adresse : 47 rue de la Fontaine, 02310 Domptin) — premier levier de SEO local.
5. Obtenir des liens depuis : interprofession (champagne.fr), office de tourisme de Château-Thierry, annuaires de vignerons.

## Commandes (si tu travailles en local)

```bash
npm install
npm run build        # génère dist/
```
