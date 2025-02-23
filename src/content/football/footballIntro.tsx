import mfcLogo from "../../assets/img/mfclogo.png";

export const FootballIntro = () => {
  return (
    <div className="mb-2">
      <div className="card-content">
        <div className="left w10">
          <img src={mfcLogo} className="fluid" alt="Motherwell F.C. logo" />
        </div>
        <p>
          I'm a Motherwell supporter &amp; have been since I met my beautiful
          wife, back in '07 &amp; went to my first game with my now in-laws.
        </p>
        <p>
          Sadly, for many different reasons, I don't get along to as many
          matches as I would like, the main one being that any game I{" "}
          <strong>do</strong> get to is usually an absolute howler.
        </p>
        <p>
          I've seen some great games, like the <strong>6-6</strong> draw with
          Hibs and some scunners I'd much rather forget, like driving all the
          way to Stranraer, only to get knocked out on penalties -{" "}
          <strong>sore one!</strong>
        </p>
        <p>
          But for my sins - and not my sanity - I try to keep up-to-date with
          what they are doing and I sometimes note down the results.
        </p>
        <hr />
        <p>
          <small>
            <strong>N.B.</strong>: This is not a comprehensive or complete list,
            only what I've managed to note down and put into my little 'system'.
          </small>
        </p>
      </div>
    </div>
  );
};
