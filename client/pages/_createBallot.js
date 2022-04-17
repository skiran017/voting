import React from 'react';

function CreateBallot({ handleCreateBallot }) {
  return (
    <div className="row">
      <div className="col-sm-12">
        <h2>Create ballot</h2>
        <form onSubmit={handleCreateBallot}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" />
          </div>
          <div className="form-group">
            <label htmlFor="choices">Choices</label>
            <input type="text" className="form-control" id="choices" />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (s)</label>
            <input type="text" className="form-control" id="duration" />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBallot;
