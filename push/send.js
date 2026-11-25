// Envoie le message de push/outbox.json à chaque téléphone de push/subscriptions.json.
const fs = require("fs");
const webpush = require("web-push");
const priv = process.env.VAPID_PRIVATE_KEY;
if (!priv) { console.log("Le secret VAPID_PRIVATE_KEY manque : rien n'est envoyé."); process.exit(0); }
const pub = fs.readFileSync("push/vapid-public.txt", "utf8").trim();
webpush.setVapidDetails("https://diiriix.github.io/labo42/", pub, priv);
const subs = JSON.parse(fs.readFileSync("push/subscriptions.json", "utf8"));
const RAPPELS = [
  "Dimanche tranquille : 10 minutes de fiches suffisent pour garder tout en tête.",
  "Nouvelle semaine ! Tes fiches du jour t'attendent dans Labo 42.",
  "Petite séance du soir : tes fiches, puis un défi du terminal ?",
  "C'est l'heure de ta séance : quelques fiches et tu es tranquille.",
  "Tes fiches du jour sont prêtes. La régularité bat l'intensité.",
  "Un cours de ton parcours ce soir ? Le suivant t'attend.",
  "Fin de semaine : révise tes fiches avant de souffler."
];
// Pas de notification la nuit : GitHub lance parfois les tâches planifiées avec des heures de retard.
const parisMin = d => { const p = new Intl.DateTimeFormat("fr-FR", {timeZone: "Europe/Paris", hour: "numeric", minute: "numeric", hourCycle: "h23"}).formatToParts(d); return +p.find(x => x.type === "hour").value * 60 + +p.find(x => x.type === "minute").value; };
const maintenant = parisMin(new Date());
if (process.env.FORCER !== "1" && (maintenant < 7 * 60 || maintenant >= 23 * 60)) { console.log("Il fait nuit à Paris (" + Math.floor(maintenant / 60) + " h) : pas de notification."); process.exit(0); }
if (process.env.RAPPEL === "1" && process.env.FORCER !== "1" && (maintenant < 18 * 60 || maintenant > 21 * 60 + 30)) { console.log("Le rappel du soir arrive trop tard (ou trop tôt) : pas de rappel."); process.exit(0); }
if (process.env.RAPPEL === "1") {
  const jour = new Date().toLocaleDateString("sv-SE", {timeZone: "Europe/Paris"});
  let derniers = [];
  try { derniers = JSON.parse(fs.readFileSync("resume.json", "utf8")); } catch (e) {}
  if (Array.isArray(derniers) && derniers.some(r => r && r.date === jour)) { console.log("Le résumé du jour est déjà envoyé : pas de rappel."); process.exit(0); }
}
const msg = process.env.RAPPEL === "1"
  ? {id: "rappel", title: "Labo 42", body: RAPPELS[new Date().getDay()], url: "./#reviser"}
  : JSON.parse(fs.readFileSync("push/outbox.json", "utf8"));
if (!Array.isArray(subs) || !subs.length) { console.log("Aucun téléphone abonné."); process.exit(0); }
(async () => {
  for (const s of subs) {
    try { await webpush.sendNotification(s, JSON.stringify(msg), {TTL: 86400, urgency: "high"}); console.log("Notification envoyée."); }
    catch (e) { console.log("Échec :", e.statusCode, e.body); }
  }
})();
