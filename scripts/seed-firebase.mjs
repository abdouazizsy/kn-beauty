// One-off script to seed a real Firebase project with KN Beauty Studio demo data:
// - an admin account and a demo cliente account (Firebase Auth + Firestore `users` doc)
// - the services / products / gallery catalog
//
// Usage:
//   1. Firebase Console → Project settings → Service accounts → Generate new private key.
//      Save the downloaded JSON as `service-account.json` at the project root (gitignored).
//   2. npm run seed:firebase
//
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = join(__dirname, "..", "service-account.json");

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
} catch {
  console.error(
    `\nFichier introuvable : ${serviceAccountPath}\n` +
      "Téléchargez-le depuis la console Firebase : Paramètres du projet → Comptes de service → " +
      "Générer une nouvelle clé privée, puis enregistrez-le sous le nom 'service-account.json' " +
      "à la racine du projet.\n"
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

function phoneToSyntheticEmail(phone) {
  const digits = phone.replace(/[^\d]/g, "");
  return `${digits}@clientes.knbeautystudio.app`;
}

async function upsertAccount({ name, phone, password, role, address, district }) {
  const email = phoneToSyntheticEmail(phone);
  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`✓ Compte déjà existant pour ${phone} (${role})`);
  } catch {
    user = await auth.createUser({ email, password });
    console.log(`✓ Compte créé pour ${phone} (${role})`);
  }
  await db.doc(`users/${user.uid}`).set(
    {
      name,
      phone,
      role,
      address: address ?? null,
      district: district ?? null,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return user.uid;
}

const SERVICES = [
  { name: "Maquillage Mariée", description: "Look de mariée sur-mesure avec essai préalable, produits longue tenue et finition HD.", price: 45000, duration: 120, category: "maquillage" },
  { name: "Maquillage Soirée", description: "Maquillage glamour pour vos événements et cérémonies, finition longue tenue.", price: 20000, duration: 60, category: "maquillage" },
  { name: "Maquillage Jour / Naturel", description: "Un teint frais et lumineux, effet bonne mine, idéal pour le quotidien.", price: 12000, duration: 45, category: "maquillage" },
  { name: "Tresses & Nattes", description: "Réalisation de tresses collées, box braids ou nattes selon le modèle choisi.", price: 15000, duration: 150, category: "coiffure" },
  { name: "Brushing & Coiffage", description: "Lissage, brushing et mise en forme pour un rendu soigné et brillant.", price: 8000, duration: 45, category: "coiffure" },
  { name: "Pose de Perruque / Coiffure mariée", description: "Pose et stylisation de perruque ou coiffure mariée avec accessoires.", price: 18000, duration: 90, category: "coiffure" },
  { name: "Manucure Classique", description: "Soin des mains, dépose, pose de vernis ou semi-permanent au choix.", price: 6000, duration: 40, category: "onglerie" },
  { name: "Pose Gel / Nail Art", description: "Pose gel avec décoration nail art personnalisée selon vos envies.", price: 15000, duration: 90, category: "onglerie" },
  { name: "Pédicure Spa", description: "Soin complet des pieds avec gommage, massage et pose de vernis.", price: 8000, duration: 50, category: "onglerie" },
  { name: "Soin du Visage", description: "Nettoyage de peau, gommage et masque adapté à votre type de peau.", price: 15000, duration: 60, category: "beaute" },
  { name: "Épilation", description: "Épilation au fil ou à la cire selon la zone souhaitée.", price: 5000, duration: 30, category: "beaute" },
];

const PRODUCTS = [
  { name: "Pyjama Satin Rose Poudré", description: "Ensemble pyjama en satin doux, coupe fluide.", price: 18000, stock: 12, category: "pyjamas", sizes: ["S", "M", "L", "XL"], colors: ["Rose poudré", "Beige"] },
  { name: "Pyjama Satin Doré", description: "Pyjama chic en satin brillant, finitions dentelle.", price: 20000, stock: 8, category: "pyjamas", sizes: ["S", "M", "L"], colors: ["Doré", "Noir"] },
  { name: "Pyjama Coton Confort", description: "Pyjama en coton léger et respirant.", price: 12000, stock: 20, category: "pyjamas", sizes: ["S", "M", "L", "XL"], colors: ["Blanc cassé", "Nude"] },
  { name: "Trousse de Maquillage Premium", description: "Trousse élégante en velours.", price: 9000, stock: 15, category: "accessoires", sizes: [], colors: ["Rose poudré", "Doré"] },
  { name: "Set de Pinceaux Professionnels", description: "Ensemble de 12 pinceaux de maquillage avec pochette.", price: 15000, stock: 10, category: "accessoires", sizes: [], colors: ["Doré/Noir"] },
  { name: "Turban Satin", description: "Turban en satin pour protéger vos cheveux la nuit.", price: 5000, stock: 25, category: "accessoires", sizes: ["Unique"], colors: ["Beige", "Rose poudré", "Noir"] },
  { name: "Sérum Visage Éclat", description: "Sérum concentré en vitamine C pour un teint lumineux.", price: 12000, stock: 18, category: "produits-beaute", sizes: [], colors: [] },
  { name: "Huile Capillaire Nourrissante", description: "Mélange d'huiles naturelles pour fortifier vos cheveux.", price: 7000, stock: 22, category: "produits-beaute", sizes: [], colors: [] },
  { name: "Gloss Lèvres Nude", description: "Gloss hydratant effet miroir, teinte nude universelle.", price: 4000, stock: 30, category: "produits-beaute", sizes: [], colors: ["Nude", "Rose"] },
];

const GALLERY = [
  { title: "Maquillage mariée éclat doré", category: "maquillage" },
  { title: "Look soirée glamour", category: "maquillage" },
  { title: "Box braids raffinées", category: "coiffure" },
  { title: "Coiffure mariée perlée", category: "coiffure" },
  { title: "Nail art rose poudré", category: "ongles" },
  { title: "Manucure french doré", category: "ongles" },
  { title: "Avant / Après teint unifié", category: "avant-apres" },
  { title: "Avant / Après coiffure volume", category: "avant-apres" },
];

async function seedCollection(name, items) {
  const snap = await db.collection(name).limit(1).get();
  if (!snap.empty) {
    console.log(`… ${name} contient déjà des documents, seed ignoré.`);
    return;
  }
  const batch = db.batch();
  items.forEach((item) => {
    const ref = db.collection(name).doc();
    batch.set(ref, { ...item, imageUrl: item.imageUrl ?? "", images: item.images ?? [], active: true, createdAt: new Date().toISOString() });
  });
  await batch.commit();
  console.log(`✓ ${items.length} documents ajoutés à ${name}`);
}

async function main() {
  console.log("== Comptes ==");
  await upsertAccount({ name: "Administration KN Beauty", phone: "770000000", password: "admin123", role: "admin" });
  await upsertAccount({
    name: "Awa Diop",
    phone: "781234567",
    password: "cliente123",
    role: "cliente",
    address: "Villa 24, Sacré-Cœur 3",
    district: "Sacré-Cœur",
  });

  console.log("\n== Catalogue ==");
  await seedCollection("services", SERVICES);
  await seedCollection("products", PRODUCTS);
  await seedCollection("gallery", GALLERY);

  console.log("\nTerminé. Connectez-vous en admin avec 77 000 00 00 / admin123.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
