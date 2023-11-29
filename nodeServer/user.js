const Decimal = require("decimal.js");
const Logger = require("./logger")
const logger = new Logger("User")
//the user class, responsible for handling the object associated with a login
class User {
    static async signIn(name, password, db) {
        logger.log("signIn");
        const user = new User();
        const userData = await fetchUserWithPasswordFromDB(name, password, db);
        if (userData) {
            user.id = userData.id;
            user.name = userData.name;
            user.avatar = userData.avatar;
            user.email = userData.email;
            user.balance = new Decimal(userData.balance);
            user.players = {};
            user.tournamentsPlaying = {};
            user.settings = userData.settings;
            return user;
        } else {
            throw new Error("Invalid credentials")            
        }
    }

    /**
     *
     * @param {string} name 
     * @param {string} password 
     * @param {string} email
     *
     */
    static async signUp(name, password, email, db) {
        logger.log("signUp");
        const err = await hasInvalidInputs(name, password, email, db)
        if (err) throw new Error(err)
        const avatar = Math.floor(Math.random() * 32)
        await saveUserToDB(name, password, email, avatar, db);
    }

    static async getUserFromDB(name, db) {
        // Fetch user details from DB
        const userData = await fetchUserFromDB(name, db);
        return userData
    }

    static async getUserTransactionsFromDB(id, offset, db) {
        const txs = await fetchUserTransactionsFromDB(id, offset, db)
        return txs
    }


    /**
     *
     * @param {number} amount 
     * @param {number} userID 
     * @param {string} source
     * @param {any} db 
     *
    */
    static async handleMoney(amount, user, socket, source, db) {
        logger.log("handleMoney")
        if (!user) return logger.log("user is undefined, something went wrong.")
        user.balance = user.balance.plus(amount)
        if (socket) socket.emit("updateUserInfo", {user : user, status: 200})
        await updateUserBalanceInDB(amount, user.id, source, db)
    }
    static async updateUserSettings(userid, settings, db) {
        logger.log("updateUserSettings()")
        await db.query(`UPDATE users SET settings = '${JSON.stringify(settings)}' WHERE userid = ${userid}`);
    }
    static async changeAvatar(userid, avatar, db) {
        logger.log("changeAvatar()")
        await db.query(`UPDATE users SET avatar = ${avatar} WHERE userid = ${userid}`);
        // logger.log("changeAvatarUserFromDB")
        // console.log("############################# ATUALIZANDO AVATAR", userId, avatar)
        // const { rows } = await db.query(`SELECT * FROM users WHERE userid = '${userId}'`);
        // console.log("ROWWWWWWWWWWWWWS: ", rows)
    
        // if (rows.length > 0) {
        //     const user = rows[0];
        //     console.log("############################# ATUALIZANDO AVATAR")
        //     await db.query("UPDATE users SET avatar = $1 WHERE userid = $2", [avatar, userId]);
        //     user.avatar = avatar;
        // }
    }
    // async deposit(amount) {
    //     if (amount <= 0) {
    //         throw new Error('Invalid amount');
    //     }

    //     // Update balance in DB
    //     await updateBalanceInDB(this.name, this.balance + amount);

    //     // Update local state
    //     this.balance += amount;
    // }

    // async withdraw(amount) {
    //     if (amount <= 0 || amount > this.balance) {
    //         throw new Error('Invalid amount');
    //     }

    //     // Update balance in DB
    //     await updateBalanceInDB(this.name, this.balance - amount);

    //     // Update local state
    //     this.balance -= amount;
    // }
}

// Mock database functions

/**
 *
 * @param {string} username 
 * @param {string} password
 * @param {string} email
 * @param {any} db
 * @returns {Promise<string | null>}
 *
 */
