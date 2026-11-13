-- Ruelle-Dommange : schéma Supabase
-- À coller dans Supabase > SQL Editor > New query > Run (une seule fois).
-- Prix stockés en centimes (2290 = 22,90 €).

create extension if not exists pgcrypto;

-- ---------- Administrateurs ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Produits ----------
create table if not exists public.products (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  category text not null,
  tag text not null default '',
  description text not null default '',
  photo_url text,
  specs jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  stock integer check (stock is null or stock >= 0),   -- null = stock non géré
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Événements ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  place text not null default '',
  address text not null default '',
  starts_at timestamptz not null,
  text text not null default '',
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Commandes (écrites par le webhook Stripe, via la clé secrète) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  email text,
  customer_name text,
  phone text,
  shipping jsonb,
  items jsonb not null default '[]'::jsonb,
  amount_subtotal_cents integer,
  amount_shipping_cents integer,
  amount_total_cents integer,
  status text not null default 'paid' check (status in ('paid','preparing','shipped','delivered','refunded','cancelled')),
  created_at timestamptz not null default now()
);

-- ---------- updated_at automatique ----------
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists trg_events_updated on public.events;
create trigger trg_events_updated before update on public.events for each row execute function public.set_updated_at();

-- ---------- Sécurité (RLS) ----------
alter table public.admins   enable row level security;
alter table public.products enable row level security;
alter table public.events   enable row level security;
alter table public.orders   enable row level security;

drop policy if exists "admins lisent leur ligne" on public.admins;
create policy "admins lisent leur ligne" on public.admins for select using (user_id = auth.uid());

drop policy if exists "public lit produits actifs" on public.products;
create policy "public lit produits actifs" on public.products for select using (active or public.is_admin());
drop policy if exists "admin gère produits" on public.products;
create policy "admin gère produits" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public lit événements publiés" on public.events;
create policy "public lit événements publiés" on public.events for select using (published or public.is_admin());
drop policy if exists "admin gère événements" on public.events;
create policy "admin gère événements" on public.events for all using (public.is_admin()) with check (public.is_admin());

-- commandes : lecture/modif réservées aux admins ; l'insertion se fait côté serveur (clé secrète, qui contourne la RLS)
drop policy if exists "admin lit commandes" on public.orders;
create policy "admin lit commandes" on public.orders for select using (public.is_admin());
drop policy if exists "admin modifie commandes" on public.orders;
create policy "admin modifie commandes" on public.orders for update using (public.is_admin()) with check (public.is_admin());

-- ---------- Stockage des images ----------
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

