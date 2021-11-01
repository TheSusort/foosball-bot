import {useDispatch, useSelector} from "react-redux";
import {fetchEmojis, selectAllEmojis} from "../reducers/emojis";
import {useEffect} from "react";

const UserName = ({user, size = "h-3.5 lg:h-5"}) => {
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
        // find indexes for all : chars in name
        while (idx !== -1) {
            indices.push(idx);
            idx = user.name.indexOf(element, idx + 1);
        }

        // if : chars found, search for emojis
        if (indices.length) {
            for (let i = 0; i < indices.length; i++) {
                // first loop start from 0, else start from user.name[i]
                let index = indices[i]

                if (!i) {
                    index = 0
                    newName.push(user.name.substring(index, indices[i]));
                } else {
                    newName.push(user.name.substring(indices[i - 1] + 1, indices[i]))
                }

                // get content from current index to next, the emoji key to test
                let emojiKey = user.name.substring(indices[i] + 1, indices[i + 1]);

                if (emojis[emojiKey]) {
                    // if found, add to name
                    emoji = emojis[emojiKey];
                    newName.push(<img src={emoji}
                                      alt={emojiKey}
                                      className={size + " inline"}
                                      key={emojiKey + Math.random()}/>)

                    // if last round, add remaining text
                    if (i === indices.length - 2) {
                        newName.push(user.name.substring(indices[i + 1] + 1, user.name.length))
                    }

                    // found emoji, skip next index
                    i++;
                } else {
                    // if not found, add :
                    newName.push(":")
                }
            }
        }
        if (emoji) {
            return (
                <>
            <span className={"whitespace-nowrap inline-flex items-start"}>
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