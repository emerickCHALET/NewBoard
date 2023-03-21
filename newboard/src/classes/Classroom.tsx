
/**
 * Class of object Classroom
 */
class Classroom {
    id: string;
    ClassroomName: string;
    EstablishmentId: string;
    created: Date;

    constructor(id: string, ClassroomName: string, EstablishmentId: string, created: Date) {
        this.id = id;
        this.ClassroomName = ClassroomName;
        this.EstablishmentId = EstablishmentId;
        this.created = created;
    }
}

export default Classroom;
