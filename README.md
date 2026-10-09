# Site de featherward.lol

Site statique de Featherward, sans dépendance, dans `site/` : trois pages
HTML en français à la racine,
leurs versions anglaises dans `en/` (`index.html`, `privacy.html`,
`legal.html`), une feuille de style, la
police Barlow et des captures (`captures/`, et `captures/en/` pour
l'anglais). Publié par GitHub Pages
(`.github/workflows/site.yml`) à chaque modification de `site/` sur la
branche principale.

Ce dépôt est public pour que GitHub Pages le publie gratuitement ; le code
de l'application vit dans un dépôt privé à part (`Kzenn/pick`), qui produit
les captures (rendus hors écran) et le texte de la politique de
confidentialité à tenir à jour.

Pour le voir en local : ouvrir `site/index.html` dans un navigateur.

## Avant la première publication

1. ~~Compléter les passages « À COMPLÉTER »~~ : fait le 4 octobre 2026
   (Clément FRANCOIS, à titre personnel ; `contact@featherward.lol`). Le
   workflow refuse de publier s'il en réapparaît.
2. ~~Créer l'adresse de contact~~ : fait (redirection de Namecheap).
3. **Remplacer les captures** (rendus hors écran aux données fictives,
   sans illustrations) par de vraies captures, dans les deux langues
   (`captures/` et `captures/en/`) : `selection.png` (vue Sélection,
   1280 × 820), `runes.png` (une page de runes importable, 1248 × 240),
   `profil.png` (vue Profil, 1280 × 820), et, sur une partie dépliée,
   `analyse.png` (onglet Analyse), `objectifs.png` (onglet Objectifs),
   `carte.png` (onglet Carte, une fiche ouverte), environ 860 px de large.
   **Ne pas capturer l'onglet Résumé** : son tableau des scores montre les
   Riot ID des autres joueurs.
4. **Activer GitHub Pages** : dans le dépôt, Settings, Pages, Source :
   « GitHub Actions ». Puis, dans Custom domain, saisir `featherward.lol`
   et cocher « Enforce HTTPS » une fois le certificat délivré.

## DNS chez Namecheap

Dans Domain List, Manage, Advanced DNS, remplacer les enregistrements
existants par :

| Type | Hôte | Valeur |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `kzenn.github.io.` |

Aucun autre enregistrement sur `@` (pas de « URL Redirect Record ») ; ne
pas toucher aux enregistrements de la redirection de courriel (Mail
Settings).

Ce sont les adresses de GitHub Pages ; la propagation prend de quelques
minutes à quelques heures. Le fichier `CNAME` du site indique déjà le
domaine à GitHub.

## Principes

- **Aucun service tiers**, pas même pour la police : un site qui promet de
  ne rien transmettre ne doit pas envoyer l'adresse IP de ses visiteurs à
  Google dès la première page.
- **La politique de confidentialité décrit ce que fait le code.** Toute
  évolution de l'application ou du service commun qui touche aux données
  doit s'y refléter.
