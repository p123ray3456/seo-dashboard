const TeamDashboard = () => {

  return (

    <div className="row">

      {/* CARD 1 */}
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm p-3 border-0">
          <h6 className="text-muted">Today's Work</h6>
          <h4>Update Tasks</h4>
          <p className="text-muted small">
            Complete your daily SEO checklist.
          </p>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm p-3 border-0">
          <h6 className="text-muted">Next Plan</h6>
          <h4>Plan Strategy</h4>
          <p className="text-muted small">
            Prepare upcoming month strategy.
          </p>
        </div>
      </div>

      {/* WELCOME SECTION */}
      <div className="col-12 mt-3">
        <div className="card p-4 shadow-sm border-0">

          <h5 className="fw-bold mb-2">
            Welcome 👨‍💻
          </h5>

          <p className="text-muted">
            Manage your daily SEO tasks and planning efficiently from this dashboard.
          </p>

        </div>
      </div>

    </div>

  );

};

export default TeamDashboard;