import Counter from '../models/Counter.js';

// Algorithm: 7 Random digits (start from 2-9) + 4 Auto-increment serial digits
export const generateStudentId = async () => {
    // 1. Query/Increment the Counter
    const counter = await Counter.findOneAndUpdate(
        { idName: 'studentSerial' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    // 2. Pad to exactly 4 digits
    const serialPart = counter.seq.toString().padStart(4, '0');

    // 3. Generate 7-digit random number (range 2000000 to 9999999)
    const min = 2000000;
    const max = 9999999;
    const randomPart = Math.floor(Math.random() * (max - min + 1)) + min;

    // 4. Concatenate
    const finalId = `${randomPart}${serialPart}`;
    return parseInt(finalId, 10);
};
