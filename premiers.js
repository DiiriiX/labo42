/* Labo 42 : « Premiers pas en C », des exercices courts faits pour le téléphone (choisir, trouver le bug, remettre dans l'ordre) */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, ic, inline} = L;
  const S = () => L.store();
  const st = () => { const s = S(); if (!s.debut) s.debut = {ok: {}, first: {}}; if (!s.debut.ok) s.debut.ok = {}; if (!s.debut.first) s.debut.first = {}; return s.debut; };

  /* t : qcm (choisir), bug (toucher la ligne fautive), ordre (remettre les lignes dans l'ordre). ok : index de la bonne réponse. mine : fichier de son dépôt devcode d'où vient l'exemple. */
  const NIV = [
    {t: "Ce que tu sais déjà", d: "Variables, printf, scanf et calculs : tes tutos, avec leurs pièges.", cours: "variables", q: [
      {t: "qcm", q: "Quel format de printf affiche un `int` ?", ch: ["%d", "%f", "%c", "%s"], ok: 0, ex: "`%d` pour un entier, `%f` pour un float, `%c` pour un caractère, `%s` pour une chaîne."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'float prix = 2.5;\nprintf("%.2f", prix);', ch: ["2.50", "2.5", "2", "%.2f"], ok: 0, ex: "`.2` veut dire : deux chiffres après la virgule."},
      {t: "qcm", q: "Pourquoi met-on `&` devant la variable dans `scanf(\"%d\", &age)` ?", ch: ["Pour donner l'adresse de age : scanf doit écrire dedans", "Pour multiplier age", "Ce n'est pas obligatoire", "Pour afficher age"], ok: 0, ex: "scanf doit modifier ta variable : il lui faut l'endroit où elle se trouve en mémoire, son adresse. Tu retrouveras `&` avec les pointeurs."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int a = 7, b = 2;\nfloat q = a / b;\nprintf("%f", q);', ch: ["3.000000", "3.500000", "3.5", "Une erreur"], ok: 0, mine: "TutoYT/Degré/arithmetique.c", ex: "a et b sont des int : la division est entière (7 / 2 = 3) avant d'être rangée dans le float. Pour obtenir 3.5, il faut `(float)a / b`. Dans ton arithmetique.c, tu fais 10 / 5 : ça tombe juste, alors le piège ne se voit pas."},
      {t: "qcm", q: "Que va afficher `printf(\"%d\", 17 % 5);` ?", ch: ["2", "3", "3.4", "5"], ok: 0, ex: "`%` donne le reste de la division : 17 = 3 × 5 + 2."},
      {t: "bug", q: "Une de ces lignes contient une faute de frappe. Touche-la.", code: 'int nombre;\nprintf("Entrez un nombre : ");\nscanf("%d", &nombre),\nprintf("nombre = %d\\n", nombre);', ok: 2, mine: "TutoYT/lire.c", ex: "Une virgule au lieu d'un point-virgule à la fin de scanf. Ça compile quand même (la virgule colle les deux lignes en une seule instruction), mais c'est une erreur qui peut te piéger. On la trouve dans ton lire.c et ton Degre_convertion.c."},
      {t: "qcm", q: "Que vaut `x` après `int x;`, sans rien d'autre ?", ch: ["N'importe quoi : ce qui traînait en mémoire", "0", "1", "Rien, x n'existe pas"], ok: 0, ex: "Une variable locale non initialisée contient une valeur au hasard. Donne-lui toujours une valeur avant de la lire."},
      {t: "qcm", q: "Que fait `i++` ?", ch: ["Il ajoute 1 à i", "Il multiplie i par 2", "Il affiche i", "Il remet i à 0"], ok: 0, ex: "`i++` est un raccourci pour `i = i + 1`."}
    ]},
    {t: "Conditions et boucles", d: "if, else, while… et pourquoi le for est interdit à 42.", cours: "boucles", q: [
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int n = 4;\nif (n % 2 == 0)\n\tprintf("pair");\nelse\n\tprintf("impair");', ch: ["pair", "impair", "4", "Rien"], ok: 0, ex: "4 % 2 vaut 0 : le reste est nul, donc 4 est pair."},
      {t: "qcm", q: "Avec `if (a > 0 && b > 0)`, quand entre-t-on dans le if ?", ch: ["Si a ET b sont positifs", "Si a OU b est positif", "Jamais", "Toujours"], ok: 0, ex: "`&&` veut dire « et » : les deux conditions doivent être vraies. `||` veut dire « ou »."},
      {t: "bug", q: "Avec annee = 40, ce code affiche « bissextile » au lieu de « trop petite ». Touche la ligne qui est mal placée.", code: 'if ((annee % 4 == 0 && annee % 100 != 0) || annee % 400 == 0)\n\tprintf("bissextile");\nelse if (annee < 45)\n\tprintf("trop petite");\nelse\n\tprintf("pas bissextile");', ok: 2, mine: "TutoYT/bissextile.c", ex: "Le test `annee < 45` arrive trop tard : 40 est déjà accepté par le premier if. On vérifie toujours les cas invalides en premier. C'est dans ton bissextile.c : à toi de le corriger sur ton PC."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int i = 0;\nwhile (i < 3)\n{\n\tprintf("%d", i);\n\ti++;\n}', ch: ["012", "123", "0123", "Il ne s'arrête jamais"], ok: 0, ex: "i vaut 0, 1, puis 2. Quand i vaut 3, la condition `i < 3` est fausse : la boucle s'arrête."},
      {t: "qcm", q: "Ce programme ne s'arrête jamais. Pourquoi ?", code: 'int i = 0;\nwhile (i < 5)\n{\n\tprintf("%d\\n", i);\n}', ch: ["i ne change jamais : il manque i++", "La condition est fausse", "printf bloque la boucle", "Il manque return"], ok: 0, ex: "i reste à 0, donc `i < 5` est toujours vrai. Dans une boucle while, n'oublie jamais de faire avancer ton compteur."},
      {t: "ordre", q: "Remets dans l'ordre cette boucle qui affiche 0 à 4, sans for, comme à 42.", lines: ["int\ti;", "i = 0;", "while (i < 5)", "{", "\tprintf(\"%d\\n\", i);", "\ti++;", "}"], ex: "D'abord la déclaration, puis la valeur de départ, la condition, et le compteur qui avance à la fin de chaque tour."},
      {t: "qcm", q: "À 42, la boucle for est interdite par la Norme. Par quoi la remplace-t-on ?", ch: ["Une boucle while avec un compteur", "Un if", "Plusieurs printf", "On n'utilise pas de boucle"], ok: 0, mine: "TutoYT/boucles.c", ex: "`for (i = 0; i < 5; i++)` devient : `i = 0;` puis `while (i < 5)` avec `i++;` à la fin. Toutes les boucles for de tes tutos peuvent s'écrire comme ça."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int s = 0;\nint i = 1;\nwhile (i <= 3)\n{\n\ts = s + i;\n\ti++;\n}\nprintf("%d", s);', ch: ["6", "3", "4", "0"], ok: 0, mine: "TutoYT/somme.c", ex: "1 + 2 + 3 = 6. C'est ton somme.c, écrit avec while."}
    ]},
    {t: "Tableaux et chaînes", d: "Les cases d'un tableau, le '\\0' et les caractères qui sont des nombres.", cours: "chaines", q: [
      {t: "qcm", q: "Avec `int notes[5];`, quel est le numéro de la dernière case ?", ch: ["4", "5", "1", "0"], ok: 0, ex: "Les cases sont numérotées à partir de 0 : notes[0] à notes[4]."},
      {t: "bug", q: "On entre 3 notes : 10, 12 et 14. La moyenne affichée est 7.20 au lieu de 12. Touche la ligne fausse.", code: 'while (i < nombre)\n{\n\tsomme = somme + notes[i];\n\ti++;\n}\nmoyenne = somme / 5.00;\nprintf("Moyenne : %.2f", moyenne);', ok: 5, mine: "TutoYT/dirix/notes.c", ex: "On divise toujours par 5, au lieu de diviser par le nombre de notes entrées : 36 / 5 = 7.2. Ce bug est dans ton notes.c : corrige-le sur ton PC."},
      {t: "qcm", q: "Comment le C sait-il où se termine la chaîne \"Salut\" ?", ch: ["Grâce au caractère '\\0' caché à la fin", "Il compte les lettres", "Grâce à un espace", "Il ne le sait pas"], ok: 0, ex: "Chaque chaîne finit par un caractère invisible, '\\0' (de code 0). C'est lui qu'on cherche pour savoir où s'arrêter."},
      {t: "qcm", q: "Combien de cases faut-il au minimum dans `char mot[?] = \"chat\";` ?", ch: ["5", "4", "3", "6"], ok: 0, ex: "4 lettres + le '\\0' final = 5 cases."},
      {t: "qcm", q: "Avec `cc -Wall -Wextra -Werror`, ce programme ne compile pas. Quelle ligne manque-t-il en haut ?", code: '#include <stdio.h>\n\nint main(void)\n{\n\tchar prenom[32];\n\n\tscanf("%31s", prenom);\n\tprintf("%lu\\n", strlen(prenom));\n\treturn (0);\n}', ch: ["#include <string.h>", "#include <stdlib.h>", "#include <unistd.h>", "Rien, strlen est dans stdio.h"], ok: 0, mine: "TutoYT/string.c", ex: "strlen est déclarée dans string.h. Sans elle, le compilateur proteste, et avec -Werror ça bloque. C'est le cas de ton string.c : Code Runner compile sans ces options : c'est sans doute pour ça que tu ne l'as pas vu."},
      {t: "qcm", q: "Que va afficher ce code ?", code: "char c = 'a';\nc = c + 1;\nprintf(\"%c\", c);", ch: ["b", "a1", "98", "Une erreur"], ok: 0, ex: "Un char est un nombre, son code ASCII : 'a' vaut 97. 97 + 1 = 98, c'est le code de 'b'."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'char s[] = "abc";\nprintf("%c", s[1]);', ch: ["b", "a", "c", "1"], ok: 0, ex: "Les cases commencent à 0 : s[0] vaut 'a', s[1] vaut 'b'."},
      {t: "qcm", q: "Que se passe-t-il si on écrit dans `notes[10]` alors que le tableau est `float notes[10]` ?", ch: ["On écrit en dehors du tableau : le résultat est imprévisible", "Le tableau s'agrandit tout seul", "Le programme affiche une erreur claire", "Rien du tout"], ok: 0, mine: "TutoYT/dirix/notes.c", ex: "Les cases vont de 0 à 9. Écrire plus loin, c'est un débordement : une faille classique en cybersécurité. Question pour ton notes.c : que se passe-t-il si on entre -3 comme nombre de notes ?"}
    ]},
    {t: "Les fonctions", d: "Paramètres, return, prototypes, et tester sans main.", cours: "fonctions", q: [
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int carre(int x)\n{\n\treturn (x * x);\n}\n\n/* dans main */\nprintf("%d", carre(4));', ch: ["16", "8", "4", "x * x"], ok: 0, ex: "carre(4) renvoie 4 × 4 = 16, et printf affiche cette valeur."},
      {t: "qcm", q: "Que veut dire `void` dans `void dire_bonjour(void)` ?", ch: ["Elle ne renvoie rien et ne prend aucun paramètre", "Elle est vide", "Elle renvoie 0", "Elle est interdite"], ok: 0, ex: "Le premier void : pas de valeur renvoyée. Celui entre parenthèses : aucun paramètre."},
      {t: "qcm", q: "Pourquoi écrire le prototype `int carre(int x);` en haut du fichier ?", ch: ["Pour que le compilateur connaisse la fonction avant qu'on l'appelle", "Pour l'exécuter deux fois", "C'est juste décoratif", "Pour qu'elle aille plus vite"], ok: 0, ex: "Le compilateur lit de haut en bas. Le prototype lui annonce la fonction : son nom, ses paramètres et ce qu'elle renvoie."},
      {t: "qcm", q: "Que manque-t-il avant l'accolade de fin ?", code: 'int addition(int a, int b)\n{\n\tint resultat;\n\n\tresultat = a + b;\n}', ch: ["return (resultat);", "printf(resultat);", "resultat;", "break;"], ok: 0, ex: "Une fonction qui annonce un int doit renvoyer une valeur avec return. À 42, on met des parenthèses : `return (resultat);`."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'void ajoute_un(int n)\n{\n\tn = n + 1;\n}\n\n/* dans main */\nint x = 5;\najoute_un(x);\nprintf("%d", x);', ch: ["5", "6", "1", "Une erreur"], ok: 0, ex: "La fonction reçoit une copie de x : changer n ne change pas x. Pour modifier x, il faut lui donner son adresse. C'est le rôle des pointeurs (niveau 6), comme dans ton pointeur.c."},
      {t: "ordre", q: "Remets dans l'ordre une fonction qui renvoie le plus grand de deux nombres.", lines: ["int\tplus_grand(int a, int b)", "{", "\tif (a > b)", "\t\treturn (a);", "\treturn (b);", "}"], ex: "Si a est plus grand, on le renvoie et la fonction s'arrête là. Sinon, on arrive à la ligne suivante et on renvoie b."},
      {t: "qcm", q: "À 42, ft_putchar se rend sans main. Comment la tester alors ?", ch: ["Avec un fichier main.c à côté, qu'on ne rend pas", "On ne peut pas la tester", "En l'appelant depuis le terminal", "Avec un printf dans la fonction"], ok: 0, ex: "On écrit un petit main.c de test qui appelle la fonction, on compile les deux fichiers ensemble, et on ne rend que le fichier de la fonction."},
      {t: "qcm", q: "Combien de paramètres au plus pour une fonction, selon la Norme de 42 ?", ch: ["4", "5", "10", "2"], ok: 0, mine: "TutoYT/dirix/notes.c", ex: "4. Ta fonction addition(a, b, c, d, e) dans notes.c en a 5 : la norminette la refuserait. Et d'ailleurs, tu ne l'utilises pas !"},
      {t: "qcm", q: "Combien de lignes au plus dans une fonction, selon la Norme ?", ch: ["25", "50", "10", "Pas de limite"], ok: 0, ex: "25 lignes, sans compter les accolades de début et de fin. Au-delà, on découpe en plusieurs fonctions."}
    ]},
    {t: "Vers le style 42", d: "write à la place de printf, et les règles de la Norme.", cours: "write", q: [
      {t: "qcm", q: "À la Piscine, printf est souvent interdit. Avec quoi affiche-t-on ?", ch: ["write", "scanf", "puts", "cout"], ok: 0, ex: "write est la fonction de base du système : elle écrit des octets, sans mise en forme."},
      {t: "qcm", q: "Quel include faut-il pour utiliser write ?", ch: ["#include <unistd.h>", "#include <stdio.h>", "#include <write.h>", "Aucun"], ok: 0, ex: "write est déclarée dans unistd.h, pas dans stdio.h comme printf."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'write(1, "Salut\\n", 6);', ch: ["Salut puis un retour à la ligne", "Salut6", "1Salut", "Rien"], ok: 0, ex: "5 lettres + le retour à la ligne = 6 octets à écrire."},
      {t: "qcm", q: "Dans `write(1, \"ok\", 2)`, que veut dire le 1 ?", ch: ["La sortie standard : l'écran", "Le nombre de lettres", "La ligne numéro 1", "Vrai"], ok: 0, ex: "1, c'est la sortie standard (l'écran). 2, ce serait la sortie d'erreur."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'write(1, "Bonjour", 3);', ch: ["Bon", "Bonjour", "3", "Bonjour3"], ok: 0, ex: "Le troisième paramètre dit combien d'octets écrire : seulement 3."},
      {t: "bug", q: "La norminette refuse ce code. Touche la ligne en cause.", code: 'int\tmain(void)\n{\n\tint\ti;\n\n\tfor (i = 0; i < 3; i++)\n\t\twrite(1, "x", 1);\n\treturn (0);\n}', ok: 4, ex: "for est interdit par la Norme : on écrit la même boucle avec while."},
      {t: "bug", q: "La norminette refuse ce code. Touche la ligne en cause.", code: 'int\tmain(void)\n{\n\twrite(1, "a", 1);\n\tint\tn;\n\n\tn = 2;\n\treturn (0);\n}', ok: 3, ex: "Les déclarations de variables doivent être tout en haut de la fonction, avant les instructions, suivies d'une ligne vide."},
      {t: "qcm", q: "Pourquoi compile-t-on avec `-Wall -Wextra -Werror` ?", ch: ["Pour que le moindre avertissement bloque la compilation", "Pour compiler plus vite", "Pour avoir des couleurs", "Ce n'est pas utile à 42"], ok: 0, ex: "À 42, ton code doit compiler sans aucun avertissement avec ces trois options. Compile toujours comme ça, même pour tes tutos."}
    ]},
    {t: "Premiers pointeurs", d: "Adresses, étoiles, et modifier une variable depuis une fonction.", cours: "pointeurs", q: [
      {t: "qcm", q: "Que donne `&x` ?", ch: ["L'adresse de x en mémoire", "La valeur de x", "x multiplié par 2", "Une erreur"], ok: 0, ex: "`&` donne l'adresse : l'endroit où x est rangée en mémoire."},
      {t: "qcm", q: "Que déclare `int *p;` ?", ch: ["Une variable qui contient l'adresse d'un int", "Un int multiplié par p", "Un tableau d'int", "Un caractère"], ok: 0, ex: "p est un pointeur : il contient une adresse, celle d'un int."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int x = 10;\nint *p = &x;\n*p = 20;\nprintf("%d", x);', ch: ["20", "10", "Une adresse", "Une erreur"], ok: 0, ex: "`*p` veut dire « la case dont p contient l'adresse », c'est-à-dire x. Écrire dans *p change donc x."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'void add_one(int *n)\n{\n\t*n = *n + 1;\n}\n\n/* dans main */\nint v = 42;\nadd_one(&v);\nprintf("%d", v);', ch: ["43", "42", "1", "Une adresse"], ok: 0, mine: "TutoYT/pointeur.c", ex: "Cette fois, la fonction reçoit l'adresse de v : elle modifie le vrai v. Compare avec ajoute_un au niveau 4. C'est ton pointeur.c."},
      {t: "bug", q: "La dernière valeur affichée est un nombre bizarre au lieu de l'année. Touche la ligne fautive.", code: 'printf("jour = %d\\n", naissance[0]);\nprintf("mois = %d\\n", naissance[1]);\nprintf("annee = %d\\n", &naissance[2]);', ok: 2, mine: "TutoYT/dirix/ptr.c", ex: "`&naissance[2]` est l'adresse de la case, pas sa valeur : il ne faut pas de `&` pour afficher la valeur. C'est dans ton ptr.c."},
      {t: "qcm", q: "Quel format de printf affiche une adresse ?", ch: ["%p", "%d", "%a", "%s"], ok: 0, ex: "`%p` affiche une adresse (en hexadécimal). Tu l'as utilisé dans pointeur.c."},
      {t: "qcm", q: "Pour qu'une fonction échange deux variables a et b, que faut-il lui donner ?", ch: ["Leurs adresses", "Leurs valeurs", "Rien", "Un tableau"], ok: 0, ex: "Avec des copies, la fonction échangerait seulement ses copies. Avec les adresses, elle peut modifier les vraies variables."},
      {t: "qcm", q: "Que va afficher ce code ?", code: 'int t[3] = {5, 6, 7};\nint *p = t;\nprintf("%d", *(p + 1));', ch: ["6", "5", "7", "Une adresse"], ok: 0, ex: "Un tableau, c'est l'adresse de sa première case. p + 1 pointe sur la case suivante, donc *(p + 1) vaut t[1]."}
    ]}
  ];
  NIV.forEach((n, i) => n.q.forEach((x, k) => { x.id = (i + 1) + "." + (k + 1); }));
  const ALL = NIV.flatMap(n => n.q);
  L.DEBUT_TOTAL = ALL.length;
  const okN = n => n.q.filter(x => st().ok[x.id]).length;
  const curLvl = () => { const i = NIV.findIndex(n => okN(n) < n.q.length); return i < 0 ? null : i; };
  L.debutInfo = () => { const i = curLvl(), done = ALL.filter(x => st().ok[x.id]).length; return {done, total: ALL.length, lvl: i == null ? null : i + 1, t: i == null ? "" : NIV[i].t}; };

  /* ---------- Affichage ---------- */
  const bar = (d, t) => `<div class="bar"><i style="width:${Math.round(d / Math.max(1, t) * 100)}%"></i></div>`;
  const codeBox = (code, lab) => `<div class="code"><div class="code-h"><i></i><i></i><i></i><span>${lab || "Code C"}</span></div><pre><code>${esc(code)}</code></pre></div>`;
  let run = null;

  function renderHome() {
    const s = st(), done = ALL.filter(x => s.ok[x.id]).length, cur = curLvl();
    $("debutBox").innerHTML = `<button class="back" type="button" data-go="#pratique">← Pratique</button>
      <div class="hero"><div><h1>Premiers pas en C</h1><p class="sub">${ALL.length} petits exercices faits pour le téléphone : choisir, trouver le bug, remettre dans l'ordre. De ce que tu sais déjà jusqu'au style de 42.</p></div><span class="hart">${L.ART.debut}</span></div>
      <div class="card"><p style="margin:0"><b>${done} / ${ALL.length} réussis</b></p>${bar(done, ALL.length)}
        ${cur != null ? `<a class="btn acc full" style="margin-top:12px" href="#debut-${cur + 1}">${done ? "Continuer" : "Commencer"} : niveau ${cur + 1}</a>` : `<p class="small" style="margin:10px 0 0">Tout est réussi : tu es prêt pour l'atelier et pour ft_putchar sur ton PC !</p>`}</div>
      <div class="box"><h3>${ic("bulb")} Tiré de ton code</h3><p style="margin:0">Certains exercices viennent de tes propres fichiers (dépôt devcode). Ils sont marqués « Dans ton code ». Quand tu en trouves un, corrige ton fichier sur ton PC !</p></div>
      ${NIV.map((n, i) => { const d = okN(n), now = i === cur;
        return `<a class="pitem${now ? " next" : ""}" href="#debut-${i + 1}"><span class="stile ${d === n.q.length ? "ok" : now ? "gs" : "bs"}">${d === n.q.length ? ic("check2") : `<b>${i + 1}</b>`}</span><span class="ptxt"><b>${esc(n.t)}</b><small>${esc(n.d)} · ${d} / ${n.q.length}</small></span><span class="chev">›</span></a>`; }).join("")}
      <div class="note">Ensuite, sur ton PC, les missions de « Sur ton PC » te font écrire ces programmes pour de vrai. <a class="link" href="#pc">Voir ta partie PC</a></div>`;
  }

  function start(n) {
    const lvl = NIV[n - 1]; if (!lvl) { renderHome(); return; }
    const todo = lvl.q.filter(x => !st().ok[x.id]);
    run = {n, list: todo.length ? todo : lvl.q.slice(), i: 0, good: 0, review: !todo.length};
    question();
  }
  function shuffled(len) { const a = [...Array(len).keys()]; for (let k = a.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [a[k], a[r]] = [a[r], a[k]]; } return a; }

  function question() {
    const {n, list, i} = run, x = list[i], lvl = NIV[n - 1];
    run.done = false; run.pick = [];
    let body = "";
    if (x.t === "qcm") {
      run.map = shuffled(x.ch.length);
      body = (x.code ? codeBox(x.code) : "") + `<div class="gch">${run.map.map((k, j) => `<button class="opt" type="button" data-dq="${j}">${esc(x.ch[k])}</button>`).join("")}</div>`;
    } else if (x.t === "bug") {
      body = `<div class="code"><div class="code-h"><i></i><i></i><i></i><span>Touche la ligne</span></div><div class="dlines">${x.code.split("\n").map((l, k) => `<button class="dline" type="button" data-dl="${k}"><span class="dn">${k + 1}</span><code>${esc(l) || " "}</code></button>`).join("")}</div></div>`;
    } else {
      run.map = shuffled(x.lines.length);
      body = `<p class="small">Touche les lignes dans le bon ordre.</p><div class="code"><div class="code-h"><i></i><i></i><i></i><span>Ton programme</span></div><pre class="dord" id="dOrd"><code></code></pre></div>
        <div class="dpool" id="dPool">${run.map.map(k => `<button class="dpiece" type="button" data-dp="${k}"><code>${esc(x.lines[k].replace(/^\t+/, ""))}</code></button>`).join("")}</div>
        <button class="btn ghost sm" type="button" data-dreset="1">Recommencer l'ordre</button>`;
    }
    $("debutBox").innerHTML = `<div class="gtop"><button class="back" type="button" data-go="#debut">← Premiers pas</button><span class="gscore">${ic("check")} ${run.good}</span></div>
      <p class="kicker">Niveau ${n} · ${esc(lvl.t)} · ${i + 1} sur ${list.length}${run.review ? " · révision" : ""}</p>
      <div class="exsteps g10">${list.map((_, k) => `<i class="${k < i ? "ok" : k === i ? "cur" : ""}"></i>`).join("")}</div>
      ${x.mine ? `<p class="mine">${ic("code")} Dans ton code : ${esc(x.mine)}</p>` : ""}
      <h2 class="gq">${inline(x.q)}</h2>
      ${body}
      <div id="dfb" aria-live="polite"></div>`;
  }

  function verdict(ok) {
    const {n, list, i} = run, x = list[i], s = st();
    if (!(x.id in s.first)) s.first[x.id] = ok;
    if (ok && !s.ok[x.id]) { s.ok[x.id] = L.today; S().day.jeu = true; }
    if (ok) { run.done = true; run.good += 1; }
    L.active();
    const last = i === list.length - 1, lvl = NIV[n - 1];
    $("dfb").innerHTML = `<div class="box ${ok ? "acc" : "warn"}"><h3>${ic(ok ? "check" : "alert")}${ok ? ["Bravo, c'est ça !", "Exact !", "Bien vu !", "Parfait !"][Math.floor(Math.random() * 4)] : "Pas tout à fait."}</h3><p>${ok ? inline(x.ex) : "Relis bien, et réessaie : l'explication s'affichera quand tu auras trouvé."}</p>${ok && lvl.cours && L.TOPIC[lvl.cours] ? `<a class="link" href="#cours-${lvl.cours}">Revoir le cours</a>` : ""}</div>`
      + (ok ? `<button class="btn acc full" type="button" data-dn="1">${last ? "Terminer le niveau" : "Exercice suivant"}</button>` : `<button class="btn ghost full" type="button" data-dr="1">Réessayer</button>`);
    $("dfb").scrollIntoView({block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  }

  function finish() {
    const {n} = run, lvl = NIV[n - 1], d = okN(lvl), next = NIV[n];
    if (d === lvl.q.length) L.toast(`${ic("medal")}<span>Niveau ${n} réussi !</span>`, 2400);
    $("debutBox").innerHTML = `<button class="back" type="button" data-go="#debut">← Premiers pas</button>
      <div class="hero"><div><h1>Niveau ${n} ${d === lvl.q.length ? "réussi" : "terminé"}</h1><p class="sub">${esc(lvl.t)} : ${d} / ${lvl.q.length} exercices réussis.</p></div><span class="hart">${L.ART.debut}</span></div>
      ${d < lvl.q.length ? `<a class="btn acc full" href="#debut-${n}">Refaire ceux qui restent</a>` : next ? `<a class="btn acc full" href="#debut-${n + 1}">Niveau ${n + 1} : ${esc(next.t)}</a>` : `<a class="btn acc full" href="#pc">Passer à ton PC : ft_putchar</a>`}
      <a class="btn ghost full" style="margin-top:10px" href="#debut">Voir tous les niveaux</a>`;
    run = null;
  }

  /* ---------- Réponses ---------- */
  document.addEventListener("click", e => {
    if (!run) return;
    const b = e.target.closest("[data-dq],[data-dl],[data-dp],[data-dreset],[data-dn],[data-dr]"); if (!b || !$("debutBox").contains(b)) return;
    const x = run.list[run.i];
    if (b.dataset.dn) { if (run.i < run.list.length - 1) { run.i += 1; question(); } else finish(); return; }
    if (b.dataset.dr) { question(); return; }
    if (run.done || $("dfb").innerHTML) return;
    if (b.dataset.dq != null) {
      const k = run.map[+b.dataset.dq], ok = k === x.ok;
      document.querySelectorAll("#debutBox [data-dq]").forEach(o => { o.disabled = true; });
      b.classList.add(ok ? "ok" : "ko");
      if (ok) document.querySelectorAll("#debutBox [data-dq]").forEach(o => { if (run.map[+o.dataset.dq] === x.ok) o.classList.add("ok"); });
      verdict(ok);
    } else if (b.dataset.dl != null) {
      const ok = +b.dataset.dl === x.ok;
      document.querySelectorAll("#debutBox [data-dl]").forEach(o => { o.disabled = true; });
      b.classList.add(ok ? "ok" : "ko");
      verdict(ok);
    } else if (b.dataset.dreset) {
      run.pick = []; $("dOrd").innerHTML = "<code></code>";
      document.querySelectorAll("#debutBox [data-dp]").forEach(o => { o.disabled = false; o.classList.remove("used"); });
    } else if (b.dataset.dp != null) {
      run.pick.push(+b.dataset.dp); b.disabled = true; b.classList.add("used");
      $("dOrd").innerHTML = `<code>${run.pick.map(k => esc(x.lines[k])).join("\n")}</code>`;
      if (run.pick.length === x.lines.length) {
        const ok = run.pick.every((k, j) => x.lines[k] === x.lines[j]);
        if (!ok) { const bad = run.pick.findIndex((k, j) => x.lines[k] !== x.lines[j]); $("dOrd").innerHTML = `<code>${run.pick.map((k, j) => j === bad ? `<mark>${esc(x.lines[k])}</mark>` : esc(x.lines[k])).join("\n")}</code>`; }
        document.querySelectorAll("#debutBox [data-dreset]").forEach(o => { o.disabled = true; });
        verdict(ok);
      }
    }
  });

  document.addEventListener("labo:view", ev => {
    const {v, arg} = ev.detail;
    if (v !== "debut") return;
    if (arg && /^\d+$/.test(arg)) start(+arg); else { run = null; renderHome(); }
  });
  const v = L.view(); if (v.v === "debut") { if (v.arg) start(+v.arg); else renderHome(); }
})();
