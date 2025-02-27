import burtIcon from "../../assets/img/burt.png";
import busterPic from "../../assets/img/buster.jpg";

export const WhoIsWeestoater = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>who is weestoater</h2>
      </div>
      <div className="card-body">
        <img
          src={burtIcon}
          alt="avatar of weestoater"
          className="right avatar"
        />
        <p>
          I am Ian Burrett, a Scottish Lead UI Engineer / Web Developer, working
          in Glasgow, UK and living just outside the fine city.
        </p>

        <p>
          I'm a father of two amazing kids and a husband to my very long
          suffering wife. We have an adorable dog called Buster and he is the
          absolutely best boy ever - spoilt and loved to bits.
        </p>
        <img
          src={busterPic}
          alt="Our golden lab Buster aka Brock Goldie"
          className="fluid"
        />
        <p>
          When not working or ferrying my kids to one of their many clubs, I
          like to tinker with code / websites; listen to 'rubbish' music; watch
          weird and wonderful stuff on various streaming services.
        </p>
        <p>
          I occassionaly make it along to see Motherwell FC too and have been
          know to strum a tune on the guitar once in a blue moon.
        </p>
      </div>
    </div>
  );
};
