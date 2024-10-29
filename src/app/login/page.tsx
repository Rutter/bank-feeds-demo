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

  return (
    <div>
      {redirectUri ? (
        <BankFeedsLogin onSuccess={handleLoginSuccess} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
            <h2 className="text-center text-xl text-red-600">
              Missing redirect_uri parameter. Please provide a valid redirect
              URI.
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
