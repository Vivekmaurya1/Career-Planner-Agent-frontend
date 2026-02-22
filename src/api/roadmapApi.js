import axios from "./axios";

/* Generate Roadmap */
export const generateRoadmap = async (data) => {
  const response = await axios.post("/api/roadmap/generate", data);
  return response.data;
};

/* Get All User Roadmaps */
export const getUserRoadmaps = async () => {
  const response = await axios.get("/api/roadmap/user");
  return response.data;
};

/* Get Roadmap By ID */
export const getRoadmapById = async (id) => {
  const response = await axios.get(`/api/roadmap/${id}`);
  return response.data;
};