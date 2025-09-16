import loadingImage from "../media/slackball.png"
import {useEffect, useState} from "react";
import useWindowDimensions from "../hooks/window";

const BouncingLogo = () => {

    const MS_PER_FRAME = 20;
    const widthDVDLogo = 200;
    const heightDVDLogo = 200;
    const {height, width} = useWindowDimensions();
    const minSpeed = 5;
    const maxSpeed = 15;

    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const [position, setPosition] = useState({
        x: getRandomNumber(0, width - widthDVDLogo),
        y: getRandomNumber(0, height - heightDVDLogo),

    })

    const [xSpeed, setXSpeed] = useState(getRandomNumber(minSpeed, maxSpeed))
    const [ySpeed, setYSpeed] = useState(getRandomNumber(minSpeed, maxSpeed))


    const updatePosition = () => {

        setPosition({
            x: position.x + xSpeed,
            y: position.y + ySpeed,
        })

        if (position.x + xSpeed + widthDVDLogo >= width) {
            setXSpeed(-getRandomNumber(minSpeed, maxSpeed))
        } else if (position.x + xSpeed <= 0) {
            setXSpeed(getRandomNumber(minSpeed, maxSpeed))
        }

        if (position.y + ySpeed + heightDVDLogo >= height) {
            setYSpeed(-getRandomNumber(minSpeed, maxSpeed))
        } else if (position.y + ySpeed <= 0) {
            setYSpeed(getRandomNumber(minSpeed, maxSpeed))
        }

    }

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition()
        }, MS_PER_FRAME)

        return () => clearInterval(interval)
    })


    return (
        <img src={loadingImage} width={widthDVDLogo} height={heightDVDLogo}
             style={{top: `${position.y}px`, left: `${position.x}px`}}
             alt={"bounce"}
             className={"absolute animate-spin-slow"}
        />
    )

}

export default BouncingLogo;