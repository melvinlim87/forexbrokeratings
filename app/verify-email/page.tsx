"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {supabase} from "@/lib/supabase";
import { getUserByEmail } from "@/lib/supabase";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // 1. Get access_token, refresh_token, type from hash
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const query = new URLSearchParams(hash);
      const access_token = query.get("access_token");
      const refresh_token = query.get("refresh_token");
      const type = query.get("type");
      // 2. If all required, set session and redirect
      if (access_token && refresh_token && type === "signup") {
        supabase.auth.setSession({
          access_token,
          refresh_token
        }).then(async ({ data, error }) => {
          if (error) {
            setError(error.message || "Failed to set session");
            return;
          }
          let user = data.user;
          if (user) {
            // Use Supabase access_token as jwt, and fetch user_detail
            let jwt_token = access_token; // Use the token from Supabase
            let user_detail = await getUserByEmail(user.email || '');
            // Add jwt and user_detail to user object
            const userWithJwt = { id: user_detail.id, name: user_detail.name, email: user_detail.email, role: user_detail.role };
            const userParam = encodeURIComponent(JSON.stringify(userWithJwt));
            window.location.href = `/api/verify-email?verified_user=${userParam}`;
          } else {
            setError("User not found after verification.");
          }
        });
        return;
      } else {
        setError("Missing access token or refresh token in verification link.");
      }
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Verifying your email...</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>If you are not redirected automatically, please check your email verification link or contact support.</p>
      )}
    </div>
  );
}
