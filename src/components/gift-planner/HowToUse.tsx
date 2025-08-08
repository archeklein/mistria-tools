import React from "react";

interface HowToUseProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToUse: React.FC<HowToUseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 md:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white md:rounded-xl shadow-xl md:max-w-2xl w-full md:max-h-[80vh] h-full md:h-auto flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white md:rounded-t-xl border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-gray-800">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 mt-2 mb-2">
                🎯 Purpose
              </h4>
              <p>
                Plan your daily gifting run by selecting one gift for each
                character and track your progress. This helps you see exactly
                what items you need to collect, who they're for, and which gifts
                you've already given.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                🎮 Interactions
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                        Action
                      </th>
                      <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                        Desktop
                      </th>
                      <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                        Mobile
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-2 font-medium">
                        Select/Deselect Gift
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Click
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Tap
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 font-medium">
                        Track Gift (Mute)
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Right-click
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Long tap or double-tap
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-2 font-medium">
                        Search Characters/Gifts
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Type in search field
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Type in search field
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 font-medium">
                        Access Filters
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Always visible
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Tap ⚙️ icon
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-2 font-medium">
                        View Inventory
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Always visible
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Tap 🎒 icon
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 font-medium">
                        See Gift Name
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Hover over gift
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        Tap and hold gift
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                💝 Gift Selection
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Each character can have{" "}
                  <strong>only one gift selected</strong> at a time
                </li>
                <li>
                  Selected gifts have a <strong>green border and badge</strong>
                </li>
                <li>Click/tap a selected gift to deselect it</li>
                <li>
                  Universal gifts (lovable/likeable dishes) work for any
                  character
                </li>
                <li>
                  Gifts selected for other characters are{" "}
                  <strong>highlighted</strong> to help avoid duplicates
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                📝 Gift Tracking
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Right-click (desktop) or double-tap (mobile) gifts to mark
                  them as <strong>tracked</strong> (given/found)
                </li>
                <li>
                  Tracked gifts appear <strong>muted (low opacity)</strong> when
                  "Show Tracked" is on
                </li>
                <li>
                  Toggle "Show Tracked" off to see all gifts at full opacity
                </li>
                <li>
                  Tracking helps you remember which gifts you've already given
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                🔍 Search & Filters
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Search:</strong> Type to find characters by name or
                  gifts they like
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1 text-xs">
                    <li>
                      Search by character name: shows that character with all
                      their gifts
                    </li>
                    <li>
                      Search by gift name: shows all characters who like that
                      gift
                    </li>
                    <li>
                      Mixed results: characters with matching names show all
                      gifts, others show only matching gifts
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Category:</strong> Filter by character type
                  (Townspeople, etc.)
                </li>
                <li>
                  <strong>Show Liked:</strong> Toggle liked gifts visibility
                </li>
                <li>
                  <strong>Show Tracked:</strong> Toggle tracked gift opacity
                </li>
                <li>
                  <strong>Sort by:</strong> Change character card order
                </li>
                <li>
                  <strong>Show Spoilers:</strong> Spoiler content (unreleased or
                  unlockable characters) is hidden by default
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎒 Inventory</h4>
              <p>
                Shows all selected items with quantities and recipients. Use
                "Clear All" to reset all selections. On mobile, access via the
                🎒 icon with a badge showing your selection count.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">💡 Tips</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Plan your route by selecting one gift per character first
                </li>
                <li>
                  Use search to find characters who like specific items you have
                </li>
                <li>
                  Universal dishes are efficient for bulk cooking strategies
                </li>
                <li>Track gifts as you give them to avoid double-gifting</li>
                <li>
                  Highlighted gifts show overlap - useful for planning
                  alternatives
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
