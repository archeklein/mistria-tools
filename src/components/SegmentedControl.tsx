import React from "react";
import type { Item } from "../stores/giftStore";
import ItemButton from "./ItemButton";

interface SegmentedControlProps {
  items: Item[];
  selectedItem: Item | null;
  onItemSelect: (item: Item) => void;
  characterName: string;
  selectedGiftsByOthers?: string[];
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  selectedItem,
  onItemSelect,
  characterName,
  selectedGiftsByOthers = [],
}) => {
  const handleItemClick = (item: Item) => {
    // Don't allow selection of items without icons (unreleased items)
    if (!item.icon) return;
    onItemSelect(item);
  };

  const totalItems = items.length;
  const columns = 5;

  return (
    <div className="grid grid-cols-5 mt-2">
      {items.map((item, index) => {
        const isSelected = selectedItem?.name === item.name;
        const isUnreleased = !item.icon;

        // Calculate position for rounded corners
        const row = Math.floor(index / columns);
        const col = index % columns;
        const totalRows = Math.ceil(totalItems / columns);
        const isFirstRow = row === 0;
        const isLastRow = row === totalRows - 1;
        const isFirstCol = col === 0;
        const isLastCol = col === columns - 1;

        return (
          <ItemButton
            key={item.name}
            icon={item.icon ? `/src/assets/items/${item.icon}` : undefined}
            label={item.name}
            isSelected={isSelected}
            isDisabled={isUnreleased}
            isSelectedByOthers={selectedGiftsByOthers.includes(item.name)}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => {
              if (!isUnreleased && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onItemSelect(item);
              }
            }}
            ariaLabel={`${isUnreleased ? "Unreleased item: " : "Select "}${
              item.name
            } for ${characterName}`}
            title={isUnreleased ? `${item.name} (Unreleased)` : item.name}
            isFirstRow={isFirstRow}
            isLastRow={isLastRow}
            isFirstCol={isFirstCol}
            isLastCol={isLastCol}
            width="w-full"
            height="h-10"
          />
        );
      })}
    </div>
  );
};

export default SegmentedControl;
