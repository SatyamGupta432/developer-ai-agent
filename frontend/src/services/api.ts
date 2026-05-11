const BASE_URL = "http://localhost:8000";

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const analysisService = {
  analyzeLocal: () => apiCall("/analyze"),
  analyzeRemote: (repoName: string) => apiCall(`/remote/analyze?repo_name=${repoName}`),
  getHistory: () => apiCall("/history"),
  getReports: () => apiCall("/reports"),
  exportExcel: () => apiCall("/export/excel"),
};

export const authService = {
  login: (credentials: any) => apiCall("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  register: (userData: any) => apiCall("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  }),
};
