import { describe, it, expect, beforeEach, vi } from "vitest";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGiftStore } from "../../stores/giftStore";
import type {
  Character,
  Item,
  GiftSelection,
  TrackedGift,
} from "../../stores/giftStore";

// Mock the data imports
vi.mock("../../data/characters.json", () => ({
  default: {
    characters: [
      {
        name: "Adeline",
        category: "Romance Options",
        loved_gifts: ["Diamond", "Chocolate"],
        liked_gifts: ["Apple", "Bread"],
        icon: "Adeline_icon.webp",
        isSpoiler: false,
        isUnreleased: false,
      },
      {
        name: "March",
        category: "Romance Options",
        loved_gifts: ["Coffee", "Emerald"],
        liked_gifts: ["Garlic", "Honey"],
        icon: "March_icon.webp",
        isSpoiler: false,
        isUnreleased: false,
      },
      {
        name: "Balor",
        category: "Special Characters",
        loved_gifts: ["Fish"],
        liked_gifts: ["Ice Cream"],
        icon: "Balor_icon.webp",
        isSpoiler: true,
        isUnreleased: false,
      },
    ],
  },
}));

vi.mock("../../data/items.json", () => ({
  default: {
    items: [
      { name: "Apple", icon: "Apple.webp" },
      { name: "Bread", icon: "Bread.webp" },
      { name: "Chocolate", icon: "Chocolate.webp" },
      { name: "Coffee", icon: "Coffee.webp" },
      { name: "Diamond", icon: "Diamond.webp" },
      { name: "Emerald", icon: "Emerald.webp" },
      { name: "Fish", icon: null },
      { name: "Garlic", icon: "Garlic.webp" },
      { name: "Honey", icon: "Honey.webp" },
      { name: "Ice Cream", icon: "Ice_cream_sundae.webp" },
    ],
  },
}));

// Mock zustand middleware
vi.mock("zustand/middleware", () => ({
  persist: vi.fn((config) => config),
  createJSONStorage: vi.fn(() => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  })),
}));

