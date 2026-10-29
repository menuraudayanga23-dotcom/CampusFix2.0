const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const parseResponse = async (response) => {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      result?.message || "The request could not be completed"
    );

    error.status = response.status;
    error.details = result?.errors || [];

    throw error;
  }

  return result;
};

export const createReport = async (reportData) => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reportData)
  });

  return parseResponse(response);
};
