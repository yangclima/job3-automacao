import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-aqui";

export function generateToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            name: user.name,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "8h" } // Token válido por 8 horas (turno de trabalho)
    );
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: "Token de acesso requerido" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }
        req.user = user;
        next();
    });
}

export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Token de acesso requerido" });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ error: "Acesso negado: permissão insuficiente" });
        }

        next();
    };
}

export function requireManager(req, res, next) {
    return requireRole('GERENTE')(req, res, next);
}
