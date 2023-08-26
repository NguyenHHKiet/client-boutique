import { format } from "timeago.js";

export default function Message({ message, own }) {
    return (
        <li className={own ? "" : ""}>
            <div className="messageTop">
                {!own && (
                    <span>
                        <i className="bi bi-robot"></i>
                    </span>
                )}
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </li>
    );
}
