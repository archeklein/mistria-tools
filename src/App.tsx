import React, { useState } from "react";
import GiftPlanner from "./components/gift-planner/GiftTracker";
import HowToUse from "./components/gift-planner/HowToUse";

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12">
            <h1 className="text-lg font-bold text-gray-900">
              <span className="text-emerald-600">Mistria</span> Gift Planner
            </h1>
            <button
              onClick={() => setShowHelp(true)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Show help information"
            >
              How to use
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <GiftPlanner />
      </main>

      {/* How to Use Modal */}
      <HowToUse isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default App;
