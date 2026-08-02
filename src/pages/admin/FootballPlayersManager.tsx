import { useState, useEffect, FormEvent } from "react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { getSupabaseClient } from "../../../backend/index.js";
import { useSEO } from "../../utils/useSEO";

const { createDatabaseService } = await import("../../../backend/index.js");

interface FootballSeason {
  id: string;
  season_id: string;
  display_name: string;
  start_year: number;
  end_year: number;
  is_active: boolean;
}

interface FootballPlayer {
  id: string;
  season_id: string;
  player_name: string;
  squad_number: number | null;
  position: string | null;
  is_active: boolean;
  notes: string | null;
}

export const FootballPlayersManager = () => {
  useSEO({
    title: "Manage Football Players",
    description: "Manage squad players for each season",
  });

  const [seasons, setSeasons] = useState<FootballSeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [playerRecords, setPlayerRecords] = useState<FootballPlayer[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<FootballPlayer | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Player form state
  const [playerFormData, setPlayerFormData] = useState({
    player_name: "",
    squad_number: "",
    position: "",
    is_active: true,
    notes: "",
  });

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      setError(null);
      setSuccessMessage(null);
      loadPlayerRecords(selectedSeason);
    }
  }, [selectedSeason]);

  const loadSeasons = async () => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const data = await db.getFootballSeasons();
      setSeasons(data || []);

      // Auto-select active season or most recent
      const activeSeason = data?.find((s) => s.is_active);
      const defaultSeason = activeSeason || data?.[0];
      if (defaultSeason) {
        setSelectedSeason(defaultSeason.season_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load seasons");
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerRecords = async (seasonId: string) => {
    try {
      console.log("🔄 Loading players for season:", seasonId);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const data = await db.getFootballPlayerRecords(seasonId);
      console.log("✅ Loaded players:", data);
      setPlayerRecords(data || []);
    } catch (err) {
      console.error("❌ Failed to load players:", err);
      setError(err instanceof Error ? err.message : "Failed to load players");
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setPlayerFormData({
      player_name: "",
      squad_number: "",
      position: "",
      is_active: true,
      notes: "",
    });
  };

  const handleEditPlayer = (player: FootballPlayer) => {
    setEditingPlayer(player);
    setPlayerFormData({
      player_name: player.player_name,
      squad_number: player.squad_number?.toString() || "",
      position: player.position || "",
      is_active: player.is_active,
      notes: player.notes || "",
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlayerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      const playerData = {
        season_id: selectedSeason,
        player_name: playerFormData.player_name,
        squad_number: playerFormData.squad_number
          ? parseInt(playerFormData.squad_number)
          : null,
        position: playerFormData.position || null,
        is_active: playerFormData.is_active,
        notes: playerFormData.notes || null,
      };

      console.log("💾 Saving player:", playerData);

      if (editingPlayer) {
        console.log("📝 Updating existing player:", editingPlayer.id);
        await db.updateFootballPlayer(editingPlayer.id, playerData);
      } else {
        console.log("➕ Creating new player");
        await db.createFootballPlayer(playerData);
      }

      console.log("✅ Player saved successfully");

      // Reload players
      await loadPlayerRecords(selectedSeason);

      // Show success message
      setSuccessMessage(
        editingPlayer
          ? "Player updated successfully!"
          : "Player added successfully!",
      );
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form
      setEditingPlayer(null);
      setPlayerFormData({
        player_name: "",
        squad_number: "",
        position: "",
        is_active: true,
        notes: "",
      });
    } catch (err) {
      console.error("❌ Failed to save player:", err);
      setError(err instanceof Error ? err.message : "Failed to save player");
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm("Are you sure you want to delete this player?")) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteFootballPlayer(playerId);
      await loadPlayerRecords(selectedSeason);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete player");
    }
  };

  const handleTogglePlayerStatus = async (player: FootballPlayer) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.updateFootballPlayer(player.id, {
        is_active: !player.is_active,
      });
      await loadPlayerRecords(selectedSeason);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update player status",
      );
    }
  };

  if (loading && seasons.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <AdminPageHeader
        title="Manage Squad Players"
        description="Add, edit, and manage players for each season"
        backLink="/admin/football"
        backLabel="Back to Matches"
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {/* Season Selection */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="seasonSelect" className="form-label fw-bold">
            Select Season
          </label>
          <select
            id="seasonSelect"
            className="form-select"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            {seasons.map((season) => (
              <option key={season.season_id} value={season.season_id}>
                {season.display_name} {season.is_active && "(Active)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Player Form */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {editingPlayer ? "Edit Player" : "Add New Player"}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handlePlayerSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="player_name" className="form-label">
                  Player Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="player_name"
                  value={playerFormData.player_name}
                  onChange={(e) =>
                    setPlayerFormData({
                      ...playerFormData,
                      player_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="squad_number" className="form-label">
                  Squad Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="squad_number"
                  value={playerFormData.squad_number}
                  onChange={(e) =>
                    setPlayerFormData({
                      ...playerFormData,
                      squad_number: e.target.value,
                    })
                  }
                  min="1"
                  max="99"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="position" className="form-label">
                  Position
                </label>
                <select
                  className="form-select"
                  id="position"
                  value={playerFormData.position}
                  onChange={(e) =>
                    setPlayerFormData({
                      ...playerFormData,
                      position: e.target.value,
                    })
                  }
                >
                  <option value="">Select...</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-9 mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="notes"
                  value={playerFormData.notes}
                  onChange={(e) =>
                    setPlayerFormData({
                      ...playerFormData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="e.g., On loan, Sold to..."
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label d-block">Status</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_active"
                    checked={playerFormData.is_active}
                    onChange={(e) =>
                      setPlayerFormData({
                        ...playerFormData,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="is_active">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>
                {editingPlayer ? "Update Player" : "Add Player"}
              </button>
              {editingPlayer && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddPlayer}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Players List */}
      <div className="card">
        <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Squad Players ({playerRecords.length})</h5>
          <div className="text-white-50 small">
            Active: {playerRecords.filter((p) => p.is_active).length} |
            Inactive: {playerRecords.filter((p) => !p.is_active).length}
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "80px" }}>No.</th>
                  <th>Name</th>
                  <th style={{ width: "150px" }}>Position</th>
                  <th style={{ width: "100px" }}>Status</th>
                  <th>Notes</th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {playerRecords.map((player) => (
                  <tr
                    key={player.id}
                    className={!player.is_active ? "text-muted" : ""}
                  >
                    <td className="text-center fw-bold">
                      {player.squad_number || "-"}
                    </td>
                    <td className="fw-bold">{player.player_name}</td>
                    <td>{player.position || "-"}</td>
                    <td>
                      {player.is_active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {player.notes || "-"}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditPlayer(player)}
                          title="Edit player"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className={`btn ${
                            player.is_active
                              ? "btn-outline-warning"
                              : "btn-outline-success"
                          }`}
                          onClick={() => handleTogglePlayerStatus(player)}
                          title={
                            player.is_active
                              ? "Mark as inactive"
                              : "Mark as active"
                          }
                        >
                          <i
                            className={`bi ${
                              player.is_active
                                ? "bi-dash-circle"
                                : "bi-check-circle"
                            }`}
                          ></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeletePlayer(player.id)}
                          title="Delete player"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {playerRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-muted text-center py-4">
                      <i className="bi bi-people me-2"></i>
                      No players found for this season. Add one above to get
                      started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
