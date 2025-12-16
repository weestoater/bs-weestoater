export const SkeletonCard = () => {
  return (
    <div className="skeleton-card card" aria-busy="true" aria-live="polite">
      <div className="card-header">
        <div className="skeleton skeleton-title"></div>
      </div>
      <div className="card-body">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text skeleton-text-short"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = () => {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton-grid-header"></div>
      <div className="skeleton skeleton-grid-row"></div>
      <div className="skeleton skeleton-grid-row"></div>
      <div className="skeleton skeleton-grid-row"></div>
      <div className="skeleton skeleton-grid-row"></div>
      <div className="skeleton skeleton-grid-row"></div>
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="skeleton-chart" aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton-chart-title"></div>
      <div className="skeleton skeleton-chart-body"></div>
    </div>
  );
};
