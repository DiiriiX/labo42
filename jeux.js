/* Labo 42 : entraînements (mini-jeux de 10 questions, tirées au hasard) */
(function () {
  "use strict";
  const L = window.Labo;
  if (!L) return;
  const $ = id => document.getElementById(id);
  const {esc, inline, ic} = L;
  const S = () => L.store();
  const st = () => { const s = S(); if (!s.jeux) s.jeux = {}; return s.jeux; };

  /* ---------- Outils ---------- */
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  // Une question : texte, code facultatif, bonne réponse, mauvaises réponses, explication
  const Q = (q, ok, bad, expl, code) => {
    const wrong = [...new Set(bad.map(String))].filter(x => x !== String(ok)).slice(0, 3);
    if (wrong.length < 3 && !isNaN(+ok)) for (const d of [1, -1, 2, -2, 3, 10]) { const v = String(+ok + d); if (wrong.length < 3 && !wrong.includes(v)) wrong.push(v); }
    const choices = shuffle([String(ok)].concat(wrong));
    return {q, code, choices, answer: choices.indexOf(String(ok)), expl};
  };
  const near = (n, steps, min = -Infinity, max = Infinity) => steps.map(d => n + d).filter(x => x >= min && x <= max && x !== n);
  const bin8 = n => n.toString(2).padStart(8, "0");
  const hex = n => n.toString(16).toUpperCase();
  const chr = c => c === " " ? "l'espace" : "'" + c + "'";

  /* ---------- Les générateurs ---------- */
  const GEN = {
    ascii() {
      const kind = rnd(4);
      const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const c = pick(pool), code = c.charCodeAt(0);
      const base = c >= "a" ? ["a", 97, "minuscules"] : c >= "A" ? ["A", 65, "majuscules"] : ["0", 48, "chiffres"];
      const why = `${chr(c)} vaut ${code} : ${chr(base[0])} vaut ${base[1]}, et les ${base[2]} se suivent (${base[1]} + ${code - base[1]}).`;
      if (kind === 0) return Q(`Quel est le code ASCII de ${chr(c)} ?`, code, near(code, [1, -1, 32, -32, 2, 10]).filter(x => x > 31 && x < 127), why);
      if (kind === 1) { const bad = near(code, [1, -1, 32, -32, 2, -2, 3, -3, 31, 33]).filter(x => x > 47 && x < 123 && /[A-Za-z0-9]/.test(String.fromCharCode(x))).map(x => chr(String.fromCharCode(x))); return Q(`Quel caractère a le code ASCII ${code} ?`, chr(c), bad, why); }
      if (kind === 2) {
        const l = pick("abcdefghijklmnopqrstuvw"), k = 1 + rnd(3), r = String.fromCharCode(l.charCodeAt(0) + k);
        return Q(`Que vaut ce caractère ?`, chr(r), [chr(String.fromCharCode(l.charCodeAt(0) + k + 1)), chr(String.fromCharCode(l.charCodeAt(0) + k - 1)), chr(String.fromCharCode(l.charCodeAt(0) + k).toUpperCase())], `On avance de ${k} dans l'alphabet : ${chr(l)} + ${k} donne ${chr(r)}.`, `'${l}' + ${k}`);
      }
      const d = rnd(10), u = pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      return rnd(2) ? Q(`Que vaut cette expression ?`, d, [d + 48, d + 1, 48], `'${d}' vaut ${48 + d} et '0' vaut 48 : la différence donne le nombre ${d}. C'est l'astuce pour transformer un chiffre en nombre.`, `'${d}' - '0'`)
        : Q(`Que vaut cette expression ?`, chr(u.toLowerCase()), [chr(String.fromCharCode(u.charCodeAt(0) + 1)), chr(u), "'@'"], `Entre une majuscule et sa minuscule, il y a toujours 32 : ${chr(u)} + 32 donne ${chr(u.toLowerCase())}.`, `'${u}' + 32`);
    },
    binaire() {
      const kind = rnd(4), n = kind < 2 ? 1 + rnd(255) : 10 + rnd(246);
      const parts = []; for (let b = 128; b >= 1; b /= 2) if (n & b) parts.push(b);
      const why = `${n} = ${parts.join(" + ")}, donc ${bin8(n)} en binaire et ${hex(n)} en hexadécimal.`;
      const flips = [1, 2, 4, 8, 16, 32, 64, 128].map(b => n ^ b).filter(x => x > 0);
      if (kind === 0) return Q(`Comment s'écrit ${n} en binaire, sur 8 bits ?`, bin8(n), shuffle(flips).slice(0, 3).map(bin8), why);
      if (kind === 1) return Q(`Combien vaut ${bin8(n)} en décimal ?`, n, shuffle(flips).slice(0, 3), why);
      if (kind === 2) return Q(`Comment s'écrit ${n} en hexadécimal ?`, hex(n), [hex(n + 1), hex(n ^ 16), hex(n + 16 > 255 ? n - 16 : n + 16), String(n)], why + " En hexa, chaque chiffre compte 4 bits.");
      return Q(`Combien vaut 0x${hex(n)} en décimal ?`, n, [n + 1, n ^ 16, n - 1, n + 16], why);
    },
    chmod() {
      const R = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
      const digs = [pick([7, 6, 7, 5]), pick([5, 4, 0, 6, 5]), pick([5, 4, 0, 0, 4])];
      const str = digs.map(d => R[d]).join(""), oct = digs.join("");
      const why = `Chaque groupe de 3 lettres donne un chiffre : r = 4, w = 2, x = 1. ${digs.map(d => R[d] + " = " + d).join(", ")}.`;
      const kind = rnd(3);
      const alt = () => { const x = digs.slice(); const i = rnd(3); x[i] = pick([0, 4, 5, 6, 7].filter(v => v !== x[i])); return x.join(""); };
      const alts = () => { const set = new Set(); while (set.size < 3) set.add(alt()); return [...set]; };
      if (kind === 0) return Q(`Comment s'écrivent ces droits en chiffres ?`, oct, alts(), why, "-" + str + "  fichier");
      if (kind === 1) return Q(`Quels droits donne cette commande ?`, str, alts().map(o => o.split("").map(d => R[d]).join("")), why, "chmod " + oct + " fichier");
      const who = pick([["le propriétaire", 0, "peut"], ["le groupe", 1, "peut"], ["les autres", 2, "peuvent"]]), d = digs[who[1]];
      const can = [d & 4 ? "lire" : null, d & 2 ? "écrire" : null, d & 1 ? "exécuter" : null].filter(Boolean);
      const ans = can.length ? can.join(", ") : "rien du tout";
      return Q(`Avec chmod ${oct}, que ${who[2]} faire ${who[0]} ?`, ans, ["lire, écrire, exécuter", "lire", "lire, exécuter", "rien du tout", "lire, écrire"], why);
    },
    reseau() {
      const kind = rnd(5), a = pick([10, 172, 192]), b = a === 192 ? 168 : a === 172 ? 16 + rnd(16) : rnd(256), c = rnd(256), d = 2 + rnd(250);
      const ip = `${a}.${b}.${c}.${d}`;
      if (kind === 0) return Q(`Quelle est l'adresse du réseau de ${ip}/24 ?`, `${a}.${b}.${c}.0`, [`${a}.${b}.${c}.255`, `${a}.${b}.0.0`, `${a}.${b}.${c}.1`, ip, `${a}.0.0.0`], `Avec /24, les 3 premiers nombres désignent le réseau. L'adresse du réseau a 0 pour la partie machine.`);
      if (kind === 1) return Q(`Quelle adresse sert à parler à toutes les machines du réseau ${a}.${b}.${c}.0/24 ?`, `${a}.${b}.${c}.255`, [`${a}.${b}.${c}.0`, `${a}.${b}.${c}.1`, `255.255.255.0`], `C'est l'adresse de diffusion (broadcast) : la dernière du réseau, avec 255 pour la partie machine.`);
      if (kind === 2) { const m = pick([[24, 254], [25, 126], [26, 62], [16, 65534], [30, 2]]); return Q(`Combien de machines peut-on adresser dans un réseau /${m[0]} ?`, m[1], [m[1] + 2, m[1] * 2 + 2, m[1] === 2 ? 4 : m[1] / 2 - 1, 256], `Il reste ${32 - m[0]} bits pour les machines : 2^${32 - m[0]} = ${m[1] + 2} adresses, moins l'adresse du réseau et celle de diffusion.`); }
      if (kind === 3) { const same = rnd(2) === 0, c2 = same ? c : (c + 1 + rnd(50)) % 256, d2 = 2 + rnd(250); return Q(`${a}.${b}.${c}.${d} et ${a}.${b}.${c2}.${d2} sont-elles sur le même réseau /24 ?`, same ? "Oui" : "Non", [same ? "Non" : "Oui", "Ça dépend du DNS", "Seulement en Wi-Fi"], same ? `Les 3 premiers nombres sont identiques (${a}.${b}.${c}) : même réseau /24.` : `Le 3e nombre change (${c} et ${c2}) : avec /24, ce sont deux réseaux différents.`); }
      const priv = pick([`10.${rnd(256)}.${rnd(256)}.${1 + rnd(254)}`, `192.168.${rnd(256)}.${1 + rnd(254)}`, `172.${16 + rnd(16)}.${rnd(256)}.${1 + rnd(254)}`]);
      return Q(`Laquelle de ces adresses est une adresse privée ?`, priv, ["8.8.8.8", "1.1.1.1", `172.${32 + rnd(100)}.4.2`, "142.250.74.14"], `Les adresses privées sont dans 10.0.0.0/8, 172.16.0.0/12 (de 172.16 à 172.31) et 192.168.0.0/16. Elles ne sortent pas sur Internet sans traduction par la box.`);
    },
    ports() {
      const P = [[22, "SSH"], [80, "HTTP"], [443, "HTTPS"], [53, "DNS"], [21, "FTP"], [25, "SMTP (envoi d'e-mails)"], [23, "Telnet"], [3306, "MySQL"], [3389, "RDP (bureau à distance Windows)"], [110, "POP3"], [143, "IMAP"], [445, "SMB (partage de fichiers Windows)"], [5432, "PostgreSQL"], [8080, "HTTP alternatif"]];
      const p = pick(P), others = shuffle(P.filter(x => x !== p)).slice(0, 3);
      const why = `${p[1]} écoute par défaut sur le port ${p[0]}.` + (p[0] === 23 ? " Telnet n'est pas chiffré : on lui préfère SSH." : p[0] === 3389 || p[0] === 445 ? " Ce port exposé sur Internet est une cible classique des attaquants." : "");
      return rnd(2) ? Q(`Quel service écoute en général sur le port ${p[0]} ?`, p[1], others.map(x => x[1]), why) : Q(`Sur quel port écoute en général ${p[1]} ?`, p[0], others.map(x => x[0]), why);
    },
    cesar() {
      const W = ["PISCINE", "BONJOUR", "RESEAU", "SHELL", "CODE", "PORT", "CLAVIER", "SERVEUR", "BANDIT", "POINTEUR", "MEMOIRE", "COMPILER", "FICHIER", "PAQUET", "ROUTEUR", "SECRET", "TERMINAL"];
      const enc = (w, k) => w.replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0) - 65 + k + 26) % 26 + 65));
      const w = pick(W), k = 1 + rnd(5), kind = rnd(3);
      if (kind === 0) return Q(`Ce mot a été chiffré avec la clé ${k}. Que disait-il ?`, w, [enc(w, 1), enc(w, 2 * k), pick(W.filter(x => x !== w && x.length === w.length)) || enc(w, -1)], `On recule chaque lettre de ${k} : ${enc(w, k)} redevient ${w}.`, enc(w, k));
      if (kind === 1) return Q(`Quelle clé transforme ${w} en ${enc(w, k)} ?`, k, [k + 1, k - 1 || 26 - k, 26 - k, k + 2], `${w[0]} devient ${enc(w, k)[0]} : on avance de ${k}.`);
      return Q(`Chiffre ${w} avec la clé ${k}.`, enc(w, k), [enc(w, -k), enc(w, k + 1), enc(w, k - 1)], `Chaque lettre avance de ${k}, et après Z on repart à A.`);
    },
    predire() {
      const T = [
        () => { const a = 2 + rnd(5), b = 2 + rnd(4); return Q("Que va afficher ce programme ?", a * b, [a * b + b, a * b - b, a + b, a * b + 1], `La boucle fait ${a} tours et ajoute ${b} à chaque tour : ${a} × ${b} = ${a * b}.`, `int\ti;\nint\tn;\n\ni = 0;\nn = 0;\nwhile (i < ${a})\n{\n\tn = n + ${b};\n\ti++;\n}\nprintf("%d", n);`); },
        () => { const a = 10 + rnd(20), b = 3 + rnd(4); let i = a; while (i > 0) i -= b; return Q("Que va afficher ce programme ?", i, [i + b, 0, i - b, -i], `i part de ${a} et perd ${b} à chaque tour tant qu'il est positif : ${Array.from({length: Math.ceil(a / b) + 1}, (_, k) => a - k * b).join(", ")}. La boucle s'arrête dès que i n'est plus > 0.`, `int\ti;\n\ni = ${a};\nwhile (i > 0)\n\ti = i - ${b};\nprintf("%d", i);`); },
        () => { const a = 7 + rnd(40), b = 2 + rnd(6); return rnd(2) ? Q("Que va afficher ce programme ?", Math.floor(a / b), [a / b % 1 ? (a / b).toFixed(1).replace(".", ",") : a / b + 1, a % b, Math.floor(a / b) + 1], `Entre deux int, / fait une division entière : la partie après la virgule est perdue. ${a} / ${b} = ${Math.floor(a / b)}.`, `printf("%d", ${a} / ${b});`) : Q("Que va afficher ce programme ?", a % b, [Math.floor(a / b), (a % b) + 1, b - (a % b) || b], `% donne le reste de la division : ${a} = ${b} × ${Math.floor(a / b)} + ${a % b}.`, `printf("%d", ${a} % ${b});`); },
        () => { const k = 1 + rnd(20), l = String.fromCharCode(97 + k); return Q("Que va afficher ce programme ?", l, [String.fromCharCode(97 + k + 1), String.fromCharCode(97 + k - 1), String(97 + k)], `'a' vaut 97. 97 + ${k} = ${97 + k}, c'est le code de '${l}'. write affiche le caractère, pas le nombre.`, `char\tc;\n\nc = 'a';\nc = c + ${k};\nwrite(1, &c, 1);`); },
        () => { const a = 2 + rnd(20), b = 2 + rnd(10); return Q("Que va afficher ce programme ?", a + b, [a, b, a * b], `p contient l'adresse de x. *p, c'est x lui-même : x passe de ${a} à ${a + b}.`, `int\tx;\nint\t*p;\n\nx = ${a};\np = &x;\n*p = *p + ${b};\nprintf("%d", x);`); },
        () => { const a = 1 + rnd(30); return Q("Que va afficher ce programme ?", a, [42, 0, a + 42], `La fonction reçoit une COPIE de x : elle change sa copie, pas x. x vaut toujours ${a}. Pour modifier x, il faudrait lui passer son adresse.`, `void\tchange(int n)\n{\n\tn = 42;\n}\n\n/* dans le main : */\nx = ${a};\nchange(x);\nprintf("%d", x);`); },
        () => { const w = pick(["Piscine", "42", "Lyon", "Bonjour", "shell", "ft_strlen", "a b c"]); return Q("Que va afficher ce programme ?", w.length, [w.length + 1, w.length - 1, w.length + 2], `La boucle compte les cases jusqu'au '\\0' : "${w}" contient ${w.length} caractères (les espaces comptent). Le '\\0' n'est pas compté.`, `char\t*s;\nint\ti;\n\ns = "${w}";\ni = 0;\nwhile (s[i] != '\\0')\n\ti++;\nprintf("%d", i);`); },
        () => { const a = 2 + rnd(4), b = 2 + rnd(4); return Q("Que va afficher ce programme ?", a * b, [a + b, a * b + 1, a * (b + 1)], `La boucle intérieure fait ${b} tours, et elle est relancée ${a} fois : ${a} × ${b} = ${a * b}.`, `count = 0;\ni = 0;\nwhile (i < ${a})\n{\n\tj = 0;\n\twhile (j < ${b})\n\t{\n\t\tcount++;\n\t\tj++;\n\t}\n\ti++;\n}\nprintf("%d", count);`); },
        () => { const t = Array.from({length: 5}, () => rnd(90) + 10), k = rnd(5); return Q("Que va afficher ce programme ?", t[k], [t[(k + 1) % 5], t[(k + 4) % 5], k], `Les cases sont numérotées à partir de 0 : tab[0] vaut ${t[0]}, donc tab[${k}] vaut ${t[k]}.`, `int\ttab[5] = {${t.join(", ")}};\n\nprintf("%d", tab[${k}]);`); },
        () => { const a = 1 + rnd(50); return Q("Que va afficher ce programme ?", `${a + 1} ${a}`, [`${a + 1} ${a + 1}`, `${a} ${a}`, `${a} ${a + 1}`], `j = i++ copie d'abord la valeur de i (${a}) dans j, PUIS augmente i. Avec ++i, ce serait l'inverse.`, `int\ti;\nint\tj;\n\ni = ${a};\nj = i++;\nprintf("%d %d", i, j);`); },
        () => { const n = rnd(60) - 20; const r = n < 0 ? "N" : n === 0 ? "Z" : n % 2 === 0 ? "P" : "I"; return Q("Que va afficher ce programme ?", r, ["N", "Z", "P", "I"].filter(x => x !== r), `n vaut ${n} : ${n < 0 ? "il est négatif, le premier test est vrai" : n === 0 ? "il n'est pas négatif, mais il vaut 0" : `il est positif, et ${n} % 2 vaut ${n % 2}`}. Seule la première condition vraie s'exécute.`, `n = ${n};\nif (n < 0)\n\twrite(1, "N", 1);\nelse if (n == 0)\n\twrite(1, "Z", 1);\nelse if (n % 2 == 0)\n\twrite(1, "P", 1);\nelse\n\twrite(1, "I", 1);`); }
      ];
      return pick(T)();
    },
    norme() {
      const R = {for: "La boucle for est interdite", kw: "Il manque un espace après un mot-clé", decl: "Déclaration et affectation sur la même ligne", brace: "Une accolade n'est pas seule sur sa ligne", ok: "Aucune faute", tern: "L'opérateur ternaire est interdit", params: "Plus de 4 paramètres", vide: "Il manque la ligne vide après les déclarations", void: "Il manque void entre les parenthèses", tab: "Il faut une tabulation, pas un espace"};
      const B = [
        ["for", "int\tft_sum(int n)\n{\n\tint\ti;\n\tint\ts;\n\n\ts = 0;\n\tfor (i = 0; i < n; i++)\n\t\ts = s + i;\n\treturn (s);\n}"],
        ["kw", "int\tft_is_neg(int n)\n{\n\tif(n < 0)\n\t\treturn (1);\n\treturn (0);\n}"],
        ["kw", "void\tft_count(void)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile(i < 10)\n\t\ti++;\n}"],
        ["decl", "int\tft_strlen(char *str)\n{\n\tint\ti = 0;\n\n\twhile (str[i])\n\t\ti++;\n\treturn (i);\n}"],
        ["brace", "void\tft_putchar(char c) {\n\twrite(1, &c, 1);\n}"],
        ["brace", "int\tft_max(int a, int b)\n{\n\tif (a > b) {\n\t\treturn (a);\n\t}\n\treturn (b);\n}"],
        ["tern", "int\tft_abs(int n)\n{\n\treturn (n < 0 ? -n : n);\n}"],
        ["params", "int\tft_add5(int a, int b, int c, int d, int e)\n{\n\treturn (a + b + c + d + e);\n}"],
        ["vide", "void\tft_print(char *s)\n{\n\tint\ti;\n\ti = 0;\n\twhile (s[i])\n\t{\n\t\twrite(1, &s[i], 1);\n\t\ti++;\n\t}\n}"],
        ["void", "void\tft_print_numbers()\n{\n\twrite(1, \"0123456789\", 10);\n}"],
        ["tab", "int ft_double(int n)\n{\n\treturn (n * 2);\n}"],
        ["ok", "void\tft_swap(int *a, int *b)\n{\n\tint\ttmp;\n\n\ttmp = *a;\n\t*a = *b;\n\t*b = tmp;\n}"],
        ["ok", "int\tft_strlen(char *str)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (str[i] != '\\0')\n\t\ti++;\n\treturn (i);\n}"],
        ["ok", "void\tft_is_negative(int n)\n{\n\tif (n < 0)\n\t\twrite(1, \"N\", 1);\n\telse\n\t\twrite(1, \"P\", 1);\n}"]
      ];
      const b = pick(B), wrong = shuffle(Object.keys(R).filter(k => k !== b[0])).slice(0, 3);
      const expl = {for: "La Norme interdit for : on écrit toutes les boucles avec while.", kw: "Après if, while ou return, la Norme veut un espace : if (n < 0).", decl: "On déclare d'abord (int\ti;), on affecte ensuite (i = 0;), sur une autre ligne.", brace: "Les accolades { et } doivent être seules sur leur ligne.", ok: "Ce code respecte la Norme : déclarations en haut, ligne vide, tabulations, while, accolades seules.", tern: "Le ternaire ( ? : ) est interdit : écris un if / else.", params: "Une fonction peut recevoir au plus 4 paramètres nommés.", vide: "Après les déclarations, la Norme veut une ligne vide.", void: "Une fonction sans paramètre s'écrit avec void : ft_print_numbers(void).", tab: "Entre le type de retour et le nom de la fonction, la Norme veut une tabulation."};
      return Q("Quelle est la faute de Norme dans ce code ?", R[b[0]], wrong.map(k => R[k]), expl[b[0]], b[1]);
    },
    commandes() {
      const C = [
        ["Afficher aussi les fichiers cachés", "ls -a"], ["Savoir dans quel dossier tu es", "pwd"], ["Remonter au dossier parent", "cd .."], ["Retourner dans ton dossier personnel", "cd ~"],
        ["Compter les lignes d'un fichier", "wc -l fichier"], ["Chercher un mot dans un fichier", "grep mot fichier"], ["Trouver un fichier par son nom", "find . -name nom"], ["Voir les droits des fichiers", "ls -l"],
        ["Ajouter une ligne à la fin d'un fichier", "echo texte >> fichier"], ["Remplacer le contenu d'un fichier", "echo texte > fichier"], ["Rendre un script exécutable pour toi", "chmod u+x script.sh"], ["Créer des dossiers imbriqués d'un coup", "mkdir -p a/b/c"],
        ["Supprimer un dossier et son contenu", "rm -r dossier"], ["Renommer un fichier", "mv ancien nouveau"], ["Copier un fichier", "cp source copie"], ["Lire le manuel d'une commande", "man commande"],
        ["Afficher les 10 premières lignes", "head fichier"], ["Afficher les 10 dernières lignes", "tail fichier"], ["Trier des nombres", "sort -n fichier"], ["Compter les lignes identiques", "sort fichier | uniq -c"],
        ["Lire un fichier qui s'appelle -", "cat ./-"], ["Se connecter en SSH sur le port 2220", "ssh -p 2220 user@hote"], ["Compiler comme à 42", "cc -Wall -Wextra -Werror *.c"], ["Lancer le programme compilé", "./a.out"],
        ["Voir l'état de ton dépôt Git", "git status"], ["Préparer un fichier pour le prochain commit", "git add fichier"], ["Enregistrer une version avec un message", "git commit -m \"message\""], ["Envoyer tes commits au serveur", "git push"],
        ["Récupérer un dépôt", "git clone adresse"], ["Chercher sans tenir compte des majuscules", "grep -i mot fichier"], ["Garder les lignes qui NE contiennent PAS un mot", "grep -v mot fichier"], ["Voir les ports ouverts de ta machine", "ss -tuln"],
        ["Demander l'adresse IP d'un nom de domaine", "dig exemple.fr"], ["Tester si une machine répond", "ping adresse"], ["Voir tes adresses IP", "ip a"], ["Calculer l'empreinte MD5 d'un fichier", "md5sum fichier"],
        ["Envoyer les erreurs dans un fichier", "commande 2> erreurs.txt"], ["Lancer B seulement si A a réussi", "A && B"], ["Revoir tes dernières commandes", "history"], ["Afficher le contenu d'un fichier", "cat fichier"]
      ];
      const c = pick(C), wrong = shuffle(C.filter(x => x !== c)).slice(0, 3).map(x => x[1]);
      return Q(`Quelle commande pour : ${c[0].charAt(0).toLowerCase() + c[0].slice(1)} ?`, c[1], wrong, `${c[1]} : ${c[0].charAt(0).toLowerCase() + c[0].slice(1)}.`);
    },
    lexique() {
      const M = L.LEXIQUE || [];
      const m = pick(M), same = shuffle(M.filter(x => x !== m && x[1] === m[1])).slice(0, 3);
      const words = m[0].split(/[\s,]+/).filter(w => w.length > 2);
      let def = m[2]; words.forEach(w => { def = def.split(w).join("…"); });
      const r = Q(`Quel mot correspond à cette définition ?`, m[0], same.map(x => x[0]), `${m[0]} : ${m[2]}`); r.def = def; return r;
    }
  };
  // Le grand quiz utilise les quiz des cours
  let QUIZ = [];
  const loadQuiz = () => L.lessons ? L.lessons().then(all => { QUIZ = []; Object.entries(all).forEach(([id, d]) => (d.quiz || []).forEach(q => QUIZ.push([id, q]))); }) : Promise.resolve();
  GEN.quiz = () => {
    const [id, q] = pick(QUIZ.length ? QUIZ : [["", {q: "Le grand quiz se charge…", choix: ["D'accord"], bonne: 0, explication: ""}]]);
    const t = L.TOPIC[id];
    const r = Q(q.q, q.choix[q.bonne], q.choix.filter((_, i) => i !== q.bonne), q.explication + (t ? ` (cours : ${t.t})` : ""));
    r.cours = id; return r;
  };

  const GAMES = [
    {id: "predire", t: "Que va afficher ce code ?", d: "Dérouler un programme C dans sa tête, comme à l'examen.", ic: "code", tone: "bs"},
    {id: "norme", t: "Chasse aux fautes", d: "Repérer ce que la norminette refuserait.", ic: "check", tone: "gs"},
    {id: "ascii", t: "Code ASCII", d: "Les lettres sont des nombres : calcule avec.", ic: "spark", tone: "ys"},
    {id: "binaire", t: "Binaire et hexa", d: "Passer du décimal au binaire et à l'hexadécimal.", ic: "sliders", tone: "bs"},
    {id: "commandes", t: "La bonne commande", d: "40 situations du terminal, à toi de trouver la commande.", ic: "term", tone: "dk"},
    {id: "chmod", t: "Droits chmod", d: "rwx et chiffres, dans les deux sens.", ic: "key", tone: "gs"},
    {id: "reseau", t: "Adresses et masques", d: "Réseau, diffusion, /24, adresses privées.", ic: "flag", tone: "bs"},
    {id: "ports", t: "Ports et services", d: "22, 80, 443, 53… les numéros à connaître.", ic: "news", tone: "rs"},
    {id: "cesar", t: "Casse le César", d: "Chiffrer, déchiffrer, retrouver la clé.", ic: "key", tone: "rs"},
    {id: "quiz", t: "Grand quiz des cours", d: "Les questions des 32 cours, mélangées.", ic: "help", tone: "ys"},
    {id: "lexique", t: "Le bon mot", d: "Une définition, quatre mots : lequel est le bon ?", ic: "book", tone: "gs"}
  ];
  L.GAMES = GAMES;
  const N = 10;

  /* ---------- Affichage ---------- */
  let game = null;
  function renderHub() {
    const j = st(), played = GAMES.filter(g => j[g.id] && j[g.id].plays).length;
    $("jeuxBox").innerHTML = `<button class="back" type="button" data-go="#pratique">← Pratique</button>
      <div class="hero"><div><h1>Entraînements</h1><p class="sub">Des parties de 10 questions, tirées au hasard : jamais deux fois les mêmes.</p></div><span class="hart">${L.ART.jeux}</span></div>
      <p class="small" style="margin-top:12px">${played} / ${GAMES.length} entraînements essayés · ${Object.values(j).reduce((n, x) => n + (x.plays || 0), 0)} parties jouées</p>
      <div class="ggrid">${GAMES.map(g => { const r = j[g.id] || {}; return `<a class="gcard" href="#jeux-${g.id}"><span class="stile ${g.tone}">${ic(g.ic)}</span><b>${esc(g.t)}</b><small>${esc(g.d)}</small><span class="gbest">${r.plays ? `Record : ${r.best} / ${N}` : "Pas encore joué"}</span></a>`; }).join("")}</div>`;
  }
  function start(id) {
    const g = GAMES.find(x => x.id === id); if (!g) { renderHub(); return; }
    const go = () => {
      const qs = [], seen = new Set();
      for (let k = 0; k < 40 && qs.length < N; k++) { const q = GEN[id](); const key = q.q + "|" + (q.code || "") + "|" + q.choices[q.answer]; if (seen.has(key)) continue; seen.add(key); qs.push(q); }
      game = {g, qs, i: 0, score: 0, done: false, answered: false};
      renderQ();
    };
    if (id === "quiz" && !QUIZ.length) { $("jeuxBox").innerHTML = `<div class="loading"><span class="spin"></span><p>Chargement des questions…</p></div>`; loadQuiz().then(go); } else go();
  }
  function renderQ() {
    const {g, qs, i, score} = game, q = qs[i];
    $("jeuxBox").innerHTML = `<div class="gtop"><button class="back" type="button" data-go="#jeux">← Entraînements</button><span class="gscore">${ic("check")} ${score}</span></div>
      <p class="kicker">${esc(g.t)} · question ${i + 1} sur ${qs.length}</p>
      <div class="exsteps g10">${qs.map((_, k) => `<i class="${k < i ? (qs[k].ok ? "ok" : "ko") : k === i ? "cur" : ""}"></i>`).join("")}</div>
      <h2 class="gq">${inline(q.q)}</h2>
      ${q.def ? `<div class="box">${inline(q.def)}</div>` : ""}
      ${q.code ? `<div class="code"><div class="code-h"><i></i><i></i><i></i><span>${g.id === "predire" || g.id === "norme" ? "Code C" : g.id === "cesar" ? "Message" : g.id === "chmod" ? "Terminal" : "Expression"}</span></div><pre><code>${esc(q.code)}</code></pre></div>` : ""}
      <div class="gch">${q.choices.map((c, k) => `<button class="opt" type="button" data-gk="${k}">${esc(c)}</button>`).join("")}</div>
      <div id="gfb" aria-live="polite"></div>`;
  }
  function answer(k) {
    if (!game || game.answered) return;
    const q = game.qs[game.i], ok = k === q.answer;
    game.answered = true; q.ok = ok; if (ok) game.score++;
    document.querySelectorAll(".gch .opt").forEach((o, idx) => { o.disabled = true; if (idx === q.answer) o.classList.add("ok"); else if (idx === k) o.classList.add("ko"); });
    const last = game.i === game.qs.length - 1;
    $("gfb").innerHTML = `<div class="box ${ok ? "acc" : "warn"}"><h3>${ic(ok ? "check" : "alert")}${ok ? pick(["Bravo, c'est ça !", "Exact !", "Bien vu !", "Parfait !"]) : "Pas tout à fait."}</h3><p>${inline(q.expl)}</p>${q.cours && L.TOPIC[q.cours] ? `<a class="link" href="#cours-${q.cours}">Revoir le cours</a>` : ""}</div><button class="btn acc full" type="button" data-gn="1">${last ? "Voir mon score" : "Question suivante"}</button>`;
    const sc = document.querySelector(".gscore"); if (sc) sc.innerHTML = `${ic("check")} ${game.score}`;
    $("gfb").scrollIntoView({block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  }
  function next() {
    if (!game) return;
    if (game.i < game.qs.length - 1) { game.i++; game.answered = false; renderQ(); scrollTo(0, 0); return; }
    finish();
  }
  function finish() {
    const {g, score, qs} = game, j = st(), r = j[g.id] || (j[g.id] = {best: 0, plays: 0});
    const rec = score > r.best || !r.plays;
    r.plays++; r.best = Math.max(r.best, score); r.last = L.today;
    const s = S(); s.day.jeu = true; L.active();
    const msg = score === qs.length ? "Sans faute !" : score >= 8 ? "Très bien joué !" : score >= 5 ? "Pas mal, continue !" : "Ça viendra : relis les explications et rejoue.";
    $("jeuxBox").innerHTML = `<button class="back" type="button" data-go="#jeux">← Entraînements</button>
      <div class="card exres" style="text-align:center"><p class="small" style="margin:0">${esc(g.t)}</p><p class="big">${score}<small> / ${qs.length}</small></p><p><b>${msg}</b>${rec && r.plays > 1 ? " Nouveau record !" : ""}</p><p class="small">Record : ${r.best} / ${qs.length} · ${r.plays} partie${r.plays > 1 ? "s" : ""}</p></div>
      ${qs.some(q => !q.ok) ? `<h2>À revoir</h2>${qs.filter(q => !q.ok).map(q => `<div class="card"><p><b>${inline(q.q)}</b></p>${q.code ? `<pre class="proto">${esc(q.code)}</pre>` : ""}<p class="small" style="margin:8px 0 4px">Bonne réponse : <b>${esc(q.choices[q.answer])}</b></p><p class="small" style="margin:0">${inline(q.expl)}</p></div>`).join("")}` : ""}
      <button class="btn acc full" type="button" data-gs="${g.id}">${ic("play")} Rejouer</button><a class="btn ghost full" href="#jeux">Un autre entraînement</a>`;
    if (score === qs.length) L.toast(`${ic("medal")}<span>Sans faute en ${esc(g.t)} !</span>`);
    game = null;
  }
  document.addEventListener("click", e => {
    const k = e.target.closest("[data-gk]"); if (k) { answer(+k.dataset.gk); return; }
    if (e.target.closest("[data-gn]")) { next(); return; }
    const s = e.target.closest("[data-gs]"); if (s) { start(s.dataset.gs); scrollTo(0, 0); }
  });
  const show = ({v, arg}) => { if (v !== "jeux") { game = null; return; } if (arg) start(arg); else { game = null; renderHub(); } };
  document.addEventListener("labo:view", ev => show(ev.detail));
  show(L.view());
  L.jeuxGen = GEN;
})();
