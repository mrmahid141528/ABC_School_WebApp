import cron from 'node-cron';
import { exec } from 'child_process';
import path from 'path';

export const initCronJobs = () => {
    // Run nightly at 02:00 AM server time
    cron.schedule('0 2 * * *', () => {
        console.log('[CRON] Starting Nightly Database Backup...');

        const timestamp = new Date().toISOString().split('T')[0];
        const backupDir = path.join(process.cwd(), 'backups', `backup_${timestamp}`);

        // MongoDB Dump command
        const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_erp';
        const dumpCommand = `mongodump --uri="${dbUri}" --out="${backupDir}"`;

        exec(dumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`[CRON] Backup Error: ${error.message}`);
                return;
            }
            if (stderr) console.error(`[CRON] Backup stdErr: ${stderr}`);
            console.log(`[CRON] Backup completed successfully to ${backupDir}`);

            // In a real scenario, we'd zip the folder and upload to S3/Google Drive here
        });
    });
};