async function hasInvalidInputs(username, password, email, db) {
    const { rows } = await db.query(`SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`);
    if (rows.length > 0 ) return "Username or E-mail already exists";
    if (username.length < 3) return "Username too short, minimum of 3 characters";
    if (username.length > 20) return "Username too long, maximum of 20 characters";
    if (!/^[A-Za-z0-9]+$/.test(username)) return "Username with invalid characters"
    if (password.length < 8) return "Password too short, minimum of 8 characters"
    return null
}
let userSettings = {
    sounds: true,
    preferedSeat: {"3max": 0, "6max": 0, "9max": 0},
    showValuesInBB: true,
    adjustBetByBB: true,
    presetButtons: {
        preflop:[
            {type: "pot%", value: 25, display: "%"},
            {type: "pot%", value: 50, display: "%"},
            {type: "pot%", value: 75, display: "%"},
            {type: "pot%", value: 100, display: "%"}
        ], 
        postflop:[
            {type: "pot%", value: 25, display: "%"},
            {type: "pot%", value: 50, display: "%"},
            {type: "pot%", value: 75, display: "%"},
            {type: "pot%", value: 100, display: "%"}
        ]
    }
  }
async function saveUserToDB(name, password, email, avatar, db) {
    // Simulate saving a new user to the database
    logger.log("saveUserToDB")
    // const client = await db.connect();
    const { rows } = await db.query(`INSERT INTO users(username, password, email, avatar, balance, settings) VALUES(
                                    '${name}',
                                    crypt('${password}', gen_salt('bf')),
                                    '${email}',
                                    '${avatar}',
                                    0,
                                    '${JSON.stringify(userSettings)}')
                                    RETURNING *`
                                    );
    if (rows.length>0) {
        logger.log("inserted user into db")
        logger.log(rows[0])
        return rows[0]
    }
    logger.log("failed to insert user")
    // // client.release();
    // if (rowCount > 0) {
    //     logger.log("inserted user into db")
    //     return true
    // }
    // logger.log("failed to insert user")
    // return false
}

async function fetchUserFromDB(name, db) {
    logger.log("fetchUserFromDB")
    // const client = await db.connect();
    const { rows } = await db.query(`SELECT * FROM users WHERE username = '${name}'`);
    // client.release();
    if (rows.length > 0) {
        logger.log("fetchUserFromDB 1")
        const user = rows[0] ; // Return user id
        logger.log(user)
        // const client = await db.connect();
        await db.query(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = '${name}'`);
        // client.release();
        return {
            id: user.userid,
            name: user.username,
            email: user.email,
            avatar: user.avatar,
            balance: new Decimal(user.balance), //it looks like numeric type saves as string
            players: {},
            tournamentsPlaying: {},
            settings: user.settings
        };
    }
    // Simulate fetching a user from the database
}


async function fetchUserWithPasswordFromDB(name, password, db) {
    logger.log("fetchUserWithPasswordFromDB")
    const { rows } = await db.query(`UPDATE users
                                    SET last_login = CURRENT_TIMESTAMP
                                    WHERE username = '${name}' AND password = crypt('${password}', password)
                                    RETURNING *;
                                    `);
    if (rows.length > 0) {
        logger.log("fetchUserWithPasswordFromDB 1")
        const user = rows[0] ; // Return user id
        logger.log(user)
        // const client = await db.connect();
        // client.release();
        return {
            id: user.userid,
            name: user.username,
            email: user.email,
            avatar: user.avatar,
            balance: new Decimal(user.balance), //it looks like numeric type saves as string
            settings: user.settings
        };
    }
    return false;
}

async function fetchUserTransactionsFromDB(id, offset, db) {
    const { rows } = await db.query("SELECT * FROM moneyTransactions WHERE userid = $1 ORDER BY created_on DESC LIMIT 10 OFFSET $2", [id, offset]);
    return rows
}

    /**
     *
     * @param {number} amount 
     * @param {number} id 
     * @param {string} source
     * @param {any} db 
     *
    */
async function updateUserBalanceInDB(amount, id, source, db) {
    try {
        await db.transact(async client => {
            const req = await Promise.all([
                client.query("UPDATE users SET balance = balance + $1 WHERE userid = $2;",
                    [amount, id]),    
                client.query("INSERT INTO moneyTransactions(userid, amount, source) VALUES($1, $2, $3);",
                    [id, amount, source])
            ])
            return req
        })
    } catch (err) {
        console.log("Something bad happen on updateUserBalanceInDB")
        console.log(err)
    }
}

module.exports = User
