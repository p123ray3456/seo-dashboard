import { useState, useEffect } from "react";
import axios from "axios";

const TeamMembers = () => {

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "SEO Strategist",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        "https://seo-dashboard-production-ec44.up.railway.app/team-members"
      );
      setMembers(res.data);
    } catch (error) {
      console.log("Error loading members", error);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const addMember = async () => {
    if (!newMember.name || !newMember.email) return;

    await axios.post(
      "https://seo-dashboard-production-ec44.up.railway.app/team-members",
      { ...newMember, status: "Active" }
    );

    fetchMembers();
    setShowModal(false);

    setNewMember({
      name: "",
      email: "",
      role: "SEO Strategist",
    });
  };

  const deleteMember = async (id) => {
    await axios.delete(
      `https://seo-dashboard-production-ec44.up.railway.app/team-members/${id}`
    );
    fetchMembers();
  };

  const changeRole = async (id, role) => {
    await axios.put(
      `https://seo-dashboard-production-ec44.up.railway.app/team-members/${id}`,
      { role }
    );
    fetchMembers();
  };

  const toggleStatus = async (member) => {
    const newStatus = member.status === "Active" ? "Away" : "Active";

    await axios.put(
      `https://seo-dashboard-production-ec44.up.railway.app/team-members/${member._id}`,
      { status: newStatus }
    );

    fetchMembers();
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Team Members</h4>
          <p className="text-muted mb-0">
            Manage access and roles for your agency staff.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-person-plus me-2"></i>
          Invite Member
        </button>
      </div>

      {/* SEARCH */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <input
            type="text"
            placeholder="Search team member..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">

          <table className="table align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th>NAME</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {filteredMembers.map((member) => {

                const initials = member.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <tr key={member._id}>

                    {/* NAME */}
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar">{initials}</div>
                        <div>
                          <div className="fw-semibold">{member.name}</div>
                          <small className="text-muted">{member.email}</small>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={member.role}
                        onChange={(e) =>
                          changeRole(member._id, e.target.value)
                        }
                      >
                        <option>Super Admin</option>
                        <option>SEO Strategist</option>
                        <option>Content Writer</option>
                        <option>Backlink Expert</option>
                      </select>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className="status-badge"
                        onClick={() => toggleStatus(member)}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteMember(member._id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                );

              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No member found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Invite Team Member</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />

                <select
                  className="form-select"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                >
                  <option>SEO Strategist</option>
                  <option>Content Writer</option>
                  <option>Backlink Expert</option>
                  <option>Super Admin</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={addMember}
                >
                  Add Member
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===== STYLES ===== */}
      <style>{`

.avatar{
  width:40px;
  height:40px;
  border-radius:50%;
  background:#f1f5f9;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:600;
}

/* STATUS */
.status-badge{
  background: rgba(34,197,94,0.12);
  color:#16a34a;
  font-size:12px;
  padding:4px 10px;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  gap:6px;
  cursor:pointer;
}
.status-badge::before{
  content:"";
  width:6px;
  height:6px;
  background:#16a34a;
  border-radius:50%;
}

/* MOBILE CARD */
@media (max-width:768px){

.table thead{
  display:none;
}

.table,
.table tbody,
.table tr,
.table td{
  display:block;
  width:100%;
}

.table tbody tr{
  background:#fff;
  border-radius:14px;
  padding:14px;
  margin-bottom:14px;
  box-shadow:0 6px 16px rgba(0,0,0,0.05);
}

.table tbody td{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:6px 0;
  border:none;
}

.table tbody td:first-child{
  flex-direction:column;
  align-items:flex-start;
  gap:6px;
}

/* STATUS + DELETE SAME LINE */
/* ===== FIX: DELETE BUTTON RIGHT SIDE ===== */
.table tbody td:last-child{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:10px;
  margin-top:8px;
}

/* KEEP STATUS LEFT */
.table tbody td:nth-child(3){
  margin-right:auto;
}

}

      `}</style>

    </div>
  );
};

export default TeamMembers;