drop policy if exists "public lit media" on storage.objects;
create policy "public lit media" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "admin écrit media" on storage.objects;
create policy "admin écrit media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin modifie media" on storage.objects;
create policy "admin modifie media" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin supprime media" on storage.objects;
create policy "admin supprime media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- ---------- Catalogue actuel (11 produits) ----------
insert into public.products (id, name, price_cents, category, tag, description, photo_url, sort_order) values
  ('blanc-de-blancs', 'Blanc de blancs', 2290, 'Bouteille 75cl', 'Nos champagnes', 'Ce champagne d''une finesse rare est élaboré exclusivement à partir des meilleurs crus du cépage blanc champenois, le Chardonnay.
Il apporte l''élégance racée et la finesse et des arômes d''agrumes.
Cru très minéral aux notes fumées qui donne rondeur et légèreté.
Le blanc de blancs fera grande sensation lors d''un apéritif raffiné et sublimera la dégustation de volailles et de poissons tel un tartare de Saint-Pierre ou une truite saumonée.', '/assets/img/photoBlancDeBlancs.53316b12.webp', 1),
  ('champagne-brut', 'Champagne Brut', 2290, 'Bouteille 75cl', 'Nos champagnes', 'Ce champagne de caractère allie avec harmonie les trois cépages champenois : le Chardonnay, le Pinot Noir et le Pinot Meunier.
Assemblage : 20 à 25 % de Chardonnay pour l''élégance et la finesse, 25 à 30 % de Pinot Noir pour la structure et environ 50 % de Pinot Meunier pour le fruité. Plus de 20 crus entrent dans sa composition, avec 25 à 30 % de vins de réserve suivant les années.
Vieillissement : 3 ans en caves centenaires taillées à même la craie, à l''abri de la lumière, pour offrir un vin à la maturité parfaite.
Notes de dégustation : robe dorée, couleur or chaud presque ambré ; nez aux parfums d''épices et de beurre frais ; bouche fraîche, puissante et charpentée.
Accords mets/vins : parfait à l''apéritif, il constitue aussi l''accord idéal avec de nombreux mets, notamment les viandes tendres comme un magret de canard parfumé au miel et baies sauvages.
Servir frais à 7-8°C.', '/assets/img/photoBrut.8f2ba26c.webp', 2),
  ('champagne-demi-sec', 'Champagne Demi-sec', 2290, 'Bouteille 75cl', 'Nos champagnes', 'Ce champagne de caractère allie avec harmonie les trois cépages champenois : le Chardonnay, le Pinot Noir et le Pinot Meunier.
Assemblage : 25 à 30 % de Chardonnay pour l''élégance et la finesse, 20 % de Pinot Noir pour la structure et environ 50 % de Pinot Meunier pour le fruité. Plus de 20 crus entrent dans sa composition, avec 30 à 35 % de vins de réserve suivant les années.
Vieillissement : 3 ans en caves centenaires taillées à même la craie, à l''abri de la lumière, pour une maturité parfaite.
Notes de dégustation : un or jaune lumineux à l''effervescence langoureuse ; nez de meringue et de praline ; bouche aux notes d''agrumes confits.
Accords mets/vins : s''associe divinement avec de nombreux desserts, comme une crème vanillée caramélisée à la cassonade ou de succulentes pralines. Se marie aussi aisément avec un foie gras.
Servir frais à 7-8°C.', '/assets/img/photoDemiSec.7e53dff6.webp', 3),
  ('champagne-millesime', 'Champagne Millésime', 2990, 'Bouteille 75cl', 'Nos champagnes', 'Ce champagne met en évidence l''expression d''une année de vendange exceptionnelle. Ce vin rare invite à la découverte de nouvelles sensations.
Assemblage : 45 % de Chardonnay pour l''élégance et la finesse, 55 % de Pinot Noir pour la structure. Ces cépages sont exclusivement issus de la vendange d''une même année. Près de 10 crus entrent dans sa composition, exclusivement issus des 1ers et Grands Crus champenois.
Vieillissement : 7 ans, stocké à l''abri de la lumière dans des caves centenaires taillées à même la craie.
Notes de dégustation : reflets dorés ; nez de pains grillés ; bouche aux saveurs d''agrumes, association rare de fraîcheur et de longueur.
Accords mets/vins : champagne de début de repas, il se déguste aussi avec un veau de lait rôti, jus à l''huile de noisette et champignons des bois, ou avec un foie gras.
Servir frais à 7-8°C.', '/assets/img/photoMillesime.8de023d6.webp', 4),
  ('champagne-pink-flower', 'Champagne Pink Flower', 3450, 'Bouteille 75cl', 'Nos champagnes', 'Ce champagne séduction, à la robe rose-framboise, est gage de tendresse et d''harmonie. Ce n''est pas un rosé brut classique : nous avons recherché un équilibre entre le brut et le demi-sec, avec une vinification en rouge à partir de pinots de plus de 40 ans, qui lui donne ses arômes de fruits rouges.
Assemblage : 40 % de Chardonnay pour l''élégance et la finesse, 50 % de Pinot Noir pour la structure et la couleur, 10 % de Pinot Meunier pour le fruité. Une vingtaine de crus entrent dans sa composition, avec 20 à 25 % de vins de réserve suivant les années.
Apparence : une robe d''un rose chatoyant, presque envoûtant, qui met en évidence le caractère fruité de ce vin rare et unique.
Notes de dégustation : nez de fruits rouges et de fraises des bois ; bouche onctueuse et fruitée développant des arômes de rose, de miel et de cannelle.
Accords mets/vins : idéal en toutes occasions à l''apéritif, il trouve aussi sa place au dessert, avec une feuillantine de fraises des bois ou un macaron aux framboises.
Servir frais à 7-8°C.', '/assets/img/photoPinkFlower.c13de20e.webp', 5),
  ('bulles-de-vanille', 'Bulles de Vanille', 2490, 'Bulles de Vanille', 'Bulles de Vanille', 'Une création unique au monde, née d''une envie d''innover autour du champagne : un effervescent élaboré dans le Vercors, dans lequel macère une gousse de vanille bourbon de Madagascar — un savoir-faire que nous avons fait breveter.
Cépages : Muscat Blanc à petits grains 75 %, Clairette Blanche 25 %, menés en culture raisonnée.
Vinification — Méthode Ancestrale : après un débourbage d''une semaine, la fermentation lente est effectuée à partir de levures indigènes sous contrôle de température. La prise de mousse en bouteille se fait à partir du sucre résiduel du raisin, sans adjonction de liqueur de tirage. L''élimination du dépôt intervient au minimum 4 mois après la mise en bouteille, sans liqueur d''expédition, avant l''ajout de la gousse de vanille.
Titrage : 8,5 à 9° suivant les années. Sucre résiduel : 55 à 60 g/l, sans sucres ajoutés. À boire jeune.
Conseil de dégustation : vin naturellement effervescent à la robe pâle et aux reflets argentés. À servir frais, entre amis à l''apéritif ou sur un dessert comme une tarte aux pommes ou une crème brûlée.', '/assets/img/photoBullesVanille.045c4c92.webp', 6),
  ('bulles-de-vanille-rose', 'Bulles de Vanille Rosé', 2690, 'Bulles de Vanille', 'Bulles de Vanille', 'La version rosée de notre effervescent breveté à la vanille bourbon de Madagascar, tout en douceur et en fraîcheur.
Cépages : Muscat Blanc à petits grains 85 %, Clairette Blanche 10 %, Gamay 5 %, menés en culture raisonnée.
Vinification — Méthode Ancestrale : élaborée à partir d''une sélection de terroirs de marnes blanches, exposés sud-ouest, pour favoriser la vivacité plutôt que le côté muscat. Le Gamay subit une macération à froid d''une semaine et son pressurage est effectué en cours de fermentation. La fermentation lente de la totalité des jus est effectuée à partir de levures indigènes sous contrôle de température, avant l''ajout de la gousse de vanille.
Titrage : 7,5 à 8° suivant les années. Sucre résiduel : 55 à 60 g/l, sans sucres ajoutés. À boire jeune.
Conseil de dégustation : vin naturellement effervescent à la robe rose saumon soutenue. À servir frais, entre amis à l''apéritif ou sur un dessert comme une tarte aux fraises ou une salade de fruits.', '/assets/img/photoBullesVanilleRose.6158600e.webp', 7),
  ('coffret-2-verres', 'Coffret + 2 verres', 1200, 'Coffret', 'Coffret', 'Un coffret élégant associant une bouteille de votre choix à deux flûtes de dégustation.
L''idée cadeau prête à offrir, pensée pour un moment à deux.', null, 8),
  ('demi-bouteille-brut', 'Demi-bouteille Brut', 1450, 'Demi-Bouteille', 'Demi-Bouteille', 'Le format idéal pour une dégustation en petit comité.
Même exigence et même savoir-faire que notre cuvée Brut classique, dans un format de 37,5cl.', '/assets/img/photoDemiBouteille.c863b474.webp', 9),
  ('magnum-brut', 'Magnum Brut', 4990, 'Magnum', 'Magnum', 'Le format Magnum (1,5L) permet un vieillissement plus lent et harmonieux du champagne.
Idéal pour marquer les grandes occasions et impressionner vos invités.
Une pièce maîtresse pour votre table de fête.', '/assets/img/photoMagnum.0e0ad256.webp', 10),
  ('ratafia', 'Ratafia', 1650, 'Ratafia', 'Ratafia', 'Vin de liqueur traditionnel champenois, élaboré à partir de moût de raisin et d''eau-de-vie de marc.
Une boisson de caractère à déguster à l''apéritif, bien frais, ou en accompagnement d''un dessert.', '/assets/img/photoRatafia.626eebb0.webp', 11)
on conflict (id) do nothing;

-- ---------- Créer le premier administrateur ----------
-- 1) Supabase > Authentication > Users > Add user (e-mail + mot de passe, cocher « Auto Confirm User »)
-- 2) Remplacer l'e-mail ci-dessous puis exécuter cette ligne :
-- insert into public.admins (user_id) select id from auth.users where email = 'EMAIL_DE_LA_CLIENTE';
