//the user class, responsible for handling the object associated with a login
class User {
    static async createAndLogin(id, password) {
        const user = new User();
        await user.tryLogin(id, password);
        return user;
    }

    async tryLogin(id, password) {
        // Perform DB check
        const loginSuccessful = await checkLogin(id, password);
        if (loginSuccessful) {
            await this.getUserFromDB(id);
        } else {
            throw new Error('Invalid login credentials');
        }
    }

    async createNewUser(name, avatar) {
        // Save user to DB and get the user's id
        const userId = await saveUserToDB(name, avatar);
        await this.getUserFromDB(userId);
    }

    async getUserFromDB(id) {
        // Fetch user details from DB
        const userData = await fetchUserFromDB(id);
        this.name = userData.name;
        this.avatar = userData.avatar;
        this.balance = userData.balance;
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
async function checkLogin(id, password) {
    // Simulate a database check
    return true;
}

async function saveUserToDB(name, avatar) {
    // Simulate saving a new user to the database
    return 1; // Return user id
}

async function fetchUserFromDB(id) {
    // Simulate fetching a user from the database
    return {
        name: id,
        avatar: 0,
        balance: 1000
    };
}

async function updateBalanceInDB(name, newBalance) {
    // Simulate updating the user's balance in the database
}

module.exports = User