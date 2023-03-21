/**
 * Class of object Board
 */
class Board {
    id: number;
    name: string;
    workspaceID: number;
    content: string;

    roomId: string;

    constructor(id: number, name: string, workspaceID: number, content: string, roomId: string) {
        this.id = id;
        this.name = name;
        this.workspaceID = workspaceID;
        this.content = content;
        this.roomId = roomId
    }
}

export default Board;
