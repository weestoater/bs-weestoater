import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSEO } from "../../utils/useSEO";

export const AdminDashboard = () => {
  useSEO({
    title: "Admin Dashboard",
    description: "BS WeeStaater content management system",
  });

  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <i className="bi bi-speedometer2 me-2"></i>
              Admin Dashboard
            </h1>
            <div>
              <span className="me-3 text-muted">
                <i className="bi bi-person-circle me-1"></i>
                {user?.email}
              </span>
              <button
                className="btn btn-outline-danger"
                onClick={handleSignOut}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Sign Out
              </button>
            </div>
          </div>
          <hr />
        </div>
      </div>

      <div className="row g-4">
        {/* Books Management */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-book me-2 text-primary"></i>
                Books
              </h3>
              <p className="card-text">
                Manage book reviews and recommendations
              </p>
              <Link to="/admin/books" className="btn btn-primary">
                Manage Books
              </Link>
            </div>
          </div>
        </div>

        {/* Articles Management */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-newspaper me-2 text-success"></i>
                Articles
              </h3>
              <p className="card-text">
                Manage blog posts and articles across all categories
              </p>
              <Link to="/admin/articles" className="btn btn-success">
                Manage Articles
              </Link>
            </div>
          </div>
        </div>

        {/* Media Library - Coming Soon */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 bg-light">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-images me-2 text-secondary"></i>
                Media
              </h3>
              <p className="card-text">Manage images and media files</p>
              <button className="btn btn-secondary" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Quick Stats
              </h3>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4">
                  <h4 className="text-primary">3</h4>
                  <p className="text-muted">Books Published</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-success">18</h4>
                  <p className="text-muted">Articles</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-info">0</h4>
                  <p className="text-muted">Media Files</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="row mt-4 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">
                <i className="bi bi-link-45deg me-2"></i>
                Quick Links
              </h3>
            </div>
            <div className="card-body">
              <div className="list-group">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action"
                >
                  <i className="bi bi-database me-2"></i>
                  Supabase Dashboard
                </a>
                <Link to="/" className="list-group-item list-group-item-action">
                  <i className="bi bi-house me-2"></i>
                  View Live Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
