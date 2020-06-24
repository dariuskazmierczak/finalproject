const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:dariuszkazmierczak:postgres@localhost:5432/socialnetwork");
}

module.exports.addUser = (first, last, email, pass) => {
    return db.query(`INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`
        , [first, last, email, pass]
    );
};

module.exports.getUserByEmail = (email) => {
    return db.query(
        `SELECT users.id, users.first, users.last, users.email, users.password FROM users.email=$1 
                      `,
        [email]
    );
};