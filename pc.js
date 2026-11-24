/* Labo 42 : « Sur ton PC » (le programme de missions, à faire pour de vrai) et « Sur ton téléphone » (ce qui se fait dans l'appli) */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, ic, inline} = L;
  const S = () => L.store();
  const pc = () => { const s = S(); if (!s.pc) s.pc = {env: "win", done: {}, steps: {}}; if (!s.pc.done) s.pc.done = {}; if (!s.pc.steps) s.pc.steps = {}; return s.pc; };
  const atelier = () => { const s = S(); if (!s.atelier) s.atelier = {code: {}, done: {}, hints: {}, norm: 0}; if (!s.atelier.done) s.atelier.done = {}; return s.atelier; };
  const EXO = id => (L.EXOS || []).find(e => e.id === id);

  /* ---------- Ton environnement ---------- */
  const ENV = {
    win: {t: "Windows", d: "VS Code + GCC (MSYS2)", cc: "gcc", run: ".\\a.exe", sep: "\\", mk: "mkdir", term: "le terminal de VS Code (menu Terminal → Nouveau terminal)", root: "Documents\\piscine",
      info: "Ce que tu as déjà sur ton PC. Parfait pour commencer le C. Il n'y a pas de norminette : l'atelier de l'appli la remplace."},
    wsl: {t: "Ubuntu (WSL)", d: "comme à 42", cc: "cc", run: "./a.out", sep: "/", mk: "mkdir -p", term: "le terminal Ubuntu", root: "~/piscine",
      info: "Le vrai Linux, comme sur les machines de 42 : la norminette, valgrind, le vrai terminal. La mission « Passer sous Ubuntu » t'y amène."}
  };
  const env = () => ENV[pc().env] || ENV.win;

  /* Où ranger chaque exercice, comme dans les modules de la Piscine */
  const PLACE = {
    ft_putchar: ["c00", "ex00"], ft_print_alphabet: ["c00", "ex01"], ft_print_reverse_alphabet: ["c00", "ex02"], ft_print_numbers: ["c00", "ex03"], ft_is_negative: ["c00", "ex04"],
    ft_print_comb: ["c00", "ex05"], ft_print_comb2: ["c00", "ex06"], ft_putnbr: ["c00", "ex07"], ft_print_combn: ["c00", "ex08"],
    ft_ft: ["c01", "ex00"], ft_ultimate_ft: ["c01", "ex01"], ft_swap: ["c01", "ex02"], ft_div_mod: ["c01", "ex03"], ft_ultimate_div_mod: ["c01", "ex04"], ft_putstr: ["c01", "ex05"],
    ft_strlen: ["c01", "ex06"], ft_rev_int_tab: ["c01", "ex07"], ft_sort_int_tab: ["c01", "ex08"],
    ft_strcpy: ["c02", "ex00"], ft_strncpy: ["c02", "ex01"], ft_str_is_alpha: ["c02", "ex02"], ft_str_is_numeric: ["c02", "ex03"], ft_str_is_printable: ["c02", "ex06"],
    ft_strupcase: ["c02", "ex07"], ft_strlowcase: ["c02", "ex08"], ft_strcapitalize: ["c02", "ex09"],
    ft_strcmp: ["c03", "ex00"], ft_strncmp: ["c03", "ex01"], ft_strcat: ["c03", "ex02"], ft_strncat: ["c03", "ex03"], ft_strstr: ["c03", "ex04"],
    ft_atoi: ["c04", "ex03"], ft_putnbr_base: ["c04", "ex04"],
    ft_iterative_factorial: ["c05", "ex00"], ft_recursive_factorial: ["c05", "ex01"], ft_iterative_power: ["c05", "ex02"], ft_recursive_power: ["c05", "ex03"],
    ft_fibonacci: ["c05", "ex04"], ft_sqrt: ["c05", "ex05"], ft_is_prime: ["c05", "ex06"], ft_find_next_prime: ["c05", "ex07"],
    ft_print_program_name: ["c06", "ex00"], ft_print_params: ["c06", "ex01"], ft_rev_params: ["c06", "ex02"], ft_sort_params: ["c06", "ex03"],
    ft_strdup: ["c07", "ex00"], ft_range: ["c07", "ex01"], ft_ultimate_range: ["c07", "ex02"], ft_strjoin: ["c07", "ex03"],
    ft_point: ["c08", "ex03"], ft_foreach: ["c11", "ex00"], ft_map: ["c11", "ex01"],
    ft_create_elem: ["c12", "ex00"], ft_list_push_front: ["c12", "ex01"], ft_list_size: ["c12", "ex02"], ft_list_last: ["c12", "ex03"], ft_list_clear: ["c12", "ex06"],
    cesar_v4: ["projets", "cesar_v4"], cesar_v2: ["projets", "cesar_v2"], cesar_v5: ["projets", "cesar_v5"], cesar_v6: ["projets", "cesar_v6"],
    mini_cat: ["projets", "mini_cat"], plus_ou_moins: ["projets", "plus_ou_moins"], pendu: ["projets", "pendu"]
  };
  const ARGS = {ft_print_params: "un deux trois", ft_rev_params: "un deux trois", ft_sort_params: "zebre Arbre moto 42", mini_cat: "mini_cat.c"};

  function exoSteps(e) {
    const en = env(), p = PLACE[e.id] || ["exercices", e.id], path = p[0] + en.sep + p[1], f = e.fichier || e.id + ".c", prog = !!e.main;
    const wsl = pc().env === "wsl";
    return [
      {t: "Lis le sujet", d: "Fichier à rendre, fonctions autorisées, exemples, pièges. Sur ton téléphone avant de t'asseoir, ou ici.", a: ["Ouvrir le sujet", "#atelier-" + e.id]},
      {t: "Crée le dossier et le fichier", d: "Dans " + en.term + ", depuis ton dossier piscine (tape `pwd` pour vérifier où tu es) :", c: [en.mk + " " + path, "cd " + path, "code " + f]},
      e.hdr ? {t: "Crée aussi " + e.hdr, d: "Le sujet te donne ce que ce header doit contenir. N'oublie pas la protection #ifndef / #define / #endif.", c: ["code " + e.hdr], pre: e.hdrCode} : null,
      {t: prog ? "Écris ton programme" : "Écris ta fonction", d: prog ? "Le programme entier, avec son main, dans " + f + "." : "Seulement la fonction, sans main, dans " + f + ". Son prototype :", pre: prog ? "" : e.proto},
      prog ? null : {t: "Écris un main.c de test", d: "Il déclare le prototype" + (e.hdr ? " (ou inclut " + e.hdr + ")" : "") + ", appelle ta fonction avec plusieurs cas, dont les cas limites, puis fait return (0). Ce fichier ne se rend jamais.", c: ["code main.c"]},
      {t: "Compile sans aucun avertissement", d: "Les trois options sont obligatoires à 42 : le moindre avertissement devient une erreur.", c: [en.cc + " -Wall -Wextra -Werror " + f + (prog ? "" : " main.c")]},
      {t: "Teste plusieurs cas", d: prog ? (ARGS[e.id] ? "Essaie aussi sans argument, et avec d'autres arguments." : "Joue plusieurs parties, et essaie de le piéger avec des saisies bizarres.") : "Compare avec les exemples du sujet. Pense aux cas limites : 0, négatif, chaîne vide…", c: [en.run + (ARGS[e.id] ? " " + ARGS[e.id] : "")]},
      wsl ? {t: "Vérifie la Norme", d: "Corrige tout ce qu'elle signale.", c: ["norminette " + f + (e.hdr ? " " + e.hdr : "")]}
          : {t: "Vérifie la Norme", d: "Pas de norminette sur Windows : colle ton code dans l'atelier de l'appli, sa mini norminette vérifie les règles principales.", a: ["Ouvrir l'atelier", "#atelier-" + e.id]},
      {t: "Enregistre-le avec Git", d: "Seulement le fichier à rendre, pas le main.c de test. Puis remonte de deux dossiers pour revenir dans piscine.", c: ["git add " + f + (e.hdr ? " " + e.hdr : ""), 'git commit -m "' + p[0] + " " + p[1] + " : " + e.id + '"', "cd .." + en.sep + ".."]},
      {t: "Fais-le relire par le prof", d: "Colle ton code dans ta conversation avec le prof sur Claude : il le relit comme un correcteur de 42, sans te donner la solution."}
    ].filter(Boolean);
  }

  /* ---------- Le programme : 9 blocs de missions ---------- */
  const setupSteps = en => en === ENV.wsl ? [
    {t: "Ouvre Ubuntu", d: "Menu Démarrer → Ubuntu. Si Ubuntu n'est pas encore installé, fais d'abord la mission « Passer sous Ubuntu » (bloc 7)."},
    {t: "Crée ton dossier de travail", c: ["mkdir -p ~/piscine", "cd ~/piscine", "code ."]},
    {t: "Vérifie le compilateur", c: ["cc --version"]},
    {t: "Présente-toi à Git", c: ['git config --global user.name "Ton prénom"', 'git config --global user.email "ton@email.fr"']},
    {t: "Crée ton dépôt Git", d: "Dans le dossier piscine : Git va suivre tout ton travail.", c: ["git init"]}
  ] : [
    {t: "Crée ton dossier de travail", d: "Dans l'Explorateur de fichiers, crée un dossier **piscine** dans Documents. Puis dans VS Code : Fichier → Ouvrir le dossier → piscine."},
    {t: "Ouvre le terminal intégré", d: "Menu Terminal → Nouveau terminal. C'est là que tu taperas toutes tes commandes."},
    {t: "Vérifie le compilateur", d: "Si une version s'affiche, c'est bon. Si « gcc n'est pas reconnu », fais l'étape suivante.", c: ["gcc --version"]},
    {t: "Ajoute GCC au PATH pour de bon", d: "Touche Windows, tape « variables d'environnement », ouvre « Modifier les variables d'environnement pour votre compte ». Choisis **Path** → Modifier → Nouveau, colle le chemin ci-dessous, puis OK partout. Ferme et rouvre VS Code, puis refais `gcc --version`.", c: ["C:\\msys64\\ucrt64\\bin"]},
    {t: "Installe deux extensions", d: "Dans VS Code, onglet Extensions : **C/C++** de Microsoft (couleurs et aide pour le C) et **42 Header** (l'en-tête des fichiers de 42)."},
    {t: "Vérifie Git", d: "Si Git n'est pas reconnu, installe « Git for Windows » depuis git-scm.com (gratuit), puis rouvre VS Code.", c: ["git --version"]},
    {t: "Présente-toi à Git", c: ['git config --global user.name "Ton prénom"', 'git config --global user.email "ton@email.fr"']},
    {t: "Crée ton dépôt Git", d: "Dans le dossier piscine : Git va suivre tout ton travail.", c: ["git init"]}
  ];

  const BLOCS = [
    {t: "Démarrer sur ton PC", d: "Ton poste de travail, le module C00 et Git.", m: [
      {id: "m01", t: "Préparer ton poste", dur: 20, avant: ["compilation"], intro: "Une seule fois : un dossier de travail, le compilateur, VS Code et Git, prêts à servir.", steps: setupSteps},
      {id: "m02", t: "ft_putchar, ton premier exercice", dur: 30, avant: ["write"], intro: "Un exercice tout simple pour tester toute la chaîne : écrire, compiler, tester, ranger.", x: ["ft_putchar"]},
      {id: "m03", t: "Les alphabets", dur: 40, avant: ["ascii", "boucles"], intro: "Ta première boucle : un caractère est un nombre, et on peut lui ajouter 1.", x: ["ft_print_alphabet", "ft_print_reverse_alphabet"]},
      {id: "m04", t: "Chiffres et signe", dur: 30, avant: ["conditions"], intro: "La différence entre 0 et '0', et ta première condition.", x: ["ft_print_numbers", "ft_is_negative"]},
      {id: "m05", t: "Ton premier vrai commit", dur: 25, avant: ["git"], intro: "Git garde l'historique de ton travail. À 42, c'est par Git que tu rends tes exercices.", steps: en => [
        {t: "Regarde l'état de ton dépôt", d: "Git liste ce qui a changé et ce qu'il ne suit pas encore.", c: ["git status"]},
        {t: "Ignore les fichiers inutiles", d: "Crée un fichier **.gitignore** à la racine de piscine, avec une ligne par nom : le programme compilé (" + (en === ENV.wsl ? "a.out" : "a.exe") + ") et main.c. Git ne les proposera plus.", c: ["code .gitignore"]},
        {t: "Enregistre tout ton C00", c: ["git add .", 'git commit -m "c00 : mes premiers exercices"']},
        {t: "Regarde l'historique", c: ["git log --oneline"]},
        {t: "Défi : voir une modification", d: "Change une ligne d'un exercice, regarde ce que Git affiche avec la commande ci-dessous, puis fais un nouveau commit.", c: ["git diff"]},
        {t: "Entraîne-toi en jouant", d: "Learn Git Branching, gratuit dans ton navigateur : fais au moins le premier niveau.", a: ["Ouvrir Learn Git Branching", "https://learngitbranching.js.org/?locale=fr_FR"]}
      ]},
      {id: "m06", t: "Les combinaisons", dur: 50, avant: ["fonctions"], intro: "Trois boucles imbriquées et un affichage soigné : un classique des examens.", x: ["ft_print_comb"]},
      {id: "m07", t: "Les combinaisons, niveau 2", dur: 60, avant: ["boucles"], intro: "Le même principe avec des nombres à deux chiffres. Prends le temps de l'écrire sur papier d'abord.", x: ["ft_print_comb2"]}
    ]},
    {t: "Les pointeurs (C01)", d: "Écrire à une adresse, échanger, parcourir et trier.", m: [
      {id: "m08", t: "Écrire à une adresse", dur: 40, avant: ["pointeurs"], intro: "Un pointeur, c'est une adresse. ft_ultimate_ft va jusqu'à neuf étoiles : dessine les cases.", x: ["ft_ft", "ft_ultimate_ft"]},
      {id: "m09", t: "Échanger et diviser", dur: 45, avant: ["pointeurs"], intro: "Une fonction ne peut renvoyer qu'une valeur… sauf si on lui donne des adresses.", x: ["ft_swap", "ft_div_mod", "ft_ultimate_div_mod"]},
      {id: "m10", t: "Parcourir une chaîne", dur: 40, avant: ["chaines"], intro: "Une chaîne se termine par '\\0' : c'est ta condition d'arrêt. Tu retrouves ft_strlen, que je t'avais donné.", x: ["ft_putstr", "ft_strlen"]},
      {id: "m11", t: "Retourner et trier un tableau", dur: 60, avant: ["pointeurs", "boucles"], intro: "Ton premier algorithme de tri. Fais-le d'abord à la main avec 5 cartes à jouer.", x: ["ft_rev_int_tab", "ft_sort_int_tab"]}
    ]},
    {t: "Les chaînes (C02, C03)", d: "Copier, tester, transformer, comparer et chercher.", m: [
      {id: "m12", t: "Copier une chaîne", dur: 40, avant: ["chaines"], intro: "N'oublie jamais le '\\0' final, et lis bien ce que fait strncpy quand la source est courte.", x: ["ft_strcpy", "ft_strncpy"]},
      {id: "m13", t: "Tester le contenu d'une chaîne", dur: 40, avant: ["ascii"], intro: "Trois fonctions presque pareilles : trouve ce qui change et ce qui reste.", x: ["ft_str_is_alpha", "ft_str_is_numeric", "ft_str_is_printable"]},
      {id: "m14", t: "Changer la casse", dur: 50, avant: ["ascii"], intro: "Majuscules, minuscules, puis la vraie difficulté : le début de chaque mot.", x: ["ft_strupcase", "ft_strlowcase", "ft_strcapitalize"]},
      {id: "m15", t: "Comparer deux chaînes", dur: 40, avant: ["chaines"], intro: "Que renvoie la vraie strcmp ? Teste-la dans ton main pour comparer.", x: ["ft_strcmp", "ft_strncmp"]},
      {id: "m16", t: "Coller et chercher", dur: 60, avant: ["chaines"], intro: "Ajouter une chaîne au bout d'une autre, puis chercher une aiguille dans une botte de foin.", x: ["ft_strcat", "ft_strncat", "ft_strstr"]}
    ]},
    {t: "Les nombres (C04, C05)", d: "Afficher et lire des nombres, récursivité et maths.", m: [
      {id: "m17", t: "Afficher un nombre", dur: 60, avant: ["fonctions", "ascii"], intro: "write n'affiche que des caractères : il faut découper le nombre. Attention au plus petit int.", x: ["ft_putnbr"]},
      {id: "m18", t: "Lire un nombre", dur: 50, avant: ["ascii"], intro: "Espaces, signes, chiffres : lis le sujet trois fois avant de coder.", x: ["ft_atoi"]},
      {id: "m19", t: "Factorielle et puissance", dur: 50, avant: ["fonctions"], intro: "Chaque calcul deux fois : avec une boucle, puis avec une fonction qui s'appelle elle-même.", x: ["ft_iterative_factorial", "ft_recursive_factorial", "ft_iterative_power", "ft_recursive_power"]},
      {id: "m20", t: "Fibonacci et racine carrée", dur: 45, avant: ["fonctions"], intro: "Deux suites de calculs : pense aux cas où il faut renvoyer -1 ou 0.", x: ["ft_fibonacci", "ft_sqrt"]},
      {id: "m21", t: "Les nombres premiers", dur: 45, avant: ["calculs"], intro: "Un nombre premier n'a que deux diviseurs. Jusqu'où faut-il vraiment chercher ?", x: ["ft_is_prime", "ft_find_next_prime"]},
      {id: "m22", t: "Les bases et les combinaisons", dur: 90, avant: ["ascii", "fonctions"], intro: "Deux exercices difficiles : n'hésite pas à les faire sur deux soirs.", x: ["ft_putnbr_base", "ft_print_combn"]}
    ]},
    {t: "Programmes et malloc (C06, C07)", d: "Lire les arguments, réserver de la mémoire, et ton premier examen blanc.", m: [
      {id: "m23", t: "Lire les arguments", dur: 40, avant: ["chaines"], intro: "argc compte, argv contient. Le premier argument, c'est le nom du programme.", x: ["ft_print_program_name", "ft_print_params", "ft_rev_params"]},
      {id: "m24", t: "Trier les arguments", dur: 50, avant: ["chaines"], intro: "Ton tri du bloc 2, appliqué à des chaînes : tu as déjà toutes les pièces.", x: ["ft_sort_params"]},
      {id: "m25", t: "Réserver de la mémoire", dur: 45, avant: ["malloc"], intro: "malloc peut échouer : vérifie toujours ce qu'il renvoie.", x: ["ft_strdup", "ft_range"]},
      {id: "m26", t: "malloc, niveau 2", dur: 60, avant: ["malloc", "pointeurs"], intro: "Calculer la bonne taille avant de réserver : c'est tout l'enjeu.", x: ["ft_ultimate_range", "ft_strjoin"]},
      {id: "m27", t: "Ton premier examen blanc sur PC", dur: 60, avant: [], intro: "Comme à 42 : seul, chronométré, sans internet et sans tes notes.", steps: en => [
        {t: "Prépare-toi comme le jour J", d: "Téléphone en mode avion, une seule fenêtre ouverte : l'examen blanc de l'appli, sur ton PC ou ton téléphone."},
        {t: "Lance l'examen", d: "Choisis 1 h. L'appli te donne un sujet par niveau et lance le chrono.", a: ["Ouvrir l'examen blanc", "#examen"]},
        {t: "Code chaque sujet sur ton PC", d: "Un dossier exam, un sous-dossier par sujet. Compile avec les trois options et teste avant de valider.", c: [en.mk + " exam" + en.sep + "niveau1"]},
        {t: "Valide honnêtement", d: "Si ce n'est pas parfait, c'est raté, comme à 42 : on passe au sujet suivant du même niveau."},
        {t: "Fais ton bilan", d: "Note ce qui t'a bloqué et montre ton code au prof. Recommence chaque semaine."}
      ]}
    ]},
    {t: "Tes projets", d: "Des programmes complets : ton chiffrement de César et trois petits jeux.", m: [
      {id: "m28", t: "César : un mot entier", dur: 50, avant: ["cesar", "chaines"], intro: "La suite de ton projet : tu as réussi les versions 1 et 3, place au mot entier.", x: ["cesar_v4"]},
      {id: "m29", t: "César : la clé et les minuscules", dur: 60, avant: ["cesar", "ascii"], intro: "Demander la clé, puis gérer les minuscules et la ponctuation.", x: ["cesar_v2", "cesar_v5"]},
      {id: "m30", t: "César : déchiffrer", dur: 40, avant: ["cesar"], intro: "Faire le chemin inverse : et si la clé est inconnue ?", x: ["cesar_v6"]},
      {id: "m31", t: "Recoder cat", dur: 60, avant: ["fichiers_c"], intro: "open, read, write, close : ton premier outil du terminal fait maison.", x: ["mini_cat"]},
      {id: "m32", t: "Le jeu du plus ou moins", dur: 45, avant: ["conditions", "boucles"], intro: "Un vrai petit jeu : un nombre au hasard, des essais, des indices.", x: ["plus_ou_moins"]},
      {id: "m33", t: "Le jeu du pendu", dur: 90, avant: ["chaines"], intro: "Le plus gros programme de ce bloc : découpe-le en petites fonctions.", x: ["pendu"]}
    ]},
    {t: "Linux pour de vrai", d: "Passer sous Ubuntu, la vraie norminette, le terminal et Bandit.", m: [
      {id: "m34", t: "Passer sous Ubuntu (WSL)", dur: 40, avant: ["arborescence", "paquets"], intro: "Le vrai Linux dans ton Windows, comme sur les machines de 42.", steps: () => [
        {t: "Installe Ubuntu", d: "Clic droit sur le bouton Démarrer → « Terminal (administrateur) ». Tape la commande ci-dessous, puis redémarre le PC.", c: ["wsl --install"]},
        {t: "Crée ton compte Linux", d: "Au redémarrage, Ubuntu demande un nom d'utilisateur et un mot de passe : note-les. Le mot de passe ne s'affiche pas quand tu le tapes, c'est normal."},
        {t: "Mets Ubuntu à jour", c: ["sudo apt update && sudo apt upgrade -y"]},
        {t: "Installe les outils du C", d: "Le compilateur, le débogueur, valgrind (pour les fuites de mémoire) et Git.", c: ["sudo apt install -y build-essential gdb valgrind git"]},
        {t: "Relie VS Code à Ubuntu", d: "Dans VS Code, installe l'extension **WSL** de Microsoft. Ensuite, depuis Ubuntu, `code .` ouvre VS Code dans ton dossier Linux.", c: ["code ."]},
        {t: "Rapatrie ta piscine", d: "Tes fichiers Windows sont visibles sous /mnt/c. Remplace TON_NOM par ton nom d'utilisateur Windows.", c: ["cp -r /mnt/c/Users/TON_NOM/Documents/piscine ~/", "cd ~/piscine && git status"]},
        {t: "Passe l'appli en mode Ubuntu", d: "Toutes les commandes des missions s'adapteront (cc, ./a.out, norminette).", env: "wsl"}
      ]},
      {id: "m35", t: "La vraie norminette", dur: 30, avant: ["environnement"], intro: "Le même outil que celui de 42. Ton code sera jugé par lui.", steps: () => [
        {t: "Installe pipx", c: ["sudo apt install -y pipx"]},
        {t: "Installe la norminette", c: ["pipx install norminette", "pipx ensurepath"]},
        {t: "Vérifie", d: "Ferme et rouvre Ubuntu d'abord.", c: ["norminette --version"]},
        {t: "Règle l'en-tête 42", d: "Dans les réglages de VS Code, cherche « 42header » : mets ton identifiant et ton e-mail. Le raccourci Ctrl+Alt+H ajoute l'en-tête en haut du fichier."},
        {t: "Passe tout ton C00 à la norminette", d: "Corrige toutes les erreurs, puis fais un commit.", c: ["norminette c00"]},
        {t: "Fais pareil pour les autres modules", c: ["norminette ."]}
      ]},
      {id: "m36", t: "Le terminal, comme au Shell00", dur: 60, avant: ["fichiers", "permissions", "redirections"], intro: "Dix défis dans le vrai terminal, à faire dans un dossier ~/shell00. Je ne te donne que l'objectif : `man` est ton meilleur ami.", steps: () => [
        {t: "Un fichier z", d: "Crée un fichier **z** qui contient seulement la lettre Z puis un retour à la ligne. Vérifie avec `cat -e z` : tu dois voir `Z$`.", c: ["mkdir -p ~/shell00 && cd ~/shell00"]},
        {t: "Une petite arborescence", d: "Crée un dossier test avec 3 fichiers et 1 sous-dossier dedans, puis affiche leur liste détaillée.", c: ["ls -l test"]},
        {t: "Des droits précis", d: "Donne à un fichier les droits `rwxr-x--x`, puis vérifie avec `ls -l`."},
        {t: "Une archive", d: "Fais une archive .tar de ton dossier test, puis extrais-la dans un autre dossier.", c: ["man tar"]},
        {t: "Retrouver tes fichiers", d: "Affiche tous les fichiers .c de ta piscine, avec leur chemin.", c: ["man find"]},
        {t: "Compter", d: "Compte le nombre de lignes de tous tes fichiers .c.", c: ["man wc"]},
        {t: "Chercher dans le code", d: "Affiche seulement les lignes de ta piscine qui contiennent `write`.", c: ["man grep"]},
        {t: "Rediriger", d: "Mets la sortie d'une commande dans un fichier, puis ajoute une autre sortie à la fin sans effacer la première."},
        {t: "Enchaîner", d: "Avec un pipe, compte combien de fichiers .c contient ta piscine."},
        {t: "Récent", d: "Trouve les fichiers de ta piscine modifiés il y a moins de 2 jours."}
      ]},
      {id: "m37", t: "Bandit, pour de vrai", dur: 45, avant: ["ssh"], intro: "Reprends OverTheWire Bandit au niveau 4, depuis ton vrai terminal. Aucun indice : c'est toi qui cherches.", steps: () => [
        {t: "Connecte-toi au niveau 4", d: "Le mot de passe est dans ton carnet Bandit.", c: ["ssh bandit4@bandit.labs.overthewire.org -p 2220"]},
        {t: "Lis la consigne du niveau suivant", d: "Sur le site d'OverTheWire, page du niveau 4 → 5.", a: ["Ouvrir OverTheWire Bandit", "https://overthewire.org/wargames/bandit/"]},
        {t: "Note le mot de passe trouvé", d: "Dans ton carnet, avec la méthode que tu as utilisée.", a: ["Ouvrir le carnet Bandit", "#bandit"]},
        {t: "Quitte proprement", c: ["exit"]},
        {t: "Fais au moins deux niveaux", d: "Si tu bloques plus de 20 minutes, relis la page du niveau, puis demande-moi un indice sur la notion, pas la réponse."}
      ]},
      {id: "m38", t: "Ton premier script", dur: 45, avant: ["scripts"], intro: "Fais travailler le terminal à ta place : un script qui teste tes exercices.", steps: () => [
        {t: "Crée le script", d: "Dans ~/piscine, un fichier **test.sh** qui commence par le shebang de Bash.", c: ["code ~/piscine/test.sh"]},
        {t: "Ce qu'il doit faire", d: "Recevoir un dossier d'exercice en argument, compiler tous ses .c avec les trois options, lancer le programme, puis supprimer a.out."},
        {t: "Rends-le exécutable et lance-le", c: ["chmod +x test.sh", "./test.sh c00/ex00"]},
        {t: "Améliore-le", d: "S'il n'y a pas d'argument, il affiche comment l'utiliser et s'arrête avec un code d'erreur."}
      ]}
    ]},
    {t: "Structures et listes (C08 à C12)", d: "Regrouper des données, les chaîner, passer des fonctions.", m: [
      {id: "m39", t: "Ta première structure", dur: 40, avant: ["structures", "preprocesseur"], intro: "Un header protégé, un typedef, et une fonction qui remplit une structure.", x: ["ft_point"]},
      {id: "m40", t: "Créer une liste chaînée", dur: 60, avant: ["listes", "malloc"], intro: "Chaque maillon connaît le suivant. Dessine-les avant de coder.", x: ["ft_create_elem", "ft_list_push_front", "ft_list_size"]},
      {id: "m41", t: "Parcourir et libérer une liste", dur: 50, avant: ["listes"], intro: "Aller au bout, puis tout libérer sans rien perdre ni fuir.", x: ["ft_list_last", "ft_list_clear"]},
      {id: "m42", t: "Passer une fonction en paramètre", dur: 45, avant: ["ptrfonctions"], intro: "Une fonction qui applique une autre fonction à chaque case d'un tableau.", x: ["ft_foreach", "ft_map"]}
    ]},
    {t: "Vers le tronc commun", d: "Ta première bibliothèque, puis ton premier serveur.", m: [
      {id: "m43", t: "Ton premier Makefile", dur: 60, avant: ["makefile", "bibliotheque"], intro: "Rassemble des fonctions que tu as déjà faites dans une bibliothèque, comme au début de Libft.", steps: en => [
        {t: "Prépare le dossier", d: "Copie dedans 5 fonctions déjà validées : ft_putchar, ft_putstr, ft_strlen, ft_strcmp et ft_swap.", c: [en.mk + " c09" + en.sep + "ex01", "cd c09" + en.sep + "ex01"]},
        {t: "Écris ft.h", d: "Les 5 prototypes, protégés par #ifndef / #define / #endif."},
        {t: "Écris le Makefile", d: "NAME = libft.a, les règles all, clean, fclean et re, et .PHONY. Chaque recette commence par une vraie tabulation.", a: ["Relire le mémo Makefile", "#memos-makefile"]},
        {t: "Compile deux fois", d: "La seconde fois, make ne doit rien refaire : pas de relink.", c: ["make", "make"]},
        {t: "Utilise ta bibliothèque", d: "Un main.c qui appelle tes 5 fonctions, compilé avec ta bibliothèque.", c: [en.cc + " main.c -L. -lft"]},
        {t: "Nettoie", c: ["make fclean"]}
      ]},
      {id: "m44", t: "Born2beroot : un premier serveur", dur: 180, avant: ["serveur", "utilisateurs", "services", "paquets"], intro: "Plusieurs soirées dans VirtualBox (déjà installé sur ton PC) : installer et sécuriser un serveur Debian, comme au premier rang du tronc commun.", steps: () => [
        {t: "Télécharge Debian", d: "L'image « netinst » de la dernière Debian stable, sur debian.org (gratuit).", a: ["Ouvrir debian.org", "https://www.debian.org/distrib/"]},
        {t: "Crée la machine virtuelle", d: "Dans VirtualBox : Debian 64 bits, 2 Go de mémoire, un disque de 10 Go."},
        {t: "Installe sans interface graphique", d: "Avec des partitions chiffrées et LVM : relis la partie LVM du cours avant."},
        {t: "sudo et ton utilisateur", d: "Installe sudo, ajoute ton utilisateur au groupe sudo, et vérifie avec `id`."},
        {t: "SSH sur le port 4242", d: "Connexion root interdite. Teste depuis Ubuntu ou PowerShell avec ssh -p 4242."},
        {t: "Le pare-feu UFW", d: "Tout refuser en entrée, sauf le port 4242."},
        {t: "Des mots de passe solides", d: "Expiration tous les 30 jours, longueur et complexité minimales."},
        {t: "Le script de surveillance", d: "Un script qui affiche l'état de la machine, lancé toutes les 10 minutes avec cron."},
        {t: "Un instantané", d: "Dans VirtualBox, fais un instantané (snapshot) de ta machine qui marche : tu pourras toujours y revenir."}
      ]}
    ]}
  ];
  const MISSIONS = [];
  BLOCS.forEach((b, bi) => b.m.forEach(m => { m.bloc = bi; MISSIONS.push(m); }));
  const MI = Object.fromEntries(MISSIONS.map(m => [m.id, m]));
  const JEU = [["ascii", "La table ASCII"], ["predire", "Que va afficher ce code ?"], ["ascii", "La table ASCII"], ["binaire", "Le binaire"], ["predire", "Que va afficher ce code ?"], ["cesar", "Le code de César"], ["commandes", "La bonne commande"], ["predire", "Que va afficher ce code ?"], ["norme", "La chasse aux fautes de Norme"]];

  /* ---------- Avancement ---------- */
  const exoOk = id => !!atelier().done[id];
  const steps = m => m.x ? [] : (typeof m.steps === "function" ? m.steps(env()) : (m.steps || []));
  function prog(m) {
    if (m.x) { const tot = m.x.length, d = m.x.filter(exoOk).length; return {d, tot, ok: d === tot}; }
    const st = steps(m), d = st.filter((_, k) => pc().steps[m.id + ":" + k]).length;
    return {d, tot: st.length, ok: !!pc().done[m.id] || (st.length > 0 && d === st.length)};
  }
  function sync() { let ch = false; MISSIONS.forEach(m => { if (!pc().done[m.id] && prog(m).ok) { pc().done[m.id] = L.today; ch = true; } }); if (ch) L.save(); }
  const current = () => MISSIONS.find(m => !prog(m).ok) || null;
  const toRead = m => (m && m.avant || []).filter(id => L.TOPIC[id] && !S().seen[id]);
  L.pcInfo = () => { const m = current(); return m ? {id: m.id, t: m.t, read: toRead(m), x: m.x || [], jeu: JEU[m.bloc]} : null; };
  L.PC_MISSIONS = MISSIONS.length;

  /* ---------- Morceaux d'affichage ---------- */
  const cmd = c => `<div class="cmd"><code>${esc(c)}</code><button type="button" class="cpy" data-copy="${esc(c)}" aria-label="Copier la commande">${ic("copy")}</button></div>`;
  const ext = u => /^https:/.test(u) ? ' target="_blank" rel="noopener"' : "";
  function stepList(key, list) {
    return `<ol class="pcsteps">${list.map((s, k) => { const on = !!pc().steps[key + ":" + k];
      return `<li class="${on ? "on" : ""}"><label class="chk"><input type="checkbox" data-pcs="${esc(key + ":" + k)}"${on ? " checked" : ""}><span><b>${esc(s.t)}</b>${s.d ? `<span class="pcd">${inline(s.d)}</span>` : ""}</span></label>`
        + (s.pre ? `<pre class="proto sm">${esc(s.pre)}</pre>` : "") + (s.c || []).map(cmd).join("")
        + (s.a ? `<a class="btn ghost sm" href="${esc(s.a[1])}"${ext(s.a[1])}>${esc(s.a[0])}</a>` : "")
        + (s.env ? `<button class="btn ${pc().env === s.env ? "ghost" : "acc"} sm" type="button" data-pcenv="${s.env}">${pc().env === s.env ? "Mode Ubuntu activé" : "Passer en mode Ubuntu"}</button>` : "") + `</li>`; }).join("")}</ol>`;
  }
  const lessonChip = id => `<a class="chip${S().seen[id] ? " seen" : ""}" href="#cours-${id}">${S().seen[id] ? ic("check2") : ic("book")} ${esc(L.TOPIC[id].t)}</a>`;
  const bar = (d, t) => `<div class="bar"><i style="width:${Math.round(d / Math.max(1, t) * 100)}%"></i></div>`;
  const unit = m => m.x ? (m.x.length > 1 ? m.x.length + " exercices" : "1 exercice") : steps(m).length + " étapes";

  function missionCard(m, big) {
    const p = prog(m), b = BLOCS[m.bloc], rd = toRead(m);
    return `<div class="card pcnow"><div class="pch"><span class="stile bs">${ic("pc")}</span><div><p class="small" style="margin:0">Bloc ${m.bloc + 1} · ${esc(b.t)} · mission ${MISSIONS.indexOf(m) + 1} sur ${MISSIONS.length}</p><b>${esc(m.t)}</b></div></div>
      ${bar(p.d, p.tot)}<p class="small" style="margin:6px 0 10px">${p.d} / ${p.tot} ${m.x ? "exercice" + (p.tot > 1 ? "s" : "") + " validé" + (p.d > 1 ? "s" : "") : "étapes faites"} · environ ${m.dur} min</p>
      ${big ? `<p style="margin:0 0 10px">${inline(m.intro)}</p>` : ""}
      ${rd.length ? `<p class="small" style="margin:0 0 10px">${ic("phone")} Avant, sur ton téléphone : ${rd.map(id => `<a class="link" href="#cours-${id}">${esc(L.TOPIC[id].t)}</a>`).join(", ")}</p>` : ""}
      <a class="btn acc full" href="#pc-${m.id}">${p.d ? "Continuer la mission" : "Commencer la mission"}</a></div>`;
  }

  /* ---------- Accueil : la carte « Sur ton PC » ---------- */
  function home() {
    const box = $("pcHome"); if (!box) return;
    sync();
    const m = current();
    box.innerHTML = m ? missionCard(m, false) : `<div class="card"><p><b>Les ${MISSIONS.length} missions sont terminées. Chapeau !</b></p><a class="btn ghost full" href="#pc">Revoir le programme</a></div>`;
  }

  /* ---------- Sur ton PC ---------- */
  function renderPC() {
    sync();
    const m = current(), doneN = MISSIONS.filter(x => prog(x).ok).length, en = pc().env;
    $("pcBox").innerHTML = `<button class="back" type="button" data-go="#accueil">← Accueil</button>
      <div class="hero"><div><h1>Sur ton PC</h1><p class="sub">Ton programme de ${MISSIONS.length} missions, comme une Piscine : tu codes pour de vrai, l'appli te dit quoi faire et dans quel ordre.</p></div><span class="hart">${L.ART.pc}</span></div>
      <div class="card"><p style="margin:0"><b>${doneN} / ${MISSIONS.length} missions terminées</b></p>${bar(doneN, MISSIONS.length)}</div>
      <h2>Ton environnement</h2>
      <div class="seg" id="pcEnv">${Object.entries(ENV).map(([k, v]) => `<button type="button" data-env="${k}" class="${k === en ? "on" : ""}">${esc(v.t)}</button>`).join("")}</div>
      <p class="small">${esc(env().d)} · ${esc(env().info)}</p>
      <h2>Ta mission du moment</h2>
      ${m ? missionCard(m, true) : `<div class="card"><p><b>Tout est terminé : place au tronc commun !</b></p></div>`}
      <div class="box"><h3>${ic("spark")} La boucle de 42, pour chaque exercice</h3>
        <div class="loop">${["Lire le sujet", "Coder", "Compiler", "Tester", "Norme", "Git", "Relecture"].map((x, i) => `<span>${i + 1}. ${x}</span>`).join("")}</div>
        <p class="small" style="margin:10px 0 0">Bloqué plus de 20 minutes ? Relis le cours, ouvre un indice dans l'atelier, puis demande au prof une explication de la notion, pas la réponse.</p></div>
      <h2>Le programme</h2>
      ${BLOCS.map((b, bi) => { const ms = b.m, dn = ms.filter(x => prog(x).ok).length;
        return `<section class="etape"><div class="etape-h"><span class="num">${bi + 1}</span><div><h2>${esc(b.t)}</h2><p class="small" style="margin:0">${esc(b.d)}</p></div></div>${bar(dn, ms.length)}<div class="small">${dn} / ${ms.length} missions</div>
          <ol class="path">${ms.map(x => { const p = prog(x), now = m && x.id === m.id;
            return `<li><a class="pitem${now ? " next" : ""}" href="#pc-${x.id}"><span class="stile ${p.ok ? "ok" : now ? "gs" : "bs"}">${ic(p.ok ? "check2" : x.x ? "code" : "pc")}</span><span class="ptxt"><b>${esc(x.t)}</b><small>${p.ok ? "Terminée" : now ? "Mission du moment" : ""}${p.ok || now ? " · " : ""}${unit(x)} · ${x.dur} min</small></span><span class="chev">›</span></a></li>`; }).join("")}</ol></section>`; }).join("")}
      <div class="note">Sur ton PC : le code, le terminal, Git, les examens blancs. Sur ton téléphone : les cours, les fiches, les entraînements et les actus. <a class="link" href="#tel">Voir ta partie téléphone</a></div>`;
  }

  function renderMission(id) {
    sync();
    const m = MI[id]; if (!m) { renderPC(); return; }
    const i = MISSIONS.indexOf(m), p = prog(m), b = BLOCS[m.bloc], prev = MISSIONS[i - 1], next = MISSIONS[i + 1];
    const body = m.x ? m.x.map(xid => { const e = EXO(xid); if (!e) return ""; const ok = exoOk(xid), pl = PLACE[xid] || ["exercices", xid];
        return `<div class="card pcx${ok ? " done" : ""}"><div class="pcx-h"><span class="stile ${ok ? "ok" : "bs"}">${ic(ok ? "check2" : "code")}</span><div><b>${esc(e.titre)}</b><p class="small mono" style="margin:2px 0 0">${esc(pl[0] + env().sep + pl[1] + env().sep + (e.fichier || xid + ".c"))}</p></div></div>
          ${stepList(m.id + ":" + xid, exoSteps(e))}
          <button class="btn ${ok ? "ghost" : "acc"} full" type="button" data-pcv="${esc(xid)}">${ok ? "Validé ✓ (annuler)" : "J'ai réussi cet exercice sur mon PC"}</button></div>`; }).join("")
      : `<div class="card">${stepList(m.id, steps(m))}</div>`;
    $("pcBox").innerHTML = `<button class="back" type="button" data-go="#pc">← Sur ton PC</button>
      <p class="small" style="margin:14px 0 0">Bloc ${m.bloc + 1} · ${esc(b.t)} · mission ${i + 1} sur ${MISSIONS.length}</p>
      <h1 style="margin:4px 0 8px">${esc(m.t)}</h1>
      <p>${inline(m.intro)}</p>
      <div class="chips wrapc"><span class="chip">${ic("clock")} environ ${m.dur} min</span><span class="chip">${ic("pc")} ${esc(env().t)}</span><span class="chip${p.ok ? " seen" : ""}">${ic(p.ok ? "check2" : "target")} ${p.d} / ${p.tot}</span></div>
      ${(m.avant || []).filter(x => L.TOPIC[x]).length ? `<div class="box"><h3>${ic("phone")} Avant, sur ton téléphone</h3><p class="small" style="margin:0 0 8px">Lis ces cours et fais leur quiz avant de t'asseoir devant ton PC.</p><div class="chips wrapc">${m.avant.filter(x => L.TOPIC[x]).map(lessonChip).join("")}</div></div>` : ""}
      ${body}
      ${p.ok ? `<div class="box acc"><h3>${ic("medal")} Mission terminée</h3><p style="margin:0">${next ? "La suivante : " + esc(next.t) + "." : "C'était la dernière. Bravo !"}</p></div>` : ""}
      <div class="pcnav">${prev ? `<a class="btn ghost" href="#pc-${prev.id}">← ${esc(prev.t)}</a>` : "<span></span>"}${next ? `<a class="btn ${p.ok ? "acc" : "ghost"}" href="#pc-${next.id}">${esc(next.t)} →</a>` : ""}</div>`;
  }

  /* ---------- Sur ton téléphone ---------- */
  function renderTel() {
    sync();
    const m = current(), rd = toRead(m), jeu = m ? JEU[m.bloc] : ["quiz", "Le grand quiz"];
    const steps = L.phoneSteps ? L.phoneSteps() : [];
    const quick = [["#reviser", "cards", "ys", "10 fiches", "La révision espacée du jour"], ["#jeux-" + jeu[0], "spark", "gs", jeu[1], "L'entraînement qui prépare ta mission"], ["#lexique", "book", "bs", "Le mot du jour", "Un mot du métier"],
      ["#jeux-norme", "alert", "rs", "Les fautes de Norme", "10 questions"], ["#memos", "bookmark", "ys", "Un mémo", "Vim, Git, C, Linux…"], ["#veille", "news", "rs", "Les actus", "Expliquées en image"]];
    $("telBox").innerHTML = `<button class="back" type="button" data-go="#accueil">← Accueil</button>
      <div class="hero"><div><h1>Sur ton téléphone</h1><p class="sub">Tout ce que tu ne fais pas sur ton PC : apprendre, réviser, t'entraîner et suivre l'actu. 15 à 30 minutes par jour, dans les transports ou avant de coder.</p></div><span class="hart">${L.ART.tel}</span></div>
      <h2>Aujourd'hui</h2>
      <div class="steps">${steps.map(x => `<a class="step${x[0] ? " done" : ""}" href="${x[3]}"><span class="stile ${x[0] ? "ok" : x[5]}">${ic(x[0] ? "check2" : x[4])}</span><span><b>${esc(x[1])}</b><small>${esc(x[2])}</small></span><span class="chev">›</span></a>`).join("")}</div>
      ${m ? `<h2>Prépare ta prochaine mission sur PC</h2>
      <div class="card"><p style="margin:0 0 8px"><b>${esc(m.t)}</b> · environ ${m.dur} min</p>
        ${rd.length ? `<p class="small" style="margin:0 0 6px">1. Lis ${rd.length > 1 ? "ces cours" : "ce cours"} et fais le quiz :</p><div class="chips wrapc">${rd.map(lessonChip).join("")}</div>` : `<p class="small" style="margin:0 0 6px">1. Les cours de cette mission sont déjà lus. Relis leurs fiches si besoin.</p>`}
        ${m.x ? `<p class="small" style="margin:10px 0 6px">2. Lis ${m.x.length > 1 ? "les sujets" : "le sujet"}, et réfléchis à ta façon de faire :</p><div class="chips wrapc">${m.x.map(x => `<a class="chip ex${exoOk(x) ? " seen" : ""}" href="#atelier-${x}">${ic(exoOk(x) ? "check2" : "code")} ${esc(x)}</a>`).join("")}</div>` : `<p class="small" style="margin:10px 0 6px">2. Lis les étapes de la mission pour savoir ce qui t'attend.</p>`}
        <p class="small" style="margin:10px 0 6px">3. Échauffe-toi :</p><div class="chips wrapc"><a class="chip" href="#jeux-${jeu[0]}">${ic("spark")} ${esc(jeu[1])}</a></div>
        <a class="btn ghost full" style="margin-top:12px" href="#pc-${m.id}">Voir la mission</a></div>` : ""}
      <h2>Quand tu as 5 minutes</h2>
      <div class="quick">${quick.map(q => `<a class="linkcard" href="${q[0]}"><span class="stile ${q[2]}">${ic(q[1])}</span><span><b>${esc(q[3])}</b><small>${esc(q[4])}</small></span></a>`).join("")}</div>
      <h2>Pour aller plus loin</h2>
      <div class="steps">
        <a class="step" href="#oc"><span class="stile bs">${ic("book")}</span><span><b>Le cours de C d'OpenClassrooms</b><small>Le chapitre suivant, à lire sur ton téléphone</small></span><span class="chev">›</span></a>
        <a class="step" href="#cursus"><span class="stile ys">${ic("flag")}</span><span><b>Ton cursus 42</b><small>Où tu en es, de la Piscine au RNCP 7</small></span><span class="chev">›</span></a>
        <a class="step" href="#bandit"><span class="stile dk">${ic("key")}</span><span><b>Ton carnet Bandit</b><small>Tes mots de passe et tes méthodes</small></span><span class="chev">›</span></a>
      </div>
      <div class="note">Le code, le terminal, Git et les examens blancs se font sur ton PC. <a class="link" href="#pc">Voir ta partie PC</a></div>`;
  }

  /* ---------- Actions ---------- */
  document.addEventListener("change", e => {
    const t = e.target; if (!t.dataset || !t.dataset.pcs) return;
    const k = t.dataset.pcs, s = pc();
    if (t.checked) s.steps[k] = L.today; else delete s.steps[k];
    t.closest("li").classList.toggle("on", t.checked);
    const mid = k.split(":")[0], m = MI[mid];
    if (m && !m.x) { const was = !!s.done[mid], ok = steps(m).every((_, i) => s.steps[mid + ":" + i]);
      if (!ok && was) delete s.done[mid];
      if (ok && !was) { s.done[mid] = L.today; L.toast(`${ic("medal")}<span>Mission terminée : ${esc(m.t)} !</span>`, 3200); L.active(); renderMission(mid); return; } }
    L.save();
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-copy],[data-pcv],[data-pcenv],#pcEnv [data-env]"); if (!b) return;
    if (b.dataset.copy != null) {
      const txt = b.dataset.copy, ok = () => L.toast(`${ic("copy")}<span>Commande copiée</span>`, 1400);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, () => L.toast("Copie impossible : sélectionne la commande à la main.", 2600));
      else L.toast("Copie impossible : sélectionne la commande à la main.", 2600);
      return;
    }
    if (b.dataset.pcv) {
      const id = b.dataset.pcv, a = atelier();
      if (a.done[id]) delete a.done[id]; else { a.done[id] = L.today; S().day.atelier = true; L.toast(`${ic("check")}<span>${esc(id)} réussi sur ton PC, bravo !</span>`, 2400); }
      const v = L.view(); MISSIONS.forEach(m => { if (pc().done[m.id] && !prog(m).ok) delete pc().done[m.id]; });
      L.active(); if (v.v === "pc") renderMission(v.arg);
      return;
    }
    const en = b.dataset.pcenv || b.dataset.env;
    if (en && ENV[en]) { pc().env = en; L.save(); const v = L.view(); if (v.v === "pc") { if (v.arg) renderMission(v.arg); else renderPC(); } L.toast(`${ic("pc")}<span>Commandes adaptées : ${esc(ENV[en].t)}</span>`, 1800); }
  });

  const show = ({v, arg}) => { if (v === "pc") { if (arg) renderMission(arg); else renderPC(); } else if (v === "tel") renderTel(); };
  document.addEventListener("labo:view", ev => show(ev.detail));
  document.addEventListener("labo:refresh", home);
  L.refresh();
  show(L.view());
})();
