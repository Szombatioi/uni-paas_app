import auth_api, { setAuthToken } from "./auth-axios";

const register = () => {

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