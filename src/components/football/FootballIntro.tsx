import motherwell from "../../assets/img/motherwell.png";
import { FootballSeasonsNav } from "../nav/FootballSeasonsNav";

export function FootballIntro() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="well">
            <FootballSeasonsNav />
            <div>
              This is the Motherwell section, where I keep a record of all the
              first team matches I attend at Fir Park.
              <img src={motherwell} alt="Motherwell F.C. Logo" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
