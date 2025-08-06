import React from "react";
import { useGiftStore } from "../../stores/giftStore";
import Avatar from "../common/Avatar";
import { getItemIcon } from "../../utils/icons";

interface InventoryProps {
  showHeader?: boolean;
  showContainer?: boolean;
  showClearButton?: boolean;
}

const Inventory: React.FC<InventoryProps> = ({
  showHeader = true,
  showContainer = true,
  showClearButton = true,
}) => {
  const { giftSelections, characters, clearAllGiftSelections } = useGiftStore();

  // Helper function to get character data
  const getCharacter = (characterName: string) => {
    return characters.find((char) => char.name === characterName);
  };

  if (giftSelections.length === 0) {
    const emptyContent = (
      <>
        {showHeader && (
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
            🎒 Inventory
          </h3>
        )}
        <p className="text-gray-500 text-center py-4 text-sm">
          Select gifts for characters to see your inventory here.
        </p>
      </>
    );

    return showContainer ? (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        {emptyContent}
      </div>
    ) : (
      <div>{emptyContent}</div>
    );
  }

  // Group gifts by item name and collect characters for each gift
  const giftSummary = giftSelections.reduce((acc, selection) => {
    // Handle both old and new data formats
    const gifts = selection.gifts || [(selection as any).gift].filter(Boolean);

    gifts.forEach((gift) => {
      const giftName = gift.name;
      if (!acc[giftName]) {
        acc[giftName] = {
          count: 0,
          characters: [],
          item: gift,
        };
      }
      acc[giftName].count += 1;
      acc[giftName].characters.push(selection.characterName);
    });
    return acc;
  }, {} as Record<string, { count: number; characters: string[]; item: any }>);

  const sortedGifts = Object.entries(giftSummary).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const inventoryContent = (
    <>
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            🎒 Inventory
          </h3>
          <button
            onClick={clearAllGiftSelections}
            className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
            title="Clear all gift selections"
          >
            Clear All
          </button>
        </div>
      )}

      {!showHeader && showClearButton && (
        <div className="flex justify-end mb-3">
          <button
            onClick={clearAllGiftSelections}
            className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
            title="Clear all gift selections"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {sortedGifts.map(([giftName, data]) => (
          <div
            key={giftName}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            {/* Left side: Count, Gift Image, Gift Name */}
            <div className="flex items-center gap-3">
              {/* Count */}
              <div className="text-sm font-bold text-gray-800 flex-shrink-0">
                {data.count} ×
              </div>

              {/* Gift Image */}
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                {data.item.icon ? (
                  <img
                    src={getItemIcon(data.item.icon)}
                    alt={giftName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-lg font-bold text-gray-400">?</div>
                )}
              </div>

              {/* Gift Name */}
              <div className="text-sm font-medium text-gray-800">
                {giftName}
              </div>
            </div>

            {/* Right side: Character Images */}
            <div className="flex items-center gap-2 flex-wrap justify-end max-w-48">
              {data.characters.map((characterName) => {
                const character = getCharacter(characterName);
                return (
                  <Avatar
                    key={characterName}
                    character={character || characterName}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return showContainer ? (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
      {inventoryContent}
    </div>
  ) : (
    <div>{inventoryContent}</div>
  );
};

export default Inventory;
