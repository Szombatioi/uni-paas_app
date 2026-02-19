import { useRouter } from "next/navigation";
import auth_api, { removeAuthToken, setAuthToken } from "./auth-axios";

export interface RegisterProps{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export async function register(data: RegisterProps) {
    try{
        const res = await auth_api.post("/register", data);
        setAuthToken(res.data);
    } catch (err) {
        throw err;
    }
};

export interface LoginProps {
    email: string;
    password: string;
};

export async function login({ email, password }: LoginProps) {
    try {
        const res = await auth_api.post("/login", { email, password }) //result: the token as string
        setAuthToken(res.data);
    } catch (err) {
        throw err;
    }
};

export function logout(){
    removeAuthToken();    
}