import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Toggle from "../../../components/common/Toggle";

describe("Toggle Component", () => {
  const defaultProps = {
    checked: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render toggle with unchecked state", () => {
      render(<Toggle {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it("should render toggle with checked state", () => {
      render(<Toggle {...defaultProps} checked={true} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("should render with label", () => {
      render(<Toggle {...defaultProps} label="Test Label" />);

      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("should render without label", () => {
      render(<Toggle {...defaultProps} />);

      expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("should call onChange when clicked", () => {
      const onChange = vi.fn();
      render(<Toggle checked={false} onChange={onChange} />);

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("should call onChange with false when unchecking", () => {
      const onChange = vi.fn();
      render(<Toggle checked={true} onChange={onChange} />);

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it("should work when clicking the label", () => {
      const onChange = vi.fn();
      render(<Toggle checked={false} onChange={onChange} label="Click me" />);

      const label = screen.getByText("Click me");
      fireEvent.click(label);

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Visual States", () => {
    it("should have emerald background when checked", () => {
      const { container } = render(<Toggle {...defaultProps} checked={true} />);

      const toggleBackground = container.querySelector(".bg-emerald-500");
      expect(toggleBackground).toBeInTheDocument();
    });

    it("should have gray background when unchecked", () => {
      const { container } = render(
        <Toggle {...defaultProps} checked={false} />
      );

      const toggleBackground = container.querySelector(".bg-gray-300");
      expect(toggleBackground).toBeInTheDocument();
    });

    it("should translate toggle switch when checked", () => {
      const { container } = render(<Toggle {...defaultProps} checked={true} />);

      const toggleSwitch = container.querySelector(".translate-x-5");
      expect(toggleSwitch).toBeInTheDocument();
    });

    it("should not translate toggle switch when unchecked", () => {
      const { container } = render(
        <Toggle {...defaultProps} checked={false} />
      );

      const toggleSwitch = container.querySelector(".translate-x-0");
      expect(toggleSwitch).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper checkbox role", () => {
      render(<Toggle {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("should have screen reader only class for checkbox", () => {
      const { container } = render(<Toggle {...defaultProps} />);

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toHaveClass("sr-only");
    });

    it("should associate label with checkbox", () => {
      render(<Toggle {...defaultProps} label="Test Toggle" />);

      const label = screen.getByText("Test Toggle");
      const checkbox = screen.getByRole("checkbox");

      // The label should contain the checkbox
      expect(label.closest("label")).toContainElement(checkbox);
    });

    it("should prevent text selection on label", () => {
      render(<Toggle {...defaultProps} label="Test Label" />);

      const labelText = screen.getByText("Test Label");
      expect(labelText).toHaveClass("select-none");
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should have correct base classes", () => {
      const { container } = render(<Toggle {...defaultProps} />);

      const label = container.querySelector("label");
      expect(label).toHaveClass("flex");
      expect(label).toHaveClass("items-center");
      expect(label).toHaveClass("gap-2");
      expect(label).toHaveClass("cursor-pointer");
    });

    it("should have transition classes for smooth animation", () => {
      const { container } = render(<Toggle {...defaultProps} />);

      const toggleBackground = container.querySelector(".transition-colors");
      const toggleSwitch = container.querySelector(".transition-transform");

      expect(toggleBackground).toBeInTheDocument();
      expect(toggleSwitch).toBeInTheDocument();
    });

    it("should have proper sizing classes", () => {
      const { container } = render(<Toggle {...defaultProps} />);

      const toggleContainer = container.querySelector(".w-11.h-6");
      const toggleSwitch = container.querySelector(".w-5.h-5");

      expect(toggleContainer).toBeInTheDocument();
      expect(toggleSwitch).toBeInTheDocument();
    });
  });
});
