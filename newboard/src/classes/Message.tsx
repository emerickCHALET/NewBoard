/**
 * Class of object Message
 */
class Message {

    sentBy: string
    fullNameSender: string
    message: string
    roomId: string
    created: string

    constructor(sentBy: string, fullNameSender: string, message: string, roomId: string, created: string) {
        this.sentBy = sentBy;
        this.fullNameSender = fullNameSender;
        this.message = message;
        this.roomId = roomId;
        this.created = created;
    }
}
export default Message
