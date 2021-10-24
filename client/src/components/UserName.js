import {useDispatch, useSelector} from "react-redux";
import {fetchEmojis, selectAllEmojis} from "../reducers/emojis";
import {useEffect} from "react";

const UserName = ({user, size}) => {
    const emojis = useSelector(selectAllEmojis);
    const dispatch = useDispatch()
    const emojiStatus = useSelector(state => state.emojis.status)
    const emojiError = useSelector(state => state.emojis.error)

    useEffect(() => {
        if (emojiStatus === "idle") {
            dispatch(fetchEmojis())
        }
    }, [dispatch, emojiStatus])

    if (user.name && emojiStatus === "succeeded" && !emojiError) {
        let emoji, newName = [];

        let element = ":"
        let idx = user.name.indexOf(element);
        let indices = [];
        while (idx !== -1) {
            indices.push(idx);
            idx = user.name.indexOf(element, idx + 1);
        }

        if (indices.length && !(indices.length % 2)) {
            for (let i = 0; i < indices.length; i += 2) {
                // first loop start from 0, else start from user.name[i]
                let index = indices[i]
                if (!i) {
                    index = 0
                    newName.push(user.name.substring(index, indices[i]));
                } else {
                    newName.push(user.name.substring(indices[i - 1] + 1, indices[i]))
                }

                // get content for first to second index
                let emojiKey = user.name.substring(indices[i] + 1, indices[i + 1]);
                if (emojis[emojiKey]) {
                    emoji = emojis[emojiKey];
                    newName.push(<img src={emoji}
                                      alt={emojiKey}
                                      className={size + " inline"}
                                      key={emojiKey + Math.random()}/>)
                } else {
                    newName.push(user.name.substring(indices[i], indices[i + 1] + 1))
                }
            }
        }
        if (emoji) {
            return (
                <>
            <span className={"whitespace-nowrap flex items-start"}>
                {newName}
            </span>
                </>
            )
        } else {
            return (
                user.name
            )
        }
    }
    return (
        "Username"
    )
}

export default UserName