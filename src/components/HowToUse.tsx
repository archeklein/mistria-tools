import React from "react";

interface HowToUseProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToUse: React.FC<HowToUseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              How to Use the Gift Planner
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close help modal"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Purpose</h4>
              <p>
                Plan your daily gifting run by selecting one gift for each
                character. This helps you see exactly what items you need to
                collect and who they're for.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                💝 Selecting Gifts
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Click the <strong>lovable dish icon</strong> for universal
                  loved dishes (works for any character)
                </li>
                <li>
                  Click the <strong>likeable dish icon</strong> for universal
                  liked dishes (when "Show Liked" is enabled)
                </li>
                <li>
                  Click any <strong>specific item</strong> from the gift grid to
                  select it for that character
                </li>
                <li>
                  Selected gifts appear <strong>highlighted in pink</strong>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎒 Inventory</h4>
              <p>
                The inventory on the right shows all items you need to collect,
                with quantities and which characters they're for. Use "Clear
                All" to start over.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🔍 Filters</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Category:</strong> Filter characters by their category
                  (Townspeople, etc.)
                </li>
                <li>
                  <strong>Show Liked:</strong> Toggle to show/hide liked gifts
                  (in addition to loved gifts)
                </li>
                <li>
                  <strong>Sort by:</strong> Change the order of character cards
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">💡 Tips</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Items with a <strong>green border</strong> are already
                  selected for other characters
                </li>
                <li>
                  Universal dishes are great when you want to cook in bulk
                </li>
                <li>Use the filters to focus on specific character groups</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                📱 Mobile Features
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Use the <strong>⚙️ icon</strong> to access filters on mobile
                  devices
                </li>
                <li>
                  Use the <strong>🎒 icon</strong> to view your inventory on
                  mobile devices
                </li>
                <li>
                  The number badge on the inventory icon shows how many items
                  you've selected
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
