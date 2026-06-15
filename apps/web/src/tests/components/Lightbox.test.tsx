import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Lightbox } from "../../components/common/Lightbox";

describe("Lightbox", () => {
  it("renders the image with the provided src", () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/photo.jpg" alt="Test photo" onClose={onClose} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
    expect(img).toHaveAttribute("alt", "Test photo");
  });

  it("renders a close button", () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/photo.jpg" onClose={onClose} />);
    expect(screen.getByRole("button", { name: /cerrar/i })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/photo.jpg" onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cerrar/i }));
    // Event bubbles from button → overlay, so onClose fires at least once
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when the overlay is clicked", () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/photo.jpg" onClose={onClose} />);
    // Portal renders to document.body, not inside the render container
    const overlay = document.querySelector(".lightbox-overlay");
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when the image itself is clicked", () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/photo.jpg" onClose={onClose} />);
    // alt="" makes img role "presentation"; use DOM query directly
    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    fireEvent.click(img!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/photo.jpg" onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("returns null when src is empty", () => {
    const onClose = vi.fn();
    const { container } = render(<Lightbox src="" onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it("sets data-lightbox-open attribute on html element while open", () => {
    const onClose = vi.fn();
    const { unmount } = render(<Lightbox src="https://example.com/photo.jpg" onClose={onClose} />);
    expect(document.documentElement.getAttribute("data-lightbox-open")).toBe("true");
    unmount();
    expect(document.documentElement.hasAttribute("data-lightbox-open")).toBe(false);
  });
});
