import React from 'react';

function Votes({ handleVotes, ballots, isFinished }) {
  return (
    <div className="row">
      <div className="col-sm-12">
        <h2>Votes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Votes</th>
              <th>Vote</th>
              <th>Ends on</th>
            </tr>
          </thead>
          <tbody>
            {ballots.map((ballot) => (
              <tr key={ballot.id}>
                <td>{ballot.id}</td>
                <td>{ballot.name}</td>
                <td>
                  <ul>
                    {ballot.choices.map((choice) => (
                      <li key={choice.id}>
                        id: {choice.id}, name: {choice.name}, votes:{' '}
                        {choice.votes}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {isFinished(ballot) ? (
                    'Vote finished'
                  ) : ballot.hasVoted ? (
                    'You already voted'
                  ) : (
                    <form onSubmit={(e) => handleVotes(e, ballot.id)}>
                      <div className="form-group">
                        <label htmlFor="choice">Choice</label>
                        <select className="form-control" id="choice">
                          {ballot.choices.map((choice) => (
                            <option key={choice.id} value={choice.id}>
                              {choice.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </form>
                  )}
                </td>
                <td>
                  {new Date(parseInt(ballot.end) * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Votes;
