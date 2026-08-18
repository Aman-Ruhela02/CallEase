import axios from "axios";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.8:3000";

console.log(
  "API URL:",
  API_URL
);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
// GET LEADS
// =========================

export const getLeads = async (token) => {
  try {
    const response = await api.get("/api/leads", {
      headers: {
        ...authHeaders(token),
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: {
        _: Date.now(),
      },
    });

    console.log(
      "GET /api/leads status:",
      response.status
    );

    console.log(
      "GET /api/leads data:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.log(
      "Get leads API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================
// DELETE LEAD
// =========================

export const deleteLead = async (
  token,
  leadId
) => {
  try {
    const response = await api.delete(
      `/api/leads/${leadId}`,
      {
        headers: authHeaders(token),
      }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Delete lead API error:",
      error.response?.status,
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

export default api;