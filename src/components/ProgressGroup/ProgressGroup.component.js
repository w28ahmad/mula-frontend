import React, { useState, useEffect } from "react";

import ProgressBar from "../ProgressBar/ProgressBar.component";
import { PROGRESS_COLORS } from "../../data/ProgressBarData";

import "./ProgressGroup.component.css";

export default function ProgressGroup(props) {
  const [position, setPosition] = useState(1);

  const [progressState, setProgressState] = useState(() => {
    let playerData = [];
    for (const [index, player] of props.players.entries()) {
      playerData.push({
        id: player.id,
        name: player.name,
        bgcolor: PROGRESS_COLORS[index],
        progress: 0,
        position: null,
      });
    }
    return playerData;
  });

  useEffect(() => {
    props.updateProgressBar.current = updateProgressBar;
  });

  const updateProgressBar = (userId, score) => {
    setProgressState(() => {
      for (let i = 0; i < progressState.length; i++) {
        if (progressState[i].id === userId) {
          progressState[i].progress = props.step * score;
          if (progressState[i].progress >= 100) {
            progressState[i].position = position;
            setPosition(position + 1);
          }
        }
      }
      return [...progressState];
    });
  };

  return (
    <div className={"progressGroup"}>
      {progressState.map((player, idx) => (
        <ProgressBar
          key={idx}
          bgcolor={player.bgcolor}
          progress={player.progress}
          name={player.name}
          position={player.position}
        />
      ))}
    </div>
  );
}
