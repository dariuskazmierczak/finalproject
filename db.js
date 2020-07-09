const spicedPg = require('spiced-pg');

let db = spicedPg(
    process.env.DATABASE_URL ||
    'postgres:dariuszkazmierczak:postgres@localhost:5432/socialnetwork'
);

module.exports.addUser = (first, last, email, password) => {
    return db.query(`
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [first, last, email, password]
    );
};

module.exports.getPassword = (emailInput) => {
    return db.query(`
        SELECT password, email, id 
        FROM users
        WHERE email = '${emailInput}'
    `);
};

module.exports.addCode = (email, code) => {
    return db.query(`
        INSERT INTO reset_codes (email, code)
        VALUES($1, $2)
        RETURNING *`,
        [email, code])
}

module.exports.getCode = (email, code) => {
    return db.query(`
        SELECT code 
        FROM reset_codes
        WHERE email = '${email}'
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 1
    `)
}

module.exports.updatePassword = (email, password) => {
    return db.query(`
        UPDATE users
        SET password = $1
        WHERE email = '${email}'
        RETURNING *`,
        [password]
    );
}

module.exports.getUsersNumber = () => {
    return db.query(`
        SELECT COUNT(*) AS num
        FROM users
    `)
}

module.exports.getUserInfo = (userId) => {
    return db.query(`
        SELECT *
        FROM users
        WHERE id = '${userId}'
    `)
}

module.exports.addImage = (id, url) => {
    return db.query(`
    UPDATE users
    SET imageUrl = $2
    WHERE id = $1
    RETURNING *`,
        [id, url]
    )
}

module.exports.setBio = (id, bio) => {
    return db.query(`
    UPDATE users
    SET bio = $2
    WHERE id = $1
    RETURNING *`,
        [id, bio]
    )
}

//---------------------------------------------------------------
//-----------------FIND PEOPLE
//---------------------------------------------------------------
module.exports.getMostRecentUsers = () => {
    return db.query(`
      SELECT first, last, imageurl, bio, id FROM users ORDER BY id DESC LIMIT 3;
`);
};

module.exports.userQuery = (letter) => {
    return db.query(
        `SELECT first, last, imageurl, bio, id FROM users WHERE first ILIKE $1;`,
        [letter + "%"]
    );
};

//---------------------------------------------------------------
//-----------------FRIEND BUTTON
//---------------------------------------------------------------
module.exports.initialFriendshipStatus = (userId, id) => {
    const q = `SELECT * FROM friendships
    WHERE (sender_id = $1 AND receiver_id = $2) 
    OR (receiver_id = $1 AND sender_id = $2);`;

    const params = [userId, id];

    return db.query(q, params);
};
module.exports.makeFriendRequest = (userId, id) => {
    const q = `INSERT INTO friendships (sender_id, receiver_id)
    VALUES ($1, $2);`;

    const params = [userId, id];

    return db.query(q, params);
};

module.exports.cancelFriendship = (userId, id) => {
    const q = `DELETE FROM friendships
    WHERE sender_id = $1 AND receiver_id = $2
    OR sender_id = $2 AND receiver_id = $1;`;

    const params = [userId, id];

    return db.query(q, params);
};

module.exports.acceptFriend = (userId, id) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE receiver_id = $1 AND sender_id = $2;`;
    const params = [userId, id];

    return db.query(q, params);
};

//---------------------------------------------------------------
//-----------------SHOW RELATIONS 
//---------------------------------------------------------------
module.exports.getFriendsAndWannabes = (id) => {
    const q = `SELECT users.id, first, last, imageurl, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = users.id AND sender_id = $1);`;
    const params = [id];

    return db.query(q, params);
};

//---------------------------------------------------------------
//-----------------CHAT
//---------------------------------------------------------------
module.exports.getLastMessages = () => {
    return db.query(`
    SELECT users.id, users.first, users.last, users.imageurl, chat.text_message, chat.created_at
    FROM chat
    JOIN users
    ON users.id=chat.sender_id
    ORDER BY created_at ASC
    LIMIT 10;
    `)
}

module.exports.addNewMessage = (id, mes) => {
    return db.query(`
    INSERT INTO chat (sender_id, text_message)
    VALUES ($1, $2)
    RETURNING *
    `, [id, mes])
}

module.exports.getNewMessage = (id) => {
    return db.query(`
    SELECT users.id, users.first, users.last, users.imageurl, chat.text_message, chat.created_at
    FROM chat
    JOIN users
    ON users.id= chat.sender_id
    WHERE chat.sender_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
    `, [id])
}