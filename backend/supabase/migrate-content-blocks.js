/**
 * weeCMS Content Blocks Migration Script
 *
 * Migrates hard-coded TSX content from Home and About pages to the
 * content_blocks database table.
 *
 * Usage:
 *   node backend/supabase/migrate-content-blocks.js
 *
 * Prerequisites:
 *   - weecms-schema.sql has been run in Supabase
 *   - Environment variables configured (.env file)
 */

import "dotenv/config";
import { createSupabaseClient } from "./client.js";

// Service role key required to bypass RLS during migration
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

if (!SERVICE_ROLE_KEY) {
  console.error("\n❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is required");
  console.error(
    "This key bypasses Row Level Security for migration operations.\n",
  );
  console.error("Add to your .env file:");
  console.error("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n");
  console.error("Find it in: Supabase Dashboard → Project Settings → API\n");
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error("\n❌ ERROR: SUPABASE_URL is required");
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createSupabaseClient({
  url: SUPABASE_URL,
  anonKey: SERVICE_ROLE_KEY,
});

// ============================================================================
// CONTENT DATA
// ============================================================================

const homePageContent = [
  {
    slug: "home-dynamic-card",
    title: "Dynamic",
    page: "home",
    content: `
      <div class="right w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Baseball Helmet Icon">
          <path d="M88,128a40,40,0,1,0,40,40A40,40,0,0,0,88,128Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,88,192Zm112-80a88.1,88.1,0,0,0-88-88H24A16,16,0,0,0,8,40V96a16,16,0,0,0,16,16H40v0a87.93,87.93,0,0,0,72,88h0v32a8,8,0,0,0,16,0V200h0A88,88,0,0,0,200,112ZM24,40h88a72.08,72.08,0,0,1,72,72H24Zm88,144A72.08,72.08,0,0,1,40,112H184A72.08,72.08,0,0,1,112,184Z"></path>
        </svg>
      </div>
      <p>
        I recently took a notion to look at database solutions online, using
        Claude to help me, I've since migrated a majority chunk of this site
        to a mini-cms of sorts. Not using WordPress or Umbraco or the like,
        instead creating my own engine which allows me to grow the structure
        and functionality as I see fit.
      </p>
      <p>
        There still isn't any roadmap of what I want to build, but moving the
        football section to a database has been excellent as I can now add the
        new scores and cards, etc. without editing code or pushing things to
        the site. I still have things to improve their and some rough edges to
        smooth out, but it's been a fun experiment so far.
      </p>
      <div class="left w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Detective Icon">
          <path d="M248,112a56.06,56.06,0,0,0-56-56H152.49L138.6,29.76a16,16,0,0,0-21.2,0L103.51,56H64a56.06,56.06,0,0,0-56,56,16,16,0,0,0,8.77,14.27L68.08,205.69A15.89,15.89,0,0,0,81.47,216H168a16,16,0,0,0,15.06-10.59l37.2-106.64A16,16,0,0,0,248,112Zm-40-40a40,40,0,0,1,39.93,40h-22.3L189.5,69.76l-2.41-1.2A32.28,32.28,0,0,0,172.75,64H192ZM128,40l14.93,11.48a16.12,16.12,0,0,0,19.63,0L177.49,40ZM64,72h44.75a32.28,32.28,0,0,0-14.34,4.56L66.63,88.32,30.37,112H8.07A40,40,0,0,1,64,72Zm.53,128L16.32,128H76l20.91,72ZM152,200H83.49l-20.2-69.37,46.82-23.42a16.12,16.12,0,0,1,14.27,0L165.52,128Z"></path>
        </svg>
      </div>
      <p>
        Working with Supabase has been a great experience, with Claude guiding
        me through all the setup, sql commands, imports, etc. It's been a
        joyous learning curve and I'm really looking forward to seeing what
        and how I can build up the site. I need to get a handle on how to
        cover patches and security updates, but that's for next time...
      </p>
    `,
    icon: "bi bi-database-fill-check",
    content_type: "card",
    order_index: 0,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "Dynamic",
        category: "home",
        author: "Ian Burrett",
        tags: ["experiment", "react", "frontend", "football"],
        publishedDate: "2026-02-27",
        readingTime: 3,
      },
    },
  },
  {
    slug: "home-slim-line-version",
    title: "Slim Line",
    page: "home",
    content: `
      <div class="right w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Bowl Food Icon">
          <path d="M224,104h-8.37a88,88,0,0,0-175.26,0H32a8,8,0,0,0-8,8,104.35,104.35,0,0,0,56,92.28V208a16,16,0,0,0,16,16h64a16,16,0,0,0,16-16v-3.72A104.35,104.35,0,0,0,232,112,8,8,0,0,0,224,104Zm-24.46,0H148.12a71.84,71.84,0,0,1,41.42-53.56A72.15,72.15,0,0,1,199.54,104Zm-31.31-0H87.77a55.87,55.87,0,0,1,80.46,0ZM128,32a72.08,72.08,0,0,1,72,72H56A72.08,72.08,0,0,1,128,32ZM40.36,120H215.64A88.29,88.29,0,0,1,168,200H88A88.29,88.29,0,0,1,40.36,120ZM160,208H96v-1.77a104.91,104.91,0,0,0,64,0Z"></path>
        </svg>
      </div>
      <p>
        Around June '25 I joined a local Slimming World group, in order to
        drop some of the <strong>several lbs</strong> extra weight I'd picked
        up. It was done out of curiosity more than anything else, as I wanted
        to see how the group dynamic worked in person, and also to see how the
        food plan worked for me.
      </p>
      <p>
        I had some great initial success, including losing weight whilst on
        holiday down in Cornwall, at the mercy of Cornish pasties and cream
        teas (jam first!). I have been supported throughout by my wife, who
        has been brilliant at adapting meals to fit in with the plan, and
        benefiting from the extra veg and healthy options herself. I've even
        ventured out on the mountain bike with my brother for the first time
        in ages, this time not stopping every 5 minutes for a breather!
      </p>
      <div class="left w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Barbell Icon">
          <path d="M248,120h-8V88a16,16,0,0,0-16-16H208V64a16,16,0,0,0-16-16H168a16,16,0,0,0-16,16v56H104V64A16,16,0,0,0,88,48H64A16,16,0,0,0,48,64v8H32A16,16,0,0,0,16,88v32H8a8,8,0,0,0,0,16h8v32a16,16,0,0,0,16,16H48v8a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V136h48v56a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16v-8h16a16,16,0,0,0,16-16V136h8a8,8,0,0,0,0-16ZM32,168V88H48v80Zm56,24H64V64H88V192Zm104,0H168V64h24V192Zm32-24H208V88h16Z"></path>
        </svg>
      </div>
      <p>
        One of the group members referred to her journey as taking the 'scenic
        route', and that is exactly how I am aiming to approach it now myself.
        I have lost 2 stones, at this time, some days have been easier than
        others, but I want to be more honest with myself and my eating habits,
        so I don't want to sit hungry all the time either.
      </p>
    `,
    icon: "bi bi-bicycle",
    content_type: "card",
    order_index: 1,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "Slim Line",
        category: "home",
        author: "Ian Burrett",
        tags: ["slimming world", "weight loss", "health", "bike"],
        publishedDate: "2026-02-27",
        readingTime: 3,
      },
    },
  },
  {
    slug: "home-ethos",
    title: "Ethos",
    page: "home",
    content: `
      <div class="right w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Brain Icon">
          <path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.41A56.09,56.09,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.67,86.27,8,8,0,0,0,56,78.73V72a32,32,0,0,1,64,0v68.26A47.8,47.8,0,0,0,88,128a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,1,1,168,144a8,8,0,0,0,0-16,47.8,47.8,0,0,0-32,12.26V72a32,32,0,0,1,64,0v6.73a8,8,0,0,0,5.33,7.54A40,40,0,0,1,192,164Zm16-52a8,8,0,0,1-8,8h-4a36,36,0,0,0-36-36,8,8,0,0,1,0-16,52.05,52.05,0,0,1,52,52A8,8,0,0,1,208,112ZM60,120H56a8,8,0,0,1-8-8,52.05,52.05,0,0,1,52-52,8,8,0,0,1,0,16,36,36,0,0,0-36,36A8,8,0,0,1,60,120Z"></path>
        </svg>
      </div>
      <p>
        I started this space as an online area for me to experiment with
        ReactJS and data 'patterns'. I've not got any desire to add a database
        or other server-side mechanisms - instead I want to concentrate purely
        on the front end aspects of rendering JSON payloads.
      </p>
      <p>
        There wasn't any roadmap of what I wanted to build, but I was
        iterating around the football details, using the Motherwell F.C.
        results as my data source,'hand-rolling' the data into two
        <code>.json</code> files:
      </p>
      <ul>
        <li>mfc-goals</li>
        <li>mfc-matches</li>
      </ul>
      <p>
        then creating a number of components to render the results onto the
        page. This works well for me so I've moved off AWS and am hosting
        elsewhere instead.
      </p>
      <p>
        That worked for a few seasons, but maintaining large files became
        combersome and I came up with the current setup instead. None of it is
        based on computer science or any other theory of how the web works,
        this is just my playground to see what works for me.
      </p>
    `,
    icon: "bi bi-house-heart",
    content_type: "card",
    order_index: 2,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "Ethos",
        category: "home",
        author: "Ian Burrett",
        tags: ["experiment", "react", "frontend", "football"],
        publishedDate: "2026-02-27",
        readingTime: 3,
      },
    },
  },
  {
    slug: "home-trial-and-error",
    title: "trial & error",
    page: "home",
    content: `
      <div class="right w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Image Broken Icon">
          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V149.66L194.34,128,168,154.34,117.66,104,40,181.66V56ZM40,200V197.66L117.66,120,168,170.34,194.34,144,216,165.66V200Z"></path>
        </svg>
      </div>
      <p>
        Ideally I want to learn as much as possible in building this site, as
        I have the freedom to make as many mistakes as I like.
      </p>
      <p>
        Afterall, it's only a <code>git pull</code> away from being removed or
        over-written, so I don't want to be precious.
      </p>
      <div class="left w5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" role="img" aria-label="Codesandbox Logo Icon">
          <path d="M232,76.5l-56,32v63l56,32a4,4,0,0,0,6-3.5V80A4,4,0,0,0,232,76.5ZM24,76.5A4,4,0,0,0,18,80v120a4,4,0,0,0,6,3.5l56-32v-63ZM128,129.24,88,104l-40,23.3L88,150.76Zm0-23.47V48L88,70.76ZM168,70.76,128,48v57.77ZM168,150.76l40-23.47L168,104Z"></path>
        </svg>
      </div>
      <p>
        I've learned enough about AWS to know I <em>don't</em> want to use it
        for my personal sites anymore. But also enough to appreciate and
        understand how to use it in my works capacity.
      </p>
    `,
    icon: "bi bi-bug-fill",
    content_type: "card",
    order_index: 3,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "Trial & Error",
        category: "home",
        author: "Ian Burrett",
        tags: ["learning", "mistakes", "aws", "git"],
        publishedDate: "2026-02-27",
        readingTime: 2,
      },
    },
  },
];

