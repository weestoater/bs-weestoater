import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSupabaseClient,
  createNavigationService,
} from "../../../backend/index.js";
import { useSEO } from "../../utils/useSEO";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import type { NavigationItem } from "../../types/weecms";

export const NavigationEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== "new";

  useSEO({
    title: isEdit ? "Edit Navigation Item" : "Add New Navigation Item",
    description: isEdit
      ? "Edit navigation item details"
      : "Create a new navigation item",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<NavigationItem[]>([]);

  const [formData, setFormData] = useState({
    label: "",
    path: "",
    parent_id: "",
    icon: "",
    order_index: 0,
    visible: true,
    require_auth: false,
    allowed_roles: "",
    external: false,
    new_window: false,
  });

  useEffect(() => {
    loadAllItems();
    if (isEdit) {
      loadItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAllItems = async () => {
    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);
      const data = await navService.getNavigationItems({ includeHidden: true });
      setAllItems(data || []);
    } catch (err) {
      console.error("Failed to load navigation items:", err);
    }
  };

  const loadItem = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const client = getSupabaseClient();
      const navService = createNavigationService(client);
      const data = await navService.getNavigationItemById(id);

      if (!data) throw new Error("Navigation item not found");

      setFormData({
        label: data.label,
        path: data.path,
        parent_id: data.parent_id || "",
        icon: data.icon || "",
        order_index: data.order_index,
        visible: data.visible,
        require_auth: data.require_auth,
        allowed_roles: data.allowed_roles?.join(", ") || "",
        external: data.external,
        new_window: data.new_window,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);

      const dataToSave = {
        label: formData.label,
        path: formData.path,
        parent_id: formData.parent_id || undefined,
        icon: formData.icon || undefined,
        order_index: formData.order_index,
        visible: formData.visible,
        require_auth: formData.require_auth,
        allowed_roles: formData.allowed_roles
          ? formData.allowed_roles.split(",").map((r) => r.trim())
          : [],
        external: formData.external,
        new_window: formData.new_window,
      };

      if (isEdit && id) {
        await navService.updateNavigationItem(id, dataToSave);
      } else {
        await navService.createNavigationItem(dataToSave);
      }

      navigate("/admin/navigation");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save navigation item",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <AdminPageHeader
        title={isEdit ? "Edit Navigation Item" : "Add New Navigation Item"}
        icon="bi-list-ul"
        description={
          isEdit
            ? "Edit navigation item details"
            : "Create a new navigation item"
        }
        backLink="/admin/navigation"
        backLabel="Navigation Manager"
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0">Navigation Item Details</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="label" className="form-label">
                    Label * <small className="text-muted">(Display text)</small>
                  </label>
                  <input
                    type="text"
                    id="label"
                    className="form-control"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="path" className="form-label">
                    Path * <small className="text-muted">(e.g., /about)</small>
                  </label>
                  <input
                    type="text"
                    id="path"
                    className="form-control"
                    value={formData.path}
                    onChange={(e) =>
                      setFormData({ ...formData, path: e.target.value })
                    }
                    placeholder="/about"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="icon" className="form-label">
                    Icon{" "}
                    <small className="text-muted">
                      (Bootstrap Icons class)
                    </small>
                  </label>
                  <input
                    type="text"
                    id="icon"
                    className="form-control"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="bi-house-fill"
                  />
                  {formData.icon && (
                    <div className="mt-2">
                      <i className={`${formData.icon} fs-3`}></i>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="parent_id" className="form-label">
                    Parent Item{" "}
                    <small className="text-muted">
                      (Optional, for sub-menus)
                    </small>
                  </label>
                  <select
                    id="parent_id"
                    className="form-select"
                    value={formData.parent_id}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_id: e.target.value })
                    }
                  >
                    <option value="">None (Top Level)</option>
                    {allItems
                      .filter((item) => item.id !== id)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="order_index" className="form-label">
                    Order Index
                  </label>
                  <input
                    type="number"
                    id="order_index"
                    className="form-control"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order_index: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <small className="text-muted">
                    Lower numbers appear first
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0">Settings</h3>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="visible"
                    className="form-check-input"
                    checked={formData.visible}
                    onChange={(e) =>
                      setFormData({ ...formData, visible: e.target.checked })
                    }
                  />
                  <label htmlFor="visible" className="form-check-label">
                    Visible in navigation
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="require_auth"
                    className="form-check-input"
                    checked={formData.require_auth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        require_auth: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="require_auth" className="form-check-label">
                    Requires authentication
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="external"
                    className="form-check-input"
                    checked={formData.external}
                    onChange={(e) =>
                      setFormData({ ...formData, external: e.target.checked })
                    }
                  />
                  <label htmlFor="external" className="form-check-label">
                    External link
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="new_window"
                    className="form-check-input"
                    checked={formData.new_window}
                    onChange={(e) =>
                      setFormData({ ...formData, new_window: e.target.checked })
                    }
                  />
                  <label htmlFor="new_window" className="form-check-label">
                    Open in new window
                  </label>
                </div>

                <div className="mb-3">
                  <label htmlFor="allowed_roles" className="form-label">
                    Allowed Roles{" "}
                    <small className="text-muted">(comma-separated)</small>
                  </label>
                  <input
                    type="text"
                    id="allowed_roles"
                    className="form-control"
                    value={formData.allowed_roles}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowed_roles: e.target.value,
                      })
                    }
                    placeholder="admin, editor"
                  />
                </div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    {isEdit ? "Update Item" : "Create Item"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
