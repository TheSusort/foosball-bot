import loadingImage from "../media/slackball.png";
import {CSSTransition} from "react-transition-group";
import {useRef} from "react";

const LoadingIndicator = props => {
    const nodeRef = useRef(null);

    return (
        <CSSTransition
            in={props.loading}
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={nodeRef}
        >
            <div ref={nodeRef} className={"fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"}>
                <div className="flex flex-col items-center">
                    <img src={loadingImage} alt={"loading"} className={"animate-spin-slow"}/>
                </div>
            </div>
        </CSSTransition>
    )
}

export default LoadingIndicator