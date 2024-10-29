"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, CircleDashed } from "lucide-react";
import MockApiCall from "./MockApiCall";

export default function IntegrationProgress() {
  const [openSection, setOpenSection] = useState("create-connection");
  const [redirectUri, setRedirectUri] = useState("");
  const [challenge, setChallenge] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uri = params.get("redirect_uri");
    setRedirectUri(uri || "");
    setChallenge(uri?.split("challenge=")[1] || "");
  }, []);

  const handleContinue = () => {
    if (redirectUri) {
      window.location.href = `${redirectUri}&otp=YOUR_OTP_HERE`;
    }
  };

  const Section = ({ id, title, completed, children }) => (
    <div className="border rounded-lg mb-4 bg-white">
      <button
        className="w-full flex items-center justify-between p-4 font-medium text-left text-gray-900"
        onClick={() => setOpenSection(openSection === id ? "" : id)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full p-1 ${
              completed ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {completed ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <CircleDashed className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <span className="text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            openSection === id ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {openSection === id && (
        <div className="p-4 border-t bg-white">{children}</div>
      )}
    </div>
  );

  const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 rounded-md p-4 my-2 overflow-x-auto">
          <code className="text-gray-100">{code}</code>
        </pre>
        <button
          onClick={copyCode}
          className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Bank Feed Integration Progress
          </h1>
          <Section
            id="rutter-redirect"
            title="✅ Step 0: Rutter Redirects to Your Login Page"
            completed={true}
          >
            <p className="text-gray-900">
              When your customer selected your financial institution in
              QuickBooks, Rutter redirected to your login page using the URL you
              provided in the Rutter Dashboard.
            </p>
            <br />
            <p className="text-gray-900">
              Appended to your login page is a Rutter redirect URI and challenge that
              you&apos;ll need to use in Step 6 to complete the login:
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
              {redirectUri}
            </p>
          </Section>
          <Section
            id="auth"
            title="✅ Step 1: Customer Logs In"
            completed={true}
          >
            <p className="text-gray-900">
              Your customer provided their login details. Your system marked
              this as a successful authentication.
            </p>
          </Section>
          <Section
            id="create-connection"
            title="Step 2: Create a Bank Feeds Connection (You Are Here)"
            completed={false}
          >
            <p className="mb-4 text-gray-900">
              Now that your customer has successfully logged in, you'll need to
              create a Rutter connection for them.
            </p>
            <p className="mb-4 text-gray-900">
              This connection will contain all the bank account and transaction
              data for your customer that you want to sync to QuickBooks.
            </p>
            <MockApiCall
              endpoint="/connections/create"
              method="POST"
              body={{
                platform: "INTUIT_BANK_FEEDS",
              }}
              mockResponse={{
                connection: {
                  id: "conn_01HMQZP46BS69PN4PKTGYK6HMQ",
                  access_token: "at_01HMQZP46WQDZ9JBZJS52TN5GE",
                  link_url:
                    "https://link.rutterapi.com/connection/conn_01HMQZP46BS69PN4PKTGYK6HMQ",
                  name: "Example Connection",
                },
              }}
            />
          </Section>
          <Section
            id="accounts"
            title="Step 3: Create Bank Feed Accounts"
            completed={false}
          >
            <p className="mb-4 text-gray-900">
              After authentication, create bank feed accounts:
            </p>
            <MockApiCall
              endpoint="/bank_feeds/accounts"
              method="POST"
              body={{
                bank_feed_account: {
                  account_id: "account-id",
                  internal_bank_account_id: "bank-account-id",
                  transaction_start_date: "2024-02-02T00:00:00.000Z",
                  bank_account_type: "bank",
                  currency_code: "USD",
                  name: "Example Bank Account",
                  available_balance: 1546.23,
                  bank_account_number: "182237382",
                  current_balance: 1833.21,
                  routing_number: "123456789",
                },
              }}
              mockResponse={{
                bank_feed_account: {
                  id: "bfa_01HMQZP46BS69PN4PKTGYK6HMQ",
                  account_id: "account-id",
                  feed_status: "active",
                  transaction_ready: true,
                  name: "Example Bank Account",
                  // ... other fields from request
                },
              }}
            />
          </Section>
          <Section
            id="transactions"
            title="Step 4: Send Bank Feed Transactions"
            completed={false}
          >
            <p className="mb-4 text-gray-900">
              Finally, sync transactions for the bank feed account:
            </p>
            <MockApiCall
              endpoint="/bank_feeds/transactions"
              method="POST"
              body={{
                bank_feed_transactions: {
                  bank_feed_account_id: "bfa_01HMQZP46BS69PN4PKTGYK6HMQ",
                  current_balance: 1234.56,
                  transactions: [
                    {
                      transaction_id: "ACRAF23DB3C4",
                      posted_at: "2024-02-02T02:34:56.000Z",
                      transaction_date: "2024-02-02T02:34:56.000Z",
                      amount: -300,
                      description: "Office supplies",
                      memo: "Staples",
                      transaction_type: "debit",
                      debit_credit_memo: "DEBIT",
                    },
                  ],
                },
              }}
              mockResponse={{
                success: true,
                transactions_synced: 1,
              }}
            />
          </Section>
          <Section id="otp" title="Step 5: Generate OTP" completed={false}>
            <p className="mb-4 text-gray-900">
              Now generate an OTP using Rutter's API. This tells Rutter that the
              authentication was successful:
            </p>
            <MockApiCall
              endpoint="/bank_feeds/otp"
              method="POST"
              mockResponse={{
                bank_feed_otp: {
                  expires_at: "2024-02-29T00:00:00.000Z",
                  otp: "01HMQZP46BS69PN4PKTGYK6HMQ",
                },
              }}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}
