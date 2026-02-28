import React, { useMemo } from "react";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

const CLUSTER_PALETTE = [
  [78, 129, 168],
  [63, 156, 168],
  [116, 146, 186],
  [68, 114, 147],
  [108, 173, 153],
  [145, 158, 196],
  [93, 173, 204],
  [141, 170, 143],
  [94, 144, 118],
  [162, 148, 184],
  [180, 142, 126],
  [132, 168, 204],
];

function colorForCluster(cluster) {
  const idx = Math.abs(Number(cluster) || 0) % CLUSTER_PALETTE.length;
  return CLUSTER_PALETTE[idx];
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
          if (d.id === selectedId) return [255, 122, 44, 0];
          if (d.id === hoverId) return [236, 248, 255, 210];
          const [r, g, b] = colorForCluster(d.embedding2d.cluster);
          return [r, g, b, hasSelection ? 72 : 138];
        },
        getLineColor: (d) => {
          if (d.id === selectedId) return [255, 205, 160, 0];
          if (d.id === hoverId) return [225, 244, 255, 230];
          return [6, 32, 46, hasSelection ? 120 : 170];
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
        getLineColor: [205, 237, 255, 240],
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
        getFillColor: [255, 122, 44, 230],
        getLineColor: [255, 224, 195, 255],
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
        getLineColor: [255, 166, 96, 240],
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
