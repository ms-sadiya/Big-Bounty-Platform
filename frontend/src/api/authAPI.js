import API from "./axiosConfig";

// Authentication endpoints
export const authAPI = {
  // Register new user
  register: (userData) => {
    return API.post("/auth/register", userData);
  },

  // Login user
  login: (credentials) => {
    return API.post("/auth/login", credentials);
  },

  // Logout user
  logout: () => {
    return API.post("/auth/logout", {});
  },

  // Refresh access token
  refreshAccessToken: (refreshToken) => {
    return API.post("/auth/refresh-token", { refreshToken });
  },
};
