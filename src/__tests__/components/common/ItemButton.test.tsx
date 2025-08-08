import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ItemButton from "../../../components/common/ItemButton";

describe("ItemButton Component", () => {
  const defaultProps = {
    label: "Test Item",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with label", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Test Item" });
      expect(button).toBeInTheDocument();
    });

    it("should render with custom aria-label", () => {
      render(<ItemButton {...defaultProps} ariaLabel="Custom Label" />);

      const button = screen.getByRole("button", { name: "Custom Label" });
      expect(button).toBeInTheDocument();
    });

    it("should render with custom title", () => {
      render(<ItemButton {...defaultProps} title="Custom Title" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Custom Title");
    });

    it("should use label as default title and aria-label", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Test Item");
      expect(button).toHaveAttribute("aria-label", "Test Item");
    });
  });

  describe("Icon Handling", () => {
    it("should render image icon", () => {
      render(<ItemButton {...defaultProps} icon="/test-icon.png" />);

      const img = screen.getByRole("img", { name: "Test Item" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/test-icon.png");
    });

    it("should render React node icon", () => {
      const IconComponent = <span data-testid="custom-icon">🎯</span>;
      render(<ItemButton {...defaultProps} icon={IconComponent} />);

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should render fallback question mark when no icon provided", () => {
      render(<ItemButton {...defaultProps} />);

      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("should handle image load error", () => {
      const { container } = render(
        <ItemButton {...defaultProps} icon="/broken-image.png" />
      );

      const img = screen.getByRole("img");

      // Mock the nextElementSibling behavior
      const fallbackDiv = container.querySelector(".hidden");
      if (fallbackDiv) {
        Object.defineProperty(img, "nextElementSibling", {
          value: fallbackDiv,
          writable: true,
        });
      }

      fireEvent.error(img);

      expect(img).toHaveStyle("display: none");
    });

    it("should show hidden fallback for string icons", () => {
      const { container } = render(
        <ItemButton {...defaultProps} icon="/test-icon.png" />
      );

      const fallback = container.querySelector(".hidden");
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent("?");
    });
  });

  describe("Click Interactions", () => {
    it("should call onClick when clicked", () => {
      const onClick = vi.fn();
      render(<ItemButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onDoubleClick when double clicked", () => {
      const onDoubleClick = vi.fn();
      render(<ItemButton {...defaultProps} onDoubleClick={onDoubleClick} />);

      const button = screen.getByRole("button");
      fireEvent.doubleClick(button);

      expect(onDoubleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onRightClick and prevent context menu", () => {
      const onRightClick = vi.fn();
      render(<ItemButton {...defaultProps} onRightClick={onRightClick} />);

      const button = screen.getByRole("button");
      const contextMenuEvent = fireEvent.contextMenu(button);

      expect(onRightClick).toHaveBeenCalledTimes(1);
      expect(contextMenuEvent).toBe(false); // preventDefault was called
    });

    it("should not call onClick when disabled", () => {
      const onClick = vi.fn();
      render(
        <ItemButton {...defaultProps} onClick={onClick} isDisabled={true} />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });

    it("should not call onDoubleClick when disabled", () => {
      const onDoubleClick = vi.fn();
      render(
        <ItemButton
          {...defaultProps}
          onDoubleClick={onDoubleClick}
          isDisabled={true}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.doubleClick(button);

      expect(onDoubleClick).not.toHaveBeenCalled();
    });

    it("should not call onRightClick when disabled", () => {
      const onRightClick = vi.fn();
      render(
        <ItemButton
          {...defaultProps}
          onRightClick={onRightClick}
          isDisabled={true}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.contextMenu(button);

      expect(onRightClick).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Interactions", () => {
    it("should call onKeyDown when key is pressed", () => {
      const onKeyDown = vi.fn();
      render(<ItemButton {...defaultProps} onKeyDown={onKeyDown} />);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: "Enter" })
      );
    });

    it("should not call onKeyDown when disabled", () => {
      const onKeyDown = vi.fn();
      render(
        <ItemButton {...defaultProps} onKeyDown={onKeyDown} isDisabled={true} />
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(onKeyDown).not.toHaveBeenCalled();
    });
  });

  describe("Visual States", () => {
    it("should apply disabled styles when disabled", () => {
      render(<ItemButton {...defaultProps} isDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("bg-gray-100");
      expect(button).toHaveClass("text-gray-400");
      expect(button).toHaveClass("border-gray-200");
      expect(button).toHaveClass("cursor-not-allowed");
      expect(button).toHaveClass("opacity-60");
    });

    it("should apply selected by others styles", () => {
      render(<ItemButton {...defaultProps} isSelectedByOthers={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-pink-400");
      expect(button).toHaveClass("text-white");
      expect(button).toHaveClass("border-pink-400");
      expect(button).toHaveClass("shadow-md");
    });

    it("should apply selected styles with inset shadow", () => {
      render(<ItemButton {...defaultProps} isSelected={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-[inset_0_0_0_2px_#059669]");
      expect(button).toHaveClass("border-none");
    });

    it("should apply muted styles", () => {
      const { container } = render(
        <ItemButton {...defaultProps} isMuted={true} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("opacity-40");

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-200");
    });

    it("should apply normal hover styles when not disabled or selected by others", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white");
      expect(button).toHaveClass("text-gray-700");
      expect(button).toHaveClass("border-gray-300");
      expect(button).toHaveClass("hover:border-pink-300");
      expect(button).toHaveClass("hover:bg-pink-50");
    });
  });

  describe("Selection Badge", () => {
    it("should show selection badge when selected and not disabled or selected by others", () => {
      render(<ItemButton {...defaultProps} isSelected={true} />);

      const badge = screen
        .getByRole("button")
        .parentElement?.querySelector(".absolute.-top-1.-right-1");
      expect(badge).toBeInTheDocument();

      const checkIcon = badge?.querySelector("svg");
      expect(checkIcon).toBeInTheDocument();
    });

    it("should not show badge when not selected", () => {
      render(<ItemButton {...defaultProps} isSelected={false} />);

      const badge = screen
        .getByRole("button")
        .parentElement?.querySelector(".absolute.-top-1.-right-1");
      expect(badge).not.toBeInTheDocument();
    });

    it("should not show badge when selected by others", () => {
      render(
        <ItemButton
          {...defaultProps}
          isSelected={true}
          isSelectedByOthers={true}
        />
      );

      const badge = screen
        .getByRole("button")
        .parentElement?.querySelector(".absolute.-top-1.-right-1");
      expect(badge).not.toBeInTheDocument();
    });

    it("should not show badge when disabled", () => {
      render(
        <ItemButton {...defaultProps} isSelected={true} isDisabled={true} />
      );

      const badge = screen
        .getByRole("button")
        .parentElement?.querySelector(".absolute.-top-1.-right-1");
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe("Custom Sizing", () => {
    it("should apply default width and height", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-10");
      expect(button).toHaveClass("h-10");
    });

    it("should apply custom width and height", () => {
      render(<ItemButton {...defaultProps} width="w-12" height="h-12" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-12");
      expect(button).toHaveClass("h-12");
    });
  });

  describe("Accessibility", () => {
    it("should have proper tabindex when enabled", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("tabindex", "0");
    });

    it("should have negative tabindex when disabled", () => {
      render(<ItemButton {...defaultProps} isDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("tabindex", "-1");
    });

    it("should have proper role", () => {
      render(<ItemButton {...defaultProps} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have transition classes for smooth interactions", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-all");
      expect(button).toHaveClass("duration-200");
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should apply custom className", () => {
      render(<ItemButton {...defaultProps} className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should have base layout classes", () => {
      render(<ItemButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-xs");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("should apply muted opacity to icon when muted", () => {
      const { container } = render(
        <ItemButton {...defaultProps} icon="/test-icon.png" isMuted={true} />
      );

      const img = container.querySelector("img");
      expect(img).toHaveClass("opacity-50");
    });
  });
});
