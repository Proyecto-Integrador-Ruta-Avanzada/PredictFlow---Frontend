export type InvitationStatus =
  | "loading"
  | "invalid"
  | "valid"
  | "accepted";

export interface VerifyInvitationResponse {
  isValid: boolean;
  isExpired: boolean;
  alreadyAccepted: boolean;
  message: string;
}
