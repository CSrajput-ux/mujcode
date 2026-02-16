const { AdministrativeRole, RoleAssignment } = require('../../../models/pg/AdminModule');
const { User, Department } = require('../../../models/pg/index');
const { Op } = require('sequelize');

// Get All Defined Roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await AdministrativeRole.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Assign Role to User
exports.assignRole = async (req, res) => {
    try {
        const { userId, roleId, scopeType, scopeId } = req.body;

        // Validation: Check if User exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if Role exists
        const role = await AdministrativeRole.findByPk(roleId);
        if (!role) return res.status(404).json({ message: "Role not found" });

        // Check if assignment exists
        const existing = await RoleAssignment.findOne({
            where: { userId, roleId, scopeType: scopeType || 'University', scopeId: scopeId || null }
        });

        if (existing) {
            return res.status(400).json({ message: "Role already assigned to user with this scope" });
        }

        const assignment = await RoleAssignment.create({
            userId,
            roleId,
            scopeType: scopeType || 'University',
            scopeId: scopeId || null,
            assignedBy: req.user.id
        });

        res.status(201).json({ message: "Role assigned", assignment });
    } catch (error) {
        console.error("Assign Role Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Assignments (Who has what role?)
exports.getRoleAssignments = async (req, res) => {
    try {
        const assignments = await RoleAssignment.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: AdministrativeRole }
            ]
        });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
