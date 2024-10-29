// RutterApiCall.tsx
import React, { useState } from "react";
import { Check, Copy, Play } from "lucide-react";

interface ApiResponse {
  status: number;
  data: any;
}

interface RutterApiCallProps {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, any>;
  headers?: Record<string, string>;
  accessToken?: string;
}

const RutterApiCall: React.FC<RutterApiCallProps> = ({
  endpoint,
  method = "POST",
  body,
  headers,
  accessToken,
}) => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const requestBody = body ? JSON.stringify(body, null, 2) : null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function createRutterAuthorization() {
    const rutterCredentials = `${process.env.NEXT_PUBLIC_RUTTER_CLIENT_ID}:${process.env.NEXT_PUBLIC_RUTTER_CLIENT_SECRET}`;
    return btoa(rutterCredentials);
  }

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);
    const accessTokenParam = accessToken ? `?access_token=${accessToken}` : "";
    try {
      const res = await fetch(
        `https://api.rutter.com/versioned${endpoint}${accessTokenParam}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-Rutter-Version": "2024-08-31",
            Authorization: `Basic ${createRutterAuthorization()}`, // Set in .env file
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        }
      );

      const data = await res.json();
      setResponse({ status: res.status, data });

      if (!res.ok) {
        setError("An error occurred while making the API call.");
      }

      console.log(res);
    } catch (err) {
      setError(`An error occurred while making the API call: ${err}`);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg my-4">
      <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono px-2 py-1 rounded text-sm ${
              method === "POST"
                ? "bg-purple-100 text-purple-700"
                : method === "GET"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {method}
          </span>
          <span className="font-mono text-gray-700">{endpoint}</span>
        </div>
        <button
          onClick={handleApiCall}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
        >
          <Play className="w-4 h-4" />
          Try it
        </button>
      </div>

      {requestBody && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 font-medium">
              Request Body:
            </span>
            <button
              onClick={() => handleCopy(requestBody)}
              className="text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
            <code>{requestBody}</code>
          </pre>
        </div>
      )}

      {error && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 font-medium">
              Loading...
            </span>
          </div>
        </div>
      )}

      {response && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span
              className={
                error
                  ? "text-sm text-red-700 font-medium"
                  : "text-sm text-gray-700 font-medium"
              }
            >
              Response Status: {response.status}
            </span>
            <button
              onClick={() => handleCopy(JSON.stringify(response.data, null, 2))}
              className="text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
            <code>{JSON.stringify(response.data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default RutterApiCall;
