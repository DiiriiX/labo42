/* Labo 42 : atelier C (exercices façon Piscine, mini norminette) et examen blanc */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, inline, fmt, ic, ART} = L;
  const S = () => L.store();
  const st = () => { const s = S(); if (!s.atelier) s.atelier = {code: {}, done: {}, hints: {}, norm: 0}; return s.atelier; };

  /* ---------- Les exercices ---------- */
  const NIVEAUX = [
    {n: 1, t: "Afficher avec write", w: "Tes premières fonctions : un caractère, des boucles, une condition."},
    {n: 2, t: "Pointeurs et chaînes", w: "Modifier une variable par son adresse, parcourir une chaîne."},
    {n: 3, t: "Tableaux et chaînes", w: "Copier, comparer, transformer des chaînes."},
    {n: 4, t: "Nombres", w: "Afficher et calculer avec des int, cas limites compris."},
    {n: 5, t: "Ton projet", w: "La suite de ton chiffrement de César."}
  ];
  const EXOS = [
    {id: "ft_putchar", niv: 1, titre: "Afficher un caractère", proto: "void\tft_putchar(char c);", auto: ["write"],
      consigne: "Écris une fonction qui affiche à l'écran le caractère reçu en paramètre.",
      exemples: [["ft_putchar('a');", "a"], ["ft_putchar('*');", "*"]],
      indices: ["write a besoin de trois informations : où écrire, l'adresse de ce qu'il faut écrire, et combien d'octets.", "L'écran, c'est la sortie standard : le numéro 1. Un caractère prend 1 octet.", "write veut une adresse, pas une valeur : quel symbole donne l'adresse d'une variable ?"],
      pieges: ["Oublier `#include <unistd.h>` : sans lui, `cc -Wall -Wextra -Werror` refuse de compiler.", "Rendre un `main` dans le fichier : ici, on ne rend que la fonction."],
      cours: ["write"]},
    {id: "ft_print_alphabet", niv: 1, titre: "Afficher l'alphabet", proto: "void\tft_print_alphabet(void);", auto: ["write"],
      consigne: "Écris une fonction qui affiche l'alphabet en minuscules, de a à z, sur une seule ligne, sans retour à la ligne.",
      exemples: [["ft_print_alphabet();", "abcdefghijklmnopqrstuvwxyz"]],
      indices: ["Une lettre est un nombre (table ASCII) : on peut lui ajouter 1 pour passer à la suivante.", "Une variable char qui part de 'a', et une boucle while qui s'arrête après 'z'.", "À chaque tour : affiche la lettre, puis passe à la suivante."],
      pieges: ["La boucle `for` est interdite par la Norme : utilise `while`.", "Pas de `\\n` à la fin : le sujet n'en demande pas."],
      cours: ["boucles", "ascii", "write"]},
    {id: "ft_print_reverse_alphabet", niv: 1, titre: "L'alphabet à l'envers", proto: "void\tft_print_reverse_alphabet(void);", auto: ["write"],
      consigne: "Écris une fonction qui affiche l'alphabet en minuscules à l'envers, de z à a, sur une seule ligne.",
      exemples: [["ft_print_reverse_alphabet();", "zyxwvutsrqponmlkjihgfedcba"]],
      indices: ["Même idée que l'alphabet, dans l'autre sens.", "Pars de 'z' et retire 1 à chaque tour.", "Vérifie ta condition d'arrêt : la dernière lettre affichée doit être 'a'."],
      pieges: ["Une condition d'arrêt décalée d'un cran : il manque le 'a', ou un caractère en trop s'affiche."],
      cours: ["boucles", "ascii"]},
    {id: "ft_print_numbers", niv: 1, titre: "Afficher les chiffres", proto: "void\tft_print_numbers(void);", auto: ["write"],
      consigne: "Écris une fonction qui affiche tous les chiffres, de 0 à 9, sur une seule ligne.",
      exemples: [["ft_print_numbers();", "0123456789"]],
      indices: ["Les chiffres aussi sont des caractères, de '0' à '9', rangés à la suite dans la table ASCII.", "La structure est la même que pour l'alphabet.", "Compare ton caractère à '9', pas au nombre 9."],
      pieges: ["Le caractère '0' (code 48) n'est pas le nombre 0 : write affiche des caractères."],
      cours: ["ascii", "boucles"]},
    {id: "ft_is_negative", niv: 1, titre: "Négatif ou positif ?", proto: "void\tft_is_negative(int n);", auto: ["write"],
      consigne: "Écris une fonction qui affiche N si n est négatif, et P si n est positif ou nul.",
      exemples: [["ft_is_negative(-5);", "N"], ["ft_is_negative(0);", "P"], ["ft_is_negative(42);", "P"]],
      indices: ["Une seule condition suffit : n est-il plus petit que 0 ?", "Selon le cas, affiche un caractère différent avec write.", "Zéro n'est pas négatif : il doit afficher P."],
      pieges: ["Oublier le cas de 0."],
      cours: ["conditions", "write"]},
    {id: "ft_ft", niv: 2, titre: "Écrire à une adresse", proto: "void\tft_ft(int *nbr);", auto: [],
      consigne: "Écris une fonction qui met la valeur 42 dans l'entier dont elle reçoit l'adresse.",
      exemples: [["x vaut 0, puis ft_ft(&x);", "x vaut 42"]],
      indices: ["nbr est une adresse. Pour atteindre la case qui se trouve à cette adresse, on utilise l'étoile.", "`*nbr` désigne l'entier lui-même, chez l'appelant.", "Une seule ligne suffit dans la fonction."],
      pieges: ["Écrire `nbr = 42;` : tu changes la copie de l'adresse, pas l'entier."],
      cours: ["pointeurs"]},
    {id: "ft_swap", niv: 2, titre: "Échanger deux entiers", proto: "void\tft_swap(int *a, int *b);", auto: [],
      consigne: "Écris une fonction qui échange les valeurs des deux entiers dont elle reçoit les adresses.",
      exemples: [["a vaut 1, b vaut 2, puis ft_swap(&a, &b);", "a vaut 2, b vaut 1"]],
      indices: ["Imagine deux verres à échanger : il te faut un troisième verre vide.", "Une variable temporaire garde une des deux valeurs pendant l'échange.", "Travaille avec `*a` et `*b`, pas avec `a` et `b`."],
      pieges: ["Échanger les adresses `a` et `b` : rien ne change chez l'appelant."],
      cours: ["pointeurs"]},
    {id: "ft_div_mod", niv: 2, titre: "Division et reste", proto: "void\tft_div_mod(int a, int b, int *div, int *mod);", auto: [],
      consigne: "Écris une fonction qui range le résultat de la division entière de a par b dans l'entier pointé par div, et le reste dans l'entier pointé par mod. b ne vaut jamais 0.",
      exemples: [["ft_div_mod(17, 5, &d, &m);", "d vaut 3, m vaut 2"], ["ft_div_mod(10, 2, &d, &m);", "d vaut 5, m vaut 0"]],
      indices: ["En C, `/` entre deux int donne la division entière : 17 / 5 vaut 3.", "L'opérateur `%` donne le reste.", "Range chaque résultat à l'adresse reçue, avec l'étoile."],
      pieges: ["Confondre `div` (l'adresse) et `*div` (l'entier)."],
      cours: ["pointeurs", "variables"]},
    {id: "ft_putstr", niv: 2, titre: "Afficher une chaîne", proto: "void\tft_putstr(char *str);", auto: ["write"],
      consigne: "Écris une fonction qui affiche à l'écran tous les caractères de la chaîne str.",
      exemples: [["ft_putstr(\"Salut 42\");", "Salut 42"], ["ft_putstr(\"\");", "(rien)"]],
      indices: ["Une chaîne se termine toujours par le caractère `'\\0'`.", "Parcours la chaîne case par case avec un compteur, jusqu'à `'\\0'`.", "Pour chaque case, affiche un caractère : `&str[i]` est son adresse."],
      pieges: ["Afficher aussi le `'\\0'` final : il ne fait pas partie du texte."],
      cours: ["chaines", "write", "boucles"]},
    {id: "ft_strlen", niv: 2, titre: "Longueur d'une chaîne", proto: "int\tft_strlen(char *str);", auto: [],
      consigne: "Écris une fonction qui renvoie le nombre de caractères de la chaîne str, sans compter le `'\\0'` final.",
      exemples: [["ft_strlen(\"42\");", "2"], ["ft_strlen(\"Piscine\");", "7"], ["ft_strlen(\"\");", "0"]],
      indices: ["Compte les cases jusqu'à trouver `'\\0'`.", "Un compteur qui part de 0 et avance tant que `str[i]` n'est pas `'\\0'`.", "À la sortie de la boucle, ton compteur vaut exactement la longueur."],
      pieges: ["Compter le `'\\0'` : la longueur serait trop grande de 1."],
      cours: ["chaines", "boucles"]},
    {id: "ft_rev_int_tab", niv: 3, titre: "Inverser un tableau", proto: "void\tft_rev_int_tab(int *tab, int size);", auto: [],
      consigne: "Écris une fonction qui inverse l'ordre des size entiers du tableau tab : le premier devient le dernier, et ainsi de suite.",
      exemples: [["tab = {1, 2, 3, 4}, size = 4", "tab = {4, 3, 2, 1}"], ["tab = {7, 8, 9}, size = 3", "tab = {9, 8, 7}"]],
      indices: ["Échange la première case avec la dernière, la deuxième avec l'avant-dernière…", "Deux compteurs : un qui part du début, un qui part de la fin (size - 1).", "Arrête-toi quand ils se croisent : si tu vas plus loin, tu remets tout à l'endroit !"],
      pieges: ["Parcourir tout le tableau : chaque paire est échangée deux fois."],
      cours: ["pointeurs", "boucles"]},
    {id: "ft_strcpy", niv: 3, titre: "Copier une chaîne", proto: "char\t*ft_strcpy(char *dest, char *src);", auto: [],
      consigne: "Écris une fonction qui copie la chaîne src dans dest, `'\\0'` final compris, puis renvoie dest. dest est assez grand pour tout recevoir.",
      exemples: [["src = \"abc\"", "dest contient \"abc\" et la fonction renvoie dest"]],
      indices: ["Copie case par case : `dest[i]` reçoit `src[i]`.", "Ta boucle s'arrête à `'\\0'`… mais ce `'\\0'` doit aussi être copié.", "À la fin, renvoie dest, l'adresse du début de la copie."],
      pieges: ["Oublier de copier le `'\\0'` : dest n'est plus une chaîne valide."],
      cours: ["chaines", "pointeurs"]},
    {id: "ft_str_is_alpha", niv: 3, titre: "Que des lettres ?", proto: "int\tft_str_is_alpha(char *str);", auto: [],
      consigne: "Écris une fonction qui renvoie 1 si la chaîne ne contient que des lettres (minuscules ou majuscules), et 0 sinon. Une chaîne vide renvoie 1.",
      exemples: [["\"Bonjour\"", "1"], ["\"42abc\"", "0"], ["\"\"", "1"]],
      indices: ["Une lettre est entre 'a' et 'z', ou entre 'A' et 'Z'.", "Parcours la chaîne : dès qu'un caractère n'est pas une lettre, tu peux renvoyer 0 tout de suite.", "Si tu arrives au bout sans problème, renvoie 1."],
      pieges: ["Les caractères entre 'Z' et 'a' dans la table ASCII ([, \\, ], ^, _, `) ne sont pas des lettres."],
      cours: ["ascii", "conditions"]},
    {id: "ft_strupcase", niv: 3, titre: "Tout en majuscules", proto: "char\t*ft_strupcase(char *str);", auto: [],
      consigne: "Écris une fonction qui transforme chaque lettre minuscule de str en majuscule, puis renvoie str.",
      exemples: [["\"Salut 42 !\"", "\"SALUT 42 !\""]],
      indices: ["Dans la table ASCII, 'a' vaut 97 et 'A' vaut 65 : quel est l'écart ?", "Ne modifie que les caractères entre 'a' et 'z'.", "Le reste (chiffres, espaces, majuscules) ne bouge pas."],
      pieges: ["Modifier aussi les caractères qui ne sont pas des minuscules."],
      cours: ["ascii", "chaines"]},
    {id: "ft_strcmp", niv: 3, titre: "Comparer deux chaînes", proto: "int\tft_strcmp(char *s1, char *s2);", auto: [],
      consigne: "Écris une fonction qui compare s1 et s2 comme strcmp : elle renvoie 0 si les chaînes sont identiques, sinon la différence entre les deux premiers caractères différents.",
      exemples: [["\"abc\", \"abc\"", "0"], ["\"abc\", \"abd\"", "un nombre négatif"], ["\"b\", \"a\"", "un nombre positif"]],
      indices: ["Avance dans les deux chaînes en même temps tant que les caractères sont égaux.", "Arrête-toi aussi quand une des deux chaînes se termine.", "À l'endroit où tu t'arrêtes, une simple soustraction donne le résultat."],
      pieges: ["Oublier le cas où une chaîne est plus courte que l'autre."],
      cours: ["chaines", "ascii"]},
    {id: "ft_putnbr", niv: 4, titre: "Afficher un nombre", proto: "void\tft_putnbr(int nb);", auto: ["write"],
      consigne: "Écris une fonction qui affiche l'entier nb, qu'il soit positif, négatif ou nul, y compris le plus petit int : -2147483648.",
      exemples: [["ft_putnbr(42);", "42"], ["ft_putnbr(-7);", "-7"], ["ft_putnbr(0);", "0"], ["ft_putnbr(-2147483648);", "-2147483648"]],
      indices: ["Le dernier chiffre d'un nombre s'obtient avec `% 10`, et le reste du nombre avec `/ 10`.", "Une fonction qui s'appelle elle-même peut afficher d'abord les chiffres de gauche.", "-2147483648 n'a pas d'opposé dans un int : traite ce cas à part, ou travaille avec un type plus grand."],
      pieges: ["Oublier 0.", "Écrire `-nb` quand nb vaut -2147483648 : le résultat dépasse ce que peut contenir un int."],
      cours: ["fonctions", "ascii", "write"]},
    {id: "ft_atoi", niv: 4, titre: "Convertir une chaîne en int", proto: "int\tft_atoi(char *str);", auto: [],
      consigne: "Écris une fonction qui convertit le début de str en int, comme atoi : elle saute les espaces du début (espace, \\t, \\n, \\v, \\f, \\r), lit un signe + ou - facultatif, puis les chiffres. Elle s'arrête au premier caractère qui n'est pas un chiffre.\n\nAttention : le sujet de la Piscine accepte en plus plusieurs signes à la suite. Lis toujours bien ton sujet.",
      exemples: [["\"  42\"", "42"], ["\"-17abc\"", "-17"], ["\"+5\"", "5"], ["\"abc\"", "0"]],
      indices: ["Trois étapes : les espaces, puis le signe, puis les chiffres.", "Pour ajouter un chiffre à droite d'un nombre : nombre × 10 + (chiffre − '0').", "Garde le signe dans une variable (1 ou -1) et multiplie à la fin."],
      pieges: ["Oublier que '0' n'est pas 0 : il faut retirer '0' à chaque chiffre."],
      cours: ["ascii", "boucles"]},
    {id: "ft_iterative_factorial", niv: 4, titre: "Factorielle", proto: "int\tft_iterative_factorial(int nb);", auto: [],
      consigne: "Écris une fonction qui renvoie la factorielle de nb (5! = 5 × 4 × 3 × 2 × 1). Elle renvoie 1 pour 0, et 0 si nb est négatif. Tu n'as pas à gérer les dépassements.",
      exemples: [["5", "120"], ["0", "1"], ["-3", "0"]],
      indices: ["Traite d'abord le cas nb < 0.", "Un résultat qui part de 1, et une boucle qui le multiplie.", "Pour 0, la boucle ne doit faire aucun tour : le résultat reste 1."],
      pieges: ["Partir d'un résultat à 0 : toutes les multiplications donnent 0."],
      cours: ["boucles", "fonctions"]},
    {id: "ft_is_prime", niv: 4, titre: "Nombre premier ?", proto: "int\tft_is_prime(int nb);", auto: [],
      consigne: "Écris une fonction qui renvoie 1 si nb est un nombre premier, et 0 sinon. 0 et 1 ne sont pas premiers.",
      exemples: [["7", "1"], ["8", "0"], ["1", "0"], ["2", "1"]],
      indices: ["Un nombre premier n'a que deux diviseurs : 1 et lui-même.", "Essaie les diviseurs à partir de 2 : si `nb % i` vaut 0, il n'est pas premier.", "Pour aller plus vite, tu peux t'arrêter quand i × i dépasse nb."],
      pieges: ["Oublier 0, 1 et les nombres négatifs.", "Avec de très grands nombres, `i * i` peut dépasser la taille d'un int."],
      cours: ["boucles", "conditions"]},
    {id: "cesar_v4", niv: 5, titre: "César, version 4 : un mot entier", fichier: "cesar.c", proto: "int\tmain(void)", auto: ["scanf", "printf"], main: true,
      consigne: "Écris un programme qui demande un mot en MAJUSCULES, puis l'affiche chiffré avec le code de César, clé 3 : A devient D, Z devient C. C'est la suite de tes versions 1 et 3, qui chiffrent une seule lettre.",
      exemples: [["BONJOUR", "ERQMRXU"], ["ZOO", "CRR"]],
      indices: ["Un mot, c'est un tableau de char qui se termine par `'\\0'`.", "Ta version 3 sait chiffrer UNE lettre : que faut-il pour l'appliquer à chaque case du tableau ?", "Pense à la boucle de ft_strlen : elle parcourt une chaîne jusqu'à `'\\0'`."],
      pieges: ["Mettre `&` devant le nom du tableau dans scanf : un tableau est déjà une adresse.", "Oublier le retour au début de l'alphabet après Z."],
      cours: ["cesar", "chaines", "boucles"]}
  ];
  EXOS.forEach((e, i) => { e.i = i; if (!e.fichier) e.fichier = e.id + ".c"; e.nom = e.main ? "main" : e.id; });
  const EX = Object.fromEntries(EXOS.map(e => [e.id, e]));
  L.EXO_IDS = EXOS.map(e => e.id);
  L.EXOS = EXOS;
  L.atelierInfo = () => { const a = st(), done = EXOS.filter(e => a.done[e.id]).length; return {done, total: EXOS.length, next: EXOS.find(e => !a.done[e.id]) || null}; };

  /* ---------- Mini norminette ---------- */
  const KW = new Set(["if", "while", "return", "sizeof", "else", "for", "switch", "do"]);
  const TYPES = "(?:(?:unsigned|signed|const|static|long|short|struct\\s+\\w+)\\s+)*(?:int|char|long|short|float|double|size_t|ssize_t|unsigned|void|t_\\w+|struct\\s+\\w+)";
  const DECL = new RegExp("^\\t*(" + TYPES + ")(\\s+)(\\**)(\\w+)\\s*(\\[[^\\]]*\\])?\\s*(=.*)?;\\s*$");
  function strip(code) {
    let out = "", i = 0;
    const n = code.length, com = [];
    const lineAt = k => code.slice(0, k).split("\n").length;
    while (i < n) {
      const c = code[i], d = code[i + 1];
      if (c === "/" && d === "*") { const j = code.indexOf("*/", i + 2), e = j < 0 ? n : j + 2; out += code.slice(i, e).replace(/[^\n]/g, " "); com.push([lineAt(i), lineAt(e - 1)]); i = e; continue; }
      if (c === "/" && d === "/") { const j = code.indexOf("\n", i), e = j < 0 ? n : j; out += " ".repeat(e - i); com.push([lineAt(i), lineAt(i)]); i = e; continue; }
      if (c === "\"" || c === "'") {
        let j = i + 1;
        while (j < n && code[j] !== c && code[j] !== "\n") j += code[j] === "\\" ? 2 : 1;
        const closed = j < n && code[j] === c, e = closed ? j + 1 : Math.min(j, n);
        out += closed ? c + "x".repeat(Math.max(0, e - i - 2)) + c : c + "x".repeat(Math.max(0, e - i - 1));
        i = e; continue;
      }
      out += c; i++;
    }
    return {out, com};
  }
  const cols = line => { let c = 0; for (const ch of line) c = ch === "\t" ? c + 4 - (c % 4) : c + 1; return c; };
  function norme(code, exo) {
    const R = [];
    const add = (l, msg, k = "err") => R.push({l, msg, k});
    code = code.replace(/\r\n?/g, "\n");
    if (!code.trim()) return [{l: 0, msg: "Écris ton code dans l'éditeur, puis relance la vérification.", k: "warn"}];
    const {out, com} = strip(code);
    const lines = code.split("\n"), sl = out.split("\n");
    if (!/^\/\* \*{10,}/.test(lines[0])) add(0, "Pas d'en-tête 42 en haut du fichier. Normal ici : à l'école, ton éditeur l'ajoute avec une commande.", "info");
    let prevEmpty = false;
    lines.forEach((ln, k) => {
      const t = sl[k], n = k + 1, tt = t.trim();
      if (cols(ln) > 80) add(n, `Ligne trop longue : ${cols(ln)} colonnes, 80 au maximum (une tabulation compte jusqu'à 4).`);
      if (ln.trim() && /[ \t]+$/.test(ln)) add(n, "Espace ou tabulation en fin de ligne.");
      if (!ln.trim() && ln.length) add(n, "Ligne vide qui contient des espaces ou des tabulations.");
      if (!ln.trim() && prevEmpty) add(n, "Deux lignes vides de suite.");
      prevEmpty = !ln.trim();
      if (!tt) return;
      if (/^\t* +\S/.test(t) && !tt.startsWith("#")) add(n, "Indentation avec des espaces : la Norme veut des tabulations (touche ⇥).");
      const kw = tt.match(/\b(for|do|switch|case|goto)\b/);
      if (kw) add(n, kw[1] === "for" ? "La boucle for est interdite par la Norme : utilise while." : `« ${kw[1]} » est interdit par la Norme.`);
      if (t.includes("?")) add(n, "L'opérateur ternaire ( ? : ) est interdit par la Norme.");
      let depth = 0, semi = 0;
      for (const ch of t) { if (ch === "(") depth++; else if (ch === ")") depth--; else if (ch === ";" && depth === 0) semi++; }
      if (semi > 1) add(n, "Une seule instruction par ligne.");
      const sp = tt.match(/\b(if|while|return)\(/);
      if (sp) add(n, `Mets un espace après « ${sp[1]} ».`);
      if (t.includes("{") && tt !== "{" && !/=\s*\{/.test(t)) add(n, "L'accolade { doit être seule sur sa ligne.");
      if (t.includes("}") && tt !== "}" && tt !== "};" && !/=\s*\{/.test(t)) add(n, "L'accolade } doit être seule sur sa ligne.");
      if (/,(?=[^\s])/.test(t)) add(n, "Mets un espace après chaque virgule.", "warn");
    });
    // Fonctions
    const funcs = [];
    let depth = 0, curF = null, sig = [];
    sl.forEach((t, k) => {
      const tt = t.trim();
      if (depth === 0 && !curF) {
        if (!tt) { sig = []; }
        else if (tt.startsWith("#")) { sig = []; }
        else if (tt.includes("{")) {
          const before = tt.slice(0, tt.indexOf("{")).trim();
          const parts = sig.concat(before ? [k] : []);
          const text = parts.map(x => x === k ? before : sl[x].trim()).join(" ").trim();
          curF = {sig: text, sigLine: parts.length ? parts[0] : k, open: k, raw: parts.length ? lines[parts[0]] : ""};
          sig = [];
        } else if (/;\s*$/.test(tt)) {
          const full = sig.map(x => sl[x].trim()).concat(tt).join(" ");
          if (!full.includes("(") && !/^typedef\b/.test(full) && !/^static\b|\bconst\b/.test(full) && DECL.test("\t" + full.replace(/^\s+/, ""))) add(k + 1, "Variable globale : interdite par la Norme, sauf si le sujet l'autorise.");
          sig = [];
        } else sig.push(k);
      }
      for (const ch of t) {
        if (ch === "{") depth++;
        else if (ch === "}") { depth--; if (depth === 0 && curF) { curF.close = k; funcs.push(curF); curF = null; } }
      }
    });
    if (depth > 0) add(lines.length, "Il manque au moins une accolade fermante }.");
    if (depth < 0) add(lines.length, "Il y a une accolade fermante } en trop.");
    const fns = funcs.filter(f => f.sig.includes("("));
    const defined = new Set();
    fns.forEach(f => { const m = f.sig.match(/(\w+)\s*\(/); f.name = m ? m[1] : "?"; defined.add(f.name); });
    if (fns.length > 5) add(0, `${fns.length} fonctions dans ce fichier : 5 au maximum.`);
    fns.forEach((f, fi) => {
      const ln = f.sigLine + 1;
      const head = f.raw.match(/^([\w\s]*?\w)([ \t]+)\**(\w+)\s*\(/);
      if (head && /[^\t]/.test(head[2])) add(ln, `Sépare le type de retour et le nom de « ${f.name} » par une tabulation.`);
      const inside = f.sig.slice(f.sig.indexOf("(") + 1, f.sig.lastIndexOf(")")).trim();
      f.nparams = !inside || inside === "void" ? 0 : inside.split(",").length;
      if (!inside) add(ln, `Une fonction sans paramètre s'écrit avec void : ${f.name}(void).`);
      if (f.nparams > 4) add(ln, `« ${f.name} » a ${f.nparams} paramètres : 4 au maximum.`);
      const body = f.close - f.open - 1;
      if (body > 25) add(ln, `« ${f.name} » fait ${body} lignes : 25 au maximum, sans compter les accolades.`);
      let decls = 0, lastDecl = -1, stmt = false;
      for (let k = f.open + 1; k < f.close; k++) {
        const t = sl[k], tt = t.trim(), n = k + 1;
        if (!tt) continue;
        const m = DECL.exec(t);
        if (m && !tt.startsWith("return")) {
          decls++; lastDecl = k;
          if (stmt) add(n, "Déclaration au milieu de la fonction : toutes les déclarations vont au début.");
          if (m[6] && !/^static\b/.test(m[1])) add(n, "Déclaration et affectation sur la même ligne : déclare d'abord, affecte ensuite.");
          if (/[^\t]/.test(m[2])) add(n, "Sépare le type et le nom de la variable par une tabulation.");
        } else if (tt !== "{" && tt !== "}") stmt = true;
      }
      if (decls > 5) add(ln, `${decls} variables dans « ${f.name} » : 5 au maximum.`);
      for (let k = f.open + 1; k < f.close; k++) {
        if (lines[k].trim()) continue;
        if (k === lastDecl + 1 && decls) continue;
        add(k + 1, "Ligne vide interdite dans une fonction, sauf juste après les déclarations.");
      }
      if (decls && lastDecl + 1 < f.close && sl[lastDecl + 1].trim()) add(lastDecl + 2, "Laisse une ligne vide après les déclarations.");
      com.forEach(c => { if (c[0] > f.open + 1 && c[0] < f.close + 1) add(c[0], "Les commentaires sont interdits à l'intérieur d'une fonction."); });
      if (f.name !== "main" && exo) {
        const allowed = new Set(exo.auto || []);
        const re = /\b([A-Za-z_]\w*)\s*\(/g;
        for (let k = f.open + 1; k < f.close; k++) {
          let m; re.lastIndex = 0;
          while ((m = re.exec(sl[k]))) { const name = m[1]; if (!KW.has(name) && !defined.has(name) && !allowed.has(name)) add(k + 1, `Fonction non autorisée par le sujet : ${name} (autorisées : ${exo.auto && exo.auto.length ? exo.auto.join(", ") : "aucune"}).`); }
        }
      }
      if (fi > 0) {
        const prev = fns[fi - 1];
        let empties = 0;
        for (let k = prev.close + 1; k < f.sigLine; k++) if (!lines[k].trim()) empties++;
        if (empties !== 1) add(ln, "Laisse exactement une ligne vide entre deux fonctions.");
      }
    });
    if (exo) {
      const f = fns.find(x => x.name === exo.nom);
      if (!f) add(0, `La fonction « ${exo.nom} » est introuvable : vérifie son nom, il doit être exactement celui du sujet.`);
      else {
        const want = exo.proto.slice(exo.proto.indexOf("(") + 1, exo.proto.lastIndexOf(")")).trim();
        const wn = !want || want === "void" ? 0 : want.split(",").length;
        if (!exo.main && f.nparams !== wn) add(f.sigLine + 1, `« ${exo.nom} » doit avoir ${wn} paramètre${wn > 1 ? "s" : ""}, comme dans le prototype.`);
        const rt = exo.proto.split(/[\t ]/)[0], got = (f.raw.match(/^\s*([\w ]*?\w)[\t ]/) || [])[1];
        if (!exo.main && got && got.replace(/\s+/g, " ") !== rt) add(f.sigLine + 1, `Le type de retour doit être ${rt}, comme dans le prototype.`);
      }
      if (!exo.main && defined.has("main")) add(0, "Ne rends pas de main pour cet exercice : garde ton main de test dans un autre fichier.", "warn");
    }
    const uses = name => new RegExp("\\b" + name + "\\s*\\(").test(out);
    if (uses("write") && !/#include\s*<unistd\.h>/.test(code)) add(0, "Ajoute #include <unistd.h> : sans lui, write n'est pas déclarée et cc -Werror refuse de compiler.");
    if ((uses("printf") || uses("scanf")) && !/#include\s*<stdio\.h>/.test(code)) add(0, "Ajoute #include <stdio.h> pour printf et scanf.");
    const order = {err: 0, warn: 1, info: 2};
    return R.sort((a, b) => (order[a.k] - order[b.k]) || (a.l - b.l));
  }
  L.norme = norme;

  /* ---------- Éditeur ---------- */
  const KEYS = [["⇥", "\t"], ["{", "{"], ["}", "}"], ["(", "("], [")", ")"], [";", ";"], ["'", "'"], ["\"", "\""], ["\\", "\\"], ["[", "["], ["]", "]"], ["*", "*"], ["&", "&"], ["<", "<"], [">", ">"], ["=", "="], ["!", "!"], ["+", "+"], ["-", "-"], ["%", "%"], ["#", "#"], ["|", "|"]];
  const skeleton = e => e.main
    ? "#include <stdio.h>\n\nint\tmain(void)\n{\n\t\n\treturn (0);\n}\n"
    : ((e.auto || []).includes("write") ? "#include <unistd.h>\n\n" : "") + e.proto.replace(/;$/, "") + "\n{\n\t\n}\n";
  const editor = (id, code) => `<div class="ed"><div class="ed-h"><span>${esc(id)}</span><span id="edPos">ligne 1</span></div><textarea id="edCode" rows="14" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" wrap="off" aria-label="Ton code">${esc(code)}</textarea></div><div class="keys" id="edKeys">${KEYS.map(k => `<button type="button" class="key" data-ek="${esc(k[1])}">${esc(k[0])}</button>`).join("")}</div>`;
  let saveT = null;
  function bindEditor(onSave) {
    const ta = $("edCode"); if (!ta) return;
    const pos = () => { const v = ta.value.slice(0, ta.selectionStart); $("edPos").textContent = "ligne " + v.split("\n").length; };
    const insert = txt => {
      const s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
      let before = v.slice(0, s);
      if (txt === "}") { const ls = before.lastIndexOf("\n") + 1, cur = before.slice(ls); if (/^\t+$/.test(cur)) before = before.slice(0, -1); }
      ta.value = before + txt + v.slice(e);
      const p = before.length + txt.length; ta.setSelectionRange(p, p); ta.focus(); changed();
    };
    const changed = () => { pos(); clearTimeout(saveT); saveT = setTimeout(() => onSave(ta.value), 400); };
    ta.addEventListener("input", changed);
    ta.addEventListener("click", pos); ta.addEventListener("keyup", pos);
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); insert("\t"); }
      else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.isComposing) {
        e.preventDefault();
        const v = ta.value.slice(0, ta.selectionStart), line = v.slice(v.lastIndexOf("\n") + 1);
        const ind = (line.match(/^\t*/) || [""])[0] + (/\{\s*$/.test(line) ? "\t" : "");
        insert("\n" + ind);
      } else if (e.key === "}" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); insert("}"); }
    });
    $("edKeys").addEventListener("pointerdown", e => { if (e.target.closest(".key")) e.preventDefault(); });
    $("edKeys").addEventListener("click", e => { const b = e.target.closest("[data-ek]"); if (b) insert(b.dataset.ek); });
  }
  const goLine = n => { const ta = $("edCode"); if (!ta || !n) return; const ls = ta.value.split("\n"); let p = 0; for (let i = 0; i < n - 1 && i < ls.length; i++) p += ls[i].length + 1; ta.focus(); ta.setSelectionRange(p, p + (ls[n - 1] || "").length); const lh = parseFloat(getComputedStyle(ta).lineHeight) || 21; ta.scrollTop = Math.max(0, (n - 4) * lh); $("edPos").textContent = "ligne " + n; };
  function normHTML(list) {
    const errs = list.filter(x => x.k === "err").length, warns = list.filter(x => x.k === "warn").length;
    const head = errs ? `<p class="nres ko">${ic("alert")}<span><b>${errs} erreur${errs > 1 ? "s" : ""} de Norme</b>${warns ? ` et ${warns} conseil${warns > 1 ? "s" : ""}` : ""}. Touche une ligne pour la retrouver dans ton code.</span></p>`
      : `<p class="nres ok">${ic("check")}<span><b>Norme OK</b>${warns ? ` (${warns} conseil${warns > 1 ? "s" : ""})` : ""}. Reste à vérifier que ton code fait bien ce que demande le sujet.</span></p>`;
    return head + list.map(x => `<button type="button" class="nerr ${x.k}" data-line="${x.l}"><span class="ln">${x.l ? "L" + x.l : "—"}</span><span>${esc(x.msg)}</span></button>`).join("") + `<p class="small">Mini norminette : elle vérifie les règles les plus courantes de la Norme. La vraie norminette de 42 en contrôle davantage.</p>`;
  }
  const copyText = async txt => {
    try { await navigator.clipboard.writeText(txt); return true; }
    catch (e) { const t = document.createElement("textarea"); t.value = txt; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (er) {} t.remove(); return ok; }
  };
  const subjectHTML = (e, withNotes) => `<div class="card sujet">
    <div class="srow"><span class="small">Fichier à rendre</span><code>${esc(e.fichier)}</code></div>
    <div class="srow"><span class="small">Fonctions autorisées</span><b>${e.auto.length ? e.auto.map(esc).join(", ") : "aucune"}</b></div>
    <p class="small" style="margin:12px 0 4px">${e.main ? "Ton programme" : "Prototype"}</p><pre class="proto">${esc(e.proto)}</pre>
    <h3>${ic("target")}Ce qu'il faut faire</h3>${fmt(e.consigne)}
    <h3>${ic("play")}Exemples</h3><table class="extable"><thead><tr><th>${e.main ? "Tu tapes" : "Appel"}</th><th>${e.main ? "Le programme affiche" : "Résultat attendu"}</th></tr></thead><tbody>${e.exemples.map(x => `<tr><td><code>${esc(x[0])}</code></td><td><code>${esc(x[1])}</code></td></tr>`).join("")}</tbody></table>
    ${withNotes && e.cours.length ? `<div class="chips wrapc" style="margin:14px 0 0">${e.cours.filter(c => L.TOPIC[c]).map(c => `<a class="chip" href="#cours-${c}">${ic("book")} ${esc(L.TOPIC[c].t)}</a>`).join("")}</div>` : ""}
  </div>`;
  const quand = d => { const l = L.dayLabel(d); return l === "Aujourd'hui" ? "aujourd'hui" : l === "Hier" ? "hier" : "le " + l; };
  const progressBar = (n, t) => `<div class="bar"><i style="width:${Math.round(n / t * 100)}%"></i></div>`;

  /* ---------- Vue : liste ---------- */
  function renderList() {
    const a = st(), done = EXOS.filter(e => a.done[e.id]).length, info = L.atelierInfo();
    const best = (S().exams || []).reduce((m, x) => Math.max(m, x.score), -1);
    $("atelierBox").innerHTML = `<button class="back" type="button" data-go="#pratique">← Pratique</button>
      <div class="hero"><div><h1>Atelier C</h1><p class="sub">Des exercices façon Piscine : le sujet, des indices, jamais la solution.</p></div><span class="hart">${ART.atelier}</span></div>
      ${progressBar(done, EXOS.length)}<p class="small">${done} / ${EXOS.length} exercices réussis${a.norm ? ` · ${a.norm} code${a.norm > 1 ? "s" : ""} sans faute de Norme` : ""}</p>
      ${info.next ? `<a class="btn acc full" href="#atelier-${info.next.id}">${done ? "Continuer" : "Commencer"} : ${esc(info.next.id)}</a>` : `<p class="note">Tu as réussi tous les exercices. Passe un examen blanc pour t'entraîner en conditions réelles !</p>`}
      <details class="help"><summary>Comment ça marche</summary><ol>
        <li>Lis le sujet en entier : nom du fichier, fonctions autorisées, prototype.</li>
        <li>Écris ton code dans l'éditeur, ou sur un ordinateur si tu en as un.</li>
        <li>Vérifie la Norme avec la mini norminette.</li>
        <li>Compile avec <code>cc -Wall -Wextra -Werror</code> et teste tous les exemples, avec ton propre main.</li>
        <li>Coince ? Ouvre les indices un par un. Le prof peut aussi relire ton code.</li>
      </ol></details>
      <a class="linkcard" href="#examen"><span class="ltile" style="border-radius:14px;overflow:hidden;background:var(--surf)">${ART.examen}</span><span><b>Examen blanc</b><small>${best >= 0 ? "Ton meilleur score : " + best + " / 100" : "Chronométré, comme les exams de 42"}</small></span><span class="chev">›</span></a>
      ${NIVEAUX.map(nv => { const list = EXOS.filter(e => e.niv === nv.n), d = list.filter(e => a.done[e.id]).length; return `<section class="etape"><div class="etape-h"><span class="num">${nv.n}</span><div><h2>${esc(nv.t)}</h2><p class="small" style="margin:0">${esc(nv.w)} · ${d} / ${list.length}</p></div></div><ol class="path">${list.map(e => `<li><a class="pitem${info.next && info.next.id === e.id ? " next" : ""}" href="#atelier-${e.id}"><span class="exi">${ic("code")}</span><span class="ptxt"><b class="mono">${esc(e.id)}</b><small>${esc(e.titre)}${a.code[e.id] && !a.done[e.id] ? " · commencé" : ""}</small></span><span class="pnum${a.done[e.id] ? " done" : ""}">${a.done[e.id] ? "✓" : e.i + 1}</span></a></li>`).join("")}</ol></section>`; }).join("")}`;
  }

  /* ---------- Vue : exercice ---------- */
  let curExo = null;
  function renderExo(id) {
    const e = EX[id]; if (!e) { renderList(); return; }
    curExo = e;
    const a = st(), h = a.hints[id] || 0, code = a.code[id] || "";
    const prev = EXOS[e.i - 1], next = EXOS[e.i + 1];
    $("atelierBox").innerHTML = `<button class="back" type="button" data-go="#atelier">← Atelier C</button>
      <p class="kicker">Niveau ${e.niv} · ${esc(NIVEAUX[e.niv - 1].t)} · exercice ${e.i + 1} sur ${EXOS.length}</p>
      <h1 class="mono exh">${esc(e.id)}</h1><p class="sub">${esc(e.titre)}</p>
      ${a.done[id] ? `<p class="nres ok">${ic("check")}<span><b>Réussi</b> ${esc(quand(a.done[id]))}. Tu peux le refaire pour t'entraîner.</span></p>` : ""}
      ${subjectHTML(e, true)}
      <h2>${ic("bulb")} Les indices</h2>
      <p class="small">Cherche d'abord seul, puis ouvre-les un par un.</p>
      <div id="hints">${e.indices.slice(0, h).map((x, i) => `<div class="box warn"><h3>Indice ${i + 1}</h3><p>${inline(x)}</p></div>`).join("")}</div>
      ${h < e.indices.length ? `<button class="btn ghost full" type="button" data-ex="hint">Voir l'indice ${h + 1} sur ${e.indices.length}</button>` : `<p class="small">Tu as vu tous les indices. La suite, c'est toi !</p>`}
      <div class="box warn"><h3>${ic("alert")}Les pièges</h3><ul>${e.pieges.map(x => `<li>${inline(x)}</li>`).join("")}</ul></div>
      <h2>${ic("code")} Ton code</h2>
      ${editor(e.fichier, code)}
      <div class="row"><button class="btn acc" type="button" data-ex="norme">Vérifier la Norme</button>${code.trim() ? `<button class="btn ghost" type="button" data-ex="copy">Copier</button>` : `<button class="btn ghost" type="button" data-ex="skel">Insérer le modèle</button>`}</div>
      <div id="normOut" aria-live="polite"></div>
      <div id="profBox"></div>
      <div class="box"><h3>${ic("check")}Avant de valider</h3>
        <label class="chk"><input type="checkbox" class="vchk"> J'ai compilé avec <code>cc -Wall -Wextra -Werror</code>, sans erreur.</label>
        <label class="chk"><input type="checkbox" class="vchk"> J'ai testé tous les exemples du sujet.</label>
        <label class="chk"><input type="checkbox" class="vchk"> J'ai testé au moins un cas limite (0, chaîne vide, négatif…).</label>
        <button class="btn acc full" type="button" data-ex="valider" disabled>J'ai réussi cet exercice</button>
        <p class="small" style="margin-top:8px">Pas d'ordinateur sous la main ? Déroule ton code à la main sur chaque exemple, comme dans le cours sur les boucles.</p>
      </div>
      <div class="row">${prev ? `<a class="btn ghost" href="#atelier-${prev.id}">← Précédent</a>` : ""}${next ? `<a class="btn ghost" href="#atelier-${next.id}">Suivant →</a>` : ""}</div>`;
    bindEditor(v => { st().code[id] = v; L.save(); });
    renderProf();
  }
  async function renderProf() {
    const box = $("profBox"); if (!box || !curExo) return;
    const s = L.inClaude ? await L.ai() : null;
    if (s) box.innerHTML = `<button class="btn ghost full" type="button" data-ex="prof">${ic("pencil")} Faire relire mon code par le prof</button><div id="profOut" aria-live="polite"></div>`;
    else if (!L.inClaude) box.innerHTML = `<button class="btn ghost full" type="button" data-ex="claude">${ic("copy")} Copier mon code et le faire relire dans Claude</button><p class="small" id="claudeNote" style="margin-top:6px">Le prof est dans la version Claude de Labo 42 : colle ton code dans le même exercice.</p>`;
    else box.innerHTML = "";
  }
  async function profReview() {
    const e = curExo, code = ($("edCode") || {}).value || "";
    const out = $("profOut"), s = await L.ai(); if (!s || !out) return;
    if (!code.trim()) { out.innerHTML = `<p class="note">Écris d'abord ton code : le prof relit, il n'écrit pas à ta place.</p>`; return; }
    const prompt = L.PROF + `

Tu relis un exercice de C façon Piscine 42, comme un correcteur bienveillant.
Exercice : ${e.id}, fichier ${e.fichier}. ${e.main ? "Programme complet." : "Prototype : " + e.proto} Fonctions autorisées : ${e.auto.length ? e.auto.join(", ") : "aucune"}.
Consigne : ${e.consigne}
Exemples : ${e.exemples.map(x => x[0] + " → " + x[1]).join(" ; ")}
Code de l'élève :
${code}

Réponds en français, 150 à 250 mots, en 4 parties, chacune avec un titre en gras sur sa propre ligne : **Verdict** (« Ça marche » ou « Pas encore », en déroulant de tête les exemples et un cas limite), **Ce qui est bien**, **Ce qui coince** (avec les numéros de ligne, compte-les depuis 1), **Ton prochain pas** (un indice précis). Ne réécris jamais le code corrigé ni la solution, même en partie.`;
    out.innerHTML = `<div class="loading"><span class="spin"></span><p><b>Le prof relit ton code…</b></p></div>`;
    try { const r = await s(prompt, {cache: false, onText: ({text}) => { out.innerHTML = `<div class="card">${fmt(text)}</div>`; }}); out.innerHTML = `<div class="card">${fmt(r.text)}</div>`; }
    catch (er) { if (L.dead(er)) L.aiOff(); out.innerHTML = `<p class="note">${esc(L.errMsg(er))}</p>`; }
  }

  /* ---------- Examen blanc ---------- */
  const POOL = n => EXOS.filter(e => e.niv === n && !e.main);
  const pick = (n, tried) => { const list = POOL(n).filter(e => !tried.includes(e.id)); const from = list.length ? list : POOL(n); return from[Math.floor(Math.random() * from.length)].id; };
  let examTimer = null, examDur = 60, confirmAt = 0;
  const fmtT = ms => { const t = Math.max(0, Math.round(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); };
  function startExam() {
    const s = S();
    s.exam = {start: Date.now(), end: Date.now() + examDur * 60000, dur: examDur, level: 1, tried: [], passed: [], code: {}, ex: null};
    s.exam.ex = pick(1, []); s.exam.tried.push(s.exam.ex);
    L.save(); renderExam(); scrollTo(0, 0);
  }
  function finishExam(why) {
    const s = S(), x = s.exam; if (!x) return;
    const score = x.passed.length * 25;
    if (!s.exams) s.exams = [];
    s.exams.unshift({date: L.today, score, passed: x.passed.map(p => p.id), min: Math.round((Math.min(Date.now(), x.end) - x.start) / 60000), why});
    s.exams = s.exams.slice(0, 20);
    s.lastExam = Object.assign({}, x, {score, why});
    delete s.exam; L.save(); L.refresh(); renderExam(); scrollTo(0, 0);
  }
  function tick() {
    const x = S().exam, el = $("exClock");
    if (!x || !el) { clearInterval(examTimer); examTimer = null; return; }
    const left = x.end - Date.now();
    el.textContent = fmtT(left);
    el.parentElement.classList.toggle("late", left < 5 * 60000);
    if (left <= 0) finishExam("temps");
  }
  function renderExam() {
    const s = S(), x = s.exam;
    clearInterval(examTimer); examTimer = null;
    if (x && Date.now() >= x.end) { finishExam("temps"); return; }
    if (!x) {
      const hist = s.exams || [], last = s.lastExam, best = hist.reduce((m, h) => Math.max(m, h.score), -1);
      $("examBox").innerHTML = `<button class="back" type="button" data-go="#pratique">← Pratique</button>
        <div class="hero"><div><h1>Examen blanc</h1><p class="sub">Comme les exams de 42 : chronométré, sans indice, un exercice à la fois.</p></div><span class="hart">${ART.examen}</span></div>
        ${last ? `<div class="card exres"><p class="small" style="margin:0">Ton dernier examen</p><p class="big">${last.score}<small> / 100</small></p><p>${last.passed.length} niveau${last.passed.length > 1 ? "x" : ""} réussi${last.passed.length > 1 ? "s" : ""} sur 4${last.why === "temps" ? ", temps écoulé" : last.why === "stop" ? ", examen arrêté" : ""}.</p>${last.passed.length ? `<p class="small">Réussis : ${last.passed.map(p => `<code>${esc(p.id)}</code>`).join(", ")}</p>` : ""}${last.why !== "fini" && last.ex ? `<p class="small">Tu bloquais sur : <a href="#atelier-${last.ex}">${esc(last.ex)}</a>. Refais-le tranquillement dans l'atelier, avec les indices.</p>` : ""}</div>` : ""}
        <div class="card"><h3 style="margin-top:0">${ic("clock")}Les règles</h3><ul>
          <li>4 niveaux, du plus simple au plus dur. Un exercice tiré au hasard par niveau.</li>
          <li>Chaque niveau réussi vaut 25 points.</li>
          <li>Pas d'indice, pas de cours. Tu peux vérifier la Norme, mais à l'examen de 42 c'est surtout le résultat qui compte.</li>
          <li>Raté ? Comme à 42, tu repars sur un autre exercice du même niveau.</li>
          <li>Tu valides toi-même : sois honnête, teste vraiment tes exemples.</li>
        </ul></div>
        <p class="small" style="margin:18px 0 6px">Durée</p>
        <div class="seg" id="exDur">${[30, 60, 120].map(m => `<button type="button" data-dur="${m}" class="${m === examDur ? "on" : ""}">${m < 60 ? m + " min" : m / 60 + " h"}</button>`).join("")}</div>
        <button class="btn acc full" type="button" data-ex="start">${ic("play")} Commencer l'examen</button>
        ${hist.length ? `<h2>Tes examens</h2><p class="small">Meilleur score : <b>${best} / 100</b></p><div class="hist">${hist.slice(0, 8).map(h => `<div class="hrow"><span>${esc(L.dayLabel(h.date))}</span><span class="small">${h.min} min</span><b>${h.score} / 100</b></div>`).join("")}</div>` : ""}`;
      return;
    }
    const e = EX[x.ex], code = x.code[x.ex] || "";
    $("examBox").innerHTML = `<div class="exbar"><span class="exlvl">Niveau ${x.level} / 4</span><span class="exclock">${ic("clock")}<b id="exClock">${fmtT(x.end - Date.now())}</b></span><span class="exlvl">${x.passed.length * 25} pts</span></div>
      <div class="exsteps">${[1, 2, 3, 4].map(n => `<i class="${n < x.level ? "ok" : n === x.level ? "cur" : ""}"></i>`).join("")}</div>
      <h1 class="mono exh">${esc(e.id)}</h1>
      ${subjectHTML(e, false)}
      ${editor(e.fichier, code)}
      <div class="row"><button class="btn ghost" type="button" data-ex="norme">Vérifier la Norme</button><button class="btn acc" type="button" data-ex="rendre">Je rends : ça marche</button></div>
      <div id="normOut" aria-live="polite"></div>
      <button class="btn ghost full" type="button" data-ex="rate">Je n'y arrive pas : autre exercice</button>
      <button class="link" type="button" data-ex="stop" style="margin-top:14px">Arrêter l'examen</button>`;
    curExo = e;
    bindEditor(v => { const ex = S().exam; if (ex) { ex.code[ex.ex] = v; L.save(); } });
    examTimer = setInterval(tick, 1000);
  }

  /* ---------- Clics ---------- */
  document.addEventListener("click", async ev => {
    const nb = ev.target.closest(".nerr[data-line]"); if (nb) { goLine(+nb.dataset.line); return; }
    const d = ev.target.closest("[data-dur]"); if (d) { examDur = +d.dataset.dur; document.querySelectorAll("#exDur button").forEach(b => b.classList.toggle("on", b === d)); return; }
    const b = ev.target.closest("[data-ex]"); if (!b) return;
    const act = b.dataset.ex, a = st(), e = curExo;
    if (act === "hint" && e) { a.hints[e.id] = Math.min((a.hints[e.id] || 0) + 1, e.indices.length); L.save(); const y = scrollY; renderExo(e.id); scrollTo(0, y); }
    else if (act === "skel" && e) { const ta = $("edCode"); ta.value = skeleton(e); ta.dispatchEvent(new Event("input")); ta.focus(); const p = ta.value.indexOf("\t\n"); if (p > 0) ta.setSelectionRange(p + 1, p + 1); b.outerHTML = `<button class="btn ghost" type="button" data-ex="copy">Copier</button>`; }
    else if (act === "copy") { const ok = await copyText(($("edCode") || {}).value || ""); b.textContent = ok ? "Copié !" : "Copie impossible"; setTimeout(() => { b.textContent = "Copier"; }, 1800); }
    else if (act === "norme" && e) {
      const code = ($("edCode") || {}).value || "", res = norme(code, e), errs = res.filter(r => r.k === "err").length;
      $("normOut").innerHTML = normHTML(res);
      if (code.trim() && /\{/.test(code)) {
        const sday = S().day;
        if (!S().exam && !sday.atelier) { sday.atelier = true; }
        if (!errs) a.norm = (a.norm || 0) + 1;
        L.active();
      }
    }
    else if (act === "prof") profReview();
    else if (act === "claude" && e) { const ok = await copyText(($("edCode") || {}).value || ""); const n = $("claudeNote"); if (n) n.textContent = ok ? "Code copié ! Colle-le dans l'éditeur du même exercice, dans Claude." : "Copie impossible : sélectionne ton code et copie-le à la main."; window.open(L.CLAUDE_URL + "#atelier-" + e.id, "_blank", "noopener"); }
    else if (act === "valider" && e) { a.done[e.id] = L.today; S().day.atelier = true; L.toast(`${ic("check")}<span>${esc(e.id)} réussi, bravo !</span>`, 2200); L.active(); const n = EXOS[e.i + 1]; location.hash = n && !a.done[n.id] ? "#atelier-" + n.id : "#atelier"; }
    else if (act === "start") startExam();
    else if (act === "rendre" || act === "rate") {
      const x = S().exam; if (!x) return;
      if (act === "rendre" && Date.now() - confirmAt > 4000) { confirmAt = Date.now(); b.textContent = "Sûr ? Touche encore pour rendre"; setTimeout(() => { if (b.isConnected) b.textContent = "Je rends : ça marche"; }, 4000); return; }
      confirmAt = 0;
      if (act === "rendre") {
        x.passed.push({niv: x.level, id: x.ex});
        if (x.level >= 4) { L.save(); finishExam("fini"); L.toast(`${ic("medal")}<span>Examen terminé : 100 / 100 !</span>`); return; }
        x.level++; L.toast(`${ic("check")}<span>Niveau ${x.level - 1} validé !</span>`);
      }
      x.ex = pick(x.level, x.tried); x.tried.push(x.ex); L.save(); renderExam(); scrollTo(0, 0);
    }
    else if (act === "stop") { if (Date.now() - confirmAt > 4000) { confirmAt = Date.now(); b.textContent = "Touche encore pour arrêter l'examen"; return; } confirmAt = 0; finishExam("stop"); }
  });
  document.addEventListener("change", ev => {
    if (!ev.target.classList.contains("vchk")) return;
    const all = [...document.querySelectorAll(".vchk")];
    const btn = document.querySelector("[data-ex=valider]"); if (btn) btn.disabled = !all.every(c => c.checked);
  });

  /* ---------- Navigation ---------- */
  const show = ({v, arg}) => {
    if (v === "atelier") { if (arg && EX[arg]) renderExo(arg); else { curExo = null; renderList(); } }
    else if (v === "examen") renderExam();
    else { clearInterval(examTimer); examTimer = null; }
  };
  document.addEventListener("labo:view", ev => show(ev.detail));
  show(L.view());
  L.refresh();
})();
