"use client";

import { useState, useEffect, useId } from "react";
import { Check, ChevronDown, CircleDashed } from "lucide-react";
import RutterApiCall from "./RutterApiCall";

interface ApiResponse {
  status: number;
  data: any;
}

interface ApiResponses {
  [key: string]: ApiResponse | null;
}

export default function SageIntegrationProgress() {
  const [openSection, setOpenSection] = useState("create-connection");
  const [redirectUri, setRedirectUri] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [bankFeedAccountId, setBankFeedAccountId] = useState("");
  const [otp, setOtp] = useState("");
  const [challenge, setChallenge] = useState("");
  
  // Add state for API responses
  const [apiResponses, setApiResponses] = useState<ApiResponses>({
    "create-connection": null,
    "create-account": null,
    "generate-otp": null,
    "sync-transactions": null,
  });

  const steps = {
    "create-connection": true,
    "rutter-redirect": false,
    "create-account": false,
    "generate-otp": false,
    "sync-transactions": false,
    redirect: false,
  };

  const [completedSteps, setCompletedSteps] = useState(steps);

  const id = useId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uri = params.get("redirect_uri");
    const challengeParam = params.get("challenge");
    setRedirectUri(uri || "");
    setChallenge(challengeParam || "");
  }, []);

  // Auto-populate access token from mock response
  useEffect(() => {
    if (apiResponses["create-connection"]?.data?.connection?.access_token) {
      setAccessToken(apiResponses["create-connection"].data.connection.access_token);
    }
  }, [apiResponses["create-connection"]]);

  const handleApiResponse = (sectionId: string, response: ApiResponse) => {
    setApiResponses((prev) => ({
      ...prev,
      [sectionId]: response,
    }));
  };

  const handleContinue = (currentStepKey: string) => {
    // Special handling for step 1 - open login page in new tab
    if (currentStepKey === "rutter-redirect") {
      window.open("http://localhost:3000/login", "_blank");
    }

    const stepKeys = Object.keys(completedSteps);
    const currentIndex = stepKeys.indexOf(currentStepKey);
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

  const Section = ({ id, title, children, overrideButton = false }) => {
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
        {/* Always render children, but hide them when section is closed */}
        <div
          className={`${
            openSection === id ? "block" : "hidden"
          } p-4 border-t bg-white`}
        >
          {children}
          {!overrideButton && (
            <button
              onClick={() => handleContinue(id)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Sage Bank Feed Integration Progress
          </h1>
          
          <Section
            id="create-connection"
            title="✅ Step 0: Create a Rutter Connection"
          >
            <p className="mb-4 text-gray-900">
              First, your customers must successfully establish a Rutter Connection to their Sage instance.
              Embed Rutter Link into your application and direct your customers through the flow in order to create a new Connection.
            </p>
            <p className="mb-4 text-gray-900">
              This connection contains an <code>access_token</code> used to read and write data for that instance.
            </p>
            <RutterApiCall
              endpoint="/connections/create"
              method="POST"
              body={{
                platform: "SAGE",
              }}
              mockResponse={{
                status: 200,
                data: {
                  connection: {
                    id: "e3cd7459-1d34-46ba-bde3-01087c1001a6",
                    name: "null",
                    access_token: "d0b0eb13-020c-48ca-9324-2ce7c9c0dc1f",
                    link_url: "https://link.rutterapi.com/connection/e3cd7459-1d34-46ba-bde3-01087c1001a6"
                  }
                }
              }}
              onResponse={(response) =>
                handleApiResponse("create-connection", response)
              }
              savedResponse={apiResponses["create-connection"]}
            />
          </Section>

          <Section
            id="rutter-redirect"
            title="Step 1: Rutter Redirects to Your Login Page"
          >
            <p className="text-gray-900">
              When your customer selected your financial institution in
              Sage, Rutter redirected to your login page using the URL you
              provided in the Rutter Dashboard.
            </p>
            <br />
            <p className="text-gray-900">
              Appended to your login page is a Rutter redirect URI and challenge
              that you&apos;ll need to use in Step 5 to complete the authentication:
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
              {redirectUri}
            </p>
            {challenge && (
              <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
                Challenge: {challenge}
              </p>
            )}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Invite code:</strong> 092323
              </p>
            </div>
          </Section>

          <Section id="create-account" title="Step 2: Create Bank Feed Accounts">
            <p className="mb-4 text-gray-900">
              Use Rutter&apos;s POST /bank_feeds/accounts API endpoint to supply the bank accounts your customer would like to set up with a Bank Feed.
              Your customer will be able to select any of the accounts you supply through this endpoint during the Sage Bank Feeds authentication flow.
            </p>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Please provide the access_token from the previous step:
              </label>
              <input
                id={id}
                value={accessToken}
                autoFocus={true}
                onInput={(e) =>
                  setAccessToken((e.target as HTMLTextAreaElement).value)
                }
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
                  internal_bank_account_id: "0674101012388",
                  parent_bank_feed_account_id: "00000000-0000-0000-0000-000000000000",
                  transaction_start_date: "2023-02-02T00:00:00.000Z",
                  bank_account_type: "bank",
                  currency_code: "USD",
                  name: "Linda's TEYA Bank",
                  available_balance: 1546.23,
                  bank_account_number: "182237382",
                  current_balance: 1833.21,
                  line_of_business: "small business",
                  routing_number: "123456789",
                  feed_status: "active"
                },
              }}
              accessToken={accessToken}
              onResponse={(response) => handleApiResponse("create-account", response)}
              savedResponse={apiResponses["create-account"]}
            />
          </Section>

          <Section
            id="generate-otp"
            title="Step 3: Generate OTP for Authentication"
          >
            <p className="mb-4 text-gray-900">
              To authenticate the connection, you&apos;ll need to generate an OTP and append that to the redirect URL as an additional parameter.
              The redirect URL already includes a challenge ID as a query parameter. All you need to do is add one more query parameter with the OTP.
            </p>
            <p className="mb-4 text-gray-900">
              The OTP should not be displayed to the user. It is passed back to Rutter so Rutter can link the correct user&apos;s Sage account to the correct Rutter connection.
            </p>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/otp"
              method="POST"
              accessToken={accessToken}
              onResponse={(response) =>
                handleApiResponse("generate-otp", response)
              }
              savedResponse={apiResponses["generate-otp"]}
            />
          </Section>

          <Section
            id="sync-transactions"
            title="Step 4: Sync Bank Feed Transactions"
          >
            <p className="mb-4 text-gray-900">
              In order for you to start syncing transaction data for a Bank Feed Account, your customer must have successfully authenticated and set up the Bank Feed through their Sage product.
            </p>
            <p className="mb-4 text-gray-900">
              To sync transaction data for a Bank Feed Account, use the POST /bank_feeds/transactions API.
              When users link their account in Sage, they will be asked to choose the start date for the Bank Feed&apos;s transaction history.
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
                onInput={(e) =>
                  setBankFeedAccountId((e.target as HTMLTextAreaElement).value)
                }
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
                  transactions: [
                    {
                      transaction_id: "ACRAF23DB3C4",
                      posted_at: "2025-02-02T02:34:56.000Z",
                      amount: -300,
                      description: "Linda's Office supplies",
                      transaction_type: "debit",
                      payee: "Office Depot"
                    },
                  ]
                },
              }}
              accessToken={accessToken}
              onResponse={(response) =>
                handleApiResponse("sync-transactions", response)
              }
              savedResponse={apiResponses["sync-transactions"]}
            />
          </Section>

          <Section
            id="redirect"
            title="Step 5: Complete the Redirect"
            overrideButton={true}
          >
            <p className="mb-4 text-gray-900">
              Now, append the OTP you generated in Step 3 to the
              Rutter redirect URI. Take the redirect URI, and add an{" "}
              <code>&otp=</code> query parameter.
            </p>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Please provide the OTP Rutter generated from Step 3:
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
            </div>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-gray-900">
              {redirectUri}&otp={otp}
            </p>
            <br />
            <p className="mb-4 text-gray-900">
              You now have a complete redirect URI. Click the button below to
              redirect to this URL. Then, your customer can finish the bank feeds
              connection flow within Sage.
            </p>
            <button
              onClick={() => handleFinalRedirect(`${redirectUri}&otp=${otp}`)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
            >
              Complete Integration
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}
