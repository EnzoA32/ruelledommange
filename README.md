# Site Ruelle-Dommange

Site vitrine du Champagne Ruelle-Dommange — un seul fichier `index.html`
autonome (police Larken, images, vidéo du hero : tout est intégré dans
le fichier, aucune dépendance externe à héberger séparément).

## Déployer sur GitHub + Vercel

### 1. Mettre le projet sur GitHub

**Option A — directement depuis l'interface GitHub (le plus simple) :**
1. Va sur [github.com/new](https://github.com/new) et crée un nouveau dépôt
   (par exemple `ruelle-dommange-site`), en **public** ou **privé** au choix.
2. Sur la page du dépôt vide, clique sur *"uploading an existing file"*.
3. Glisse-dépose `index.html` (et `catalogue-ruelle-dommange.csv` si tu veux
   le garder dans le dépôt) puis clique sur *Commit changes*.

**Option B — en ligne de commande, si tu as Git installé :**
```bash
cd ruelle-dommange
git init
git add .
git commit -m "Site Ruelle-Dommange"
git branch -M main
git remote add origin https://github.com/TON-COMPTE/ruelle-dommange-site.git
git push -u origin main
```

### 2. Connecter Vercel

1. Va sur [vercel.com/new](https://vercel.com/new) et connecte-toi (tu peux
   te connecter directement avec ton compte GitHub).
2. Clique sur *Import* à côté du dépôt `ruelle-dommange-site`.
3. Vercel détecte automatiquement un site statique — tu peux laisser tous
   les champs par défaut (aucun *Build Command* n'est nécessaire).
4. Clique sur *Deploy*. Au bout de quelques secondes, ton site est en ligne
   sur une adresse du type `ruelle-dommange-site.vercel.app`.

### 3. Mettre ton propre nom de domaine (optionnel)

Dans le projet Vercel : *Settings → Domains* → ajoute ton nom de domaine
(ex. `ruelle-dommange.fr`) et suis les instructions pour pointer tes DNS
(Vercel indique exactement les enregistrements à créer chez ton
registrar).

### 4. Mettre à jour le site plus tard

Chaque fois que tu modifies `index.html` et que tu pousses (`git push`) ou
que tu re-téléverses le fichier sur GitHub, Vercel redéploie automatiquement
le site en quelques secondes — rien d'autre à faire.

## Brancher le catalogue Google Sheets (prix / descriptions)

Le fichier `catalogue-ruelle-dommange.csv` est le point de départ à
importer dans un Google Sheet pour que la cliente puisse modifier les prix
et descriptions elle-même. Une fois le Sheet publié sur le web (format
CSV), colle son URL dans la constante `SHEET_CSV_URL` tout en haut de la
balise `<script>` dans `index.html` :

```js
var SHEET_CSV_URL = "COLLE_TON_URL_CSV_ICI";
```

Puis repousse le fichier sur GitHub — Vercel redéploiera automatiquement.
