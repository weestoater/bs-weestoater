import { Binoculars } from "@phosphor-icons/react";

export const ScreenReaders = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-universal-access-circle me-2"></i> Learn to use
          Screen Readers
        </h2>
      </div>
      <div className="card-body">
        <div className="right">
          <Binoculars size={64} />
        </div>
        <p>
          On the first Monday of Dec '24 I switched over to my dream team at
          work. We've partnered on a number of projects and I have wanted to be
          more closely involved with them for as long as I can remember. Since
          joining, I've been knee deep in learning screen readers. A few of my
          new colleagues are visually impaired and use them all the time to
          perform their respective work duties. Others in the team, like myself,
          use them to test the Accessibility compliance of websites, software
          and other digitial products inside the firm.
        </p>

        <p>
          The two main ones used are <strong>JAWS</strong> and{" "}
          <strong>NVDA</strong>. They are both very comprehensive in the
          functionality that they offer and have a large array of keyboard
          shortcuts to learn in order to use them efficiently. I use a MacBook
          at work, so I also have access to Apple <strong>VoiceOver</strong>,
          which is pretty similar and very useful. Make sure you have your{" "}
          <strong>headphones</strong> though, can be noisy little buggers.
        </p>

        <p>
          It is incredibly humbling to use them on websites I've built, with
          over 20 years of experience in web development and front end skills,
          I'd considered myself an expert in building Accessible and
          semantically clean projects. After passing NVDA over one of them, I
          was surprised to see very simple things that I thought were effective
          proving to be a lot more convoluted than they should have been.
        </p>

        <p>
          For that reason alone I would{" "}
          <strong>
            <code>&lt;STRONGLY&gt;</code>
          </strong>{" "}
          recommend using Screen Readers as part of your development processes.
          Lay out the <code>landmarks</code> in your design. Make sure
          everything is keyboard focusable that needs to be, test using the{" "}
          <strong>AxeDevtools</strong> plugin for Chrome and then try to 'read'
          your site using NVDA, JAWS or VoiceOver.
        </p>
      </div>
    </div>
  );
};
