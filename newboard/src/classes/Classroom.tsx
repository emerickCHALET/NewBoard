import Student from "./Student";

/**
 * Class of object Classroom
 */
class Classroom {
    name: string;
    studentsList: Array<Student>;

    constructor(name:  string, studentsList: Array<Student>) {
        this.name = name;
        this.studentsList = studentsList;
    }

    public toString(){
        return this.name;
    }
}

export default Classroom;
