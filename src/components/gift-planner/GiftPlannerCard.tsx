import React from "react";
import {
  useGiftStore,
  type Character,
  type Item,
} from "../../stores/giftStore";
import CharacterGiftsCard, {
  type GiftItemProp,
} from "../common/CharacterGiftsCard";
import ItemButton from "../common/ItemButton";
import { getItemIcon } from "../../utils/icons";

interface GiftPlannerCardProps {
  character: Character;
  showLikedGifts: boolean;
}

const GiftPlannerCard: React.FC<GiftPlannerCardProps> = ({
  character,
  showLikedGifts,
}) => {
  const {
    selectGift,
    getSelectedGifts,
    getItem,
    giftSelections,
    trackGift,
    untrackGift,
    isGiftTracked,
    searchQuery,
    showTrackedGifts,
    getMatchingGifts,
  } = useGiftStore();
  const selectedGifts = getSelectedGifts(character.name);

  // Convert string gift names to Item objects
  const lovedGiftItems = character.loved_gifts
    .map((giftName) => getItem(giftName))
    .filter((item): item is Item => item !== undefined);

  const likedGiftItems = character.liked_gifts
    .map((giftName) => getItem(giftName))
    .filter((item): item is Item => item !== undefined);

  // Create universal dish items
  const universalLovedDish: Item = {
    name: "Lovable Dish",
    icon: "Infusion_icon_cook_lovable.webp",
  };

  const universalLikedDish: Item = {
    name: "Likeable Dish",
    icon: "Infusion_icon_cook_likeable.webp",
  };

  // Get gifts selected by other characters (excluding universal gifts)
  const universalGiftNames = ["Lovable Dish", "Likeable Dish"];
  const selectedGiftsByOthers = giftSelections
    .filter((selection) => selection.characterName !== character.name)
    .flatMap((selection) => {
      // Handle both old and new data formats
      if (selection.gifts) {
        return selection.gifts
          .filter((gift) => !universalGiftNames.includes(gift.name))
          .map((gift) => gift.name);
      }
      // Fallback for old data format
      const oldSelection = selection as any;
      if (
        oldSelection.gift &&
        !universalGiftNames.includes(oldSelection.gift.name)
      ) {
        return [oldSelection.gift.name];
      }
      return [];
    });

  const handleGiftSelect = (gift: Item) => {
    selectGift(character.name, gift);
  };

  const handleRightClick = (gift: Item) => {
    // Right-click (desktop) to track/untrack gifts
    if (isGiftTracked(character.name, gift.name)) {
      untrackGift(character.name, gift.name);
    } else {
      trackGift(character.name, gift.name);
    }
  };

  const handleDoubleClick = (gift: Item) => {
    // Double-tap (mobile) to track/untrack gifts
    if (isGiftTracked(character.name, gift.name)) {
      untrackGift(character.name, gift.name);
    } else {
      trackGift(character.name, gift.name);
    }
  };

  // Get matching gifts based on new search logic
  const matchingGifts = getMatchingGifts(character);

  // Filter gifts based on search query logic
  const filteredLovedGifts = lovedGiftItems.filter((item) => {
    // If no search query, show all gifts
    if (!searchQuery.trim()) return true;

    // If there are matching gifts from getMatchingGifts, only show those
    if (matchingGifts.length > 0) {
      return matchingGifts.includes(item.name);
    }

    // Fallback (shouldn't happen with new logic)
    return false;
  });

  const filteredLikedGifts = likedGiftItems.filter((item) => {
    // If no search query, show all gifts
    if (!searchQuery.trim()) return true;

    // If there are matching gifts from getMatchingGifts, only show those
    if (matchingGifts.length > 0) {
      return matchingGifts.includes(item.name);
    }

    // Fallback (shouldn't happen with new logic)
    return false;
  });

  // Check if character has any gift selected
  const hasGiftSelected = selectedGifts.length > 0;

  // Transform data for CharacterGiftsCard props
  const lovedGiftsProps: GiftItemProp[] = filteredLovedGifts.map((item) => ({
    name: item.name,
    selected: selectedGifts.some((gift) => gift.name === item.name),
    highlighted: !hasGiftSelected && selectedGiftsByOthers.includes(item.name),
    muted: showTrackedGifts && isGiftTracked(character.name, item.name),
    item,
  }));

  const likedGiftsProps: GiftItemProp[] = showLikedGifts
    ? filteredLikedGifts.map((item) => ({
        name: item.name,
        selected: selectedGifts.some((gift) => gift.name === item.name),
        highlighted:
          !hasGiftSelected && selectedGiftsByOthers.includes(item.name),
        muted: showTrackedGifts && isGiftTracked(character.name, item.name),
        item,
      }))
    : [];

  // Create extra content (Love and Like buttons)
  const extraContent = (
    <>
      <ItemButton
        icon={getItemIcon("Infusion_icon_cook_lovable.webp")}
        label={universalLovedDish.name}
        isSelected={selectedGifts.some(
          (gift) => gift.name === universalLovedDish.name
        )}
        onClick={() => handleGiftSelect(universalLovedDish)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleGiftSelect(universalLovedDish);
          }
        }}
        ariaLabel={`Select ${universalLovedDish.name} for ${character.name}`}
        title={universalLovedDish.name}
      />
      {showLikedGifts && (
        <ItemButton
          icon={getItemIcon("Infusion_icon_cook_likeable.webp")}
          label={universalLikedDish.name}
          isSelected={selectedGifts.some(
            (gift) => gift.name === universalLikedDish.name
          )}
          onClick={() => handleGiftSelect(universalLikedDish)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleGiftSelect(universalLikedDish);
            }
          }}
          ariaLabel={`Select ${universalLikedDish.name} for ${character.name}`}
          title={universalLikedDish.name}
        />
      )}
    </>
  );

  return (
    <CharacterGiftsCard
      icon={character.icon}
      name={character.name}
      extra={extraContent}
      lovedGifts={lovedGiftsProps}
      likedGifts={likedGiftsProps.length > 0 ? likedGiftsProps : undefined}
      onClick={handleGiftSelect}
      onRightClick={handleRightClick}
      onDoubleClick={handleDoubleClick}
    />
  );
};

export default GiftPlannerCard;
