"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, getBackendTokens, storeBackendTokens } from "@/lib/auth";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      setLoading(false);

      // Sync backend tokens when user logs in
      if (u) {
        try {
          const tokens = await getBackendTokens();
          storeBackendTokens(tokens);
          console.log("Backend tokens synced successfully");
        } catch (error) {
          console.error("Failed to sync backend tokens:", error);
          // Don't set user to null here, let the protected layout handle redirection
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
