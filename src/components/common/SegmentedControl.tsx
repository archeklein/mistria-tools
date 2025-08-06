import React from "react";
import type { Item } from "../../stores/giftStore";
import ItemButton from "./ItemButton";
import { getItemIcon } from "../../utils/icons";

interface SegmentedControlProps {
  items: Item[];
  selectedItems: Item[];
  onClick: (item: Item) => void;
  onDoubleClick?: (item: Item) => void;
  onRightClick?: (item: Item) => void;
  characterName: string;
  selectedGiftsByOthers?: string[];
  mutedItems?: string[];
  className?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  selectedItems,
  onClick,
  onDoubleClick,
  onRightClick,
  characterName,
  selectedGiftsByOthers = [],
  mutedItems = [],
  className,
}) => {
  const handleItemClick = (item: Item) => {
    // Don't allow selection of items without icons (unreleased items)
    if (!item.icon) return;
    onClick(item);
  };

  const handleItemDoubleClick = (item: Item) => {
    // Don't allow double click on items without icons (unreleased items)
    if (!item.icon || !onDoubleClick) return;
    onDoubleClick(item);
  };

  const handleItemRightClick = (item: Item) => {
    // Don't allow right click on items without icons (unreleased items)
    if (!item.icon || !onRightClick) return;
    onRightClick(item);
  };

  return (
    <div className={`grid grid-cols-5 mt-2 ${className}`}>
      {items.map((item) => {
        const isSelected = selectedItems.some(
          (selectedItem) => selectedItem.name === item.name
        );
        const isUnreleased = !item.icon;

        return (
          <ItemButton
            key={item.name}
            icon={item.icon ? getItemIcon(item.icon) : undefined}
            label={item.name}
            isSelected={isSelected}
            isDisabled={isUnreleased}
            isSelectedByOthers={selectedGiftsByOthers.includes(item.name)}
            isMuted={mutedItems.includes(item.name)}
            onClick={() => handleItemClick(item)}
            onDoubleClick={() => handleItemDoubleClick(item)}
            onRightClick={() => handleItemRightClick(item)}
            onKeyDown={(e) => {
              if (!isUnreleased && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onClick(item);
              }
            }}
            ariaLabel={`${isUnreleased ? "Unreleased item: " : "Select "}${
              item.name
            } for ${characterName}`}
            title={isUnreleased ? `${item.name} (Unreleased)` : item.name}
            width="w-full"
            height="h-10"
          />
        );
      })}
    </div>
  );
};

export default SegmentedControl;
