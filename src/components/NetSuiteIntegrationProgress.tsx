"use client";

import { useState, useEffect, useId } from "react";
import { Check, ChevronDown, CircleDashed, ExternalLink } from "lucide-react";
import RutterApiCall from "./RutterApiCall";

interface ApiResponse {
  status: number;
  data: any;
}

interface ApiResponses {
  [key: string]: ApiResponse | null;
}

export default function NetSuiteIntegrationProgress() {
  const [openSection, setOpenSection] = useState("create-connection");
  const [accessToken, setAccessToken] = useState("");
  const [bankFeedAccountId, setBankFeedAccountId] = useState("");
  const [mappingLink, setMappingLink] = useState("");
  // Add state for API responses
  const [apiResponses, setApiResponses] = useState<ApiResponses>({
    "create-connection": null,
    "list-accounts": null,
    "create-account": null,
    "account-mapping": null,
    "sync-transactions": null,
  });

  const steps = {
    "create-connection": false,
    "list-accounts": false,
    "create-account": false,
    "account-mapping": false,
    "sync-transactions": false,
  };

  const [completedSteps, setCompletedSteps] = useState(steps);

  const id = useId();

  const handleApiResponse = (sectionId: string, response: ApiResponse) => {
    setApiResponses((prev) => ({
      ...prev,
      [sectionId]: response,
    }));
  };

  const handleContinue = (currentStepKey: string) => {
    // Special handling for create-connection - open Rutter Link in new tab
    if (currentStepKey === "create-connection") {
      window.open("https://link.rutterapi.com/connection/416231ee-2246-4251-8110-d62d3f4ede51", "_blank");
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
              className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-700"
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
            NetSuite Bank Feed Integration Progress
          </h1>
          <p className="text-gray-600 mb-8">
            Follow the steps below to set up Bank Feeds for your NetSuite instance. 
            This will create a Financial Institution and sync bank transaction data.
          </p>

          <Section
            id="create-connection"
            title="Step 1: Create a Rutter Connection"
          >
            <p className="mb-4 text-gray-900">
              First, create a Rutter connection to your NetSuite instance. This connection 
              represents the business accounting system and contains an <code>access_token</code> 
              used to read and write data for that instance.
            </p>
            <p className="mb-4 text-gray-900">
              <strong>Prerequisites:</strong> Ensure your NetSuite instance has the "AccountLink" 
              bundle updated to at least Version 26. Rutter will configure the required resources 
              programmatically after the connection is established.
            </p>
            <RutterApiCall
              endpoint="/connections/create"
              method="POST"
              body={{
                platform: "NETSUITE",
              }}
              onResponse={(response) => {
                handleApiResponse("create-connection", response);
                // Auto-populate access token from response
                if (response.data?.connection?.access_token) {
                  setAccessToken(response.data.connection.access_token);
                }
              }}
              savedResponse={apiResponses["create-connection"]}
              mockResponse={{
                status: 200,
                data: {
                  connection: {
                    id: "416231ee-2246-4251-8110-d62d3f4ede51",
                    name: null,
                    access_token: "553d27d7-245a-4133-ab73-baf9aa59c5be",
                    link_url: "https://link.rutterapi.com/connection/416231ee-2246-4251-8110-d62d3f4ede51"
                  }
                }
              }}
            />
          </Section>

          <Section
            id="list-accounts"
            title="Step 2: List Existing Accounts (Optional)"
          >
            <p className="mb-4 text-gray-900">
              <strong>Note:</strong> This step is optional if you plan to use the Account Mapping UI in Step 4. 
              If you want to create a Bank Feed for an existing GL account, you can find the <code>id </code> 
              of the account through the GET /accounts API endpoint and pass it into the <code>account_id </code> 
              input field in the next step.
            </p>
            <p className="mb-4 text-gray-900">
              If you omit the <code>account_id</code> field when creating the Bank Feed Account, 
              you must use the Account Mapping UI in Step 4 to map bank accounts to a GL account. 
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
                  focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter access_token here"
              />
            </div>
            <RutterApiCall
              endpoint="/accounting/accounts?limit=5"
              method="GET"
              accessToken={accessToken}
              onResponse={(response) => handleApiResponse("list-accounts", response)}
              savedResponse={apiResponses["list-accounts"]}
            />
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Optional Step:</strong> You can skip this step if you plan to use the Account Mapping UI 
                in Step 4, which will allow you to select and create accounts through Rutter's hosted interface.
              </p>
            </div>
          </Section>

          <Section
            id="create-account"
            title="Step 3: Create Bank Feed Account"
          >
            <p className="mb-4 text-gray-900">
              Create a Bank Feed Account in your NetSuite instance. This accomplishes two things:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-900 space-y-2">
              <li>A new Financial Institution is created in NetSuite with your organization's name</li>
              <li>A connection is established between the Financial Institution bank account and the specified GL account in NetSuite</li>
            </ul>
            <p className="mb-4 text-gray-900">
              Use the <code>account_id</code> from the previous step's response, or create a new GL account if needed.
            </p>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/accounts"
              method="POST"
              body={{
                bank_feed_account: {
                  //account_id: "4891fec0-3391-4ab5-9cea-69843beb1f84",
                  internal_bank_account_id: "0674111024489",
                  parent_bank_feed_account_id: "00000000-0000-0000-0000-000000000000",
                  transaction_start_date: "2023-02-02T00:00:00.000Z",
                  bank_account_type: "bank",
                  currency_code: "USD",
                  name: "billllllllllll Testing Account",
                  available_balance: 1000000,
                  bank_account_number: "182237392",
                  current_balance: 1800,
                  line_of_business: "small business",
                  routing_number: "123456789",
                  additional_fields: {
                    override_existing: true
                  }
                },
              }}
              accessToken={accessToken}
              onResponse={(response) => {
                handleApiResponse("create-account", response);
                // Auto-populate bank feed account ID from response
                if (response.data?.bank_feed_account?.id) {
                  setBankFeedAccountId(response.data.bank_feed_account.id);
                }
              }}
              savedResponse={apiResponses["create-account"]}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The <code>feed_status</code> field will be <code>inactive</code> initially. 
                Once the first set of transactions has been synced, the bank feed account will be activated 
                in NetSuite and the <code>feed_status</code> field will be set to <code>active</code>.
              </p>
            </div>
          </Section>

          <Section
            id="account-mapping"
            title="Step 4: Account Mapping"
          >
            <p className="mb-4 text-gray-900">
              Rutter offers pre-built UI components to assist your customers in mapping their bank or card accounts to their GL accounts.
            </p>
            <p className="mb-4 text-gray-900">
              Use the mapping link API to generate a secure link that provides your customers with an intuitive interface for selecting an account, mapping it back to a general ledger, and configuring a date range to pull transactions from.
            </p>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Please provide the bank feed account ID from the previous step:
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
                  focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter bank feed account ID here"
              />
            </div>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/accounts/mapping_link"
              method="POST"
              body={{
                bank_feed_account_id: bankFeedAccountId,
              }}
              accessToken={accessToken}
              onResponse={(response) => {
                handleApiResponse("account-mapping", response);
                if (response.data?.bank_feed_account_mapping_link?.url) {
                  setMappingLink(response.data.bank_feed_account_mapping_link.url);
                }
              }}
              savedResponse={apiResponses["account-mapping"]}
            />
            {mappingLink && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 mb-2">
                  <strong>Mapping Link Generated:</strong>
                </p>
                <a
                  href={mappingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Open Mapping Interface
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-xs text-green-700 mt-2">
                  This link is valid for 10 minutes. Your customers will be redirected back to your application with the mapping details once completed.
                </p>
              </div>
            )}
          </Section>

          <Section
            id="sync-transactions"
            title="Step 5: Sync Bank Feed Transactions"
            overrideButton={true}
          >
            <p className="mb-4 text-gray-900">
              Sync transaction data for the Bank Feed Account. NetSuite will automatically run a sync 
              for the latest transactions for every active Bank Feed Account every 24 hours, or users 
              can manually trigger a sync by clicking "Update Imported Bank Data" in the "Match Bank Data" tab.
            </p>
            <p className="mb-4 text-gray-900">
              <strong>Transaction Syncing Rules:</strong>
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-900 space-y-1 text-sm">
              <li>Only sync transactions that have been marked as posted by the Financial Institution</li>
              <li>transaction_id's within a list must be unique, otherwise the input will be rejected</li>
              <li>You must provide at least one transaction per sync request, and at max 1000</li>
              <li>We suggest syncing transactions every 24 hours</li>
            </ul>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/transactions"
              method="POST"
              body={{
                bank_feed_transactions: {
                  bank_feed_account_id: bankFeedAccountId,
                  transactions: [
                    {
                      transaction_id: "ACRAF43DB4C5",
                      posted_at: "2025-02-02T02:34:56.000Z",
                      amount: 300,
                      description: "Linda's Office supplies",
                      transaction_type: "debit",
                      payee: "Office Depot"
                    }
                  ]
                },
              }}
              accessToken={accessToken}
              onResponse={(response) =>
                handleApiResponse("sync-transactions", response)
              }
              savedResponse={apiResponses["sync-transactions"]}
            />
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Next Steps in NetSuite:</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Transactions will appear in the "Match Bank Data" tab for reconciliation</li>
                <li>• Set up Banking Import History view to monitor ingestions</li>
                <li>• Use the reconciliation process to match bank transactions with accounting transactions</li>
              </ul>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}


