const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const models = require('../models');
const { User } = models;

class AuthService {
    static async hashPassword(password) {
        return hash(password, 10);
    }

    static async comparePasswords(password, hashedPassword) {
        return compare(password, hashedPassword);
    }

    static generateToken(user) {
        return sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}

module.exports = AuthService;