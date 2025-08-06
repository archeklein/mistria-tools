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
  gifts: Item[];
}

export interface TrackedGift {
  characterName: string;
  giftName: string;
  dateGiven?: string;
}

interface GiftStore {
  // Common data
  characters: Character[];
  items: Item[];

  // Common filter states
  selectedCategory: string;
  showLikedGifts: boolean;
  showTrackedGifts: boolean;
  sortBy: "alphabetical" | "category";
  searchQuery: string;

  // Planner-specific states
  giftSelections: GiftSelection[];

  // Tracker-specific states
  trackedGifts: TrackedGift[];

  // Common actions
  getItem: (itemName: string) => Item | undefined;
  setSelectedCategory: (category: string) => void;
  setShowLikedGifts: (show: boolean) => void;
  setShowTrackedGifts: (show: boolean) => void;
  setSortBy: (sortBy: "alphabetical" | "category") => void;
  setSearchQuery: (query: string) => void;
  getFilteredAndSortedCharacters: () => Character[];
  getMatchingGifts: (character: Character) => string[];

  // Planner-specific actions
  selectGift: (characterName: string, gift: Item) => void;
  clearGiftSelection: (characterName: string) => void;
  clearAllGiftSelections: () => void;
  getSelectedGifts: (characterName: string) => Item[];

  // Tracker-specific actions
  trackGift: (characterName: string, giftName: string) => void;
  untrackGift: (characterName: string, giftName: string) => void;
  clearTrackedGifts: (characterName: string) => void;
  clearAllTrackedGifts: () => void;
  getTrackedGifts: (characterName: string) => TrackedGift[];
  isGiftTracked: (characterName: string, giftName: string) => boolean;
}

// Helper function to migrate old data format to new format
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const migrateGiftSelections = (selections: any[]): GiftSelection[] => {
  return selections.map((selection) => {
    // If already in new format, return as is
    if (selection.gifts) {
      return selection as GiftSelection;
    }

    // Convert old format to new format
    if (selection.gift) {
      return {
        characterName: selection.characterName,
        gifts: [selection.gift],
      } as GiftSelection;
    }

    // Invalid selection, return empty gifts array
    return {
      characterName: selection.characterName,
      gifts: [],
    } as GiftSelection;
  });
};

