import "./repo-card.css";

const RepoCard = ({ repository, starred = false, onToggleStar, busy = false }) => {
  const ownerName =
    typeof repository.owner === "object"
      ? repository.owner?.username
      : undefined;

  return (
    <article className="repo-card glass-panel">
      <div className="repo-card-main">
        <div className="repo-card-title-row">
          <h2>{repository.name}</h2>
          <span className="repo-visibility">
            {repository.visibility ? "Public" : "Private"}
          </span>
        </div>
        {ownerName && <p className="repo-owner">{ownerName} / {repository.name}</p>}
        <p className="repo-description">
          {repository.description || "No description provided."}
        </p>
      </div>
      <div className="repo-card-footer">
        <span className="repo-language-dot" aria-hidden="true" />
        <span>Git repository</span>
        {typeof onToggleStar === "function" && (
          <button
            className={`star-action${starred ? " is-starred" : ""}`}
            type="button"
            aria-pressed={starred}
            disabled={busy}
            onClick={() => onToggleStar(repository._id)}
          >
            <span aria-hidden="true">{busy ? "…" : starred ? "★" : "☆"}</span>
            {busy ? "Saving..." : starred ? "Starred" : "Star"}
          </button>
        )}
      </div>
    </article>
  );
};

export default RepoCard;
