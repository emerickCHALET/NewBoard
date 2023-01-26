class Board {
    id: number;
    name: String;
    workspaceID: number;

    constructor(id: number, name: string, workspaceID: number) {
        this.id = id;
        this.name = name;
        this.workspaceID = workspaceID;
    }
}

export default Board;