export const useGiftStore = create<GiftStore>()(
  persist(
    (set, get) => ({
      // Common data
      characters: charactersData.characters,
      items: itemsData.items,

      // Common filter state defaults
      selectedCategory: "All",
      showLikedGifts: false,
      showTrackedGifts: true,
      sortBy: "alphabetical",
      searchQuery: "",

      // Planner-specific states
      giftSelections: [],

      // Tracker-specific states
      trackedGifts: [],

      // Common actions
      getItem: (itemName: string) => {
        return get().items.find((item) => item.name === itemName);
      },

      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
      },

      setShowLikedGifts: (show: boolean) => {
        set({ showLikedGifts: show });
      },

      setShowTrackedGifts: (show: boolean) => {
        set({ showTrackedGifts: show });
      },

      setSortBy: (sortBy: "alphabetical" | "category") => {
        set({ sortBy });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      getFilteredAndSortedCharacters: () => {
        const { characters, selectedCategory, sortBy, searchQuery } = get();

        return characters
          .filter((character) => {
            const matchesCategory =
              selectedCategory === "All" ||
              character.category === selectedCategory;

            // If there's a search query, filter by character name or gifts
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase().trim();

              // Check if character name matches
              const characterNameMatches = character.name
                .toLowerCase()
                .includes(query);

              // Check if any gifts match
              const allGifts = [
                ...character.loved_gifts,
                ...character.liked_gifts,
              ];
              const hasMatchingGifts = allGifts.some((giftName) =>
                giftName.toLowerCase().includes(query)
              );

              // Show character if name matches OR if gifts match
              return (
                matchesCategory && (characterNameMatches || hasMatchingGifts)
              );
            }

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

      getMatchingGifts: (character: Character) => {
        const { searchQuery } = get();

        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase().trim();
        const allGifts = [...character.loved_gifts, ...character.liked_gifts];

        // Check if character name matches
        const characterNameMatches = character.name
          .toLowerCase()
          .includes(query);

        // Check if any gifts match
        const matchingGifts = allGifts.filter((giftName) =>
          giftName.toLowerCase().includes(query)
        );

        // Logic 1: If character name matches but no gifts match, show all gifts
        if (characterNameMatches && matchingGifts.length === 0) {
          return allGifts;
        }

        // Logic 2: If character name matches and gifts also match, show all gifts
        if (characterNameMatches && matchingGifts.length > 0) {
          return allGifts;
        }

        // Logic 3: If only gifts match (character name doesn't match), show only matching gifts
        return matchingGifts;
      },

      // Planner-specific actions
      selectGift: (characterName: string, gift: Item) => {
        const { giftSelections } = get();
        const existingSelection = giftSelections.find(
          (selection) => selection.characterName === characterName
        );

        if (existingSelection) {
          // Check if the same gift is already selected
          const isAlreadySelected = existingSelection.gifts.some(
            (selectedGift) => selectedGift.name === gift.name
          );

          if (isAlreadySelected) {
            // Remove the entire selection if clicking the same gift
            const filteredSelections = giftSelections.filter(
              (selection) => selection.characterName !== characterName
            );
            set({ giftSelections: filteredSelections });
          } else {
            // Replace with the new gift (only one gift per character)
            const updatedSelections = giftSelections.map((selection) =>
              selection.characterName === characterName
                ? { ...selection, gifts: [gift] }
                : selection
            );
            set({ giftSelections: updatedSelections });
          }
        } else {
          // Create new selection with this gift
          const newSelection: GiftSelection = {
            characterName,
            gifts: [gift],
          };
          set({ giftSelections: [...giftSelections, newSelection] });
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

      getSelectedGifts: (characterName: string) => {
        const selection = get().giftSelections.find(
          (selection) => selection.characterName === characterName
        );
        if (!selection) return [];

        // Handle both old and new data formats
        if (selection.gifts) {
          return selection.gifts;
        }

        // Fallback for old data format
        const oldSelection = selection as any;
        return oldSelection.gift ? [oldSelection.gift] : [];
      },

      // Tracker-specific actions
      trackGift: (characterName: string, giftName: string) => {
        const { trackedGifts } = get();
        const existingTrack = trackedGifts.find(
          (track) =>
            track.characterName === characterName && track.giftName === giftName
        );

        if (!existingTrack) {
          const newTrack: TrackedGift = {
            characterName,
            giftName,
            dateGiven: new Date().toISOString(),
          };
          set({ trackedGifts: [...trackedGifts, newTrack] });
        }
      },

      untrackGift: (characterName: string, giftName: string) => {
        const { trackedGifts } = get();
        const filteredTracks = trackedGifts.filter(
          (track) =>
            !(
              track.characterName === characterName &&
              track.giftName === giftName
            )
        );
        set({ trackedGifts: filteredTracks });
      },

      clearTrackedGifts: (characterName: string) => {
        const { trackedGifts } = get();
        const filteredTracks = trackedGifts.filter(
          (track) => track.characterName !== characterName
        );
        set({ trackedGifts: filteredTracks });
      },

      clearAllTrackedGifts: () => {
        set({ trackedGifts: [] });
      },

      getTrackedGifts: (characterName: string) => {
        return get().trackedGifts.filter(
          (track) => track.characterName === characterName
        );
      },

      isGiftTracked: (characterName: string, giftName: string) => {
        return get().trackedGifts.some(
          (track) =>
            track.characterName === characterName && track.giftName === giftName
        );
      },
    }),
    {
      name: "fields-of-mistria-gift-store", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        giftSelections: state.giftSelections,
        trackedGifts: state.trackedGifts,
        selectedCategory: state.selectedCategory,
        showLikedGifts: state.showLikedGifts,
        showTrackedGifts: state.showTrackedGifts,
        sortBy: state.sortBy,
        searchQuery: state.searchQuery,
      }), // persist user preferences and selections, not characters/items data
      onRehydrateStorage: () => (state) => {
        if (state && state.giftSelections) {
          // Migrate old data format to new format
          state.giftSelections = migrateGiftSelections(state.giftSelections);
        }
      },
    }
  )
);
