import LightweightImg from "../../assets/img/Landie/lightweight.jpg";

export const EarlyAge = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Early age</h2>
      </div>
      <div className="card-body">
        <img
          src={LightweightImg}
          className="fluid"
          alt="Land Rover Lightweight in Royal Air Force camouflauge"
        />
        <p>
          In my early teenage years, I was lucky enough to be in the Air Cadets
          and visited one of our local Royal Air Force bases, Kinloss. We were
          there to attend the gliding school, but I had an encounter that left a
          deep impression on me for the rest of my life.
        </p>

        <p>
          The gliding school was tucked away in a random corner of the base,
          right on the edge of nowhere. So to get the cadets to the gliders, the
          school had a rather beaten up and much abused Land Rover Series II
          Lightweight.
        </p>
        <p>
          Our instructor threw the Lightweight around the tracks at the back of
          the airfield like a mad man and we got bounced all over the place. We
          went at ridiculous angles on some of the slopes and up / down some
          inclines we had no place attempting - but at no point did I feel
          scared or the landie skip a beat.
        </p>

        <p>
          <strong>That is why I love landies</strong> - they are just
          unstoppable, incredible pieces of mechanical engineering.
        </p>
      </div>
    </div>
  );
};
