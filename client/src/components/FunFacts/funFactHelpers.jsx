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
    const parentObjectValues = Object.values(parentObject);
    const parentObjectKeys = Object.keys(parentObject);
    
    if (parentObjectValues.length === 0) {
        return {randomChildObject: null, randomChildObjectArrayKey: null, randomChildObjectArrayValue: null};
    }
    
    // Find all objects that have non-empty arrays for the specified key
    const validObjects = parentObjectValues.filter(obj => 
        obj && 
        obj[arrayOfObjectsKey] && 
        Object.keys(obj[arrayOfObjectsKey]).length > 0
    );
    
    if (validObjects.length === 0) {
        return {randomChildObject: null, randomChildObjectArrayKey: null, randomChildObjectArrayValue: null};
    }
    
    // Pick a random object from valid objects
    const randomChildObject = validObjects[Math.floor(Math.random() * validObjects.length)];
    const arrayKeys = Object.keys(randomChildObject[arrayOfObjectsKey]);
    const randomChildObjectIndex = Math.floor(Math.random() * arrayKeys.length);
    const randomChildObjectArrayKey = arrayKeys[randomChildObjectIndex];
    const randomChildObjectArrayValue = randomChildObject[arrayOfObjectsKey][randomChildObjectArrayKey];
    
    return {randomChildObject, randomChildObjectArrayKey, randomChildObjectArrayValue}
}