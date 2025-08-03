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
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {items.map((item) => {
        const isSelected = selectedItem?.name === item.name;
        return (
          <button
            key={item.name}
            onClick={() => onItemSelect(item)}
            className={`px-2 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center gap-1 ${
              isSelected
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
            tabIndex={0}
            aria-label={`Select ${item.name} for ${characterName}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onItemSelect(item);
              }
            }}
          >
            {item.icon && (
              <img
                src={`/src/assets/items/${item.icon}`}
                alt={item.name}
                className="w-4 h-4 object-contain"
              />
            )}
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
