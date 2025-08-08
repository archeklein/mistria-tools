import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GiftPlannerCard from "../../../components/gift-planner/GiftPlannerCard";
import type { Character } from "../../../stores/giftStore";
import { useGiftStore } from "../../../stores/giftStore";

// Mock the store
const mockSelectGift = vi.fn();
const mockGetSelectedGifts = vi.fn();
const mockGetItem = vi.fn();
const mockTrackGift = vi.fn();
const mockUntrackGift = vi.fn();
const mockIsGiftTracked = vi.fn();
const mockGetMatchingGifts = vi.fn();

vi.mock("../../../stores/giftStore", () => ({
  useGiftStore: vi.fn(),
}));

// Mock CharacterGiftsCard
vi.mock("../../../components/common/CharacterGiftsCard", () => ({
  default: vi.fn(
    ({ name, onClick, onRightClick, extra, lovedGifts, likedGifts }) => (
      <div data-testid="character-gifts-card">
        <div data-testid="character-name">{name}</div>
        <div data-testid="extra-content">{extra}</div>
        <div data-testid="loved-gifts">
          {lovedGifts?.map((gift: any, index: number) => (
            <button
              key={index}
              data-testid={`loved-gift-${gift.name}`}
              onClick={() => onClick?.(gift.item)}
              onContextMenu={(e) => {
                e.preventDefault();
                onRightClick?.(gift.item);
              }}
              data-selected={gift.selected}
              data-highlighted={gift.highlighted}
              data-muted={gift.muted}
            >
              {gift.name}
            </button>
          ))}
        </div>
        <div data-testid="liked-gifts">
          {likedGifts?.map((gift: any, index: number) => (
            <button
              key={index}
              data-testid={`liked-gift-${gift.name}`}
              onClick={() => onClick?.(gift.item)}
              onContextMenu={(e) => {
                e.preventDefault();
                onRightClick?.(gift.item);
              }}
              data-selected={gift.selected}
              data-highlighted={gift.highlighted}
              data-muted={gift.muted}
            >
              {gift.name}
            </button>
          ))}
        </div>
      </div>
    )
  ),
}));

