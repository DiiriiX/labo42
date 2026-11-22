/* Labo 42 : le programme du cours OpenClassrooms et le cursus de 42 */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, ic} = L;
  const S = () => L.store();

  /* ---------- Le cours « Apprenez à programmer en C » d'OpenClassrooms ---------- */
  const OC_URL = "https://openclassrooms.com/fr/courses/19980-apprenez-a-programmer-en-c/";
  const OC = [
    {t: "Faites vos premiers pas avec le langage C", quiz: "exercises/4396", ch: [
      ["Tirez un maximum de ce cours", "7669151-tirez-un-maximum-de-ce-cours", []],
      ["Installez les outils nécessaires pour programmer", "7669216-installez-les-outils-necessaires-pour-programmer", ["compilation"]],
      ["Écrivez votre premier programme", "7669321-ecrivez-votre-premier-programme", ["compilation", "write"]],
      ["Déclarez des variables", "7669586-declarez-des-variables", ["variables"]],
      ["Faites des calculs avec des variables", "7669936-faites-des-calculs-avec-des-variables", ["calculs"]]]},
    {t: "Organisez votre code grâce aux conditions, boucles et fonctions", quiz: "exercises/172", ch: [
      ["Structurez votre code avec les conditions", "14612-structurez-votre-code-avec-les-conditions", ["conditions"]],
      ["Répétez des instructions grâce aux boucles", "14722-repetez-des-instructions-grace-aux-boucles", ["boucles"]],
      ["Découpez votre programme en fonctions", "14997-decoupez-votre-programme-en-fonctions", ["fonctions"]],
      ["Initiez-vous à la programmation modulaire", "7528516-initiez-vous-a-la-programmation-modulaire", ["modulaire"]]]},
    {t: "Utilisez les pointeurs et manipulez les tableaux", quiz: "exercises/4397", ch: [
      ["Créez et initialisez des pointeurs", "7672176-creez-et-initialisez-des-pointeurs", ["pointeurs"]],
      ["Envoyez des pointeurs", "7672401-envoyez-des-pointeurs", ["pointeurs"]],
      ["Créez des variables de type « tableaux »", "7672506-creez-des-variables-de-type-tableaux", ["chaines"]],
      ["Manipulez du texte avec les chaînes de caractères", "7672681-manipulez-du-texte-avec-les-chaines-de-caracteres", ["chaines", "ascii"]],
      ["Utilisez les directives du préprocesseur", "7673041-utilisez-les-directives-du-preprocesseur", ["preprocesseur"]]]},
    {t: "Allez plus loin pour programmer comme un pro", quiz: "exercises/174", ch: [
      ["Créez vos propres types de variables", "16119-creez-vos-propres-types-de-variables", ["structures"]],
      ["Manipulez des fichiers à l'aide de fonctions", "16421-manipulez-des-fichiers-a-l-aide-de-fonctions", ["fichiers_c"]],
      ["Créez des variables grâce à l'allocation dynamique", "16595-creez-des-variables-grace-a-l-allocation-dynamique", ["malloc"]],
      ["Sécurisez la saisie de texte", "16993-securisez-la-saisie-de-texte", ["saisie"]]]},
    {t: "Bonus : structurez vos données", ch: [
      ["Stockez les données avec les listes chaînées", "19733-stockez-les-donnees-avec-les-listes-chainees", ["listes"]],
      ["Contrôlez l'ajout d'éléments avec les piles et les files", "19868-controlez-l-ajout-d-elements-avec-les-piles-et-les-files", ["piles"]],
      ["Stockez et retrouvez des données grâce aux tables de hachage", "19978-stockez-et-retrouvez-des-donnees-grace-aux-tables-de-hachage", ["tables"]]]}
  ];
  const OC_TOTAL = OC.reduce((n, p) => n + p.ch.length, 0);
  L.OC_TOTAL = OC_TOTAL;
  const ocRead = () => { const s = S(); if (!s.oc) s.oc = {}; return s.oc; };

  const lessonChip = id => L.TOPIC[id] ? `<a class="chip${S().seen[id] ? " seen" : ""}" href="#cours-${id}">${S().seen[id] ? ic("check2") : ic("book")} ${esc(L.TOPIC[id].t)}</a>` : "";
  const exoChip = id => { const a = S().atelier, ok = !!(a && a.done && a.done[id]); return `<a class="chip ex${ok ? " seen" : ""}" href="#atelier-${id}">${ok ? ic("check2") : ic("code")} ${esc(id)}</a>`; };
  const linkChip = (label, href, icn) => `<a class="chip" href="${href}">${ic(icn || "flag")} ${esc(label)}</a>`;

  function renderOC() {
    const r = ocRead(), n = Object.keys(r).length;
    let k = 0;
    $("ocBox").innerHTML = `<button class="back" type="button" data-go="#parcours">← Le parcours</button>
      <div class="hero"><div><h1>Le cours de C</h1><p class="sub">Le programme gratuit d'OpenClassrooms « Apprenez à programmer en C », chapitre par chapitre.</p></div><span class="hart">${L.ART.oc}</span></div>
      <div class="card" style="margin-top:14px"><p style="margin:0"><b>${n} / ${OC_TOTAL} chapitres lus</b></p><div class="bar"><i style="width:${Math.round(n / OC_TOTAL * 100)}%"></i></div>
      <p class="small" style="margin:8px 0 0">Pour chaque chapitre : lis-le sur OpenClassrooms, puis fais le cours de Labo 42 qui va avec. Mêmes notions, d'autres mots et d'autres exemples : c'est en voyant une idée expliquée deux fois qu'on la comprend vraiment. Les cours de Labo 42 sont écrits pour l'appli, rien n'est recopié.</p>
      <a class="link" href="${OC_URL.replace(/\/$/, "")}" target="_blank" rel="noopener">Ouvrir le cours sur OpenClassrooms</a></div>
      ${OC.map((p, pi) => `<section class="etape"><div class="etape-h"><span class="num">${pi + 1}</span><div><h2>${esc(p.t)}</h2><p class="small" style="margin:0">Partie ${pi + 1} · ${p.ch.filter((_, ci) => r[pi + "." + ci]).length} / ${p.ch.length} lus</p></div></div>
        ${p.ch.map((c, ci) => { k++; const key = pi + "." + ci, done = !!r[key]; return `<div class="occ${done ? " done" : ""}"><label class="chk"><input type="checkbox" data-oc="${key}"${done ? " checked" : ""}><span><b>${k}. ${esc(c[0])}</b></span></label>
          <div class="chips wrapc"><a class="chip" href="${OC_URL + c[1]}" target="_blank" rel="noopener">${ic("news")} Lire sur OpenClassrooms</a>${c[2].map(lessonChip).join("")}</div></div>`; }).join("")}
        ${p.quiz ? `<a class="link" href="${OC_URL + p.quiz}" target="_blank" rel="noopener">Le quiz de la partie ${pi + 1}</a>` : ""}</section>`).join("")}
      <div class="note">Les exercices pratiques correspondants sont dans l'atelier C : niveaux 1 à 7 pour les parties 1 à 4, niveaux 8 et 9 pour les projets et les listes.</div>`;
  }

  /* ---------- Le cursus de 42 ---------- */
  const PISCINE = [
    {t: "Shell00", d: "Les bases du terminal : fichiers, droits, archives, premiers pas avec Git.", c: ["fichiers", "permissions", "git"], l: [["Défis du terminal", "#terminal", "term"]]},
    {t: "Shell01", d: "Des commandes plus fines et tes premiers scripts.", c: ["redirections", "scripts", "environnement"], l: [["Mémo terminal", "#memos-terminal", "book"]]},
    {t: "C00", d: "write, les boucles, les combinaisons de chiffres, ft_putnbr.", c: ["compilation", "write", "boucles", "ascii"], e: ["ft_putchar", "ft_print_alphabet", "ft_print_reverse_alphabet", "ft_print_numbers", "ft_is_negative", "ft_print_comb", "ft_print_comb2", "ft_putnbr", "ft_print_combn"]},
    {t: "C01", d: "Les pointeurs : écrire à une adresse, échanger, trier un tableau.", c: ["pointeurs"], e: ["ft_ft", "ft_ultimate_ft", "ft_swap", "ft_div_mod", "ft_ultimate_div_mod", "ft_putstr", "ft_strlen", "ft_rev_int_tab", "ft_sort_int_tab"]},
    {t: "C02", d: "Les chaînes : copier, tester leur contenu, changer la casse.", c: ["chaines", "ascii"], e: ["ft_strcpy", "ft_strncpy", "ft_str_is_alpha", "ft_str_is_numeric", "ft_str_is_printable", "ft_strupcase", "ft_strlowcase", "ft_strcapitalize"]},
    {t: "C03", d: "Comparer, concaténer et chercher dans des chaînes.", c: ["chaines"], e: ["ft_strcmp", "ft_strncmp", "ft_strcat", "ft_strncat", "ft_strstr"]},
    {t: "C04", d: "Afficher et convertir des nombres, dans toutes les bases.", c: ["fonctions", "ascii"], e: ["ft_putnbr", "ft_atoi", "ft_putnbr_base"]},
    {t: "C05", d: "La récursivité et un peu de maths.", c: ["fonctions", "calculs"], e: ["ft_iterative_factorial", "ft_recursive_factorial", "ft_iterative_power", "ft_recursive_power", "ft_fibonacci", "ft_sqrt", "ft_is_prime", "ft_find_next_prime"]},
    {t: "C06", d: "Des programmes qui lisent leurs arguments.", c: ["chaines"], e: ["ft_print_program_name", "ft_print_params", "ft_rev_params", "ft_sort_params"]},
    {t: "C07", d: "La mémoire dynamique avec malloc.", c: ["malloc"], e: ["ft_strdup", "ft_range", "ft_ultimate_range", "ft_strjoin"]},
    {t: "C08", d: "Headers, macros et structures.", c: ["modulaire", "preprocesseur", "structures"], e: ["ft_point"]},
    {t: "C09", d: "Ta première bibliothèque, avec un Makefile.", c: ["bibliotheque", "makefile"]},
    {t: "C10", d: "Lire des fichiers et recoder des outils du terminal.", c: ["fichiers_c", "saisie"], e: ["mini_cat"]},
    {t: "C11", d: "Les pointeurs sur fonctions.", c: ["ptrfonctions"], e: ["ft_foreach", "ft_map"]},
    {t: "C12", d: "Les listes chaînées.", c: ["listes"], e: ["ft_create_elem", "ft_list_push_front", "ft_list_size", "ft_list_last", "ft_list_clear"]},
    {t: "C13", d: "Les arbres binaires : la suite logique des listes. Pas encore de cours dans Labo 42.", c: ["listes", "structures"]},
    {t: "Rushs et BSQ", d: "Des projets en groupe le week-end, puis BSQ : trouver le plus grand carré dans une carte lue dans un fichier.", c: ["fichiers_c", "malloc", "structures"]},
    {t: "Examens", d: "Chaque semaine, puis l'examen final : seul, sans internet, corrigé automatiquement.", c: [], l: [["Examen blanc", "#examen", "clock"], ["Que va afficher ce code ?", "#jeux-predire", "spark"]]}
  ];
  const RANGS = [
    {r: 0, p: [{t: "Libft", d: "Recoder une partie de la bibliothèque C et la ranger dans libft.a. Tu t'en serviras dans presque tous les projets suivants.", c: ["bibliotheque", "makefile", "chaines", "malloc", "listes"]}]},
    {r: 1, p: [
      {t: "ft_printf", d: "Recoder printf avec les conversions principales.", c: ["variadiques", "ptrfonctions"]},
      {t: "get_next_line", d: "Lire un fichier ligne par ligne.", c: ["lecture", "fichiers_c", "preprocesseur"]},
      {t: "Born2beroot", d: "Installer et sécuriser un serveur Linux dans une machine virtuelle.", c: ["serveur", "utilisateurs", "services", "scripts", "paquets"]}]},
    {r: 2, p: [
      {t: "push_swap", d: "Trier des nombres avec deux piles et le moins d'opérations possible.", c: ["piles", "listes"]},
      {t: "minitalk ou pipex", d: "Faire communiquer deux programmes par signaux, ou reproduire les pipes du shell.", c: ["bits", "fork_pipe", "processus"]},
      {t: "so_long, FdF ou fract-ol", d: "Un premier projet graphique avec la MiniLibX : un petit jeu, une carte en 3D filaire ou des fractales.", c: ["structures", "calculs"]},
      {t: "Exam Rank 02", d: "Un examen sur machine avec des exercices de C.", c: [], l: [["Examen blanc", "#examen", "clock"]]}]},
    {r: 3, p: [
      {t: "philosophers", d: "Le dîner des philosophes : threads et mutex.", c: ["threads"]},
      {t: "minishell", d: "Recoder un petit bash, en binôme.", c: ["fork_pipe", "environnement", "processus", "redirections"]}]},
    {r: 4, p: [
      {t: "NetPractice", d: "Configurer des petits réseaux : adresses IP, masques, routeurs.", c: ["reseaulocal", "osi", "ports"], l: [["Entraînement adresses et masques", "#jeux-reseau", "flag"]]},
      {t: "cub3D ou miniRT", d: "Un moteur graphique en binôme : un labyrinthe en 3D ou un lancer de rayons.", c: ["structures", "calculs"]},
      {t: "Modules C++ 00 à 04", d: "Découverte du C++ et de la programmation orientée objet. Pas encore de cours dans Labo 42.", c: ["structures", "ptrfonctions"]}]},
    {r: 5, p: [
      {t: "Inception", d: "Monter une petite infrastructure avec Docker : plusieurs services dans des conteneurs.", c: ["cloud", "services", "serveur"]},
      {t: "webserv ou ft_irc", d: "Écrire un serveur web ou un serveur de discussion, en équipe.", c: ["http", "tcp", "ports"]},
      {t: "Modules C++ 05 à 09", d: "Le C++ plus avancé.", c: []}]},
    {r: 6, p: [{t: "ft_transcendence", d: "Le projet final du tronc commun : un site web complet, en équipe, avec ses comptes et sa sécurité.", c: ["http", "injection", "hachage", "cloud"]}]}
  ];

  const prep = item => { const ids = (item.c || []).filter(id => L.TOPIC[id]); const done = ids.filter(id => S().seen[id]).length; return {ids, done}; };
  function projectCard(p) {
    const {ids, done} = prep(p);
    return `<div class="proj"><div class="proj-h"><b>${esc(p.t)}</b>${ids.length ? `<span class="small">${done} / ${ids.length} cours</span>` : ""}</div><p class="small" style="margin:4px 0 8px">${esc(p.d)}</p>${ids.length ? `<div class="bar"><i style="width:${Math.round(done / ids.length * 100)}%"></i></div>` : ""}
      ${ids.length || (p.e || []).length || (p.l || []).length ? `<div class="chips wrapc">${ids.map(lessonChip).join("")}${(p.e || []).filter(id => (L.EXO_IDS || []).includes(id)).map(exoChip).join("")}${(p.l || []).map(x => linkChip(x[0], x[1], x[2])).join("")}</div>` : ""}</div>`;
  }
  function renderCursus() {
    const all = PISCINE.concat(...RANGS.map(r => r.p));
    const ids = [...new Set(all.flatMap(p => (p.c || []).filter(id => L.TOPIC[id])))];
    const done = ids.filter(id => S().seen[id]).length;
    $("cursusBox").innerHTML = `<button class="back" type="button" data-go="#parcours">← Le parcours</button>
      <div class="hero"><div><h1>Ton cursus 42</h1><p class="sub">De la Piscine au titre RNCP 7, et ce que Labo 42 te fait déjà travailler.</p></div><span class="hart">${L.ART.cursus}</span></div>
      <div class="card" style="margin-top:14px"><p style="margin:0"><b>${done} / ${ids.length} cours de préparation terminés</b></p><div class="bar"><i style="width:${Math.round(done / ids.length * 100)}%"></i></div>
      <p class="small" style="margin:8px 0 0">Les projets et l'ordre ci-dessous sont ceux que décrivent la plupart des élèves de 42. Le programme évolue d'une année à l'autre : la référence, ce sera l'intra de l'école à ton arrivée.</p></div>
      <h2>${ic("flame")} La Piscine</h2><p class="small">Environ un mois, en C et en shell. On avance module par module, à son rythme, avec des examens chaque semaine.</p>
      ${PISCINE.map(projectCard).join("")}
      <h2>${ic("flag")} Le tronc commun</h2><p class="small">Après l'admission, des projets à valider rang par rang. Certains se font en équipe, tous sont corrigés par d'autres élèves, et certains aussi par la moulinette.</p>
      ${RANGS.map(r => `<section class="etape"><div class="etape-h"><span class="num">${r.r}</span><div><h2>Rang ${r.r}</h2></div></div>${r.p.map(projectCard).join("")}</section>`).join("")}
      <h2>${ic("medal")} Le titre RNCP 7</h2>
      <div class="card"><p><b>Expert en architecture informatique, option 1 : architecture des systèmes d'information et réseaux.</b> Un titre de niveau 7, l'équivalent d'un master.</p>
      <p class="small">Après le tronc commun, on choisit des projets avancés selon sa spécialité. Exemples souvent cités : en réseau, ft_ping, ft_traceroute ou ft_nmap ; en sécurité, Snow Crash, Darkly ou RainFall ; en système, taskmaster, strace ou malloc. La liste exacte dépend du catalogue de ton campus.</p>
      <p class="small">Le titre vise à savoir concevoir une architecture réseau IP (routeurs, commutateurs, pare-feu, passerelles), piloter sa mise en œuvre et la faire évoluer. Débouchés : architecte infrastructure, architecte cloud, architecte sécurité, consultant.</p>
      <div class="chips wrapc">${["osi", "reseaulocal", "tcp", "parefeu", "serveur", "cloud", "logs"].map(lessonChip).join("")}</div></div>`;
  }

  document.addEventListener("change", e => {
    const t = e.target; if (!t.dataset || !t.dataset.oc) return;
    const r = ocRead(); if (t.checked) r[t.dataset.oc] = L.today; else delete r[t.dataset.oc];
    t.closest(".occ").classList.toggle("done", t.checked); L.active(); renderOC();
  });
  const show = ({v}) => { if (v === "oc") renderOC(); else if (v === "cursus") renderCursus(); };
  document.addEventListener("labo:view", ev => show(ev.detail));
  show(L.view());
})();
