import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export const extractTextFromImage = async (buffer) => {
  const [result] = await client.textDetection({
    image: {
      content: buffer,
    },
  });
  const detections = result.textAnnotations;
  if (!detections || detections.length === 0) {
    return "";
  }
  const text = detections[0].description || "";
  return text.trim();
};
