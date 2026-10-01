import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./repository.css";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: localStorage.getItem("userId"),
          name: name.trim(),
          description: description.trim(),
          visibility: visibility === "public",
          content: [],
          issues: [],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not create repository.");
      }
      navigate("/");
    } catch (createError) {
      console.error("Error while creating repository:", createError);
      setError(createError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell repository-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Start building</p>
            <h1>Create a new repository</h1>
            <p className="page-subtitle">
              A repository contains all of your project files and revision history.
            </p>
          </div>
        </div>

        <form className="repository-form glass-panel" onSubmit={handleCreate}>
          <div className="form-intro">
            <h2>Repository details</h2>
            <p>Choose a name that is short and easy to remember.</p>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <label className="repository-field" htmlFor="repository-name">
            <span>Repository name <span className="required-mark">*</span></span>
            <input
              id="repository-name"
              autoComplete="off"
              maxLength={100}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="my-awesome-project"
            />
          </label>

          <label className="repository-field" htmlFor="repository-description">
            <span>Description <span className="optional-label">(optional)</span></span>
            <textarea
              id="repository-description"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this project about?"
            />
          </label>

          <fieldset className="visibility-field">
            <legend>Choose visibility</legend>
            <label className={`visibility-option${visibility === "public" ? " selected" : ""}`}>
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === "public"}
                onChange={(event) => setVisibility(event.target.value)}
              />
              <span className="visibility-option-icon" aria-hidden="true">◎</span>
              <span>
                <strong>Public</strong>
                <small>Anyone can see this repository.</small>
              </span>
            </label>
            <label className={`visibility-option${visibility === "private" ? " selected" : ""}`}>
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === "private"}
                onChange={(event) => setVisibility(event.target.value)}
              />
              <span className="visibility-option-icon" aria-hidden="true">◉</span>
              <span>
                <strong>Private</strong>
                <small>You choose who can see this repository.</small>
              </span>
            </label>
          </fieldset>

          <div className="repository-form-actions">
            <Link className="secondary-action" to="/">Cancel</Link>
            <button className="primary-action" type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create repository"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateRepository;
