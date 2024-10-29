import { useState } from "react";
import { Check, Copy, Play } from "lucide-react";

const MockApiCall = ({ endpoint, method, body, mockResponse }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requestBody = body ? JSON.stringify(body, null, 2) : null;

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
          onClick={() => setShowResponse(!showResponse)}
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

      {showResponse && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 font-medium">Response:</span>
            <button
              onClick={() => handleCopy(JSON.stringify(mockResponse, null, 2))}
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
            <code>{JSON.stringify(mockResponse, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default MockApiCall;
