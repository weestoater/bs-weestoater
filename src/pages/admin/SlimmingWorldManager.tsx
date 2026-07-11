import { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../../../backend/index.js";
import { useSEO } from "../../utils/useSEO";
import { formatDateMediumPadded } from "../../utils/dateUtils";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

const { createDatabaseService } = await import("../../../backend/index.js");

interface WeighInEntry {
  id: string;
  entry_date: string;
  weight: number;
  weight_change: number;
  total_lost: number;
  target_weight: number;
  slimmer_of_week: number | null;
  notes: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  start_date: string;
  start_weight: number;
  target_weight: number;
}

interface TargetWeightEntry {
  id: string;
  profile_id: string;
  target_weight: number;
  effective_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const SlimmingWorldManager = () => {
  useSEO({
    title: "Manage Slimming World Data",
    description: "Add and manage weigh-in entries",
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<WeighInEntry[]>([]);
  const [targetWeights, setTargetWeights] = useState<TargetWeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTargetWeightForm, setShowTargetWeightForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeighInEntry | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split("T")[0],
    weight: "",
    weight_change: "",
    notes: "",
    slimmer_of_week: false,
  });

  // Target weight form state
  const [targetWeightFormData, setTargetWeightFormData] = useState({
    target_weight: "",
    effective_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      // Load profile
      const profileData = await db.getSlimmingWorldProfileByUserId("default");
      if (!profileData) {
        setError(
          "No Slimming World profile found. Please run the migration script.",
        );
        return;
      }
      setProfile(profileData);

      // Load entries
      const entriesData = await db.getSlimmingWorldEntries(profileData.id, {
        orderBy: "entry_date",
        ascending: false,
      });
      setEntries(entriesData || []);

      // Load target weight history
      const targetWeightsData = await db.getTargetWeightHistory(
        profileData.id,
        {
          orderBy: "effective_date",
          ascending: false,
        },
      );
      setTargetWeights(targetWeightsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      const weight = parseFloat(formData.weight);
      const weightChange = formData.weight_change
        ? parseFloat(formData.weight_change)
        : 0;

      // Calculate total lost from start weight
      const totalLost = profile.start_weight - weight;

      // Get the target weight that was active on the entry date
      const targetWeight = await db.getTargetWeightForDate(
        profile.id,
        formData.entry_date,
      );

      const entryData = {
        profile_id: profile.id,
        entry_date: formData.entry_date,
        weight: weight,
        weight_change: weightChange,
        total_lost: totalLost,
        target_weight: targetWeight,
        slimmer_of_week: formData.slimmer_of_week ? 100 : null,
        notes: formData.notes || null,
      };

      if (editingEntry) {
        // Update existing entry
        await db.updateSlimmingWorldEntry(editingEntry.id, entryData);
      } else {
        // Create new entry
        await db.createSlimmingWorldEntry(entryData);
      }

      // Reset form and reload data
      setFormData({
        entry_date: new Date().toISOString().split("T")[0],
        weight: "",
        weight_change: "",
        notes: "",
        slimmer_of_week: false,
      });
      setShowAddForm(false);
      setEditingEntry(null);
      await loadData();
    } catch (err) {
      alert(
        `Failed to save entry: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const handleEdit = (entry: WeighInEntry) => {
    setEditingEntry(entry);
    setFormData({
      entry_date: entry.entry_date,
      weight: entry.weight.toString(),
      weight_change: entry.weight_change.toString(),
      notes: entry.notes || "",
      slimmer_of_week: entry.slimmer_of_week === 100,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, date: string) => {
    if (!confirm(`Are you sure you want to delete the entry from ${date}?`))
      return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteSlimmingWorldEntry(id);
      await loadData();
    } catch (err) {
      alert(
        `Failed to delete entry: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const handleTargetWeightSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      const targetWeight = parseFloat(targetWeightFormData.target_weight);

      const targetWeightData = {
        profile_id: profile.id,
        target_weight: targetWeight,
        effective_date: targetWeightFormData.effective_date,
        notes: targetWeightFormData.notes || null,
      };

      await db.createTargetWeight(targetWeightData);

      // Reset form and reload data
      setTargetWeightFormData({
        target_weight: "",
        effective_date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setShowTargetWeightForm(false);
      await loadData();
    } catch (err) {
      alert(
        `Failed to save target weight: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const handleDeleteTargetWeight = async (id: string, date: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the target weight from ${date}?`,
      )
    )
      return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteTargetWeight(id);
      await loadData();
    } catch (err) {
      alert(
        `Failed to delete target weight: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const formatWeight = (weight: number) => {
    const stones = Math.floor(weight / 14);
    const lbs = (weight % 14).toFixed(1);
    const kgs = (weight * 0.453592).toFixed(2);
    return `${stones}st ${lbs}lbs (${weight}lbs / ${kgs}kg)`;
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
        <Link to="/admin" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <AdminPageHeader
        title="Slimming World Manager"
        icon="bi-heart-pulse"
        description="Add and manage weigh-in entries"
        backLink="/admin"
        backLabel="Dashboard"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingEntry(null);
              setFormData({
                entry_date: new Date().toISOString().split("T")[0],
                weight: "",
                weight_change: "",
                notes: "",
                slimmer_of_week: false,
              });
            }}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add Weigh-In
          </button>
        }
      />

      {/* Profile Summary */}
      {profile && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Profile Summary</h5>
                <div className="row">
                  <div className="col-md-3">
                    <strong>Start Date:</strong>{" "}
                    {formatDateMediumPadded(profile.start_date)}
                  </div>
                  <div className="col-md-3">
                    <strong>Start Weight:</strong>{" "}
                    {formatWeight(profile.start_weight)}
                  </div>
                  <div className="col-md-3">
                    <strong>Current Target:</strong>{" "}
                    {targetWeights.length > 0
                      ? formatWeight(targetWeights[0].target_weight)
                      : formatWeight(profile.target_weight)}
                  </div>
                  <div className="col-md-3">
                    <strong>Total Entries:</strong> {entries.length}
                  </div>
                </div>
                {entries.length > 0 && (
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <strong>Current Weight:</strong>{" "}
                      {formatWeight(entries[0].weight)}
                    </div>
                    <div className="col-md-3">
                      <strong>Total Lost:</strong>{" "}
                      <span className="text-success">
                        {entries[0].total_lost.toFixed(1)} lbs
                      </span>
                    </div>
                    <div className="col-md-3">
                      <strong>Remaining:</strong>{" "}
                      {(
                        entries[0].weight -
                        (targetWeights.length > 0
                          ? targetWeights[0].target_weight
                          : profile.target_weight)
                      ).toFixed(1)}{" "}
                      lbs
                    </div>
                    <div className="col-md-3">
                      <strong>SOTW Awards:</strong>{" "}
                      {entries.filter((e) => e.slimmer_of_week).length}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target Weight Management */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="bi bi-bullseye me-2"></i>
                  Target Weight History
                </h5>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setShowTargetWeightForm(!showTargetWeightForm);
                    setTargetWeightFormData({
                      target_weight: "",
                      effective_date: new Date().toISOString().split("T")[0],
                      notes: "",
                    });
                  }}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Set New Target
                </button>
              </div>

              {showTargetWeightForm && (
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3">
                      Set New Target Weight
                    </h6>
                    <form onSubmit={handleTargetWeightSubmit}>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="target_weight" className="form-label">
                            New Target Weight (lbs) *
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            id="target_weight"
                            required
                            value={targetWeightFormData.target_weight}
                            onChange={(e) =>
                              setTargetWeightFormData({
                                ...targetWeightFormData,
                                target_weight: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="target_effective_date"
                            className="form-label"
                          >
                            Effective From Date *
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="target_effective_date"
                            required
                            value={targetWeightFormData.effective_date}
                            onChange={(e) =>
                              setTargetWeightFormData({
                                ...targetWeightFormData,
                                effective_date: e.target.value,
                              })
                            }
                          />
                          <small className="text-muted">
                            This target applies from this date forward
                          </small>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="target_notes" className="form-label">
                            Reason (optional)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="target_notes"
                            value={targetWeightFormData.notes}
                            onChange={(e) =>
                              setTargetWeightFormData({
                                ...targetWeightFormData,
                                notes: e.target.value,
                              })
                            }
                            placeholder="e.g., Adjusted goal"
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          <i className="bi bi-check-lg me-1"></i>
                          Save Target Weight
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowTargetWeightForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {targetWeights.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No target weight changes recorded yet. Your initial target
                  will be migrated automatically.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Effective Date</th>
                        <th>Target Weight</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targetWeights.map((tw, index) => (
                        <tr key={tw.id}>
                          <td>
                            {formatDateMediumPadded(tw.effective_date)}
                            {index === 0 && (
                              <span className="badge bg-success ms-2">
                                Current
                              </span>
                            )}
                          </td>
                          <td>{formatWeight(tw.target_weight)}</td>
                          <td>
                            {tw.notes || (
                              <em className="text-muted">No notes</em>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteTargetWeight(
                                  tw.id,
                                  tw.effective_date,
                                )
                              }
                              title="Delete"
                              disabled={targetWeights.length === 1}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {editingEntry ? "Edit" : "Add"} Weigh-In Entry
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label htmlFor="entry_date" className="form-label">
                        Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="entry_date"
                        required
                        value={formData.entry_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            entry_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="weight" className="form-label">
                        Weight (lbs) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        id="weight"
                        required
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="weight_change" className="form-label">
                        Change from Last (lbs)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        id="weight_change"
                        value={formData.weight_change}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weight_change: e.target.value,
                          })
                        }
                        placeholder="e.g., -2.5"
                      />
                      <small className="text-muted">
                        Use negative for loss, positive for gain
                      </small>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label d-block">&nbsp;</label>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="slimmer_of_week"
                          checked={formData.slimmer_of_week}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              slimmer_of_week: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="slimmer_of_week"
                        >
                          <i className="bi bi-star-fill text-warning"></i>{" "}
                          Slimmer of the Week
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="notes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Optional notes about this weigh-in..."
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-lg me-1"></i>
                      {editingEntry ? "Update" : "Add"} Entry
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingEntry(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entries Table */}
      {entries.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No weigh-in entries found. Click "Add Weigh-In" to create your first
          entry.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Change</th>
                <th>Total Lost</th>
                <th>To Target</th>
                <th>SOTW</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDateMediumPadded(entry.entry_date)}</td>
                  <td>{formatWeight(entry.weight)}</td>
                  <td>
                    <span
                      className={
                        entry.weight_change < 0
                          ? "text-success"
                          : entry.weight_change > 0
                            ? "text-danger"
                            : ""
                      }
                    >
                      {entry.weight_change > 0 ? "+" : ""}
                      {entry.weight_change.toFixed(1)} lbs
                    </span>
                  </td>
                  <td>
                    <span className="text-success fw-bold">
                      {entry.total_lost.toFixed(1)} lbs
                    </span>
                  </td>
                  <td>{(entry.weight - entry.target_weight).toFixed(1)} lbs</td>
                  <td>
                    {entry.slimmer_of_week && (
                      <i className="bi bi-star-fill text-warning"></i>
                    )}
                  </td>
                  <td>
                    {entry.notes && (
                      <span
                        title={entry.notes}
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                        }}
                      >
                        {entry.notes}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(entry)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(entry.id, entry.entry_date)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
