import { useEffect, useState, useMemo } from "react";
import "../styles/keywordPerformance.css";

const KeywordPerformance = () => {

  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);
  const [search, setSearch] = useState("");

  const clientId =
    localStorage.getItem("clientId") ||
    JSON.parse(localStorage.getItem("auth"))?.clientId;

  useEffect(() => {

    if (!clientId) return;

    const fetchKeywords = async () => {

      try {

        setLoading(true);

        const res = await fetch(
  `https://digigrowth.digital/seo/search-console?clientId=${clientId}&range=${range}`
);

        const data = await res.json();

        setKeywords(data.rows || []);

      } catch (err) {

        console.error("Keyword API error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchKeywords();

  }, [clientId, range]);

  /* FILTER */

  const filteredKeywords = useMemo(() => {

    return keywords.filter((k) =>
      k.keys?.[0]?.toLowerCase().includes(search.toLowerCase())
    );

  }, [keywords, search]);

  /* RANK STATUS */

  const getRankStatus = (position) => {

    if (position <= 3) return "top3";
    if (position <= 10) return "top10";
    if (position <= 20) return "top20";

    return "below20";

  };

  return (

    <div className="kp-wrapper container-fluid">

      {/* HEADER */}

      <div className="kp-header">

        <div>

          <h4>Keyword Performance</h4>
          <p>Live data from Google Search Console</p>

        </div>

        <select
          className="form-select"
          style={{ maxWidth: "180px" }}
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>

      </div>


      {/* SEARCH */}

      <div className="kp-actions">

        <input
          type="text"
          placeholder="Search keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* TABLE */}

      <div className="kp-table">

        {loading ? (

          <div style={{ padding: "16px" }}>
            Loading keywords...
          </div>

        ) : (

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>

                <tr>

                  <th>Keyword</th>
                  <th>Clicks</th>
                  <th>Impressions</th>
                  <th>CTR</th>
                  <th>Avg Position</th>
                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {filteredKeywords.map((k, i) => {

                  const position = k.position || 0;
                  const status = getRankStatus(position);

                  return (

                    <tr key={i}>

                      <td>{k.keys?.[0]}</td>
                      <td>{k.clicks}</td>
                      <td>{k.impressions}</td>
                      <td>{(k.ctr * 100).toFixed(2)}%</td>
                      <td>{position.toFixed(1)}</td>

                      <td>
                        <span className={`kp-status ${status}`}>
                          {status}
                        </span>
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* SUMMARY */}

      <div className="kp-summary">

        <div className="kp-card">

          <small>Total Keywords</small>

          <h4>{filteredKeywords.length}</h4>

        </div>

      </div>

    </div>

  );

};

export default KeywordPerformance;