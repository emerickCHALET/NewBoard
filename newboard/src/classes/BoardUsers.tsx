class BoardUsers {
    id: number;
    userId: number;
    boardId: number;
    created: Date;

    constructor(id: number, userId: number, boardId: number, created: Date) {
        this.id = id;
        this.userId = userId;
        this.boardId = boardId;
        this.created = created;
    }
}

export default BoardUsers;