import React from "react";
import Avatar from "./Avatar";
import SegmentedControl from "./SegmentedControl";
import type { Item } from "../../stores/giftStore";

export interface GiftItemProp {
  name: string;
  selected: boolean;
  highlighted: boolean;
  muted: boolean;
  item: Item;
}

interface CharacterGiftsCardProps {
  icon: string;
  name: string;
  extra?: React.ReactNode;
  lovedGifts: GiftItemProp[];
  likedGifts?: GiftItemProp[];
  onClick: (item: Item) => void;
  onDoubleClick?: (item: Item) => void;
  onRightClick?: (item: Item) => void;
}

const CharacterGiftsCard: React.FC<CharacterGiftsCardProps> = ({
  icon,
  name,
  extra,
  lovedGifts,
  likedGifts,
  onClick,
  onDoubleClick,
  onRightClick,
}) => {
  // Convert GiftItemProp[] to Item[] and selected items for SegmentedControl
  const lovedGiftItems = lovedGifts.map((gift) => gift.item);
  const selectedLovedGifts = lovedGifts
    .filter((gift) => gift.selected)
    .map((gift) => gift.item);
  const highlightedLovedGifts = lovedGifts
    .filter((gift) => gift.highlighted)
    .map((gift) => gift.name);
  const mutedLovedGifts = lovedGifts
    .filter((gift) => gift.muted)
    .map((gift) => gift.name);

  const likedGiftItems = likedGifts?.map((gift) => gift.item) || [];
  const selectedLikedGifts =
    likedGifts?.filter((gift) => gift.selected).map((gift) => gift.item) || [];
  const highlightedLikedGifts =
    likedGifts?.filter((gift) => gift.highlighted).map((gift) => gift.name) ||
    [];
  const mutedLikedGifts =
    likedGifts?.filter((gift) => gift.muted).map((gift) => gift.name) || [];

  const allSelectedGifts = [...selectedLovedGifts, ...selectedLikedGifts];
  const allHighlightedGifts = [
    ...highlightedLovedGifts,
    ...highlightedLikedGifts,
  ];
  const allMutedGifts = [...mutedLovedGifts, ...mutedLikedGifts];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar character={{ name, icon }} className="w-8 h-8" />
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        </div>

        {/* Extra content (Love and Like buttons) */}
        {extra && <div className="flex gap-1">{extra}</div>}
      </div>

      {/* Loved Gifts */}
      <div>
        <SegmentedControl
          items={lovedGiftItems.sort((a, b) => a.name.localeCompare(b.name))}
          selectedItems={allSelectedGifts}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onRightClick={onRightClick}
          characterName={name}
          selectedGiftsByOthers={allHighlightedGifts}
          mutedItems={allMutedGifts}
        />
      </div>

      {/* Liked Gifts */}
      {likedGifts && likedGifts.length > 0 && (
        <div className="mt-4">
          <SegmentedControl
            items={likedGiftItems.sort((a, b) => a.name.localeCompare(b.name))}
            selectedItems={allSelectedGifts}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onRightClick={onRightClick}
            characterName={name}
            selectedGiftsByOthers={allHighlightedGifts}
            mutedItems={allMutedGifts}
          />
        </div>
      )}
    </div>
  );
};

export default CharacterGiftsCard;
