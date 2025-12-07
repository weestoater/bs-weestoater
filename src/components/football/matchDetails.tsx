import { memo } from "react";
import { ScoreDetails } from "./scoreDetails";
import { GoalsDetails } from "./goalsDetails";
import { VideoLink } from "./videoLinkDetails";
import { CardsDetails } from "./cardsDetails";
import { NotesDetails } from "./notesDetails";

export const MatchDetails = memo((props: any) => {
  const details = props.details ? props.details : null;
  return (
    <>
      {details !== null &&
        details.map((item: any, key: number) => {
          const league = item.league ? item.league : "SPFL";
          return (
            <div
              className={`card mb-3 match-${item.venue.toLowerCase()}`}
              key={key}
            >
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    {item.venue} to {item.opposition}
                  </span>
                  <ScoreDetails
                    conceded={item.conceded}
                    scored={item.scored}
                    venue={item.venue}
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm mb-3">
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
                </div>

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
});
