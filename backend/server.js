import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import bcrypt from 'bcryptjs';

import connectDB from './config/db.js';
import User from './models/User.js';

// Load env vars
dotenv.config();

// Connect to database and seed SuperAdmin
connectDB().then(async () => {
    try {
        const hashedPassword = await bcrypt.hash('9733222558', 10);
        await User.findOneAndUpdate(
            { username: 'mrmahid141528@gmail.com' },
            {
                $set: {
                    name: 'Super Admin',
                    username: 'mrmahid141528@gmail.com',
                    password: hashedPassword,
                    role: 'SuperAdmin',
                    isDeleted: false,
                }
            },
            { upsert: true, new: true }
        );
        console.log('✅ SuperAdmin account ready: mrmahid141528@gmail.com');
    } catch (err) {
        console.error('❌ SuperAdmin seed error:', err.message);
    }
});

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins (local dev + Netlify + custom domain)
        // Security is enforced via JWT token on all protected routes
        callback(null, true);
    },
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
import parentRoutes from './routes/parentRoutes.js';
import bugRoutes from './routes/bugRoutes.js';

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
app.use('/api/parents', parentRoutes);
app.use('/api/bugs', bugRoutes);

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
