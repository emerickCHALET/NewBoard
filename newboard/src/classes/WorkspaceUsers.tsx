class WorkspaceUsers{
    id: number;
    userID: number;
    workspaceID: number;
    created: Date;
    constructor(id: number, userID: number, workspaceID: number, created: Date) {
        this.id = id;
        this.userID = userID;
        this.workspaceID = workspaceID;
        this.created = created;
    }
}

export default WorkspaceUsers