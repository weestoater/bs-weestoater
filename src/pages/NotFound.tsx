import { useLocation, Link } from "react-router-dom";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";

export const NotFoundPage = () => {
  const location = useLocation();

  return (
    <>
      <PageTitleH1
        title="404 - Page Not Found"
        description="The page you are looking for could not be found."
      />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h2>
                <i
                  className="bi bi-exclamation-triangle me-2"
                  aria-hidden="true"
                ></i>
                Oops! Page Not Found
              </h2>
            </div>
            <div className="card-body">
              <p className="lead">
                The page <code>{location.pathname}</code> doesn't exist.
              </p>
              <p>
                It looks like you've followed a broken link or entered a URL
                that doesn't exist on this site.
              </p>

              <h3 className="h5 mt-4">Here are some helpful links instead:</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="btn btn-outline-primary">
                    <i className="bi bi-house me-2" aria-hidden="true"></i>
                    Go to Homepage
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/football" className="btn btn-outline-secondary">
                    <i className="bi bi-trophy me-2" aria-hidden="true"></i>
                    Football Section
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/react" className="btn btn-outline-secondary">
                    <i
                      className="bi bi-filetype-tsx me-2"
                      aria-hidden="true"
                    ></i>
                    React Articles
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/about" className="btn btn-outline-secondary">
                    <i
                      className="bi bi-info-circle me-2"
                      aria-hidden="true"
                    ></i>
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
    </>
  );
};
