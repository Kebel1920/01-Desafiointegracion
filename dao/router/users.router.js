import { Router } from "express";
import { usuariosModel } from "../models/usuarios.model.js";
import upload from "../middlewares/multer.js";
import { authenticateToken } from "../middlewares/auth.jwt.js";

const router = Router();

// Ruta para actualizar a usuario premium
router.patch('/premium/:uid', async (req, res) => {
    const { uid } = req.params;
    
    try {
        const usuario = await usuariosModel.findById(uid);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const requiredDocuments = ["Identificación", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
        const uploadedDocuments = usuario.documents.map(doc => doc.name);

        const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));
        if (!hasAllDocuments) {
            return res.status(400).json({ error: "No ha terminado de procesar su documentación" });
        }

        usuario.role = "premium";
        await usuario.save();
        res.status(200).json({ message: "Usuario actualizado a premium" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    const { uid } = req.params;
    
    try {
        const usuario = await usuariosModel.findById(uid);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const files = req.files;
        files.forEach(file => {
            usuario.documents.push({ name: file.originalname, reference: file.path });
        });

        await usuario.save();
        res.status(200).json({ message: "Documentos subidos exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Actualizar last_connection al hacer login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const usuario = await usuariosModel.findOne({ email });
    if (!usuario || !validaPassword(usuario, password)) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email
    };

    usuario.last_connection = new Date();
    await usuario.save();

    const token = jwt.sign({ id: usuario._id }, SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login correcto", usuario: { nombre: usuario.nombre, email: usuario.email } });
});

// Actualizar last_connection al hacer logout
router.get('/logout', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const usuario = await usuariosModel.findById(userId);
        if (usuario) {
            usuario.last_connection = new Date();
            await usuario.save();
        }

        req.session.destroy(error => {
            if (error) {
                return res.status(500).json({
                    error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                    detalle: `${error.message}`
                });
            }
            res.status(200).json({ message: "Logout exitoso" });
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export {router};
