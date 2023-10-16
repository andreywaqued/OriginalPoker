const Decimal = require('decimal.js');
//the user class, responsible for handling the object associated with a login
class User {
    static async createAndLogin(name, password, db) {
        console.log("createAndLogin")
        // console.log(db)
        const user = new User();
        await user.tryLogin(name, password, db);
        return user;
    }

    async tryLogin(name, password, db) {
        console.log("tryLogin")
        // Perform DB check
        const loginSuccessful = await checkLogin(name, password, db);
        if (loginSuccessful) {
            await this.getUserFromDB(name, db);
        } else {
            console.log("invalid login credentials")
            const avatar = Math.floor(Math.random() * 32)
            await this.createNewUser(name, password, avatar, db)
        }
    }

    async createNewUser(name, password, avatar, db) {
        console.log("createNewUser")
        // Save user to DB and get the user's id
        const createdUser = await saveUserToDB(name, password, avatar, db);
        if (createdUser) {
            this.id = createdUser.userid;
            this.name = createdUser.username;
            this.avatar = createdUser.avatar;
            this.balance = new Decimal(createdUser.balance);
        }
        console.log(this)
        // await this.getUserFromDB(userId);
    }

    async getUserFromDB(name, db) {
        // Fetch user details from DB
        const userData = await fetchUserFromDB(name, db);
        this.id = userData.id;
        this.name = userData.name;
        this.avatar = userData.avatar;
        this.balance = new Decimal(userData.balance);
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
async function checkLogin(name, password, db) {
    console.log("checkLogin")
    // Simulate a database check
    // const client = await db.connect();
    const { rows } = await db.query(`SELECT * FROM users WHERE username = '${name}' AND password = '${password}'`);
    console.log(rows)
    // client.release();
    return rows.length>0;
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
            avatar: user.avatar,
            balance: new Decimal(user.balance) //it looks like numeric type saves as string
        };
    }
    // Simulate fetching a user from the database
}

async function updateBalanceInDB(name, newBalance) {
    // Simulate updating the user's balance in the database
}

module.exports = User