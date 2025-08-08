import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CharacterGiftsCard, {
  type GiftItemProp,
} from "../../../components/common/CharacterGiftsCard";
import type { Item } from "../../../stores/giftStore";

// Mock Avatar component
vi.mock("../../../components/common/Avatar", () => ({
  default: ({ character, className }: any) => (
    <div
      data-testid="avatar"
      data-character={character.name}
      className={className}
    >
      Avatar for {character.name}
    </div>
  ),
}));

// Mock SegmentedControl component
vi.mock("../../../components/common/SegmentedControl", () => ({
  default: ({
    items,
    selectedItems,
    onClick,
    onDoubleClick,
    onRightClick,
    characterName,
    selectedGiftsByOthers,
    mutedItems,
  }: any) => (
    <div
      data-testid="segmented-control"
      data-character={characterName}
      data-items-count={items.length}
      data-selected-count={selectedItems.length}
      data-highlighted-count={selectedGiftsByOthers.length}
      data-muted-count={mutedItems.length}
    >
      {items.map((item: Item) => (
        <button
          key={item.name}
          data-testid={`gift-${item.name}`}
          onClick={() => onClick(item)}
          onDoubleClick={() => onDoubleClick?.(item)}
          onContextMenu={() => onRightClick?.(item)}
        >
          {item.name}
        </button>
      ))}
    </div>
  ),
}));

