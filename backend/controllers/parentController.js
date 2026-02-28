import User from '../models/User.js';
import Student from '../models/Student.js';
import FeeRecord from '../models/FeeRecord.js';
import Attendance from '../models/Attendance.js';

// @desc    Get Parent Dashboard Data
// @route   GET /api/parents/dashboard
// @access  Private (Parent)
export const getParentDashboard = async (req, res) => {
    try {
        const parentId = req.user._id;
        const parent = await User.findById(parentId).populate({
            path: 'linkedStudent',
            populate: { path: 'currentClass', select: 'className section' }
        });

        if (!parent || !parent.linkedStudent) {
            return res.status(404).json({ status: 'error', message: 'No linked student found for this parent account' });
        }

        const student = parent.linkedStudent;

        // 1. Fetch pending fees
        const pendingFee = await FeeRecord.findOne({
            studentId: student.studentId,
            status: 'Pending',
            isDeleted: false
        }).sort({ createdAt: -1 });

        // 2. We can also summarize attendance here (e.g. today's status)
        const today = new Date().setHours(0, 0, 0, 0);
        const todaysAttendance = await Attendance.findOne({ date: today, classId: student.currentClass?._id, isDeleted: false });

        let isPresentToday = true;
        if (todaysAttendance && todaysAttendance.absentees.includes(student._id)) {
            isPresentToday = false;
        }

        res.status(200).json({
            status: 'success',
            data: {
                student: {
                    name: `${student.firstName} ${student.lastName}`,
                    className: student.currentClass ? `${student.currentClass.className} - ${student.currentClass.section}` : 'N/A',
                    rollNo: student.studentId,
                    isPresentToday
                },
                pendingFee: pendingFee ? {
                    amount: pendingFee.totalAmount,
                    dueFor: pendingFee.feeTerm
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get Parent Fees History
// @route   GET /api/parents/fees
// @access  Private (Parent)
export const getParentFees = async (req, res) => {
    try {
        const parentId = req.user._id;
        const parent = await User.findById(parentId).populate('linkedStudent');

        if (!parent || !parent.linkedStudent) {
            return res.status(404).json({ status: 'error', message: 'No linked student found' });
        }

        const fees = await FeeRecord.find({
            studentId: parent.linkedStudent.studentId,
            isDeleted: false
        }).sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', data: fees });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
