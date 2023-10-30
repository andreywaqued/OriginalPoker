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
     * @param {number} id 
     * @param {string} source
     * @param {any} db 
     *
    */
    static async handleMoney(amount, id, source, db) {
        logger.log("handleMoney")
        await updateUserBalanceInDB(amount, id, source, db)
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

async function saveUserToDB(name, password, email, avatar, db) {
    // Simulate saving a new user to the database
    logger.log("saveUserToDB")
    // const client = await db.connect();
    const { rows } = await db.query(`INSERT INTO users(username, password, email, avatar, balance) VALUES(
                                    '${name}',
                                    crypt('${password}', gen_salt('bf')),
                                    '${email}',
                                    '${avatar}',
                                    0)
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
            balance: new Decimal(user.balance) //it looks like numeric type saves as string
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
    await db.transact(async client => {
        await db.query("UPDATE users SET balance = balance + $1 WHERE userid = $2;",
            [amount, id])    
        await db.query("INSERT INTO moneyTransactions(userid, amount, source) VALUES($1, $2, $3);",
            [id, amount, source])
    })
}

module.exports = User
