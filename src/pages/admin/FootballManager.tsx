import { useState, useEffect, FormEvent } from "react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

type GoalRowGoal = {
  id: string;
  player: string;
  minute: string;
  assist: string | null;
};
// Inline component for editing a goal's assist (must be top-level for hooks)
export function GoalRow({
  goal,
  onDelete,
  onEdit,
}: {
  goal: GoalRowGoal;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: { assist: string }) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [assist, setAssist] = useState(goal.assist || "");

  const handleSave = async () => {
    await onEdit(goal.id, { assist });
    setEditing(false);
  };

  return (
    <tr>
      <td>{goal.player}</td>
      <td>{goal.minute}</td>
      <td>
        {editing ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={assist}
            onChange={(e) => setAssist(e.target.value)}
            list="players-list"
            style={{ minWidth: 100 }}
          />
        ) : (
          goal.assist || "-"
        )}
      </td>
      <td>
        {editing ? (
          <>
            <button
              className="btn btn-sm btn-success me-1"
              onClick={handleSave}
              title="Save assist"
            >
              <i className="bi bi-check"></i>
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setEditing(false);
                setAssist(goal.assist || "");
              }}
              title="Cancel"
            >
              <i className="bi bi-x"></i>
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-sm btn-outline-primary me-1"
              onClick={() => setEditing(true)}
              title="Edit assist"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(goal.id)}
              aria-label="Delete goal"
            >
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
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

interface FootballMatch {
  id: string;
  season_id: string;
  match_date: string;
  opposition: string;
  venue: string;
  goals_scored: number | null;
  goals_conceded: number | null;
  league: string | null;
  video_url: string | null;
  iplayer_url: string | null;
  notes: string | null;
}

interface MatchGoal {
  id: string;
  match_id: string;
  player: string;
  minute: string;
  assist: string | null;
}

interface MatchCard {
  id: string;
  match_id: string;
  player: string;
  card_type: string;
  minute: number;
}

