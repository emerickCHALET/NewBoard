import {date} from "yup";

class Message {
    roomId: string
    sentBy: string
    fullNameSender: string
    message: string
    created: string

    constructor(roomId: string, sentBy: string, fullNameSender: string, message: string, created: string) {
        this.roomId = roomId;
        this.sentBy = sentBy;
        this.fullNameSender = fullNameSender;
        this.message = message;
        this.created = created;
    }
}
export default Message