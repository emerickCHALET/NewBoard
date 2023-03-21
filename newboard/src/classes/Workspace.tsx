/**
 * Class of object Workspace
 */
class Workspace {
    id: number;
    name: string;
    roomId: string;
    created: Date;
    constructor(id: number, name: string, roomId: string, created: Date) {
        this.id = id;
        this.name = name;
        this.roomId = roomId;
        this.created = created;
    }
}

export default Workspace;
