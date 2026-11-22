/* Labo 42 : lexique (mots du terminal, du C, du réseau et de la cyber) */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, inline, ic} = L;

  const CATS = {T: "Terminal", C: "C", R: "Réseau", Y: "Cyber", M: "42 et métiers"};
  const TILE = {T: "dk", C: "bs", R: "gs", Y: "rs", M: "ys"};
  const MOTS = [
    ["Terminal", "T", "La fenêtre où l'on tape des commandes au lieu de cliquer. C'est l'outil de base à 42 comme en cybersécurité.", "fichiers"],
    ["Shell", "T", "Le programme qui lit tes commandes et les exécute. bash et zsh sont des shells.", "fichiers"],
    ["Commande", "T", "Un ordre tapé dans le terminal, comme `ls` ou `cd`, souvent suivi d'options et d'arguments.", "fichiers"],
    ["Option", "T", "Une lettre ou un mot précédé de `-` qui change le comportement d'une commande : `ls -a` montre aussi les fichiers cachés.", "fichiers"],
    ["Répertoire", "T", "Un autre nom pour un dossier : il contient des fichiers et d'autres dossiers.", "fichiers"],
    ["Chemin", "T", "L'adresse d'un fichier. Absolu, depuis la racine : `/home/eleve/notes.txt`. Relatif, depuis là où tu es : `projet/notes.txt`.", "fichiers"],
    ["Racine", "T", "Le dossier tout en haut de l'arborescence Linux, noté `/`.", "fichiers"],
    ["Fichier caché", "T", "Un fichier dont le nom commence par un point. `ls` ne le montre pas, `ls -a` si.", "fichiers"],
    ["Permissions", "T", "Les droits lire (r), écrire (w) et exécuter (x) d'un fichier, pour son propriétaire, son groupe et les autres.", "permissions"],
    ["chmod", "T", "La commande qui change les droits d'un fichier : `chmod 644 page.html`.", "permissions"],
    ["root", "T", "Le super-utilisateur de Linux, qui a tous les droits. Un pirate qui devient root contrôle toute la machine.", "permissions"],
    ["sudo", "T", "Lance une commande avec les droits de root. À utiliser avec prudence.", "permissions"],
    ["Redirection", "T", "Envoyer la sortie d'une commande dans un fichier avec `>` ou `>>`, ou lire un fichier en entrée avec `<`.", "redirections"],
    ["Pipe", "T", "Le symbole `|` branche la sortie d'une commande sur l'entrée de la suivante : `ls | grep txt`.", "redirections"],
    ["grep", "T", "Cherche les lignes qui contiennent un mot, dans un fichier ou dans la sortie d'une commande.", "redirections"],
    ["man", "T", "Affiche le manuel d'une commande ou d'une fonction : `man ls`, `man 2 write`. Le réflexe numéro un à 42.", "fichiers"],
    ["SSH", "T", "Le protocole pour se connecter à une autre machine à distance, par une connexion chiffrée. Port 22 par défaut.", "ssh"],
    ["Git", "T", "L'outil qui garde l'historique de ton code et permet de travailler à plusieurs. À 42, tu rends tous tes projets avec Git.", "git"],
    ["Commit", "T", "Un enregistrement de l'état de ton code dans Git, avec un message qui explique le changement.", "git"],
    ["Dépôt", "T", "Le dossier suivi par Git, avec tout son historique. En anglais : repository.", "git"],
    ["Compilateur", "C", "Le programme qui traduit ton code C en programme exécutable. À 42 : `cc -Wall -Wextra -Werror`.", "compilation"],
    ["main", "C", "La fonction par laquelle démarre tout programme C.", "compilation"],
    ["Variable", "C", "Une case de la mémoire avec un nom, un type et une valeur.", "variables"],
    ["Type", "C", "La nature d'une variable : `int` pour un entier, `char` pour un caractère, `float` pour un nombre à virgule…", "variables"],
    ["int", "C", "Le type des nombres entiers. Sur les machines actuelles, il occupe en général 4 octets : de -2147483648 à 2147483647.", "variables"],
    ["char", "C", "Le type d'un caractère, sur 1 octet. C'est en fait un petit nombre : 'A' vaut 65.", "ascii"],
    ["Condition", "C", "Un test, avec `if`, qui choisit quel code exécuter.", "conditions"],
    ["Boucle", "C", "Un bloc d'instructions répété tant qu'une condition est vraie. À 42, seulement `while` : `for` est interdit par la Norme.", "boucles"],
    ["Fonction", "C", "Un bloc de code qui a un nom, reçoit des paramètres et peut renvoyer une valeur.", "fonctions"],
    ["Prototype", "C", "La ligne qui présente une fonction : type de retour, nom et paramètres. Exemple : `int ft_strlen(char *str)`.", "fonctions"],
    ["Paramètre", "C", "Une valeur que la fonction reçoit quand on l'appelle. Elle en reçoit une copie.", "fonctions"],
    ["return", "C", "Termine la fonction et renvoie une valeur à celui qui l'a appelée.", "fonctions"],
    ["Récursivité", "C", "Quand une fonction s'appelle elle-même. Il faut toujours un cas d'arrêt, sinon elle ne s'arrête jamais.", "fonctions"],
    ["write", "C", "La fonction système qui écrit des octets : `write(1, \"a\", 1)` affiche a à l'écran.", "write"],
    ["Tableau", "C", "Une suite de cases du même type, numérotées à partir de 0 : `tab[0]`, `tab[1]`…", "chaines"],
    ["Chaîne de caractères", "C", "Un tableau de char qui se termine par le caractère `'\\0'`.", "chaines"],
    ["'\\0'", "C", "Le caractère nul, de code 0. Il marque la fin d'une chaîne en C.", "chaines"],
    ["ASCII", "C", "La table qui associe un nombre à chaque caractère : 'A' = 65, 'a' = 97, '0' = 48.", "ascii"],
    ["Adresse", "C", "Le numéro d'une case de la mémoire. `&x` donne l'adresse de x.", "pointeurs"],
    ["Pointeur", "C", "Une variable qui contient une adresse. Si p pointe sur x, `*p` désigne x.", "pointeurs"],
    ["Segfault", "C", "Le plantage d'un programme qui touche une zone de mémoire interdite, souvent à cause d'un pointeur mal utilisé.", "pointeurs"],
    ["malloc", "C", "Réserve de la mémoire sur le tas pendant que le programme tourne. Elle doit être rendue avec `free`.", "malloc"],
    ["free", "C", "Rend au système la mémoire réservée avec `malloc`.", "malloc"],
    ["Fuite de mémoire", "C", "De la mémoire réservée avec `malloc` et jamais rendue avec `free`.", "malloc"],
    ["Norme", "C", "Les règles d'écriture du code à 42 : 25 lignes par fonction, 80 colonnes, pas de `for`… L'outil norminette les vérifie.", ""],
    ["Moulinette", "C", "Le programme de 42 qui corrige automatiquement tes exercices. Il ne fait pas de cadeau : une seule erreur et l'exercice est raté.", ""],
    ["Adresse IP", "R", "Le numéro d'une machine sur un réseau, comme 192.168.1.10.", "reseaulocal"],
    ["Masque", "R", "Il indique quelle partie d'une adresse IP désigne le réseau, et quelle partie la machine. Par exemple /24.", "reseaulocal"],
    ["Routeur", "R", "L'appareil qui relie des réseaux entre eux, comme ta box entre ton réseau local et Internet.", "reseaulocal"],
    ["Réseau local", "R", "Le réseau de ta maison ou de ton école. En anglais : LAN.", "reseaulocal"],
    ["Port", "R", "Un numéro qui désigne un service sur une machine : 22 pour SSH, 443 pour HTTPS.", "ports"],
    ["Protocole", "R", "Les règles que suivent deux machines pour se parler : HTTP, TCP, DNS…", "osi"],
    ["Modèle OSI", "R", "Une façon de découper le réseau en 7 couches, du câble jusqu'à l'application.", "osi"],
    ["Paquet", "R", "Un petit morceau de données envoyé sur le réseau, avec ses adresses de départ et d'arrivée.", "tcp"],
    ["TCP", "R", "Le protocole de transport fiable : il vérifie que tout arrive, et dans l'ordre.", "tcp"],
    ["UDP", "R", "Un protocole de transport rapide mais sans garantie de livraison. Utilisé pour la vidéo en direct ou les jeux en ligne.", "tcp"],
    ["DNS", "R", "L'annuaire d'Internet : il traduit un nom comme exemple.fr en adresse IP.", "dns"],
    ["HTTP", "R", "Le protocole du web : le navigateur envoie une requête, le serveur renvoie une réponse.", "http"],
    ["HTTPS", "R", "HTTP chiffré : personne entre toi et le site ne peut lire ni modifier les échanges.", "http"],
    ["Serveur", "R", "Une machine, ou un programme, qui rend un service à d'autres : les clients.", "http"],
    ["Ping", "R", "Une commande qui vérifie si une machine répond, et en combien de temps.", "reseaulocal"],
    ["Pare-feu", "R", "Un filtre qui autorise ou bloque le trafic réseau selon des règles.", "parefeu"],
    ["VPN", "R", "Un tunnel chiffré entre ton appareil et un autre réseau.", ""],
    ["Wireshark", "R", "Un logiciel gratuit qui capture les paquets du réseau et montre leurs couches une à une.", "osi"],
    ["Cybersécurité", "Y", "Protéger les systèmes, les réseaux et les données contre les attaques.", "metiers"],
    ["Triade CIA", "Y", "Confidentialité, Intégrité, Disponibilité : les trois piliers de la sécurité. En français, on dit aussi DIC.", "triade"],
    ["Chiffrement", "Y", "Transformer un message pour qu'il soit illisible sans la clé.", "cesar"],
    ["Clé", "Y", "L'information secrète qui permet de chiffrer et de déchiffrer.", "cesar"],
    ["Hachage", "Y", "Le calcul d'une empreinte à sens unique : impossible de retrouver le texte de départ. Sert à stocker les mots de passe.", "hachage"],
    ["Force brute", "Y", "Essayer toutes les possibilités jusqu'à trouver la bonne, par exemple tous les mots de passe d'une liste.", "cesar"],
    ["Phishing", "Y", "Un faux message qui imite une vraie entreprise pour voler tes identifiants. En français : hameçonnage.", "phishing"],
    ["Ingénierie sociale", "Y", "Manipuler une personne plutôt qu'une machine pour obtenir un accès.", "phishing"],
    ["Malware", "Y", "Un logiciel malveillant : virus, cheval de Troie, ransomware…", ""],
    ["Ransomware", "Y", "Un malware qui chiffre les fichiers de sa victime et demande une rançon. En français : rançongiciel.", ""],
    ["Vulnérabilité", "Y", "Une faille : une erreur dans un logiciel qu'un attaquant peut exploiter.", "injection"],
    ["CVE", "Y", "Le numéro officiel d'une faille connue, par exemple CVE-2024-3094.", ""],
    ["Exploit", "Y", "Un code ou une méthode qui profite d'une faille.", ""],
    ["Zero-day", "Y", "Une faille exploitée avant que l'éditeur ait publié un correctif.", ""],
    ["Correctif", "Y", "La mise à jour qui corrige une faille. En anglais : patch.", ""],
    ["Injection SQL", "Y", "Une attaque qui glisse du code SQL dans un champ de formulaire pour tromper la base de données.", "injection"],
    ["Double authentification", "Y", "Une deuxième preuve d'identité en plus du mot de passe, comme un code sur ton téléphone. On dit aussi 2FA.", "hachage"],
    ["Logs", "Y", "Le journal de bord d'un système : il note ce qui se passe, heure par heure.", "logs"],
    ["SIEM", "Y", "L'outil qui rassemble les logs de tout un réseau pour repérer les attaques.", "logs"],
    ["SOC", "Y", "Le centre où des analystes surveillent les alertes de sécurité d'une entreprise.", "metiers"],
    ["Pentest", "Y", "Un test d'intrusion : une attaque autorisée pour trouver les failles avant les vrais pirates.", "metiers"],
    ["Red Team, Blue Team", "Y", "L'équipe qui attaque (rouge) et celle qui défend (bleue) pendant un exercice.", "metiers"],
    ["CTF", "Y", "Capture The Flag : une compétition où l'on résout des défis de sécurité pour trouver des « flags ».", "metiers"],
    ["Wargame", "Y", "Un jeu d'entraînement en ligne, niveau après niveau, comme Bandit sur OverTheWire.", "ssh"],
    ["ANSSI", "Y", "L'Agence nationale de la sécurité des systèmes d'information, en France.", "metiers"],
    ["CERT-FR", "Y", "L'équipe française qui publie les alertes et les avis de sécurité. Elle fait partie de l'ANSSI.", "metiers"],
    ["RGPD", "Y", "Le règlement européen qui protège les données personnelles.", "triade"],
    ["Opérateur bit à bit", "C", "Les opérateurs & | ^ ~ << >> qui travaillent sur chaque bit d'un nombre.", "bits"],
    ["Programmation modulaire", "C", "Découper un programme en plusieurs fichiers .c reliés par des fichiers .h.", "modulaire"],
    ["Header guard", "C", "Les lignes #ifndef, #define et #endif qui empêchent d'inclure deux fois un .h. La Norme les exige.", "preprocesseur"],
    ["Macro", "C", "Un #define qui remplace un nom par du texte, parfois avec des paramètres. Attention aux parenthèses.", "preprocesseur"],
    ["Structure", "C", "Un type qui regroupe plusieurs champs : struct s_point { int x; int y; }.", "structures"],
    ["typedef", "C", "Donne un nom court à un type. À 42, les noms de typedef commencent par t_.", "structures"],
    ["Liste chaînée", "C", "Une suite de maillons, chacun avec une donnée et l'adresse du suivant. Le dernier pointe sur NULL.", "listes"],
    ["Pile", "C", "Une structure où le dernier élément ajouté est le premier retiré (LIFO). push_swap en utilise deux.", "piles"],
    ["File", "C", "Une structure où le premier élément ajouté est le premier retiré (FIFO), comme une file d'attente.", "piles"],
    ["Table de hachage", "C", "Un tableau où une fonction de hachage calcule directement la case de chaque clé : la recherche est quasi instantanée.", "tables"],
    ["Débordement de tampon", "Y", "Écrire au-delà de la fin d'un tableau, sur la mémoire voisine. Une faille classique. En anglais : buffer overflow.", "saisie"],
    ["Makefile", "C", "Le fichier qui dit à make comment compiler un projet. À 42 : règles all, clean, fclean, re et $(NAME).", "makefile"],
    ["Bibliothèque statique", "C", "Une archive de fichiers .o (extension .a), créée avec ar et copiée dans le programme à la compilation.", "bibliotheque"],
    ["Fonction variadique", "C", "Une fonction qui accepte un nombre variable d'arguments, comme printf. Outils : va_list, va_start, va_arg, va_end.", "variadiques"],
    ["Variable static", "C", "Une variable locale qui garde sa valeur d'un appel à l'autre. La clé de get_next_line.", "lecture"],
    ["fork", "C", "L'appel système qui crée un processus enfant, copie du parent.", "fork_pipe"],
    ["pipe", "C", "Un tuyau entre deux processus : ce qui est écrit d'un côté se lit de l'autre.", "fork_pipe"],
    ["Thread", "C", "Un fil d'exécution à l'intérieur d'un processus, qui partage sa mémoire avec les autres.", "threads"],
    ["Mutex", "C", "Un verrou qu'un seul thread peut tenir à la fois, pour protéger une donnée partagée.", "threads"],
    ["Pointeur sur fonction", "C", "Une variable qui contient l'adresse d'une fonction : int (*f)(int).", "ptrfonctions"],
    ["Processus", "T", "Un programme en cours d'exécution, identifié par son PID.", "processus"],
    ["PID", "T", "Le numéro unique d'un processus. ps aux les affiche.", "processus"],
    ["Signal", "T", "Un message envoyé à un processus : SIGTERM pour s'arrêter, SIGKILL pour l'arrêter de force, SIGINT avec Ctrl+C.", "processus"],
    ["apt", "T", "Le gestionnaire de paquets de Debian et Ubuntu : apt update, apt upgrade, apt install.", "paquets"],
    ["Variable d'environnement", "T", "Un couple nom = valeur transmis à chaque programme, comme HOME ou USER.", "environnement"],
    ["PATH", "T", "La liste des dossiers où le shell cherche les commandes. Le dossier courant n'y est pas.", "environnement"],
    ["Script", "T", "Un fichier de commandes exécutées dans l'ordre, qui commence par #!/bin/bash.", "scripts"],
    ["systemd", "T", "Le gestionnaire de services de la plupart des Linux actuels. On le pilote avec systemctl.", "services"],
    ["cron", "T", "Le service qui lance des tâches à heures fixes, réglées avec crontab -e.", "services"],
    ["LVM", "T", "Un système qui découpe les disques en volumes faciles à agrandir. Born2beroot l'utilise avec des partitions chiffrées.", "serveur"],
    ["UFW", "T", "Un pare-feu simple pour Linux : ufw default deny incoming, puis ufw allow du nécessaire.", "serveur"],
    ["Libft", "M", "Le premier projet du tronc commun de 42 : ta propre bibliothèque de fonctions C.", "bibliotheque"],
    ["Born2beroot", "M", "Le projet de 42 où l'on installe et sécurise un serveur Linux dans une machine virtuelle.", "serveur"],
    ["Tronc commun", "M", "Les projets à valider à 42 après la Piscine, rang par rang, jusqu'à ft_transcendence.", ""],
    ["RNCP", "M", "Le répertoire national des titres professionnels. Le titre de niveau 7 de 42 équivaut à un master.", ""],
    ["Piscine", "M", "Le mois intensif de sélection de 42, en C et en shell. On y apprend surtout à apprendre seul et avec les autres.", ""],
    ["Peer-learning", "M", "Apprendre entre élèves, sans prof : on s'aide, on s'explique, on se corrige.", ""],
    ["Correction", "M", "À 42, un autre élève vérifie ton projet avec toi et te note. On appelle ça la peer-evaluation.", ""],
    ["Examen", "M", "À 42, une épreuve chronométrée sur machine, sans internet, corrigée automatiquement.", ""],
    ["Cloud", "M", "Des serveurs loués à distance (AWS, Azure, Google Cloud…) au lieu d'avoir ses propres machines.", ""],
    ["IA", "M", "L'intelligence artificielle : des programmes qui apprennent à partir d'exemples pour reconnaître, prédire ou générer du contenu.", ""]
  ];
  L.LEXIQUE = MOTS;
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let q = "", cat = "Tout";

  function card(m) {
    const t = L.TOPIC[m[3]];
    return `<div class="lexc"><span class="ltag ${TILE[m[1]]}">${esc(CATS[m[1]])}</span><b>${esc(m[0])}</b><p>${inline(m[2])}</p>${t ? `<a class="link" href="#cours-${m[3]}">Le cours : ${esc(t.t)}</a>` : ""}</div>`;
  }
  function renderList() {
    const nq = norm(q.trim());
    const list = MOTS.filter(m => (cat === "Tout" || CATS[m[1]] === cat) && (!nq || norm(m[0] + " " + m[2]).includes(nq))).sort((a, b) => norm(a[0]).localeCompare(norm(b[0])));
    const groups = [];
    list.forEach(m => { const l = norm(m[0]).replace(/[^a-z]/g, "")[0] || "#"; const g = groups[groups.length - 1]; if (g && g.l === l.toUpperCase()) g.m.push(m); else groups.push({l: l.toUpperCase(), m: [m]}); });
    $("lexList").innerHTML = list.length ? groups.map(g => `<p class="lexl">${esc(g.l)}</p>` + g.m.map(card).join("")).join("") : `<p class="note">Aucun mot ne correspond. Essaie un autre mot, ou demande au prof dans Claude.</p>`;
    $("lexCount").textContent = list.length + " mot" + (list.length > 1 ? "s" : "");
  }
  function render() {
    if (!$("lexBox").dataset.ready) {
      $("lexBox").dataset.ready = "1";
      $("lexBox").innerHTML = `<label class="search">${ic("search")}<input type="search" id="lexQ" placeholder="Chercher un mot : pointeur, DNS, chmod…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Chercher un mot"></label>
        <div class="chips" id="lexCats">${["Tout"].concat(Object.values(CATS)).map(c => `<button class="chip${c === cat ? " on" : ""}" type="button" data-lc="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        <p class="small" id="lexCount"></p><div id="lexList"></div>`;
      $("lexQ").addEventListener("input", e => { q = e.target.value; renderList(); });
      $("lexCats").addEventListener("click", e => { const b = e.target.closest("[data-lc]"); if (!b) return; cat = b.dataset.lc; $("lexCats").querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b)); renderList(); });
    }
    renderList();
  }

  /* Le mot du jour, sur l'accueil */
  function motDuJour() {
    const box = $("motJour"); if (!box) return;
    const n = Math.floor(new Date(L.today + "T12:00:00").getTime() / 864e5);
    const m = MOTS[((n * 37) % MOTS.length + MOTS.length) % MOTS.length], t = L.TOPIC[m[3]];
    box.innerHTML = `<div class="motj"><div class="motj-h"><span class="ltag ${TILE[m[1]]}">${ic("spark")} Le mot du jour</span><a class="link" href="#lexique">Tout le lexique</a></div><b>${esc(m[0])}</b><p>${inline(m[2])}</p>${t ? `<a class="link" href="#cours-${m[3]}">Le cours : ${esc(t.t)}</a>` : ""}</div>`;
  }

  document.addEventListener("labo:view", e => { if (e.detail.v === "lexique") render(); });
  if (L.view().v === "lexique") render();
  motDuJour();
})();
