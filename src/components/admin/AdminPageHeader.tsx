/**
 * Admin Page Header Component
 * Provides consistent navigation and layout for admin pages
 */

import { Link } from "react-router-dom";

interface AdminPageHeaderProps {
  title: string;
  icon?: string;
  description?: string;
  backLink?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export const AdminPageHeader = ({
  title,
  icon = "bi-gear-fill",
  description,
  backLink,
  backLabel = "Back",
  actions,
}: AdminPageHeaderProps) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h1 className="mb-2">
              <i className={`${icon} me-3`}></i>
              {title}
            </h1>
            {description && <p className="text-muted mb-0">{description}</p>}
          </div>
          <div className="d-flex gap-2">
            {backLink && (
              <Link to={backLink} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                {backLabel}
              </Link>
            )}
            {actions}
          </div>
        </div>

        {/* Breadcrumb navigation */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin">
                <i className="bi bi-house-door-fill me-1"></i>
                Admin Dashboard
              </Link>
            </li>
            {backLink && backLink !== "/admin" && (
              <li className="breadcrumb-item">
                <Link to={backLink}>{backLabel}</Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>
        <hr />
      </div>
    </div>
  );
};
