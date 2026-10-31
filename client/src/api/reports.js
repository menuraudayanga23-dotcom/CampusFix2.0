const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("campusfix_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
};

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
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    credentials: "include",
    body: JSON.stringify(reportData)
  });

  return parseResponse(response);
};

export const getReports = async (queryParams = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  const url = queryString
    ? `${API_BASE_URL}/reports?${queryString}`
    : `${API_BASE_URL}/reports`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeaders()
    },
    credentials: "include"
  });

  return parseResponse(response);
};

export const getReportById = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders()
    },
    credentials: "include"
  });

  return parseResponse(response);
};

export const updateReport = async (reportId, reportData) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    credentials: "include",
    body: JSON.stringify(reportData)
  });

  return parseResponse(response);
};

export const deleteReport = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    },
    credentials: "include"
  });

  return parseResponse(response);
};
