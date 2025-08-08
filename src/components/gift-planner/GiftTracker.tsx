import React, { useState } from "react";
import { useGiftStore } from "../../stores/giftStore";
import GiftPlannerCard from "./GiftPlannerCard";
import Inventory from "./Inventory";
import Toggle from "../common/Toggle";
import Drawer from "../common/Drawer";
import MultiSelect from "../common/MultiSelect";

const GiftTracker: React.FC = () => {
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showInventoryDrawer, setShowInventoryDrawer] = useState(false);

  const {
    characters,
    selectedCategories,
    showSpoilers,
    showLikedGifts,
    showTrackedGifts,
    sortBy,
    searchQuery,
    setSelectedCategories,
    setShowSpoilers,
    setShowLikedGifts,
    setShowTrackedGifts,
    setSortBy,
    setSearchQuery,
    getFilteredAndSortedCharacters,
    giftSelections,
  } = useGiftStore();

  // Get unique categories (no longer need "All" option)
  const categories = Array.from(
    new Set(characters.map((char) => char.category))
  );

  // Get filtered and sorted characters from store
  const filteredAndSortedCharacters = getFilteredAndSortedCharacters();

  // Calculate total inventory items
  const totalInventoryItems = giftSelections.length;

  return (
    <div className="space-y-4">
      {/* Mobile controls - only show on md and smaller screens */}
      <div className="flex items-center gap-2 lg:hidden">
        {/* Mobile Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search characters or gifts..."
              className="w-full h-10 px-3 py-2 pl-8 text-sm border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">🔍</span>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <span className="text-sm">✕</span>
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-1 text-xs text-gray-600">
              {filteredAndSortedCharacters.length === 0
                ? "No characters found with matching gifts"
                : `Showing ${filteredAndSortedCharacters.length} character${
                    filteredAndSortedCharacters.length !== 1 ? "s" : ""
                  } with matching gifts`}
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <button
          onClick={() => setShowFiltersDrawer(true)}
          className="w-10 h-10 rounded-lg bg-white border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
          title="Show filters"
          aria-label="Show filters"
        >
          <span className="text-lg">⚙️</span>
        </button>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowInventoryDrawer(true)}
            className="w-10 h-10 rounded-lg bg-white border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
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

      {/* Filters - hide on md and smaller screens */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="flex flex-col gap-3">
          {/* Text Search */}
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Search by character or gift name
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type character or item name (e.g., March, Apple, Diamond...)"
                className="w-full px-3 py-1 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">🔍</span>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <span className="text-sm">✕</span>
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-1 text-xs text-gray-600">
                {filteredAndSortedCharacters.length === 0
                  ? "No characters found with matching gifts"
                  : `Showing ${filteredAndSortedCharacters.length} character${
                      filteredAndSortedCharacters.length !== 1 ? "s" : ""
                    } with matching gifts`}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Category Filter */}
            <div className="flex-1">
              <MultiSelect
                id="category"
                label="Category"
                options={categories}
                selectedOptions={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Select categories..."
              />
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

            {/* Toggle Controls */}
            <div className="flex flex-row gap-2 pb-1">
              <Toggle
                checked={showSpoilers}
                onChange={() => setShowSpoilers(!showSpoilers)}
                label="Show Spoilers"
              />
              <Toggle
                checked={showLikedGifts}
                onChange={setShowLikedGifts}
                label="Show Liked"
              />
              <Toggle
                checked={showTrackedGifts}
                onChange={setShowTrackedGifts}
                label="Show Tracked"
              />
            </div>
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
              <GiftPlannerCard
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
            <MultiSelect
              id="category-drawer"
              label="Category"
              options={categories}
              selectedOptions={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Select categories..."
              className="px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
            />
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

          {/* Spoilers Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Show Spoilers
            </label>
            <Toggle checked={showSpoilers} onChange={setShowSpoilers} />
          </div>

          {/* Liked Gifts Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Show Liked Gifts
            </label>
            <Toggle checked={showLikedGifts} onChange={setShowLikedGifts} />
          </div>

          {/* Tracked Gifts Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Show Tracked Gifts
            </label>
            <Toggle checked={showTrackedGifts} onChange={setShowTrackedGifts} />
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
        <Inventory
          showHeader={false}
          showContainer={false}
          showClearButton={true}
        />
      </Drawer>
    </div>
  );
};

export default GiftTracker;
