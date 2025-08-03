import React from "react";
import { useGiftStore, type Character, type Item } from "../stores/giftStore";
import SegmentedControl from "./SegmentedControl";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { selectGift, getSelectedGift } = useGiftStore();
  const selectedGift = getSelectedGift(character.name);

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

      <div className="mb-3">
        <h4 className="text-sm font-semibold text-red-600 mb-1 flex items-center">
          ❤️ Loved Gifts
        </h4>
        <SegmentedControl
          items={character.loved_gifts}
          selectedItem={selectedGift}
          onItemSelect={handleGiftSelect}
          characterName={character.name}
        />
      </div>
    </div>
  );
};

export default CharacterCard;
