import React, { useState } from "react";
import { useGiftStore } from "../stores/giftStore";
import CharacterCard from "./CharacterCard";
import Inventory from "./Inventory";

const GiftTracker: React.FC = () => {
  const { characters } = useGiftStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(characters.map((char) => char.category))),
  ];

  // Filter characters based on search and category
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || character.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Search Characters
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by character name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-64">
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
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Character List */}
        <div className="xl:col-span-2 space-y-3">
          {/* Character Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCharacters.map((character) => (
              <CharacterCard key={character.name} character={character} />
            ))}
          </div>

          {/* No Results */}
          {filteredCharacters.length === 0 && (
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
