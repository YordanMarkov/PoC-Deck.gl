import React, { useMemo } from "react";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

const ACCENT_PAIRS = [
  { bg: [239, 246, 255], fg: [29, 78, 216] },
  { bg: [250, 245, 255], fg: [126, 34, 206] },
  { bg: [240, 253, 244], fg: [21, 128, 61] },
  { bg: [254, 242, 242], fg: [185, 28, 28] },
  { bg: [255, 251, 235], fg: [146, 64, 14] },
  { bg: [253, 242, 248], fg: [157, 23, 77] },
  { bg: [240, 253, 250], fg: [17, 94, 89] },
  { bg: [238, 242, 255], fg: [55, 48, 163] },
];

function accentPairForCluster(cluster) {
  const idx = Math.abs(Number(cluster) || 0) % ACCENT_PAIRS.length;
  return ACCENT_PAIRS[idx];
}

function pointRadius(score) {
  return 4 + Math.max(score, 0) * 6;
}

export default function ClusterPlotDeckGL({
  organizations,
  selectedId,
  hoverId,
  onSelectId,
  onHoverId,
}) {
  const data = organizations;

  const bounds = useMemo(() => {
    if (!data.length) return { minX: -10, maxX: 10, minY: -10, maxY: 10 };
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const o of data) {
      const { x, y } = o.embedding2d;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return { minX, maxX, minY, maxY };
  }, [data]);

  const initialViewState = useMemo(() => {
    const cx = (bounds.minX + bounds.maxX) / 2;
    const cy = (bounds.minY + bounds.maxY) / 2;
    return { longitude: cx, latitude: cy, zoom: 1.5, pitch: 0, bearing: 0 };
  }, [bounds]);

  const selectedPoint = useMemo(
    () => data.find((d) => d.id === selectedId) || null,
    [data, selectedId]
  );
  const hoverPoint = useMemo(
    () => data.find((d) => d.id === hoverId) || null,
    [data, hoverId]
  );

  const hasSelection = Boolean(selectedId);

  const layers = useMemo(() => {
    return [
      new ScatterplotLayer({
        id: "pairwise-scatter-base",
        data,
        pickable: true,
        stroked: true,
        filled: true,
        radiusUnits: "pixels",
        radiusMinPixels: 3,
        radiusMaxPixels: 12,
        getPosition: (d) => [d.embedding2d.x, d.embedding2d.y],
        getRadius: (d) => pointRadius(d.match.totalScore),
        getFillColor: (d) => {
          if (d.id === selectedId) return [59, 130, 246, 0];
          if (d.id === hoverId) return [219, 234, 254, 230];
          const { bg } = accentPairForCluster(d.embedding2d.cluster);
          return [bg[0], bg[1], bg[2], hasSelection ? 130 : 198];
        },
        getLineColor: (d) => {
          if (d.id === selectedId) return [96, 165, 250, 0];
          if (d.id === hoverId) return [37, 99, 235, 245];
          const { fg } = accentPairForCluster(d.embedding2d.cluster);
          return [fg[0], fg[1], fg[2], hasSelection ? 155 : 210];
        },
        lineWidthUnits: "pixels",
        lineWidthMinPixels: (d) => (d.id === hoverId ? 2 : 1),
        onHover: (info) => onHoverId(info?.object?.id ?? null),
        onClick: (info) => {
          if (info?.object?.id) onSelectId(info.object.id);
        },
        updateTriggers: {
          getFillColor: [selectedId, hoverId, hasSelection],
          getLineColor: [selectedId, hoverId, hasSelection],
          lineWidthMinPixels: [selectedId, hoverId],
        },
      }),
      new ScatterplotLayer({
        id: "pairwise-scatter-hover-ring",
        data: hoverPoint && hoverPoint.id !== selectedId ? [hoverPoint] : [],
        pickable: false,
        filled: false,
        stroked: true,
        radiusUnits: "pixels",
        radiusMinPixels: 6,
        radiusMaxPixels: 16,
        getPosition: (d) => [d.embedding2d.x, d.embedding2d.y],
        getRadius: (d) => pointRadius(d.match.totalScore) + 4,
        getLineColor: [59, 130, 246, 245],
        lineWidthUnits: "pixels",
        lineWidthMinPixels: 2,
      }),
      new ScatterplotLayer({
        id: "pairwise-scatter-selected-point",
        data: selectedPoint ? [selectedPoint] : [],
        pickable: false,
        filled: true,
        stroked: true,
        radiusUnits: "pixels",
        radiusMinPixels: 6,
        radiusMaxPixels: 14,
        getPosition: (d) => [d.embedding2d.x, d.embedding2d.y],
        getRadius: (d) => pointRadius(d.match.totalScore) + 1,
        getFillColor: [37, 99, 235, 238],
        getLineColor: [219, 234, 254, 255],
        lineWidthUnits: "pixels",
        lineWidthMinPixels: 2,
      }),
      new ScatterplotLayer({
        id: "pairwise-scatter-selected-ring",
        data: selectedPoint ? [selectedPoint] : [],
        pickable: false,
        filled: false,
        stroked: true,
        radiusUnits: "pixels",
        radiusMinPixels: 8,
        radiusMaxPixels: 18,
        getPosition: (d) => [d.embedding2d.x, d.embedding2d.y],
        getRadius: (d) => pointRadius(d.match.totalScore) + 6,
        getLineColor: [96, 165, 250, 250],
        lineWidthUnits: "pixels",
        lineWidthMinPixels: 2,
      }),
    ];
  }, [data, selectedId, hoverId, selectedPoint, hoverPoint, hasSelection, onHoverId, onSelectId]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DeckGL
        style={{ position: "absolute", inset: 0 }}
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        getTooltip={({ object }) =>
          object
            ? {
                className: "deck-tooltip",
                text: `${object.name}\nScore: ${object.match.totalScore}\n${object.country} - ${object.industry}`,
              }
            : null
        }
      />
    </div>
  );
}
