import axios from "axios";

const API_URL = "http://192.168.1.8:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLeads = async (token) => {
  try {
    if (!token) {
      throw new Error("Clerk token is missing");
    }

    const response = await api.get("/api/leads", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Get leads API error:", error);

    throw error;
  }
};


export const deleteLead = async (token, leadId) => {
  const response = await fetch(
    `${API_URL}/api/leads/${leadId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete lead");
  }

  return data;
};

export default api;