// Mock ItemButton
vi.mock("../../../components/common/ItemButton", () => ({
  default: vi.fn(
    ({ label, isSelected, onClick, onKeyDown, ariaLabel, title }) => (
      <button
        data-testid={`item-button-${label}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        title={title}
        data-selected={isSelected}
      >
        {label}
      </button>
    )
  ),
}));

// Mock getItemIcon
vi.mock("../../../utils/icons", () => ({
  getItemIcon: vi.fn((filename: string) => `/assets/items/${filename}`),
}));

describe("GiftPlannerCard", () => {
  const mockCharacter: Character = {
    name: "Adeline",
    category: "Romance Options",
    loved_gifts: ["Diamond", "Chocolate"],
    liked_gifts: ["Apple", "Bread"],
    icon: "Adeline_icon.webp",
    isSpoiler: false,
    isUnreleased: false,
  };

  const mockItems = {
    Diamond: { name: "Diamond", icon: "Diamond.webp" },
    Chocolate: { name: "Chocolate", icon: "Chocolate.webp" },
    Apple: { name: "Apple", icon: "Apple.webp" },
    Bread: { name: "Bread", icon: "Bread.webp" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSelectedGifts.mockReturnValue([]);
    mockGetItem.mockImplementation(
      (name: string) => mockItems[name as keyof typeof mockItems]
    );
    mockIsGiftTracked.mockReturnValue(false);
    mockGetMatchingGifts.mockReturnValue([]);

    // Set up default mock return value
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "",
      showTrackedGifts: false,
      getMatchingGifts: mockGetMatchingGifts,
    });
  });

  it("renders character information correctly", () => {
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    expect(screen.getByTestId("character-name")).toHaveTextContent("Adeline");
    expect(screen.getByTestId("character-gifts-card")).toBeInTheDocument();
  });

  it("displays loved gifts correctly", () => {
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    expect(screen.getByTestId("loved-gift-Diamond")).toBeInTheDocument();
    expect(screen.getByTestId("loved-gift-Chocolate")).toBeInTheDocument();
  });

  it("displays liked gifts when showLikedGifts is true", () => {
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    expect(screen.getByTestId("liked-gift-Apple")).toBeInTheDocument();
    expect(screen.getByTestId("liked-gift-Bread")).toBeInTheDocument();
  });

  it("hides liked gifts when showLikedGifts is false", () => {
    render(
      <GiftPlannerCard character={mockCharacter} showLikedGifts={false} />
    );

    expect(screen.queryByTestId("liked-gift-Apple")).not.toBeInTheDocument();
    expect(screen.queryByTestId("liked-gift-Bread")).not.toBeInTheDocument();
  });

  it("displays universal gift buttons", () => {
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    expect(screen.getByTestId("item-button-Lovable Dish")).toBeInTheDocument();
    expect(screen.getByTestId("item-button-Likeable Dish")).toBeInTheDocument();
  });

  it("hides likeable dish when showLikedGifts is false", () => {
    render(
      <GiftPlannerCard character={mockCharacter} showLikedGifts={false} />
    );

    expect(screen.getByTestId("item-button-Lovable Dish")).toBeInTheDocument();
    expect(
      screen.queryByTestId("item-button-Likeable Dish")
    ).not.toBeInTheDocument();
  });

  it("handles gift selection correctly", () => {
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    fireEvent.click(screen.getByTestId("loved-gift-Diamond"));

    expect(mockSelectGift).toHaveBeenCalledWith("Adeline", mockItems.Diamond);
  });

  it("handles universal gift selection correctly", async () => {
    const user = userEvent.setup();
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    await user.click(screen.getByTestId("item-button-Lovable Dish"));

    expect(mockSelectGift).toHaveBeenCalledWith("Adeline", {
      name: "Lovable Dish",
      icon: "Infusion_icon_cook_lovable.webp",
    });
  });

  it("handles keyboard navigation for universal gifts", async () => {
    const user = userEvent.setup();
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const lovableDishButton = screen.getByTestId("item-button-Lovable Dish");
    lovableDishButton.focus();
    await user.keyboard("{Enter}");

    expect(mockSelectGift).toHaveBeenCalledWith("Adeline", {
      name: "Lovable Dish",
      icon: "Infusion_icon_cook_lovable.webp",
    });
  });

  it("handles right-click to track/untrack gifts", () => {
    mockIsGiftTracked.mockReturnValue(false);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    fireEvent.contextMenu(screen.getByTestId("loved-gift-Diamond"));

    expect(mockTrackGift).toHaveBeenCalledWith("Adeline", "Diamond");
  });

  it("handles right-click to untrack already tracked gifts", () => {
    mockIsGiftTracked.mockReturnValue(true);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    fireEvent.contextMenu(screen.getByTestId("loved-gift-Diamond"));

    expect(mockUntrackGift).toHaveBeenCalledWith("Adeline", "Diamond");
  });

  it("shows selected gift state correctly", () => {
    mockGetSelectedGifts.mockReturnValue([mockItems.Diamond]);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const diamondGift = screen.getByTestId("loved-gift-Diamond");
    expect(diamondGift).toHaveAttribute("data-selected", "true");
  });

  it("shows muted state for tracked gifts when showTrackedGifts is true", () => {
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "",
      showTrackedGifts: true,
      getMatchingGifts: mockGetMatchingGifts,
    });

    mockIsGiftTracked.mockReturnValue(true);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const diamondGift = screen.getByTestId("loved-gift-Diamond");
    expect(diamondGift).toHaveAttribute("data-muted", "true");
  });

  it("filters gifts based on search query", () => {
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "diamond",
      showTrackedGifts: false,
      getMatchingGifts: mockGetMatchingGifts,
    });

    mockGetMatchingGifts.mockReturnValue(["Diamond"]);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    expect(screen.getByTestId("loved-gift-Diamond")).toBeInTheDocument();
    expect(
      screen.queryByTestId("loved-gift-Chocolate")
    ).not.toBeInTheDocument();
  });

  it("shows highlighted state for gifts selected by others", () => {
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [
        {
          characterName: "March",
          gifts: [mockItems.Diamond],
        },
      ],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "",
      showTrackedGifts: false,
      getMatchingGifts: mockGetMatchingGifts,
    });

    mockGetSelectedGifts.mockReturnValue([]); // No gifts selected for Adeline
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const diamondGift = screen.getByTestId("loved-gift-Diamond");
    expect(diamondGift).toHaveAttribute("data-highlighted", "true");
  });

  it("does not highlight gifts when character has selected gifts", () => {
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [
        {
          characterName: "March",
          gifts: [mockItems.Diamond],
        },
      ],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "",
      showTrackedGifts: false,
      getMatchingGifts: mockGetMatchingGifts,
    });

    mockGetSelectedGifts.mockReturnValue([mockItems.Chocolate]); // Adeline has selected gifts
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const diamondGift = screen.getByTestId("loved-gift-Diamond");
    expect(diamondGift).toHaveAttribute("data-highlighted", "false");
  });

  it("handles missing item data gracefully", () => {
    mockGetItem.mockImplementation((name: string) => {
      if (name === "Diamond") return undefined;
      return mockItems[name as keyof typeof mockItems];
    });

    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    expect(screen.queryByTestId("loved-gift-Diamond")).not.toBeInTheDocument();
    expect(screen.getByTestId("loved-gift-Chocolate")).toBeInTheDocument();
  });

  it("handles legacy gift selection format", () => {
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [
        {
          characterName: "March",
          gift: mockItems.Diamond, // Legacy format
        } as any,
      ],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "",
      showTrackedGifts: false,
      getMatchingGifts: mockGetMatchingGifts,
    });

    mockGetSelectedGifts.mockReturnValue([]);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const diamondGift = screen.getByTestId("loved-gift-Diamond");
    expect(diamondGift).toHaveAttribute("data-highlighted", "true");
  });

  it("excludes universal gifts from highlighting logic", () => {
    vi.mocked(useGiftStore).mockReturnValue({
      selectGift: mockSelectGift,
      getSelectedGifts: mockGetSelectedGifts,
      getItem: mockGetItem,
      giftSelections: [
        {
          characterName: "March",
          gifts: [
            { name: "Lovable Dish", icon: "Infusion_icon_cook_lovable.webp" },
            mockItems.Diamond,
          ],
        },
      ],
      trackGift: mockTrackGift,
      untrackGift: mockUntrackGift,
      isGiftTracked: mockIsGiftTracked,
      searchQuery: "",
      showTrackedGifts: false,
      getMatchingGifts: mockGetMatchingGifts,
    });

    mockGetSelectedGifts.mockReturnValue([]);
    render(<GiftPlannerCard character={mockCharacter} showLikedGifts={true} />);

    const diamondGift = screen.getByTestId("loved-gift-Diamond");
    expect(diamondGift).toHaveAttribute("data-highlighted", "true");

    // Universal gifts should not affect highlighting logic
    const lovableDishButton = screen.getByTestId("item-button-Lovable Dish");
    expect(lovableDishButton).toHaveAttribute("data-selected", "false");
  });
});
