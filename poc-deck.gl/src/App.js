import React, { useEffect, useMemo, useState } from "react";
import ClusterPlotDeckGL from "./ClusterPlotDeckGL";
import MatchList from "./MatchList";
import ExplainPanel from "./ExplainPanel";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  // simple controls
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("score_desc"); // score_desc | score_asc | employees_desc
  const [limit, setLimit] = useState(2000); // deck.gl can render more, start safe

  useEffect(() => {
    (async () => {
      const res = await fetch("/pairwise-data.json");
      const json = await res.json();
      setData(json);

      // default selection: top match
      const top = [...json.organizations].sort(
        (a, b) => b.match.totalScore - a.match.totalScore
      )[0];
      setSelectedId(top?.id ?? null);
    })().catch(console.error);
  }, []);

  const filteredOrgs = useMemo(() => {
    if (!data) return [];

    let arr = data.organizations.filter((o) => o.match.totalScore >= minScore);

    switch (sortBy) {
      case "score_asc":
        arr.sort((a, b) => a.match.totalScore - b.match.totalScore);
        break;
      case "employees_desc":
        arr.sort((a, b) => b.employees - a.employees);
        break;
      case "score_desc":
      default:
        arr.sort((a, b) => b.match.totalScore - a.match.totalScore);
        break;
    }

    return arr;
  }, [data, minScore, sortBy]);

  const visibleOrgs = useMemo(
    () => filteredOrgs.slice(0, limit),
    [filteredOrgs, limit]
  );

  const selectedOrg = useMemo(() => {
    if (!data || !selectedId) return null;
    return data.organizations.find((o) => o.id === selectedId) ?? null;
  }, [data, selectedId]);

  if (!data) return <div style={{ padding: 16 }}>Loading dataset...</div>;

  return (
    <div className="layout">
      <button
        className="theme-toggle"
        type="button"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </button>

      <header className="topbar">
        <div className="title">
          <div className="h1">Pairwise PoC - Explainability + Similarity</div>
          <div className="sub">
            {data.queryProfile?.name} - {data.meta?.count} orgs (showing {visibleOrgs.length})
          </div>
        </div>

        <div className="controls">
          <label>
            Min score
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
            />
          </label>

          <label>
            Sort
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score_desc">Score down</option>
              <option value="score_asc">Score up</option>
              <option value="employees_desc">Employees down</option>
            </select>
          </label>

          <label>
            Visible points
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={2000}>2k</option>
              <option value={10000}>10k</option>
              <option value={50000}>50k</option>
            </select>
          </label>
        </div>
      </header>

      <main className="main">
        <section className="left">
          <ClusterPlotDeckGL
            organizations={visibleOrgs}
            selectedId={selectedId}
            hoverId={hoverId}
            onSelectId={setSelectedId}
            onHoverId={setHoverId}
          />
        </section>

        <section className="right">
          <MatchList
            organizations={filteredOrgs}
            selectedId={selectedId}
            hoverId={hoverId}
            onSelectId={setSelectedId}
            onHoverId={setHoverId}
          />

          <ExplainPanel selectedOrg={selectedOrg} />
        </section>
      </main>
    </div>
  );
}
