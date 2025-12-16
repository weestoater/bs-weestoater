import { Robot, Palette, PuzzlePiece } from "@phosphor-icons/react";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const A11yClaude = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>
            <i className="bi bi-universal-access-circle me-2"></i> Claude Sonnet
            Surprises
          </h2>
        </div>
        <div className="card-body">
          <ArticleMeta
            metadata={{
              title: "Claude Sonnet Surprises",
              publishedDate: "2024-11-20",
              readingTime: 3,
              tags: ["AI", "Claude", "Accessibility", "Automation", "Testing"],
              category: "Accessibility",
            }}
          />
          <div className="right">
            <Robot size={64} />
          </div>
          <p>
            After much procrastination, I finally relented and started
            experimenting with AI Agentic coding assistance. I began by asking
            it to add some test coverage to an existing site, then moved onto
            more complex stuff like asking it about the colour contrast ratios
            on some of the css classes.
          </p>

          <div className="left">
            <Palette size={64} />
          </div>

          <p>
            As impressive as that is, it didn't prepare me for the incredible
            way it then dealt with a request for dark / light mode toggler. I
            wrote a pretty cack-handed prompt and somehow it got enough details
            to do a decent first pass at it. My main learning curve as been the
            art of prompt writing, which I hadn't truly appreciated how tricky
            it can be, nor the level of details sometimes required to avoid
            reworking.
          </p>
          <div className="right">
            <PuzzlePiece size={64} />
          </div>

          <p>
            I thought I would really try it out, by asking it to build a
            responsive, accessible game that tested users on their knowledge of
            the WCAG standards against three different levels. Initially some of
            the basic things, like randomising the order of the questions and
            where the correct answer came in order, needed to be expressly asked
            for - poor prompting from me. But the overall result was properly
            impressive. The addition of timers, leaderboards, etc was all done
            easily, storing things in localstorage for now. But again, I got
            asked if I'd like to add support for a mySQL database or other
            solutions.
          </p>
          <p>
            Very quickly, I've been able to put together some reusable and
            compliant code at work, which is going to save me and others{" "}
            <strong>LOTS</strong> of time implementing in other projects. I'm a
            big convert.
          </p>
        </div>
      </div>
    </>
  );
};
