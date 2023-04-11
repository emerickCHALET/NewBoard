class Student {
    id: number;
    attendanceId: number;
    firstname: string;
    lastname: string;
    present: boolean;
    late: boolean;
    lateDuration: number;

    constructor(id: number, attendanceId: number, firstname: string, lastname: string, present: boolean, late: boolean, lateDuration: number) {
        this.id = id;
        this.attendanceId = attendanceId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.present = present;
        this.late = late;
        this.lateDuration = lateDuration;
    }
}

export default Student;
