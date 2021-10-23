const UserName = ({user, emojis, size}) => {
    if (user.name) {
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
                    console.log("first round before emoji ", user.name.substring(index, indices[i]))
                    newName.push(user.name.substring(index, indices[i]));
                } else {
                    console.log((i / 2) + 1 + " round before emoji ", user.name.substring(indices[i - 1] + 1, indices[i]))
                    newName.push(user.name.substring(indices[i - 1] + 1, indices[i]))
                }

                // get content for first to second index
                let emojiKey = user.name.substring(indices[i] + 1, indices[i + 1]);
                if (emojis[emojiKey]) {
                    emoji = emojis[emojiKey];
                    newName.push(<img src={emoji} alt={emojiKey} className={size + " inline"}/>)
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