import API from "./axiosConfig";

// Submission endpoints
export const submissionAPI = {
  // Submit a solution for a bug (protected)
  createSubmission: (bugId, submissionData) => {
    return API.post(`/submissions/${bugId}`, submissionData);
  },

  // Approve submission (only bug creator - protected)
  approveSubmission: (submissionId) => {
    return API.patch(`/submissions/${submissionId}/approve`);
  },
};
