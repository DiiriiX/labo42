/* Labo 42 : mémos (antisèches à garder sous la main) */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, inline, ic} = L;

  // Chaque ligne : [ce qu'on tape, ce que ça fait]. Une ligne qui commence par « > » est un paragraphe.
  const MEMOS = [
    {id: "terminal", t: "Le terminal", d: "Les commandes de tous les jours", ic: "term", tone: "dk", cours: "fichiers", s: [
      ["Se repérer", [["pwd", "Où suis-je ?"], ["ls -la", "Tout le contenu du dossier, fichiers cachés et droits compris"], ["cd dossier", "Entrer dans un dossier"], ["cd ..", "Remonter d'un cran"], ["cd ~", "Revenir dans ton dossier personnel"], ["man ls", "Le manuel d'une commande (q pour quitter)"]]],
      ["Lire", [["cat fichier", "Afficher tout le fichier"], ["less fichier", "Lire page par page (q pour quitter)"], ["head -n 5 fichier", "Les 5 premières lignes"], ["tail -n 5 fichier", "Les 5 dernières lignes"], ["cat ./-", "Lire un fichier qui s'appelle -"], ["cat \"mon fichier\"", "Un nom avec des espaces : entre guillemets"]]],
      ["Créer, copier, ranger", [["mkdir -p a/b/c", "Créer des dossiers imbriqués d'un coup"], ["touch fichier", "Créer un fichier vide"], ["cp source copie", "Copier (cp -r pour un dossier)"], ["mv ancien nouveau", "Déplacer ou renommer"], ["rm fichier", "Supprimer, sans corbeille !"], ["rm -r dossier", "Supprimer un dossier et son contenu"]]],
      ["Chercher et compter", [["find . -name \"*.c\"", "Trouver des fichiers par leur nom"], ["find . -type f", "Seulement les fichiers (-type d : les dossiers)"], ["grep mot fichier", "Les lignes qui contiennent mot"], ["grep -i / -v / -c / -n", "Sans casse / l'inverse / compter / numéros de ligne"], ["wc -l fichier", "Compter les lignes (-w : les mots)"], ["sort -n | uniq -c", "Trier des nombres, compter les doublons"]]],
      ["Brancher les commandes", [["a | b", "La sortie de a devient l'entrée de b"], ["cmd > fichier", "Écrire dans un fichier (l'efface d'abord)"], ["cmd >> fichier", "Ajouter à la fin du fichier"], ["cmd < fichier", "Lire l'entrée depuis un fichier"], ["cmd 2> erreurs.txt", "Envoyer les erreurs ailleurs"], ["a && b", "b seulement si a a réussi (|| : si a a échoué)"]]],
      ["Droits", [["ls -l", "Voir les droits : -rwxr-xr--"], ["chmod u+x script.sh", "Rendre exécutable pour toi"], ["chmod 644 fichier", "rw-r--r-- : toi tu modifies, les autres lisent"], ["chmod 755 script.sh", "rwxr-xr-x : tout le monde peut lancer"], ["./script.sh", "Lancer un programme du dossier courant"]]],
      ["Raccourcis", [["Tab", "Compléter un nom (deux fois : les choix)"], ["↑ / ↓", "Rappeler les commandes précédentes"], ["Ctrl + C", "Arrêter le programme en cours"], ["Ctrl + D", "Fin de l'entrée (ou quitter le shell)"], ["Ctrl + L", "Effacer l'écran"], ["history", "Tes dernières commandes"]]]
    ]},
    {id: "vim", t: "Vim", d: "Survivre et être efficace dans Vim", ic: "pencil", tone: "gs", s: [
      ["> Vim a des modes. En mode normal, les touches sont des commandes. En mode insertion, tu tapes du texte. Échap te ramène toujours au mode normal.", []],
      ["Ouvrir, enregistrer, quitter", [["vim fichier.c", "Ouvrir (ou créer) un fichier"], [":w", "Enregistrer"], [":q", "Quitter"], [":wq  ou  :x", "Enregistrer et quitter"], [":q!", "Quitter sans enregistrer"]]],
      ["Écrire", [["i", "Insérer avant le curseur"], ["a", "Insérer après le curseur"], ["o / O", "Nouvelle ligne en dessous / au-dessus"], ["Échap", "Revenir au mode normal"]]],
      ["Se déplacer", [["h j k l", "Gauche, bas, haut, droite"], ["w / b", "Mot suivant / précédent"], ["0 / $", "Début / fin de la ligne"], ["gg / G", "Début / fin du fichier"], [":42", "Aller à la ligne 42"]]],
      ["Modifier", [["x", "Supprimer le caractère"], ["dd", "Couper la ligne"], ["yy", "Copier la ligne"], ["p", "Coller après"], ["u", "Annuler"], ["Ctrl + r", "Refaire"], [".", "Répéter la dernière modification"], [">>  /  <<", "Indenter / désindenter la ligne"]]],
      ["Chercher, remplacer", [["/mot", "Chercher mot (n : suivant, N : précédent)"], [":%s/ancien/nouveau/g", "Remplacer partout dans le fichier"]]],
      ["Confort", [[":set number", "Afficher les numéros de ligne"], [":syntax on", "Couleurs du code"], ["v / V", "Sélectionner des caractères / des lignes"], [":Stdheader  ou  F1", "À 42 : ajouter l'en-tête de l'école (avec le plugin 42header)"]]]
    ]},
    {id: "git", t: "Git", d: "Rendre ton travail sans rien perdre", ic: "save", tone: "bs", cours: "git", s: [
      ["Le cycle", [["git clone adresse", "Récupérer un dépôt"], ["git status", "Voir ce qui a changé (à taper souvent)"], ["git add fichier", "Préparer un fichier (git add . : tout)"], ["git commit -m \"message\"", "Enregistrer une version"], ["git push", "Envoyer tes commits au serveur"], ["git pull", "Récupérer les nouveautés du serveur"]]],
      ["Regarder", [["git log --oneline", "L'historique, une ligne par commit"], ["git diff", "Ce qui a changé et n'est pas encore préparé"], ["git restore fichier", "Annuler tes modifications non préparées"]]],
      ["> À 42, tu rends tes exercices en les poussant sur le dépôt de rendu. Avant la fin, vérifie avec git status et git log que tout est bien poussé : un exercice non poussé n'existe pas.", []],
      ["Les bons réflexes", [["Commits fréquents", "Un commit par étape qui marche"], ["Messages clairs", "« ex02 : gère les nombres négatifs »"], [".gitignore", "Ne pousse jamais a.out, *.o ni de fichiers personnels"], ["Jamais de secret", "Un mot de passe poussé sur Git doit être changé"]]]
    ]},
    {id: "c", t: "Le C", d: "La syntaxe sous les yeux", ic: "code", tone: "bs", cours: "variables", s: [
      ["Types et printf", [["int  %d", "Entier"], ["char  %c", "Caractère (un petit nombre)"], ["char *  %s", "Chaîne de caractères"], ["unsigned int  %u", "Entier sans signe"], ["long  %ld", "Grand entier"], ["float, double  %f", "Nombre à virgule"], ["void *  %p", "Adresse"], ["%x", "Entier en hexadécimal"]]],
      ["Opérateurs", [["+ - * / %", "Calcul ; / entre int = division entière, % = reste"], ["== != < > <= >=", "Comparer (= seul, c'est affecter !)"], ["&& || !", "Et, ou, non"], ["i++  i--", "Ajouter / retirer 1"], ["x += 3", "x = x + 3"]]],
      ["Structures", [["if (cond) … else if … else …", "Choisir un chemin"], ["while (cond) { … }", "Répéter tant que c'est vrai (pas de for à 42)"], ["return (valeur);", "Sortir de la fonction en renvoyant une valeur"]]],
      ["Mémoire", [["int tab[5];", "Un tableau de 5 int : tab[0] à tab[4]"], ["char *s = \"abc\";", "Une chaîne : 'a', 'b', 'c', '\\0'"], ["&x", "L'adresse de x"], ["int *p = &x;", "p pointe sur x ; *p, c'est x"], ["malloc(sizeof(int) * n)", "Réserver n int ; vérifie que ce n'est pas NULL"], ["free(p);", "Rendre la mémoire"]]],
      ["Fonctions utiles", [["write(1, &c, 1);", "Afficher 1 caractère (#include <unistd.h>)"], ["write(1, \"Salut\\n\", 6);", "Afficher un texte de 6 octets"], ["printf(\"%d\\n\", n);", "Afficher un nombre (#include <stdio.h>)"], ["int main(int argc, char **argv)", "argc : nombre d'arguments ; argv[0] : le nom du programme"]]]
    ]},
    {id: "norme", t: "La Norme", d: "Les règles que vérifie la norminette", ic: "check", tone: "gs", s: [
      ["Les tailles", [["25 lignes", "Au plus par fonction, sans compter les accolades"], ["80 colonnes", "Au plus par ligne (une tabulation compte jusqu'à 4)"], ["4 paramètres", "Au plus par fonction"], ["5 variables", "Au plus par fonction"], ["5 fonctions", "Au plus par fichier .c"]]],
      ["Interdits", [["for", "Toutes les boucles en while"], ["do … while, switch, case, goto", "Interdits"], ["a ? b : c", "Le ternaire est interdit"], ["int tab[n];", "Pas de tableau de taille variable"], ["Variables globales", "Interdites, sauf si le sujet les autorise"]]],
      ["La mise en page", [["Tabulations", "Pour indenter, et entre le type et le nom : int\\tft_strlen"], ["{ et }", "Seules sur leur ligne"], ["Déclarations", "En début de fonction, puis une ligne vide"], ["int\\ti;  puis  i = 0;", "Jamais déclarer et affecter sur la même ligne"], ["Une instruction", "Par ligne"], ["if (x)", "Un espace après if, while, return"], ["Une ligne vide", "Entre deux fonctions, jamais deux de suite"], ["Commentaires", "Interdits à l'intérieur des fonctions"], ["(void)", "Pour une fonction sans paramètre"]]],
      ["> Les noms s'écrivent en minuscules, chiffres et _ (snake_case). Lance la norminette avant chaque push : à 42, une seule faute de Norme et l'exercice vaut 0.", []]
    ]},
    {id: "erreurs", t: "Erreurs de compilation", d: "Lire et corriger les messages de cc", ic: "alert", tone: "rs", cours: "compilation", s: [
      ["> Lis toujours la PREMIÈRE erreur : fichier:ligne:colonne, puis le message. Une seule faute peut en provoquer dix autres.", []],
      ["Les messages fréquents", [["expected ';'", "Il manque un point-virgule, souvent à la ligne d'avant"], ["use of undeclared identifier", "Variable non déclarée, ou faute de frappe dans son nom"], ["implicit declaration of function", "Il manque un #include, ou la fonction est mal nommée"], ["unused variable / parameter", "-Werror transforme l'oubli en erreur : supprime ou utilise-la"], ["control reaches end of non-void function", "Il manque un return dans une fonction qui doit renvoyer une valeur"], ["format specifies type 'int' but…", "Le % de printf ne correspond pas au type"], ["undefined reference / Undefined symbols", "L'éditeur de liens ne trouve pas une fonction : fichier oublié, ou pas de main"]]],
      ["À l'exécution", [["Segmentation fault", "Accès mémoire interdit : pointeur NULL, sortie de tableau, chaîne sans '\\0'"], ["Boucle infinie", "Ctrl + C, puis vérifie que la condition finit par être fausse"], ["cc -g -fsanitize=address *.c", "Pour trouver la ligne d'un plantage (pour tester, pas pour le rendu)"]]]
    ]},
    {id: "reseau", t: "Le réseau", d: "Couches, ports, adresses, commandes", ic: "flag", tone: "bs", cours: "osi", s: [
      ["Les 7 couches OSI", [["7 Application", "HTTP, DNS, SSH"], ["6 Présentation", "Formats, chiffrement"], ["5 Session", "Dialogue entre programmes"], ["4 Transport", "TCP, UDP, ports"], ["3 Réseau", "Adresses IP, routage"], ["2 Liaison", "Ethernet, Wi-Fi, adresses MAC"], ["1 Physique", "Câbles, ondes"]]],
      ["Les ports à connaître", [["22", "SSH"], ["80 / 443", "HTTP / HTTPS"], ["53", "DNS"], ["21", "FTP"], ["25", "SMTP (envoi d'e-mails)"], ["3389", "RDP (bureau à distance Windows)"], ["3306 / 5432", "MySQL / PostgreSQL"]]],
      ["Adresses", [["10.0.0.0/8", "Privées"], ["172.16.0.0/12", "Privées (172.16 à 172.31)"], ["192.168.0.0/16", "Privées, celles de ta box"], ["/24 = 255.255.255.0", "254 machines possibles"], ["127.0.0.1", "Ta propre machine (localhost)"]]],
      ["Commandes", [["ip a", "Tes adresses IP"], ["ping -c 4 adresse", "La machine répond-elle ?"], ["traceroute adresse", "Le chemin des paquets"], ["dig exemple.fr", "Demander au DNS"], ["ss -tuln", "Les ports ouverts sur ta machine"], ["curl -I https://site", "Les en-têtes de la réponse HTTP"]]]
    ]},
    {id: "cyber", t: "La cybersécurité", d: "Les bons réflexes et le cadre légal", ic: "key", tone: "rs", cours: "metiers", s: [
      ["Se protéger", [["Mots de passe", "Longs, uniques, dans un gestionnaire"], ["Double authentification", "Partout où c'est possible"], ["Mises à jour", "Les installer vite : elles corrigent des failles"], ["Sauvegardes", "Règle 3-2-1 : 3 copies, 2 supports, 1 hors de chez toi"], ["Liens et pièces jointes", "Vérifier l'expéditeur et l'adresse réelle avant de cliquer"]]],
      ["La triade", [["Confidentialité", "Seules les bonnes personnes lisent"], ["Intégrité", "Personne ne modifie en douce"], ["Disponibilité", "Le service marche quand on en a besoin"]]],
      ["S'entraîner légalement", [["OverTheWire", "Bandit et les autres wargames"], ["Root-Me", "Des centaines de défis, en français"], ["TryHackMe", "Des salles guidées, beaucoup gratuites"], ["PortSwigger Academy", "Les failles web, avec des labos gratuits"]]],
      ["> En France, s'introduire sans autorisation dans un système informatique est un délit (article 323-1 du Code pénal), même « juste pour voir ». On n'attaque que ses propres machines, les plateformes d'entraînement, ou avec une autorisation écrite.", []],
      ["Suivre l'actu", [["CERT-FR", "Les alertes officielles"], ["ANSSI", "L'agence nationale de la sécurité"], ["Cybermalveillance.gouv.fr", "Aide aux victimes, conseils"]]]
    ]},
    {id: "piscine", t: "Survivre à la Piscine", d: "Les réflexes qui font la différence", ic: "flame", tone: "ys", s: [
      ["Chaque jour", [["Lis le sujet en entier", "Nom du fichier, dossier, fonctions autorisées"], ["Teste avec ton main", "Tous les exemples et les cas limites"], ["norminette", "Avant chaque push"], ["git push", "Souvent, et vérifie qu'il est passé"], ["man", "Le premier réflexe quand tu bloques"]]],
      ["Avec les autres", [["Demande à ton voisin", "Le peer-learning est la règle, pas la triche"], ["Explique à ton tour", "C'est comme ça que tu retiens"], ["Corrections", "Prépare-toi à expliquer chaque ligne de ton code"], ["Pas de copier-coller", "Tu devras le refaire seul à l'examen"]]],
      ["Pour tenir", [["Dors", "Un cerveau fatigué ne trouve pas les bugs"], ["Pause", "Bloqué depuis 30 minutes ? Marche 5 minutes"], ["Régularité", "Un peu chaque jour vaut mieux qu'une nuit blanche"]]]
    ]}
  ];
  L.MEMOS = MEMOS;

  function renderHub() {
    $("memosBox").innerHTML = `<div class="hero"><div><h1>Mémos</h1><p class="sub">Les antisèches à garder sous la main pendant que tu codes.</p></div><span class="hart">${L.ART.memos}</span></div>
      <div class="mlist">${MEMOS.map(m => `<a class="linkcard" href="#memos-${m.id}"><span class="stile ${m.tone}">${ic(m.ic)}</span><span><b>${esc(m.t)}</b><small>${esc(m.d)}</small></span><span class="chev">›</span></a>`).join("")}</div>`;
  }
  function renderMemo(id) {
    const m = MEMOS.find(x => x.id === id); if (!m) { renderHub(); return; }
    const t = L.TOPIC[m.cours];
    $("memosBox").innerHTML = `<button class="back" type="button" data-go="#memos">← Mémos</button>
      <div class="mhead"><span class="stile ${m.tone}">${ic(m.ic)}</span><div><h1>${esc(m.t)}</h1><p class="sub">${esc(m.d)}</p></div></div>
      ${m.s.map(([h, rows]) => h.startsWith(">") ? `<p class="note">${inline(h.slice(1).trim())}</p>` : `<h2>${esc(h)}</h2><div class="kv">${rows.map(r => `<div class="kvr"><code>${esc(r[0])}</code><span>${inline(r[1])}</span></div>`).join("")}</div>`).join("")}
      ${t ? `<a class="btn ghost full" href="#cours-${m.cours}">${ic("book")} Le cours lié : ${esc(t.t)}</a>` : ""}`;
  }
  const show = ({v, arg}) => { if (v === "memos") { if (arg) renderMemo(arg); else renderHub(); } };
  document.addEventListener("labo:view", ev => show(ev.detail));
  show(L.view());
})();
