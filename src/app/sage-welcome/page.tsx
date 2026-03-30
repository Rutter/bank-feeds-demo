"use client";

export default function SageWelcomePage() {
  const handleContinue = () => {
    window.location.href = "/sage-integration";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">
            Integrating with Sage
          </h1>
          
          <p className="text-gray-700 mb-8">
            See your Rutter transactions in your Sage bank feed.
          </p>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">What to expect:</h2>
            <p className="text-gray-700">
              Follow our instructions for your bank feed setup in the next step.<br />
              All setup will take place in Sage.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Log into the Sage account that corresponds to this Rutter account and navigate to Cash Management → Accounts and the type of account.</li>
              <li>Click the type of account and either edit or create a new account.</li>
              <li>Click into account and click the Banking Cloud tab.</li>
              <li>Enter your Rutter email and password to connect to your Rutter account.</li>
              <li>Select which Rutter accounts you'd like to connect to your Sage bank feed and complete the mapping.</li>
              <li>Once finished, return to Rutter and confirm you've connected.</li>
            </ol>
          </div>

          <button
            onClick={handleContinue}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
