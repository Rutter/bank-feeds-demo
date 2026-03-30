"use client";

interface SoftwareOption {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const softwareOptions: SoftwareOption[] = [
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync bank feed",
    logo: (
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">qb</span>
      </div>
    ),
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    id: "xero",
    name: "Xero",
    description: "Sync bank feed",
    logo: (
      <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
        <span className="text-white font-semibold text-sm">xero</span>
      </div>
    ),
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    id: "netsuite",
    name: "Netsuite",
    description: "Sync bank feed",
    logo: (
      <div className="w-16 h-16 bg-gray-800 rounded-full flex flex-col items-center justify-center p-2">
        <div className="text-white text-xs font-bold leading-tight">
          <div>ORACLE</div>
          <div className="text-sm">NETSUITE</div>
        </div>
      </div>
    ),
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    id: "sage",
    name: "Sage",
    description: "Sync bank feed",
    logo: (
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">S</span>
      </div>
    ),
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
];

export default function AccountingSoftwareLanding() {
  const handleSoftwareSelect = (softwareId: string) => {
    if (softwareId === "quickbooks") {
      window.location.href = "/quickbooks-welcome";
    } else if (softwareId === "netsuite") {
      // Open Rutter Link in new tab immediately
      window.open("https://link.rutterapi.com/connection/416231ee-2246-4251-8110-d62d3f4ede51", "_blank");
      // Then navigate to integration page
      window.location.href = "/netsuite-integration";
    } else if (softwareId === "xero") {
      // Open Rutter Link in new tab immediately
      window.open("https://link.rutterapi.com/connection/19aa3cb6-cbf5-4b2e-9c98-1eea39e1b656", "_blank");
      // Then navigate to integration page
      window.location.href = "/xero-integration";
    } else if (softwareId === "sage") {
      window.location.href = "/sage-welcome";
    } else {
      alert(`${softwareOptions.find(s => s.id === softwareId)?.name} integration is coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-2 gap-8">
          {softwareOptions.map((software) => (
            <div
              key={software.id}
              className={`${software.bgColor} ${software.textColor} rounded-2xl p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center h-48`}
              onClick={() => handleSoftwareSelect(software.id)}
            >
              {software.logo}
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{software.name}</h3>
                <p className="text-sm text-gray-600">{software.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
