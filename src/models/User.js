import JwtDecode from 'jwt-decode';

export default class User {
    static from(token) {
        try {
            let obj = JwtDecode(token);
            return new User(obj)
        } catch(_) {
            return null
        }
    }

    constructor({id, email, role, first_name, last_name}) {
        this.id         = id;
        this.email      = email;
        this.role       = role;
        this.first_name = first_name || '';
        this.last_name  = last_name || '';
        this.name       = this.first_name + " " + this.last_name;
    }
}