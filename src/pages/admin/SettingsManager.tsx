import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../../backend/index.js";
import { useAuth } from "../../hooks/useAuth";
import { useSEO } from "../../utils/useSEO";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import type { SiteConfig } from "../../types/weecms";

const { createSiteConfigService } = await import("../../../backend/index.js");

export const SettingsManager = () => {
  useSEO({
    title: "Site Settings",
    description: "Manage global site configuration",
  });

  const { user } = useAuth();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const siteConfigService = createSiteConfigService(client);
      const data = await siteConfigService.getSiteConfig();
      setConfig(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load configuration",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const client = getSupabaseClient();
      const siteConfigService = createSiteConfigService(client);
      await siteConfigService.updateSiteConfig(config, user?.id);
      setSuccessMessage("Settings saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteConfig, value: unknown) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          No configuration found. Please run the migration script.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <AdminPageHeader
        title="Site Settings"
        icon="bi-gear-fill"
        description="Manage global site configuration"
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

      {successMessage && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <i className="bi bi-info-circle me-1"></i>
            General
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "branding" ? "active" : ""}`}
            onClick={() => setActiveTab("branding")}
          >
            <i className="bi bi-palette me-1"></i>
            Branding
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => setActiveTab("seo")}
          >
            <i className="bi bi-search me-1"></i>
            SEO
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "social" ? "active" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            <i className="bi bi-share me-1"></i>
            Social
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            <i className="bi bi-toggles me-1"></i>
            Features
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "footer" ? "active" : ""}`}
            onClick={() => setActiveTab("footer")}
          >
            <i className="bi bi-layout-text-window-reverse me-1"></i>
            Footer
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="card">
        <div className="card-body">
          {activeTab === "general" && (
            <div>
              <h3 className="h5 mb-4">General Settings</h3>

              <div className="mb-3">
                <label htmlFor="site_name" className="form-label">
                  Site Name *
                </label>
                <input
                  type="text"
                  id="site_name"
                  className="form-control"
                  value={config.site_name}
                  onChange={(e) => updateField("site_name", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="site_tagline" className="form-label">
                  Site Tagline
                </label>
                <input
                  type="text"
                  id="site_tagline"
                  className="form-control"
                  value={config.site_tagline || ""}
                  onChange={(e) => updateField("site_tagline", e.target.value)}
                  placeholder="A short description or slogan"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="site_description" className="form-label">
                  Site Description
                </label>
                <textarea
                  id="site_description"
                  className="form-control"
                  rows={3}
                  value={config.site_description || ""}
                  onChange={(e) =>
                    updateField("site_description", e.target.value)
                  }
                  placeholder="Full site description for SEO"
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={config.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="default_theme" className="form-label">
                  Default Theme
                </label>
                <select
                  id="default_theme"
                  className="form-select"
                  value={config.default_theme}
                  onChange={(e) => updateField("default_theme", e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="high-contrast">High Contrast</option>
                  <option value="gov-uk">GOV.UK</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "branding" && (
            <div>
              <h3 className="h5 mb-4">Branding Settings</h3>

              <div className="mb-3">
                <label htmlFor="logo_url" className="form-label">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logo_url"
                  className="form-control"
                  value={config.logo_url || ""}
                  onChange={(e) => updateField("logo_url", e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <small className="text-muted">
                  Upload logo via Media Library (Phase 5)
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="favicon_url" className="form-label">
                  Favicon URL
                </label>
                <input
                  type="url"
                  id="favicon_url"
                  className="form-control"
                  value={config.favicon_url || ""}
                  onChange={(e) => updateField("favicon_url", e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
                <small className="text-muted">
                  Upload favicon via Media Library (Phase 5)
                </small>
              </div>

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Coming in Phase 5:</strong> Media Library will allow you
                to upload and manage logos and favicons directly.
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div>
              <h3 className="h5 mb-4">SEO Settings</h3>

              <div className="mb-3">
                <label htmlFor="default_og_image" className="form-label">
                  Default Open Graph Image
                </label>
                <input
                  type="url"
                  id="default_og_image"
                  className="form-control"
                  value={config.default_og_image || ""}
                  onChange={(e) =>
                    updateField("default_og_image", e.target.value)
                  }
                  placeholder="https://example.com/og-image.jpg"
                />
                <small className="text-muted">
                  Used for social media previews (1200×630px recommended)
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="google_analytics_id" className="form-label">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  id="google_analytics_id"
                  className="form-control"
                  value={config.google_analytics_id || ""}
                  onChange={(e) =>
                    updateField("google_analytics_id", e.target.value)
                  }
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="google_site_verification"
                  className="form-label"
                >
                  Google Site Verification
                </label>
                <input
                  type="text"
                  id="google_site_verification"
                  className="form-control"
                  value={config.google_site_verification || ""}
                  onChange={(e) =>
                    updateField("google_site_verification", e.target.value)
                  }
                  placeholder="verification_code"
                />
                <small className="text-muted">
                  Verification code from Google Search Console
                </small>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div>
              <h3 className="h5 mb-4">Social Media Links</h3>

              <div className="mb-3">
                <label htmlFor="github" className="form-label">
                  <i className="bi bi-github me-1"></i> GitHub
                </label>
                <input
                  type="url"
                  id="github"
                  className="form-control"
                  value={
                    (config.social_links as Record<string, string>)?.github ||
                    ""
                  }
                  onChange={(e) =>
                    updateField("social_links", {
                      ...(config.social_links as Record<string, string>),
                      github: e.target.value,
                    })
                  }
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="linkedin" className="form-label">
                  <i className="bi bi-linkedin me-1"></i> LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  className="form-control"
                  value={
                    (config.social_links as Record<string, string>)?.linkedin ||
                    ""
                  }
                  onChange={(e) =>
                    updateField("social_links", {
                      ...(config.social_links as Record<string, string>),
                      linkedin: e.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="twitter" className="form-label">
                  <i className="bi bi-twitter me-1"></i> Twitter / X
                </label>
                <input
                  type="url"
                  id="twitter"
                  className="form-control"
                  value={
                    (config.social_links as Record<string, string>)?.twitter ||
                    ""
                  }
                  onChange={(e) =>
                    updateField("social_links", {
                      ...(config.social_links as Record<string, string>),
                      twitter: e.target.value,
                    })
                  }
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div>
              <h3 className="h5 mb-4">Feature Toggles</h3>

              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  id="enable_search"
                  className="form-check-input"
                  checked={config.enable_search}
                  onChange={(e) =>
                    updateField("enable_search", e.target.checked)
                  }
                />
                <label htmlFor="enable_search" className="form-check-label">
                  Enable Search
                </label>
                <div className="form-text">
                  Enable site-wide search functionality
                </div>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  id="enable_comments"
                  className="form-check-input"
                  checked={config.enable_comments}
                  onChange={(e) =>
                    updateField("enable_comments", e.target.checked)
                  }
                />
                <label htmlFor="enable_comments" className="form-check-label">
                  Enable Comments
                </label>
                <div className="form-text">
                  Allow comments on articles and posts
                </div>
              </div>

              <hr className="my-4" />

              <h4 className="h6 mb-3 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Maintenance Mode
              </h4>

              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  id="maintenance_mode"
                  className="form-check-input"
                  checked={config.maintenance_mode}
                  onChange={(e) =>
                    updateField("maintenance_mode", e.target.checked)
                  }
                />
                <label htmlFor="maintenance_mode" className="form-check-label">
                  Enable Maintenance Mode
                </label>
                <div className="form-text">
                  Display maintenance message to all visitors (except admins)
                </div>
              </div>

              {config.maintenance_mode && (
                <div className="mb-3">
                  <label htmlFor="maintenance_message" className="form-label">
                    Maintenance Message
                  </label>
                  <textarea
                    id="maintenance_message"
                    className="form-control"
                    rows={3}
                    value={config.maintenance_message || ""}
                    onChange={(e) =>
                      updateField("maintenance_message", e.target.value)
                    }
                    placeholder="We're currently performing maintenance. Please check back soon!"
                  ></textarea>
                </div>
              )}
            </div>
          )}

          {activeTab === "footer" && (
            <div>
              <h3 className="h5 mb-4">Footer Settings</h3>

              <div className="mb-3">
                <label htmlFor="footer_text" className="form-label">
                  Footer Text
                </label>
                <textarea
                  id="footer_text"
                  className="form-control"
                  rows={2}
                  value={config.footer_text || ""}
                  onChange={(e) => updateField("footer_text", e.target.value)}
                  placeholder="© 2026 Your Name. All rights reserved."
                ></textarea>
                <small className="text-muted">
                  Supports HTML for links and formatting
                </small>
              </div>

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Footer Links:</strong> Coming soon - manage footer
                navigation links
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="d-grid gap-2 mt-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};
