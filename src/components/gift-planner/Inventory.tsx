import React, { useState } from "react";
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
  const {
    giftSelections,
    characters,
    clearAllGiftSelections,
    selectGift,
    trackGift,
    getItem,
  } = useGiftStore();

  // State for confirmation tooltip
  const [confirmationState, setConfirmationState] = useState<{
    show: boolean;
    characterName: string;
    giftName: string;
    position: { x: number; y: number };
    originalX: number; // Store original avatar x position for arrow positioning
  } | null>(null);

  // Helper function to get character data
  const getCharacter = (characterName: string) => {
    return characters.find((char) => char.name === characterName);
  };

  // Handle avatar click to show confirmation
  const handleAvatarClick = (
    event: React.MouseEvent,
    characterName: string,
    giftName: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 192; // min-w-48 = 12rem = 192px
    const windowWidth = window.innerWidth;
    const margin = 16; // Add some margin from screen edge

    // Calculate optimal x position
    let x = rect.left + rect.width / 2;

    // Check if tooltip would overflow on the right
    if (x + tooltipWidth / 2 > windowWidth - margin) {
      x = windowWidth - tooltipWidth / 2 - margin;
    }

    // Check if tooltip would overflow on the left
    if (x - tooltipWidth / 2 < margin) {
      x = tooltipWidth / 2 + margin;
    }

    setConfirmationState({
      show: true,
      characterName,
      giftName,
      position: {
        x,
        y: rect.top - 10,
      },
      originalX: rect.left + rect.width / 2, // Store original avatar center position
    });
  };

  // Handle gift confirmation
  const handleConfirmGift = () => {
    if (!confirmationState) return;

    const { characterName, giftName } = confirmationState;
    const item = getItem(giftName);

    if (item) {
      // Deselect the gift (this will remove it from inventory)
      selectGift(characterName, item);
      // Track the gift as given
      trackGift(characterName, giftName);
    }

    setConfirmationState(null);
  };

  // Handle canceling the confirmation
  const handleCancelGift = () => {
    setConfirmationState(null);
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
                  <div
                    key={characterName}
                    onClick={(e) =>
                      handleAvatarClick(e, characterName, giftName)
                    }
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    title={`Click to give ${giftName} to ${characterName}`}
                  >
                    <Avatar
                      character={character || characterName}
                      className="w-6 h-6 rounded-full flex-shrink-0 ring-2 ring-transparent hover:ring-pink-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {showContainer ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
          {inventoryContent}
        </div>
      ) : (
        <div>{inventoryContent}</div>
      )}

      {/* Confirmation Tooltip */}
      {confirmationState && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={handleCancelGift} />

          {/* Tooltip */}
          <div
            className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-48"
            style={{
              left: `${confirmationState.position.x}px`,
              top: `${confirmationState.position.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="text-sm font-medium text-gray-800 mb-2 text-center">
              Give {confirmationState.giftName} to{" "}
              {confirmationState.characterName}?
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleConfirmGift}
                className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                Yes
              </button>
              <button
                onClick={handleCancelGift}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                No
              </button>
            </div>

            {/* Arrow pointing down - positioned to point at original avatar */}
            <div
              className="absolute top-full transform -translate-x-1/2"
              style={{
                left: `${Math.max(
                  16,
                  Math.min(
                    176,
                    confirmationState.originalX -
                      confirmationState.position.x +
                      96
                  )
                )}px`, // Clamp arrow position within tooltip bounds
              }}
            >
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Inventory;
