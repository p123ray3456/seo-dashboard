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

  /* ================= LOAD MEMBERS ================= */

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

  /* ================= SEARCH ================= */

  const filteredMembers = members.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= ADD MEMBER ================= */

  const addMember = async () => {

    if (!newMember.name || !newMember.email) return;

    try {

      await axios.post(
        "http://localhost:5000/team-members",
        {
          ...newMember,
          status: "Active"
        }
      );

      fetchMembers();

      setShowModal(false);

      setNewMember({
        name: "",
        email: "",
        role: "SEO Strategist",
      });

    } catch (error) {

      console.log("Add member error", error);

    }

  };

  /* ================= DELETE MEMBER ================= */

  const deleteMember = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/team-members/${id}`
      );

      fetchMembers();

    } catch (error) {

      console.log("Delete error", error);

    }

  };

  /* ================= CHANGE ROLE ================= */

  const changeRole = async (id, role) => {

    try {

      await axios.put(
        `http://localhost:5000/team-members/${id}`,
        { role }
      );

      fetchMembers();

    } catch (error) {

      console.log("Role update error", error);

    }

  };

  /* ================= STATUS CHANGE ================= */

  const toggleStatus = async (member) => {

    const newStatus = member.status === "Active" ? "Away" : "Active";

    try {

      await axios.put(
        `http://localhost:5000/team-members/${member._id}`,
        { status: newStatus }
      );

      fetchMembers();

    } catch (error) {

      console.log("Status update error", error);

    }

  };

  return (
    <div className="container-fluid">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

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

                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40, fontWeight: 600 }}
                        >
                          {initials}
                        </div>

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
                        className={`badge ${
                          member.status === "Active"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleStatus(member)}
                      >
                        {member.status}
                      </span>

                    </td>

                    {/* ACTIONS */}

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

    </div>
  );
};

export default TeamMembers;