import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Serwer działa ✅');
});

const getUsers = () => {
    const data = fs.readFileSync('./db.json');
    return JSON.parse(data).users;
};

// Endpoint logowania
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ message: 'Zalogowano pomyślnie!', user });
    } else if(!user.isActive){
        res.status(403).json({ error: 'Konto nie jest aktywne. Sprawdź email.' });
    }
    else {
        res.status(401).json({ error: 'Nieprawidłowe dane logowania.' });
    }
});

// Endpoint rejestracji
app.post('/auth/register', (req, res) => {
    const { firstName, lastName, tel, email, password } = req.body;

    if (!email || !password || !firstName || !lastName || !tel) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
    }

    let users = getUsers();

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(409).json({ error: 'Użytkownik już istnieje.' });
    }

    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        tel,
        email,
        password,
        createdAt: new Date(),

    };

    users.push(newUser);

    // Zapisz do pliku
    fs.writeFileSync('./db.json', JSON.stringify({ users }, null, 2));

    res.json({ message: 'Zarejestrowano pomyślnie!', user: newUser });
});

// Start serwera
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});
