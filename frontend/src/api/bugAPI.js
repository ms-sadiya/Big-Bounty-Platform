import API from "./axiosConfig";

export const bugAPI = {
  getAllBugs: (params = {}) => API.get("/bugs", { params }),

  getBugById: (id) => API.get(`/bugs/${id}`),

  createBug: (data) => API.post("/bugs", data),

  getMyBugs: () => API.get("/bugs/my-bugs"),

  deleteBug: (id) => API.delete(`/bugs/${id}`),
};
