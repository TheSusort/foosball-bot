import loadingImage from "../media/slackball.png";
import {CSSTransition} from "react-transition-group";

const LoadingIndicator = props => {
    return (
        <CSSTransition
            in={props.loading}
            timeout={300}
            classNames="fade"
            unmountOnExit
        >
            <div className={"fixed w-full h-full flex justify-center items-center z-50"}>
                <img src={loadingImage} alt={"loading"} className={"animate-spin-slow absolute"}/>
            </div>
        </CSSTransition>
    )
}

export default LoadingIndicator