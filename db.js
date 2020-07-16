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
        [email, code])
}

module.exports.getCode = (email) => {
    return db.query(`
        SELECT code 
        FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 1`,
        [email])
}

module.exports.updatePassword = (email, password) => {
    return db.query(`
        UPDATE users
        SET password = $2
        WHERE email = $1
        RETURNING *`,
        [email, password]
    );
}

//-----------------GET LOGIN DATA--------------------//
module.exports.getUserInfo = (userId) => {
    return db.query(`
        SELECT *
        FROM users
        WHERE id = '${userId}'
    `)
}

//-----------------FORMS--------------------//
module.exports.addPersonal = (first, last, email, phone, location, jobcategory, user_id) => {
    return db.query(`
        INSERT INTO personal (first, last, email, phone, location, jobcategory, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [first, last, email, phone, location, jobcategory, user_id]
    );
};

module.exports.addEducation = (school_name, school_location, degree, start_date, end_date, user_id) => {
    return db.query(`
        INSERT INTO personal (school_name, school_location, degree, start_date, end_date, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [school_name, school_location, degree, start_date, end_date, user_id]
    );
};