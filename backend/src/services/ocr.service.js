import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export const extractTextFromImage = async (buffer) => {
  try {
    const [result] = await client.textDetection({
      image: {
        content: buffer,
      },
    });

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return "";
    }

    // First annotation contains the complete detected text
    const text = detections[0].description || "";

    return text.trim();

  } catch (error) {
    console.error("OCR service error:", error);
    throw error;
  }
};