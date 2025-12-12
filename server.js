require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import models
const { Equipment, Client, Rental } = require('./models');

// API Routes

// Get all equipment
app.get('/api/equipment', async (req, res) => {
    try {
        const equipment = await Equipment.findAll();
        res.json(equipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching equipment' });
    }
});

// Get all clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching clients' });
    }
});

// Get all rentals
app.get('/api/rentals', async (req, res) => {
    try {
        const rentals = await Rental.findAll({
            include: [
                { model: Client, as: 'client' },
                { model: Equipment, as: 'equipment' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(rentals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching rentals' });
    }
});

// Create a new rental
app.post('/api/rentals', async (req, res) => {
    try {
        const { client_name, client_email, equipment_id, start_date, end_date } = req.body;

        // Find or create client
        const [client] = await Client.findOrCreate({
            where: { email: client_email },
            defaults: { name: client_name }
        });

        // Get equipment to calculate price
        const equipment = await Equipment.findByPk(equipment_id);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        // Calculate total price (simplified)
        const start = new Date(start_date);
        const end = new Date(end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const total_price = days * equipment.price_per_day;

        const rental = await Rental.create({
            client_id: client.id,
            equipment_id,
            start_date,
            end_date,
            total_price
        });

        res.status(201).json(rental);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating rental' });
    }
});


// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Админ панель
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
        console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
    });
});
