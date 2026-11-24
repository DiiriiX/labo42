/* Labo 42 : synchronisation entre le PC et le téléphone, par un dépôt GitHub privé de l'élève */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, ic} = L;
  const CFG = "labo42_sync", FILE = "progress.json", API = "https://api.github.com/repos/";
  /* Ce qui reste sur chaque appareil : le carnet Bandit (mots de passe), les réglages d'affichage, les caches et l'examen en cours */
  const EXCL = ["lessons", "order", "bandit", "size", "theme", "exam", "editCheckin", "hideNotif", "_t"];
  const SAFE = ["accueil", "parcours", "pratique", "moi", "pc", "tel", "cursus", "oc", "acquis"];

  let cfg = {};
  try { cfg = JSON.parse(localStorage.getItem(CFG) || "{}") || {}; } catch (e) { cfg = {}; }
  const saveCfg = () => { try { localStorage.setItem(CFG, JSON.stringify(cfg)); } catch (e) {} };
  if (!cfg.dev) { cfg.dev = Math.random().toString(36).slice(2, 8); saveCfg(); }
  const on = () => !!(cfg.token && cfg.repo);
  let busy = false, again = false, timer = 0, state = cfg.err ? "err" : "", dirty = false, warned = false;

  /* ---------- Outils ---------- */
  const enc = s => { const b = new TextEncoder().encode(s); let bin = ""; for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(bin); };
  const dec = s => new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/\s/g, "")), c => c.charCodeAt(0)));
  const isObj = x => !!x && typeof x === "object" && !Array.isArray(x);
  const stable = x => JSON.stringify(x, (k, v) => isObj(v) ? Object.keys(v).sort().reduce((o, kk) => { o[kk] = v[kk]; return o; }, {}) : v);
  const pick = st => { const o = {}; Object.keys(st).forEach(k => { if (!EXCL.includes(k) && st[k] !== undefined) o[k] = st[k]; }); return o; };
  const head = (tok, extra) => Object.assign({"Authorization": "Bearer " + tok, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}, extra || {});
  const api = (method, body) => fetch(API + cfg.repo + "/contents/" + FILE, {method, cache: "no-store", headers: head(cfg.token, body ? {"Content-Type": "application/json"} : null), body: body ? JSON.stringify(body) : undefined});
  const httpMsg = s => s === 401 ? "Le jeton n'est plus valide (il a peut-être expiré) : crée-en un nouveau et colle-le ici."
    : s === 403 ? "Le jeton n'a pas le droit d'écrire : il lui faut la permission « Contents : Read and write » sur ce dépôt."
    : s === 404 ? "Dépôt introuvable : vérifie son nom, et que le jeton y a bien accès."
    : "GitHub a répondu une erreur (" + s + "). La synchro réessaiera toute seule.";

  /* ---------- Fusion : on ne perd rien de ce qui a été fait sur l'un ou l'autre appareil ---------- */
  function merge(a, b, bNew, path) {
    if (a === undefined) return b;
    if (b === undefined) return a;
    if (path === "day") {
      if (!isObj(a) || !isObj(b)) return bNew ? b : a;
      if (a.date !== b.date) return String(b.date) > String(a.date) ? b : a;
      const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => { o[k] = merge(a[k], b[k], bNew, "day." + k); }); return o;
    }
    if (path === "lastExam" || /^srs\.[^.]+$/.test(path)) return stable(a) === stable(b) ? a : (bNew ? b : a);
    if (Array.isArray(a) && Array.isArray(b)) {
      const seen = new Set(), out = [];
      a.concat(b).forEach(x => { const k = stable(x); if (!seen.has(k)) { seen.add(k); out.push(x); } });
      if (path === "days") out.sort();
      if (path === "exams") out.sort((x, y) => String((y && y.date) || "").localeCompare(String((x && x.date) || "")));
      return out;
    }
    if (isObj(a) && isObj(b)) { const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => { o[k] = merge(a[k], b[k], bNew, path ? path + "." + k : k); }); return o; }
    if (typeof a === "number" && typeof b === "number") return Math.max(a, b);
    if (typeof a === "boolean" && typeof b === "boolean") return a || b;
    return a === b ? a : (bNew ? b : a);
  }
  function apply(m) {
    const st = L.store();
    Object.keys(m).forEach(k => { st[k] = m[k]; });
    if (!isObj(st.day) || st.day.date !== L.today) st.day = {date: L.today, cards: 0, lesson: false, news: false};
    try { localStorage.setItem("labo42", JSON.stringify(st)); } catch (e) {}
  }

  /* ---------- Un tour de synchro : lire, fusionner, écrire ---------- */
  async function sync(why) {
    if (!on()) return;
    if (busy) { again = true; return; }
    busy = true; state = "run"; paint();
    let changed = false;
    try {
      for (let tries = 0; ; tries++) {
        const r = await api("GET");
        let remote = null, sha = null, rt = 0;
        if (r.ok) { const j = await r.json(); sha = j.sha; const p = JSON.parse(dec(j.content || "")); remote = isObj(p.data) ? p.data : {}; rt = +p.t || 0; }
        else if (r.status !== 404) throw {http: r.status};
        const st = L.store(), local = pick(st), merged = remote ? merge(local, remote, rt > (+st._t || 0), "") : local;
        if (stable(merged) !== stable(local)) { apply(merged); changed = true; }
        if (!remote || stable(merged) !== stable(remote)) {
          const body = {message: "Progression du " + new Date().toLocaleString("fr-FR") + " (appareil " + cfg.dev + ")", content: enc(JSON.stringify({v: 1, t: Date.now(), dev: cfg.dev, data: merged}))};
          if (sha) body.sha = sha;
          const w = await api("PUT", body);
          if ((w.status === 409 || w.status === 422) && tries < 2) continue;
          if (!w.ok) throw {http: w.status};
        }
        break;
      }
      cfg.last = Date.now(); cfg.err = ""; saveCfg(); state = "ok"; dirty = false; warned = false;
    } catch (e) {
      state = "err";
      cfg.err = e && e.http ? httpMsg(e.http) : "Pas de connexion à GitHub pour le moment : la synchro reprendra toute seule.";
      saveCfg();
      if (e && e.http && !warned) { warned = true; L.toast(`${ic("alert")}<span>La synchro ne marche plus : va voir dans Moi.</span>`, 3500); }
    }
    busy = false;
    if (changed) {
      L.refresh();
      const v = L.view();
      if (SAFE.includes(v.v) && L.route) L.route();
      if (why !== "save") L.toast(`${ic("check")}<span>Progression mise à jour depuis ton autre appareil</span>`, 2600);
    }
    paint();
    if (again) { again = false; setTimeout(() => sync("again"), 400); }
  }
  L.syncSoon = () => { if (!on()) return; dirty = true; clearTimeout(timer); timer = setTimeout(() => sync("save"), 4000); };

  /* ---------- Réglage dans l'onglet Moi ---------- */
  const ago = t => { const s = (Date.now() - t) / 1000; return s < 60 ? "à l'instant" : s < 3600 ? "il y a " + Math.floor(s / 60) + " min" : s < 86400 ? "il y a " + Math.floor(s / 3600) + " h" : "le " + new Date(t).toLocaleDateString("fr-FR"); };
  function paint() {
    const box = $("syncBox"); if (!box) return;
    if (!on()) {
      box.innerHTML = `<div class="card">
        <p style="margin-top:0">Pour l'instant, chaque appareil garde sa propre progression. Une fois la synchro activée, l'appli range ta progression dans un dépôt <b>privé</b> de ton GitHub : ton PC et ton téléphone la partagent toute seule.</p>
        <ol class="syncl">
          <li><b>Crée un dépôt privé</b> nommé <code>labo42-sync</code>. Coche « Private » et « Add a README ».<a class="btn ghost sm" href="https://github.com/new?name=labo42-sync&visibility=private" target="_blank" rel="noopener">${ic("bookmark")}Créer le dépôt</a></li>
          <li><b>Crée un jeton d'accès</b> (« fine-grained token ») :<span class="small">Nom : Labo 42 · Expiration : 1 an · Repository access : <i>Only select repositories</i> → labo42-sync · Permissions → Contents : <i>Read and write</i>. Puis « Generate token » et copie-le.</span><a class="btn ghost sm" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">${ic("key")}Créer le jeton</a></li>
          <li><b>Colle le jeton ici</b>, ou le code d'activation copié sur ton autre appareil :</li>
        </ol>
        <input id="syncTok" type="password" placeholder="github_pat_…  ou  L42SYNC-…" autocomplete="off" autocapitalize="off" spellcheck="false">
        <details class="help" style="margin:10px 0"><summary>Nom du dépôt</summary><input id="syncRepo" type="text" value="${esc(cfg.repo || "DiiriiX/labo42-sync")}" autocapitalize="off" spellcheck="false"></details>
        <button class="btn acc full" type="button" data-sy="on">${ic("check")} Activer la synchronisation</button>
        <p class="small" id="syncMsg" style="margin:8px 0 0"></p></div>`;
      return;
    }
    const line = state === "run" ? `${ic("clock")} Synchro en cours…` : state === "err" ? `${ic("alert")} ${esc(cfg.err || "La dernière synchro a échoué.")}` : cfg.last ? `${ic("check2")} Synchronisé ${ago(cfg.last)}` : "Pas encore synchronisé.";
    box.innerHTML = `<div class="card">
      <p style="margin-top:0"><b>Synchronisation activée</b> sur cet appareil.<br><span class="small">Dépôt privé : ${esc(cfg.repo)}</span></p>
      <p class="syncst${state === "err" ? " err" : ""}">${line}</p>
      <button class="btn acc full" type="button" data-sy="now">${ic("save")} Synchroniser maintenant</button>
      <h3 style="margin:18px 0 6px">Ton autre appareil</h3>
      <p class="small" style="margin:0 0 8px">Copie le code d'activation, envoie-le-toi (e-mail, note), puis colle-le dans Moi → Synchroniser sur ton autre appareil. Supprime ensuite le message : ce code ouvre l'accès à ta progression.</p>
      <button class="btn ghost full" type="button" data-sy="code">${ic("copy")} Copier le code d'activation</button>
      <p class="small" style="margin:12px 0 8px">La synchro se fait toute seule : à l'ouverture, quand tu reviens dans l'appli, chaque minute et quelques secondes après chaque progrès. Ton carnet Bandit, la taille du texte et le thème restent propres à chaque appareil.</p>
      <button class="btn ghost full" type="button" data-sy="off">Désactiver sur cet appareil</button></div>`;
  }
  const say = t => { const m = $("syncMsg"); if (m) m.textContent = t; };
  async function activate() {
    const raw = ($("syncTok").value || "").trim();
    let repo = (($("syncRepo") || {}).value || "").trim(), tok = raw;
    if (raw.startsWith("L42SYNC-")) { try { const o = JSON.parse(dec(raw.slice(8))); repo = o.r; tok = o.k; } catch (e) { say("Ce code d'activation n'est pas complet. Recopie-le en entier."); return; } }
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo || "")) { say("Le nom du dépôt doit ressembler à TonPseudo/labo42-sync."); return; }
    if (!/^(github_pat_|ghp_)\w{20,}$/.test(tok)) { say("Le jeton doit commencer par github_pat_ : vérifie que tu l'as copié en entier."); return; }
    say("Vérification auprès de GitHub…");
    try {
      const r = await fetch(API + repo, {cache: "no-store", headers: head(tok)});
      if (!r.ok) { say(httpMsg(r.status)); return; }
      const j = await r.json();
      if (!j.private) { say("Ce dépôt est public : rends-le privé (Settings → Change visibility), ta progression ne doit être visible que par toi."); return; }
    } catch (e) { say("Impossible de joindre GitHub. Vérifie ta connexion et réessaie."); return; }
    cfg.repo = repo; cfg.token = tok; cfg.err = ""; saveCfg();
    await sync("start");
    if (state === "ok") L.toast(`${ic("check")}<span>Synchronisation activée</span>`, 2400);
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-sy]"); if (!b) return;
    const a = b.dataset.sy;
    if (a === "on") activate();
    else if (a === "now") sync("now");
    else if (a === "off") { delete cfg.token; delete cfg.last; cfg.err = ""; state = ""; saveCfg(); paint(); L.toast("Synchro désactivée sur cet appareil. Ta progression y reste.", 2600); }
    else if (a === "code") {
      const code = "L42SYNC-" + enc(JSON.stringify({r: cfg.repo, k: cfg.token}));
      const ok = () => L.toast(`${ic("copy")}<span>Code d'activation copié</span>`, 2000);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, () => L.toast("Copie impossible sur cet appareil.", 2400));
      else L.toast("Copie impossible sur cet appareil.", 2400);
    }
  });

  /* ---------- Quand synchroniser ---------- */
  document.addEventListener("labo:view", ev => { if (ev.detail.v === "moi") paint(); });
  document.addEventListener("visibilitychange", () => {
    if (!on()) return;
    if (document.visibilityState === "visible") { if (!busy && Date.now() - (cfg.last || 0) > 15000) sync("wake"); }
    else if (dirty) { clearTimeout(timer); sync("hide"); }
  });
  setInterval(() => { if (on() && document.visibilityState === "visible" && !busy && Date.now() - (cfg.last || 0) > 55000) sync("tick"); }, 30000);
  paint();
  if (on()) setTimeout(() => sync("start"), 700);
})();
