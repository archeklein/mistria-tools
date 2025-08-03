import { create } from "zustand";
import charactersData from "../../characters_gifts.json";

export interface Item {
  name: string;
  icon: string | null;
}

export interface Character {
  name: string;
  category: string;
  loved_gifts: Item[];
  liked_gifts: Item[];
  icon: string;
}

export interface GiftSelection {
  characterName: string;
  gift: Item;
}

interface GiftStore {
  characters: Character[];
  giftSelections: GiftSelection[];
  selectGift: (characterName: string, gift: Item) => void;
  clearGiftSelection: (characterName: string) => void;
  getSelectedGift: (characterName: string) => Item | null;
}

export const useGiftStore = create<GiftStore>((set, get) => ({
  characters: charactersData.characters,
  giftSelections: [],

  selectGift: (characterName: string, gift: Item) => {
    const { giftSelections } = get();
    // Remove any existing selection for this character
    const filteredSelections = giftSelections.filter(
      (selection) => selection.characterName !== characterName
    );

    // Check if the same gift is already selected (to allow deselection)
    const currentSelection = giftSelections.find(
      (selection) => selection.characterName === characterName
    );

    if (currentSelection && currentSelection.gift.name === gift.name) {
      // Deselect if clicking the same gift
      set({ giftSelections: filteredSelections });
    } else {
      // Select the new gift
      const newSelection: GiftSelection = {
        characterName,
        gift,
      };
      set({ giftSelections: [...filteredSelections, newSelection] });
    }
  },

  clearGiftSelection: (characterName: string) => {
    const { giftSelections } = get();
    const filteredSelections = giftSelections.filter(
      (selection) => selection.characterName !== characterName
    );
    set({ giftSelections: filteredSelections });
  },

  getSelectedGift: (characterName: string) => {
    const selection = get().giftSelections.find(
      (selection) => selection.characterName === characterName
    );
    return selection ? selection.gift : null;
  },
}));
