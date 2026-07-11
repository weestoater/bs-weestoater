import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../../backend/index.js";
import { MediaLibraryItem } from "../../types/weecms";

interface MediaPickerProps {
  onSelect: (item: MediaLibraryItem) => void;
  onClose: () => void;
  fileType?: "image" | "video" | "document" | "audio" | "all";
}

export const MediaPicker = ({
  onSelect,
  onClose,
  fileType = "image",
}: MediaPickerProps) => {
  const [mediaItems, setMediaItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [folders, setFolders] = useState<string[]>([]);

  const supabase = getSupabaseClient();

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

      if (fileType !== "all") {
        query = query.eq("file_type", fileType);
      }

      if (selectedFolder !== "all") {
        query = query.eq("folder", selectedFolder);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMediaItems(data || []);
    } catch (error) {
      console.error("Error loading media:", error);
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

  function handleFolderChange(folder: string) {
    setSelectedFolder(folder);
    setTimeout(loadMedia, 0);
  }

  const filteredItems = mediaItems.filter((item) =>
    searchTerm
      ? item.original_filename
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
      : true,
  );

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-images me-2"></i>
              Select Media
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close media picker"
            ></button>
          </div>

          <div className="modal-body">
            {/* Filters */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">
                  <i className="bi bi-folder me-1"></i>
                  Folder
                </label>
                <select
                  className="form-select"
                  value={selectedFolder}
                  onChange={(e) => handleFolderChange(e.target.value)}
                >
                  <option value="all">All Folders</option>
                  {folders.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
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
                No media files found. Upload some files from the Media Library
                first.
              </div>
            ) : (
              <div
                className="row g-3"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {filteredItems.map((item) => (
                  <div key={item.id} className="col-md-4 col-lg-3">
                    <div
                      className="card h-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => onSelect(item)}
                    >
                      {item.file_type === "image" ? (
                        <img
                          src={item.public_url}
                          alt={item.alt_text || item.original_filename}
                          className="card-img-top"
                          style={{
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="card-img-top bg-light d-flex align-items-center justify-content-center"
                          style={{ height: "150px" }}
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
                      <div className="card-body p-2">
                        <p
                          className="card-text small mb-0 text-truncate"
                          title={item.original_filename}
                        >
                          {item.original_filename}
                        </p>
                        <p className="card-text small text-muted mb-0">
                          {formatFileSize(item.file_size)}
                          {item.width && item.height && (
                            <>
                              {" "}
                              • {item.width}×{item.height}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
