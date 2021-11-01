import React from "react";

export const buildFunFact = (icon, result) => {
    return (
        <>
            {icon}
            <span className={"block whitespace-pre-line"}>
                {result}
            </span>
        </>
    )
}

export const pickRandomObject = (arrayofObjectsKey, extendedUsers) => {
    let randomPlayer = Object.values(extendedUsers)[Math.floor(Math.random() * Object.keys(extendedUsers).length)];

    while (!Object.keys(randomPlayer[arrayofObjectsKey]).length) {
        randomPlayer = Object.values(extendedUsers)[Math.floor(Math.random() * Object.keys(extendedUsers).length)];
    }
    const randomInteractedPlayerIndex = Math.floor(Math.random() * Object.keys(randomPlayer[arrayofObjectsKey]).length);
    const randomInteractedPlayerKey = Object.keys(randomPlayer[arrayofObjectsKey])[randomInteractedPlayerIndex];
    const randomInteractedPlayer = randomPlayer[arrayofObjectsKey][randomInteractedPlayerKey];
    return {randomPlayer, randomInteractedPlayerKey, randomInteractedPlayer}
}