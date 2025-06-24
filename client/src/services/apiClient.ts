import axios from 'axios';
import i18next from "i18next";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://lab-backend-a2n6.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Accept-Language": i18next.language, // Set default language
  },
});

// Update the language header whenever language changes
i18next.on("languageChanged", (lng) => {
  apiClient.defaults.headers["Accept-Language"] = lng;
});

export default apiClient;