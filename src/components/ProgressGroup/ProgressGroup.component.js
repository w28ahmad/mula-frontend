import React, { useState, useEffect } from 'react';

import ProgressBar from "../ProgressBar/ProgressBar.component";
import {PROGRESS_COLORS} from "../../data/ProgressBarData";

import './ProgressGroup.component.css'

export default function ProgressGroup(props) {

    const [progressState, setProgressState] = useState(() => {
        let playerData = []
        for(const [index, player] of props.players.entries()) {
            playerData.push({
                id: player.id,
                name: player.name,
                bgcolor: PROGRESS_COLORS[index],
                completed: 0
            });
        }
        return playerData;
    });

    useEffect(() => {
        props.updateProgressBar.current = updateProgressBar
    })

    const updateProgressBar = (userId) => {
        setProgressState(() => {
            for(let i=0; i < progressState.length; i++)
                if(progressState[i].id === userId)
                    progressState[i].completed += props.step
            return [...progressState]
        });
    }

    return (
        <div className={'progressGroup'}>
            {progressState.map((player, idx) => (
                <ProgressBar key={idx} bgcolor={player.bgcolor} completed={player.completed} name={player.name} />
            ))}
        </div>
    )
}
