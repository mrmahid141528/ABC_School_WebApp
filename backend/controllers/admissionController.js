import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import FeeRecord from '../models/FeeRecord.js';
import Classes from '../models/Classes.js';
import GlobalSettings from '../models/GlobalSettings.js';
import { generateStudentId } from '../utils/generateStudentId.js';

// @desc    Submit Public Inquiry (CRM Lead)
// @route   POST /api/admissions/inquiry
// @access  Public
export const createInquiry = async (req, res) => {
    try {
        const { parentName, mobileNumber, requestedClass } = req.body;
        if (!parentName || !mobileNumber || !requestedClass) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }
        const inquiry = await Inquiry.create({ parentName, mobileNumber, requestedClass });
        res.status(201).json({ status: 'success', data: inquiry });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get All Inquiries
// @route   GET /api/admissions/inquiry
// @access  Private (Clerk, SuperAdmin)
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: inquiries });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update Inquiry Status
// @route   PUT /api/admissions/inquiry/:id
// @access  Private (Clerk, SuperAdmin)
export const updateInquiry = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
        if (!inquiry) return res.status(404).json({ status: 'error', message: 'Inquiry not found' });
        res.status(200).json({ status: 'success', data: inquiry });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Submit Admission Application
// @route   POST /api/admissions/submit
// @access  Public
export const submitAdmission = async (req, res) => {
    try {
        const { firstName, lastName, dob, classId, type } = req.body; // type: 'Sessional', 'Rolling', 'Migration'

        // Check Rolling Admission
        const targetClass = await Classes.findById(classId);
        if (!targetClass) return res.status(404).json({ status: 'error', message: 'Class not found' });

        if (!targetClass.isRollingAdmission && type !== 'Migration') {
            // Mock checking GlobalSettings admissionWindow
            const settings = await GlobalSettings.findOne();
            // Just for structure, if window closed:
            // return res.status(400).json({ status: 'error', message: 'Admission window is currently closed' });
        }

        const newStudent = await Student.create({
            firstName,
            lastName,
            dob,
            currentClass: classId,
            admissionStatus: 'Pending',
            // We assign a temporary ID which will be overwritten upon approval
            studentId: Math.floor(Math.random() * 100000000)
        });

        res.status(201).json({ status: 'success', data: newStudent });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Super Admin Approve Admission (Transactions)
// @route   POST /api/admissions/approve/:id
// @access  Private (SuperAdmin)
export const approveAdmission = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            throw new Error('Student application not found');
        }
        if (student.admissionStatus === 'Approved') {
            throw new Error('Student is already approved');
        }

        // 1. Generate 11-Digit ID
        const newStudentId = await generateStudentId();
        student.studentId = newStudentId;
        student.admissionStatus = 'Approved';

        // 2. Parent Account Creation or Linkage logic (requires mobile passed or found in inquiry if linked)
        let parentAccount = await User.findOne({ mobileNumber: req.body.parentMobile, role: 'Parent' }).session(session);

        if (!parentAccount) {
            parentAccount = new User({
                mobileNumber: req.body.parentMobile,
                role: 'Parent',
                name: req.body.parentName || 'Parent / Guardian'
            });
            await parentAccount.save({ session });
        }
        student.parentAccountId = parentAccount._id;
        await student.save({ session });

        // 3. Generate First Fee Invoice
        const feeTerm = `Admission - ${new Date().getFullYear()}`;
        const baseFee = 5000; // Mock base fee, can be derived from class

        await FeeRecord.create([{
            studentId: newStudentId,
            feeTerm,
            totalAmount: baseFee,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
            status: 'Pending'
        }], { session });

        // 4. SMS Mock
        console.log(`[SMS MOCK] Welcome! Admission confirmed. Student ID: ${newStudentId}. Please login.`);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            status: 'success',
            message: 'Admission Approved Successfully',
            studentId: newStudentId
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ status: 'error', message: error.message });
    }
};
