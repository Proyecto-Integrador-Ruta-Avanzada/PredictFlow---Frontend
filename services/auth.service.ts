import api from "@/lib/api";

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: any;
  message?: string;
};

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<LoginResponse>("/api/Auth/login", { email, password });
    return res.data;
  },

  async register(name: string, email: string, password: string) {
    const res = await api.post("/api/Auth/register", { name, email, password });
    return res.data;
  },

  async me() {
    const res = await api.get("/api/profile/me");
    return res.data;
  },
};
