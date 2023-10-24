const Decimal = require('decimal.js');
//the user class, responsible for handling the object associated with a login
class User {
    static async signIn(name, password, db) {
        console.log("signIn");
        const user = new User();
        const userData = await fetchUserWithPasswordFromDB(name, password, db);
        if (userData) {
            user.id = userData.id;
            user.name = userData.name;
            user.avatar = userData.avatar;
            user.balance = new Decimal(userData.balance);
            user.players = {}
            return user;
        } else {
            throw new Error("Invalid credentials")            
        }
    }

    static async signUp(name, password, email, db) {
        console.log("signUp");
        const nameAlreadyTaken = await checkNameAlreadyTaken(name, db)
        if (nameAlreadyTaken) throw new Error("User already exist")
        const avatar = Math.floor(Math.random() * 32)
        await saveUserToDB(name, password, avatar, db);
    }

    static async getUserFromDB(name, db) {
        // Fetch user details from DB
        const userData = await fetchUserFromDB(name, db);
        return userData
    }

    async deposit(amount) {
        if (amount <= 0) {
            throw new Error('Invalid amount');
        }

        // Update balance in DB
        await updateBalanceInDB(this.name, this.balance + amount);

        // Update local state
        this.balance += amount;
    }

    async withdraw(amount) {
        if (amount <= 0 || amount > this.balance) {
            throw new Error('Invalid amount');
        }

        // Update balance in DB
        await updateBalanceInDB(this.name, this.balance - amount);

        // Update local state
        this.balance -= amount;
    }
}

// Mock database functions
async function checkNameAlreadyTaken(name, db) {
    console.log("checkNameAlreadyTaken")
    // Simulate a database check
    // const client = await db.connect();
    const { rows } = await db.query(`SELECT * FROM users WHERE username = '${name}'`);
    // client.release();
    return rows.length > 0;
    // return true;
}

async function saveUserToDB(name, password, avatar, db) {
    // Simulate saving a new user to the database
    console.log("saveUserToDB")
    // const client = await db.connect();
    const { rows } = await db.query(`INSERT INTO users(username, password, email, avatar, balance) VALUES('${name}', '${password}', '${name}@test.com.br', ${avatar}, 0) RETURNING *`);
    if (rows.length>0) {
        console.log("inserted user into db")
        console.log(rows[0])
        return rows[0]
    }
    console.log("failed to insert user")
    // // client.release();
    // if (rowCount > 0) {
    //     console.log("inserted user into db")
    //     return true
    // }
    // console.log("failed to insert user")
    // return false
}

async function fetchUserFromDB(name, db) {
    console.log("fetchUserFromDB")
    // const client = await db.connect();
    const { rows } = await db.query(`SELECT * FROM users WHERE username = '${name}'`);
    // client.release();
    if (rows.length > 0) {
        console.log("fetchUserFromDB 1")
        const user = rows[0] ; // Return user id
        console.log(user)
        // const client = await db.connect();
        await db.query(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = '${name}'`);
        // client.release();
        return {
            id: user.userid,
            name: user.username,
            email: user.email,
            avatar: user.avatar,
            balance: new Decimal(user.balance), //it looks like numeric type saves as string
            players: {}
        };
    }
    // Simulate fetching a user from the database
}

async function fetchUserWithPasswordFromDB(name, password, db) {
    console.log("fetchUserWithPasswordFromDB")
    const { rows } = await db.query(`SELECT * FROM users WHERE username = '${name}' AND password = '${password}'`);
    if (rows.length > 0) {
        console.log("fetchUserFromDB 1")
        const user = rows[0] ; // Return user id
        console.log(user)
        // const client = await db.connect();
        await db.query(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = '${name}'`);
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

async function updatebalanceInDB(name, newBalance) {
    // Simulate updating the user's balance in the database
}

module.exports = User
