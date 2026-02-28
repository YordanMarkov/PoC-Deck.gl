import React, { useMemo } from "react";

export default function ExplainPanel({ selectedOrg }) {
  const sorted = useMemo(() => {
    if (!selectedOrg) return [];
    return [...selectedOrg.match.criteria].sort((a, b) => b.contribution - a.contribution);
  }, [selectedOrg]);

  if (!selectedOrg) {
    return (
      <div className="panel">
        <div className="panelTitle">Explain match</div>
        <div className="panelEmpty">Select a point or a match to view explainability.</div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panelTitle">Explain match</div>

      <div className="panelTop">
        <div className="panelName">{selectedOrg.name}</div>
        <div className="panelMeta">
          {selectedOrg.country} - {selectedOrg.industry} - {selectedOrg.employees} emp - EUR{" "}
          {selectedOrg.revenueM}M
        </div>
        <div className="panelScore">
          Total score: <b>{selectedOrg.match.totalScore.toFixed(3)}</b>
        </div>
        <div className="panelSummary">{selectedOrg.match.summary}</div>
      </div>

      <div className="criteria">
        {sorted.map((c) => (
          <div key={c.name} className="critRow">
            <div className="critHead">
              <div className="critName">{c.name}</div>
              <div className="critNums">
                score {c.score.toFixed(3)} - weight {c.weight} - contrib{" "}
                {c.contribution.toFixed(3)}
              </div>
            </div>

            <div className="barWrap">
              <div className="bar" style={{ width: `${Math.round(c.contribution * 100)}%` }} />
            </div>

            <div className="critExplain">{c.explain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
