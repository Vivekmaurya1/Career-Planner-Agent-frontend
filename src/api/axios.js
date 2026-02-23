import axios from "axios";

const instance = axios.create({
  baseURL: "https://career-planner-agent-2.onrender.com",
<<<<<<< Updated upstream
  headers: {
    "Content-Type": "application/json",
  },
});

/* 🔐 Always attach token if exists */
=======
});

>>>>>>> Stashed changes
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

<<<<<<< Updated upstream
/* 🚨 Auto logout if 401 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
=======
export default instance;
>>>>>>> Stashed changes
