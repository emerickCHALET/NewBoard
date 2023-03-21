/**
 * Class of object Messages
 */
class Messages {
    id: number;
    sentBy: number;
    fullNameSender: string
    message: string
    roomId: string
    created: string
    constructor(id: number, sentBy: number, fullNameSender: string, message: string, roomId: string, created: string) {
        this.id = id;
        this.sentBy = sentBy;
        this.fullNameSender = fullNameSender;
        this.message = message;
        this.roomId = roomId;
        this.created = created;
    }
}
export default Messages
