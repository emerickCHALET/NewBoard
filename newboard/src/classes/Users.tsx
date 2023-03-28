/**
 * Class of object Users
 */
class Users {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    classId: number;
    establishmentId: number;
    WorkspaceUserId: number;
    created: Date;

    constructor(id: number, firstname: string, lastname: string, email: string, password: string, role: string, classId: number, establishmentId: number, WorkspaceUserId: number, created: Date) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.classId = classId;
        this.establishmentId = establishmentId;
        this.WorkspaceUserId = WorkspaceUserId;
        this.created = created;
    }
}

export default Users;
