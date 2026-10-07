// Build SEO : pré-rend chaque page en HTML statique (avec le catalogue Google Sheet), génère sitemap.xml, robots.txt, vercel.json.
// Usage : npm install && npm run build   (variable optionnelle : SITE_URL=https://mon-domaine.fr)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { JSDOM, VirtualConsole } from "jsdom";

const root = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));
const SITE_URL = (process.env.SITE_URL || cfg.siteUrl).replace(/\/+$/, "");
const SRC = path.join(root, "src");
const DIST = path.join(root, "dist");
const md5 = (s) => crypto.createHash("md5").update(s).digest("hex").slice(0, 8);
const warnings = [];
const warn = (m) => { warnings.push(m); console.warn("  ⚠ " + m); };

// ---------- 1. dist : assets + fichiers racine ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(SRC, "assets"), path.join(DIST, "assets"), { recursive: true });
fs.cpSync(path.join(SRC, "public"), DIST, { recursive: true });

let js = fs.readFileSync(path.join(SRC, "assets/js/app.js"), "utf8").replaceAll("__SITE_URL__", SITE_URL);
fs.writeFileSync(path.join(DIST, "assets/js/app.js"), js);
const css = fs.readFileSync(path.join(DIST, "assets/css/style.css"), "utf8");
const JS_V = md5(js), CSS_V = md5(css);
const font = (k) => "/assets/fonts/" + fs.readdirSync(path.join(DIST, "assets/fonts")).find((f) => f.startsWith(k + "."));

// ---------- 2. Google Sheet (lu au build pour pré-rendre les vraies données) ----------
const SHEET = (js.match(/var SHEET_CSV_URL = "([^"]*)"/) || [])[1];
let csvText = null;
if (process.env.SHEET_CSV_FILE) {            // mode test local : lit un CSV du disque au lieu de Google
  csvText = fs.readFileSync(process.env.SHEET_CSV_FILE, "utf8");
  console.log("✔ Catalogue lu depuis " + process.env.SHEET_CSV_FILE + " (test local)");
} else if (SHEET) {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
    const r = await fetch(SHEET, { signal: ctl.signal }); clearTimeout(t);
    if (!r.ok) throw new Error("HTTP " + r.status);
    csvText = await r.text();
    if (/<html/i.test(csvText.slice(0, 200))) throw new Error("le Sheet n'est pas publié en CSV");
    console.log(`✔ Google Sheet lu (${csvText.split("\n").length - 1} lignes)`);
  } catch (e) {
    csvText = null;
    warn("Google Sheet illisible au build (" + e.message + ") → pages pré-rendues avec les données par défaut du code.");
  }
}

// ---------- 3. gabarit ----------
const head = fs.readFileSync(path.join(SRC, "head.html"), "utf8")
  .replace("{{FONT_500}}", font("larken-500")).replace("{{FONT_ITALIC}}", font("larken-italic")).replace("{{CSS_V}}", CSS_V);
const bodyHtml = fs.readFileSync(path.join(SRC, "body.html"), "utf8");
const shell = `${head}${bodyHtml}<script id="app-js">${js}</script>\n</body>\n</html>`;

