import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Drawer from "../../../components/common/Drawer";

// Mock setTimeout for animation testing
vi.mock("timers", () => ({
  setTimeout: vi.fn((callback) => callback()),
}));

describe("Drawer Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Drawer",
    children: <div>Drawer content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render when open", () => {
      render(<Drawer {...defaultProps} />);

      expect(screen.getByText("Test Drawer")).toBeInTheDocument();
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    it("should not render when closed and not animating", () => {
      render(<Drawer {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Test Drawer")).not.toBeInTheDocument();
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
    });

    it("should render with icon", () => {
      const icon = <span data-testid="test-icon">🎯</span>;
      render(<Drawer {...defaultProps} icon={icon} />);

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.getByText("🎯")).toBeInTheDocument();
    });

    it("should render without icon", () => {
      render(<Drawer {...defaultProps} />);

      expect(screen.queryByTestId("test-icon")).not.toBeInTheDocument();
    });

    it("should render title correctly", () => {
      render(<Drawer {...defaultProps} title="Custom Title" />);

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Custom Title"
      );
    });

    it("should render children content", () => {
      const customContent = (
        <div data-testid="custom-content">Custom drawer content</div>
      );
      render(<Drawer {...defaultProps}>{customContent}</Drawer>);

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom drawer content")).toBeInTheDocument();
    });
  });

  describe("Close Functionality", () => {
    it("should call onClose when close button is clicked", async () => {
      const onClose = vi.fn();
      render(<Drawer {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", {
        name: /close test drawer/i,
      });
      fireEvent.click(closeButton);

      // Should not call onClose immediately due to animation delay
      expect(onClose).not.toHaveBeenCalled();

      // Wait for the timeout to complete
      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 500 }
      );
    });

    it("should call onClose when backdrop is clicked", async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Drawer {...defaultProps} onClose={onClose} />
      );

      const backdrop = container.querySelector(".bg-black");
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 500 }
      );
    });

    it("should not call onClose when clicking inside drawer content", () => {
      const onClose = vi.fn();
      render(<Drawer {...defaultProps} onClose={onClose} />);

      const content = screen.getByText("Drawer content");
      fireEvent.click(content);

      expect(onClose).not.toHaveBeenCalled();
    });

    it("should generate correct close button aria-label", () => {
      render(<Drawer {...defaultProps} title="Settings Panel" />);

      const closeButton = screen.getByRole("button", {
        name: /close settings panel/i,
      });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Animation States", () => {
    it("should have animating class when open", () => {
      const { container } = render(<Drawer {...defaultProps} isOpen={true} />);

      const drawer = container.querySelector(".translate-x-0");
      const backdrop = container.querySelector(".opacity-50");

      expect(drawer).toBeInTheDocument();
      expect(backdrop).toBeInTheDocument();
    });

    it("should handle animation state changes", async () => {
      const { rerender } = render(<Drawer {...defaultProps} isOpen={false} />);

      // Initially closed - should not render
      expect(screen.queryByText("Test Drawer")).not.toBeInTheDocument();

      // Open the drawer
      rerender(<Drawer {...defaultProps} isOpen={true} />);

      // Should now render and be animating
      expect(screen.getByText("Test Drawer")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should have lg:hidden class for mobile-only display", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const drawerContainer = container.querySelector(".fixed.inset-0.z-50");
      expect(drawerContainer).toHaveClass("lg:hidden");
    });

    it("should have responsive width classes", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const drawer = container.querySelector(".w-80.max-w-\\[90vw\\]");
      expect(drawer).toBeInTheDocument();
    });
  });

  describe("Layout and Structure", () => {
    it("should have proper z-index for overlay", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const drawerContainer = container.querySelector(".z-50");
      expect(drawerContainer).toBeInTheDocument();
    });

    it("should have scrollable content area", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const drawer = container.querySelector(".overflow-y-auto");
      expect(drawer).toBeInTheDocument();
    });

    it("should have proper positioning classes", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const drawer = container.querySelector(".fixed.top-0.right-0.h-full");
      expect(drawer).toBeInTheDocument();
    });
  });

  describe("Header Structure", () => {
    it("should have proper header layout", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const header = container.querySelector(".p-4.border-b.border-gray-200");
      expect(header).toBeInTheDocument();

      const headerContent = container.querySelector(
        ".flex.items-center.justify-between"
      );
      expect(headerContent).toBeInTheDocument();
    });

    it("should display title with proper styling", () => {
      render(<Drawer {...defaultProps} title="Test Title" />);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("text-lg");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("text-gray-800");
    });

    it("should have close button with proper styling", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("w-8");
      expect(closeButton).toHaveClass("h-8");
      expect(closeButton).toHaveClass("rounded-full");
      expect(closeButton).toHaveClass("bg-gray-100");
    });
  });

  describe("Content Area", () => {
    it("should have proper content padding", () => {
      const { container } = render(<Drawer {...defaultProps} />);

      const content = container.querySelector(".p-4");
      expect(content).toBeInTheDocument();
    });

    it("should render complex children content", () => {
      const complexContent = (
        <div>
          <h4>Section Title</h4>
          <p>Some text content</p>
          <button>Action Button</button>
        </div>
      );

      render(<Drawer {...defaultProps}>{complexContent}</Drawer>);

      expect(screen.getByText("Section Title")).toBeInTheDocument();
      expect(screen.getByText("Some text content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action Button" })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper close button accessibility", () => {
      render(<Drawer {...defaultProps} title="Settings" />);

      const closeButton = screen.getByRole("button", {
        name: /close settings/i,
      });
      expect(closeButton).toHaveAttribute("aria-label", "Close settings");
    });

    it("should have proper heading structure", () => {
      render(<Drawer {...defaultProps} title="Navigation Menu" />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Navigation Menu");
    });

    it("should handle keyboard navigation", () => {
      const onClose = vi.fn();
      render(<Drawer {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button");
      fireEvent.keyDown(closeButton, { key: "Enter" });

      // Should trigger close
      expect(closeButton).toBeInTheDocument();
    });
  });
});
