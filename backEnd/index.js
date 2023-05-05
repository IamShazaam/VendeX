const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('./authenticate');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const prisma = new PrismaClient();

// Creates user with name & email
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
            },
        });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

// Returns JWT for user __id__
app.post('/users/login/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            const token = jwt.sign({ userId: user.id }, 'secret-key');
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: { jwt: token },
            });
            res.json({ token });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to log in user.' });
    }
});

// Gets all users
// app.get('/users', authenticate, async (_, res) => {
//     try {
//         const allUsers = await prisma.user.findMany();
//         res.json(allUsers);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to retrieve users.' });
//     }
// });


//Get all users - Jorge's edit.
// app.get('/users', authenticate, async (_, res) => {
//     try {
//       const allUsers = await prisma.user.findMany({
//         include: { companies: true }
//       });
//       res.json(allUsers);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to retrieve users.' });
//     }
//   });


//Get all users - Jorge's edit x2
app.get('/users', authenticate, async (_, res) => {
    try {
      const allUsers = await prisma.user.findMany({
        include: {
          companies: true
        }
      });
      res.json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve users.' });
    }
});
  

// Invalidate JWT - Jorge's edit.
app.post('/users/invalidateToken/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: { jwt: null },
            });
            res.json({ message: 'JWT invalidated successfully.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to invalidate JWT.' });
    }
});

// Invalidate JWT
app.post('/users/invalidateToken/:id', authenticate, async (req, res) => {
    // TODO: Implement
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
