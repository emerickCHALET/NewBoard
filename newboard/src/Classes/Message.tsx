import {date} from "yup";

class Message {
    id: number
    message: string
    idsender: number

    sentAt: string

    constructor(id : number,message : string,idsender : number, sentAt: string) {
        this.id = id
        this.message =message
        this.idsender = idsender
        this.sentAt = sentAt

    }
}
export default Message