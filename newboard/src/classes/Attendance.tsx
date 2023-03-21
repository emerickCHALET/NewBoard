class Attendance {
    id: string;
    classroomsId: string;
    firstname: string;
    lastname: string;
    userId: string;
    present: boolean;
    call_date: string;
    updatedAt: Date;
    constructor(id: string, classroomsId: string, firstname: string, lastname: string, userId: string, present: boolean, call_date: string, updatedAt: Date) {
        this.id = id;
        this.classroomsId = classroomsId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.userId = userId;
        this.present = present;
        this.call_date = call_date;
        this.updatedAt = updatedAt;
    }
}

export default Attendance;