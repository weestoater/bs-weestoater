import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../../../backend/index.js";
import type { NavigationItem } from "../../types/weecms";
import { useSEO } from "../../utils/useSEO";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

const { createNavigationService } = await import("../../../backend/index.js");

export const NavigationManager = () => {
  useSEO({
    title: "Manage Navigation",
    description: "Edit and manage site navigation structure",
  });

  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const navService = createNavigationService(client);
      const data = await navService.getNavigationItems({ includeHidden: true });
      setItems(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load navigation items",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete "${label}"?`)) return;

    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);
      await navService.deleteNavigationItem(id);
      await loadItems();
    } catch (err) {
      alert(
        `Failed to delete navigation item: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const toggleVisibility = async (item: NavigationItem) => {
    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);
      await navService.updateNavigationItem(item.id, {
        visible: !item.visible,
      });
      await loadItems();
    } catch (err) {
      alert(
        `Failed to update navigation item: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;

    // Update order_index for both items
    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);

      await navService.reorderNavigationItems([
        { id: newItems[index].id, order_index: index },
        { id: newItems[index - 1].id, order_index: index - 1 },
      ]);

      await loadItems();
    } catch (err) {
      alert(
        `Failed to reorder: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const moveDown = async (index: number) => {
    if (index === items.length - 1) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;

    // Update order_index for both items
    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);

      await navService.reorderNavigationItems([
        { id: newItems[index].id, order_index: index },
        { id: newItems[index + 1].id, order_index: index + 1 },
      ]);

      await loadItems();
    } catch (err) {
      alert(
        `Failed to reorder: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <AdminPageHeader
        title="Manage Navigation"
        icon="bi-list-ul"
        description="Edit and reorder site navigation items"
        backLink="/admin"
        backLabel="Dashboard"
        actions={
          <Link to="/admin/navigation/new" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>
            Add Navigation Item
          </Link>
        }
      />

      {items.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle-fill me-2"></i>
          No navigation items found. Create your first one!
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Label</th>
                    <th>Path</th>
                    <th>Icon</th>
                    <th>Visible</th>
                    <th>Auth Required</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={!item.visible ? "text-muted" : ""}
                    >
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <i className="bi bi-arrow-up"></i>
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => moveDown(index)}
                            disabled={index === items.length - 1}
                            title="Move down"
                          >
                            <i className="bi bi-arrow-down"></i>
                          </button>
                        </div>
                        <span className="ms-2 text-muted">
                          {item.order_index}
                        </span>
                      </td>
                      <td>
                        <strong>{item.label}</strong>
                        {item.parent_id && (
                          <span className="badge bg-secondary ms-2">
                            <i className="bi bi-arrow-return-right me-1"></i>
                            Child
                          </span>
                        )}
                      </td>
                      <td>
                        <code>{item.path}</code>
                        {item.external && (
                          <span className="badge bg-info ms-2">External</span>
                        )}
                      </td>
                      <td>
                        {item.icon && (
                          <>
                            <i className={`${item.icon} me-2`}></i>
                            <small className="text-muted">{item.icon}</small>
                          </>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${
                            item.visible ? "btn-success" : "btn-secondary"
                          }`}
                          onClick={() => toggleVisibility(item)}
                        >
                          {item.visible ? (
                            <>
                              <i className="bi bi-eye-fill me-1"></i>
                              Visible
                            </>
                          ) : (
                            <>
                              <i className="bi bi-eye-slash-fill me-1"></i>
                              Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        {item.require_auth ? (
                          <span className="badge bg-warning">
                            <i className="bi bi-lock-fill me-1"></i>
                            Yes
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            <i className="bi bi-unlock-fill me-1"></i>
                            No
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/admin/navigation/edit/${item.id}`}
                            className="btn btn-outline-primary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(item.id, item.label)}
                            title="Delete"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
