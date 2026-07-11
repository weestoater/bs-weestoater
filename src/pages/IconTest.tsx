/**
 * Icon Test Page
 * Verify Bootstrap Icons and Phosphor Icons are loading correctly
 */

export const IconTest = () => {
  return (
    <div className="container my-5">
      <h1>Icon Test Page</h1>

      <section className="my-4">
        <h2>Bootstrap Icons (v1.13.1)</h2>
        <div className="d-flex gap-3 flex-wrap align-items-center">
          <div>
            <i className="bi bi-heart"></i> bi-heart
          </div>
          <div>
            <i className="bi bi-heart-fill"></i> bi-heart-fill
          </div>
          <div>
            <i className="bi bi-star"></i> bi-star
          </div>
          <div>
            <i className="bi bi-star-fill"></i> bi-star-fill
          </div>
          <div>
            <i className="bi bi-check-circle"></i> bi-check-circle
          </div>
          <div>
            <i className="bi bi-x-circle"></i> bi-x-circle
          </div>
          <div>
            <i className="bi bi-trophy"></i> bi-trophy
          </div>
          <div>
            <i className="bi bi-lightning"></i> bi-lightning
          </div>
        </div>
      </section>

      <section className="my-4">
        <h2>Phosphor Icons (v2.1.2) - Regular Weight</h2>
        <div className="d-flex gap-3 flex-wrap align-items-center">
          <div>
            <i className="ph ph-heart"></i> ph-heart
          </div>
          <div>
            <i className="ph ph-star"></i> ph-star
          </div>
          <div>
            <i className="ph ph-check-circle"></i> ph-check-circle
          </div>
          <div>
            <i className="ph ph-x-circle"></i> ph-x-circle
          </div>
          <div>
            <i className="ph ph-trophy"></i> ph-trophy
          </div>
          <div>
            <i className="ph ph-lightning"></i> ph-lightning
          </div>
          <div>
            <i className="ph ph-house"></i> ph-house
          </div>
          <div>
            <i className="ph ph-user"></i> ph-user
          </div>
        </div>
      </section>

      <section className="my-4">
        <h2>Icon Sizing Examples</h2>

        <h3 className="h5 mt-4">Bootstrap Font-Size Utility Classes</h3>
        <div className="d-flex gap-3 align-items-center mb-3">
          <div>
            <i className="bi bi-heart fs-6"></i> fs-6 (smallest)
          </div>
          <div>
            <i className="bi bi-heart fs-5"></i> fs-5
          </div>
          <div>
            <i className="bi bi-heart fs-4"></i> fs-4
          </div>
          <div>
            <i className="bi bi-heart fs-3"></i> fs-3
          </div>
          <div>
            <i className="bi bi-heart fs-2"></i> fs-2
          </div>
          <div>
            <i className="bi bi-heart fs-1"></i> fs-1 (largest)
          </div>
        </div>

        <h3 className="h5 mt-4">Phosphor Icons with fs-1 (Custom 3.5rem)</h3>
        <div className="d-flex gap-3 align-items-center mb-3">
          <div>
            <i className="ph ph-heart fs-1"></i> ph-heart fs-1
          </div>
          <div>
            <i className="ph ph-star fs-1"></i> ph-star fs-1
          </div>
          <div>
            <i className="ph ph-trophy fs-1"></i> ph-trophy fs-1
          </div>
        </div>

        <h3 className="h5 mt-4">Custom Pixel Sizes (inline style)</h3>
        <div className="d-flex gap-3 align-items-center mb-3">
          <div>
            <i className="bi bi-star" style={{ fontSize: "16px" }}></i> 16px
          </div>
          <div>
            <i className="bi bi-star" style={{ fontSize: "24px" }}></i> 24px
          </div>
          <div>
            <i className="bi bi-star" style={{ fontSize: "32px" }}></i> 32px
          </div>
          <div>
            <i className="bi bi-star" style={{ fontSize: "48px" }}></i> 48px
          </div>
          <div>
            <i className="bi bi-star" style={{ fontSize: "64px" }}></i> 64px
          </div>
        </div>

        <h3 className="h5 mt-4">Relative REM Sizes</h3>
        <div className="d-flex gap-3 align-items-center mb-3">
          <div>
            <i className="ph ph-trophy" style={{ fontSize: "1rem" }}></i> 1rem
          </div>
          <div>
            <i className="ph ph-trophy" style={{ fontSize: "1.5rem" }}></i>{" "}
            1.5rem
          </div>
          <div>
            <i className="ph ph-trophy" style={{ fontSize: "2rem" }}></i> 2rem
          </div>
          <div>
            <i className="ph ph-trophy" style={{ fontSize: "2.5rem" }}></i>{" "}
            2.5rem
          </div>
          <div>
            <i className="ph ph-trophy" style={{ fontSize: "3rem" }}></i> 3rem
          </div>
        </div>

        <div className="alert alert-info mt-4">
          <h5>How to Use in TinyMCE:</h5>
          <p>
            <strong>Method 1: Bootstrap Classes</strong>
          </p>
          <pre className="bg-dark text-light p-2 rounded">
            &lt;i class="bi bi-heart fs-3"&gt;&lt;/i&gt;
          </pre>

          <p className="mt-3">
            <strong>Method 2: Phosphor Icons Large (3.5rem)</strong>
          </p>
          <pre className="bg-dark text-light p-2 rounded">
            &lt;i class="ph ph-star fs-1"&gt;&lt;/i&gt;
          </pre>

          <p className="mt-3">
            <strong>Method 3: Inline Style</strong>
          </p>
          <pre className="bg-dark text-light p-2 rounded">
            &lt;i class="bi bi-heart" style="font-size: 32px;"&gt;&lt;/i&gt;
          </pre>

          <p className="mt-3">
            <strong>Method 4: REM Units</strong>
          </p>
          <pre className="bg-dark text-light p-2 rounded">
            &lt;i class="ph ph-star" style="font-size: 2rem;"&gt;&lt;/i&gt;
          </pre>
        </div>
      </section>

      <section className="my-4">
        <h2>Font Loading Status</h2>
        <div className="alert alert-info">
          <h5>Bootstrap Icons</h5>
          <p>
            Loaded via:{" "}
            <code>import "bootstrap-icons/font/bootstrap-icons.css"</code>
          </p>
          <p>Package version: 1.13.1</p>
        </div>
        <div className="alert alert-info">
          <h5>Phosphor Icons</h5>
          <p>
            Loaded via: <code>import "@phosphor-icons/web/regular"</code> and{" "}
            <code>import "@phosphor-icons/web/fill"</code>
          </p>
          <p>Package version: 2.1.2</p>
        </div>
      </section>

      <section className="my-4">
        <h2>Debugging</h2>
        <p>If icons appear as blank squares or don't display:</p>
        <ol>
          <li>Check browser console for CSS loading errors</li>
          <li>Verify font files are accessible (Network tab)</li>
          <li>Hard refresh (Ctrl + Shift + R)</li>
          <li>
            Clear service worker cache (Application tab → Service Workers →
            Unregister)
          </li>
        </ol>
      </section>
    </div>
  );
};
