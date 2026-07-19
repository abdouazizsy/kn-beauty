import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();
const db = getFirestore();

/**
 * Placeholder for the future WhatsApp Business API / provider (e.g. Twilio, Meta Cloud API) integration.
 * Wire this up once KN Beauty Studio has WhatsApp Business API credentials.
 */
async function sendWhatsAppMessage(to: string, message: string) {
  logger.info(`[WhatsApp stub] -> ${to}: ${message}`);
  // TODO: call the WhatsApp Business API / provider here.
}

export const onAppointmentCreated = onDocumentCreated("appointments/{appointmentId}", async (event) => {
  const appointment = event.data?.data();
  if (!appointment) return;

  await sendWhatsAppMessage(
    appointment.clientPhone,
    `Bonjour ${appointment.clientName}, votre demande de réservation pour "${appointment.serviceName}" ` +
      `le ${appointment.date} à ${appointment.time} a bien été reçue. Un acompte de ${appointment.depositAmount} FCFA ` +
      `vous sera demandé pour confirmer votre créneau. — KN Beauty Studio`
  );
});

export const onAppointmentStatusUpdated = onDocumentUpdated("appointments/{appointmentId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.status === after.status) return;

  const messages: Record<string, string> = {
    DEPOSIT_RECEIVED: "Nous avons bien reçu votre acompte, votre demande est en cours de validation.",
    CONFIRMED: "Votre rendez-vous est confirmé ! Nous avons hâte de vous accueillir.",
    COMPLETED: "Merci pour votre visite chez KN Beauty Studio, à très vite !",
    CANCELLED: "Votre réservation a été annulée. Contactez-nous sur WhatsApp pour plus d'informations.",
  };

  const message = messages[after.status];
  if (message) {
    await sendWhatsAppMessage(after.clientPhone, `Bonjour ${after.clientName}, ${message} — KN Beauty Studio`);
  }
});

export const onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data?.data();
  if (!order) return;

  // Clientes cannot write to `products` directly (see firestore.rules) — stock is
  // decremented here, server-side, using the Admin SDK, right after order creation.
  const batch = db.batch();
  for (const item of order.products ?? []) {
    batch.update(db.doc(`products/${item.productId}`), { stock: FieldValue.increment(-item.quantity) });
  }
  await batch.commit();

  await sendWhatsAppMessage(
    order.clientPhone,
    `Bonjour ${order.clientName}, votre commande d'un montant de ${order.totalAmount} FCFA a bien été enregistrée. ` +
      `Nous vous contactons prochainement pour la livraison. — KN Beauty Studio`
  );
});
