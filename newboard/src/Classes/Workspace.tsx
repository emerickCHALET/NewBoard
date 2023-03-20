/**
 * Class of object Workspace
 */
class Workspace {
    name: String;
    classroom: string;
    id: number;
    roomId: String;

    constructor(name: string, classroom: string, id: number, roomId: String) {
        this.name = name;
        this.classroom = classroom;
        this.id = id;
        this.roomId = roomId;
    }
}

export default Workspace;
