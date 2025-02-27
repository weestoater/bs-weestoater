import BirthdayTreatOne from "../../assets/img/Landie/2011/cimg2840.jpg";
import Landie2img from "../../assets/img/Landie/2011/cimg2870.jpg";
import Landie3img from "../../assets/img/Landie/2011/cimg2884.jpg";
import Landie4img from "../../assets/img/Landie/2011/cimg2890.jpg";
import Landie5img from "../../assets/img/Landie/2011/cimg2894.jpg";

export const BirthdayTreat = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Birthday Treat 1</h2>
      </div>
      <div className="card-body">
        <img
          src={BirthdayTreatOne}
          className="fluid"
          alt="Me in the passenger seat on the way to the start of my Land Rover Defender experience"
        />
        <p>
          My amazing wife was incredibly generous for my 39th birthday and
          arranged a <strong>Land Rover Defender</strong> experience for me at
          the stunning location of the Highland Safaris, Aberfeldy.
        </p>
        <p>
          I was driven out into the forestry then was let rip at the wheel of a
          wonderful dark green LWB 110 Defender. Lisa stayed in the back and was
          able to capture some pictures in between grabbing handles and holding
          on for dear life. The inclines and angles we drove over beggars
          belief, had I not been at the wheel I would have doubted it was
          possible.
        </p>
        <p>
          My personal favourite was the climb with just sky in the windscreen
          then a moment later just ground as we'd traveresed the crest of the
          climb. <strong>Incredible!</strong>
        </p>
        <p>
          The most hilarious part, was when I was pitched at around 70+ degrees,
          with sky and treetops in the front windscreen and dirt path in the
          rear view mirror. Having put the landie into reverse, held the weight
          on the foot brake and released the hand brake, the instructor said...
        </p>
        <blockquote>
          ...just slowly lift your foot off the brake and be{" "}
          <strong>prepared to steer</strong>...
        </blockquote>
        <p>
          Anyone with an ounce of mechanical / driving knowledge would have said
          Nope. But I was convinced the landie would be fine and I was proven
          right. The immense engineering of that gearbox gently controlled us
          down the slope with barely any input on steering required.
        </p>
        <figure>
          <img src={Landie2img} className="fluid" alt="" />
          <figcaption>
            Enjoying the view from the back seat - lovely gentle slope...
          </figcaption>
        </figure>

        <figure>
          <img src={Landie3img} className="fluid" alt="" />
          <figcaption>
            Bumpier rutted track with some interesting camber
          </figcaption>
        </figure>

        <figure>
          <img src={Landie4img} className="fluid" alt="" />
          <figcaption>
            Heading down a rutted track after cresting the summit
          </figcaption>
        </figure>

        <figure>
          <img src={Landie5img} className="fluid" alt="" />
          <figcaption>Me standing next to the vehicle</figcaption>
        </figure>
      </div>
    </div>
  );
};
