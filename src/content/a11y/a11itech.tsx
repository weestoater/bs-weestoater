import { Biohazard, Binoculars, Rocket } from "@phosphor-icons/react";

export const A11yTech = () => {
  return (
    <>
      <h2>
        A11y <code>techncIAN</code>
      </h2>
      <div className="card-content">
        <div className="right">
          <Biohazard size={64} />
        </div>

        <p>
          From time to time I stumble across code that is{" "}
          <strong>really scarey</strong>. Like toe curlingly bad. I have a
          little think to myself then try to look at what was the goal of the
          team who built it. It's <strong>too easy</strong> to point and make
          judgements, I try very hard to consider the pressures that developers
          are under to deliver. A deadline looming and the UI-layer has been
          left to a junior dev, or someone who doesn't have the full briefing.
        </p>

        <p>
          It is vital at these times, to offer assistance and mentorship. All of
          us have been held up for past mistakes, very few times does this
          inspire improvements. Instead I like to try and educate and give the{" "}
          <code>technical</code> insight that might have been missing or
          overlooked.
        </p>

        <div className="left">
          <Binoculars size={64} />
        </div>
        <p>
          At the end of the day, just like anything worth doing, it's about
          practice. Building with A11y in mind and building the right thing, the
          right way so it works for as many people as possible. Getting muscle
          memory and coding yourself into the habit of:-
        </p>
        <ul>
          <li>running a keyboard sweep of the UI changes you're making.</li>
          <li>
            ensure colour contrast has enough of a ratio{" "}
            <small>(something easy to forget)</small>
          </li>
          <li>check how it zooms</li>
          <li>check how it reflows</li>
        </ul>

        <p>
          Take a closer look at the code and ensuring there are the correct
          <code>heading</code> orders, <code>landmarks</code>, use of images /
          icons for decorative purposes, <code>links</code> as links,{" "}
          <code>buttons</code> for buttons...
        </p>

        <div className="right">
          <Rocket size={64} />
        </div>
        <p>
          It is <strong>NOT ROCKET SCIENCE</strong> to make pages as accessible
          as they should be - but it also isn't easy if you've not had the
          chance to learn. So instead of trying to beat teams up, I want to make
          a culture of learning and improvement, so that teams or interested
          individuals can benefit along with the end users of the superior
          products.
        </p>
      </div>
    </>
  );
};