export const FootballManager = () => {
  useSEO({
    title: "Manage Football Data",
    description: "Add and manage Motherwell FC match data",
  });

  const [seasons, setSeasons] = useState<FootballSeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [matches, setMatches] = useState<FootballMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<FootballMatch | null>(null);
  const [managingGoals, setManagingGoals] = useState<{
    matchId: string;
    goals: MatchGoal[];
  } | null>(null);
  const [managingCards, setManagingCards] = useState<{
    matchId: string;
    cards: MatchCard[];
  } | null>(null);
  const [players, setPlayers] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    match_date: new Date().toISOString().split("T")[0],
    opposition: "",
    venue: "Home",
    goals_scored: "",
    goals_conceded: "",
    league: "",
    video_url: "",
    iplayer_url: "",
    notes: "",
  });

  // Goal form state
  const [goalFormData, setGoalFormData] = useState({
    player: "",
    minute: "",
    assist: "",
  });

  // Card form state
  const [cardFormData, setCardFormData] = useState({
    player: "",
    card_type: "yellow",
    minute: "",
  });

  const loadPlayers = async (seasonId: string) => {
    if (!seasonId) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const playersData = await db.getFootballPlayers(seasonId);
      setPlayers(playersData);
    } catch (err) {
      console.error("Failed to load players:", err);
    }
  };

  const loadSeasons = async () => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const seasonsData = await db.getFootballSeasons();
      setSeasons(seasonsData || []);

      // Select the active season by default
      const activeSeason = seasonsData?.find((s) => s.is_active);
      if (activeSeason) {
        setSelectedSeason(activeSeason.season_id);
      } else if (seasonsData && seasonsData.length > 0) {
        setSelectedSeason(seasonsData[0].season_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load seasons");
    }
  };

  const loadMatches = async (seasonId: string) => {
    if (!seasonId) return;

    try {
      setLoading(true);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const matchesData = await db.getFootballMatches(seasonId, {
        detailed: false,
      });
      setMatches(matchesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      loadMatches(selectedSeason);
      loadPlayers(selectedSeason);
    }
  }, [selectedSeason]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      const matchData = {
        season_id: selectedSeason,
        match_date: formData.match_date,
        opposition: formData.opposition,
        venue: formData.venue,
        goals_scored: formData.goals_scored
          ? parseInt(formData.goals_scored)
          : null,
        goals_conceded: formData.goals_conceded
          ? parseInt(formData.goals_conceded)
          : null,
        league: formData.league || null,
        video_url: formData.video_url || null,
        iplayer_url: formData.iplayer_url || null,
        notes: formData.notes || null,
      };

      if (editingMatch) {
        await db.updateFootballMatch(editingMatch.id, matchData);
      } else {
        await db.createFootballMatch(matchData);
      }

      // Reload matches
      await loadMatches(selectedSeason);

      // Reset form
      setFormData({
        match_date: new Date().toISOString().split("T")[0],
        opposition: "",
        venue: "Home",
        goals_scored: "",
        goals_conceded: "",
        league: "",
        video_url: "",
        iplayer_url: "",
        notes: "",
      });
      setShowAddForm(false);
      setEditingMatch(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save match");
    }
  };

  const handleEdit = (match: FootballMatch) => {
    setEditingMatch(match);
    setFormData({
      match_date: match.match_date,
      opposition: match.opposition,
      venue: match.venue,
      goals_scored: match.goals_scored?.toString() || "",
      goals_conceded: match.goals_conceded?.toString() || "",
      league: match.league || "",
      video_url: match.video_url || "",
      iplayer_url: match.iplayer_url || "",
      notes: match.notes || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (matchId: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteFootballMatch(matchId);
      await loadMatches(selectedSeason);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete match");
    }
  };

  const handleManageGoals = async (matchId: string) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const goals = await db.getFootballMatchGoals(matchId);
      setManagingGoals({ matchId, goals });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals");
    }
  };

  const handleAddGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!managingGoals) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      await db.createFootballMatchGoal({
        match_id: managingGoals.matchId,
        player: goalFormData.player,
        minute: goalFormData.minute,
        assist: goalFormData.assist || null,
      });

      // Reload goals
      const goals = await db.getFootballMatchGoals(managingGoals.matchId);
      setManagingGoals({ ...managingGoals, goals });

      // Reset form
      setGoalFormData({ player: "", minute: "", assist: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add goal");
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!managingGoals || !confirm("Delete this goal?")) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteFootballMatchGoal(goalId);

      // Reload goals
      const goals = await db.getFootballMatchGoals(managingGoals.matchId);
      setManagingGoals({ ...managingGoals, goals });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal");
    }
  };

  // Edit assist for a goal
  const handleEditGoal = async (
    goalId: string,
    updates: { assist: string },
  ) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.updateFootballMatchGoal(goalId, { assist: updates.assist });
      // Reload goals
      if (managingGoals) {
        const goals = await db.getFootballMatchGoals(managingGoals.matchId);
        setManagingGoals({ ...managingGoals, goals });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update goal assist",
      );
    }
  };

  const handleManageCards = async (matchId: string) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const cards = await db.getFootballMatchCards(matchId);
      setManagingCards({ matchId, cards });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cards");
    }
  };

  const handleAddCard = async (e: FormEvent) => {
    e.preventDefault();
    if (!managingCards) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      await db.createFootballMatchCard({
        match_id: managingCards.matchId,
        player: cardFormData.player,
        card_type: cardFormData.card_type,
        minute: parseInt(cardFormData.minute),
      });

      // Reload cards
      const cards = await db.getFootballMatchCards(managingCards.matchId);
      setManagingCards({ ...managingCards, cards });

      // Reset form
      setCardFormData({ player: "", card_type: "yellow", minute: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add card");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!managingCards || !confirm("Delete this card?")) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteFootballMatchCard(cardId);

      // Reload cards
      const cards = await db.getFootballMatchCards(managingCards.matchId);
      setManagingCards({ ...managingCards, cards });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete card");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
    <div className="container-fluid mt-4 mb-5">
      <AdminPageHeader
        title="Football Manager"
        icon="bi-trophy"
        description="Manage matches, goals, and season data"
        backLink="/admin"
        backLabel="Dashboard"
      />

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Season Selector */}
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
        <div className="col-md-6 d-flex align-items-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(true);
              setEditingMatch(null);
              setFormData({
                match_date: new Date().toISOString().split("T")[0],
                opposition: "",
                venue: "Home",
                goals_scored: "",
                goals_conceded: "",
                league: "",
                video_url: "",
                iplayer_url: "",
                notes: "",
              });
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Match
          </button>
        </div>
      </div>

      {/* Add/Edit Match Form */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              {editingMatch ? "Edit Match" : "Add New Match"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="match_date" className="form-label">
                    Match Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="match_date"
                    value={formData.match_date}
                    onChange={(e) =>
                      setFormData({ ...formData, match_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="opposition" className="form-label">
                    Opposition *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="opposition"
                    value={formData.opposition}
                    onChange={(e) =>
                      setFormData({ ...formData, opposition: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="venue" className="form-label">
                    Venue *
                  </label>
                  <select
                    className="form-select"
                    id="venue"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Away">Away</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="goals_scored" className="form-label">
                    Goals Scored
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="goals_scored"
                    value={formData.goals_scored}
                    onChange={(e) =>
                      setFormData({ ...formData, goals_scored: e.target.value })
                    }
                    min="0"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="goals_conceded" className="form-label">
                    Goals Conceded
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="goals_conceded"
                    value={formData.goals_conceded}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goals_conceded: e.target.value,
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="league" className="form-label">
                    Competition/League
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="league"
                    value={formData.league}
                    onChange={(e) =>
                      setFormData({ ...formData, league: e.target.value })
                    }
                    placeholder="e.g., SPFL Premiership, Scottish Cup"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="video_url" className="form-label">
                    Video URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="iplayer_url" className="form-label">
                    iPlayer URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="iplayer_url"
                    value={formData.iplayer_url}
                    onChange={(e) =>
                      setFormData({ ...formData, iplayer_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Match Notes
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Match summary, highlights, etc."
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-save me-2"></i>
                  {editingMatch ? "Update Match" : "Add Match"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMatch(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Matches ({matches.length})</h5>
        </div>
        <div className="card-body">
          {matches.length === 0 ? (
            <p className="text-muted">No matches found for this season.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Opposition</th>
                    <th>Venue</th>
                    <th>Score</th>
                    <th>Competition</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id}>
                      <td>{formatDate(match.match_date)}</td>
                      <td>{match.opposition}</td>
                      <td>
                        <span
                          className={`badge ${match.venue === "Home" ? "bg-success" : "bg-primary"}`}
                        >
                          {match.venue}
                        </span>
                      </td>
                      <td>
                        {match.goals_scored !== null &&
                        match.goals_conceded !== null ? (
                          <span className="fw-bold">
                            {match.goals_scored} - {match.goals_conceded}
                          </span>
                        ) : (
                          <span className="text-muted">TBC</span>
                        )}
                      </td>
                      <td>{match.league || "-"}</td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(match)}
                            title="Edit match"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => handleManageGoals(match.id)}
                            title="Manage goals"
                          >
                            <i className="bi bi-trophy"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleManageCards(match.id)}
                            title="Manage cards"
                          >
                            <i className="bi bi-credit-card"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(match.id)}
                            title="Delete match"
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
      </div>

      {/* Goals Management Modal */}
      {managingGoals && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Manage Goals</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setManagingGoals(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Add Goal Form */}
                <form onSubmit={handleAddGoal} className="mb-4">
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Player name *"
                        value={goalFormData.player}
                        onChange={(e) =>
                          setGoalFormData({
                            ...goalFormData,
                            player: e.target.value,
                          })
                        }
                        list="players-list"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Minute *"
                        value={goalFormData.minute}
                        onChange={(e) =>
                          setGoalFormData({
                            ...goalFormData,
                            minute: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Assist"
                        value={goalFormData.assist}
                        onChange={(e) =>
                          setGoalFormData({
                            ...goalFormData,
                            assist: e.target.value,
                          })
                        }
                        list="players-list"
                      />
                    </div>
                    <div className="col-md-2 mb-2">
                      <button type="submit" className="btn btn-primary w-100">
                        Add
                      </button>
                    </div>
                  </div>
                </form>

                {/* Goals List */}
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Minute</th>
                        <th>Assist</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managingGoals.goals.map((goal) => (
                        <GoalRow
                          key={goal.id}
                          goal={goal}
                          onDelete={handleDeleteGoal}
                          onEdit={handleEditGoal}
                        />
                      ))}
                      {managingGoals.goals.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-muted text-center">
                            No goals recorded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setManagingGoals(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Management Modal */}
      {managingCards && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Manage Cards</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setManagingCards(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Add Card Form */}
                <form onSubmit={handleAddCard} className="mb-4">
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Player name *"
                        value={cardFormData.player}
                        onChange={(e) =>
                          setCardFormData({
                            ...cardFormData,
                            player: e.target.value,
                          })
                        }
                        list="players-list"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <select
                        className="form-select"
                        value={cardFormData.card_type}
                        onChange={(e) =>
                          setCardFormData({
                            ...cardFormData,
                            card_type: e.target.value,
                          })
                        }
                      >
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Minute *"
                        value={cardFormData.minute}
                        onChange={(e) =>
                          setCardFormData({
                            ...cardFormData,
                            minute: e.target.value,
                          })
                        }
                        min="1"
                        max="120"
                        required
                      />
                    </div>
                    <div className="col-md-2 mb-2">
                      <button type="submit" className="btn btn-warning w-100">
                        Add
                      </button>
                    </div>
                  </div>
                </form>

                {/* Cards List */}
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Type</th>
                        <th>Minute</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managingCards.cards.map((card) => (
                        <tr key={card.id}>
                          <td>{card.player}</td>
                          <td>
                            <span
                              className={`badge ${card.card_type === "yellow" ? "bg-warning text-dark" : "bg-danger"}`}
                            >
                              {card.card_type}
                            </span>
                          </td>
                          <td>{card.minute}'</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteCard(card.id)}
                              aria-label="Delete card"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {managingCards.cards.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-muted text-center">
                            No cards recorded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setManagingCards(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Players datalist for typeahead */}
      <datalist id="players-list">
        {players.map((player) => (
          <option key={player} value={player} />
        ))}
      </datalist>
    </div>
  );
};
