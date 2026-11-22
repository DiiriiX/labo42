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
    {n: 2, t: "Pointeurs et premières chaînes", w: "Modifier une variable par son adresse, parcourir une chaîne."},
    {n: 3, t: "Chaînes et tableaux", w: "Copier, comparer, chercher, trier, transformer."},
    {n: 4, t: "Nombres", w: "Afficher et convertir des int, cas limites compris."},
    {n: 5, t: "Récursivité et maths", w: "Des fonctions qui s'appellent elles-mêmes, des puissances, des nombres premiers."},
    {n: 6, t: "Programmes : argc et argv", w: "Des programmes complets qui lisent leurs arguments."},
    {n: 7, t: "Mémoire : malloc", w: "Réserver de la mémoire, la remplir, la rendre."},
    {n: 8, t: "Tes projets", w: "La suite de ton César, et un mini cat."}
  ];
  const EXAM_LVL = {1: 1, 2: 2, 3: 3, 4: 4, 5: 4, 6: 3, 7: 4};
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
    {id: "cesar_v4", niv: 8, titre: "César, version 4 : un mot entier", fichier: "cesar.c", proto: "int\tmain(void)", auto: ["scanf", "printf"], main: true,
      consigne: "Écris un programme qui demande un mot en MAJUSCULES, puis l'affiche chiffré avec le code de César, clé 3 : A devient D, Z devient C. C'est la suite de tes versions 1 et 3, qui chiffrent une seule lettre.",
      exemples: [["BONJOUR", "ERQMRXU"], ["ZOO", "CRR"]],
      indices: ["Un mot, c'est un tableau de char qui se termine par `'\\0'`.", "Ta version 3 sait chiffrer UNE lettre : que faut-il pour l'appliquer à chaque case du tableau ?", "Pense à la boucle de ft_strlen : elle parcourt une chaîne jusqu'à `'\\0'`."],
      pieges: ["Mettre `&` devant le nom du tableau dans scanf : un tableau est déjà une adresse.", "Oublier le retour au début de l'alphabet après Z."],
      cours: ["cesar", "chaines", "boucles"]},
    {id: "ft_print_comb", niv: 1, ex: 2, titre: "Combinaisons de 3 chiffres", proto: "void\tft_print_comb(void);", auto: ["write"],
      consigne: "Écris une fonction qui affiche, dans l'ordre croissant, toutes les combinaisons de trois chiffres différents, chacune écrite en ordre croissant, séparées par une virgule et un espace.\n\n987 n'y est pas : c'est 789 dans un autre ordre.",
      exemples: [["ft_print_comb();", "012, 013, 014, 015, 016, 017, 018, 019, 023, … , 689, 789"]],
      indices: ["Trois chiffres a < b < c : trois boucles imbriquées.", "b commence juste après a, et c juste après b.", "Le séparateur « , » s'écrit partout… sauf après la dernière combinaison, 789."],
      pieges: ["Écrire « , » après 789.", "Oublier 012 : le premier chiffre commence à '0'."],
      cours: ["boucles", "ascii"]},
    {id: "ft_print_comb2", niv: 1, ex: 2, titre: "Paires de nombres", proto: "void\tft_print_comb2(void);", auto: ["write"],
      consigne: "Écris une fonction qui affiche toutes les paires de deux nombres différents entre 00 et 99, le premier plus petit que le second, en ordre croissant. Chaque nombre s'écrit sur deux chiffres, les paires sont séparées par une virgule et un espace.",
      exemples: [["ft_print_comb2();", "00 01, 00 02, … , 00 99, 01 02, … , 97 99, 98 99"]],
      indices: ["Deux nombres a et b, de 0 à 99, avec a < b : deux boucles imbriquées.", "Pour écrire un nombre sur deux chiffres : a / 10 donne les dizaines, a % 10 les unités.", "Comme pour ft_print_comb, pas de séparateur après la dernière paire."],
      pieges: ["Afficher 0 au lieu de 00 : chaque nombre doit avoir ses deux chiffres."],
      cours: ["boucles", "ascii"]},
    {id: "ft_ultimate_ft", niv: 2, titre: "Neuf pointeurs", proto: "void\tft_ultimate_ft(int *********nbr);", auto: [],
      consigne: "Écris une fonction qui met la valeur 42 dans l'entier qui se trouve au bout de cette chaîne de 9 pointeurs.",
      exemples: [["un int x, et 9 pointeurs en chaîne jusqu'à x", "x vaut 42"]],
      indices: ["Chaque étoile devant un pointeur fait « suivre » une adresse.", "nbr est un pointeur de pointeur de … de int : il faut suivre l'adresse 9 fois.", "Compte les étoiles du prototype : il en faut autant pour atteindre l'int."],
      pieges: ["S'arrêter une étoile trop tôt : tu écris 42 dans une adresse, pas dans l'int."],
      cours: ["pointeurs"]},
    {id: "ft_ultimate_div_mod", niv: 2, titre: "Division sur place", proto: "void\tft_ultimate_div_mod(int *a, int *b);", auto: [],
      consigne: "Écris une fonction qui divise l'entier pointé par a par l'entier pointé par b. Le résultat de la division entière va dans *a, le reste dans *b. *b ne vaut jamais 0.",
      exemples: [["*a vaut 17, *b vaut 5", "*a vaut 3, *b vaut 2"]],
      indices: ["Tu as besoin des deux valeurs de départ pour faire les deux calculs.", "Si tu écris d'abord dans *a, tu perds la valeur de départ.", "Garde les valeurs de départ dans des variables avant de modifier quoi que ce soit."],
      pieges: ["Écraser *a avant de calculer le reste : le reste devient faux."],
      cours: ["pointeurs"]},
    {id: "ft_sort_int_tab", niv: 3, titre: "Trier un tableau", proto: "void\tft_sort_int_tab(int *tab, int size);", auto: [],
      consigne: "Écris une fonction qui trie les size entiers du tableau tab, du plus petit au plus grand.",
      exemples: [["tab = {5, 2, 9, 1}, size = 4", "tab = {1, 2, 5, 9}"], ["tab = {3, 3, -1}, size = 3", "tab = {-1, 3, 3}"]],
      indices: ["Le tri à bulles : compare chaque case avec sa voisine, et échange-les si elles sont dans le mauvais ordre.", "Un seul passage ne suffit pas : recommence tant qu'il y a eu au moins un échange.", "Pour échanger deux cases, reprends l'idée de ft_swap : une variable temporaire."],
      pieges: ["Comparer tab[i] avec tab[i + 1] jusqu'à i = size - 1 : tu sors du tableau."],
      cours: ["boucles", "pointeurs"]},
    {id: "ft_strncpy", niv: 3, titre: "Copier n caractères", proto: "char\t*ft_strncpy(char *dest, char *src, unsigned int n);", auto: [],
      consigne: "Écris une fonction qui copie au plus n caractères de src dans dest, puis renvoie dest. Si src est plus courte que n, complète dest avec des `'\\0'` jusqu'à n caractères.\n\nComme le vrai strncpy : si src fait n caractères ou plus, aucun `'\\0'` n'est ajouté.",
      exemples: [["src = \"abc\", n = 5", "dest = 'a' 'b' 'c' '\\0' '\\0'"], ["src = \"bonjour\", n = 3", "dest commence par 'b' 'o' 'n', sans '\\0' ajouté"]],
      indices: ["Une première boucle copie tant qu'on n'a pas atteint n ni la fin de src.", "Une deuxième boucle remplit avec des '\\0' jusqu'à n.", "unsigned int : ton compteur doit être du même type pour être comparé à n."],
      pieges: ["Écrire au-delà de n cases.", "Comparer un int et un unsigned int : -Wextra le signale."],
      cours: ["chaines"]},
    {id: "ft_str_is_numeric", niv: 3, titre: "Que des chiffres ?", proto: "int\tft_str_is_numeric(char *str);", auto: [],
      consigne: "Écris une fonction qui renvoie 1 si la chaîne ne contient que des chiffres, et 0 sinon. Une chaîne vide renvoie 1.",
      exemples: [["\"42\"", "1"], ["\"4a2\"", "0"], ["\"\"", "1"]],
      indices: ["Un chiffre est entre '0' et '9'.", "Dès qu'un caractère n'en est pas un, renvoie 0.", "Au bout de la chaîne, renvoie 1."],
      pieges: ["Comparer avec 0 et 9 au lieu de '0' et '9'."],
      cours: ["ascii", "chaines"]},
    {id: "ft_str_is_printable", niv: 3, titre: "Que des caractères imprimables ?", proto: "int\tft_str_is_printable(char *str);", auto: [],
      consigne: "Écris une fonction qui renvoie 1 si tous les caractères de la chaîne sont imprimables (codes ASCII de 32 à 126), et 0 sinon. Une chaîne vide renvoie 1.",
      exemples: [["\"Salut !\"", "1"], ["\"a\\tb\"", "0 (la tabulation n'est pas imprimable)"], ["\"\"", "1"]],
      indices: ["L'espace (32) est imprimable ; le caractère 127 ne l'est pas.", "Compare chaque caractère à 32 et à 126.", "Même structure que ft_str_is_alpha."],
      pieges: ["Oublier que l'espace est imprimable."],
      cours: ["ascii"]},
    {id: "ft_strlowcase", niv: 3, titre: "Tout en minuscules", proto: "char\t*ft_strlowcase(char *str);", auto: [],
      consigne: "Écris une fonction qui transforme chaque lettre majuscule de str en minuscule, puis renvoie str.",
      exemples: [["\"SaLuT 42\"", "\"salut 42\""]],
      indices: ["C'est l'inverse de ft_strupcase.", "Ne touche qu'aux caractères entre 'A' et 'Z'.", "L'écart entre 'A' et 'a' est toujours le même."],
      pieges: ["Modifier aussi les chiffres ou la ponctuation."],
      cours: ["ascii", "chaines"]},
    {id: "ft_strcapitalize", niv: 3, titre: "Une majuscule à chaque mot", proto: "char\t*ft_strcapitalize(char *str);", auto: [],
      consigne: "Écris une fonction qui met en majuscule la première lettre de chaque mot, et le reste du mot en minuscules, puis renvoie str. Un mot est une suite de lettres et de chiffres : tout autre caractère sépare les mots.",
      exemples: [["\"bonjour LA piscine 42lyon, c'est-parti\"", "\"Bonjour La Piscine 42lyon, C'Est-Parti\""]],
      indices: ["Un caractère commence un mot s'il est au début de la chaîne, ou si le caractère d'avant n'est ni une lettre ni un chiffre.", "En début de mot : majuscule si c'est une lettre. Ailleurs : minuscule.", "Un chiffre en début de mot reste un chiffre, et la lettre qui le suit est dans le mot : minuscule."],
      pieges: ["Oublier de passer le reste du mot en minuscules.", "Traiter le chiffre comme un séparateur : « 42lyon » doit rester « 42lyon »."],
      cours: ["ascii", "conditions"]},
    {id: "ft_strncmp", niv: 3, titre: "Comparer n caractères", proto: "int\tft_strncmp(char *s1, char *s2, unsigned int n);", auto: [],
      consigne: "Écris une fonction qui compare au plus les n premiers caractères de s1 et s2, comme strncmp : 0 s'ils sont identiques, sinon la différence entre les deux premiers caractères différents.",
      exemples: [["\"abcdef\", \"abcxyz\", 3", "0"], ["\"abcdef\", \"abcxyz\", 4", "un nombre négatif"], ["n = 0", "0"]],
      indices: ["C'est ft_strcmp avec une condition de plus.", "Arrête-toi aussi quand tu as comparé n caractères.", "Attention au cas n = 0 : aucun caractère n'est comparé."],
      pieges: ["Lire s1[n] quand on a déjà comparé n caractères."],
      cours: ["chaines"]},
    {id: "ft_strcat", niv: 3, titre: "Coller deux chaînes", proto: "char\t*ft_strcat(char *dest, char *src);", auto: [],
      consigne: "Écris une fonction qui ajoute la chaîne src à la fin de dest, `'\\0'` final compris, puis renvoie dest. dest est assez grand.",
      exemples: [["dest = \"Bon\", src = \"jour\"", "dest = \"Bonjour\""]],
      indices: ["Trouve d'abord la fin de dest : là où se trouve son '\\0'.", "Copie src à partir de cet endroit.", "N'oublie pas le '\\0' à la toute fin."],
      pieges: ["Commencer la copie au début de dest : tu écrases son contenu."],
      cours: ["chaines"]},
    {id: "ft_strncat", niv: 3, titre: "Coller au plus n caractères", proto: "char\t*ft_strncat(char *dest, char *src, unsigned int nb);", auto: [],
      consigne: "Écris une fonction qui ajoute au plus nb caractères de src à la fin de dest, puis renvoie dest. dest se termine toujours par `'\\0'`.",
      exemples: [["dest = \"Bon\", src = \"jour\", nb = 2", "dest = \"Bonjo\""], ["dest = \"Bon\", src = \"jour\", nb = 10", "dest = \"Bonjour\""]],
      indices: ["Comme ft_strcat, avec un compteur de caractères copiés.", "Arrête-toi à nb caractères ou à la fin de src.", "Contrairement à strncpy, ici le '\\0' final est toujours ajouté."],
      pieges: ["Oublier le '\\0' quand on s'arrête à cause de nb."],
      cours: ["chaines"]},
    {id: "ft_strstr", niv: 3, titre: "Trouver un mot dans une chaîne", proto: "char\t*ft_strstr(char *str, char *to_find);", auto: [],
      consigne: "Écris une fonction qui cherche la première apparition de to_find dans str. Elle renvoie l'adresse du début de cette apparition, ou NULL (0) si to_find n'y est pas. Si to_find est vide, elle renvoie str.",
      exemples: [["\"Piscine 42 Lyon\", \"42\"", "l'adresse de \"42 Lyon\""], ["\"abc\", \"z\"", "NULL"], ["\"abc\", \"\"", "str"]],
      indices: ["Pour chaque position de str, regarde si to_find commence là.", "Deux compteurs : i pour la position dans str, j pour avancer dans to_find.", "Si j atteint la fin de to_find, tu as trouvé : renvoie &str[i]."],
      pieges: ["Sortir de str en comparant : vérifie que str[i + j] n'est pas '\\0'."],
      cours: ["chaines", "pointeurs"]},
    {id: "ft_print_combn", niv: 4, titre: "Combinaisons de n chiffres", proto: "void\tft_print_combn(int n);", auto: ["write"],
      consigne: "Écris une fonction qui affiche toutes les combinaisons de n chiffres différents, en ordre croissant, comme ft_print_comb mais pour n chiffres. n est compris entre 1 et 9.",
      exemples: [["ft_print_combn(2);", "01, 02, 03, … , 78, 79, 89"], ["ft_print_combn(1);", "0, 1, 2, 3, 4, 5, 6, 7, 8, 9"]],
      indices: ["Le nombre de boucles dépend de n : il faut une autre idée que des boucles imbriquées.", "Garde la combinaison dans un tableau de n chiffres, et passe à la suivante comme un compteur kilométrique.", "La dernière combinaison est celle qui finit par 9, avec tous les chiffres collés : pour n = 3, c'est 789."],
      pieges: ["Oublier le cas n = 1."],
      cours: ["boucles", "chaines"]},
    {id: "ft_putnbr_base", niv: 4, titre: "Afficher dans n'importe quelle base", proto: "void\tft_putnbr_base(int nbr, char *base);", auto: ["write"],
      consigne: "Écris une fonction qui affiche nbr dans la base donnée par la chaîne base : \"01\" pour le binaire, \"0123456789ABCDEF\" pour l'hexadécimal, \"poneyvif\" pour une base 8 inventée.\n\nSi la base est invalide (moins de 2 caractères, un caractère en double, ou un + ou un -), la fonction n'affiche rien.",
      exemples: [["ft_putnbr_base(42, \"01\");", "101010"], ["ft_putnbr_base(255, \"0123456789ABCDEF\");", "FF"], ["ft_putnbr_base(-10, \"0123456789\");", "-10"]],
      indices: ["La taille de la base, c'est sa longueur : ft_strlen.", "C'est ft_putnbr, avec la taille de la base à la place de 10, et base[chiffre] à la place de chiffre + '0'.", "Vérifie la base avant tout : deux boucles pour repérer les doublons."],
      pieges: ["Oublier -2147483648.", "Ne pas tester les doublons dans la base."],
      cours: ["fonctions", "chaines"]},
    {id: "ft_recursive_factorial", niv: 5, titre: "Factorielle récursive", proto: "int\tft_recursive_factorial(int nb);", auto: [],
      consigne: "Même sujet que ft_iterative_factorial, mais sans boucle : la fonction s'appelle elle-même. 0 si nb est négatif, 1 pour 0.",
      exemples: [["5", "120"], ["0", "1"], ["-3", "0"]],
      indices: ["5! = 5 × 4!, et 4! = 4 × 3!…", "Il faut un cas d'arrêt : pour 0, on renvoie 1 sans s'appeler.", "Traite le cas négatif avant tout."],
      pieges: ["Oublier le cas d'arrêt : la fonction s'appelle à l'infini et plante."],
      cours: ["fonctions"]},
    {id: "ft_iterative_power", niv: 5, titre: "Puissance avec une boucle", proto: "int\tft_iterative_power(int nb, int power);", auto: [],
      consigne: "Écris une fonction qui renvoie nb à la puissance power. Une puissance négative renvoie 0. 0 à la puissance 0 vaut 1. Pas de dépassement à gérer.",
      exemples: [["2, 10", "1024"], ["3, 0", "1"], ["5, -1", "0"]],
      indices: ["2 puissance 10, c'est 2 multiplié par lui-même 10 fois.", "Un résultat qui part de 1, et une boucle qui fait power tours.", "Commence par le cas power < 0."],
      pieges: ["Partir d'un résultat à 0 ou à nb."],
      cours: ["boucles"]},
    {id: "ft_recursive_power", niv: 5, titre: "Puissance récursive", proto: "int\tft_recursive_power(int nb, int power);", auto: [],
      consigne: "Même sujet que ft_iterative_power, sans boucle : la fonction s'appelle elle-même.",
      exemples: [["2, 10", "1024"], ["7, 1", "7"], ["4, -2", "0"]],
      indices: ["nb puissance power = nb × (nb puissance power − 1).", "Le cas d'arrêt : puissance 0, qui vaut 1.", "Le cas négatif ne s'appelle pas : il renvoie 0 tout de suite."],
      pieges: ["Oublier le cas d'arrêt."],
      cours: ["fonctions"]},
    {id: "ft_fibonacci", niv: 5, titre: "La suite de Fibonacci", proto: "int\tft_fibonacci(int index);", auto: [],
      consigne: "Écris une fonction récursive qui renvoie l'élément numéro index de la suite de Fibonacci : 0, 1, 1, 2, 3, 5, 8, 13… Chaque nombre est la somme des deux précédents. L'index 0 donne 0, l'index 1 donne 1. Un index négatif renvoie -1.",
      exemples: [["0", "0"], ["1", "1"], ["7", "13"], ["-2", "-1"]],
      indices: ["fibonacci(n) = fibonacci(n − 1) + fibonacci(n − 2).", "Deux cas d'arrêt : 0 et 1.", "Le cas négatif d'abord."],
      pieges: ["Un seul cas d'arrêt : fibonacci(1) appellerait fibonacci(-1)."],
      cours: ["fonctions"]},
    {id: "ft_sqrt", niv: 5, titre: "Racine carrée", proto: "int\tft_sqrt(int nb);", auto: [],
      consigne: "Écris une fonction qui renvoie la racine carrée de nb si elle est entière, et 0 sinon.",
      exemples: [["16", "4"], ["15", "0"], ["1", "1"]],
      indices: ["Cherche un nombre i tel que i × i = nb.", "Essaie i = 1, 2, 3… et arrête-toi quand i × i dépasse nb.", "Pour les grands nombres, i × i peut dépasser un int : compare plutôt i avec nb / i."],
      pieges: ["Une boucle trop longue sur les grands nombres : à l'examen, la moulinette mesure aussi le temps."],
      cours: ["boucles"]},
    {id: "ft_find_next_prime", niv: 5, titre: "Le prochain nombre premier", proto: "int\tft_find_next_prime(int nb);", auto: [],
      consigne: "Écris une fonction qui renvoie le plus petit nombre premier supérieur ou égal à nb.",
      exemples: [["10", "11"], ["13", "13"], ["0", "2"]],
      indices: ["Tu sais déjà tester si un nombre est premier (ft_is_prime).", "Essaie nb, puis nb + 1, puis nb + 2… jusqu'à tomber sur un premier.", "Une fonction d'aide dans le même fichier est permise."],
      pieges: ["Oublier que nb lui-même peut être premier."],
      cours: ["fonctions", "boucles"]},
    {id: "ft_print_program_name", niv: 6, titre: "Le nom du programme", fichier: "ft_print_program_name.c", proto: "int\tmain(int argc, char **argv)", auto: ["write"], main: true,
      consigne: "Écris un programme qui affiche son propre nom, suivi d'un retour à la ligne.",
      exemples: [["./a.out", "./a.out"]],
      indices: ["Le main peut recevoir deux paramètres : argc et argv.", "argv est un tableau de chaînes. argv[0] contient le nom du programme, tel qu'il a été lancé.", "Affiche la chaîne caractère par caractère, puis '\\n'."],
      pieges: ["Unused parameter : avec -Werror, argc non utilisé est une erreur. Tu peux t'en servir, ou écrire (void)argc;."],
      cours: ["chaines", "write"]},
    {id: "ft_print_params", niv: 6, titre: "Afficher les arguments", fichier: "ft_print_params.c", proto: "int\tmain(int argc, char **argv)", auto: ["write"], main: true,
      consigne: "Écris un programme qui affiche chaque argument reçu, un par ligne, dans l'ordre, sans le nom du programme.",
      exemples: [["./a.out Salut 42 Lyon", "Salut, puis 42, puis Lyon, un par ligne"], ["./a.out", "(rien)"]],
      indices: ["argc compte les arguments, nom du programme compris.", "Les arguments utiles vont de argv[1] à argv[argc − 1].", "Pour chacun : affiche la chaîne, puis '\\n'."],
      pieges: ["Afficher argv[0]."],
      cours: ["chaines", "boucles"]},
    {id: "ft_rev_params", niv: 6, titre: "Les arguments à l'envers", fichier: "ft_rev_params.c", proto: "int\tmain(int argc, char **argv)", auto: ["write"], main: true,
      consigne: "Écris un programme qui affiche ses arguments un par ligne, du dernier au premier, sans le nom du programme.",
      exemples: [["./a.out un deux trois", "trois, puis deux, puis un, un par ligne"]],
      indices: ["Même programme que ft_print_params, dans l'autre sens.", "Pars de argc − 1.", "Arrête-toi avant argv[0]."],
      pieges: ["Commencer à argc : argv[argc] vaut NULL."],
      cours: ["chaines", "boucles"]},
    {id: "ft_sort_params", niv: 6, titre: "Trier les arguments", fichier: "ft_sort_params.c", proto: "int\tmain(int argc, char **argv)", auto: ["write"], main: true,
      consigne: "Écris un programme qui affiche ses arguments triés dans l'ordre ASCII, un par ligne, sans le nom du programme.",
      exemples: [["./a.out b A a 2", "2, puis A, puis a, puis b, un par ligne"]],
      indices: ["Il te faut deux outils : comparer deux chaînes (ft_strcmp) et trier (ft_sort_int_tab).", "Trie les adresses des chaînes : échange argv[i] et argv[i + 1] quand elles sont dans le mauvais ordre.", "Trie à partir de argv[1], puis affiche."],
      pieges: ["Trier aussi argv[0]."],
      cours: ["chaines", "pointeurs"]},
    {id: "ft_strdup", niv: 7, titre: "Dupliquer une chaîne", proto: "char\t*ft_strdup(char *src);", auto: ["malloc"],
      consigne: "Écris une fonction qui crée une copie de src dans une mémoire réservée avec malloc, et renvoie l'adresse de la copie. Si malloc échoue, elle renvoie NULL.",
      exemples: [["\"Piscine\"", "une nouvelle chaîne \"Piscine\", à une autre adresse"]],
      indices: ["Il faut d'abord connaître la longueur de src.", "Réserve longueur + 1 octets : +1 pour le '\\0'.", "Vérifie le retour de malloc, puis copie case par case."],
      pieges: ["Oublier le +1 du '\\0'.", "Ne pas vérifier que malloc n'a pas renvoyé NULL."],
      cours: ["malloc", "chaines"]},
    {id: "ft_range", niv: 7, titre: "Un tableau de min à max", proto: "int\t*ft_range(int min, int max);", auto: ["malloc"],
      consigne: "Écris une fonction qui renvoie un tableau d'int réservé avec malloc, contenant tous les nombres de min (compris) à max (non compris). Si min est supérieur ou égal à max, elle renvoie NULL.",
      exemples: [["2, 6", "{2, 3, 4, 5}"], ["5, 5", "NULL"]],
      indices: ["Le tableau a max − min cases.", "malloc(sizeof(int) * taille).", "Remplis la case i avec min + i."],
      pieges: ["Réserver max − min octets au lieu de max − min int."],
      cours: ["malloc"]},
    {id: "ft_ultimate_range", niv: 7, titre: "Le tableau et sa taille", proto: "int\tft_ultimate_range(int **range, int min, int max);", auto: ["malloc"],
      consigne: "Écris une fonction qui réserve et remplit le même tableau que ft_range, range son adresse dans *range, et renvoie sa taille. Si min est supérieur ou égal à max, *range vaut NULL et la fonction renvoie 0. Si malloc échoue, elle renvoie -1.",
      exemples: [["min = 2, max = 6", "*range = {2, 3, 4, 5}, renvoie 4"], ["min = 5, max = 5", "*range = NULL, renvoie 0"]],
      indices: ["range est l'adresse d'un pointeur : *range est le pointeur à remplir.", "Écris (*range)[i] pour la case i, avec les parenthèses.", "Trois cas de retour : 0, -1, ou la taille."],
      pieges: ["Écrire *range[i] : sans parenthèses, ça ne veut pas dire la même chose."],
      cours: ["malloc", "pointeurs"]},
    {id: "ft_strjoin", niv: 7, titre: "Coller des chaînes avec un séparateur", proto: "char\t*ft_strjoin(int size, char **strs, char *sep);", auto: ["malloc"],
      consigne: "Écris une fonction qui colle les size chaînes du tableau strs, séparées par sep, dans une nouvelle chaîne réservée avec malloc. Si size vaut 0, elle renvoie une chaîne vide qu'on peut libérer avec free.",
      exemples: [["3, {\"a\", \"b\", \"c\"}, \", \"", "\"a, b, c\""], ["0, …, \", \"", "\"\""]],
      indices: ["Calcule d'abord la taille totale : toutes les chaînes, plus size − 1 séparateurs, plus 1 pour le '\\0'.", "Réserve cette taille, puis mets un '\\0' au début pour partir d'une chaîne vide.", "Ajoute chaque chaîne, et sep entre deux chaînes seulement."],
      pieges: ["Ajouter sep après la dernière chaîne.", "Pour size = 0, renvoyer NULL au lieu d'une chaîne vide."],
      cours: ["malloc", "chaines"]},
    {id: "cesar_v2", niv: 8, titre: "César, version 2 : choisir la clé", fichier: "cesar.c", proto: "int\tmain(void)", auto: ["scanf", "printf"], main: true,
      consigne: "Le programme demande d'abord une clé, un nombre de 1 à 25, puis un mot en MAJUSCULES, et affiche le mot chiffré avec cette clé.",
      exemples: [["clé 1, puis HAL", "IBM"], ["clé 13, puis BONJOUR", "OBAWBHE"]],
      indices: ["scanf avec %d lit un nombre.", "Dans ta version 4, la clé valait 3 : que faut-il changer ?", "Le retour au début de l'alphabet doit marcher avec n'importe quelle clé de 1 à 25."],
      pieges: ["Une clé de 25 : Z + 25 dépasse largement 'Z', vérifie ton retour au début."],
      cours: ["cesar"]},
    {id: "cesar_v5", niv: 8, titre: "César, version 5 : minuscules et ponctuation", fichier: "cesar.c", proto: "int\tmain(void)", auto: ["scanf", "printf", "fgets"], main: true,
      consigne: "Le message peut maintenant contenir des minuscules, des majuscules, des espaces et de la ponctuation. Chiffre les lettres en gardant leur casse, et laisse tout le reste tel quel.\n\nPour lire une phrase entière avec ses espaces : `fgets(phrase, 100, stdin)`.",
      exemples: [["clé 3, puis Salut, 42 !", "Vdoxw, 42 !"]],
      indices: ["Trois cas pour chaque caractère : majuscule, minuscule, ou autre chose.", "Pour une minuscule, le calcul est le même, avec 'a' et 'z' au lieu de 'A' et 'Z'.", "Après scanf, un retour à la ligne reste en attente : fgets risque de le lire tout de suite. Teste et observe !"],
      pieges: ["Chiffrer les espaces et les chiffres."],
      cours: ["cesar", "ascii"]},
    {id: "cesar_v6", niv: 8, titre: "César, version 6 : déchiffrer", fichier: "decesar.c", proto: "int\tmain(void)", auto: ["scanf", "printf", "fgets"], main: true,
      consigne: "Écris le programme inverse : il demande la clé et un message chiffré, et affiche le message d'origine.",
      exemples: [["clé 3, puis Vdoxw, 42 !", "Salut, 42 !"]],
      indices: ["Déchiffrer avec la clé k, c'est chiffrer avec la clé 26 − k.", "Ou bien : reculer de k, et ajouter 26 si on passe avant 'A' (ou 'a').", "Pour tester : chiffre un message, déchiffre-le, tu dois retrouver l'original."],
      pieges: ["Passer avant 'A' sans revenir à la fin de l'alphabet."],
      cours: ["cesar"]},
    {id: "mini_cat", niv: 8, titre: "Un mini cat", fichier: "mini_cat.c", proto: "int\tmain(int argc, char **argv)", auto: ["open", "read", "write", "close"], main: true,
      consigne: "Écris un programme qui affiche le contenu du fichier dont le nom est passé en argument.\n\nSans argument, il affiche « Il manque le nom du fichier. » sur la sortie d'erreur. Si le fichier ne s'ouvre pas, il affiche « Impossible de lire le fichier. » sur la sortie d'erreur.",
      exemples: [["./mini_cat notes.txt", "le contenu de notes.txt"], ["./mini_cat", "Il manque le nom du fichier. (sur la sortie 2)"]],
      indices: ["open(nom, O_RDONLY) ouvre le fichier et renvoie un numéro, ou -1 en cas d'échec (#include <fcntl.h>).", "read(fd, tampon, taille) lit des octets et renvoie combien il en a lu : 0 à la fin du fichier.", "La sortie d'erreur, c'est le numéro 2 pour write. Pense à fermer le fichier avec close."],
      pieges: ["Écrire tout le tampon au lieu du nombre d'octets vraiment lus.", "Envoyer les messages d'erreur sur la sortie 1."],
      cours: ["write", "redirections"]}
  ];
  EXOS.sort((x, y) => x.niv - y.niv);
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
      if (exo && (f.name !== "main" || exo.main)) {
        const allowed = new Set((exo.auto || []).concat((exo.auto || []).includes("malloc") ? ["free"] : []));
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
    if ((uses("malloc") || uses("free")) && !/#include\s*<stdlib\.h>/.test(code)) add(0, "Ajoute #include <stdlib.h> pour malloc et free.");
    if (uses("open") && !/#include\s*<fcntl\.h>/.test(code)) add(0, "Ajoute #include <fcntl.h> pour open et O_RDONLY.");
    if ((uses("read") || uses("close")) && !/#include\s*<unistd\.h>/.test(code)) add(0, "Ajoute #include <unistd.h> pour read et close.");
    const order = {err: 0, warn: 1, info: 2};
    return R.sort((a, b) => (order[a.k] - order[b.k]) || (a.l - b.l));
  }
  L.norme = norme;

  /* ---------- Éditeur ---------- */
  const KEYS = [["⇥", "\t"], ["{", "{"], ["}", "}"], ["(", "("], [")", ")"], [";", ";"], ["'", "'"], ["\"", "\""], ["\\", "\\"], ["[", "["], ["]", "]"], ["*", "*"], ["&", "&"], ["<", "<"], [">", ">"], ["=", "="], ["!", "!"], ["+", "+"], ["-", "-"], ["%", "%"], ["#", "#"], ["|", "|"]];
  const INCL = {write: "unistd.h", read: "unistd.h", close: "unistd.h", open: "fcntl.h", printf: "stdio.h", scanf: "stdio.h", fgets: "stdio.h", malloc: "stdlib.h", free: "stdlib.h"};
  const skeleton = e => {
    const inc = [...new Set((e.auto || []).map(f => INCL[f]).filter(Boolean))].sort().map(h => "#include <" + h + ">\n").join("");
    return (inc ? inc + "\n" : "") + e.proto.replace(/;$/, "") + "\n{\n\t\n" + (e.main ? "\treturn (0);\n" : "") + "}\n";
  };
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
  const POOL = n => EXOS.filter(e => (e.ex || EXAM_LVL[e.niv]) === n);
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
