"use client";
import BankFeedsLogin from "@/components/BankFeedsLogin";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function LoginPage() {
 return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}


function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUri = searchParams.get("redirect_uri");

  useEffect(() => {
    if (!redirectUri) {
      router.replace("/login/failure");
    }
  }, [redirectUri, router]);

  if (!redirectUri) return null;

  const handleLoginSuccess = () => {
    router.push(
      `/login/success?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  };

  return <BankFeedsLogin onSuccess={handleLoginSuccess} />;
}