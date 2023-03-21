class Establishments {
    id: number;
    EstablishmentName: string;
    created: Date;
    constructor(id: number, EstablishmentName: string, created: Date) {
        this.id = id;
        this.EstablishmentName = EstablishmentName;
        this.created = created;
    }
}

export default Establishments;