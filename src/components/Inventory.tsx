import React from "react";
import { useGiftStore } from "../stores/giftStore";

const Inventory: React.FC = () => {
  const { giftSelections } = useGiftStore();

  if (giftSelections.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
          🎒 Inventory
        </h3>
        <p className="text-gray-500 text-center py-4 text-sm">
          Select gifts for characters to see your inventory here.
        </p>
      </div>
    );
  }

  // Group gifts by item name and count how many characters need each gift
  const giftSummary = giftSelections.reduce((acc, selection) => {
    const giftName = selection.gift.name;
    if (!acc[giftName]) {
      acc[giftName] = {
        count: 0,
        characters: [],
        item: selection.gift,
      };
    }
    acc[giftName].count += 1;
    acc[giftName].characters.push(selection.characterName);
    return acc;
  }, {} as Record<string, { count: number; characters: string[]; item: any }>);

  const sortedGifts = Object.entries(giftSummary).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          🎒 Inventory
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {sortedGifts.map(([giftName, data]) => (
          <div
            key={giftName}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
          >
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {data.item.icon && (
                  <img
                    src={`/src/assets/items/${data.item.icon}`}
                    alt={giftName}
                    className="w-4 h-4 object-contain"
                  />
                )}
                <div className="text-sm font-medium text-gray-800">
                  {giftName}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                for {data.characters.join(", ")}
              </div>
            </div>
            {data.count > 1 && (
              <div className="ml-1 px-1 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                ×{data.count}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
