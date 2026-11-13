# Ruelle-Dommange — site vitrine + boutique

Site statique pré-rendu (SEO) hébergé sur Vercel, données gérées dans Supabase.

## Fonctionnement
- `npm run build` lit les produits et événements dans **Supabase**, pré-rend toutes les pages (`dist/`), génère `sitemap.xml`, `robots.txt` et `vercel.json`.
- Au chargement, le navigateur relit Supabase : **prix, stock, nouveaux produits et événements sont visibles immédiatement** sans redéploiement.
- Si Supabase est injoignable, le site affiche les données par défaut codées dans `src/assets/js/app.js`.

## Configuration (`site.config.json`)
| Clé | Rôle |
|---|---|
| `siteUrl` | Nom de domaine final (canonical, sitemap, Open Graph) — **à mettre à jour** |
| `supabaseUrl` / `supabaseKey` | URL du projet et clé **publique** (`sb_publishable_…`). Jamais la clé secrète. |

## Base de données
`supabase/schema.sql` (à exécuter une fois dans Supabase > SQL Editor) crée les tables `products`, `events`, `orders`, `admins`, le stockage d'images `media` et les règles de sécurité (RLS).
Premier administrateur : créer l'utilisateur dans *Authentication > Users*, puis `insert into public.admins (user_id) select id from auth.users where email = '…';`

## Interface d'administration — `/admin/`
Connexion par e-mail + mot de passe (réservée aux comptes présents dans `admins`).
- **Produits** : nom, prix TTC, stock (0 = épuisé), catégorie, description, photo (optimisée automatiquement), visibilité, ordre.
- **Événements** : titre, date/heure (heure de Paris), lieu, adresse, description, image, publié / brouillon. Seuls les événements publiés et à venir s'affichent ; la page Événements n'est indexée par Google que s'il y en a.
- **Commandes** : liste et changement de statut (alimentée par Stripe, étape suivante).
- Bouton **« Mettre à jour pour Google »** : relance un déploiement pour que les pages pré-rendues (SEO) contiennent les derniers produits/événements.

### Variables d'environnement Vercel (uniquement pour ce bouton)
| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_KEY` | clé publique `sb_publishable_…` |
| `DEPLOY_HOOK_URL` | Vercel > Settings > Git > Deploy Hooks > créer un hook (branche de production) |

## Prix
Tous les prix sont **TTC** (TVA 20 % incluse). Stockés en centimes dans `products.price_cents`. Livraison : 5,90 € sous 100 € d'achat, offerte au-delà.

## Mise en ligne
1. GitHub : pousser le dossier (sans `node_modules`).
2. vercel.com/new → importer le dépôt → Deploy (réglages dans `vercel.json`).
3. Ajouter le domaine dans Vercel et mettre `siteUrl` à jour.
4. Search Console : envoyer `https://<domaine>/sitemap.xml`.

## Test local sans réseau
`SUPABASE_MOCK_DIR=./mock npm run build` avec `mock/products.json` et `mock/events.json`.
