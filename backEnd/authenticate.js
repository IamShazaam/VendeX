const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'No authorization header provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'secret-key');
        const userId = decodedToken.userId;
        prisma.user
            .findUnique({
                where: { id: userId },
                select: { jwt: true },
            })
            .then((user) => {
                if (!user || user.jwt !== token) {
                    res.status(401).json({ message: 'Invalid or expired token.' });
                    return;
                }
                req.userId = userId;
                next();
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'Failed to authenticate user.' });
            });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = authenticate;
