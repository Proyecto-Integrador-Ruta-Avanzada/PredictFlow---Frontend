import api from "@/lib/api";

export interface VerifyInvitationResponse {
  isValid: boolean;
  isExpired: boolean;
  alreadyAccepted: boolean;
  message: string;
}

/**
 * Swagger:
 * - POST   /api/Invitation/invite?email={email}
 * - GET    /api/Invitation/validate?code={code}&email={email}
 * - POST   /api/Invitation/accept   (body: string)
 */
export const invitationService = {
  invite: async (email: string) => {
    const res = await api.post("/api/Invitation/invite", null, { params: { email } });
    return res.data;
  },

  verify: async (code: string, email: string): Promise<VerifyInvitationResponse> => {
    const res = await api.get("/api/Invitation/validate", { params: { code, email } });
    return res.data as VerifyInvitationResponse;
  },

  /**
   * El swagger muestra un body string. En la UI lo usamos como "code".
   */
  accept: async (code: string) => {
    const res = await api.post("/api/Invitation/accept", code, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },
};
