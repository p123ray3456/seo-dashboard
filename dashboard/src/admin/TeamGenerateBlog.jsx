import { useState } from "react";

const API = "https://seo-dashboard-production-ec44.up.railway.app/generate-blog";

const TeamGenerateBlog = () => {

  const [form, setForm] = useState({
    title: "",
    keyword: "",
    secondaryKeywords: "",
    audience: "",
    tone: "Professional",
    wordCount: "800",
    blogType: "Informational",
    cta: ""
  });

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateBlog = async () => {

    if (!form.title || !form.keyword) {
      alert("Title & Keyword required");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(`${API}/generate-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      setBlog(data.blog);

    } catch (err) {
      alert("Error generating blog");
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="container">

      <h4 className="mb-3">🚀 Generate SEO Blog</h4>

      <input name="title" className="form-control mb-2" placeholder="Blog Title" onChange={handleChange} />
      <input name="keyword" className="form-control mb-2" placeholder="Focus Keyword" onChange={handleChange} />
      <input name="secondaryKeywords" className="form-control mb-2" placeholder="Secondary Keywords (comma separated)" onChange={handleChange} />
      <input name="audience" className="form-control mb-2" placeholder="Target Audience" onChange={handleChange} />

      <div className="row">
        <div className="col-md-4">
          <select name="tone" className="form-control mb-2" onChange={handleChange}>
            <option>Professional</option>
            <option>Casual</option>
            <option>Friendly</option>
          </select>
        </div>

        <div className="col-md-4">
          <input name="wordCount" type="number" className="form-control mb-2" placeholder="Word Count" onChange={handleChange} />
        </div>

        <div className="col-md-4">
          <select name="blogType" className="form-control mb-2" onChange={handleChange}>
            <option>Informational</option>
            <option>Transactional</option>
            <option>Guide</option>
          </select>
        </div>
      </div>

      <textarea name="cta" className="form-control mb-3" placeholder="Call To Action" onChange={handleChange}></textarea>

      <button className="btn btn-primary" onClick={generateBlog}>
        {loading ? "Generating..." : "Generate Blog"}
      </button>

      {blog && (
        <div className="mt-4 p-3 border rounded bg-light">

          <div className="d-flex justify-content-between mb-2">
            <h5>Generated Blog</h5>

            <button
              className="btn btn-sm btn-success"
              onClick={() => navigator.clipboard.writeText(blog)}
            >
              Copy
            </button>
          </div>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {blog}
          </pre>

        </div>
      )}

    </div>

  );

};

export default TeamGenerateBlog;