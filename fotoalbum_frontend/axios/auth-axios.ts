import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api",
  withCredentials: true, // TODO optional: if you use cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

export const validate = async (): Promise<boolean> => {
  
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.log("Not logged in, redirecting...");
    return false;
  }
};


export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

export function removeAuthToken(){
  localStorage.removeItem("token");
}

export function getAuthToken(): string | null {
  
  return localStorage.getItem("token");
}

export default api;
