/* Labo 42 : terminal d'entraînement (faux shell Linux + défis) */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const esc = L.esc;

  /* ---------- Système de fichiers ---------- */
  const D = (c = {}, m = 0o755) => ({t: "d", c, m});
  const F = (c = "", m = 0o644) => ({t: "f", c, m});
  const HOME = "/home/eleve";
  const lines = (n, f) => Array.from({length: n}, (_, i) => f(i)).join("\n") + "\n";

  function baseFS(home) {
    return D({
      home: D({eleve: D(Object.assign({".bashrc": F("# configuration du terminal\nalias ll='ls -la'\n")}, home || {}))}),
      tmp: D({}, 0o777),
      etc: D({hostname: F("labo42\n"), "motd": F("Bienvenue sur le terminal d'entraînement de Labo 42.\n")}),
      var: D({www: D({"index.html": F("<h1>Bienvenue</h1>\n")}), log: D({})}),
      dev: D({null: F("", 0o666)})
    });
  }

  /* ---------- Les défis ---------- */
  const tok = s => "CODE-" + s;
  const JOURNAL = lines(40, i => String(8 + Math.floor(i / 4)).padStart(2, "0") + ":" + String((i % 4) * 15).padStart(2, "0") + " événement " + (i + 1) + (i === 39 ? " : fin de journée, code " + tok("TAIL") : ""));
  const DISCOURS = "Bienvenue à la Piscine de 42.\nIci, personne ne te donnera la réponse.\nTu chercheras, tu te tromperas, tu demanderas à tes voisins.\nEt chaque jour, tu iras un peu plus loin.\n";
  const AUTH = (() => { const out = []; const ip = k => "198.51.100." + (10 + (k * 7) % 80); for (let k = 0; k < 30; k++) { const u = k % 3 === 0 ? "admin" : k % 3 === 1 ? "root" : "invalid user test"; out.push("Nov 21 03:" + String(10 + k).padStart(2, "0") + ":0" + (k % 10) + " serveur sshd: Failed password for " + u + " from " + ip(k)); } out.splice(12, 0, "Nov 21 03:21:30 serveur sshd: Accepted password for admin from 192.0.2.10"); out.splice(4, 0, "Nov 21 03:13:40 serveur sshd: Accepted password for alex from 192.0.2.11"); return out.join("\n") + "\n"; })();
  const DEFIS = [
    {id: "d1", titre: "Premiers pas", cours: "fichiers",
      but: "Un fichier t'attend dans ton dossier personnel. Affiche son contenu pour trouver le code.",
      indices: ["Commence par regarder ce qu'il y a dans ton dossier.", "La commande pour lister tient en 2 lettres, celle pour afficher un fichier en 3.", "Tu as utilisé ces deux commandes dès le niveau 0 de Bandit."],
      home: () => ({"bienvenue.txt": F("Bienvenue dans le terminal de Labo 42 !\nIci, tu peux tout essayer : rien n'est réel.\nTon code : " + tok("BONJOUR") + "\n")}),
      check: c => c.seen.includes(tok("BONJOUR"))},
    {id: "d2", titre: "Se déplacer", cours: "fichiers",
      but: "Le sujet du jour 1 de la Piscine est rangé quelque part dans le dossier piscine. Trouve-le et lis-le.",
      indices: ["Entre dans un dossier, puis regarde ce qu'il contient, à chaque niveau.", "cd nom_du_dossier pour entrer, cd .. pour remonter.", "La touche Tab (ou le bouton ⇥) complète les noms pour toi."],
      home: () => ({piscine: D({jour00: D({"sujet.txt": F("Jour 00 : terminé.\n")}), jour01: D({"sujet.txt": F("Jour 01 : les boucles et les chaînes.\nCode : " + tok("JOUR01") + "\n")})})}),
      check: c => c.seen.includes(tok("JOUR01"))},
    {id: "d3", titre: "Où suis-je ?", cours: "fichiers",
      but: "Va dans le dossier /var/www, puis affiche le chemin complet du dossier où tu te trouves.",
      indices: ["Un chemin qui commence par / part de la racine : il marche d'où que tu sois.", "Une commande de 3 lettres affiche le dossier courant.", "Elle s'écrit p.. : print working directory."],
      check: c => c.cwd === "/var/www" && c.lastCmd === "pwd"},
    {id: "d4", titre: "Le coffre vide qui ne l'est pas", cours: "fichiers",
      but: "Le dossier coffre a l'air vide. Pourtant, une clé y est cachée. Trouve-la et lis-la.",
      indices: ["Sous Linux, un fichier caché a un nom qui commence par un point.", "ls a une option qui affiche tout.", "Pense à « all »."],
      home: () => ({coffre: D({".cle": F("Bien vu ! Code : " + tok("CACHE") + "\n")})}),
      check: c => c.seen.includes(tok("CACHE"))},
    {id: "d5", titre: "Noms piégés", cours: "fichiers",
      but: "Le dossier pieges contient deux fichiers aux noms piégés. Lis-les tous les deux : chacun contient un code.",
      indices: ["Un nom qui commence par un tiret est pris pour une option : mets un chemin devant ou utilise --.", "Un nom avec des espaces doit être entouré de guillemets.", "Tu as déjà résolu ces deux pièges dans Bandit."],
      home: () => ({pieges: D({"-rapport": F("Premier code : " + tok("TIRET") + "\n"), "notes de cours.txt": F("Second code : " + tok("ESPACES") + "\n")})}),
      check: c => c.seen.includes(tok("TIRET")) && c.seen.includes(tok("ESPACES"))},
    {id: "d6", titre: "Construire", cours: "fichiers",
      but: "Prépare ton rendu : crée le dossier piscine/ex00 dans ton dossier personnel, puis un fichier vide ft_putchar.c à l'intérieur.",
      indices: ["mkdir crée un dossier, touch crée un fichier vide.", "mkdir -p crée aussi les dossiers parents qui manquent.", "Vérifie avec ls que tout est au bon endroit."],
      check: c => { const n = c.get(HOME + "/piscine/ex00/ft_putchar.c"); return !!(n && n.t === "f"); }},
    {id: "d7", titre: "Écrire dans un fichier", cours: "redirections",
      but: "Crée un fichier hello.txt dans ton dossier personnel, qui contient exactement la ligne : Bonjour 42",
      indices: ["echo affiche le texte qu'on lui donne.", "Un symbole redirige l'affichage vers un fichier au lieu de l'écran.", "Vérifie le résultat avec cat."],
      check: c => { const n = c.get(HOME + "/hello.txt"); return !!(n && n.t === "f" && n.c.trim() === "Bonjour 42"); }},
    {id: "d8", titre: "Ajouter sans effacer", cours: "redirections",
      but: "Le fichier journal.txt contient deux lignes. Ajoute à la fin une troisième ligne : jour 3 : ok, sans effacer les deux premières.",
      indices: ["> écrase le fichier : ce n'est pas ce que tu veux ici.", "Il existe une version doublée de ce symbole.", "Vérifie avec cat que les trois lignes sont là."],
      home: () => ({"journal.txt": F("jour 1 : ok\njour 2 : ok\n")}),
      check: c => { const n = c.get(HOME + "/journal.txt"); if (!n) return false; const l = n.c.trim().split("\n"); if (l.length === 3 && l[0] === "jour 1 : ok" && l[2].trim() === "jour 3 : ok") return true; if (l.length < 2 || l[0] !== "jour 1 : ok") return "Oups : les premières lignes ont disparu. Touche « Recommencer » pour retrouver le fichier d'origine."; return false; }},
    {id: "d9", titre: "Retrouver un fichier perdu", cours: "fichiers",
      but: "Un fichier config.42 s'est perdu quelque part dans le dossier archives. Trouve où il est, puis affiche son contenu.",
      indices: ["Fouiller chaque dossier à la main serait long : une commande cherche dans tous les sous-dossiers.", "Cette commande a une option pour chercher par nom.", "find suivi du dossier où chercher, puis -name et le nom."],
      home: () => ({archives: D({"2024": D({janvier: D({"notes.txt": F("rien ici\n")}), mars: D({})}), "2025": D({avril: D({vieux: D({"config.42": F("Trouvé ! Code : " + tok("FIND") + "\n")})}), mai: D({"photo.txt": F("une photo\n")})}), "2026": D({})})}),
      check: c => c.seen.includes(tok("FIND"))},
    {id: "d10", titre: "Chercher dans un texte", cours: "redirections",
      but: "Le fichier logs/serveur.log fait 80 lignes. Affiche seulement les lignes qui contiennent le mot ERREUR.",
      indices: ["Lire 80 lignes à l'œil, c'est long : une commande filtre les lignes.", "Elle garde les lignes qui contiennent un motif.", "Son nom commence par g."],
      home: () => ({logs: D({"serveur.log": F(lines(80, i => i === 53 ? "10:" + String(i).padStart(2, "0") + " ERREUR disque presque plein (" + tok("GREP") + ")" : "10:" + String(i).padStart(2, "0") + " info requête traitée"))})}),
      check: c => c.lastOut.includes(tok("GREP")) && c.lastOut.trim().split("\n").length <= 3},
    {id: "d11", titre: "Compter", cours: "redirections",
      but: "Le fichier eleves.txt contient un élève par ligne. Affiche le nombre d'élèves.",
      indices: ["Pas besoin de compter à la main : une commande compte les lignes.", "Son nom vient de « word count ».", "Elle a une option pour ne compter que les lignes."],
      home: () => ({"eleves.txt": F(lines(37, i => "eleve" + (i + 1)))}),
      check: c => /^\s*37(\s|$)/.test(c.lastOut)},
    {id: "d12", titre: "Enchaîner", cours: "redirections",
      but: "Le fichier logs/acces.log liste des visites d'un site. Compte combien de lignes contiennent le code 404, en une seule commande.",
      indices: ["Tu sais filtrer des lignes et compter des lignes : il faut brancher les deux.", "Le symbole | envoie le résultat d'une commande à la suivante.", "D'abord le filtre, ensuite le comptage."],
      home: () => ({logs: D({"acces.log": F(lines(50, i => "GET /page" + i + " " + ([3, 8, 15, 21, 30, 33, 47].includes(i) ? "404" : "200")))})}),
      check: c => c.lastOut.trim() === "7" && c.lastCmd.includes("|")},
    {id: "d13", titre: "Le podium", cours: "redirections",
      but: "Le fichier scores.txt contient un score par ligne. Affiche les 3 meilleurs scores, du plus grand au plus petit.",
      indices: ["Commence par trier les scores. Attention : ce sont des nombres.", "sort a une option pour trier des nombres, et une autre pour inverser l'ordre.", "Pour ne garder que les premières lignes, il y a une commande de 4 lettres."],
      home: () => ({"scores.txt": F("12\n87\n9\n45\n100\n63\n71\n8\n99\n30\n")}),
      check: c => c.lastOut.trim().split("\n").map(s => s.trim()).join(",") === "100,99,87"},
    {id: "d14", titre: "Lancer la fusée", cours: "permissions",
      but: "Le script lancer.sh refuse de se lancer. Rends-le exécutable pour toi seulement, puis lance-le avec ./lancer.sh.",
      indices: ["Regarde ses droits avec ls -l : il manque une lettre.", "chmod change les droits ; u veut dire « le propriétaire ».", "Pour lancer un fichier du dossier courant, on écrit ./ devant son nom."],
      home: () => ({"lancer.sh": F("#!/bin/bash\necho \"3... 2... 1...\"\necho \"Fusée lancée ! Code : " + tok("CHMOD") + "\"\n", 0o644)}),
      check: c => { if (!c.lastOut.includes(tok("CHMOD"))) return false; const n = c.get(HOME + "/lancer.sh"); return n && (n.m & 0o011) ? "Le script marche, mais tout le monde peut aussi l'exécuter. Retire l'exécution au groupe et aux autres." : true; }},
    {id: "d15", titre: "Protéger un secret", cours: "permissions",
      but: "Le fichier secret.txt peut être lu par tout le monde. Règle ses droits pour que toi seul puisses le lire et le modifier.",
      indices: ["Regarde les droits actuels avec ls -l.", "En chiffres : lire = 4, écrire = 2, exécuter = 1.", "Trois chiffres : toi, le groupe, les autres."],
      home: () => ({"secret.txt": F("mot de passe du wifi : ne pas partager\n", 0o644)}),
      check: c => { const n = c.get(HOME + "/secret.txt"); return !!(n && n.m === 0o600); }},
    {id: "d16", titre: "Enquête SOC", cours: "logs",
      but: "Le fichier logs/echecs.txt contient l'adresse IP de chaque tentative de connexion ratée sur un serveur. Trouve l'adresse qui a fait le plus de tentatives, et affiche-la, seule ou avec son nombre.",
      indices: ["Pour compter les répétitions, il faut d'abord mettre les lignes identiques côte à côte.", "uniq -c compte les lignes identiques qui se suivent.", "Trie ensuite ces comptes du plus grand au plus petit, et garde la première ligne."],
      home: () => { const ips = []; const add = (ip, n) => { for (let i = 0; i < n; i++) ips.push(ip); }; add("198.51.100.23", 41); add("203.0.113.9", 17); add("192.0.2.44", 23); add("198.51.100.7", 5); for (let i = ips.length - 1; i > 0; i--) { const j = (i * 7919 + 13) % (i + 1); [ips[i], ips[j]] = [ips[j], ips[i]]; } return {logs: D({"echecs.txt": F(ips.join("\n") + "\n")})}; },
      check: c => { const o = c.lastOut.trim(); return o.split("\n").length === 1 && o.includes("198.51.100.23"); }},
    {id: "d17", titre: "La fin de la journée", cours: "redirections",
      but: "Le fichier journal.txt raconte une longue journée, minute par minute. Affiche seulement ses 5 dernières lignes.",
      indices: ["Il existe une commande pour le début d'un fichier, et une autre pour la fin.", "tail affiche la fin d'un fichier : 10 lignes par défaut.", "L'option -n choisit le nombre de lignes."],
      home: () => ({"journal.txt": F(JOURNAL)}),
      check: c => c.lastOut.trim() === JOURNAL.trim().split("\n").slice(-5).join("\n")},
    {id: "d18", titre: "La ligne 42", cours: "redirections",
      but: "Le fichier annuaire.txt a 100 lignes. Affiche uniquement la ligne numéro 42 : elle contient un code.",
      indices: ["head garde le début d'un fichier, tail garde la fin. Et si tu combinais les deux ?", "head -n 42 garde les 42 premières lignes…", "…et tail -n 1 garde la dernière de celles-là. Branche-les avec |."],
      home: () => ({"annuaire.txt": F(lines(100, i => i === 41 ? "ligne 42 : " + tok("LIGNE42") : "ligne " + (i + 1) + " : rien à signaler"))}),
      check: c => c.lastOut.trim() === "ligne 42 : " + tok("LIGNE42")},
    {id: "d19", titre: "Sans les commentaires", cours: "redirections",
      but: "Le fichier serveur.conf est rempli de commentaires : les lignes qui commencent par #. Affiche seulement les lignes de réglages.",
      indices: ["grep garde les lignes qui contiennent un motif. Il a une option pour faire l'inverse.", "grep -v garde les lignes qui NE correspondent PAS au motif.", "Le symbole ^ veut dire « au début de la ligne » : ^# vise les lignes qui commencent par #."],
      home: () => ({"serveur.conf": F("# Configuration du serveur\n# Ne pas modifier sans l'équipe\nport=8080\n# Le nom affiché\nnom=labo42\n# Sécurité\nssh_root=non\nmot_de_passe_min=12\n# Fin du fichier\n")}),
      check: c => c.lastOut.trim() === "port=8080\nnom=labo42\nssh_root=non\nmot_de_passe_min=12"},
    {id: "d20", titre: "Peu importe la casse", cours: "redirections",
      but: "Le fichier app.log mélange Erreur, ERREUR et erreur. Compte toutes les lignes qui contiennent ce mot, majuscules ou minuscules, et affiche juste le nombre.",
      indices: ["grep sait ignorer la différence entre majuscules et minuscules.", "L'option -i rend la recherche insensible à la casse.", "grep a aussi une option pour compter les lignes trouvées. Sinon, branche wc -l."],
      home: () => ({"app.log": F("08:00 démarrage\n08:01 Erreur : disque presque plein\n08:05 connexion de alex\n08:07 ERREUR : base de données injoignable\n08:09 nouvel essai\n08:10 erreur réseau\n08:15 tout va bien\n08:20 Erreur de mot de passe pour root\n08:22 sauvegarde lancée\n08:30 ERREUR fatale dans le module paiement\n08:31 redémarrage\n08:35 terreur du lundi matin : café vide\n")}),
      check: c => c.lastOut.trim() === "6"},
    {id: "d21", titre: "La liste sans doublons", cours: "redirections",
      but: "Le fichier inscrits.txt contient des prénoms en double. Affiche la liste triée par ordre alphabétique, sans doublons.",
      indices: ["Pour repérer des doublons, il faut d'abord trier : les lignes identiques se retrouvent côte à côte.", "uniq supprime les lignes identiques qui se suivent.", "sort a aussi une option -u qui fait les deux d'un coup."],
      home: () => ({"inscrits.txt": F("Lina\nYanis\nAdam\nLina\nSofia\nAdam\nNoah\nYanis\nLina\n")}),
      check: c => c.lastOut.trim() === "Adam\nLina\nNoah\nSofia\nYanis"},
    {id: "d22", titre: "Copie de sauvegarde", cours: "fichiers",
      but: "Crée un dossier sauvegarde dans ton dossier personnel, puis copies-y le fichier rapport.txt. L'original doit rester à sa place.",
      indices: ["Deux commandes : une pour créer le dossier, une pour copier.", "cp source destination : la destination peut être un dossier.", "Vérifie avec ls que le fichier est aux deux endroits."],
      home: () => ({"rapport.txt": F("Rapport de la semaine : tout est vert.\n")}),
      check: c => { const a = c.get(HOME + "/sauvegarde/rapport.txt"), b = c.get(HOME + "/rapport.txt"); return !!(a && b && a.t === "f" && a.c === b.c); }},
    {id: "d23", titre: "Ranger les photos", cours: "fichiers",
      but: "Trois photos .jpg traînent dans ton dossier. Range-les toutes dans le dossier photos, en une seule commande, sans toucher à notes.txt.",
      indices: ["mv déplace un fichier. Il peut aussi en déplacer plusieurs d'un coup vers un dossier.", "Le joker * remplace n'importe quels caractères : *.jpg veut dire « tout ce qui finit par .jpg ».", "La destination se met en dernier."],
      home: () => ({"vacances1.jpg": F("photo\n"), "vacances2.jpg": F("photo\n"), "chat.jpg": F("photo\n"), "notes.txt": F("à garder ici\n"), photos: D({})}),
      check: c => { const p = c.get(HOME + "/photos"), h = c.get(HOME); return !!(p && h && ["vacances1.jpg", "vacances2.jpg", "chat.jpg"].every(n => p.c[n]) && !Object.keys(h.c).some(n => n.endsWith(".jpg")) && h.c["notes.txt"]); }},
    {id: "d24", titre: "Le grand ménage", cours: "fichiers",
      but: "Le dossier vieux_projet et tout ce qu'il contient ne servent plus. Supprime-le, sans toucher au dossier projet.",
      indices: ["rm supprime des fichiers, mais refuse de supprimer un dossier sans option.", "L'option -r supprime un dossier et tout ce qu'il contient.", "Attention : rm ne passe pas par une corbeille. Vérifie bien le nom avant d'appuyer sur Entrée."],
      home: () => ({vieux_projet: D({src: D({"main.c": F("int main(void) { return (0); }\n")}), "notes.txt": F("vieilles notes\n")}), projet: D({"main.c": F("// à garder\n")})}),
      check: c => !c.get(HOME + "/vieux_projet") && !!c.get(HOME + "/projet/main.c")},
    {id: "d25", titre: "Renommer", cours: "fichiers",
      but: "Le fichier brouillon.c doit s'appeler ft_strlen.c, comme l'exige le sujet. Renomme-le.",
      indices: ["Sous Linux, il n'y a pas de commande « renommer » à part.", "Renommer, c'est déplacer un fichier vers un nouveau nom.", "La commande de déplacement tient en 2 lettres."],
      home: () => ({"brouillon.c": F("int\tft_strlen(char *str)\n{\n}\n")}),
      check: c => !!c.get(HOME + "/ft_strlen.c") && !c.get(HOME + "/brouillon.c")},
    {id: "d26", titre: "Les erreurs à part", cours: "redirections",
      but: "La commande cat a.txt b.txt absent.txt affiche deux fichiers et une erreur. Relance-la en envoyant uniquement les erreurs dans le fichier erreurs.txt.",
      indices: ["Une commande a deux sorties : 1 pour les résultats, 2 pour les erreurs.", "> redirige la sortie 1. Pour rediriger la sortie 2, on écrit son numéro devant.", "Le contenu des fichiers doit toujours s'afficher à l'écran."],
      home: () => ({"a.txt": F("Premier fichier\n"), "b.txt": F("Deuxième fichier\n")}),
      check: c => { const e = c.get(HOME + "/erreurs.txt"); return !!(e && e.c.includes("absent.txt") && c.lastOut.includes("Premier fichier")); }},
    {id: "d27", titre: "Seulement si ça marche", cours: "redirections",
      but: "En une seule ligne, crée le dossier build, puis, seulement si la création a réussi, crée dedans un fichier vide ok.txt.",
      indices: ["Deux symboles enchaînent deux commandes : la seconde ne se lance que si la première a réussi.", "Ces symboles sont &&.", "touch crée un fichier vide."],
      check: c => c.lastCmd.includes("&&") && !!c.get(HOME + "/build/ok.txt")},
    {id: "d28", titre: "Compter les mots", cours: "redirections",
      but: "Combien de mots contient le fichier discours.txt ? Affiche ce nombre.",
      indices: ["wc compte : les lignes, les mots et les octets.", "Chaque option choisit quoi compter : -l pour les lignes, -w pour les mots.", "w comme words, les mots en anglais."],
      home: () => ({"discours.txt": F(DISCOURS)}),
      check: c => c.lastOut.trim().split(/\s+/)[0] === String(DISCOURS.split(/\s+/).filter(Boolean).length)},
    {id: "d29", titre: "Que des fichiers", cours: "fichiers",
      but: "Combien y a-t-il de fichiers, sans compter les dossiers, dans projet et tous ses sous-dossiers ? Affiche le nombre.",
      indices: ["find parcourt tous les sous-dossiers.", "find a une option pour ne garder qu'un type : -type f pour les fichiers, -type d pour les dossiers.", "Branche le résultat sur wc -l pour compter les lignes."],
      home: () => ({projet: D({src: D({"main.c": F(""), "utils.c": F(""), include: D({"utils.h": F("")})}), "Makefile": F(""), "README.md": F(""), tests: D({"test1.c": F("")})})}),
      check: c => c.lastOut.trim() === "6"},
    {id: "d30", titre: "Le compte visé", cours: "logs",
      but: "Dans logs/auth.log, combien de tentatives de connexion ratées visent le compte admin ? Affiche le nombre.",
      indices: ["Cherche les lignes qui contiennent à la fois l'échec et le nom du compte.", "Le motif peut être une phrase entière entre guillemets : \"Failed password for admin\".", "Attention, une connexion réussie d'admin ne doit pas compter."],
      home: () => ({logs: D({"auth.log": F(AUTH)})}),
      check: c => c.lastOut.trim() === "10"}
  ];
  L.DEFI_TOTAL = DEFIS.length;

  /* ---------- État ---------- */
  const st = () => { const s = L.store(); if (!s.term) s.term = {solved: {}, cur: "d1", hint: {}}; return s.term; };
  let fs, cwd, hist = [], hpos = 0, seen = "", lastOut = "", lastCmd = "", defi = null, done = false;

  const split = p => p.split("/").filter(Boolean);
  function norm(path) {
    let parts = path.startsWith("/") ? [] : split(cwd);
    for (const p of split(path)) { if (p === ".") continue; if (p === "..") parts.pop(); else parts.push(p); }
    return "/" + parts.join("/");
  }
  function get(path) {
    let n = fs;
    for (const p of split(norm(path))) { if (!n || n.t !== "d" || !n.c[p]) return null; n = n.c[p]; }
    return n;
  }
  function parentOf(path) { const a = norm(path); const parts = split(a); const name = parts.pop(); return {dir: get("/" + parts.join("/")), name}; }
  const pretty = p => p === HOME ? "~" : p.startsWith(HOME + "/") ? "~" + p.slice(HOME.length) : p;
  const modeStr = n => (n.t === "d" ? "d" : "-") + [6, 3, 0].map(s => { const b = (n.m >> s) & 7; return (b & 4 ? "r" : "-") + (b & 2 ? "w" : "-") + (b & 1 ? "x" : "-"); }).join("");

  function loadDefi(id, keepScreen) {
    defi = DEFIS.find(d => d.id === id) || DEFIS[0];
    st().cur = defi.id; L.save();
    fs = baseFS(defi.home ? defi.home() : {});
    cwd = HOME; seen = ""; lastOut = ""; lastCmd = ""; done = !!st().solved[defi.id];
    if (!keepScreen) $("termOut").innerHTML = "";
    print(`<span class="t-dim">Défi ${DEFIS.indexOf(defi) + 1} : ${esc(defi.titre)}. Tape help pour voir les commandes.</span>`);
    renderCard(); prompt();
  }

  /* ---------- Analyse de la ligne de commande ---------- */
  function lex(line) {
    const out = []; let cur = null, i = 0;
    const push = () => { if (cur) out.push(cur); cur = null; };
    const word = () => { if (!cur) cur = {v: "", q: false, glob: false, tilde: false, start: true}; return cur; };
    while (i < line.length) {
      const ch = line[i];
      if (ch === " " || ch === "\t") { push(); i++; continue; }
      if (ch === "'" || ch === "\"") {
        const w = word(); w.q = true; w.start = false; const end = line.indexOf(ch, i + 1);
        if (end < 0) throw new Error("guillemet non fermé");
        let s = line.slice(i + 1, end); if (ch === "\"") s = s.replace(/\\(["\\$])/g, "$1");
        w.v += s; i = end + 1; continue;
      }
      if (ch === "\\" && i + 1 < line.length) { const w = word(); w.v += line[i + 1]; w.start = false; i += 2; continue; }
      if (ch === "|" || ch === ";" || ch === "<" || ch === ">" || ch === "&") {
        if (ch === ">" && cur && cur.v === "2" && !cur.q && line[i - 1] === "2") { cur = null; out.push({op: line[i + 1] === ">" ? "2>>" : "2>"}); i += line[i + 1] === ">" ? 2 : 1; continue; }
        push();
        if (ch === ">" && line[i + 1] === ">") { out.push({op: ">>"}); i += 2; continue; }
        if (ch === "&" && line[i + 1] === "&") { out.push({op: "&&"}); i += 2; continue; }
        if (ch === "|" && line[i + 1] === "|") { out.push({op: "||"}); i += 2; continue; }
        if (ch === "&") { i++; continue; }
        out.push({op: ch}); i++; continue;
      }
      const w = word();
      if (ch === "~" && w.v === "" && w.start) w.tilde = true;
      if ((ch === "*" || ch === "?") ) w.glob = true;
      w.v += ch; w.start = false; i++;
    }
    push();
    return out;
  }
  function globMatch(pat, s) { const re = new RegExp("^" + pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$"); return re.test(s); }
  function expand(w) {
    let v = w.v;
    if (w.tilde) v = HOME + v.slice(1);
    if (!w.glob || w.q) return [v];
    const slash = v.lastIndexOf("/"); const dirPath = slash >= 0 ? v.slice(0, slash) || "/" : "."; const pat = v.slice(slash + 1);
    const d = get(dirPath); if (!d || d.t !== "d") return [v];
    const hits = Object.keys(d.c).filter(n => (pat.startsWith(".") || !n.startsWith(".")) && globMatch(pat, n)).sort();
    return hits.length ? hits.map(n => (slash >= 0 ? v.slice(0, slash + 1) : "") + n) : [v];
  }

  /* ---------- Commandes ---------- */
  const R = (out = "", err = "", code = 0) => ({out, err, code});
  const NOENT = (cmd, p) => R("", `${cmd}: ${p}: Aucun fichier ou dossier de ce type\n`, 1);
  function opts(args, allowed) {
    const o = {}, rest = []; let endOpts = false;
    for (const a of args) {
      if (!endOpts && a === "--") { endOpts = true; continue; }
      if (!endOpts && /^-[A-Za-z]+$/.test(a)) { for (const ch of a.slice(1)) { if (!allowed.includes(ch)) return {bad: ch}; o[ch] = true; } continue; }
      rest.push(a);
    }
    return {o, rest};
  }
  function readFile(cmd, p) {
    const n = get(p);
    if (!n) return {err: NOENT(cmd, p)};
    if (n.t === "d") return {err: R("", `${cmd}: ${p}: est un dossier\n`, 1)};
    if (!(n.m & 0o400)) return {err: R("", `${cmd}: ${p}: Permission non accordée\n`, 1)};
    return {txt: n.c};
  }
  function writeFile(p, txt, append) {
    if (p === "/dev/null") return null;
    const n = get(p);
    if (n && n.t === "d") return `bash: ${p}: est un dossier\n`;
    if (n) { if (!(n.m & 0o200)) return `bash: ${p}: Permission non accordée\n`; n.c = append ? n.c + txt : txt; return null; }
    const {dir, name} = parentOf(p);
    if (!dir || dir.t !== "d") return `bash: ${p}: Aucun fichier ou dossier de ce type\n`;
    dir.c[name] = F(txt); return null;
  }
  const MAN = {
    ls: "ls [-a] [-l] [dossier] : liste le contenu d'un dossier. -a affiche aussi les fichiers cachés, -l les détails (droits, taille).",
    cd: "cd [dossier] : change de dossier. cd .. remonte, cd tout seul revient au dossier personnel.",
    pwd: "pwd : affiche le chemin du dossier courant.",
    cat: "cat [fichier...] : affiche le contenu des fichiers. -- indique la fin des options.",
    echo: "echo [texte] : affiche le texte. -n : sans retour à la ligne.",
    touch: "touch fichier : crée un fichier vide (ou met à jour sa date).",
    mkdir: "mkdir [-p] dossier : crée un dossier. -p crée aussi les dossiers parents.",
    rm: "rm [-r] fichier : supprime un fichier. -r supprime un dossier et tout son contenu.",
    cp: "cp source destination : copie un fichier.",
    mv: "mv source destination : déplace ou renomme un fichier.",
    find: "find [dossier] [-name motif] [-type f|d] : cherche dans un dossier et tous ses sous-dossiers.",
    grep: "grep [-i] [-v] [-n] [-c] motif [fichier...] : garde les lignes qui contiennent le motif. -i ignore les majuscules, -v inverse, -n numérote, -c compte.",
    head: "head [-n N] [fichier] : affiche les N premières lignes (10 par défaut).",
    tail: "tail [-n N] [fichier] : affiche les N dernières lignes (10 par défaut).",
    wc: "wc [-l] [-w] [-c] [fichier] : compte les lignes, les mots et les caractères.",
    sort: "sort [-n] [-r] [-u] [fichier] : trie les lignes. -n trie des nombres, -r inverse, -u supprime les doublons.",
    uniq: "uniq [-c] [fichier] : fusionne les lignes identiques qui se suivent. -c affiche le nombre de répétitions.",
    chmod: "chmod mode fichier : change les droits. Exemples : chmod u+x script.sh, chmod 640 notes.txt.",
    man: "man commande : affiche l'aide d'une commande.",
    history: "history : affiche les commandes déjà tapées.",
    clear: "clear : efface l'écran."
  };
  const CMDS = {
    help: () => R("Commandes disponibles :\n" + Object.keys(MAN).join("  ") + "\nTape man suivi d'une commande pour son aide, par exemple : man ls\nAstuces : Tab complète les noms, ↑ rappelle la commande précédente.\n"),
    man: a => a[0] && MAN[a[0]] ? R(MAN[a[0]] + "\n") : R("", a[0] ? `Aucune entrée de manuel pour ${a[0]}\n` : "Quelle page de manuel veux-tu ? Exemple : man ls\n", 1),
    pwd: () => R(cwd + "\n"),
    whoami: () => R("eleve\n"),
    hostname: () => R("labo42\n"),
    date: () => R(new Date().toLocaleString("fr-FR") + "\n"),
    clear: () => { $("termOut").innerHTML = ""; return R(); },
    history: () => R(hist.map((h, i) => String(i + 1).padStart(4) + "  " + h).join("\n") + (hist.length ? "\n" : "")),
    exit: () => R("Ce terminal d'entraînement reste ouvert : change d'onglet quand tu veux.\n"),
    cd: a => {
      const p = a[0] || HOME; const n = get(p);
      if (!n) return NOENT("cd", p);
      if (n.t !== "d") return R("", `cd: ${p}: N'est pas un dossier\n`, 1);
      cwd = norm(p); prompt(); return R();
    },
    ls: a => {
      const r = opts(a, "alh1"); if (r.bad) return R("", `ls: option invalide -- '${r.bad}'\n`, 2);
      const paths = r.rest.length ? r.rest : ["."]; let out = "", err = "";
      paths.forEach((p, idx) => {
        const n = get(p); if (!n) { err += `ls: impossible d'accéder à '${p}': Aucun fichier ou dossier de ce type\n`; return; }
        if (n.t === "f") { out += (r.o.l ? `${modeStr(n)} 1 eleve eleve ${String(n.c.length).padStart(5)} ${p}` : p) + "\n"; return; }
        if (paths.length > 1) out += (idx ? "\n" : "") + p + ":\n";
        let names = Object.keys(n.c).sort((x, y) => x.replace(/^\./, "").localeCompare(y.replace(/^\./, "")));
        if (!r.o.a) names = names.filter(x => !x.startsWith("."));
        if (r.o.a) names = [".", ".."].concat(names);
        if (r.o.l) out += names.map(x => { const c = x === "." ? n : x === ".." ? D() : n.c[x]; return `${modeStr(c)} 1 eleve eleve ${String(c.t === "d" ? 4096 : c.c.length).padStart(5)} ${x}`; }).join("\n") + (names.length ? "\n" : "");
        else if (names.length) out += names.join("  ") + "\n";
      });
      return R(out, err, err ? 2 : 0);
    },
    cat: (a, stdin) => {
      const r = opts(a, "neE"); if (r.bad) return R("", `cat: option invalide -- '${r.bad}'\nSaisissez « cat --help » pour plus d'informations.\n`, 1);
      if (!r.rest.length) return R(stdin || "", stdin === null ? "(cat attend que tu tapes quelque chose au clavier. Ici, il n'a rien reçu.)\n" : "");
      let out = "", err = "";
      for (const p of r.rest) { if (p === "-") { out += stdin || ""; if (stdin === null) err += "(« - » veut dire « lire le clavier » pour cat : il n'a rien reçu.)\n"; continue; } const f = readFile("cat", p); if (f.err) err += f.err.err; else out += f.txt; }
      return R(out, err, err ? 1 : 0);
    },
    less: (a, s) => CMDS.cat(a, s),
    echo: a => { let n = false; if (a[0] === "-n") { n = true; a = a.slice(1); } return R(a.join(" ") + (n ? "" : "\n")); },
    touch: a => {
      if (!a.length) return R("", "touch: opérande de fichier manquant\n", 1);
      let err = ""; for (const p of a) { if (get(p)) continue; const {dir, name} = parentOf(p); if (!dir || dir.t !== "d") err += `touch: impossible de faire un touch '${p}': Aucun fichier ou dossier de ce type\n`; else dir.c[name] = F(""); }
      return R("", err, err ? 1 : 0);
    },
    mkdir: a => {
      const r = opts(a, "p"); if (r.bad) return R("", `mkdir: option invalide -- '${r.bad}'\n`, 1);
      if (!r.rest.length) return R("", "mkdir: opérande manquant\n", 1);
      let err = "";
      for (const p of r.rest) {
        if (r.o.p) { let n = fs; for (const part of split(norm(p))) { if (!n.c[part]) n.c[part] = D(); n = n.c[part]; if (n.t !== "d") { err += `mkdir: ${p}: N'est pas un dossier\n`; break; } } continue; }
        if (get(p)) { err += `mkdir: impossible de créer le répertoire « ${p} »: Le fichier existe\n`; continue; }
        const {dir, name} = parentOf(p); if (!dir || dir.t !== "d") err += `mkdir: impossible de créer le répertoire « ${p} »: Aucun fichier ou dossier de ce type\n`; else dir.c[name] = D();
      }
      return R("", err, err ? 1 : 0);
    },
    rm: a => {
      const r = opts(a, "rfRi"); if (r.bad) return R("", `rm: option invalide -- '${r.bad}'\n`, 1);
      let err = "";
      for (const p of r.rest) { const n = get(p); if (!n) { if (!r.o.f) err += `rm: impossible de supprimer '${p}': Aucun fichier ou dossier de ce type\n`; continue; } if (n.t === "d" && !r.o.r && !r.o.R) { err += `rm: impossible de supprimer '${p}': est un dossier\n`; continue; } if (norm(p) === "/" || norm(p) === HOME) { err += `rm: suppression de '${p}' refusée : ici, on ne casse pas tout !\n`; continue; } const {dir, name} = parentOf(p); delete dir.c[name]; }
      return R("", err, err ? 1 : 0);
    },
    cp: a => {
      if (a.length < 2) return R("", "cp: opérande de fichier manquant\n", 1);
      const last = a[a.length - 1], ln = get(last), srcs = a.slice(0, -1);
      if (srcs.length > 1 && !(ln && ln.t === "d")) return R("", `cp: la cible '${last}' n'est pas un répertoire\n`, 1);
      let err = "";
      for (const sp of srcs) {
        const f = readFile("cp", sp); if (f.err) { err += f.err.err; continue; }
        let dest = last; if (ln && ln.t === "d") dest = norm(last) + "/" + split(norm(sp)).pop();
        const e = writeFile(dest, f.txt, false); if (e) err += e.replace("bash", "cp");
      }
      return R("", err, err ? 1 : 0);
    },
    mv: a => {
      if (a.length < 2) return R("", "mv: opérande de fichier manquant\n", 1);
      const last = a[a.length - 1], ln = get(last), srcs = a.slice(0, -1);
      if (srcs.length > 1 && !(ln && ln.t === "d")) return R("", `mv: la cible '${last}' n'est pas un répertoire\n`, 1);
      let err = "";
      for (const sp of srcs) {
        const src = get(sp); if (!src) { err += `mv: impossible d'évaluer '${sp}': Aucun fichier ou dossier de ce type\n`; continue; }
        let dest = last; if (ln && ln.t === "d") dest = norm(last) + "/" + split(norm(sp)).pop();
        const t = parentOf(dest); if (!t.dir || t.dir.t !== "d") { err += `mv: impossible de déplacer '${sp}' vers '${last}': Aucun fichier ou dossier de ce type\n`; continue; }
        const o = parentOf(sp); delete o.dir.c[o.name]; t.dir.c[t.name] = src;
      }
      return R("", err, err ? 1 : 0);
    },
    find: a => {
      let start = ".", i = 0; if (a[0] && !a[0].startsWith("-")) { start = a[0]; i = 1; }
      let name = null, type = null;
      for (; i < a.length; i++) { if (a[i] === "-name" || a[i] === "-iname") name = {p: a[++i] || "", ci: a[i - 1] === "-iname"}; else if (a[i] === "-type") type = a[++i]; else return R("", `find: prédicat inconnu « ${a[i]} »\n`, 1); }
      const root = get(start); if (!root) return R("", `find: '${start}': Aucun fichier ou dossier de ce type\n`, 1);
      const out = [];
      const walk = (n, path, base) => {
        const okName = !name || globMatch(name.ci ? name.p.toLowerCase() : name.p, name.ci ? base.toLowerCase() : base);
        const okType = !type || (type === "f" ? n.t === "f" : type === "d" ? n.t === "d" : false);
        if (okName && okType) out.push(path);
        if (n.t === "d") Object.keys(n.c).sort().forEach(k => walk(n.c[k], path.replace(/\/$/, "") + "/" + k, k));
      };
      walk(root, start, split(norm(start)).pop() || "/");
      return R(out.join("\n") + (out.length ? "\n" : ""));
    },
    grep: (a, stdin) => {
      const r = opts(a, "ivncrE"); if (r.bad) return R("", `grep: option invalide -- '${r.bad}'\n`, 2);
      if (!r.rest.length) return R("", "Utilisation : grep [OPTION]... MOTIF [FICHIER]...\n", 2);
      const pat = r.rest[0], files = r.rest.slice(1);
      const anchorS = pat.startsWith("^"), anchorE = pat.endsWith("$") && pat.length > 1;
      let core = pat.slice(anchorS ? 1 : 0, anchorE ? -1 : undefined); if (r.o.i) core = core.toLowerCase();
      const test = l => { const x = r.o.i ? l.toLowerCase() : l; const ok = anchorS && anchorE ? x === core : anchorS ? x.startsWith(core) : anchorE ? x.endsWith(core) : x.includes(core); return r.o.v ? !ok : ok; };
      const run = (txt, label) => { const ls = txt.split("\n"); if (ls[ls.length - 1] === "") ls.pop(); const hits = []; ls.forEach((l, k) => { if (test(l)) hits.push((label ? label + ":" : "") + (r.o.n ? (k + 1) + ":" : "") + l); }); return r.o.c ? [(label ? label + ":" : "") + hits.length] : hits; };
      let out = [], err = "";
      if (!files.length) out = run(stdin || "", "");
      else for (const p of files) { const f = readFile("grep", p); if (f.err) { err += f.err.err; continue; } out = out.concat(run(f.txt, files.length > 1 ? p : "")); }
      return R(out.join("\n") + (out.length ? "\n" : ""), err, out.length ? 0 : 1);
    },
    head: (a, stdin) => headTail(a, stdin, true),
    tail: (a, stdin) => headTail(a, stdin, false),
    wc: (a, stdin) => {
      const r = opts(a, "lwc"); if (r.bad) return R("", `wc: option invalide -- '${r.bad}'\n`, 1);
      const all = !r.o.l && !r.o.w && !r.o.c;
      const count = (t, name) => { const parts = []; if (all || r.o.l) parts.push((t.match(/\n/g) || []).length); if (all || r.o.w) parts.push(t.split(/\s+/).filter(Boolean).length); if (all || r.o.c) parts.push(new TextEncoder().encode(t).length); return parts.map(x => (parts.length > 1 ? String(x).padStart(3) : String(x))).join(" ") + (name ? " " + name : ""); };
      if (!r.rest.length) return R(count(stdin || "", "") + "\n");
      let out = "", err = ""; for (const p of r.rest) { const f = readFile("wc", p); if (f.err) err += f.err.err; else out += count(f.txt, p) + "\n"; }
      return R(out, err, err ? 1 : 0);
    },
    sort: (a, stdin) => {
      const r = opts(a, "nruf"); if (r.bad) return R("", `sort: option invalide -- '${r.bad}'\n`, 2);
      let txt = stdin || ""; if (r.rest.length) { txt = ""; for (const p of r.rest) { const f = readFile("sort", p); if (f.err) return f.err; txt += f.txt; } }
      let ls = txt.split("\n"); if (ls[ls.length - 1] === "") ls.pop();
      const num = s => { const m = s.trim().match(/^-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : 0; };
      ls.sort(r.o.n ? (x, y) => num(x) - num(y) || x.localeCompare(y) : (x, y) => (r.o.f ? x.toLowerCase().localeCompare(y.toLowerCase()) : x.localeCompare(y)));
      if (r.o.r) ls.reverse();
      if (r.o.u) ls = ls.filter((l, k) => k === 0 || l !== ls[k - 1]);
      return R(ls.join("\n") + (ls.length ? "\n" : ""));
    },
    uniq: (a, stdin) => {
      const r = opts(a, "cdu"); if (r.bad) return R("", `uniq: option invalide -- '${r.bad}'\n`, 1);
      let txt = stdin || ""; if (r.rest[0]) { const f = readFile("uniq", r.rest[0]); if (f.err) return f.err; txt = f.txt; }
      const ls = txt.split("\n"); if (ls[ls.length - 1] === "") ls.pop();
      const groups = []; for (const l of ls) { if (groups.length && groups[groups.length - 1].l === l) groups[groups.length - 1].n++; else groups.push({l, n: 1}); }
      let g = groups; if (r.o.d) g = g.filter(x => x.n > 1); if (r.o.u) g = g.filter(x => x.n === 1);
      const out = g.map(x => (r.o.c ? String(x.n).padStart(7) + " " : "") + x.l);
      return R(out.join("\n") + (out.length ? "\n" : ""));
    },
    chmod: a => {
      if (a.length < 2) return R("", "chmod: opérande manquant\n", 1);
      const mode = a[0]; let err = "";
      for (const p of a.slice(1)) {
        const n = get(p); if (!n) { err += `chmod: impossible d'accéder à '${p}': Aucun fichier ou dossier de ce type\n`; continue; }
        if (/^[0-7]{3}$/.test(mode)) { n.m = parseInt(mode, 8); continue; }
        let ok = true;
        for (const part of mode.split(",")) {
          const m = part.match(/^([ugoa]*)([+\-=])([rwx]*)$/); if (!m) { ok = false; break; }
          const who = m[1] || "a", bits = (m[3].includes("r") ? 4 : 0) | (m[3].includes("w") ? 2 : 0) | (m[3].includes("x") ? 1 : 0);
          const shifts = []; if (/[ua]/.test(who)) shifts.push(6); if (/[ga]/.test(who)) shifts.push(3); if (/[oa]/.test(who)) shifts.push(0);
          for (const s of shifts) { if (m[2] === "+") n.m |= bits << s; else if (m[2] === "-") n.m &= ~(bits << s); else n.m = (n.m & ~(7 << s)) | (bits << s); }
        }
        if (!ok) { err += `chmod: mode incorrect : « ${mode} »\n`; break; }
      }
      return R("", err, err ? 1 : 0);
    }
  };
  function headTail(a, stdin, head) {
    const name = head ? "head" : "tail"; let n = 10; const rest = [];
    for (let i = 0; i < a.length; i++) { if (a[i] === "-n") n = parseInt(a[++i], 10); else if (/^-\d+$/.test(a[i])) n = parseInt(a[i].slice(1), 10); else if (/^-n\d+$/.test(a[i])) n = parseInt(a[i].slice(2), 10); else rest.push(a[i]); }
    if (isNaN(n)) return R("", `${name}: nombre de lignes incorrect\n`, 1);
    let txt = stdin || ""; if (rest[0]) { const f = readFile(name, rest[0]); if (f.err) return f.err; txt = f.txt; }
    let ls = txt.split("\n"); if (ls[ls.length - 1] === "") ls.pop();
    ls = head ? ls.slice(0, n) : ls.slice(Math.max(0, ls.length - n));
    return R(ls.join("\n") + (ls.length ? "\n" : ""));
  }

  /* ---------- Exécution ---------- */
  let depth = 0;
  function runScript(path, argv0) {
    const n = get(path);
    if (!n) return R("", `bash: ${argv0}: Aucun fichier ou dossier de ce type\n`, 127);
    if (n.t === "d") return R("", `bash: ${argv0}: est un dossier\n`, 126);
    if (!(n.m & 0o100)) return R("", `bash: ${argv0}: Permission non accordée\n`, 126);
    if (depth > 3) return R("", "bash: trop de scripts imbriqués\n", 1);
    depth++; let out = "", err = "";
    for (const l of n.c.split("\n")) { if (!l.trim() || l.trim().startsWith("#")) continue; const r = runLine(l, false); out += r.out; err += r.err; }
    depth--; return R(out, err);
  }
  function runSimple(argv, stdin) {
    const cmd = argv[0];
    if (cmd.includes("/")) return runScript(cmd, cmd);
    if (CMDS[cmd]) return CMDS[cmd](argv.slice(1), stdin);
    if (cmd === "ll") return CMDS.ls(["-la"].concat(argv.slice(1)), stdin);
    if (["sudo", "su"].includes(cmd)) return R("", `${cmd} : ici, pas besoin d'être administrateur. Essaie sans ${cmd}.\n`, 1);
    if (["vim", "vi", "nano", "emacs"].includes(cmd)) return R("", `${cmd} : pas d'éditeur dans ce terminal d'entraînement. Utilise echo et les redirections > et >>.\n`, 127);
    if (["file", "strings", "base64", "tr", "nc", "ncat", "openssl", "nmap", "ssh"].includes(cmd)) return R("", `${cmd} : commande non disponible dans ce terminal d'entraînement.\n`, 127);
    return R("", `${cmd} : commande introuvable. Tape help pour voir les commandes disponibles.\n`, 127);
  }
  function runLine(line, top) {
    let toks;
    try { toks = lex(line); } catch (e) { return R("", "bash: erreur de syntaxe : " + e.message + "\n", 2); }
    const seqs = []; let curSeq = [], sep = null;
    for (const t of toks) { if (t.op === ";" || t.op === "&&" || t.op === "||") { seqs.push({toks: curSeq, sep}); sep = t.op; curSeq = []; } else curSeq.push(t); }
    seqs.push({toks: curSeq, sep});
    let out = "", err = "", code = 0;
    for (const s of seqs) {
      if (s.sep === "&&" && code !== 0) continue;
      if (s.sep === "||" && code === 0) continue;
      if (!s.toks.length) continue;
      const cmds = [[]]; for (const t of s.toks) { if (t.op === "|") cmds.push([]); else cmds[cmds.length - 1].push(t); }
      let stdin = null;
      for (let k = 0; k < cmds.length; k++) {
        const c = cmds[k], argv = [], red = {};
        for (let j = 0; j < c.length; j++) {
          const t = c[j];
          if (t.op) { const target = c[j + 1]; if (!target || target.op) return R(out, err + "bash: erreur de syntaxe près du symbole inattendu « " + t.op + " »\n", 2); red[t.op] = expand(target)[0]; j++; continue; }
          argv.push(...expand(t));
        }
        if (red["<"] !== undefined) { const f = readFile("bash", red["<"]); if (f.err) { err += f.err.err.replace(/^bash: /, "bash: "); code = 1; stdin = null; break; } stdin = f.txt; }
        if (!argv.length) { stdin = ""; continue; }
        const r = runSimple(argv, stdin);
        code = r.code;
        let o = r.out;
        if (red[">"] !== undefined || red[">>"] !== undefined) { const e = writeFile(red[">"] !== undefined ? red[">"] : red[">>"], o, red[">>"] !== undefined); if (e) err += e; o = ""; }
        if (red["2>"] !== undefined || red["2>>"] !== undefined) { const e = writeFile(red["2>"] !== undefined ? red["2>"] : red["2>>"], r.err, red["2>>"] !== undefined); if (e) err += e; } else err += r.err;
        stdin = o;
        if (k === cmds.length - 1) out += o;
      }
    }
    return R(out, err, code);
  }

  /* ---------- Affichage ---------- */
  function print(html) { const o = $("termOut"); o.insertAdjacentHTML("beforeend", "<div>" + html + "</div>"); o.scrollTop = o.scrollHeight; }
  function prompt() { $("termPrompt").textContent = "eleve@labo42:" + pretty(cwd) + "$"; }
  function exec(line) {
    const l = line.trim();
    print(`<span class="t-p">eleve@labo42:${esc(pretty(cwd))}$</span> ${esc(line)}`);
    if (!l) return;
    hist.push(l); hpos = hist.length;
    const r = runLine(l, true);
    if (r.out) print(esc(r.out.replace(/\n$/, "")));
    if (r.err) print(`<span class="t-err">${esc(r.err.replace(/\n$/, ""))}</span>`);
    lastOut = r.out; lastCmd = l; seen += r.out + r.err;
    L.active && L.active(true);
    check();
  }
  function check() {
    if (done && st().solved[defi.id]) return;
    const res = defi.check({seen, lastOut, lastCmd, cwd, get});
    if (res === true) {
      done = true; const s = st(); s.solved[defi.id] = true; L.store().day.term = true; L.save(); L.active && L.active();
      print(`<span class="t-ok">Défi réussi ! Bien joué.</span>`);
      renderCard(true);
    } else if (typeof res === "string") print(`<span class="t-warn">${esc(res)}</span>`);
  }
  function renderCard(justSolved) {
    const s = st(), idx = DEFIS.indexOf(defi), solved = !!s.solved[defi.id], h = (s.hint[defi.id] || 0);
    const next = DEFIS.find(d => !s.solved[d.id]);
    const cours = L.TOPIC[defi.cours];
    $("defiCard").innerHTML = `<div class="ftop"><span class="tag">Défi ${idx + 1} sur ${DEFIS.length}</span><span>${Object.keys(s.solved).length} réussi${Object.keys(s.solved).length > 1 ? "s" : ""}</span></div>
      <h3>${esc(defi.titre)}${solved ? " ✓" : ""}</h3><p>${esc(defi.but)}</p>
      ${h ? `<div class="box warn"><h3>Indice${h > 1 ? "s" : ""}</h3><ol>${defi.indices.slice(0, h).map(x => `<li>${esc(x)}</li>`).join("")}</ol></div>` : ""}
      ${solved ? `<div class="box acc"><h3>${justSolved ? "Défi réussi !" : "Défi déjà réussi"}</h3><p>${next ? "Passe au suivant quand tu veux." : "Tu as réussi tous les défis : bravo !"}</p></div>` : ""}
      <div class="row">${!solved && h < defi.indices.length ? `<button class="btn ghost" type="button" data-t="hint">Un indice (${h + 1}/${defi.indices.length})</button>` : ""}<button class="btn ghost" type="button" data-t="reset">Recommencer</button></div>
      ${solved && next ? `<button class="btn acc full" type="button" data-t="go" data-id="${next.id}">Défi suivant : ${esc(next.titre)}</button>` : ""}
      ${cours ? `<p class="small" style="margin:12px 0 0">Le cours qui aide : <a href="#cours-${defi.cours}">${esc(cours.t)}</a></p>` : ""}`;
    $("defiList").innerHTML = DEFIS.map((d, k) => `<li><button class="pitem${d.id === defi.id ? " next" : ""}" type="button" data-t="go" data-id="${d.id}"><span class="ptxt"><b>${esc(d.titre)}</b></span><span class="pnum${s.solved[d.id] ? " done" : ""}">${s.solved[d.id] ? "✓" : k + 1}</span></button></li>`).join("");
  }

  /* ---------- Saisie ---------- */
  function complete() {
    const inp = $("termIn"), v = inp.value, start = v.lastIndexOf(" ") + 1, word = v.slice(start);
    const slash = word.lastIndexOf("/"), dirPart = slash >= 0 ? word.slice(0, slash + 1) : "", base = word.slice(slash + 1);
    const real = dirPart.startsWith("~") ? HOME + dirPart.slice(1) : dirPart;
    const d = get(real || "."); let cands;
    if (start === 0 && !word.includes("/")) cands = Object.keys(CMDS).filter(c => c.startsWith(base));
    else cands = d && d.t === "d" ? Object.keys(d.c).filter(n => n.startsWith(base) && (base.startsWith(".") || !n.startsWith("."))) : [];
    if (cands.length === 1) {
      const n = cands[0], node = d && d.c && d.c[n];
      let fill = n.replace(/([ '"\\])/g, "\\$1"); if (node && node.t === "d") fill += "/"; else if (start === 0 || node) fill += " ";
      inp.value = v.slice(0, start) + dirPart + fill;
    } else if (cands.length > 1) {
      print(`<span class="t-p">eleve@labo42:${esc(pretty(cwd))}$</span> ${esc(v)}`); print(esc(cands.sort().join("  ")));
      let pre = cands[0]; for (const c of cands) while (!c.startsWith(pre)) pre = pre.slice(0, -1);
      if (pre.length > base.length) inp.value = v.slice(0, start) + dirPart + pre;
    }
    inp.focus();
  }
  function insert(txt) { const inp = $("termIn"), s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s; inp.value = inp.value.slice(0, s) + txt + inp.value.slice(e); inp.focus(); inp.setSelectionRange(s + txt.length, s + txt.length); }
  function histNav(dir) { if (!hist.length) return; hpos = Math.max(0, Math.min(hist.length, hpos + dir)); $("termIn").value = hist[hpos] || ""; $("termIn").focus(); }

  $("termForm").addEventListener("submit", e => { e.preventDefault(); const v = $("termIn").value; $("termIn").value = ""; exec(v); });
  $("termIn").addEventListener("keydown", e => {
    if (e.key === "Tab") { e.preventDefault(); complete(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); histNav(-1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); histNav(1); }
    else if (e.key === "c" && e.ctrlKey) { e.preventDefault(); print(`<span class="t-p">eleve@labo42:${esc(pretty(cwd))}$</span> ${esc($("termIn").value)}^C`); $("termIn").value = ""; }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); $("termOut").innerHTML = ""; }
  });
  const KEYS = [["⇥", "tab"], ["↑", "up"], ["|", "|"], [">", ">"], ["-", "-"], ["~", "~"], ["/", "/"], ["*", "*"], [".", "."], ["\"", "\""]];
  $("termKeys").innerHTML = KEYS.map(k => `<button type="button" class="key" data-k="${esc(k[1])}">${esc(k[0])}</button>`).join("");
  $("termKeys").addEventListener("pointerdown", e => { if (e.target.closest(".key")) e.preventDefault(); });
  $("termKeys").addEventListener("click", e => { const b = e.target.closest(".key"); if (!b) return; const k = b.dataset.k; if (k === "tab") complete(); else if (k === "up") histNav(-1); else insert(k); });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-t]"); if (!b) return;
    const t = b.dataset.t;
    if (t === "hint") { const s = st(); s.hint[defi.id] = Math.min((s.hint[defi.id] || 0) + 1, defi.indices.length); L.save(); renderCard(); }
    else if (t === "reset") loadDefi(defi.id);
    else if (t === "go") { loadDefi(b.dataset.id); $("defiDetails").open = false; scrollTo(0, 0); }
  });
  $("term").addEventListener("click", e => { if (!e.target.closest("button") && !window.getSelection().toString()) $("termIn").focus(); });

  loadDefi(st().cur || "d1");
  L.termReady && L.termReady();
})();
