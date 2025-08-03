import React from "react";
import { useGiftStore, type Character, type Item } from "../stores/giftStore";
import SegmentedControl from "./SegmentedControl";

interface CharacterCardProps {
  character: Character;
  showLikedGifts: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  showLikedGifts,
}) => {
  const { selectGift, getSelectedGift, getItem } = useGiftStore();
  const selectedGift = getSelectedGift(character.name);

  // Convert string gift names to Item objects
  const lovedGiftItems = character.loved_gifts
    .map((giftName) => getItem(giftName))
    .filter((item): item is Item => item !== undefined);

  const likedGiftItems = character.liked_gifts
    .map((giftName) => getItem(giftName))
    .filter((item): item is Item => item !== undefined);

  const handleGiftSelect = (gift: Item) => {
    selectGift(character.name, gift);
  };

  // Get character icon URL from the data
  const getCharacterIcon = (iconFilename: string) => {
    return new URL(`../assets/characters/${iconFilename}`, import.meta.url)
      .href;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-3">
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
          <h3 className="text-lg font-bold text-gray-800">{character.name}</h3>
        </div>
      </div>

      {/* Loved Gifts */}
      <div className="mb-3 flex items-start gap-3">
        <div className="text-lg flex-shrink-0 mt-1">❤️</div>
        <div className="flex-1">
          <SegmentedControl
            items={lovedGiftItems.sort((a, b) => a.name.localeCompare(b.name))}
            selectedItem={selectedGift}
            onItemSelect={handleGiftSelect}
            characterName={character.name}
          />
        </div>
      </div>

      {/* Liked Gifts */}
      {showLikedGifts && (
        <div className="flex items-start gap-3">
          <div className="text-lg flex-shrink-0 mt-1">🎵</div>
          <div className="flex-1">
            <SegmentedControl
              items={likedGiftItems.sort((a, b) =>
                a.name.localeCompare(b.name)
              )}
              selectedItem={selectedGift}
              onItemSelect={handleGiftSelect}
              characterName={character.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
