import React from 'react';

function AddVoters({ handleAddVoters }) {
  return (
    <div className="row">
      <div className="col-sm-12">
        <h2>Add voters</h2>
        <form onSubmit={handleAddVoters}>
          <div className="form-group">
            <label htmlFor="voters">Voters</label>
            <input type="text" className="form-control" id="voters" />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVoters;
