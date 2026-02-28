import Attendance from '../models/Attendance.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Classes from '../models/Classes.js';
import Subject from '../models/Subject.js';
import Student from '../models/Student.js';

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

// @desc    Get Teacher Dashboard Schedule
// @route   GET /api/academic/teacher/dashboard
// @access  Private (Teacher)
export const getTeacherDashboard = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const classes = await Classes.find({ classTeacher: teacherId, isDeleted: false });

        const scheduleData = await Promise.all(classes.map(async (cls) => {
            const studentCount = await Student.countDocuments({ currentClass: cls._id, isDeleted: false });

            // Check if attendance is submitted for today
            const today = new Date().setHours(0, 0, 0, 0);
            const attendance = await Attendance.findOne({ date: today, classId: cls._id, isDeleted: false });

            return {
                id: cls._id,
                name: `${cls.className} - ${cls.section}`,
                subject: 'Class Teacher', // Extend later for specific subjects
                students: studentCount,
                attendanceDone: !!attendance
            };
        }));

        res.status(200).json({ status: 'success', data: scheduleData });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get Teacher Roster for Attendance
// @route   GET /api/academic/teacher/roster/:classId
// @access  Private (Teacher)
export const getTeacherRoster = async (req, res) => {
    try {
        const { classId } = req.params;
        const cls = await Classes.findOne({ _id: classId, classTeacher: req.user._id, isDeleted: false });

        if (!cls && req.user.role !== 'SuperAdmin') {
            return res.status(403).json({ status: 'error', message: 'Forbidden' });
        }

        const students = await Student.find({ currentClass: classId, isDeleted: false })
            .select('studentId firstName lastName profilePic')
            .sort({ firstName: 1 });

        const formattedAuth = students.map(s => ({
            _id: s._id,
            id: s.studentId,
            name: `${s.firstName} ${s.lastName}`,
            isPresent: true // default for UI state
        }));

        res.status(200).json({
            status: 'success',
            data: {
                className: `${cls.className} - ${cls.section}`,
                students: formattedAuth
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get All Classes
// @route   GET /api/academic/classes
// @access  Private (SuperAdmin, Clerk, Teacher)
export const getAllClasses = async (req, res) => {
    try {
        const classes = await Classes.find({ isDeleted: false }).populate('classTeacher', 'name');

        // Let's get student counts per class
        const classData = await Promise.all(classes.map(async (cls) => {
            const studentCount = await Student.countDocuments({ currentClass: cls._id, isDeleted: false });
            return {
                id: cls._id,
                name: `${cls.className} - ${cls.section}`,
                teacher: cls.classTeacher ? cls.classTeacher.name : 'Unassigned',
                students: studentCount,
                status: cls.isDeleted ? 'Inactive' : 'Active'
            };
        }));

        res.status(200).json({ status: 'success', data: classData });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create Class
// @route   POST /api/academic/classes
// @access  Private (SuperAdmin)
export const createClass = async (req, res) => {
    try {
        const { className, section } = req.body;
        const newClass = await Classes.create({ className, section });
        res.status(201).json({ status: 'success', data: newClass });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get All Subjects
// @route   GET /api/academic/subjects
// @access  Private (SuperAdmin, Clerk, Teacher)
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ isDeleted: false });
        // Format for frontend
        const subjectData = subjects.map(sub => ({
            id: sub._id,
            name: sub.name,
            code: sub.code,
            type: sub.type,
            classes: sub.classes || 'All'
        }));
        res.status(200).json({ status: 'success', data: subjectData });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create Subject
// @route   POST /api/academic/subjects
// @access  Private (SuperAdmin)
export const createSubject = async (req, res) => {
    try {
        const { name, code, type, classes } = req.body;
        const newSubject = await Subject.create({ name, code, type, classes });
        res.status(201).json({ status: 'success', data: newSubject });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
