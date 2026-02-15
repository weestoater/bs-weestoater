import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { GarminActivityCard } from "../components/sw/GarminActivityCard";
import { DailyStepsCard } from "../components/sw/DailyStepsCard";
import garminActivitiesJson from "../data/garminActivities.json";
import { GarminActivity } from "../interfaces/GarminActivity";
import { DailySteps } from "../interfaces/DailySteps";
import { useGarminActivities } from "../hooks/useGarminActivities";
import { useDailySteps } from "../hooks/useDailySteps";

export const GarminActivities = () => {
  // Fetch activities from Supabase with JSON fallback
  const {
    activities: garminActivities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useGarminActivities({
    limit: 100,
    fallbackData: garminActivitiesJson as GarminActivity[],
  });

  // Fetch daily steps from Supabase (database only)
  const {
    dailySteps,
    loading: stepsLoading,
    error: stepsError,
  } = useDailySteps({
    limit: 60,
  });

  return (
    <>
      <PageTitleH1
        title="Fitness Activities"
        description="Track and visualize fitness activities from Garmin Connect including running, cycling, walking, and more."
        keywords="Garmin, fitness, activities, running, cycling, walking, health tracking"
      />

      <div className="row">
        <div className="col-12 mb-4">
          <p className="lead">
            <span aria-hidden="true">⌚ </span>
            Your fitness journey tracked automatically from Garmin Connect. View
            your activities, progress, and daily steps all in one place.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 mb-4">
          <h2 className="mb-3">
            <span aria-hidden="true">🏃 </span>Activity History
          </h2>
          {activitiesLoading && (
            <div className="alert alert-info">
              <div className="d-flex align-items-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading activities from database...
              </div>
            </div>
          )}
          {activitiesError && (
            <div className="alert alert-warning">
              <strong>Note:</strong> Using local data. Database connection
              unavailable.
            </div>
          )}
          <GarminActivityCard
            activities={garminActivities as GarminActivity[]}
          />
        </div>

        <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mb-4">
          <h2 className="mb-3">
            <span aria-hidden="true">👣 </span>Daily Steps
          </h2>
          {stepsLoading && (
            <div className="alert alert-info">
              <div className="d-flex align-items-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading step data from database...
              </div>
            </div>
          )}
          {stepsError && (
            <div className="alert alert-warning">
              <strong>Note:</strong> Unable to load daily steps from database.
              Run the sync script to populate data.
            </div>
          )}
          <DailyStepsCard dailySteps={dailySteps as DailySteps[]} />

          <div className="card mt-4">
            <div className="card-body">
              <h3 className="card-title">
                <span aria-hidden="true">ℹ️ </span>About This Data
              </h3>
              <p className="small">
                Activities and daily steps are automatically synced from Garmin
                Connect and stored in the database. Data includes distance,
                duration, heart rate, pace, step counts, and more.
              </p>
              <p className="small mb-0">
                <strong>Sync:</strong> Run{" "}
                <code>node scripts/sync-garmin-activities.js</code> to fetch
                latest data from Garmin Connect.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
    </>
  );
};
