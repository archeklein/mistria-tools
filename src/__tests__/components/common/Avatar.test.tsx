import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Avatar from "../../../components/common/Avatar";

// Mock the icons utility
vi.mock("../../../utils/icons", () => ({
  getCharacterIcon: vi.fn((icon: string) => `/mocked/path/to/${icon}`),
}));

describe("Avatar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render avatar with character object", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      render(<Avatar character={character} />);

      const img = screen.getByRole("img", { name: "Adeline icon" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/mocked/path/to/Adeline_icon.webp");
      expect(img).toHaveAttribute("title", "Adeline");
    });

    it("should render fallback with character name string", () => {
      render(<Avatar character="March" />);

      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByTitle("March")).toBeInTheDocument();
    });

    it("should render fallback when character object has no icon", () => {
      const character = {
        name: "TestCharacter",
        icon: "",
      };

      render(<Avatar character={character} />);

      expect(screen.getByText("T")).toBeInTheDocument();
      expect(screen.getByTitle("TestCharacter")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      const { container } = render(
        <Avatar character={character} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Image Error Handling", () => {
    it("should show fallback when image fails to load", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      render(<Avatar character={character} />);

      const img = screen.getByRole("img", { name: "Adeline icon" });

      // Simulate image load error
      fireEvent.error(img);

      // Image should be hidden
      expect(img).toHaveStyle("display: none");
    });

    it("should show fallback div when image errors and fallback exists", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      const { container } = render(<Avatar character={character} />);
      const img = screen.getByRole("img", { name: "Adeline icon" });

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
  });

  describe("Character Name Handling", () => {
    it("should handle character name with spaces", () => {
      const character = {
        name: "Character Name",
        icon: "icon.webp",
      };

      render(<Avatar character={character} />);

      const img = screen.getByRole("img", { name: "Character Name icon" });
      expect(img).toHaveAttribute("title", "Character Name");
    });

    it("should show first character of name in fallback", () => {
      render(<Avatar character="TestName" />);

      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for image", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      render(<Avatar character={character} />);

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Adeline icon");
    });

    it("should have title attribute for fallback", () => {
      render(<Avatar character="March" />);

      expect(screen.getByTitle("March")).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should have default classes", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      const { container } = render(<Avatar character={character} />);

      expect(container.firstChild).toHaveClass("overflow-hidden");
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("items-center");
      expect(container.firstChild).toHaveClass("justify-center");
    });

    it("should merge custom className with default classes", () => {
      const character = {
        name: "Adeline",
        icon: "Adeline_icon.webp",
      };

      const { container } = render(
        <Avatar character={character} className="w-10 h-10 rounded-full" />
      );

      expect(container.firstChild).toHaveClass("overflow-hidden");
      expect(container.firstChild).toHaveClass("w-10");
      expect(container.firstChild).toHaveClass("h-10");
      expect(container.firstChild).toHaveClass("rounded-full");
    });

    it("should apply emerald color to fallback text", () => {
      render(<Avatar character="March" />);

      const fallbackText = screen.getByText("M");
      expect(fallbackText).toHaveClass("text-emerald-600");
      expect(fallbackText).toHaveClass("text-lg");
      expect(fallbackText).toHaveClass("font-bold");
    });
  });
});
