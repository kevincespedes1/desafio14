import UserModel from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';

export const getProductsView = async (req, res) => {
    try {
        const user = req.session.user;
        res.render('products', { user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {

        const { first_name, last_name, email, age, password } = req.body;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: null
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {

            user.last_connection = new Date();
            await user.save();

            req.session.user = user;
            res.cookie('user', JSON.stringify(user), { maxAge: 90000000, httpOnly: true });
            res.redirect('/');
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const { user } = req.cookies;
        if (user) {
            const userData = JSON.parse(user);
            const { password, ...userWithoutPassword } = userData;
            res.status(200).json({ user: userWithoutPassword });
        } else {
            res.status(401).json({ message: 'No hay usuario autenticado en la sesión' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Actualizar la última conexión al cerrar sesión
        if (req.session.user) {
            const user = await UserModel.findById(req.session.user._id);
            user.last_connection = new Date();
            await user.save();
        }

        // Eliminar la sesión y redireccionar
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }
            res.clearCookie('user');
            res.redirect('/login'); // Redirecciona a donde quieras
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error al cerrar sesión' });
    }
};