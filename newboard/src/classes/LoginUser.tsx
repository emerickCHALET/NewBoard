import Users from "./Users";

/**
 * Class of object LoginUser
 */
class LoginUser {
    message: string;
    data: Users;
    token: string;

    constructor(message: string, data: Users, token: string) {
        this.message = message;
        this.data = data;
        this.token = token;
    }
}
export default LoginUser
