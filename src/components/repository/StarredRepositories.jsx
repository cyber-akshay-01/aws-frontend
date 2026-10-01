import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import RepoCard from "../RepoCard";
import "./repository.css";

const StarredRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyRepository, setBusyRepository] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStarredRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/starred/${userId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Could not load starred repositories.");
        }
        setRepositories(data.repositories || []);
      } catch (fetchError) {
        console.error("Error while fetching starred repositories:", fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStarredRepositories();
    }
  }, [userId]);

  const unstarRepository = async (repositoryId) => {
    setBusyRepository(repositoryId);
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/repo/${repositoryId}/star`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not update repository star.");
      }
      setRepositories((current) =>
        data.starred ? current : current.filter((repo) => repo._id !== repositoryId)
      );
    } catch (toggleError) {
      console.error("Error while updating repository star:", toggleError);
      setError(toggleError.message);
    } finally {
      setBusyRepository("");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell repository-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Your collection</p>
            <h1>Starred repositories</h1>
            <p className="page-subtitle">
              A shortlist of projects you want to keep close.
            </p>
          </div>
          <Link className="secondary-action" to="/">Explore repositories</Link>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        {loading ? (
          <section className="empty-state glass-panel" aria-live="polite">Loading starred repositories...</section>
        ) : repositories.length ? (
          <div className="repository-grid starred-grid">
            {repositories.map((repo) => (
              <RepoCard
                key={repo._id}
                repository={repo}
                starred
                onToggleStar={unstarRepository}
                busy={busyRepository === repo._id}
              />
            ))}
          </div>
        ) : !error ? (
          <section className="empty-state glass-panel">
            <div className="empty-star" aria-hidden="true">☆</div>
            <h2>No starred repositories yet</h2>
            <p>Star repositories from the dashboard and they will be collected here.</p>
            <Link className="primary-action" to="/">Discover repositories</Link>
          </section>
        ) : null}
      </main>
    </>
  );
};

export default StarredRepositories;
