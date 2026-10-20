"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <DropdownMenuItem
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await signOut();
          router.push("/sign-in");
          router.refresh();
        } catch (err) {
          console.error("Error signing out:", err);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Signing out..." : "Log Out"}
    </DropdownMenuItem>
  );
}
