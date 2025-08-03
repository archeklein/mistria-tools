import React from "react";
import type { Item } from "../stores/giftStore";

interface SegmentedControlProps {
  items: Item[];
  selectedItem: Item | null;
  onItemSelect: (item: Item) => void;
  characterName: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  selectedItem,
  onItemSelect,
  characterName,
}) => {
  const handleItemClick = (item: Item) => {
    // Don't allow selection of items without icons (unreleased items)
    if (!item.icon) return;
    onItemSelect(item);
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {items.map((item) => {
        const isSelected = selectedItem?.name === item.name;
        const isUnreleased = !item.icon;

        return (
          <button
            key={item.name}
            onClick={() => handleItemClick(item)}
            disabled={isUnreleased}
            className={`px-1 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center gap-1 ${
              isUnreleased
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                : isSelected
                ? "bg-pink-500 text-white border-pink-500 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50"
            }`}
            tabIndex={isUnreleased ? -1 : 0}
            aria-label={`${isUnreleased ? "Unreleased item: " : "Select "}${
              item.name
            } for ${characterName}`}
            title={isUnreleased ? `${item.name} (Unreleased)` : item.name}
            onKeyDown={(e) => {
              if (!isUnreleased && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onItemSelect(item);
              }
            }}
          >
            {item.icon ? (
              <img
                src={`/src/assets/items/${item.icon}`}
                alt={item.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to question mark if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove("hidden");
                  }
                }}
              />
            ) : (
              // Question mark icon for unreleased items
              <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold text-lg">
                ?
              </div>
            )}
            {/* Hidden fallback for image load errors */}
            {item.icon && (
              <div className="hidden w-6 h-6 flex items-center justify-center text-gray-400 font-bold text-lg">
                ?
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