const aboutPageContent = [
  {
    slug: "about-who-is-weestoater",
    title: "Who is weestoater",
    page: "about",
    content: `
      <figure class="figure avatar-figure">
        <img
          src="/assets/img/burt.png"
          alt="avatar of weestoater"
          class="shape-circle"
          loading="lazy"
          width="150"
          height="150"
        />
        <figcaption class="visually-hidden">Ian Burrett</figcaption>
      </figure>
      <p>
        I am Ian Burrett, an Accessibility Lead, working in Glasgow, UK and
        living just outside the fine city. Using my 25+ years of front-end web
        development and Accessibility evangelism, I help keep teams and
        applications honest in the world of accessibility.
      </p>
      <p>
        I'm a father of two amazing kids and a husband to my very long
        suffering wife. We have an adorable dog called Buster and he is the
        absolutely best boy ever - spoilt and loved to bits.
      </p>
      <figure class="figure dog-figure">
        <picture>
          <source srcSet="/assets/img/buster.webp" type="image/webp" />
          <img
            src="/assets/img/buster.jpg"
            alt="Our golden lab Buster"
            class="fluid"
            loading="lazy"
          />
        </picture>
        <figcaption>Buster, our golden lab</figcaption>
      </figure>
      <p>
        When not working or ferrying my kids to one of their many clubs, I
        like to tinker with code / websites; listen to 'rubbish' music; watch
        weird and wonderful stuff on various streaming services.
      </p>
      <p>
        I occasionally make it along to see Motherwell FC too and have been
        known to strum a tune on the guitar once in a blue moon.
      </p>
    `,
    icon: "bi bi-person-badge",
    content_type: "card",
    order_index: 0,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "Who is Weestoater",
        category: "about",
        author: "Ian Burrett",
        tags: ["accessibility", "family", "profile", "motherwell"],
        publishedDate: "2026-02-27",
        readingTime: 2,
      },
    },
  },
  {
    slug: "about-what-is-weestoater",
    title: "what is weestoater",
    page: "about",
    content: `
      <img
        src="/assets/img/vs-code.png"
        alt="code example in VS Code"
        class="fluid"
      />
      <p>
        <strong>weestoater</strong> is the nickname I've used for my personal
        'playgrounds' online since 1999, when I first cut my teeth in
        <code>html</code> &amp; <code>design</code>. Since then I've gone
        through a number of different efforts.
      </p>
      <ul>
        <li> A hand rolled CMS on php</li>
        <li> Numerous versions of WordPress</li>
        <li> An umbraco site, didn't last long</li>
        <li> A few Angular / AngularJS versions</li>
        <li> A couple of React sites</li>
      </ul>
      <p>
        This current version is ReactJS and Bootstrap, with some custom CSS of
        my own. I did use Salt-DS for a previous version, as I used it in a
        former team.
      </p>
      <p>
        I also want to use it to trial different experiments and implement the
        fabulous React Testing Library having completed the
        <a
          href="http://www.testingjavascript.com/"
          target="_blank"
          rel="noreferrer"
        >
          testing javascript
        </a>
        course by <strong>Kent C. Dodds</strong>. I work heavily in
        Accessibility (A11y) and I would like to flex some testing muscles
        too.
      </p>
    `,
    icon: "bi bi-journal-code",
    content_type: "card",
    order_index: 1,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "What is Weestoater",
        category: "about",
        author: "Ian Burrett",
        tags: ["personal", "history", "web", "react"],
        publishedDate: "2026-02-27",
        readingTime: 2,
      },
    },
  },
  {
    slug: "about-sad-message",
    title: "I'm free",
    page: "about",
    content: `
      <p>
        Sadly in life, from time to time, we lose someone who means a great
        deal to us.
      </p>
      <p>
        In my case I've lost both my own father and my father-in-law. I loved
        them so much and they taught me so many things about how to be a good,
        caring and loving husband / father.
      </p>
      <p>
        This verse was included as part of my fathers service; it helps me and
        I hope it helps you.
      </p>
      <blockquote class="sad">
        Don't grieve for me now I'm free,<br />
        I'm following the path God laid for me<br />
        I took his hand when I heard him call,<br />
        I turned my back and left it all<br />
        I could not stay another day,<br />
        To laugh, to love, to work or play<br />
        Tasks left undone must stay that way,<br />
        I've found that peace at the close of day<br />
        If my parting has left a void,<br />
        Then fill it with remembered joy<br />
        A friendship shared, a laugh, a kiss,<br />
        Ah yes, these things I too will miss<br />
        Be not burdened with times of sorrow,<br />
        I wish for you the sunshine of tomorrow<br />
        My life's been full, I've savoured much,<br />
        Good friends, good times, my loved one's touch<br />
        If my time seemed all too brief,<br />
        Don't lengthen it now with undue grief<br />
        Lift up your heart, rejoice with me,<br />
        God wanted me now, He set me free.<br />
      </blockquote>
    `,
    icon: "bi bi-balloon-heart",
    content_type: "card",
    order_index: 2,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "I'm Free",
        category: "about",
        author: "Ian Burrett",
        tags: ["loss", "family", "memories", "poetry"],
        publishedDate: "2026-02-27",
        readingTime: 2,
      },
    },
  },
  {
    slug: "about-doing-what-we-can",
    title: "doing what we can",
    page: "about",
    content: `
      <p>
        2025 has been a bit of a roller coaster of a year, with some tragic
        parts and tremendous highs too. We lost our dear Papa Bob on Christmas
        Day '24, leaving a huge hole in all of our lives. But we also had the
        incredibly joyous occassion of seeing our kids reach their Black Belts
        in Tae Kwon Do.
      </p>
      <p>
        Our professional lives have gotten busier, when we didn't think that
        was even possible, with my beautiful wife getting a
        <strong>very well deserved</strong> promotion to her departing bosses
        role. I've enjoyed another successful year of Accessibility
        Championing at my work, being rewarded with much appreciated praise
        from my colleauges and friends.
      </p>
      <p>
        But throughout it all we still miss those we've lost this year and
        before. We carry their memories and blessings with us, as we strive to
        live up to examples they set. All you can do is try your best and hope
        that it is enough, but <em>doing what we can</em>,
        <strong>when we can</strong> is what makes us who we are.
      </p>
    `,
    icon: "bi bi-bandaid",
    content_type: "card",
    order_index: 3,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    metadata: {
      articleMeta: {
        title: "Doing What We Can",
        category: "about",
        author: "Ian Burrett",
        tags: ["family", "life", "accessibility", "memories"],
        publishedDate: "2026-02-27",
        readingTime: 3,
      },
    },
  },
];

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

