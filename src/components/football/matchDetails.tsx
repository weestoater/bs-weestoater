import { ScoreDetails } from "./scoreDetails";
import { GoalsDetails } from "./goalsDetails";
import { VideoLink } from "./videoLinkDetails";
import { CardsDetails } from "./cardsDetails";
import { NotesDetails } from "./notesDetails";

export const MatchDetails = (props: any) => {
  const details = props.details ? props.details : null;
  return (
    <>
      {details !== null &&
        details.map((item: any, key: number) => {
          const league = item.league ? item.league : "SPFL";
          return (
            <div
              className={`match-details ${item.venue.toLowerCase()}`}
              key={key}
            >
              <h2>
                <div className="venue">
                  {item.venue} to {item.opposition}
                </div>
                <div className="score">
                  <ScoreDetails
                    conceded={item.conceded}
                    scored={item.scored}
                    venue={item.venue}
                  />
                </div>
              </h2>
              <div className="card-content">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Competition</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{item.date}</td>
                      <td>{league}</td>
                    </tr>
                  </tbody>
                </table>

                {item.video && <VideoLink url={item.video} />}

                {item.goals && <GoalsDetails goals={item.goals} />}

                {item.cards && <CardsDetails cards={item.cards} />}

                {item.notes && <NotesDetails notes={item.notes} />}
              </div>
            </div>
          );
        })}
    </>
  );
};
