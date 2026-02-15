import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  tinymceImageUploadHandler,
  createTinyMCEConfig,
} from "../../utils/tinymceHelpers";

// Mock the backend module
const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  })),
}));

describe("tinymceHelpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpload.mockResolvedValue({
      data: { path: "editor/test-image.jpg" },
      error: null,
    });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://example.com/editor/test-image.jpg" },
    });
  });

  describe("tinymceImageUploadHandler", () => {
    const mockBlobInfo = {
      blob: () => new Blob(["test"], { type: "image/jpeg" }),
      filename: () => "test-image.jpg",
    };
    const mockProgress = vi.fn();

    test("uploads image successfully", async () => {
      const result = await tinymceImageUploadHandler(
        mockBlobInfo,
        mockProgress,
      );

      expect(mockUpload).toHaveBeenCalled();
      expect(mockGetPublicUrl).toHaveBeenCalledWith("editor/test-image.jpg");
      expect(result).toBe("https://example.com/editor/test-image.jpg");
      expect(mockProgress).toHaveBeenCalledWith(100);
    });

    test("uses custom folder", async () => {
      await tinymceImageUploadHandler(
        mockBlobInfo,
        mockProgress,
        "custom-folder",
      );

      const uploadCall = mockUpload.mock.calls[0];
      expect(uploadCall[0]).toContain("custom-folder/");
    });

    test("uses custom bucket", async () => {
      await tinymceImageUploadHandler(
        mockBlobInfo,
        mockProgress,
        "editor",
        "custom-bucket",
      );

      expect(mockUpload).toHaveBeenCalled();
    });

    test("generates unique filenames", async () => {
      await tinymceImageUploadHandler(mockBlobInfo, mockProgress);
      await tinymceImageUploadHandler(mockBlobInfo, mockProgress);

      const call1 = mockUpload.mock.calls[0][0];
      const call2 = mockUpload.mock.calls[1][0];

      expect(call1).not.toBe(call2);
    });

    test("preserves file extension", async () => {
      const pngBlobInfo = {
        blob: () => new Blob(["test"], { type: "image/png" }),
        filename: () => "test-image.png",
      };

      await tinymceImageUploadHandler(pngBlobInfo, mockProgress);

      const uploadCall = mockUpload.mock.calls[0][0];
      expect(uploadCall).toMatch(/\.png$/);
    });

    test("handles upload error", async () => {
      mockUpload.mockResolvedValue({
        data: null,
        error: { message: "Upload failed" },
      });

      await expect(
        tinymceImageUploadHandler(mockBlobInfo, mockProgress),
      ).rejects.toThrow("Upload failed");
    });

    test("handles exception during upload", async () => {
      mockUpload.mockRejectedValue(new Error("Network error"));

      await expect(
        tinymceImageUploadHandler(mockBlobInfo, mockProgress),
      ).rejects.toThrow("Network error");
    });

    test("handles filename without extension", async () => {
      const noExtBlobInfo = {
        blob: () => new Blob(["test"], { type: "image/png" }),
        filename: () => "test-image",
      };

      await tinymceImageUploadHandler(noExtBlobInfo, mockProgress);

      const uploadCall = mockUpload.mock.calls[0][0];
      // When there's no extension, it uses the full filename as extension
      expect(uploadCall).toContain("editor/");
      expect(uploadCall).toContain(".test-image");
    });
  });

  describe("createTinyMCEConfig", () => {
    test("returns config object with required properties", () => {
      const config = createTinyMCEConfig();

      expect(config).toHaveProperty("height");
      expect(config).toHaveProperty("menubar");
      expect(config).toHaveProperty("plugins");
      expect(config).toHaveProperty("toolbar");
      expect(config).toHaveProperty("images_upload_handler");
    });

    test("sets correct height", () => {
      const config = createTinyMCEConfig();
      expect(config.height).toBe(500);
    });

    test("disables menubar", () => {
      const config = createTinyMCEConfig();
      expect(config.menubar).toBe(false);
    });

    test("includes required plugins", () => {
      const config = createTinyMCEConfig();
      const requiredPlugins = [
        "image",
        "link",
        "code",
        "lists",
        "table",
        "help",
      ];

      requiredPlugins.forEach((plugin) => {
        expect(config.plugins).toContain(plugin);
      });
    });

    test("includes image toolbar buttons", () => {
      const config = createTinyMCEConfig();
      expect(config.toolbar).toContain("image");
      expect(config.toolbar).toContain("link");
    });

    test("enables automatic uploads", () => {
      const config = createTinyMCEConfig();
      expect(config.automatic_uploads).toBe(true);
    });

    test("configures file picker for images only", () => {
      const config = createTinyMCEConfig();
      expect(config.file_picker_types).toBe("image");
    });

    test("enables image properties", () => {
      const config = createTinyMCEConfig();
      expect(config.image_title).toBe(true);
      expect(config.image_description).toBe(true);
      expect(config.image_dimensions).toBe(true);
    });

    test("provides image class options", () => {
      const config = createTinyMCEConfig();
      expect(config.image_class_list).toHaveLength(3);
      expect(config.image_class_list[0]).toEqual({
        title: "Responsive",
        value: "img-fluid",
      });
    });

    test("creates upload handler with custom folder", () => {
      const config = createTinyMCEConfig("custom-folder");
      expect(config.images_upload_handler).toBeDefined();
      expect(typeof config.images_upload_handler).toBe("function");
    });

    test("upload handler is a function", () => {
      const config = createTinyMCEConfig();
      expect(typeof config.images_upload_handler).toBe("function");
    });
  });
});
