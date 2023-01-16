import Classroom from "./Classroom";

class Workspace {
    name: String;
    classroom: string;
    id: number;

    constructor(name: string, classroom: string, id: number) {
        this.name = name;
        this.classroom = classroom;
        this.id = id;
    }
}

export default Workspace;