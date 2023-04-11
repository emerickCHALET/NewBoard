class UsersStatus {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    classId: number;
    lastActive: Date;

    constructor(id: number, userId: number, firstName: string, lastName: string, classId: number, lastActive: Date) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.classId = classId;
        this.lastActive = lastActive;
    }
}

export default UsersStatus;
