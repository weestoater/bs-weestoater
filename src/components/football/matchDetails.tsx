import { memo } from "react";
import { ScoreDetails } from "./scoreDetails";
import { GoalsDetails } from "./goalsDetails";
import { VideoLink } from "./videoLinkDetails";
import { CardsDetails } from "./cardsDetails";
import { NotesDetails } from "./notesDetails";
import { Match } from "../../interfaces/footballTypes";

interface MatchDetailsProps {
  details?: Match[];
}

export const MatchDetails = memo((props: MatchDetailsProps) => {
  const details = props.details ? props.details : null;
  return (
    <>
      {details !== null &&
        details.map((item: Match, key: number) => {
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

                {item.goals && item.goals.length > 0 && (
                  <GoalsDetails goals={item.goals} />
                )}

                {item.cards && item.cards.length > 0 && (
                  <CardsDetails cards={item.cards} />
                )}

                {item.notes && <NotesDetails notes={item.notes} />}
              </div>
            </div>
          );
        })}
    </>
  );
});
