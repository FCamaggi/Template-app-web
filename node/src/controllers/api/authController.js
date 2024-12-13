const { User } = require('../../models');
const { hashPassword, generateToken, comparePasswords } = require('../../services/auth.service');

const authController = {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Crear usuario
            const hashedPassword = await hashPassword(password);
            const user = await User.create({
                email,
                password: hashedPassword,
                name,
                role: 'user'
            });

            // Generar token
            const token = generateToken(user);

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verificar contraseña
            const isValid = await comparePasswords(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generar token
            const token = generateToken(user);

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async profile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            res.json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authController;
