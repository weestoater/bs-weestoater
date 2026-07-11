import { useState, useEffect, useRef } from "react";
import { getSupabaseClient } from "../../../backend/index.js";
import { MediaLibraryItem } from "../../types/weecms";
import { useSEO } from "../../utils/useSEO";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

export const MediaLibrary = () => {
  useSEO({
    title: "Media Library",
    description: "Manage media files and images",
  });

  const [mediaItems, setMediaItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<MediaLibraryItem | null>(
    null,
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const supabase = getSupabaseClient();

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Load media items
  useEffect(() => {
    loadMedia();
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMedia() {
    try {
      setLoading(true);
      let query = supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterType !== "all") {
        query = query.eq("file_type", filterType);
      }

      if (filterFolder !== "all") {
        query = query.eq("folder", filterFolder);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMediaItems(data || []);
    } catch (error) {
      console.error("Error loading media:", error);
      setMessage({ type: "error", text: "Failed to load media" });
    } finally {
      setLoading(false);
    }
  }

  async function loadFolders() {
    try {
      const { data, error } = await supabase
        .from("media_library")
        .select("folder")
        .not("folder", "is", null);

      if (error) throw error;

      const uniqueFolders = [
        ...new Set(data?.map((item) => item.folder).filter(Boolean)),
      ] as string[];
      setFolders(uniqueFolders.sort());
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map((file) => uploadFile(file));
      await Promise.all(uploadPromises);
      setMessage({
        type: "success",
        text: `Successfully uploaded ${files.length} file(s)`,
      });
      loadMedia();
      loadFolders();
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage({ type: "error", text: "Failed to upload files" });
    } finally {
      setUploading(false);
    }
  }

  async function uploadFile(file: File) {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;
    const folder = filterFolder !== "all" ? filterFolder : "uploads";
    const storagePath = `${folder}/${filename}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(storagePath);

    // Determine file type
    let fileType: MediaLibraryItem["file_type"] = "other";
    if (file.type.startsWith("image/")) fileType = "image";
    else if (file.type.startsWith("video/")) fileType = "video";
    else if (file.type.startsWith("audio/")) fileType = "audio";
    else if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    )
      fileType = "document";

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    if (fileType === "image") {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    }

    // Create database record
    const { error: dbError } = await supabase.from("media_library").insert({
      filename,
      original_filename: file.name,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      storage_bucket: "images",
      public_url: publicUrl,
      folder: folder,
      width,
      height,
      usage_count: 0,
    });

    if (dbError) throw dbError;
  }

  function getImageDimensions(
    file: File,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleDelete(item: MediaLibraryItem) {
    if (
      !confirm(
        `Are you sure you want to delete "${item.original_filename}"?\n\nThis action cannot be undone.${
          item.usage_count > 0
            ? `\n\nWarning: This file is used in ${item.usage_count} place(s)!`
            : ""
        }`,
      )
    ) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(item.storage_bucket)
        .remove([item.storage_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("media_library")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;

      setMessage({ type: "success", text: "File deleted successfully" });
      loadMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      setMessage({ type: "error", text: "Failed to delete file" });
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "URL copied to clipboard" });
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }

  // Filter items based on search
  const filteredItems = mediaItems.filter((item) =>
    searchTerm
      ? item.original_filename
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
      : true,
  );

  return (
    <div className="container-fluid mt-4">
      <AdminPageHeader
        title="Media Library"
        icon="bi-images"
        description="Manage images and media files"
        backLink="/admin"
        backLabel="Dashboard"
      />

      {message && (
        <div
          className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
            aria-label="Close alert"
          ></button>
        </div>
      )}

      {/* Upload Area */}
      <div className="card mb-4">
        <div className="card-body">
          <div
            className={`border border-2 border-dashed rounded p-4 text-center ${
              dragActive ? "border-primary bg-light" : "border-secondary"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <i className="bi bi-cloud-upload fs-1 text-muted mb-3 d-block"></i>
            <h5>{uploading ? "Uploading..." : "Drag and drop files here"}</h5>
            <p className="text-muted mb-3">or</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="d-none"
              disabled={uploading}
            />
            <button
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {uploading ? "Uploading..." : "Select Files"}
            </button>
            <p className="text-muted mt-3 mb-0 small">
              Supported: Images, Videos, Audio, PDF, Documents (Max 10MB per
              file)
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">
                <i className="bi bi-funnel me-1"></i>
                File Type
              </label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setTimeout(loadMedia, 0);
                }}
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="audio">Audio</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">
                <i className="bi bi-folder me-1"></i>
                Folder
              </label>
              <select
                className="form-select"
                value={filterFolder}
                onChange={(e) => {
                  setFilterFolder(e.target.value);
                  setTimeout(loadMedia, 0);
                }}
              >
                <option value="all">All Folders</option>
                {folders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">
                <i className="bi bi-search me-1"></i>
                Search
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No media files found. Upload some files to get started!
        </div>
      ) : (
        <div className="row g-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100">
                {item.file_type === "image" ? (
                  <img
                    src={item.public_url}
                    alt={item.alt_text || item.original_filename}
                    className="card-img-top"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedImage(item)}
                  />
                ) : (
                  <div
                    className="card-img-top bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <i
                      className={`bi ${
                        item.file_type === "video"
                          ? "bi-film"
                          : item.file_type === "audio"
                            ? "bi-music-note"
                            : item.file_type === "document"
                              ? "bi-file-text"
                              : "bi-file"
                      } fs-1 text-muted`}
                    ></i>
                  </div>
                )}
                <div className="card-body">
                  <h6
                    className="card-title text-truncate"
                    title={item.original_filename}
                  >
                    {item.original_filename}
                  </h6>
                  <p className="card-text small text-muted mb-2">
                    {formatFileSize(item.file_size)}
                    {item.width && item.height && (
                      <>
                        {" "}
                        • {item.width}×{item.height}
                      </>
                    )}
                  </p>
                  {item.folder && (
                    <p className="card-text small">
                      <i className="bi bi-folder me-1"></i>
                      {item.folder}
                    </p>
                  )}
                  {item.usage_count > 0 && (
                    <p className="card-text small text-info">
                      <i className="bi bi-link-45deg me-1"></i>
                      Used in {item.usage_count} place(s)
                    </p>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <div className="btn-group w-100" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => copyToClipboard(item.public_url)}
                      title="Copy URL"
                      aria-label="Copy URL"
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>
                    <a
                      href={item.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-info"
                      title="View"
                    >
                      <i className="bi bi-eye"></i>
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(item)}
                      title="Delete"
                      aria-label="Delete file"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedImage.original_filename}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close preview"
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage.public_url}
                  alt={
                    selectedImage.alt_text || selectedImage.original_filename
                  }
                  className="img-fluid"
                />
              </div>
              <div className="modal-footer">
                <div className="text-start flex-grow-1">
                  <p className="mb-1 small">
                    <strong>Size:</strong>{" "}
                    {formatFileSize(selectedImage.file_size)}
                  </p>
                  {selectedImage.width && selectedImage.height && (
                    <p className="mb-1 small">
                      <strong>Dimensions:</strong> {selectedImage.width}×
                      {selectedImage.height}
                    </p>
                  )}
                  <p className="mb-0 small">
                    <strong>URL:</strong>{" "}
                    <code className="small">{selectedImage.public_url}</code>
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => copyToClipboard(selectedImage.public_url)}
                >
                  <i className="bi bi-clipboard me-2"></i>
                  Copy URL
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedImage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-3">
              <h4 className="text-primary">{mediaItems.length}</h4>
              <p className="text-muted mb-0">Total Files</p>
            </div>
            <div className="col-md-3">
              <h4 className="text-success">
                {mediaItems.filter((i) => i.file_type === "image").length}
              </h4>
              <p className="text-muted mb-0">Images</p>
            </div>
            <div className="col-md-3">
              <h4 className="text-warning">
                {mediaItems.filter((i) => i.file_type === "document").length}
              </h4>
              <p className="text-muted mb-0">Documents</p>
            </div>
            <div className="col-md-3">
              <h4 className="text-info">
                {formatFileSize(
                  mediaItems.reduce((sum, item) => sum + item.file_size, 0),
                )}
              </h4>
              <p className="text-muted mb-0">Total Size</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