describe("GiftStore", () => {
  let store: ReturnType<typeof useGiftStore>;

  beforeEach(() => {
    // Reset localStorage mock
    vi.clearAllMocks();

    // Get a fresh store instance
    store = useGiftStore.getState();

    // Reset store to initial state
    useGiftStore.setState({
      selectedCategories: [
        "Romance Options",
        "Special Characters",
        "Townsfolk",
        "Saturday Market Vendors",
      ],
      showSpoilers: false,
      showLikedGifts: false,
      showTrackedGifts: true,
      sortBy: "alphabetical",
      searchQuery: "",
      giftSelections: [],
      trackedGifts: [],
    });
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useGiftStore.getState();

      expect(state.characters).toHaveLength(3);
      expect(state.items).toHaveLength(10);
      expect(state.selectedCategories).toEqual([
        "Romance Options",
        "Special Characters",
        "Townsfolk",
        "Saturday Market Vendors",
      ]);
      expect(state.showSpoilers).toBe(false);
      expect(state.showLikedGifts).toBe(false);
      expect(state.showTrackedGifts).toBe(true);
      expect(state.sortBy).toBe("alphabetical");
      expect(state.searchQuery).toBe("");
      expect(state.giftSelections).toEqual([]);
      expect(state.trackedGifts).toEqual([]);
    });

    it("should load characters and items data correctly", () => {
      const state = useGiftStore.getState();

      expect(state.characters[0]).toEqual({
        name: "Adeline",
        category: "Romance Options",
        loved_gifts: ["Diamond", "Chocolate"],
        liked_gifts: ["Apple", "Bread"],
        icon: "Adeline_icon.webp",
        isSpoiler: false,
        isUnreleased: false,
      });

      expect(state.items[0]).toEqual({
        name: "Apple",
        icon: "Apple.webp",
      });
    });
  });

  describe("Filter Actions", () => {
    it("should set selected categories", () => {
      const { setSelectedCategories } = useGiftStore.getState();

      setSelectedCategories(["Romance Options"]);

      expect(useGiftStore.getState().selectedCategories).toEqual([
        "Romance Options",
      ]);
    });

    it("should toggle category - add category when not selected", () => {
      const { toggleCategory, setSelectedCategories } = useGiftStore.getState();

      setSelectedCategories(["Romance Options"]);
      toggleCategory("Townsfolk");

      expect(useGiftStore.getState().selectedCategories).toEqual([
        "Romance Options",
        "Townsfolk",
      ]);
    });

    it("should toggle category - remove category when selected", () => {
      const { toggleCategory } = useGiftStore.getState();

      toggleCategory("Romance Options");

      expect(useGiftStore.getState().selectedCategories).not.toContain(
        "Romance Options"
      );
    });

    it("should set show spoilers", () => {
      const { setShowSpoilers } = useGiftStore.getState();

      setShowSpoilers(true);

      expect(useGiftStore.getState().showSpoilers).toBe(true);
    });

    it("should set show liked gifts", () => {
      const { setShowLikedGifts } = useGiftStore.getState();

      setShowLikedGifts(true);

      expect(useGiftStore.getState().showLikedGifts).toBe(true);
    });

    it("should set show tracked gifts", () => {
      const { setShowTrackedGifts } = useGiftStore.getState();

      setShowTrackedGifts(false);

      expect(useGiftStore.getState().showTrackedGifts).toBe(false);
    });

    it("should set sort by", () => {
      const { setSortBy } = useGiftStore.getState();

      setSortBy("category");

      expect(useGiftStore.getState().sortBy).toBe("category");
    });

    it("should set search query", () => {
      const { setSearchQuery } = useGiftStore.getState();

      setSearchQuery("test query");

      expect(useGiftStore.getState().searchQuery).toBe("test query");
    });
  });

  describe("Character Filtering Logic", () => {
    it("should filter characters by selected categories", () => {
      const { setSelectedCategories, getFilteredAndSortedCharacters } =
        useGiftStore.getState();

      setSelectedCategories(["Romance Options"]);
      const filtered = getFilteredAndSortedCharacters();

      expect(filtered).toHaveLength(2);
      expect(
        filtered.every((char) => char.category === "Romance Options")
      ).toBe(true);
    });

    it("should filter out spoiler characters when showSpoilers is false", () => {
      const {
        setSelectedCategories,
        setShowSpoilers,
        getFilteredAndSortedCharacters,
      } = useGiftStore.getState();

      setSelectedCategories(["Special Characters"]);
      setShowSpoilers(false);
      const filtered = getFilteredAndSortedCharacters();

      expect(filtered).toHaveLength(0); // Balor is a spoiler character
    });

    it("should include spoiler characters when showSpoilers is true", () => {
      const {
        setSelectedCategories,
        setShowSpoilers,
        getFilteredAndSortedCharacters,
      } = useGiftStore.getState();

      setSelectedCategories(["Special Characters"]);
      setShowSpoilers(true);
      const filtered = getFilteredAndSortedCharacters();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Balor");
    });

    it("should filter characters by search query - character name", () => {
      const { setSearchQuery, getFilteredAndSortedCharacters } =
        useGiftStore.getState();

      setSearchQuery("adeline");
      const filtered = getFilteredAndSortedCharacters();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Adeline");
    });

    it("should filter characters by search query - gift name", () => {
      const { setSearchQuery, getFilteredAndSortedCharacters } =
        useGiftStore.getState();

      setSearchQuery("diamond");
      const filtered = getFilteredAndSortedCharacters();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Adeline");
    });

    it("should sort characters alphabetically", () => {
      const { setSortBy, getFilteredAndSortedCharacters } =
        useGiftStore.getState();

      setSortBy("alphabetical");
      const filtered = getFilteredAndSortedCharacters();

      expect(filtered[0].name).toBe("Adeline");
      expect(filtered[1].name).toBe("March");
    });

    it("should sort characters by category", () => {
      const {
        setSortBy,
        setSelectedCategories,
        setShowSpoilers,
        getFilteredAndSortedCharacters,
      } = useGiftStore.getState();

      setSelectedCategories(["Romance Options", "Special Characters"]);
      setShowSpoilers(true);
      setSortBy("category");
      const filtered = getFilteredAndSortedCharacters();

      // Should be sorted by category first, then alphabetically within category
      expect(filtered[0].category).toBe("Romance Options");
      expect(filtered[1].category).toBe("Romance Options");
      expect(filtered[2].category).toBe("Special Characters");
    });
  });

  describe("Gift Matching Logic", () => {
    it("should return empty array when no search query", () => {
      const { getMatchingGifts } = useGiftStore.getState();
      const character = useGiftStore.getState().characters[0];

      const matches = getMatchingGifts(character);

      expect(matches).toEqual([]);
    });

    it("should return all gifts when character name matches", () => {
      const { setSearchQuery, getMatchingGifts } = useGiftStore.getState();
      const character = useGiftStore.getState().characters[0]; // Adeline

      setSearchQuery("adeline");
      const matches = getMatchingGifts(character);

      expect(matches).toEqual(["Diamond", "Chocolate", "Apple", "Bread"]);
    });

    it("should return only matching gifts when character name does not match", () => {
      const { setSearchQuery, getMatchingGifts } = useGiftStore.getState();
      const character = useGiftStore.getState().characters[0]; // Adeline

      setSearchQuery("diamond");
      const matches = getMatchingGifts(character);

      expect(matches).toEqual(["Diamond"]);
    });
  });

  describe("Gift Selection (Planner Mode)", () => {
    const testItem: Item = { name: "Diamond", icon: "Diamond.webp" };

    it("should select a gift for a character", () => {
      const { selectGift, getSelectedGifts } = useGiftStore.getState();

      selectGift("Adeline", testItem);
      const selected = getSelectedGifts("Adeline");

      expect(selected).toHaveLength(1);
      expect(selected[0]).toEqual(testItem);
    });

    it("should replace existing gift selection", () => {
      const { selectGift, getSelectedGifts } = useGiftStore.getState();
      const newItem: Item = { name: "Chocolate", icon: "Chocolate.webp" };

      selectGift("Adeline", testItem);
      selectGift("Adeline", newItem);
      const selected = getSelectedGifts("Adeline");

      expect(selected).toHaveLength(1);
      expect(selected[0]).toEqual(newItem);
    });

    it("should remove selection when selecting the same gift", () => {
      const { selectGift, getSelectedGifts } = useGiftStore.getState();

      selectGift("Adeline", testItem);
      selectGift("Adeline", testItem); // Select same gift again
      const selected = getSelectedGifts("Adeline");

      expect(selected).toHaveLength(0);
    });

    it("should clear gift selection for a character", () => {
      const { selectGift, clearGiftSelection, getSelectedGifts } =
        useGiftStore.getState();

      selectGift("Adeline", testItem);
      clearGiftSelection("Adeline");
      const selected = getSelectedGifts("Adeline");

      expect(selected).toHaveLength(0);
    });

    it("should clear all gift selections", () => {
      const { selectGift, clearAllGiftSelections } = useGiftStore.getState();

      selectGift("Adeline", testItem);
      selectGift("March", testItem);
      clearAllGiftSelections();

      expect(useGiftStore.getState().giftSelections).toHaveLength(0);
    });

    it("should handle multiple characters independently", () => {
      const { selectGift, getSelectedGifts } = useGiftStore.getState();
      const item2: Item = { name: "Coffee", icon: "Coffee.webp" };

      selectGift("Adeline", testItem);
      selectGift("March", item2);

      expect(getSelectedGifts("Adeline")).toEqual([testItem]);
      expect(getSelectedGifts("March")).toEqual([item2]);
    });
  });

  describe("Gift Tracking (Tracker Mode)", () => {
    it("should track a gift for a character", () => {
      const { trackGift, getTrackedGifts } = useGiftStore.getState();

      trackGift("Adeline", "Diamond");
      const tracked = getTrackedGifts("Adeline");

      expect(tracked).toHaveLength(1);
      expect(tracked[0]).toEqual({
        characterName: "Adeline",
        giftName: "Diamond",
      });
    });

    it("should not duplicate tracked gifts", () => {
      const { trackGift, getTrackedGifts } = useGiftStore.getState();

      trackGift("Adeline", "Diamond");
      trackGift("Adeline", "Diamond"); // Track same gift again
      const tracked = getTrackedGifts("Adeline");

      expect(tracked).toHaveLength(1);
    });

    it("should untrack a gift", () => {
      const { trackGift, untrackGift, getTrackedGifts } =
        useGiftStore.getState();

      trackGift("Adeline", "Diamond");
      untrackGift("Adeline", "Diamond");
      const tracked = getTrackedGifts("Adeline");

      expect(tracked).toHaveLength(0);
    });

    it("should check if gift is tracked", () => {
      const { trackGift, isGiftTracked } = useGiftStore.getState();

      trackGift("Adeline", "Diamond");

      expect(isGiftTracked("Adeline", "Diamond")).toBe(true);
      expect(isGiftTracked("Adeline", "Chocolate")).toBe(false);
    });

    it("should clear all tracked gifts for a character", () => {
      const { trackGift, clearTrackedGifts, getTrackedGifts } =
        useGiftStore.getState();

      trackGift("Adeline", "Diamond");
      trackGift("Adeline", "Chocolate");
      clearTrackedGifts("Adeline");
      const tracked = getTrackedGifts("Adeline");

      expect(tracked).toHaveLength(0);
    });

    it("should clear all tracked gifts", () => {
      const { trackGift, clearAllTrackedGifts } = useGiftStore.getState();

      trackGift("Adeline", "Diamond");
      trackGift("March", "Coffee");
      clearAllTrackedGifts();

      expect(useGiftStore.getState().trackedGifts).toHaveLength(0);
    });

    it("should handle multiple characters independently", () => {
      const { trackGift, getTrackedGifts } = useGiftStore.getState();

      trackGift("Adeline", "Diamond");
      trackGift("March", "Coffee");

      expect(getTrackedGifts("Adeline")).toHaveLength(1);
      expect(getTrackedGifts("March")).toHaveLength(1);
      expect(getTrackedGifts("Adeline")[0].giftName).toBe("Diamond");
      expect(getTrackedGifts("March")[0].giftName).toBe("Coffee");
    });
  });

  describe("Utility Functions", () => {
    it("should get item by name", () => {
      const { getItem } = useGiftStore.getState();

      const item = getItem("Apple");

      expect(item).toEqual({ name: "Apple", icon: "Apple.webp" });
    });

    it("should return undefined for non-existent item", () => {
      const { getItem } = useGiftStore.getState();

      const item = getItem("NonExistentItem");

      expect(item).toBeUndefined();
    });
  });

  describe("Data Migration", () => {
    it("should handle old gift selection format", () => {
      const { getSelectedGifts } = useGiftStore.getState();

      // Simulate old data format
      useGiftStore.setState({
        giftSelections: [
          {
            characterName: "Adeline",
            gifts: [{ name: "Diamond", icon: "Diamond.webp" }],
          },
        ] as GiftSelection[],
      });

      const selected = getSelectedGifts("Adeline");
      expect(selected).toHaveLength(1);
      expect(selected[0].name).toBe("Diamond");
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle multiple filters simultaneously", () => {
      const {
        setSelectedCategories,
        setSearchQuery,
        setShowSpoilers,
        getFilteredAndSortedCharacters,
      } = useGiftStore.getState();

      setSelectedCategories(["Romance Options", "Special Characters"]);
      setSearchQuery("a"); // Should match Adeline and Balor
      setShowSpoilers(false); // Should exclude Balor

      const filtered = getFilteredAndSortedCharacters();

      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe("Adeline");
    });

    it("should maintain separate planner and tracker state", () => {
      const { selectGift, trackGift, getSelectedGifts, getTrackedGifts } =
        useGiftStore.getState();
      const testItem: Item = { name: "Diamond", icon: "Diamond.webp" };

      // Select gift in planner mode
      selectGift("Adeline", testItem);

      // Track different gift in tracker mode
      trackGift("Adeline", "Chocolate");

      expect(getSelectedGifts("Adeline")).toEqual([testItem]);
      expect(getTrackedGifts("Adeline")).toEqual([
        { characterName: "Adeline", giftName: "Chocolate" },
      ]);
    });
  });
});
