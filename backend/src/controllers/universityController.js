const {
    Department,
    Program,
    Branch,
    Subject,
    Section,
    AcademicYear
} = require('../models/pg/UniversityStructure');
const { StudentEnrollment } = require('../models/pg/UniversityAssociations');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get all Faculties (Derived from Departments)
exports.getFaculties = async (req, res) => {
    try {
        // Since we don't have a Faculty model table (it's a string grouping in Dept),
        // we fetch distinct facultyNames from Department.
        const departments = await Department.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('facultyName')), 'facultyName']]
        });
        const faculties = departments.map(d => d.facultyName).filter(f => f);
        res.json(faculties);
    } catch (error) {
        console.error("Get Faculties Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Departments
exports.getDepartments = async (req, res) => {
    try {
        const { faculty } = req.query;
        const where = {};
        if (faculty) where.facultyName = faculty;

        const departments = await Department.findAll({ where });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Programs by Department
exports.getPrograms = async (req, res) => {
    try {
        const { deptId } = req.query;
        const where = {};
        if (deptId) where.departmentId = deptId;

        const programs = await Program.findAll({ where });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Branches by Program
exports.getBranches = async (req, res) => {
    try {
        const { progId } = req.query;
        const where = {};
        if (progId) where.programId = progId;

        const branches = await Branch.findAll({ where });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Subjects 
// Filters: branchId (required), semester (optional)
exports.getSubjects = async (req, res) => {
    try {
        const { branchId, semester } = req.query;

        if (!branchId) {
            return res.status(400).json({ message: "branchId is required" });
        }

        const where = { branchId };
        if (semester) where.semester = semester;

        const subjects = await Subject.findAll({ where });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// Get Sections by Branch
exports.getSections = async (req, res) => {
    try {
        const { branchId } = req.query;
        const where = {};
        if (branchId) where.branchId = branchId;

        const sections = await Section.findAll({ where });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Academic Years
exports.getAcademicYears = async (req, res) => {
    try {
        const years = await AcademicYear.findAll();
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
