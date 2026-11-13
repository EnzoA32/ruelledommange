// Relance un déploiement Vercel (pour que Google voie les nouveaux produits/événements).
// Réservé aux administrateurs : le jeton Supabase de l'appelant est vérifié, puis son statut d'admin.
// Variables d'environnement Vercel requises : SUPABASE_URL, SUPABASE_KEY (clé publique), DEPLOY_HOOK_URL.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  const { SUPABASE_URL, SUPABASE_KEY, DEPLOY_HOOK_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_KEY || !DEPLOY_HOOK_URL) return res.status(500).json({ error: "Configuration manquante" });
  const headers = { apikey: SUPABASE_KEY, Authorization: req.headers.authorization || "" };
  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers });
    if (!u.ok) return res.status(401).json({ error: "Non connecté" });
    const user = await u.json();
    const a = await fetch(`${SUPABASE_URL}/rest/v1/admins?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`, { headers });
    const rows = a.ok ? await a.json() : [];
    if (!Array.isArray(rows) || !rows.length) return res.status(403).json({ error: "Accès refusé" });
    const d = await fetch(DEPLOY_HOOK_URL, { method: "POST" });
    return res.status(d.ok ? 200 : 502).json({ ok: d.ok });
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
