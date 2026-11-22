/* Labo 42 : Pratique, Moi (série, badges, Check-in, réglages, sauvegarde) et carnet Bandit */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, ic, ART, ICONS} = L;
  const S = () => L.store();
  const root = document.documentElement;

  /* ---------- Réglages appliqués tout de suite ---------- */
  const applyPrefs = () => {
    const s = S();
    if (s.size) root.dataset.size = s.size; else delete root.dataset.size;
    if (s.theme === "light" || s.theme === "dark") root.dataset.theme = s.theme; else delete root.dataset.theme;
  };
  applyPrefs();

  /* ---------- Série de jours ---------- */
  const serie = () => { const days = new Set(S().days || []); let d = L.today, n = 0; if (!days.has(d)) d = L.addDays(d, -1); while (days.has(d)) { n++; d = L.addDays(d, -1); } return n; };
  const record = () => { const days = [...new Set(S().days || [])].sort(); let best = 0, run = 0, prev = null; days.forEach(d => { run = prev && L.addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }); return best; };
  const daysTo = d => Math.round((new Date(d + "T12:00:00") - new Date(L.today + "T12:00:00")) / 864e5);

  /* ---------- Badges ---------- */
  const BADGES = [
    ["premier-cours", "Premier cours", "Termine un cours du parcours", "book", "gs", x => x.cours >= 1],
    ["cinq-cours", "Lancé", "Termine 5 cours", "book", "gs", x => x.cours >= 5],
    ["terminal", "Roi du terminal", "Termine l'étape 1 du parcours", "term", "dk", x => x.etapes[0]],
    ["c-piscine", "Prêt pour le C", "Termine l'étape 2 du parcours", "code", "bs", x => x.etapes[1]],
    ["fiches-10", "Bonne mémoire", "Sache 10 fiches", "cards", "ys", x => x.fiches >= 10],
    ["fiches-30", "Mémoire d'éléphant", "Sache 30 fiches", "cards", "ys", x => x.fiches >= 30],
    ["defis-5", "Explorateur", "Réussis 5 défis du terminal", "term", "dk", x => x.defis >= 5],
    ["defis-all", "Enquêteur SOC", "Réussis tous les défis du terminal", "flag", "rs", x => x.defis >= x.defisTotal],
    ["serie-3", "Régulier", "Travaille 3 jours de suite", "flame", "ys", x => x.serie >= 3],
    ["serie-7", "Une semaine pile", "Travaille 7 jours de suite", "flame", "rs", x => x.serie >= 7],
    ["c-1", "Premier exercice", "Réussis un exercice de C", "code", "bs", x => x.c >= 1],
    ["c-10", "Codeur", "Réussis 10 exercices de C", "code", "bs", x => x.c >= 10],
    ["norme", "Code propre", "Écris un code sans faute de Norme", "check", "gs", x => x.norm >= 1],
    ["examen", "Examen blanc", "Fais 50 points ou plus à un examen blanc", "clock", "rs", x => x.exam >= 50],
    ["veilleur", "Veilleur", "Lis 10 actus", "news", "rs", x => x.lues >= 10],
    ["bandit", "Bandit", "Coche 5 niveaux dans le carnet Bandit", "key", "gs", x => x.bandit >= 5],
    ["c-30", "Piscineux", "Réussis 30 exercices de C", "code", "rs", x => x.c >= 30],
    ["jeux-10", "Joueur", "Joue 10 parties d'entraînement", "spark", "ys", x => x.parties >= 10],
    ["sans-faute", "Sans faute", "Fais 10 / 10 à un entraînement", "check", "gs", x => x.sansFaute],
    ["touche-a-tout", "Touche-à-tout", "Essaie tous les entraînements", "sliders", "bs", x => x.essayes >= x.nbJeux],
    ["parcours", "Parcours terminé", "Termine tous les cours du parcours", "flag", "rs", x => x.cours >= x.coursTotal]
  ];
  const medal = (icon, tone) => `<svg class="il" viewBox="0 0 64 64" aria-hidden="true"><path d="M23 42l-6 18 9-4 6 6 3-18z" class="r o" style="stroke-width:1.8"/><path d="M41 42l6 18-9-4-6 6-3-18z" class="b o" style="stroke-width:1.8"/><circle cx="32" cy="28" r="22" class="y o"/><circle cx="32" cy="28" r="15.5" class="${tone} o" style="stroke-width:1.6"/><g transform="translate(20 16)" class="bi${tone === "dk" ? " bk" : ""}">${ICONS[icon] || ""}</g></svg>`;
  const allStats = () => {
    const s = S(), x = L.stats(), a = s.atelier || {};
    const j = Object.values(s.jeux || {});
    return Object.assign(x, {serie: serie(), c: Object.keys(a.done || {}).length, norm: a.norm || 0, exam: (s.exams || []).reduce((m, e) => Math.max(m, e.score), 0), bandit: Object.values(s.bandit || {}).filter(b => b && b.ok).length,
      parties: j.reduce((n, g) => n + (g.plays || 0), 0), sansFaute: j.some(g => g.best >= 10), essayes: j.filter(g => g.plays).length, nbJeux: (L.GAMES || []).length || 11, examens: (s.exams || []).length, notes: Object.keys(s.notes || {}).length});
  };
  function checkBadges() {
    const s = S(), x = allStats(), first = !s.badges;
    if (!s.badges) s.badges = {};
    const fresh = BADGES.filter(b => b[5](x) && !s.badges[b[0]]);
    if (!fresh.length) { if (first) L.save(); return; }
    fresh.forEach(b => { s.badges[b[0]] = L.today; });
    L.save();
    if (!first) { const b = fresh[0]; L.toast(`${medal(b[3], b[4])}<span>Nouveau badge : ${esc(b[1])} !</span>`, 4200); }
  }

  /* ---------- Accueil : petites pastilles ---------- */
  function homeChips() {
    const box = $("homeChips"); if (!box) return;
    const n = serie(), c = S().checkin, j = c ? daysTo(c) : null;
    box.innerHTML = (n ? `<a class="hchip fire" href="#moi">${ic("flame")}${n} jour${n > 1 ? "s" : ""} de suite</a>` : "")
      + (c && j >= 0 ? `<a class="hchip cal" href="#moi">${ic("cal")}${j === 0 ? "Check-in aujourd'hui !" : "J-" + j + " avant ton Check-in"}</a>` : !c ? `<a class="hchip cal" href="#moi">${ic("cal")}Ajoute la date de ton Check-in</a>` : "");
  }

  /* ---------- Pratique ---------- */
  function renderHub() {
    const s = S(), x = allStats(), best = (s.exams || []).reduce((m, e) => Math.max(m, e.score), -1), total = (L.EXOS || []).length || 20;
    const card = (href, art, t, sub, n, max) => `<a class="hubc" href="${href}"><span class="hart">${ART[art]}</span><span class="hubt"><b>${t}</b><small>${sub}</small>${max ? `<span class="bar"><i style="width:${Math.round(n / max * 100)}%"></i></span>` : ""}</span><span class="chev">›</span></a>`;
    $("hub").innerHTML = card("#terminal", "terminal", "Terminal", `${x.defis} / ${x.defisTotal} défis, du premier ls à l'enquête SOC`, x.defis, x.defisTotal)
      + card("#atelier", "atelier", "Atelier C", `${x.c} / ${total} exercices façon Piscine, avec mini norminette`, x.c, total)
      + card("#jeux", "jeux", "Entraînements", `${x.parties} partie${x.parties > 1 ? "s" : ""} · 11 mini-jeux, questions tirées au hasard`, x.essayes, x.nbJeux)
      + card("#examen", "examen", "Examen blanc", best >= 0 ? `Meilleur score : ${best} / 100` : "Chronométré, comme les exams de 42", 0, 0)
      + card("#bandit", "bandit", "Carnet Bandit", `${x.bandit} / 34 niveaux cochés · tes notes et mots de passe`, x.bandit, 34)
      + card("#memos", "memos", "Mémos", "Vim, Git, terminal, C, Norme, erreurs, réseau, cyber", 0, 0);
  }

  /* ---------- Moi ---------- */
  function renderMoi() {
    const s = S(), n = serie(), r = record(), c = s.checkin, j = c ? daysTo(c) : null, x = allStats();
    let cd;
    if (c && !s.editCheckin) {
      const dateTxt = new Date(c + "T12:00:00").toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
      cd = `<div class="cdown"><span class="cdn">${j > 0 ? "J-" + j : j === 0 ? "Jour J" : "Fait"}</span><div><b>${j > 0 ? "avant ton Check-in" : j === 0 ? "C'est aujourd'hui, bonne chance !" : "Ton Check-in est passé"}</b><small>${esc(dateTxt)}</small><button class="link" type="button" data-mo="editci">Modifier la date</button></div></div>`;
    } else cd = `<div class="cdown"><span class="cdn">${ic("cal")}</span><div><b>Ton Check-in à 42 Lyon</b><small>Ajoute la date dès que tu la reçois : l'appli fera le compte à rebours.</small><div class="row" style="margin-top:8px"><input type="date" id="ciDate" value="${esc(c || "")}" aria-label="Date du Check-in"><button class="btn acc" type="button" data-mo="saveci">OK</button></div>${c ? `<button class="link" type="button" data-mo="delci">Effacer la date</button>` : ""}</div></div>`;
    const dow = (new Date(L.today + "T12:00:00").getDay() + 6) % 7, start = L.addDays(L.today, -dow - 12 * 7), act = new Set(s.days || []);
    let heat = "";
    for (let r = 0; r < 7; r++) for (let c = 0; c < 13; c++) { const d = L.addDays(start, c * 7 + r); heat += d > L.today ? `<i style="visibility:hidden"></i>` : `<i class="${act.has(d) ? "on" : ""}${d === L.today ? " today" : ""}" title="${d}"></i>`; }
    const nb = (n, t) => `<div><b>${n}</b><span>${t}</span></div>`;
    const notes = Object.entries(s.notes || {}).filter(([id]) => L.TOPIC[id]);
    const extra = `<div class="card"><h3 style="margin-top:0">${ic("cal")}Ton activité, 13 dernières semaines</h3><div class="heat">${heat}</div><div class="heatl"><span>il y a 3 mois</span><span>${act.size} jour${act.size > 1 ? "s" : ""} actif${act.size > 1 ? "s" : ""}</span><span>aujourd'hui</span></div>
      <div class="nums">${nb(x.cours + " / " + x.coursTotal, "cours terminés")}${nb(x.fiches + " / " + x.fichesTotal, "fiches sues")}${nb(x.defis + " / " + x.defisTotal, "défis du terminal")}${nb(x.c + " / " + ((L.EXOS || []).length || 54), "exercices de C")}${nb(x.parties, "parties d'entraînement")}${nb(x.examens, "examens blancs")}${nb(x.lues, "actus lues")}${nb(x.bandit + " / 34", "niveaux de Bandit")}</div></div>`
      + (notes.length ? `<h2>Tes notes</h2>${notes.map(([id, t]) => `<div class="notec"><a class="link" href="#cours-${id}">${esc(L.TOPIC[id].t)}</a><p>${esc(t)}</p></div>`).join("")}` : "");
    $("moiTop").innerHTML = `<div class="mgrid"><div class="mstat fire">${ic("flame")}<b>${n}</b><span>jour${n > 1 ? "s" : ""} de suite</span><small>record : ${r}</small></div><div class="mstat">${ic("medal")}<b>${Object.keys(s.badges || {}).length}</b><span>badges sur ${BADGES.length}</span><small>${x.c} exercice${x.c > 1 ? "s" : ""} de C</small></div></div>${cd}${extra}`;
    const got = s.badges || {};
    $("badges").innerHTML = `<div class="badges">${BADGES.map(b => `<div class="badge${got[b[0]] ? "" : " lock"}">${medal(b[3], b[4])}<b>${esc(b[1])}</b><span>${got[b[0]] ? "Obtenu" : esc(b[2])}</span></div>`).join("")}</div>`;
    const seg = (key, opts, val) => `<div class="seg" data-pref="${key}">${opts.map(o => `<button type="button" data-v="${o[0]}" class="${String(val) === String(o[0]) ? "on" : ""}">${o[1]}</button>`).join("")}</div>`;
    $("reglages").innerHTML = `<div class="card"><p class="small" style="margin:0 0 6px">${ic("sliders")} Taille du texte</p>${seg("size", [[0, "Normal"], [1, "Grand"], [2, "Très grand"]], s.size || 0)}
      <p class="small" style="margin:16px 0 6px">${ic("eye")} Thème</p>${seg("theme", [["auto", "Auto"], ["light", "Clair"], ["dark", "Sombre"]], s.theme || "auto")}</div>`;
    $("sauvegarde").innerHTML = `<div class="card"><p>Ta progression est gardée sur ce téléphone, dans ${L.inClaude ? "cette version de Labo 42" : "l'appli"}. Garde un code de sauvegarde : il te permet de tout récupérer ailleurs, ou après avoir changé de téléphone.</p>
      <button class="btn acc full" type="button" data-mo="export">${ic("copy")} Copier mon code de sauvegarde</button>
      <p class="small" id="expNote" style="margin-top:6px">Le code contient aussi ton carnet Bandit : ne le partage avec personne.</p>
      <details class="help" style="margin-top:14px"><summary>Restaurer une sauvegarde</summary><p class="small">Colle ici un code de sauvegarde. Il remplace la progression de ${L.inClaude ? "cette version" : "cette appli"}.</p><textarea id="impCode" rows="3" placeholder="L42-…" autocapitalize="off" spellcheck="false"></textarea><button class="btn ghost full" type="button" data-mo="import">Restaurer</button><p class="small" id="impNote"></p></details></div>`;
  }
  const KEEP = ["known", "days", "seen", "srs", "term", "atelier", "exams", "lastExam", "bandit", "read", "later", "checkin", "size", "theme", "badges", "free"];
  const toCode = () => { const s = S(), o = {v: 1}; KEEP.forEach(k => { if (s[k] !== undefined) o[k] = s[k]; }); return "L42-" + btoa(unescape(encodeURIComponent(JSON.stringify(o)))); };
  const fromCode = t => { const m = String(t).trim().replace(/\s+/g, ""); if (!m.startsWith("L42-")) throw 0; const o = JSON.parse(decodeURIComponent(escape(atob(m.slice(4))))); if (!o || typeof o !== "object" || !Array.isArray(o.days)) throw 0; return o; };
  const copyText = async txt => { try { await navigator.clipboard.writeText(txt); return true; } catch (e) { const t = document.createElement("textarea"); t.value = txt; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (er) {} t.remove(); return ok; } };
  let impConfirm = 0;

  /* ---------- Carnet Bandit ---------- */
  const NB = 34;
  let bSave = null;
  function renderBandit() {
    const s = S(); if (!s.bandit) s.bandit = {};
    const b = s.bandit, done = Object.values(b).filter(x => x && x.ok).length;
    const firstTodo = [...Array(NB).keys()].find(k => !(b[k] && b[k].ok));
    $("banditBox").innerHTML = `<div class="card"><p style="margin:0 0 6px"><b>${done} / ${NB} niveaux réussis</b></p><div class="bar"><i style="width:${Math.round(done / NB * 100)}%"></i></div>
      <p class="small" style="margin:10px 0 4px">Pour te connecter au niveau N :</p><pre class="proto sm">ssh banditN@bandit.labs.overthewire.org -p 2220</pre>
      <a class="link" href="https://overthewire.org/wargames/bandit/bandit0.html" target="_blank" rel="noopener">Le site de Bandit (OverTheWire)</a>
      <p class="small" style="margin:8px 0 0">${ic("key")} Tout reste sur ce téléphone, rien n'est envoyé. Ne partage pas tes mots de passe : c'est la règle du jeu.</p></div>
      <div class="blist">${[...Array(NB).keys()].map(k => { const e = b[k] || {}; return `<details class="blv${e.ok ? " ok" : ""}"${k === firstTodo ? " open" : ""}><summary><span class="pnum${e.ok ? " done" : ""}">${e.ok ? "✓" : k}</span><span><b>Niveau ${k} → ${k + 1}</b>${e.note ? `<small>${esc(e.note.slice(0, 60))}${e.note.length > 60 ? "…" : ""}</small>` : ""}</span></summary>
        <label class="chk"><input type="checkbox" data-bk="${k}" data-f="ok"${e.ok ? " checked" : ""}> Niveau réussi</label>
        <p class="small" style="margin:10px 0 4px">Mot de passe de bandit${k + 1}</p>
        <div class="pw"><input type="password" data-bk="${k}" data-f="pw" value="${esc(e.pw || "")}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Mot de passe de bandit${k + 1}"><button class="key" type="button" data-bshow="${k}" aria-label="Afficher le mot de passe">${ic("eye")}</button><button class="key" type="button" data-bcopy="${k}" aria-label="Copier le mot de passe">${ic("copy")}</button></div>
        <p class="small" style="margin:10px 0 4px">Comment j'ai fait</p>
        <textarea rows="3" data-bk="${k}" data-f="note" placeholder="Les commandes utilisées, ce que j'ai appris…">${esc(e.note || "")}</textarea>
        <a class="link" href="https://overthewire.org/wargames/bandit/bandit${k + 1}.html" target="_blank" rel="noopener">L'énoncé officiel du niveau</a></details>`; }).join("")}</div>`;
  }

  /* ---------- Événements ---------- */
  document.addEventListener("click", async e => {
    const seg = e.target.closest(".seg[data-pref] button");
    if (seg) { const s = S(), k = seg.parentElement.dataset.pref, v = seg.dataset.v; if (k === "size") s.size = +v || 0; else s.theme = v === "auto" ? undefined : v; L.save(); applyPrefs(); seg.parentElement.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === seg)); return; }
    const sh = e.target.closest("[data-bshow]"); if (sh) { const i = sh.parentElement.querySelector("input"); i.type = i.type === "password" ? "text" : "password"; return; }
    const cp = e.target.closest("[data-bcopy]"); if (cp) { const i = cp.parentElement.querySelector("input"); const ok = i.value && await copyText(i.value); L.toast(`${ic("copy")}<span>${ok ? "Mot de passe copié" : "Rien à copier"}</span>`, 1800); return; }
    const b = e.target.closest("[data-mo]"); if (!b) return;
    const s = S(), act = b.dataset.mo;
    if (act === "editci") { s.editCheckin = true; renderMoi(); }
    else if (act === "saveci") { const v = $("ciDate").value; if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { s.checkin = v; delete s.editCheckin; L.save(); renderMoi(); homeChips(); L.toast(`${ic("cal")}<span>Date enregistrée, le compte à rebours est lancé !</span>`); } }
    else if (act === "delci") { delete s.checkin; delete s.editCheckin; L.save(); renderMoi(); homeChips(); }
    else if (act === "export") { const ok = await copyText(toCode()); $("expNote").textContent = ok ? "Code copié ! Garde-le dans tes notes. Il contient aussi ton carnet Bandit : ne le partage avec personne." : "Copie impossible sur ce navigateur."; }
    else if (act === "import") {
      let o; try { o = fromCode($("impCode").value); } catch (er) { $("impNote").textContent = "Ce code n'est pas valide. Vérifie qu'il commence par L42- et qu'il est complet."; return; }
      if (Date.now() - impConfirm > 5000) { impConfirm = Date.now(); b.textContent = "Sûr ? Touche encore pour tout remplacer"; return; }
      KEEP.forEach(k => { if (o[k] !== undefined) s[k] = o[k]; else delete s[k]; });
      L.save(); $("impNote").textContent = "Progression restaurée ! L'appli redémarre…"; setTimeout(() => location.reload(), 900);
    }
  });
  const bandEv = e => {
    const t = e.target; if (!t.dataset || t.dataset.bk === undefined) return;
    if ((t.dataset.f === "ok") !== (e.type === "change")) return;
    const s = S(); if (!s.bandit) s.bandit = {};
    const k = t.dataset.bk, f = t.dataset.f, cur = s.bandit[k] || (s.bandit[k] = {});
    if (f === "ok") { cur.ok = t.checked; t.closest(".blv").classList.toggle("ok", t.checked); const n = t.closest(".blv").querySelector(".pnum"); n.classList.toggle("done", t.checked); n.textContent = t.checked ? "✓" : k; L.active(); }
    else { cur[f] = t.value.slice(0, f === "pw" ? 100 : 2000); clearTimeout(bSave); bSave = setTimeout(() => L.save(), 400); }
  };
  document.addEventListener("input", bandEv);
  document.addEventListener("change", bandEv);

  const show = ({v}) => {
    if (v === "pratique") renderHub();
    else if (v === "moi") { delete S().editCheckin; renderMoi(); }
    else if (v === "bandit") renderBandit();
  };
  document.addEventListener("labo:view", ev => show(ev.detail));
  document.addEventListener("labo:refresh", () => { checkBadges(); homeChips(); const v = L.view().v; if (v === "pratique") renderHub(); if (v === "moi" && $("badges")) { const got = S().badges || {}; document.querySelectorAll("#badges .badge").forEach((el, i) => el.classList.toggle("lock", !got[BADGES[i][0]])); } });
  checkBadges(); homeChips(); show(L.view());
})();
