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

export default function XeroIntegrationProgress() {
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
    "delete-account": null,
  });

  const steps = {
    "create-connection": false,
    "list-accounts": false,
    "create-account": false,
    "account-mapping": false,
    "sync-transactions": false,
    "delete-account": false,
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
      window.open("https://link.rutterapi.com/connection/19aa3cb6-cbf5-4b2e-9c98-1eea39e1b656", "_blank");
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
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
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
            Xero Bank Feed Integration Progress
          </h1>
          <p className="text-gray-600 mb-8">
            Follow the steps below to set up Bank Feeds for your Xero instance. 
            No accountant action is required within Xero, only your interaction with Rutter's API.
          </p>

          <Section
            id="create-connection"
            title="Step 1: Create a Rutter Connection"
          >
            <p className="mb-4 text-gray-900">
              First, create a Rutter connection to your Xero instance. This connection 
              represents the business accounting system and contains an <code>access_token</code> 
              used to read and write data for that instance.
            </p>
            <RutterApiCall
              endpoint="/connections/create"
              method="POST"
              body={{
                platform: "XERO",
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
                    id: "19aa3cb6-cbf5-4b2e-9c98-1eea39e1b656",
                    name: null,
                    access_token: "de382dac-1ac8-452e-a849-d18d2f715446",
                    link_url: "https://link.rutterapi.com/connection/19aa3cb6-cbf5-4b2e-9c98-1eea39e1b656"
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
              If you omit the <code>account_id </code> field when creating the Bank Feed Account, 
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
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              Use Rutter's POST /bank_feeds/accounts API endpoint to set up Bank Feeds within Xero. 
              No accountant action is required within Xero, only your interaction with Rutter's API.
            </p>
            <p className="mb-4 text-gray-900">
              <strong>Bank Feed Account Creation Rules:</strong>
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-900 space-y-1 text-sm">
              <li>Only one Bank Feed Account can be created per GL account</li>
              <li>If you provide an account_id field, ensure the type of this GL account matches the bank_account_type field</li>
              <li>If you omit the account_id field, a new Xero GL account will be created automatically</li>
            </ul>
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
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter access_token here"
              />
            </div>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/accounts"
              method="POST"
              body={{
                bank_feed_account: {
                  //account_id: "00000000-0000-0000-0000-000000000000",
                  internal_bank_account_id: "0123458992",
                  bank_account_number: "0123458782",
                  bank_account_type: "bank",
                  currency_code: "USD",
                  name: "alexander's Bank Account",
                  additional_fields: {
                    skip_account_link: true
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
                <strong>Note:</strong> The bank feed account will be created in Xero and can be used 
                for syncing bank transaction data.
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
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
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
            title="Step 5: Sync Transaction Data"
            overrideButton={true}
          >
            <p className="mb-4 text-gray-900">
              Transactions can start being synced as soon as the bank feed account is created. 
              To sync transaction data for a Bank Feed Account, use POST /bank_feeds/transactions API. 
              We suggest syncing transactions in real time, once they've posted to the account.
            </p>
            <p className="mb-4 text-gray-900">
              <strong>Transaction Syncing Rules:</strong>
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-900 space-y-1 text-sm">
              <li>You must provide at least one transaction per sync request</li>
              <li>Only posted transactions should be submitted</li>
              <li>Each transaction must have a unique identifier (transaction_id)</li>
              <li>current_balance field is required</li>
              <li>debit_credit_memo field is required</li>
            </ul>
            <RutterApiCall
              endpoint="/accounting/bank_feeds/transactions"
              method="POST"
              body={{
                bank_feed_transactions: {
                  bank_feed_account_id: bankFeedAccountId,
                  current_balance: 1234.56,
                  transactions: [
                    {
                      transaction_id: "ACRAF45DB5C9",
                      posted_at: "2025-02-02T02:34:56.000Z",
                      transaction_date: "2025-02-02T02:34:56.000Z",
                      amount: 500,
                      description: "Linda's Office supplies",
                      transaction_type: "debit",
                      debit_credit_memo: "DEBIT",
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
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Reconciliation with Xero:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Go to "Accounting" → "Bank Accounts" in Xero</li>
                <li>• Select the account you have synced transactions to</li>
                <li>• Click on the "Bank Statements" tab to see synced transactions</li>
                <li>• Perform reconciliation with these transactions</li>
              </ul>
            </div>
          </Section>

          <Section
            id="delete-account"
            title="Step 6: Delete Bank Feed Account"
            overrideButton={true}
          >
            <p className="mb-4 text-gray-900">
              If a Xero user would like their Bank Feed Account connection to be deleted, you can do so through 
              Rutter's DELETE /bank_feeds/accounts API. It's not possible to recover a Bank Feed Account once it's been deleted.
            </p>
            <p className="mb-4 text-gray-900">
              <strong>What happens when you call the DELETE endpoint:</strong>
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-900 space-y-1 text-sm">
              <li>Removes the bank feed account entity in Rutter</li>
              <li>Removes the "feed" in Xero (end user will no longer receive transaction updates)</li>
              <li>Does NOT remove the GL account linked to the bank feed in Xero</li>
            </ul>
            <div className="mb-6">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Bank Feed Account ID (from Step 3):
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
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter bank feed account ID here"
              />
            </div>
            <RutterApiCall
              endpoint={`/accounting/bank_feeds/accounts/${bankFeedAccountId}`}
              method="DELETE"
              accessToken={accessToken}
              onResponse={(response) => handleApiResponse("delete-account", response)}
              savedResponse={apiResponses["delete-account"]}
            />
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. The bank feed account will be permanently 
                deleted from both Rutter and Xero, and the user will no longer receive transaction updates.
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
