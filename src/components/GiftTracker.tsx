import React, { useState } from "react";
import { useGiftStore } from "../stores/giftStore";
import CharacterCard from "./CharacterCard";
import Inventory from "./Inventory";
import Toggle from "./Toggle";

const GiftTracker: React.FC = () => {
  const { characters } = useGiftStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLikedGifts, setShowLikedGifts] = useState(true);
  const [sortBy, setSortBy] = useState<"alphabetical" | "category">(
    "alphabetical"
  );

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(characters.map((char) => char.category))),
  ];

  // Filter and sort characters
  const filteredAndSortedCharacters = characters
    .filter((character) => {
      const matchesCategory =
        selectedCategory === "All" || character.category === selectedCategory;
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Gift Tracker</h2>
        <p className="text-sm text-gray-600">
          Plan your gifting run by selecting one gift for each character
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          {/* Category Filter */}
          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex-1">
            <label
              htmlFor="sort"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "alphabetical" | "category")
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="alphabetical">Alphabetically</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Liked Gifts Toggle */}
          <div className="flex items-center gap-2 pb-1">
            <Toggle
              checked={showLikedGifts}
              onChange={setShowLikedGifts}
              label="🎵 Show Liked"
            />
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Character List */}
        <div className="xl:col-span-2 space-y-3">
          {/* Character Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAndSortedCharacters.map((character) => (
              <CharacterCard
                key={character.name}
                character={character}
                showLikedGifts={showLikedGifts}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredAndSortedCharacters.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">
                No characters found matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Inventory */}
        <div className="xl:col-span-1">
          <div className="sticky top-2">
            <Inventory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftTracker;
