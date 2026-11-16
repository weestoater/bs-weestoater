import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isStravaAdmin, triggerStravaSync } from "../../utils/stravaApi";
import { useSEO } from "../../utils/useSEO";

export const StravaSyncAdmin = () => {
  useSEO({
    title: "Strava Sync",
    description: "Sync Strava activities into the database",
  });

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    isStravaAdmin().then((admin) => {
      if (!cancelled) setIsAdmin(admin);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await triggerStravaSync();
      setSyncMessage(
        `Synced ${result.activities} activities, fetched ${result.detailsFetched} new details.${
          result.rateLimited ? " Strava rate limit reached; run again later for the rest." : ""
        }`,
      );
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <Link to="/admin" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
          Back to Dashboard
        </Link>
        <h1>
          <i className="bi bi-activity me-2 text-warning" aria-hidden="true"></i>
          Strava Sync
        </h1>
        <p className="text-muted">
          Pull the latest activities from Strava into the database. The public Strava page reads from there.
        </p>
        <hr />
      </div>

      {isAdmin === false && (
        <div className="alert alert-warning" role="alert">
          Your account is not set up as a Strava admin, so you cannot run the sync.
        </div>
      )}

      {isAdmin && (
        <div className="card">
          <div className="card-body">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSync}
              disabled={syncing}
            >
              <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
              {syncing ? "Syncing…" : "Sync from Strava"}
            </button>
            {syncMessage && (
              <p role="status" className="mt-3 mb-0">
                {syncMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
