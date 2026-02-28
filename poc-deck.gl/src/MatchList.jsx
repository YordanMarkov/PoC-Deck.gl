import React, { useMemo } from "react";

export default function MatchList({
  organizations,
  selectedId,
  hoverId,
  onSelectId,
  onHoverId,
}) {
  const top = useMemo(() => organizations.slice(0, 100), [organizations]); // keep UI light

  return (
    <div className="list">
      <div className="listHeader">
        <div className="listTitle">Ranked matches</div>
        <div className="listSub">Showing top {top.length} of {organizations.length}</div>
      </div>

      <div className="rows">
        {top.map((o, idx) => {
          const isSel = o.id === selectedId;
          const isHover = o.id === hoverId;
          return (
            <div
              key={o.id}
              className={`row ${isSel ? "sel" : ""} ${isHover ? "hover" : ""}`}
              onMouseEnter={() => onHoverId(o.id)}
              onMouseLeave={() => onHoverId(null)}
              onClick={() => onSelectId(o.id)}
              role="button"
              tabIndex={0}
            >
              <div className="rank">{idx + 1}</div>
              <div className="rowMain">
                <div className="name">{o.name}</div>
                <div className="meta">
                  {o.country} - {o.industry} - {o.employees} emp - EUR {o.revenueM}M
                </div>
              </div>
              <div className="score">{o.match.totalScore.toFixed(3)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
