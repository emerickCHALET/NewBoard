/**
 * Class of object Users
 */
class Users {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string;
    classId: number;
    establishmentId: number;
    WorkspaceUserId: number;
    created: Date;

    constructor(id: number, firstName: string, lastName: string, email: string, password: string, roles: string, classId: number, establishmentId: number, WorkspaceUserId: number, created: Date) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.classId = classId;
        this.establishmentId = establishmentId;
        this.WorkspaceUserId = WorkspaceUserId;
        this.created = created;
    }
}

export default Users;