async function migrateContentBlocks() {
  console.log("🚀 Starting content blocks migration...\n");

  try {
    // Combine all content
    const allContent = [...homePageContent, ...aboutPageContent];

    console.log(`📦 Migrating ${allContent.length} content blocks...`);
    console.log(`   - Home page: ${homePageContent.length} blocks`);
    console.log(`   - About page: ${aboutPageContent.length} blocks\n`);

    // Insert content blocks
    const { data, error } = await supabase
      .from("content_blocks")
      .upsert(allContent, {
        onConflict: "slug",
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully migrated ${data.length} content blocks!\n`);

    // Display summary
    console.log("📊 Migration Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const homeBlocks = data.filter((b) => b.page === "home");
    const aboutBlocks = data.filter((b) => b.page === "about");

    console.log(`   Home Page Blocks: ${homeBlocks.length}`);
    homeBlocks.forEach((b) => {
      console.log(`      - ${b.title} (${b.slug})`);
    });

    console.log(`\n   About Page Blocks: ${aboutBlocks.length}`);
    aboutBlocks.forEach((b) => {
      console.log(`      - ${b.title} (${b.slug})`);
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Verify published status
    const publishedCount = data.filter((b) => b.published).length;
    console.log(`✅ Published blocks: ${publishedCount}/${data.length}\n`);

    console.log("📝 Next Steps:");
    console.log("   1. Verify data in Supabase dashboard");
    console.log("   2. Create ContentBlock.tsx component");
    console.log("   3. Update HomePage.tsx to fetch from database");
    console.log("   4. Update AboutPage.tsx to fetch from database");
    console.log("   5. Build /admin/content-blocks manager\n");

    console.log("✨ Migration complete!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// ============================================================================
// RUN MIGRATION
// ============================================================================

migrateContentBlocks();
