import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    // 🗑️ SUPPRIMÉ : Laissez Axios gérer le Content-Type. 
    // Si la requête est FormData, il utilisera 'multipart/form-data'.
    // 'Content-Type': 'application/json', 
  },
});

// 🎯 Intercepteur unique et combiné pour la Requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Ajout du jeton Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Si Content-Type n'est pas déjà défini (ex: par FormData), on peut le définir ici si nécessaire
    if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour la Réponse (gestion des erreurs)
axiosInstance.interceptors.response.use(
  (response) => response,
 (error) => {
  console.error('Erreur API:', error);
    
    // 💡 Optionnel mais utile : Logique de déconnexion automatique en cas de 401
    if (error.response && error.response.status === 401) {
        console.log("Token non valide ou expiré. Déconnexion utilisateur.");
        // Exemple: localStorage.removeItem('token');
        // Redirection vers /login, etc.
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;