import React, {useEffect, useState} from "react";
import {getCurrentScoreData} from "../fetch/Data";
import BouncingLogo from "./BouncingLogo";
import useWindowDimensions from "../hooks/window";
import Confetti from "react-confetti";

const CurrentMatch = () => {

    const [currentScore, setCurrentScore] = useState([]);
    const [celebrate, setCelebrate] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false)
    const {width, height} = useWindowDimensions()

    const getCurrentScore = async () => {

        getCurrentScoreData().then((response) => {
            if (response && JSON.stringify(currentScore) !== JSON.stringify(response)) {
                setCurrentScore(response)
                setCelebrate(celebrate + 1)
            }
        })
    }

    useEffect(() => {
        getCurrentScore()
        const interval = setInterval(() => getCurrentScore(), 3000)
        return () => clearInterval(interval)
    })

    useEffect(() => {
        if (celebrate > 1) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 5000)
        }
    }, [celebrate])


    return (
        <div
            className={"flex items-center content-center w-full min-h-screen fixed custom-team-gradient overflow-hidden"}>

            <BouncingLogo/>
            {showCelebration &&
            <Confetti width={width} height={height}/>
            }
            <div
                className={"text-9xl font-extrabold text-center flex-1 whitespace-nowrap flex justify-evenly text-white"}>
                {currentScore.map((score, index) =>
                    <span key={index} className={""}>
                        {score ?? 0}
                    </span>
                )}
            </div>
        </div>
    )
}

export default CurrentMatch