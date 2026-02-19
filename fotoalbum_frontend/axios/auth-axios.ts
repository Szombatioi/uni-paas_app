import axios from "axios";

const auth_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8888",
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

  auth_api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const res = await auth_api.get("/me", {
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
    auth_api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete auth_api.defaults.headers.common["Authorization"];
  }
}

export function removeAuthToken(){
  localStorage.removeItem("token");
}

export function getAuthToken(): string | null {
  
  return localStorage.getItem("token");
}

export default auth_api;
