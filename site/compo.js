// Page « compo » : lit le code de partage du comp builder de Featherward
// dans l'adresse (après « # », jamais envoyé au serveur), et dessine la compo
// avec les noms et icônes du set préparés par le site (compo/donnees.json).
"use strict";

const TEXTES = {
  fr: {
    titre: "Compo partagée",
    unites: (n, gold) => `${n} unités · ${gold} gold`,
    aucune: "Aucune compo dans ce lien.",
    invalide: "Ce lien ne contient pas un code de compo valide.",
    copier: "Copier le code",
    copie: "Code copié : colle-le dans le comp builder de Featherward (Infos > Compo > Importer).",
    explication: "Compo créée avec le comp builder de Featherward. Noms et icônes du set en cours.",
    inconnue: "Unité inconnue (autre set ?)",
  },
  en: {
    titre: "Shared comp",
    unites: (n, gold) => `${n} units · ${gold} gold`,
    aucune: "No comp in this link.",
    invalide: "This link doesn't hold a valid comp code.",
    copier: "Copy code",
    copie: "Code copied: paste it in Featherward's comp builder (Info > Comp > Import).",
    explication: "Comp made with Featherward's comp builder. Names and icons from the current set.",
    inconnue: "Unknown unit (another set?)",
  },
};
const langue = (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
const t = TEXTES[langue];
document.documentElement.lang = langue;

const CASES = 28;
const COLONNES = 7;
const PREFIXE_OBJET = "TFT_Item_";
const valide = (s) => /^[A-Za-z0-9_]+$/.test(s);

/** Le code `FW1:<préfixe>:<case>,<unité>,<étoiles>[,<objet>…];…`, comme
 *  `featherward_core::tft::compo::depuis_code`. `null` si invalide. */
function decoder(code) {
  const parties = code.trim().split(":");
  if (parties.length < 3 || parties[0] !== "FW1") return null;
  const prefixe = parties[1];
  const corps = parties.slice(2).join(":");
  if (prefixe && !valide(prefixe)) return null;
  const cases = new Array(CASES).fill(null);
  for (const entree of corps.split(";").filter((e) => e)) {
    const champs = entree.split(",");
    if (champs.length < 3) return null;
    const c = Number(champs[0]);
    const etoiles = Number(champs[2]);
    if (!Number.isInteger(c) || c < 0 || c >= CASES || cases[c]) return null;
    if (!valide(champs[1]) || ![1, 2, 3].includes(etoiles)) return null;
    const objets = champs.slice(3).map((o) => (o.startsWith("@") ? PREFIXE_OBJET + o.slice(1) : o));
    if (objets.length > 3 || !objets.every(valide)) return null;
    cases[c] = { unite: prefixe + champs[1], etoiles, objets };
  }
  return cases;
}

function element(tag, classe, enfants = []) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  for (const enfant of enfants) e.append(enfant);
  return e;
}

function image(src, alt) {
  const i = document.createElement("img");
  i.src = src;
  i.alt = alt;
  i.loading = "lazy";
  return i;
}

function afficher(cases, donnees) {
  const unite = (id) => donnees.unites[id];
  const objet = (id) => donnees.objets[id];
  const nom = (e, id) => (e && e.nom && (e.nom[langue] || e.nom.fr)) || id;
  const plateau = document.getElementById("plateau");
  for (let r = 0; r < CASES / COLONNES; r++) {
    const rangee = element("div", "rangee" + (r % 2 ? " decalee" : ""));
    for (let k = 0; k < COLONNES; k++) {
      const pion = cases[r * COLONNES + k];
      const caseEl = element("div", "case");
      if (!pion) {
        caseEl.append(element("div", "hex vide"));
      } else {
        const u = unite(pion.unite);
        const hex = element("div", "hex cout-" + ((u && u.cout) || 1));
        if (u) hex.append(image(`compo/img/u/${pion.unite}.png`, nom(u, pion.unite)));
        hex.title = u ? nom(u, pion.unite) : t.inconnue;
        const etoiles = element("div", "etoiles");
        for (let s = 0; s < pion.etoiles; s++) etoiles.append(element("span", "etoile e" + pion.etoiles));
        const objets = element("div", "objets");
        for (const o of pion.objets) {
          const i = image(`compo/img/o/${o}.png`, nom(objet(o), o));
          i.title = nom(objet(o), o);
          objets.append(i);
        }
        caseEl.append(hex, etoiles, objets);
      }
      rangee.append(caseEl);
    }
    plateau.append(rangee);
  }
  // La liste : nom, étoiles, objets.
  const liste = document.getElementById("liste");
  let gold = 0;
  let n = 0;
  for (const pion of cases.filter((c) => c)) {
    const u = unite(pion.unite);
    n++;
    gold += ((u && u.cout) || 0) * 3 ** (pion.etoiles - 1);
    const objets = pion.objets.map((o) => nom(objet(o), o)).join(" · ");
    const texte = element("div", "", [
      element("b", "", [u ? nom(u, pion.unite) : t.inconnue]),
      element("span", "", [
        `${pion.etoiles} ${langue === "fr" ? "étoile(s)" : "star(s)"}` + (objets ? " · " + objets : ""),
      ]),
    ]);
    liste.append(element("div", "compo-unite", [u ? image(`compo/img/u/${pion.unite}.png`, "") : element("span"), texte]));
  }
  document.getElementById("sous-titre").textContent = t.unites(n, gold);
}

async function demarrer() {
  document.getElementById("titre").textContent = t.titre;
  document.getElementById("explication").textContent = t.explication;
  const code = decodeURIComponent(location.hash.slice(1));
  const sousTitre = document.getElementById("sous-titre");
  if (!code) {
    sousTitre.textContent = t.aucune;
    return;
  }
  const cases = decoder(code);
  if (!cases) {
    sousTitre.textContent = t.invalide;
    return;
  }
  const bouton = document.getElementById("copier");
  bouton.textContent = t.copier;
  bouton.hidden = false;
  bouton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      const note = document.getElementById("copie");
      note.textContent = t.copie;
      note.hidden = false;
    } catch (_) {
      // Presse-papiers refusé : le code reste lisible dans l'adresse.
    }
  });
  let donnees = { unites: {}, objets: {} };
  try {
    donnees = await (await fetch("compo/donnees.json")).json();
  } catch (_) {
    // Sans données : les identifiants seuls.
  }
  afficher(cases, donnees);
}

demarrer();
