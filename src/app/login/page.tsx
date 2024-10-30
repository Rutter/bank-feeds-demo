"use client";
import { useRouter } from "next/navigation";
import BankFeedsLogin from "@/components/BankFeedsLogin";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUri = searchParams.get("redirect_uri");

  const handleLoginSuccess = () => {
    // Instead of redirecting directly to Rutter, redirect to our success page
    router.push(
      `/login/success?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  };

  return <BankFeedsLogin onSuccess={handleLoginSuccess} />;
}
