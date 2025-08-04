import React, { useState } from "react";
import GiftTracker from "./components/GiftTracker";

type Module = "gift-tracker" | "quest-tracker";

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Module>("gift-tracker");

  const modules = [
    { id: "gift-tracker" as Module, label: "Gift Planner", icon: "🎁" },
    {
      id: "quest-tracker" as Module,
      label: "Quest Tracker",
      icon: "📜",
      disabled: true,
    },
  ];

  const handleModuleChange = (moduleId: Module) => {
    if (moduleId === "quest-tracker") return; // Disabled for now
    setActiveModule(moduleId);
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "gift-tracker":
        return <GiftTracker />;
      case "quest-tracker":
        return (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              Quest Tracker - Coming Soon!
            </p>
          </div>
        );
      default:
        return <GiftTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-900">
                <span className="text-emerald-600">Mistria</span> Tools
              </h1>
            </div>

            {/* Module Navigation */}
            <nav className="flex space-x-1">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  disabled={module.disabled}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeModule === module.id
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : module.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-current={activeModule === module.id ? "page" : undefined}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" || e.key === " ") &&
                      !module.disabled
                    ) {
                      e.preventDefault();
                      handleModuleChange(module.id);
                    }
                  }}
                >
                  <span className="mr-1">{module.icon}</span>
                  {module.label}
                  {module.disabled && (
                    <span className="ml-1 text-xs text-gray-400">(Soon)</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {renderActiveModule()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2">
          <p className="text-center text-xs text-gray-500">
            Fields of Mistria Tools
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
