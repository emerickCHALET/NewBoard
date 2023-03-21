class Rooms{
    id: number;
    name: string;
    created: Date;
    constructor(id: number, name: string, created: Date) {
        this.id = id;
        this.name = name;
        this.created = created;
    }
}

export default Rooms;