"use client";

import { useState, useEffect, useId } from "react";
import { Check, ChevronDown, CircleDashed } from "lucide-react";
import MockApiCall from "./MockApiCall";
import RutterApiCall from "./RutterApiCall";

export default function IntegrationProgress() {
  const [openSection, setOpenSection] = useState("create-connection");
  const [redirectUri, setRedirectUri] = useState("");
  const [challenge, setChallenge] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const steps = {
    "rutter-redirect": true,
    auth: true,
    "create-connection": false,
    accounts: false,
    transactions: false,
    otp: false,
    redirect: false,
  };

  const [completedSteps, setCompletedSteps] = useState(steps);

  const id = useId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uri = params.get("redirect_uri");
    setRedirectUri(uri || "");
    setChallenge(uri?.split("challenge=")[1] || "");
  }, []);

  const handleContinue = (currentStepKey: string) => {
    const stepKeys = Object.keys(completedSteps); // Get the keys of the object
    const currentIndex = stepKeys.indexOf(currentStepKey);

    // Get the next step key
    const nextStepKey =
      currentIndex < stepKeys.length - 1
        ? stepKeys[currentIndex + 1]
        : currentStepKey;

    setOpenSection(nextStepKey);
    setCompletedSteps((prev) => ({
      ...prev,
      [currentStepKey]: true,
    }));
    
  };
  
  // const handleFinalRedirect = () => {
  //   if (redirectUri) {
  //     window.location.href = `${redirectUri}&otp=YOUR_OTP_HERE`;
  //   }
  // }

  const Section = ({ id, title, children }) => {
    const completed = completedSteps[id];
    return (
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
          <div className="p-4 border-t bg-white">
            {children}
            <button
              onClick={() => handleContinue(id)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    )
  };

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
          >
            <p className="text-gray-900">
              When your customer selected your financial institution in
              QuickBooks, Rutter redirected to your login page using the URL you
              provided in the Rutter Dashboard.
            </p>
            <br />
            <p className="text-gray-900">
              Appended to your login page is a Rutter redirect URI and challenge
              that you&apos;ll need to use in Step 6 to complete the login:
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
              {redirectUri}
            </p>
          </Section>
          <Section id="auth" title="✅ Step 1: Customer Logs In">
            <p className="text-gray-900">
              Your customer provided their login details. Your system marked
              this as a successful authentication.
            </p>
          </Section>
          <Section
            id="create-connection"
            title="Step 2: Create a Bank Feeds Connection"
          >
            <p className="mb-4 text-gray-900">
              Now that your customer has successfully logged in, you'll need to
              create a Rutter connection for them.
            </p>
            <p className="mb-4 text-gray-900">
              This connection will contain all the bank account and transaction
              data for your customer that you want to sync to QuickBooks. Once
              created, we'll use the <code>access_token</code> returned by
              Rutter's API to send along the rest of our bank feeds data.
            </p>
            <RutterApiCall
              endpoint="/connections/create"
              method="POST"
              body={{
                platform: "INTUIT_BANK_FEEDS",
              }}
            />
            {/* <MockApiCall
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
            /> */}
          </Section>
          <Section id="accounts" title="Step 3: Create Bank Feed Accounts">
            <p className="mb-4 text-gray-900">
              Using the <code>access_token</code> returned in the previous step,
              create bank feed accounts for this connection.
              <br />
              <br />
              A bank feed account represent the financial account your customer
              has at your institution—for example, a checking account, or a
              credit card.
              <br />
              <br />
              We'll use the <code>id</code> returned by Rutter's API to send
              along our transaction data in the next step.
            </p>
            <p className="mb-4 text-gray-900">
              <label htmlFor={id}>
                Please provide the <code>access_token</code> from the previous
                step:
              </label>
              <input
                id={id}
                value={accessToken}
                onInput={(e) => setAccessToken(e.target.value)}
                className="mb-4 text-gray-900"
              />
            </p>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/accounts"
              method="POST"
              body={{
                platform: "INTUIT_BANK_FEEDS",
              }}
              accessToken={accessToken}
            />
            {/* <MockApiCall
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
                  id: "00000000-0000-0000-0000-000000000000",
                  account_id: "account-id",
                  feed_status: "active",
                  transaction_ready: true,
                  name: "Example Bank Account",
                  // ... other fields from request
                },
              }}
            /> */}
          </Section>
          <Section
            id="transactions"
            title="Step 4: Send Bank Feed Transactions"
          >
            <p className="mb-4 text-gray-900">
              Now, let's sync transactions for the bank feed account. Use the
              Rutter <code>id</code> for the bank feed account that you created
              in the previous step.
            </p>
            <MockApiCall
              endpoint="/bank_feeds/transactions"
              method="POST"
              body={{
                bank_feed_transactions: {
                  bank_feed_account_id: "00000000-0000-0000-0000-000000000000",
                  current_balance: 1234.56,
                  transactions: [
                    {
                      transaction_id: "ACRAF23DB3C4",
                      posted_at: "2024-02-02T02:34:56.000Z",
                      transaction_date: "2024-02-02T02:34:56.000Z",
                      amount: -300,
                      description: "Office supplies",
                      transaction_type: "debit",
                      debit_credit_memo: "DEBIT",
                    },
                  ],
                },
              }}
              mockResponse={{
                bank_feed_transactions: [
                  {
                    id: "00000000-0000-0000-0000-000000000000",
                    bank_feed_account_id:
                      "00000000-0000-0000-0000-000000000000",
                    transaction_id: "ACRAF23DB3C4",
                    posted_at: "2024-02-02T02:34:56.000Z",
                    transaction_date: "2024-02-02T02:34:56.000Z",
                    amount: -300,
                    description: "Office supplies",
                    transaction_type: "debit",
                    debit_credit_memo: "DEBIT",
                    last_synced_at: "2023-01-02T02:34:56.000Z",
                  },
                ],
              }}
            />
          </Section>
          <Section id="otp" title="Step 5: Generate OTP">
            <p className="mb-4 text-gray-900">
              You've successfully created a bank feed account and corresponding
              transactions! Now, you'll prepare to complete the redirect, to the
              redirect URI Rutter appended to your login page URL.
              <br />
              <br />
              You'll need generate an OTP using Rutter's API. This tells Rutter
              that your customer's authentication was successful:
            </p>
            <MockApiCall
              endpoint="/bank_feeds/otp"
              method="POST"
              body={null}
              mockResponse={{
                bank_feed_otp: {
                  expires_at: "2024-02-29T00:00:00.000Z",
                  otp: "01hMqZP",
                },
              }}
            />
          </Section>
          <Section id="redirect" title="Step 6: Finish the Redirect">
            <p className="mb-4 text-gray-900">
              Now, append the OTP you generated in the previous step to the
              Rutter redirect URI. Take the redirect URI, and add an{" "}
              <code>&otp=</code> query parameter:
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
              {redirectUri}&otp=01hMqZP
            </p>
            <br />
            <p className="mb-4 text-gray-900">
              You now have a complete redirect URI. Redirect to this to allow
              your customers to finish the bank feeds connection flow within
              QuickBooks.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
