class Board {
    id: number;
    name: String;
    workspaceID: number;
    content: string;

    constructor(id: number, name: string, workspaceID: number, content: string) {
        this.id = id;
        this.name = name;
        this.workspaceID = workspaceID;
        this.content = content;
    }
}

export default Board;