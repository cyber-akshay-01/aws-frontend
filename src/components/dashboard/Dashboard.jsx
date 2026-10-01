import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import RepoCard from "../RepoCard";
import "./dashboard.css";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [starredIds, setStarredIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [busyRepository, setBusyRepository] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const [ownResponse, allResponse, starredResponse] = await Promise.all([
          fetch(`http://localhost:3000/repo/user/${userId}`),
          fetch("http://localhost:3000/repo/all"),
          fetch(`http://localhost:3000/repo/starred/${userId}`),
        ]);

        const [ownData, allData, starredData] = await Promise.all([
          ownResponse.json(),
          allResponse.json(),
          starredResponse.json(),
        ]);

        if (!ownResponse.ok && ownResponse.status !== 404) {
          throw new Error(ownData.error || "Could not load your repositories.");
        }
        if (!allResponse.ok) {
          throw new Error(allData.error || "Could not load repositories.");
        }
        if (!starredResponse.ok) {
          throw new Error(starredData.error || "Could not load starred repositories.");
        }

        setRepositories(ownResponse.status === 404 ? [] : ownData.repositories || []);
        setSuggestedRepositories(Array.isArray(allData) ? allData : []);
        setStarredIds((starredData.repositories || []).map((repo) => repo._id));
      } catch (loadError) {
        console.error("Error while fetching repositories:", loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadRepositories();
    }
  }, [userId]);

  const filteredRepositories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return repositories;
    return repositories.filter((repo) =>
      `${repo.name} ${repo.description || ""}`.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);

  const toggleStar = async (repositoryId) => {
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

      setStarredIds((current) =>
        data.starred
          ? [...new Set([...current, repositoryId])]
          : current.filter((id) => id !== repositoryId)
      );
    } catch (toggleError) {
      console.error("Error while updating repository star:", toggleError);
      setError(toggleError.message);
    } finally {
      setBusyRepository("");
    }
  };

  const visibleSuggestions = suggestedRepositories.filter(
    (repo) => !repositories.some((ownedRepo) => ownedRepo._id === repo._id)
  );

  return (
    <>
      <Navbar />
      <main className="page-shell dashboard-page">
        <section className="page-heading dashboard-heading">
          <div>
            <p className="eyebrow">Your developer workspace</p>
            <h1>Good to see you again.</h1>
            <p className="page-subtitle">
              Keep your projects close, discover what the community is building, and
              make your next idea real.
            </p>
          </div>
          <Link className="primary-action" to="/create">
            <span aria-hidden="true">+</span> New repository
          </Link>
        </section>

        {error && <p className="dashboard-error" role="alert">{error}</p>}

        <div className="dashboard-layout">
          <section className="dashboard-main-column">
            <div className="dashboard-section-heading">
              <div>
                <h2>Your repositories</h2>
                <span>{repositories.length} repositories</span>
              </div>
              <input
                aria-label="Search your repositories"
                className="repo-search"
                type="search"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            {loading ? (
              <section className="empty-state glass-panel" aria-live="polite">
                Loading your repositories...
              </section>
            ) : filteredRepositories.length ? (
              <div className="repository-grid">
                {filteredRepositories.map((repo) => (
                  <RepoCard
                    key={repo._id}
                    repository={repo}
                    starred={starredIds.includes(repo._id)}
                    onToggleStar={toggleStar}
                    busy={busyRepository === repo._id}
                  />
                ))}
              </div>
            ) : (
              <section className="empty-state glass-panel">
                <h2>{searchQuery ? "No repositories found" : "Your next project starts here"}</h2>
                <p>
                  {searchQuery
                    ? "Try a different search term."
                    : "Create a repository to start tracking your work."}
                </p>
                {!searchQuery && <Link className="primary-action" to="/create">Create repository</Link>}
              </section>
            )}

            <section className="discover-section">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Explore repositories</h2>
                  <span>Projects from the community</span>
                </div>
              </div>
              {visibleSuggestions.length ? (
                <div className="repository-grid">
                  {visibleSuggestions.slice(0, 4).map((repo) => (
                    <RepoCard
                      key={repo._id}
                      repository={repo}
                      starred={starredIds.includes(repo._id)}
                      onToggleStar={toggleStar}
                      busy={busyRepository === repo._id}
                    />
                  ))}
                </div>
              ) : (
                <p className="subtle-empty">New community projects will show up here.</p>
              )}
            </section>
          </section>

          <aside className="dashboard-sidebar">
            <section className="sidebar-card glass-panel">
              <p className="eyebrow">Quick links</p>
              <Link to="/starred"><span>★</span> Your starred repositories</Link>
              <Link to="/profile"><span>◉</span> Your profile</Link>
              <Link to="/create"><span>＋</span> Start a project</Link>
            </section>
            <section className="sidebar-card sidebar-note glass-panel">
              <span className="sidebar-note-icon" aria-hidden="true">✦</span>
              <h2>Build something great</h2>
              <p>Good code is better when it is shared. Make your next idea a repository.</p>
              <Link to="/create">Create a repository <span aria-hidden="true">→</span></Link>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
