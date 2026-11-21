# Labo 42

Appli de révision pour préparer la Piscine de 42 et la cybersécurité : parcours de 29 cours avec schémas, fiches de révision, acquis et actus du jour.

Installée depuis https://diiriix.github.io/labo42/ (Safari : Partager → Sur l'écran d'accueil ; Chrome : ⋮ → Installer l'application).

- `index.html` : l'appli (une seule page).
- `actus.json` : les actus du jour, mises à jour automatiquement.
- `manifest.webmanifest`, `sw.js`, icônes : ce qui la rend installable et utilisable hors connexion.
- `push/` : les notifications. `outbox.json` contient le prochain message ; à chaque changement, l'action GitHub « Notifier » l'envoie aux téléphones de `subscriptions.json`. La clé privée est le secret `VAPID_PRIVATE_KEY` du dépôt.
