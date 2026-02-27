import burtIcon from "../../assets/img/burt.png";
import motherwell from "../../assets/img/motherwell.png";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const ShapesDemo = () => {
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>
            <i className="bi bi-circle-square me-2"></i> CSS Shape Functions
            Demo
          </h2>
        </div>
        <div className="card-body">
          <ArticleMeta
            metadata={{
              title: "CSS Shape Functions Demo",
              category: "about",
              author: "Ian Burrett",
              tags: ["css", "shapes", "demo", "avatar"],
              publishedDate: "2026-02-27",
              readingTime: "5",
            }}
          />
          <section className="mb-5">
            <h3>Circle Shapes</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Circle demo"
                className="shape-circle right shape-md"
                loading="lazy"
              />
              <p>
                <strong>Circle shape with .shape-circle class:</strong> This is
                the most common shape for avatars and profile pictures. Notice
                how the text wraps smoothly around the circular image, creating
                a natural and professional look. The shape-outside property
                ensures that the text respects the circular boundary, while
                clip-path actually clips the image to a circle. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Enhanced Avatar</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Enhanced avatar demo"
                className="avatar-enhanced left shape-lg"
                loading="lazy"
              />
              <p>
                <strong>Enhanced avatar with .avatar-enhanced class:</strong>{" "}
                This variation adds a white border and subtle shadow effect,
                perfect for profile pictures and team member photos. The
                enhanced styling makes the image stand out while maintaining a
                professional appearance. Notice the 3px white border and the
                soft shadow that gives depth to the image. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Football Badge Shapes</h3>
            <div className="mb-4">
              <img
                src={motherwell}
                alt="Football badge with shape-football-badge"
                className="shape-football-badge right shape-lg"
                loading="lazy"
              />
              <p>
                <strong>
                  Football badge with .shape-football-badge class:
                </strong>{" "}
                Specifically designed for football club badges and sports logos.
                This class adds a white background with padding, rounded
                corners, and a subtle shadow effect. The object-fit: contain
                ensures the badge proportions are preserved. Perfect for
                displaying Motherwell FC, Dundee United, or any other club badge
                in your content. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={motherwell}
                alt="Football badge with shield shape"
                className="shape-shield left shape-md"
                loading="lazy"
              />
              <p>
                <strong>Shield shape with .shape-shield class:</strong> The
                traditional football badge shape! This polygon-based shield
                mimics the classic shape of football crests. Text wraps around
                the shield contour, creating an authentic and sporty look. Ideal
                for featuring club badges in match reports and football-related
                content. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Rounded Rectangle Shapes</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Rounded rectangle demo"
                className="shape-rounded-rect right shape-xl"
                loading="lazy"
              />
              <p>
                <strong>
                  Rounded rectangle with .shape-rounded-rect class:
                </strong>{" "}
                This shape provides a modern, professional look with moderate
                rounded corners (20px radius). Perfect for screenshots, UI
                mockups, and product images. The subtle rounding softens the
                appearance while maintaining a structured layout. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Soft rounded rectangle demo"
                className="shape-rounded-rect-soft left shape-lg"
                loading="lazy"
              />
              <p>
                <strong>
                  Soft rounded rectangle with .shape-rounded-rect-soft class:
                </strong>{" "}
                Features extra rounded corners (40px radius) for a softer, more
                approachable design. Great for feature images, product photos,
                and any content where you want a friendly, welcoming appearance.
                The increased border radius creates a more organic feel. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Polygon Shapes</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Hexagon demo"
                className="shape-hexagon right shape-md"
                loading="lazy"
              />
              <p>
                <strong>Hexagon with .shape-hexagon class:</strong> A six-sided
                geometric shape perfect for badges, icons, and achievement
                displays. The hexagon creates a distinctive, modern look that
                stands out in your content. Text flows naturally around the six
                edges. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Octagon demo"
                className="shape-octagon left shape-lg"
                loading="lazy"
              />
              <p>
                <strong>Octagon with .shape-octagon class:</strong> An
                eight-sided shape that provides a unique, geometric aesthetic.
                Perfect for creating distinctive layouts and drawing attention
                to featured content. The octagon shape is more circular than a
                square but more angular than a circle. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Ellipse Shapes</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Vertical ellipse demo"
                className="shape-ellipse-vertical right shape-lg"
                loading="lazy"
              />
              <p>
                <strong>
                  Vertical ellipse with .shape-ellipse-vertical class:
                </strong>{" "}
                Ideal for portrait-oriented images (taller than wide). The
                vertical ellipse creates an elegant, stretched circular shape
                that complements portrait photography and tall graphics. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Horizontal ellipse demo"
                className="shape-ellipse-horizontal left shape-xl"
                loading="lazy"
              />
              <p>
                <strong>
                  Horizontal ellipse with .shape-ellipse-horizontal class:
                </strong>{" "}
                Perfect for landscape-oriented images (wider than tall). The
                horizontal ellipse provides a panoramic feel, ideal for scenic
                photos and wide graphics. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Size Variations</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Small shape"
                className="shape-circle right shape-sm"
                loading="lazy"
              />
              <p>
                <strong>Small size (.shape-sm):</strong> 100x100px - Perfect for
                inline icons and small avatars. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Medium shape"
                className="shape-circle left shape-md"
                loading="lazy"
              />
              <p>
                <strong>Medium size (.shape-md):</strong> 150x150px - The
                default choice for most content images. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Large shape"
                className="shape-circle right shape-lg"
                loading="lazy"
              />
              <p>
                <strong>Large size (.shape-lg):</strong> 200x200px - Great for
                featured images and prominent visuals. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Extra large shape"
                className="shape-circle left shape-xl"
                loading="lazy"
              />
              <p>
                <strong>Extra large size (.shape-xl):</strong> 250x250px - For
                hero images and major focal points. Lorem ipsum dolor sit amet.
              </p>
            </div>
          </section>

          <section className="mb-5">
            <h3>Spacing Utilities</h3>
            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Spacious demo"
                className="shape-circle right shape-md shape-spacious"
                loading="lazy"
              />
              <p>
                <strong>Spacious with .shape-spacious:</strong> Adds extra
                breathing room (30px margin) around the shape. Notice how
                there's more space between the image and the text, creating a
                more open, airy layout. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris.
              </p>
            </div>

            <div className="mb-4">
              <img
                src={burtIcon}
                alt="Tight demo"
                className="shape-circle left shape-md shape-tight"
                loading="lazy"
              />
              <p>
                <strong>Tight with .shape-tight:</strong> Reduces spacing (10px
                margin) for a more compact layout. The text sits closer to the
                image, ideal for dense content sections. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </section>

          <section className="alert alert-info">
            <h4>Implementation Tips</h4>
            <ul>
              <li>
                Combine shape class + position class (left/right) + size class
                (sm/md/lg/xl)
              </li>
              <li>Add shape-spacious or shape-tight for spacing control</li>
              <li>
                Use shape-contain or shape-cover to control object-fit behavior
              </li>
              <li>All shapes are responsive and adjust for mobile devices</li>
              <li>Works in all modern browsers with graceful degradation</li>
            </ul>
          </section>

          <section className="alert alert-success">
            <h4>Perfect for Your Project</h4>
            <ul>
              <li>
                <strong>Avatars:</strong> Use .avatar-enhanced for profile
                pictures
              </li>
              <li>
                <strong>Football badges:</strong> Use .shape-football-badge or
                .shape-shield
              </li>
              <li>
                <strong>Blog images:</strong> Use .shape-rounded-rect-soft for a
                modern look
              </li>
              <li>
                <strong>Icons:</strong> Use .shape-circle with .shape-sm for
                inline icons
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
