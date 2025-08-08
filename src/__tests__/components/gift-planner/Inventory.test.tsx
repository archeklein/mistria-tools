import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Inventory from "../../../components/gift-planner/Inventory";
import type { Character, GiftSelection } from "../../../stores/giftStore";

// Mock the store
const mockClearAllGiftSelections = vi.fn();
const mockSelectGift = vi.fn();
const mockTrackGift = vi.fn();
const mockGetItem = vi.fn();

const mockGiftSelections: GiftSelection[] = [];
const mockCharacters: Character[] = [
  {
    name: "Adeline",
    category: "Romance Options",
    loved_gifts: ["Diamond"],
    liked_gifts: ["Apple"],
    icon: "Adeline_icon.webp",
    isSpoiler: false,
    isUnreleased: false,
  },
  {
    name: "March",
    category: "Romance Options",
    loved_gifts: ["Coffee"],
    liked_gifts: ["Bread"],
    icon: "March_icon.webp",
    isSpoiler: false,
    isUnreleased: false,
  },
];

vi.mock("../../../stores/giftStore", () => ({
  useGiftStore: () => ({
    giftSelections: mockGiftSelections,
    characters: mockCharacters,
    clearAllGiftSelections: mockClearAllGiftSelections,
    selectGift: mockSelectGift,
    trackGift: mockTrackGift,
    getItem: mockGetItem,
  }),
}));

// Mock Avatar component
vi.mock("../../../components/common/Avatar", () => ({
  default: vi.fn(({ character, className }) => (
    <div
      data-testid={`avatar-${
        typeof character === "string" ? character : character?.name
      }`}
      className={className}
    >
      {typeof character === "string" ? character : character?.name}
    </div>
  )),
}));

// Mock getItemIcon
vi.mock("../../../utils/icons", () => ({
  getItemIcon: vi.fn((filename: string) => `/assets/items/${filename}`),
}));

// Mock getBoundingClientRect
Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
  configurable: true,
  value: vi.fn(() => ({
    left: 100,
    top: 200,
    width: 40,
    height: 40,
    right: 140,
    bottom: 240,
  })),
});

// Mock window properties
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

