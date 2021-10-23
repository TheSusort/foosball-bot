const UserName = ({user, emojis, size}) => {
    if (user.name) {
        let emoji, userNameAfterEmoji, userNameBeforeEmoji;

        if (user.name.indexOf(":") !== -1 && user.name.indexOf(":") !== user.name.lastIndexOf(":")) {

            const emojiIndex = user.name.indexOf(":") + 1;
            const lastEmojiIndex = user.name.lastIndexOf(":") - 1;

            if (emojis[user.name.substr(emojiIndex, lastEmojiIndex)]) {
                emoji = emojis[user.name.substr(emojiIndex, lastEmojiIndex)];
                userNameBeforeEmoji = user.name.substr(0, user.name.indexOf(":")) ?? "";
                userNameAfterEmoji = user.name.substr(user.name.lastIndexOf(":") + 1, user.name.length) ?? "";
            }
        }
        if (emoji) {
            return (
                <>
            <span className={"whitespace-nowrap"}>
                {userNameBeforeEmoji}<img className={size + " inline"} src={emoji} alt={"emoji"}/>{userNameAfterEmoji}
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