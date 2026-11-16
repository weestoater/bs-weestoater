import { useState } from 'react';
import { RouteMap } from './RouteMap';
import { decodePolyline } from '../../utils/polylineDecoder';
import { fetchStravaActivityDetail } from '../../utils/stravaApi';
import type { StravaActivity, StravaActivityDetail } from '../../interfaces/StravaActivity';
import { getActivityCategory } from '../../utils/stravaActivityType';

interface StravaActivityCardProps {
  activity: StravaActivity;
  useMetric?: boolean;
  formatDistance: (miles: number | null, metric: boolean) => string;
  formatSpeed: (mph: number | null, metric: boolean) => string;
  formatDuration: (minutes: number | null) => string;
  formatActivityDateTime: (startDateLocal: string) => string;
}

const METERS_PER_MILE = 1609.344;
const FEET_PER_METER = 3.28084;
const MPH_PER_METER_PER_SECOND = 2.236936;

function decodeSafely(polyline: string | null) {
  if (!polyline) return [];
  try {
    return decodePolyline(polyline);
  } catch (error) {
    console.warn('Failed to decode Strava polyline:', error);
    return [];
  }
}

/**
 * StravaActivityCard Component
 * Displays a single live Strava activity. Details (route map, calories,
 * description) are fetched the first time the card is expanded.
 */
export function StravaActivityCard({
  activity,
  useMetric = false,
  formatDistance,
  formatSpeed,
  formatDuration,
  formatActivityDateTime,
}: StravaActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<StravaActivityDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const distanceMiles = activity.distanceM / METERS_PER_MILE;
  const durationMinutes = activity.movingTimeS / 60;
  const avgSpeedMph =
    activity.averageSpeedMs === null ? null : activity.averageSpeedMs * MPH_PER_METER_PER_SECOND;
  const elevationFt = activity.elevationGainM * FEET_PER_METER;
  const activityCategory = getActivityCategory(activity.sportType);
  const dateTime = formatActivityDateTime(activity.startDateLocal);
  const coordinates = decodeSafely(detail?.polyline ?? activity.polyline);

  const handleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (!next || detail || detailLoading) return;

    setDetailLoading(true);
    setDetailError(null);
    try {
      setDetail(await fetchStravaActivityDetail(activity.id));
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Failed to load activity details');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="col-lg-4 col-sm-12 mb-3">
    <div className="card mb-3">
      <div className="card-header bg-light d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <h5 className="card-title mb-2">
            <span className={`badge ${activityCategory.colorClass} me-2`}>
              <i className={`bi ${activityCategory.icon} me-1`} aria-hidden="true"></i>
              {activityCategory.label}
            </span>
            {activity.name}
          </h5>
          <p className="text-muted mb-0 small">
            <i className="bi bi-calendar me-1"></i>
            {dateTime}
          </p>
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleExpand}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
        >
          <i className={`bi bi-chevron-${expanded ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {/* Summary Stats Row */}
      <div className="card-body border-bottom">
        <div className="row g-3">
          <div className="col-sm-3 col-xs-6 text-center">
            <small className="text-muted d-block">Distance</small>
            <strong>{formatDistance(distanceMiles, useMetric)}</strong>
          </div>
          <div className="col-sm-3 col-xs-6 text-center">
            <small className="text-muted d-block">Duration</small>
            <strong>{formatDuration(durationMinutes)}</strong>
          </div>
          <div className="col-sm-3 col-xs-6 text-center">
            <small className="text-muted d-block">Avg Speed</small>
            <strong>{formatSpeed(avgSpeedMph, useMetric)}</strong>
          </div>
          <div className="col-sm-3 col-xs-6 text-center">
            <small className="text-muted d-block">Elevation</small>
            <strong>
              {useMetric
                ? `${activity.elevationGainM.toFixed(0)} m`
                : `${elevationFt.toFixed(0)} ft`}
            </strong>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      {expanded && (
        <div className="card-body">
          {detailLoading && (
            <p className="text-muted small" role="status">Loading details…</p>
          )}

          {detailError && (
            <div className="alert alert-danger small" role="alert">
              {detailError}
            </div>
          )}

          {/* Route Map */}
          {coordinates.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                Route Map
              </h3>
              <RouteMap coordinates={coordinates} height="400px" title={activity.name} />
            </div>
          )}

          {/* Detailed Stats */}
          <div className="row g-3">
            {activity.averageHeartrate !== null && (
              <div className="col-sm-6">
                <small className="text-muted d-block">Avg Heart Rate</small>
                <strong>{Math.round(activity.averageHeartrate)} bpm</strong>
              </div>
            )}
            {activity.maxHeartrate !== null && (
              <div className="col-sm-6">
                <small className="text-muted d-block">Max Heart Rate</small>
                <strong>{Math.round(activity.maxHeartrate)} bpm</strong>
              </div>
            )}
            {detail?.calories != null && (
              <div className="col-sm-6">
                <small className="text-muted d-block">Calories Burned</small>
                <strong>{Math.round(detail.calories)} kcal</strong>
              </div>
            )}
          </div>

          {detail?.description && (
            <div className="mt-4">
              <p><strong>Comments</strong></p>
              <p>{detail.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
    </div>  
  );
}
