# KN Beauty Studio

Plateforme web pour **KN Beauty Studio** — institut de beauté (maquillage, coiffure, onglerie) et boutique en ligne (pyjamas, accessoires, produits beauté), avec réservation de prestations, gestion des commandes et tableau de bord administrateur.

Stack : **Next.js (App Router) + TypeScript + Tailwind CSS**, **Firebase** (Authentication + Firestore), **Cloudinary** (images), **WhatsApp** comme canal de contact principal.

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Mode démo (sans configuration)

**Aucune configuration n'est requise pour explorer l'application.** Tant que les variables Firebase ne sont pas renseignées, le site fonctionne avec un backend de démonstration stocké dans le `localStorage` du navigateur (voir `src/lib/mock`) : services, produits, galerie, réservations et commandes sont préchargés et entièrement interactifs (CRUD admin, réservation, panier, commande).

Comptes de démonstration :

| Rôle    | Numéro         | Mot de passe |
|---------|----------------|--------------|
| Cliente | 78 123 45 67   | cliente123   |
| Admin   | 77 000 00 00   | admin123     |

Dès que les variables `NEXT_PUBLIC_FIREBASE_*` sont renseignées (voir ci-dessous), l'application bascule automatiquement sur Firebase Authentication et Firestore, sans changement de code — la même couche `src/lib/data/*` gère les deux modes.

## Configuration Firebase

1. Créez un projet sur la [console Firebase](https://console.firebase.google.com).
2. Activez **Authentication** → méthode **Email/Mot de passe** (les clientes s'inscrivent avec leur numéro WhatsApp ; en interne, un email synthétique `numero@clientes.knbeautystudio.app` est généré — voir `src/lib/firebase/client.ts`).
3. Activez **Firestore Database** (mode production).
4. Déployez les règles de sécurité et les index fournis :
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add        # sélectionnez votre projet
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. Copiez `.env.local.example` vers `.env.local` et renseignez la config Web App (⚙️ Paramètres du projet → Vos applications).
6. Créez manuellement un premier compte administrateur : inscrivez-vous via `/register` (compte cliente), puis dans Firestore modifiez le champ `role` du document `users/{uid}` en `"admin"`.

## Configuration Cloudinary

1. Créez un compte sur [cloudinary.com](https://cloudinary.com).
2. Créez un **Upload preset non signé** : *Settings → Upload → Upload presets → Add upload preset → Signing mode: Unsigned*.
3. Renseignez `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` et `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` dans `.env.local`.

Sans Cloudinary configuré, les fiches produits/services/galerie affichent un visuel de remplacement élégant généré localement (aucune dépendance réseau).

## Notifications WhatsApp automatiques (évolution future)

Le dossier `functions/` contient une base Cloud Functions (déclencheurs Firestore sur `appointments` et `orders`) prête à être branchée sur l'API WhatsApp Business ou un fournisseur tiers (Twilio, Meta Cloud API…) — voir `functions/src/index.ts`, fonction `sendWhatsAppMessage`.

## Structure du projet

```
src/
  app/
    (public)/        accueil, services, boutique, galerie, contact — accessibles sans compte
    (auth)/           login, register
    (client)/         dashboard, appointments, orders, profile — cliente connectée
    admin/            dashboard, products, services, orders, appointments, customers
  components/         UI partagée, composants par domaine (services, boutique, admin…)
  context/            AuthContext (Firebase Auth ou mock)
  lib/
    firebase/         initialisation Firebase (client SDK)
    data/              couche d'accès aux données (Firestore ou mock, même API)
    mock/              backend de démonstration (zustand + localStorage)
    cloudinary.ts      upload et URLs Cloudinary
  types/               modèles TypeScript des collections Firestore
firestore.rules         règles de sécurité (cliente = ses données, admin = accès complet)
firestore.indexes.json  index composites nécessaires aux requêtes
functions/               Cloud Functions (stub notifications WhatsApp)
```

## Fonctionnalités implémentées

- Pages publiques (accueil, services, boutique, fiche produit, galerie, contact) accessibles sans compte, bouton WhatsApp flottant.
- Inscription/connexion par numéro WhatsApp (Firebase Auth).
- Réservation de prestation en 4 étapes (service → date/heure → studio ou domicile → envoi), statuts `PENDING → DEPOSIT_RECEIVED → CONFIRMED/CANCELLED → COMPLETED`.
- Boutique avec recherche, filtres par catégorie, panier persistant, commande (statuts `PENDING → CONFIRMED → PREPARING → DELIVERED/CANCELLED`).
- Espace cliente : rendez-vous, commandes, profil.
- Espace admin : tableau de bord (CA, graphique, rendez-vous du jour/semaine, services populaires, top produits), CRUD produits/services, gestion commandes et rendez-vous (validation avec acompte), liste clientes avec historique.
- Design mobile-first, identité KN Beauty Studio (beige/nude, rose poudré, doré).

## Évolutions prévues

- Paiement Wave / Orange Money.
- Notifications WhatsApp automatiques (base posée dans `functions/`).
- Programme de fidélité.
- Application mobile KN Beauty Studio.
