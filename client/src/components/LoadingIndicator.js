import loadingImage from "../slackball.png";

const LoadingIndicator = props => {
    return (
        <div className={"fixed w-full h-full flex justify-center items-center"}>
            <img src={loadingImage} alt={"loading"} className={"animate-spin-slow absolute"}/>
        </div>
    )
}

export default LoadingIndicator