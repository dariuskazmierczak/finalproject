const spicedPg = require('spiced-pg');

let db = spicedPg(
    process.env.DATABASE_URL ||
    'postgres:dariuszkazmierczak:postgres@localhost:5432/resume'
);

//-----------------WELCOME--------------------//

module.exports.addUser = (email, password) => {
    return db.query(`
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING *`,
        [email, password]
    );
};

module.exports.getPassword = (email) => {
    return db.query(`
        SELECT *
        FROM users
        WHERE email = '${email}'
    `);
};

module.exports.addCode = (email, code) => {
    return db.query(`
        INSERT INTO reset_codes (email, code)
        VALUES($1, $2)
        RETURNING *`,
        [email, code]
    );
};

module.exports.getCode = (email) => {
    return db.query(`
        SELECT code 
        FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 1`,
        [email]
    );
};

module.exports.updatePassword = (email, password) => {
    return db.query(`
        UPDATE users
        SET password = $2
        WHERE email = $1
        RETURNING *`,
        [email, password]
    );
};

//-----------------GET DATA--------------------//
module.exports.getUserInfo = (userId) => {
    return db.query(`
        SELECT *
        FROM users
        WHERE id = $1`,
        [userId]
    );
};

module.exports.getPersonal = (userId) => {
    return db.query(`
        SELECT * FROM personal
        WHERE user_id = $1`,
        [userId]
    );
};


//-------------SET DATA--------------------//
module.exports.addPersonal = (user_id, first, last, email, phone, location, jobcategory) => {
    return db.query(`
        INSERT INTO personal (user_id, first, last, email, phone, location, jobcategory)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [user_id, first, last, email, phone, location, jobcategory]
    );
};

module.exports.addEducation = (user_id, school_name, school_location, degree, start_date, end_date) => {
    return db.query(`
        INSERT INTO personal (user_id, school_name, school_location, degree, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [user_id, school_name, school_location, degree, start_date, end_date]
    );
};

//-------------UPDATE DATA--------------------//
module.exports.updatePersonal = (user_id, first, last, email, phone, location, jobcategory) => {
    return db.query(`
        UPDATE personal
        SET first = $2, last = $3, email = $4, phone = $5, location = $6, jobcategory = $7
        WHERE user_id = $1
        RETURNING *`,
        [user_id, first, last, email, phone, location, jobcategory]
    );
};