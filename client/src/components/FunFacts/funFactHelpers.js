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

export const pickRandomObject = (arrayOfObjectsKey, parentObject) => {
    let randomChildObject = Object.values(parentObject)[Math.floor(Math.random() * Object.keys(parentObject).length)];

    while (!Object.keys(randomChildObject[arrayOfObjectsKey]).length) {
        randomChildObject = Object.values(parentObject)[Math.floor(Math.random() * Object.keys(parentObject).length)];
    }
    const randomChildObjectIndex = Math.floor(Math.random() * Object.keys(randomChildObject[arrayOfObjectsKey]).length);
    const randomChildObjectArrayKey = Object.keys(randomChildObject[arrayOfObjectsKey])[randomChildObjectIndex];
    const randomChildObjectArrayValue = randomChildObject[arrayOfObjectsKey][randomChildObjectArrayKey];
    return {randomChildObject, randomChildObjectArrayKey, randomChildObjectArrayValue}
}