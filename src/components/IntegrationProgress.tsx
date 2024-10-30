"use client";

import { useState, useEffect, useId } from "react";
import { Check, ChevronDown, CircleDashed } from "lucide-react";
import MockApiCall from "./MockApiCall";
import RutterApiCall from "./RutterApiCall";

export default function IntegrationProgress() {
  const [openSection, setOpenSection] = useState("create-connection");
  const [redirectUri, setRedirectUri] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [bankFeedAccountId, setBankFeedAccountId] = useState("");
  const [otp, setOtp] = useState("");

  const steps = {
    "rutter-redirect": true,
    auth: true,
    "create-connection": false,
    accounts: false,
    transactions: false,
    "generate-otp": false,
    redirect: false,
  };

  const [completedSteps, setCompletedSteps] = useState(steps);

  const id = useId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uri = params.get("redirect_uri");
    setRedirectUri(uri || "");
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

  const handleFinalRedirect = (fullRedirectUri: string) => {
    window.location.href = fullRedirectUri;
  };

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
              created, copy the <code>access_token</code> returned by Rutter's
              API to send along the rest of our bank feeds data.
            </p>
            <RutterApiCall
              endpoint="/connections/create"
              method="POST"
              body={{
                platform: "INTUIT_BANK_FEEDS",
              }}
            />
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
              Copy the bank feed account <code>id</code> returned by Rutter&apos;s
              API to send along our transaction data to this account in the next
              step.
            </p>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Please provide the access_token
                from the previous step:
              </label>
              <input
                id={id}
                value={accessToken}
                autoFocus={true}
                onInput={(e) => setAccessToken((e.target as HTMLTextAreaElement).value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  text-gray-900 
                  placeholder-gray-500
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter access_token here"
              />
            </div>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/accounts"
              method="POST"
              body={{
                bank_feed_account: {
                  bank_account_type: "bank",
                  currency_code: "USD",
                  name: "Shir's Test Bank Account",
                  internal_bank_account_id: "1",
                  available_balance: 1234.56,
                  current_balance: 1234.56,
                  line_of_business: "small business",
                  routing_number: "10001010",
                },
              }}
              accessToken={accessToken}
            />
          </Section>
          <Section
            id="transactions"
            title="Step 4: Send Bank Feed Transactions"
          >
            <p className="mb-4 text-gray-900">
              Now, let&apos;s sync over the transactions for the bank feed account.
              You can sync up to two years of your customer&apos;s historical
              transactions for this account. Use the Rutter <code>id</code> for
              the bank feed account that you created in the previous step.
            </p>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Please provide the Rutter bank feed account ID generated from
                the previous step:
              </label>
              <input
                id={id}
                value={bankFeedAccountId}
                autoFocus={true}
                onInput={(e) => setBankFeedAccountId((e.target as HTMLTextAreaElement).value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  text-gray-900 
                  placeholder-gray-500
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Rutter bank feed account ID here"
              />
            </div>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/transactions"
              method="POST"
              body={{
                bank_feed_transactions: {
                  bank_feed_account_id: bankFeedAccountId,
                  current_balance: 934.56,
                  transactions: [
                    {
                      transaction_id: "ACRAF23DB3C4",
                      posted_at: "2023-02-02T02:34:56.000Z",
                      transaction_date: "2023-02-02T02:34:56.000Z",
                      amount: -300,
                      description: "Office supplies",
                      memo: "Staples",
                      transaction_type: "debit",
                      debit_credit_memo: "DEBIT",
                    },
                  ],
                },
              }}
              accessToken={accessToken}
            />
          </Section>
          <Section id="generate-otp" title="Step 5: Generate OTP">
            <p className="mb-4 text-gray-900">
              You've successfully created a bank feed account and corresponding
              transactions! Now, you'll prepare to complete the redirect, to the
              redirect URI Rutter appended to your login page URL.
              <br />
              <br />
              You'll need to generate an OTP using Rutter's API. This tells
              Rutter that your customer's authentication was successful. Copy
              the OTP once you've generated it:
            </p>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/otp"
              method="POST"
              accessToken={accessToken}
            />
          </Section>
          <Section id="redirect" title="Step 6: Finish the Redirect">
            <p className="mb-4 text-gray-900">
              Now, append the OTP you generated in the previous step to the
              Rutter redirect URI. Take the redirect URI, and add an{" "}
              <code>&otp=</code> query parameter.
            </p>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Please provide the OTP Rutter generated from the previous step:
              </label>
              <input
                key="otp"
                id={id}
                value={otp}
                autoFocus={true}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  text-gray-900 
                  placeholder-gray-500
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter OTP here"
              />
            </div>{" "}
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
              {redirectUri}&otp={otp}
            </p>
            <br />
            <p className="mb-4 text-gray-900">
              You now have a complete redirect URI. Click the button below to
              redirect to this URL. Then, you can finish the bank feeds
              connection flow within QuickBooks.
            </p>
            <button
              onClick={() => handleFinalRedirect(`${redirectUri}&otp=${otp}`)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
            >
              Continue
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}
