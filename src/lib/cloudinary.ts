const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/** Builds an optimized Cloudinary delivery URL from a public id. */
export function cloudinaryUrl(publicId: string, transform = "f_auto,q_auto,c_fill") {
  if (!CLOUD_NAME) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

/**
 * Unsigned upload directly from the browser to Cloudinary.
 * Requires an unsigned upload preset configured in the Cloudinary console.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary n'est pas configuré. Renseignez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Échec de l'upload de l'image sur Cloudinary.");
  const data = await res.json();
  return data.secure_url as string;
}