async function prerender(urlPath) {
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => { if (!/Not implemented/.test(e.message)) warn(`jsdom (${urlPath}) : ${e.message}`); });
  const dom = new JSDOM(shell, {
    url: SITE_URL + urlPath, runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.scrollTo = () => {};
      w.fetch = () => csvText ? Promise.resolve({ ok: true, text: () => Promise.resolve(csvText) }) : Promise.reject(new Error("pas de Sheet au build"));
    },
  });
  const w = dom.window;
  if (!w.__rdReady) throw new Error("app.js n'a pas démarré pour " + urlPath);
  await w.__rdReady; await new Promise((r) => setTimeout(r, 30));
  const doc = w.document;
  const info = {
    urlPath,
    title: doc.title,
    desc: doc.querySelector('meta[name="description"]')?.content || "",
    robots: doc.querySelector('meta[name="robots"]')?.content || "",
    canonical: doc.querySelector('link[rel="canonical"]')?.href || "",
    h1: doc.querySelectorAll("h1").length,
    imgNoAlt: [...doc.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    links: [...doc.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    ld: doc.getElementById("ld-json")?.textContent || "",
    products: urlPath === "/" ? w.__RD.products.map((p) => ({ id: p.id, name: p.name, img: w.__RD.productImageUrl(p) })) : null,
  };
  const s = doc.getElementById("app-js");
  s.removeAttribute("id"); s.textContent = ""; s.setAttribute("src", `/assets/js/app.js?v=${JS_V}`); s.setAttribute("defer", "");
  info.html = dom.serialize();
  w.close();
  return info;
}

function outFile(urlPath) {
  if (urlPath.endsWith(".html")) return path.join(DIST, urlPath);
  return path.join(DIST, urlPath, "index.html");
}

// ---------- 4. pages ----------
const home = await prerender("/");
const pageUrls = ["/", "/produits/", "/creation-etiquette/", "/evenements/", "/a-propos/", "/contact/", "/panier/"];
const productUrls = home.products.map((p) => `/produits/${p.id}/`);
const results = [home];
for (const u of [...pageUrls.slice(1), ...productUrls, "/404.html"]) results.push(await prerender(u));
for (const r of results) {
  const f = outFile(r.urlPath);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, r.html);
}
console.log(`✔ ${results.length} pages pré-rendues (${productUrls.length} fiches produit)`);

// ---------- 5. sitemap + robots ----------
const today = new Date().toISOString().slice(0, 10);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const indexable = results.filter((r) => r.urlPath !== "/404.html" && !/^noindex/.test(r.robots));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${indexable.map((r) => {
  const prod = home.products.find((p) => `/produits/${p.id}/` === r.urlPath);
  return `  <url>\n    <loc>${esc(r.canonical)}</loc>\n    <lastmod>${today}</lastmod>` +
    (prod ? `\n    <image:image>\n      <image:loc>${esc(prod.img)}</image:loc>\n      <image:title>${esc(prod.name + " – Ruelle-Dommange")}</image:title>\n    </image:image>` : "") + `\n  </url>`;
}).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /panier/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// ---------- 6. vercel.json ----------
const immutable = "public, max-age=31536000, immutable";
const vercel = {
  cleanUrls: true,
  trailingSlash: true,
  rewrites: [{ source: "/produits/:id", destination: "/produits/index.html" }],
  headers: [
    { source: "/assets/(img|fonts|video|css|js)/(.*)", headers: [{ key: "Cache-Control", value: immutable }] },
    { source: "/assets/og/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    { source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] },
  ],
};
fs.writeFileSync(path.join(DIST, "vercel.json"), JSON.stringify(vercel, null, 2));
fs.writeFileSync(path.join(root, "vercel.json"), JSON.stringify({ ...vercel, installCommand: "npm install", buildCommand: "npm run build", outputDirectory: "dist" }, null, 2));

// ---------- 7. audit ----------
const known = new Set(results.map((r) => r.urlPath));
for (const r of results) {
  const tag = r.urlPath;
  if (r.title.length > 65) warn(`${tag} : title trop long (${r.title.length} car.)`);
  if (!/^noindex/.test(r.robots) && (r.desc.length < 70 || r.desc.length > 160)) warn(`${tag} : meta description ${r.desc.length} car. (idéal 70–160)`);
  if (r.h1 !== 1) warn(`${tag} : ${r.h1} balise(s) <h1> (attendu : 1)`);
  if (r.imgNoAlt) warn(`${tag} : ${r.imgNoAlt} image(s) sans attribut alt`);
  try { JSON.parse(r.ld); } catch { warn(`${tag} : JSON-LD invalide`); }
  for (const h of r.links) {
    if (!h.startsWith("/") || h.startsWith("//")) continue;
    const clean = h.split("#")[0].split("?")[0];
    if (!clean || known.has(clean) || fs.existsSync(path.join(DIST, clean))) continue;
    warn(`${tag} : lien interne cassé → ${h}`);
  }
}
console.log(`✔ sitemap.xml (${indexable.length} URL) · robots.txt · vercel.json`);
console.log(warnings.length ? `\n${warnings.length} avertissement(s) ci-dessus.` : "✔ Audit : aucun avertissement");
