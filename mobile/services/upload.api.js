import api from "./api.js";

const authHeaders = (token) => {
  if (!token) {
    throw new Error(
      "Clerk token is missing"
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// =========================
// CSV
// =========================

export const uploadCSV = async (
  token,
  file
) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name:
      file.name ||
      "leads.csv",
    type:
      file.mimeType ||
      "text/csv",
  });

  const response = await api.post(
    "/api/upload/csv",
    formData,
    {
      headers: {
        ...authHeaders(token),
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =========================
// EXCEL
// =========================

export const uploadExcel = async (
  token,
  file
) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name:
      file.name ||
      "leads.xlsx",
    type:
      file.mimeType ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const response = await api.post(
    "/api/upload/excel",
    formData,
    {
      headers: {
        ...authHeaders(token),
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =========================
// IMAGE
// =========================

export const uploadImage = async (
  token,
  image
) => {
  const formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    name:
      image.fileName ||
      "lead-image.jpg",
    type:
      image.mimeType ||
      "image/jpeg",
  });

  const response = await api.post(
    "/api/upload/image",
    formData,
    {
      headers: {
        ...authHeaders(token),
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};