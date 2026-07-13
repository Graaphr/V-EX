import url from "@/lib/axios";

interface LoginPayload{
    email : string;
    password : string;
}

// Login API
export async function Login(Payload: LoginPayload ) {
    const res = await url.post('/api/auth/login',Payload);
    return res.data;
    
}