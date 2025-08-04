import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import charactersData from "../data/characters.json";
import itemsData from "../data/items.json";

export interface Item {
  name: string;
  icon: string | null;
}

export interface Character {
  name: string;
  category: string;
  loved_gifts: string[];
  liked_gifts: string[];
  icon: string;
}

export interface GiftSelection {
  characterName: string;
  gift: Item;
}

interface GiftStore {
  characters: Character[];
  items: Item[];
  giftSelections: GiftSelection[];
  // Filter states
  selectedCategory: string;
  showLikedGifts: boolean;
  sortBy: "alphabetical" | "category";
  // Gift actions
  getItem: (itemName: string) => Item | undefined;
  selectGift: (characterName: string, gift: Item) => void;
  clearGiftSelection: (characterName: string) => void;
  clearAllGiftSelections: () => void;
  getSelectedGift: (characterName: string) => Item | null;
  // Filter actions
  setSelectedCategory: (category: string) => void;
  setShowLikedGifts: (show: boolean) => void;
  setSortBy: (sortBy: "alphabetical" | "category") => void;
  getFilteredAndSortedCharacters: () => Character[];
}

export const useGiftStore = create<GiftStore>()(
  persist(
    (set, get) => ({
      characters: charactersData.characters,
      items: itemsData.items,
      giftSelections: [],
      // Filter state defaults
      selectedCategory: "All",
      showLikedGifts: true,
      sortBy: "alphabetical",

      getItem: (itemName: string) => {
        return get().items.find((item) => item.name === itemName);
      },

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

      clearAllGiftSelections: () => {
        set({ giftSelections: [] });
      },

      getSelectedGift: (characterName: string) => {
        const selection = get().giftSelections.find(
          (selection) => selection.characterName === characterName
        );
        return selection ? selection.gift : null;
      },

      // Filter actions
      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
      },

      setShowLikedGifts: (show: boolean) => {
        set({ showLikedGifts: show });
      },

      setSortBy: (sortBy: "alphabetical" | "category") => {
        set({ sortBy });
      },

      getFilteredAndSortedCharacters: () => {
        const { characters, selectedCategory, sortBy } = get();

        return characters
          .filter((character) => {
            const matchesCategory =
              selectedCategory === "All" ||
              character.category === selectedCategory;
            return matchesCategory;
          })
          .sort((a, b) => {
            if (sortBy === "alphabetical") {
              return a.name.localeCompare(b.name);
            } else {
              // Sort by category first, then alphabetically within category
              if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
              }
              return a.name.localeCompare(b.name);
            }
          });
      },
    }),
    {
      name: "fields-of-mistria-gift-store", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        giftSelections: state.giftSelections,
        selectedCategory: state.selectedCategory,
        showLikedGifts: state.showLikedGifts,
        sortBy: state.sortBy,
      }), // persist user preferences and selections, not characters/items data
    }
  )
);
