const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('./authenticate');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const prisma = new PrismaClient();

// Creates user with name & email
// app.post('/users', async (req, res) => {
//     const { name, email } = req.body;
//     try {
//         const newUser = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//             },
//         });
//         res.json(newUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to create user.' });
//     }
// });

// Creates user with name, email & hashed password
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, 
            },
        });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

// Returns JWT for user __id__
// app.post('/users/login/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
//         if (!user) {
//             res.status(404).json({ message: 'User not found.' });
//         } else {
//             const token = jwt.sign({ userId: user.id }, 'secret-key');
//             await prisma.user.update({
//                 where: { id: parseInt(id) },
//                 data: { jwt: token },
//             });
//             res.json({ token });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to log in user.' });
//     }
// });

// Returns JWT for user __id__ & hashed password
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({ userId: user.id }, 'secret-key');
                await prisma.user.update({
                    where: { id: user.id },
                    data: { jwt: token },
                });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid email or password.' });
            }
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
// app.get('/users', authenticate, async (_, res) => {
//     try {
//       const allUsers = await prisma.user.findMany({
//         include: {
//           companies: true
//         }
//       });
//       res.json(allUsers);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to retrieve users.' });
//     }
// });
  

//Get all users - Jorge's edit x3
app.get('/users', authenticate, async (_, res) => {
    try {
      const allUsers = await prisma.user.findMany({
        select: {
        id: true,
        name: true,
        companies: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: {
        jwt: {
          not: null
        }
      }
      });
      res.json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve users.' });
    }
});

//Get all users - Jorge's edit x4
// app.get('/users', authenticate, async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//             include: { companies: true }
//         });
//         res.json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to retrieve user data.' });
//     }
// });

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
