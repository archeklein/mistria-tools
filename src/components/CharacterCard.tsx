import React from "react";
import { useGiftStore, type Character, type Item } from "../stores/giftStore";
import SegmentedControl from "./SegmentedControl";
import ItemButton from "./ItemButton";
import { getCharacterIcon, getItemIcon } from "../utils/icons";

interface CharacterCardProps {
  character: Character;
  showLikedGifts: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  showLikedGifts,
}) => {
  const { selectGift, getSelectedGift, getItem, giftSelections } =
    useGiftStore();
  const selectedGift = getSelectedGift(character.name);

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

  // Get gifts selected by other characters (only if current character has no selection)
  const selectedGiftsByOthers = !selectedGift
    ? giftSelections
        .filter((selection) => selection.characterName !== character.name)
        .map((selection) => selection.gift.name)
    : [];

  const handleGiftSelect = (gift: Item) => {
    selectGift(character.name, gift);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={getCharacterIcon(character.icon)}
              alt={`${character.name} icon`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a simple avatar if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.classList.remove("hidden");
                }
              }}
            />
            <div className="hidden text-lg font-bold text-emerald-600">
              {character.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {character.name}
            </h3>
          </div>
        </div>

        {/* Love and Like buttons in header */}
        <div className="flex gap-1">
          <ItemButton
            icon={getItemIcon("Infusion_icon_cook_lovable.webp")}
            label={universalLovedDish.name}
            isSelected={selectedGift?.name === universalLovedDish.name}
            onClick={() => handleGiftSelect(universalLovedDish)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleGiftSelect(universalLovedDish);
              }
            }}
            ariaLabel={`Select ${universalLovedDish.name} for ${character.name}`}
            title={universalLovedDish.name}
            isFirstRow={true}
            isFirstCol={true}
            isLastRow={true}
            isLastCol={true}
          />
          {showLikedGifts && (
            <ItemButton
              icon={getItemIcon("Infusion_icon_cook_likeable.webp")}
              label={universalLikedDish.name}
              isSelected={selectedGift?.name === universalLikedDish.name}
              onClick={() => handleGiftSelect(universalLikedDish)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleGiftSelect(universalLikedDish);
                }
              }}
              ariaLabel={`Select ${universalLikedDish.name} for ${character.name}`}
              title={universalLikedDish.name}
              isFirstRow={true}
              isFirstCol={true}
              isLastRow={true}
              isLastCol={true}
            />
          )}
        </div>
      </div>

      {/* Loved Gifts */}
      <div>
        <SegmentedControl
          items={lovedGiftItems.sort((a, b) => a.name.localeCompare(b.name))}
          selectedItem={selectedGift}
          onItemSelect={handleGiftSelect}
          characterName={character.name}
          selectedGiftsByOthers={selectedGiftsByOthers}
        />
      </div>

      {/* Liked Gifts */}
      {showLikedGifts && (
        <div className="mt-4">
          <SegmentedControl
            items={likedGiftItems.sort((a, b) => a.name.localeCompare(b.name))}
            selectedItem={selectedGift}
            onItemSelect={handleGiftSelect}
            characterName={character.name}
            selectedGiftsByOthers={selectedGiftsByOthers}
          />
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
