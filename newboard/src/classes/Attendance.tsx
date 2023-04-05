class Attendance {
    id: number;
    attendanceId: number;
    classroomsId: number;
    classroomName: string;
    present: boolean;
    late: boolean;
    call_date: string;

    constructor(id: number, attendanceId: number, classroomsId: number, classroomName: string,present: boolean, late: boolean, call_date: string) {
        this.id = id;
        this.attendanceId = attendanceId;
        this.classroomsId = classroomsId;
        this.classroomName = classroomName;
        this.present = present;
        this.late = late;
        this.call_date = call_date;
    }
}

export default Attendance;
