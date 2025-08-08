import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SegmentedControl from "../../../components/common/SegmentedControl";
import type { Item } from "../../../stores/giftStore";

// Mock the icons utility
vi.mock("../../../utils/icons", () => ({
  getItemIcon: vi.fn((icon: string) => `/mocked/path/to/${icon}`),
}));

// Mock ItemButton component
vi.mock("../../../components/common/ItemButton", () => ({
  default: ({
    icon,
    label,
    isSelected,
    isDisabled,
    isSelectedByOthers,
    isMuted,
    onClick,
    onDoubleClick,
    onRightClick,
    onKeyDown,
    ariaLabel,
    title,
  }: any) => (
    <button
      data-testid={`item-button-${label}`}
      data-selected={isSelected}
      data-disabled={isDisabled}
      data-selected-by-others={isSelectedByOthers}
      data-muted={isMuted}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onRightClick}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      title={title}
      disabled={isDisabled}
    >
      {icon && <img src={icon} alt={label} />}
      {label}
    </button>
  ),
}));

describe("SegmentedControl Component", () => {
  const mockItems: Item[] = [
    { name: "Apple", icon: "Apple.webp" },
    { name: "Bread", icon: "Bread.webp" },
    { name: "Chocolate", icon: "Chocolate.webp" },
    { name: "Unreleased Item", icon: null },
  ];

  const defaultProps = {
    items: mockItems,
    selectedItems: [],
    onClick: vi.fn(),
    characterName: "Test Character",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all items", () => {
      render(<SegmentedControl {...defaultProps} />);

      mockItems.forEach((item) => {
        expect(
          screen.getByTestId(`item-button-${item.name}`)
        ).toBeInTheDocument();
      });
    });

    it("should render with grid layout", () => {
      const { container } = render(<SegmentedControl {...defaultProps} />);

      const gridContainer = container.querySelector(".grid.grid-cols-5");
      expect(gridContainer).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <SegmentedControl {...defaultProps} className="custom-class" />
      );

      const gridContainer = container.querySelector(".custom-class");
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Item States", () => {
    it("should show selected state for selected items", () => {
      const selectedItems = [mockItems[0]]; // Apple
      render(
        <SegmentedControl {...defaultProps} selectedItems={selectedItems} />
      );

      const appleButton = screen.getByTestId("item-button-Apple");
      expect(appleButton).toHaveAttribute("data-selected", "true");

      const breadButton = screen.getByTestId("item-button-Bread");
      expect(breadButton).toHaveAttribute("data-selected", "false");
    });

    it("should show disabled state for unreleased items", () => {
      render(<SegmentedControl {...defaultProps} />);

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      expect(unreleasedButton).toHaveAttribute("data-disabled", "true");
      expect(unreleasedButton).toBeDisabled();
    });

    it("should show selected by others state", () => {
      const selectedGiftsByOthers = ["Apple"];
      render(
        <SegmentedControl
          {...defaultProps}
          selectedGiftsByOthers={selectedGiftsByOthers}
        />
      );

      const appleButton = screen.getByTestId("item-button-Apple");
      expect(appleButton).toHaveAttribute("data-selected-by-others", "true");
    });

    it("should show muted state", () => {
      const mutedItems = ["Bread"];
      render(<SegmentedControl {...defaultProps} mutedItems={mutedItems} />);

      const breadButton = screen.getByTestId("item-button-Bread");
      expect(breadButton).toHaveAttribute("data-muted", "true");
    });
  });

  describe("Click Interactions", () => {
    it("should call onClick for items with icons", () => {
      const onClick = vi.fn();
      render(<SegmentedControl {...defaultProps} onClick={onClick} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.click(appleButton);

      expect(onClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("should not call onClick for items without icons", () => {
      const onClick = vi.fn();
      render(<SegmentedControl {...defaultProps} onClick={onClick} />);

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      fireEvent.click(unreleasedButton);

      expect(onClick).not.toHaveBeenCalled();
    });

    it("should call onDoubleClick for items with icons", () => {
      const onDoubleClick = vi.fn();
      render(
        <SegmentedControl {...defaultProps} onDoubleClick={onDoubleClick} />
      );

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.doubleClick(appleButton);

      expect(onDoubleClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("should not call onDoubleClick for items without icons", () => {
      const onDoubleClick = vi.fn();
      render(
        <SegmentedControl {...defaultProps} onDoubleClick={onDoubleClick} />
      );

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      fireEvent.doubleClick(unreleasedButton);

      expect(onDoubleClick).not.toHaveBeenCalled();
    });

    it("should call onRightClick for items with icons", () => {
      const onRightClick = vi.fn();
      render(
        <SegmentedControl {...defaultProps} onRightClick={onRightClick} />
      );

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.contextMenu(appleButton);

      expect(onRightClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("should not call onRightClick for items without icons", () => {
      const onRightClick = vi.fn();
      render(
        <SegmentedControl {...defaultProps} onRightClick={onRightClick} />
      );

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      fireEvent.contextMenu(unreleasedButton);

      expect(onRightClick).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Interactions", () => {
    it("should handle Enter key for items with icons", () => {
      const onClick = vi.fn();
      render(<SegmentedControl {...defaultProps} onClick={onClick} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.keyDown(appleButton, { key: "Enter" });

      expect(onClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("should handle Space key for items with icons", () => {
      const onClick = vi.fn();
      render(<SegmentedControl {...defaultProps} onClick={onClick} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.keyDown(appleButton, { key: " " });

      expect(onClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("should not handle keyboard events for items without icons", () => {
      const onClick = vi.fn();
      render(<SegmentedControl {...defaultProps} onClick={onClick} />);

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      fireEvent.keyDown(unreleasedButton, { key: "Enter" });

      expect(onClick).not.toHaveBeenCalled();
    });

    it("should not handle other keys", () => {
      const onClick = vi.fn();
      render(<SegmentedControl {...defaultProps} onClick={onClick} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.keyDown(appleButton, { key: "Tab" });

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label for normal items", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      expect(appleButton).toHaveAttribute(
        "aria-label",
        "Select Apple for Test Character"
      );
    });

    it("should have proper aria-label for unreleased items", () => {
      render(<SegmentedControl {...defaultProps} />);

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      expect(unreleasedButton).toHaveAttribute(
        "aria-label",
        "Unreleased item: Unreleased Item for Test Character"
      );
    });

    it("should have proper title for normal items", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      expect(appleButton).toHaveAttribute("title", "Apple");
    });

    it("should have proper title for unreleased items", () => {
      render(<SegmentedControl {...defaultProps} />);

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      expect(unreleasedButton).toHaveAttribute(
        "title",
        "Unreleased Item (Unreleased)"
      );
    });
  });

  describe("Icon Handling", () => {
    it("should pass icon URL to ItemButton for items with icons", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      const img = appleButton.querySelector("img");
      expect(img).toHaveAttribute("src", "/mocked/path/to/Apple.webp");
    });

    it("should not pass icon to ItemButton for items without icons", () => {
      render(<SegmentedControl {...defaultProps} />);

      const unreleasedButton = screen.getByTestId(
        "item-button-Unreleased Item"
      );
      const img = unreleasedButton.querySelector("img");
      expect(img).not.toBeInTheDocument();
    });
  });

  describe("Optional Props", () => {
    it("should work without onDoubleClick", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.doubleClick(appleButton);

      // Should not crash
      expect(appleButton).toBeInTheDocument();
    });

    it("should work without onRightClick", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      fireEvent.contextMenu(appleButton);

      // Should not crash
      expect(appleButton).toBeInTheDocument();
    });

    it("should work with empty selectedGiftsByOthers", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      expect(appleButton).toHaveAttribute("data-selected-by-others", "false");
    });

    it("should work with empty mutedItems", () => {
      render(<SegmentedControl {...defaultProps} />);

      const appleButton = screen.getByTestId("item-button-Apple");
      expect(appleButton).toHaveAttribute("data-muted", "false");
    });
  });
});
