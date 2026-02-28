import Attendance from '../models/Attendance.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';

// @desc    Submit Attendance (Upsert)
// @route   POST /api/academic/attendance
// @access  Private (Teacher)
export const submitAttendance = async (req, res) => {
    try {
        const { classId, date, absenteeIds } = req.body;

        // Constraint logic check: is teacher assigned to this class?
        if (req.user.role === 'Teacher' && req.user.assignedClass.toString() !== classId) {
            return res.status(403).json({ status: 'error', message: 'Forbidden: Mismatch assigned class' });
        }

        const attendanceDate = new Date(date).setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOneAndUpdate(
            { date: attendanceDate, classId },
            { absentees: absenteeIds, submittedBy: req.user._id, isDeleted: false },
            { new: true, upsert: true }
        );

        res.status(200).json({ status: 'success', data: attendance });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Request Leave
// @route   POST /api/academic/leave-request
// @access  Private (Parent)
export const leaveRequest = async (req, res) => {
    res.status(201).json({ status: 'success', message: 'Leave request submitted (mock)' });
};

// @desc    Approve Leave
// @route   PUT /api/academic/leave-approve/:id
// @access  Private (SuperAdmin)
export const leaveApprove = async (req, res) => {
    // Upsert into Attendance `approvedLeaves` array
    res.status(200).json({ status: 'success', message: 'Leave approved (mock)' });
};

// @desc    Bulk SMS Trigger
// @route   POST /api/academic/attendance/send-sms
// @access  Private (Teacher)
export const sendSMS = async (req, res) => {
    const { selectedAbsenteeIds } = req.body;
    console.log(`[SMS MOCK] Dispatching absence alert to ${selectedAbsenteeIds.length} parents.`);
    res.status(200).json({ status: 'success', message: 'SMS Dispatched' });
};

// @desc    Enter Marks
// @route   POST /api/academic/marks
// @access  Private (Teacher)
export const enterMarks = async (req, res) => {
    res.status(201).json({ status: 'success', message: 'Marks entered. Default hidden.' });
};

// @desc    Publish Results
// @route   PUT /api/academic/exams/publish/:examId
// @access  Private (SuperAdmin)
export const publishResults = async (req, res) => {
    await Exam.findByIdAndUpdate(req.params.examId, { isPublished: true });
    res.status(200).json({ status: 'success', message: 'Results published to public portal' });
};

// @desc    Fetch Public Results
// @route   POST /api/public/results
// @access  Public
export const fetchPublicResults = async (req, res) => {
    const { studentId, dob } = req.body;
    // Logic: fetch exams where isPublished=true AND student matches dob
    res.status(200).json({ status: 'success', message: 'Results returned' });
};
