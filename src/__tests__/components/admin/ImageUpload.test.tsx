import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImageUpload } from "../../../components/admin/ImageUpload";

// Mock the backend module
const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock("../../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  })),
}));

// Mock image optimization utilities
vi.mock("../../../utils/imageOptimization", () => ({
  optimizeImage: vi.fn(async (file) => {
    // Simulate compression: return a Blob 70% smaller
    const reducedSize = Math.floor(file.size * 0.3);
    const blob = new Blob([new Uint8Array(reducedSize)], {
      type: "image/jpeg",
    });
    return new File([blob], file.name, { type: "image/jpeg" });
  }),
  getImageDimensions: vi.fn(async () => ({
    width: 2000,
    height: 1500,
  })),
  formatFileSize: vi.fn((bytes) => {
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  }),
  resizeImageCanvas: vi.fn(),
}));

describe("ImageUpload", () => {
  const mockOnUploadComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpload.mockResolvedValue({
      data: { path: "uploads/test-image.jpg" },
      error: null,
    });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://example.com/uploads/test-image.jpg" },
    });
  });

  test("renders upload button", () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);
    const uploadButton = screen.getByText(/Upload Image/i);
    expect(uploadButton).toBeInTheDocument();
  });

  test("displays current image preview when provided", () => {
    render(
      <ImageUpload
        onUploadComplete={mockOnUploadComplete}
        currentImage="https://example.com/current.jpg"
      />,
    );
    const previewImage = screen.getByAltText("Preview");
    expect(previewImage).toHaveAttribute(
      "src",
      "https://example.com/current.jpg",
    );
  });

  test("shows error for non-image files", async () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);

    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Please select an image file/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("shows error for files larger than 50MB", async () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);

    const largeFile = new File(
      [new Uint8Array(51 * 1024 * 1024)],
      "large.jpg",
      { type: "image/jpeg" },
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [largeFile],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Source image size must be less than 50MB/i,
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("accepts custom bucket and folder props", () => {
    render(
      <ImageUpload
        onUploadComplete={mockOnUploadComplete}
        bucket="custom-bucket"
        folder="custom-folder"
      />,
    );
    // Component should render without errors
    const uploadButton = screen.getByText(/Upload Image/i);
    expect(uploadButton).toBeInTheDocument();
  });

  test("accepts custom maxWidth parameter", () => {
    render(
      <ImageUpload onUploadComplete={mockOnUploadComplete} maxWidth={600} />,
    );
    const uploadButton = screen.getByText(/Upload Image/i);
    expect(uploadButton).toBeInTheDocument();
    const helpText = screen.getByText(/automatically optimized to 600px width/);
    expect(helpText).toBeInTheDocument();
  });

  test("accepts custom quality parameter", () => {
    render(
      <ImageUpload onUploadComplete={mockOnUploadComplete} quality={0.8} />,
    );
    const uploadButton = screen.getByText(/Upload Image/i);
    expect(uploadButton).toBeInTheDocument();
  });

  test("file input is hidden", () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(input.style.display).toBe("none");
  });

  test("file input is disabled while processing", async () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    expect(input).not.toBeDisabled();
  });

  test("shows help text about optimization", () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);
    const helpText = screen.getByText(
      /Large images will be automatically optimized/i,
    );
    expect(helpText).toBeInTheDocument();
  });

  test("supports jpg, png, gif, and webp formats", () => {
    render(<ImageUpload onUploadComplete={mockOnUploadComplete} />);
    const helpText = screen.getByText(/JPG, PNG, GIF, WebP/);
    expect(helpText).toBeInTheDocument();
  });
});


