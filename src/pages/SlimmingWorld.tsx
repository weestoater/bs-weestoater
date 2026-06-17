import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { WeightSummaryCard } from "../components/sw/WeightSummaryCard";
import { WeightHistoryGrid } from "../components/sw/WeightHistoryGrid";
import { WeightProgressChart } from "../components/sw/WeightProgressChart";
import {
  getSupabaseClient,
  createDatabaseService,
} from "../../backend/index.js";
import { useDataFetch } from "../hooks/useDataFetch";
import type { SwDataPoint } from "../interfaces/swTypes";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface SlimmingWorldData {
  startDate: string;
  startWeight: number;
  targetWeight: number;
  data: SwDataPoint[];
}

/**
 * Convert YYYY-MM-DD date format to DD/MM/YYYY
 */
function convertDateToDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export const SlimmingWorld = () => {
  const {
    data: swData,
    loading,
    error,
  } = useDataFetch<SlimmingWorldData>(
    async () => {
      const supabase = getSupabaseClient();
      const db = createDatabaseService(supabase);

      // Fetch profile with entries
      const userId = "default"; // Default user ID
      const profileData = await db.getSlimmingWorldProfileWithEntries(userId);

      if (!profileData) {
        throw new Error("No Slimming World profile found");
      }

      // Get the current target weight from history
      const currentTarget = await db.getCurrentTargetWeight(profileData.id);
      const targetWeight = currentTarget
        ? currentTarget.target_weight
        : profileData.target_weight;

      // Transform database data to match expected format
      return {
        startDate: convertDateToDisplay(profileData.start_date),
        startWeight: Number(profileData.start_weight),
        targetWeight: Number(targetWeight),
        data: profileData.entries.map((entry) => ({
          date: convertDateToDisplay(entry.entry_date),
          weight: Number(entry.weight),
          change: Number(entry.weight_change),
          lost: Number(entry.total_lost),
          target: Number(entry.target_weight),
          sotw: entry.slimmer_of_week
            ? Number(entry.slimmer_of_week)
            : undefined,
        })),
      };
    },
    { cacheTTL: CACHE_TTL, cacheKey: "slimming-world-data" },
  );

  // Calculate total lost from most recent entry
  const totalLost =
    swData && swData.data.length > 0
      ? swData.data[swData.data.length - 1].lost
      : 0;
  const totalLostKg = totalLost * 0.453592;

  return (
    <>
      <PageTitleH1
        title="Slimming World"
        description="Personal weight tracking and progress visualization for Slimming World journey."
        keywords="Slimming World, weight tracking, health, fitness, progress tracking"
      />

      {loading && (
        <div className="row">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                Loading Slimming World data...
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && swData && (
        <>
          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-4">
              <WeightSummaryCard
                startDate={swData.startDate}
                startWeight={swData.startWeight}
                targetWeight={swData.targetWeight}
                data={swData.data}
              />
              <div className="total-lost-banner mt-4">
                <h2>
                  <span aria-hidden="true">🎯 </span>Total Lost to Date
                </h2>
                <div className="total-lost-stats">
                  <div className="stat-item">
                    <span className="stat-value">{totalLost}</span>
                    <span className="stat-label">lbs</span>
                  </div>
                  <div className="stat-divider">•</div>
                  <div className="stat-item">
                    <span className="stat-value">{totalLostKg.toFixed(2)}</span>
                    <span className="stat-label">kg</span>
                  </div>
                  <div className="stat-divider">•</div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {Math.floor(totalLost / 14)}st{" "}
                      {Math.round(totalLost % 14)}
                      lbs
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 mb-4">
              <WeightProgressChart data={swData.data} />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 mb-4">
              <h2 className="mb-3">
                <span aria-hidden="true">📈 </span>Weight Loss History
              </h2>
              <div className="weight-history-container">
                <WeightHistoryGrid details={swData.data} />
              </div>
            </div>
          </div>
        </>
      )}

      <BackToTop />
    </>
  );
};
