// ClusterView.jsx

import React from "react";
import {DeckGL} from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1,
  pitch: 0,
  bearing: 0
};

const data = Array.from({ length: 1000 }, (_, i) => ({
  position: [
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  ],
  id: i
}));

export default function ClusterView() {

  const layers = [
    new ScatterplotLayer({
      id: 'scatter',
      data,
      getPosition: d => d.position,
      getFillColor: [0, 128, 255],
      getRadius: 50000,
      pickable: true,
      onClick: info => console.log(info.object)
    })
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}