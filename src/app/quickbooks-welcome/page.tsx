"use client";

export default function QuickBooksWelcomePage() {
  const handleContinue = () => {
    window.location.href = "/integration-progress";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">
            Integrating with QuickBooks Online
          </h1>
          
          <p className="text-gray-700 mb-8">
            See your Rutter transactions in your QuickBooks bank feed.
          </p>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">What to expect:</h2>
            <p className="text-gray-700">
              Follow our instructions for your bank feed setup in the next step.<br />
              All setup will take place in QuickBooks.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Log into the QuickBooks account that corresponds to this Rutter account and navigate to the Link Account module.</li>
              <li>Use the search bar to find and select "Rutter."</li>
              <li>Enter your Rutter email and password to connect to your Rutter account.</li>
              <li>Select which Rutter accounts you'd like to connect to your QuickBooks bank feed and complete the setup.</li>
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