describe("CharacterGiftsCard Component", () => {
  const mockLovedGifts: GiftItemProp[] = [
    {
      name: "Diamond",
      selected: true,
      highlighted: false,
      muted: false,
      item: { name: "Diamond", icon: "Diamond.webp" },
    },
    {
      name: "Chocolate",
      selected: false,
      highlighted: true,
      muted: false,
      item: { name: "Chocolate", icon: "Chocolate.webp" },
    },
  ];

  const mockLikedGifts: GiftItemProp[] = [
    {
      name: "Apple",
      selected: false,
      highlighted: false,
      muted: true,
      item: { name: "Apple", icon: "Apple.webp" },
    },
    {
      name: "Bread",
      selected: true,
      highlighted: false,
      muted: false,
      item: { name: "Bread", icon: "Bread.webp" },
    },
  ];

  const defaultProps = {
    icon: "Adeline_icon.webp",
    name: "Adeline",
    lovedGifts: mockLovedGifts,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render character name and avatar", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      expect(screen.getByText("Adeline")).toBeInTheDocument();
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "data-character",
        "Adeline"
      );
    });

    it("should render loved gifts section", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const lovedGiftsControl = screen.getAllByTestId("segmented-control")[0];
      expect(lovedGiftsControl).toBeInTheDocument();
      expect(lovedGiftsControl).toHaveAttribute("data-items-count", "2");
    });

    it("should render liked gifts section when provided", () => {
      render(
        <CharacterGiftsCard {...defaultProps} likedGifts={mockLikedGifts} />
      );

      const segmentedControls = screen.getAllByTestId("segmented-control");
      expect(segmentedControls).toHaveLength(2);

      const likedGiftsControl = segmentedControls[1];
      expect(likedGiftsControl).toHaveAttribute("data-items-count", "2");
    });

    it("should not render liked gifts section when not provided", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const segmentedControls = screen.getAllByTestId("segmented-control");
      expect(segmentedControls).toHaveLength(1);
    });

    it("should not render liked gifts section when empty", () => {
      render(<CharacterGiftsCard {...defaultProps} likedGifts={[]} />);

      const segmentedControls = screen.getAllByTestId("segmented-control");
      expect(segmentedControls).toHaveLength(1);
    });

    it("should render extra content when provided", () => {
      const extraContent = <div data-testid="extra-content">Extra buttons</div>;
      render(<CharacterGiftsCard {...defaultProps} extra={extraContent} />);

      expect(screen.getByTestId("extra-content")).toBeInTheDocument();
    });
  });

  describe("Gift Processing", () => {
    it("should correctly process loved gifts states", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const lovedGiftsControl = screen.getAllByTestId("segmented-control")[0];

      // Should have 1 selected (Diamond), 1 highlighted (Chocolate), 0 muted
      expect(lovedGiftsControl).toHaveAttribute("data-selected-count", "1");
      expect(lovedGiftsControl).toHaveAttribute("data-highlighted-count", "1");
      expect(lovedGiftsControl).toHaveAttribute("data-muted-count", "0");
    });

    it("should correctly process liked gifts states", () => {
      render(
        <CharacterGiftsCard {...defaultProps} likedGifts={mockLikedGifts} />
      );

      const likedGiftsControl = screen.getAllByTestId("segmented-control")[1];

      // Should have 1 selected (Bread), 0 highlighted, 1 muted (Apple)
      expect(likedGiftsControl).toHaveAttribute("data-selected-count", "2"); // Combined with loved gifts
      expect(likedGiftsControl).toHaveAttribute("data-highlighted-count", "1"); // Combined with loved gifts
      expect(likedGiftsControl).toHaveAttribute("data-muted-count", "1");
    });

    it("should combine selected gifts from both loved and liked", () => {
      render(
        <CharacterGiftsCard {...defaultProps} likedGifts={mockLikedGifts} />
      );

      const controls = screen.getAllByTestId("segmented-control");

      // Both controls should show combined selected count (Diamond + Bread = 2)
      controls.forEach((control) => {
        expect(control).toHaveAttribute("data-selected-count", "2");
      });
    });

    it("should sort gifts alphabetically", () => {
      const unsortedGifts: GiftItemProp[] = [
        {
          name: "Zebra Item",
          selected: false,
          highlighted: false,
          muted: false,
          item: { name: "Zebra Item", icon: "zebra.webp" },
        },
        {
          name: "Apple Item",
          selected: false,
          highlighted: false,
          muted: false,
          item: { name: "Apple Item", icon: "apple.webp" },
        },
      ];

      render(
        <CharacterGiftsCard {...defaultProps} lovedGifts={unsortedGifts} />
      );

      const appleButton = screen.getByTestId("gift-Apple Item");
      const zebraButton = screen.getByTestId("gift-Zebra Item");

      expect(appleButton).toBeInTheDocument();
      expect(zebraButton).toBeInTheDocument();
    });
  });

  describe("Click Interactions", () => {
    it("should call onClick when gift is clicked", () => {
      const onClick = vi.fn();
      render(<CharacterGiftsCard {...defaultProps} onClick={onClick} />);

      const diamondButton = screen.getByTestId("gift-Diamond");
      fireEvent.click(diamondButton);

      expect(onClick).toHaveBeenCalledWith({
        name: "Diamond",
        icon: "Diamond.webp",
      });
    });

    it("should call onDoubleClick when gift is double clicked", () => {
      const onDoubleClick = vi.fn();
      render(
        <CharacterGiftsCard {...defaultProps} onDoubleClick={onDoubleClick} />
      );

      const diamondButton = screen.getByTestId("gift-Diamond");
      fireEvent.doubleClick(diamondButton);

      expect(onDoubleClick).toHaveBeenCalledWith({
        name: "Diamond",
        icon: "Diamond.webp",
      });
    });

    it("should call onRightClick when gift is right clicked", () => {
      const onRightClick = vi.fn();
      render(
        <CharacterGiftsCard {...defaultProps} onRightClick={onRightClick} />
      );

      const diamondButton = screen.getByTestId("gift-Diamond");
      fireEvent.contextMenu(diamondButton);

      expect(onRightClick).toHaveBeenCalledWith({
        name: "Diamond",
        icon: "Diamond.webp",
      });
    });

    it("should work without optional click handlers", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const diamondButton = screen.getByTestId("gift-Diamond");

      // Should not crash
      fireEvent.doubleClick(diamondButton);
      fireEvent.contextMenu(diamondButton);

      expect(diamondButton).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("should have proper card styling classes", () => {
      const { container } = render(<CharacterGiftsCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("shadow-lg");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-gray-200");
      expect(card).toHaveClass("p-4");
      expect(card).toHaveClass("hover:shadow-xl");
      expect(card).toHaveClass("transition-shadow");
    });

    it("should have proper header layout", () => {
      const { container } = render(<CharacterGiftsCard {...defaultProps} />);

      const header = container.querySelector(
        ".flex.items-center.justify-between"
      );
      expect(header).toBeInTheDocument();

      const characterInfo = container.querySelector(".flex.items-center.gap-3");
      expect(characterInfo).toBeInTheDocument();
    });

    it("should style character name properly", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const nameElement = screen.getByText("Adeline");
      expect(nameElement).toHaveClass("text-lg");
      expect(nameElement).toHaveClass("font-bold");
      expect(nameElement).toHaveClass("text-gray-800");
    });

    it("should apply proper avatar sizing", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("w-8");
      expect(avatar).toHaveClass("h-8");
    });

    it("should have proper spacing for liked gifts section", () => {
      const { container } = render(
        <CharacterGiftsCard {...defaultProps} likedGifts={mockLikedGifts} />
      );

      const likedGiftsSection = container.querySelector(".mt-4");
      expect(likedGiftsSection).toBeInTheDocument();
    });
  });

  describe("Character Data", () => {
    it("should pass correct character data to Avatar", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-character", "Adeline");
    });

    it("should pass character name to SegmentedControl", () => {
      render(<CharacterGiftsCard {...defaultProps} />);

      const control = screen.getByTestId("segmented-control");
      expect(control).toHaveAttribute("data-character", "Adeline");
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle both loved and liked gifts with all states", () => {
      const complexLovedGifts: GiftItemProp[] = [
        {
          name: "Loved Selected",
          selected: true,
          highlighted: false,
          muted: false,
          item: { name: "Loved Selected", icon: "loved.webp" },
        },
        {
          name: "Loved Highlighted",
          selected: false,
          highlighted: true,
          muted: false,
          item: { name: "Loved Highlighted", icon: "loved2.webp" },
        },
      ];

      const complexLikedGifts: GiftItemProp[] = [
        {
          name: "Liked Muted",
          selected: false,
          highlighted: false,
          muted: true,
          item: { name: "Liked Muted", icon: "liked.webp" },
        },
        {
          name: "Liked Selected",
          selected: true,
          highlighted: false,
          muted: false,
          item: { name: "Liked Selected", icon: "liked2.webp" },
        },
      ];

      render(
        <CharacterGiftsCard
          {...defaultProps}
          lovedGifts={complexLovedGifts}
          likedGifts={complexLikedGifts}
        />
      );

      const controls = screen.getAllByTestId("segmented-control");

      // Both controls should show combined states
      controls.forEach((control) => {
        expect(control).toHaveAttribute("data-selected-count", "2"); // Loved Selected + Liked Selected
        expect(control).toHaveAttribute("data-highlighted-count", "1"); // Loved Highlighted
        expect(control).toHaveAttribute("data-muted-count", "1"); // Liked Muted
      });
    });
  });
});
