import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import connectDB from './config/db.js';
import User from './models/User.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.startsWith('in-memory')) {
        const count = await User.countDocuments();
        if (count === 0) {
            await User.create({ name: 'Super Admin Demo', mobileNumber: '9999999999', role: 'SuperAdmin' });
            await User.create({ name: 'Parent Demo', mobileNumber: '8888888888', role: 'Parent' });
            await User.create({ name: 'Teacher Demo', mobileNumber: '7777777777', role: 'Teacher', assignedClass: '5f8d0a7b2b8e9a1111111111' });
            console.log('Zero-Config In-Memory Database Seeded with Demo Users!');
            console.log('Use 9999999999 (Admin), 8888888888 (Parent), 7777777777 (Teacher)');
        }
    }
});

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Import Routes
import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

import { initCronJobs } from './utils/cronBackup.js';

// Start scheduled tasks
initCronJobs();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health', healthRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

// Basic Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
