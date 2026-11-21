// Envoie le message de push/outbox.json à chaque téléphone de push/subscriptions.json.
const fs = require("fs");
const webpush = require("web-push");
const priv = process.env.VAPID_PRIVATE_KEY;
if (!priv) { console.log("Le secret VAPID_PRIVATE_KEY manque : rien n'est envoyé."); process.exit(0); }
const pub = fs.readFileSync("push/vapid-public.txt", "utf8").trim();
webpush.setVapidDetails("https://diiriix.github.io/labo42/", pub, priv);
const subs = JSON.parse(fs.readFileSync("push/subscriptions.json", "utf8"));
const msg = JSON.parse(fs.readFileSync("push/outbox.json", "utf8"));
if (!Array.isArray(subs) || !subs.length) { console.log("Aucun téléphone abonné."); process.exit(0); }
(async () => {
  for (const s of subs) {
    try { await webpush.sendNotification(s, JSON.stringify(msg), {TTL: 86400, urgency: "high"}); console.log("Notification envoyée."); }
    catch (e) { console.log("Échec :", e.statusCode, e.body); }
  }
})();
