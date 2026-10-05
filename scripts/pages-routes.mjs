// GitHub Pages не знает маршрутов React Router: на /info/about без этого он ответит 404
// (страница откроется через 404.html, но с ошибкой в консоли и кодом 404 для поисковиков).
// Кладём копию index.html в папку каждого известного адреса — каждый отвечает 200.
import fs from "node:fs";

const html = fs.readFileSync("dist/index.html", "utf8");
const ids = [...fs.readFileSync("src/data/products.ts", "utf8").matchAll(/^\s*id: '([^']+)'/gm)].map((m) => `product/${m[1]}`);
const slugs = [...fs.readFileSync("src/data/pages.ts", "utf8").matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => `info/${m[1]}`);
const routes = ["checkout", ...ids, ...slugs];
for (const r of routes) {
  fs.mkdirSync(`dist/${r}`, { recursive: true });
  fs.writeFileSync(`dist/${r}/index.html`, html);
}
fs.writeFileSync("dist/404.html", html);
console.log(`pages-routes: ${routes.length} адресов`);
