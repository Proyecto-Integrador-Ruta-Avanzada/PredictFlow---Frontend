export interface VerifyInvitationResponse {
  isValid: boolean;
  isExpired: boolean;
  alreadyAccepted: boolean;
  message: string;
}

export const invitationService = {
  invite: async (email: string) => {
    return fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
  },

  verify: async (code: string, email: string): Promise<VerifyInvitationResponse> => {
    const res = await fetch(
      `/api/invitations/verify?code=${code}&email=${email}`
    );
    return res.json();
  },

  accept: async (code: string, email: string) => {
    return fetch("/api/invitations/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, email })
    });
  }
};
