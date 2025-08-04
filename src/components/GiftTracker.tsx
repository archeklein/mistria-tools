import React, { useState } from "react";
import { useGiftStore } from "../stores/giftStore";
import CharacterCard from "./CharacterCard";
import Inventory from "./Inventory";
import Toggle from "./Toggle";
import Drawer from "./Drawer";
import HowToUse from "./HowToUse";

const GiftTracker: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showInventoryDrawer, setShowInventoryDrawer] = useState(false);

  const {
    characters,
    selectedCategory,
    showLikedGifts,
    sortBy,
    setSelectedCategory,
    setShowLikedGifts,
    setSortBy,
    getFilteredAndSortedCharacters,
    giftSelections,
  } = useGiftStore();

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(characters.map((char) => char.category))),
  ];

  // Get filtered and sorted characters from store
  const filteredAndSortedCharacters = getFilteredAndSortedCharacters();

  // Calculate total inventory items
  const totalInventoryItems = giftSelections.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-left">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Gift Planner</h2>
            <button
              onClick={() => setShowHelp(true)}
              className="w-5 h-5 rounded-sm bg-pink-500 hover:bg-pink-700 flex items-center justify-center text-white transition-colors"
              title="How to use this tool"
              aria-label="Show help information"
            >
              <span className="text-xs font-bold">?</span>
            </button>
          </div>

          {/* Mobile buttons - only show on md and smaller screens */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              title="Show filters"
              aria-label="Show filters"
            >
              <span className="text-lg">⚙️</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowInventoryDrawer(true)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                title="Show inventory"
                aria-label="Show inventory"
              >
                🎒
              </button>
              {totalInventoryItems > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalInventoryItems > 99 ? "99+" : totalInventoryItems}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Plan your gifting run by selecting one gift for each character
        </p>
      </div>

      {/* Filters - hide on md and smaller screens */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-3">
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
              label="Show Liked"
            />
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Character List */}
        <div className="md:col-span-1 lg:col-span-2 space-y-3">
          {/* Character Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
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

        {/* Right Column - Inventory - hide on md and smaller screens */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-16">
            <Inventory />
          </div>
        </div>
      </div>

      {/* How to Use Modal */}
      <HowToUse isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Filters Drawer */}
      <Drawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        title="Filters"
        icon={<span className="text-lg">⚙️</span>}
      >
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-drawer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category-drawer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label
              htmlFor="sort-drawer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sort by
            </label>
            <select
              id="sort-drawer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Liked Gifts Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Show Liked Gifts
            </label>
            <Toggle
              checked={showLikedGifts}
              onChange={setShowLikedGifts}
              label="Show Liked"
            />
          </div>
        </div>
      </Drawer>

      {/* Inventory Drawer */}
      <Drawer
        isOpen={showInventoryDrawer}
        onClose={() => setShowInventoryDrawer(false)}
        title="Inventory"
        icon={<span className="text-lg">🎒</span>}
      >
        <Inventory showHeader={false} showContainer={false} />
      </Drawer>
    </div>
  );
};

export default GiftTracker;
