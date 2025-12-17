"use client";

import { createContext, useContext, useState } from "react";
import { Invitation } from "@/app/teams/[teamId]/projects/[id]/invitations/types";
import { Member } from "@/app/teams/[teamId]/projects/[id]/members/types";

interface AppContextType {
  invitations: Invitation[];
  members: Member[];
  addInvitation: (email: string) => void;
  acceptInvitation: (email: string) => void;
  cancelInvitation: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const addInvitation = (email: string) => {
    setInvitations(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        email,
        invitedAt: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const acceptInvitation = (email: string) => {
    setInvitations(prev => prev.filter(inv => inv.email !== email));

    setMembers((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role: "admin",
      projects: [],
      currentLoad: 0,
      performance: 0,
    },
  ]);
  };

  const cancelInvitation = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        invitations,
        members,
        addInvitation,
        acceptInvitation,
        cancelInvitation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