describe("Inventory", () => {
  const mockItems = {
    Diamond: { name: "Diamond", icon: "Diamond.webp" },
    Apple: { name: "Apple", icon: "Apple.webp" },
    Coffee: { name: "Coffee", icon: "Coffee.webp" },
    Bread: { name: "Bread", icon: "Bread.webp" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockImplementation(
      (name: string) => mockItems[name as keyof typeof mockItems]
    );

    // Reset mock gift selections
    mockGiftSelections.length = 0;
  });

  describe("Empty State", () => {
    it("renders empty state when no gifts are selected", () => {
      render(<Inventory />);

      expect(screen.getByText("🎒 Inventory")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Select gifts for characters to see your inventory here."
        )
      ).toBeInTheDocument();
    });

    it("renders empty state without container when showContainer is false", () => {
      render(<Inventory showContainer={false} />);

      expect(screen.getByText("🎒 Inventory")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Select gifts for characters to see your inventory here."
        )
      ).toBeInTheDocument();

      // Should not have the container styling
      const container = screen.getByText("🎒 Inventory").closest("div");
      expect(container).not.toHaveClass("bg-white", "rounded-xl", "shadow-lg");
    });

    it("renders empty state without header when showHeader is false", () => {
      render(<Inventory showHeader={false} />);

      expect(screen.queryByText("🎒 Inventory")).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "Select gifts for characters to see your inventory here."
        )
      ).toBeInTheDocument();
    });
  });

  describe("With Gift Selections", () => {
    beforeEach(() => {
      mockGiftSelections.push(
        {
          characterName: "Adeline",
          gifts: [mockItems.Diamond, mockItems.Apple],
        },
        {
          characterName: "March",
          gifts: [mockItems.Diamond, mockItems.Coffee],
        }
      );
    });

    it("renders gift inventory correctly", () => {
      render(<Inventory />);

      expect(screen.getByText("🎒 Inventory")).toBeInTheDocument();
      expect(screen.getByText("Clear All")).toBeInTheDocument();

      // Should show gifts grouped by item
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Coffee")).toBeInTheDocument();
      expect(screen.getByText("Diamond")).toBeInTheDocument();

      // Should show correct counts
      expect(screen.getAllByText("1 ×")).toHaveLength(2); // Apple and Coffee
      expect(screen.getByText("2 ×")).toBeInTheDocument(); // Diamond (selected by both)
    });

    it("renders character avatars for each gift", () => {
      render(<Inventory />);

      expect(screen.getAllByTestId("avatar-Adeline")).toHaveLength(2); // Adeline appears for Apple and Diamond
      expect(screen.getAllByTestId("avatar-March")).toHaveLength(2); // March appears for Coffee and Diamond
    });

    it("sorts gifts alphabetically", () => {
      render(<Inventory />);

      const giftElements = screen.getAllByText(/\d+ ×/);
      const giftNames = giftElements.map((el) => {
        const row = el.closest(".flex.items-center.justify-between");
        return row?.querySelector(".text-sm.font-medium.text-gray-800")
          ?.textContent;
      });

      // Should be sorted: Apple, Coffee, Diamond
      expect(giftNames).toEqual(["Apple", "Coffee", "Diamond"]);
    });

    it("handles clear all button click", async () => {
      const user = userEvent.setup();
      render(<Inventory />);

      await user.click(screen.getByText("Clear All"));

      expect(mockClearAllGiftSelections).toHaveBeenCalledTimes(1);
    });

    it("renders without header but with clear button when configured", () => {
      render(<Inventory showHeader={false} showClearButton={true} />);

      expect(screen.queryByText("🎒 Inventory")).not.toBeInTheDocument();
      expect(screen.getByText("Clear All")).toBeInTheDocument();
    });

    it("renders without clear button when showClearButton is false", () => {
      render(<Inventory showHeader={false} showClearButton={false} />);

      expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
    });

    it("displays gift images correctly", () => {
      render(<Inventory />);

      const diamondImage = screen.getByAltText("Diamond");
      expect(diamondImage).toHaveAttribute("src", "/assets/items/Diamond.webp");
    });

    it("displays fallback for missing gift icons", () => {
      mockGiftSelections.push({
        characterName: "Adeline",
        gifts: [{ name: "Mystery Item", icon: null }],
      });

      render(<Inventory />);

      expect(screen.getByText("?")).toBeInTheDocument();
    });
  });

  describe("Confirmation Tooltip", () => {
    beforeEach(() => {
      mockGiftSelections.push({
        characterName: "Adeline",
        gifts: [mockItems.Diamond],
      });
    });

    it("shows confirmation tooltip on avatar click", async () => {
      const user = userEvent.setup();
      render(<Inventory />);

      await user.click(screen.getByTestId("avatar-Adeline"));

      await waitFor(() => {
        expect(
          screen.getByText("Give Diamond to Adeline?")
        ).toBeInTheDocument();
      });
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("handles gift confirmation", async () => {
      const user = userEvent.setup();
      render(<Inventory />);

      await user.click(screen.getByTestId("avatar-Adeline"));

      await waitFor(() => {
        expect(screen.getByText("Yes")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Yes"));

      expect(mockSelectGift).toHaveBeenCalledWith("Adeline", mockItems.Diamond);
      expect(mockTrackGift).toHaveBeenCalledWith("Adeline", "Diamond");
    });

    it("handles gift cancellation", async () => {
      const user = userEvent.setup();
      render(<Inventory />);

      await user.click(screen.getByTestId("avatar-Adeline"));

      await waitFor(() => {
        expect(screen.getByText("No")).toBeInTheDocument();
      });

      await user.click(screen.getByText("No"));

      await waitFor(() => {
        expect(
          screen.queryByText("Give Diamond to Adeline?")
        ).not.toBeInTheDocument();
      });
    });

    it("handles backdrop click to close tooltip", async () => {
      const user = userEvent.setup();
      render(<Inventory />);

      await user.click(screen.getByTestId("avatar-Adeline"));

      await waitFor(() => {
        expect(
          screen.getByText("Give Diamond to Adeline?")
        ).toBeInTheDocument();
      });

      // Click the backdrop
      const backdrop = document.querySelector(".fixed.inset-0");
      expect(backdrop).toBeInTheDocument();

      fireEvent.click(backdrop!);

      await waitFor(() => {
        expect(
          screen.queryByText("Give Diamond to Adeline?")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Legacy Data Format Support", () => {
    it("handles legacy gift selection format", () => {
      mockGiftSelections.push({
        characterName: "Adeline",
        gift: mockItems.Diamond, // Legacy single gift format
      } as any);

      render(<Inventory />);

      expect(screen.getByText("Diamond")).toBeInTheDocument();
      expect(screen.getByText("1 ×")).toBeInTheDocument();
      expect(screen.getByTestId("avatar-Adeline")).toBeInTheDocument();
    });

    it("handles mixed legacy and new format", () => {
      mockGiftSelections.push(
        {
          characterName: "Adeline",
          gift: mockItems.Diamond, // Legacy format
        } as any,
        {
          characterName: "March",
          gifts: [mockItems.Apple], // New format
        }
      );

      render(<Inventory />);

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Diamond")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      mockGiftSelections.push({
        characterName: "Adeline",
        gifts: [mockItems.Diamond],
      });
    });

    it("has proper ARIA labels and titles", () => {
      render(<Inventory />);

      const clearButton = screen.getByText("Clear All");
      expect(clearButton).toHaveAttribute("title", "Clear all gift selections");

      const avatar = screen.getByTestId("avatar-Adeline");
      const avatarContainer = avatar.parentElement;
      expect(avatarContainer).toHaveAttribute(
        "title",
        "Click to give Diamond to Adeline"
      );
    });

    it("supports keyboard navigation", () => {
      render(<Inventory />);

      const clearButton = screen.getByText("Clear All");
      expect(clearButton).toBeInTheDocument();

      // Button should be focusable
      clearButton.focus();
      expect(document.activeElement).toBe(clearButton);
    });
  });
});
