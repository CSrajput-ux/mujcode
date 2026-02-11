// ==================================================
// SEED PERMISSIONS & ROLES
// Run: node src/scripts/seedPermissions.js
// ==================================================

const mongoose = require('mongoose');
require('dotenv').config();

// Permission Model
const permissionSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    description: String,
    module: String,
    category: String
});

const Permission = mongoose.model('Permission', permissionSchema);

// Role Model
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [String],
    isSystemRole: {
        type: Boolean,
        default: false
    },
    description: String
});

const Role = mongoose.model('Role', roleSchema);

// All Permissions
const permissions = [
    // Dashboard
    { key: 'admin.dashboard.view', name: 'View Dashboard', module: 'dashboard', category: 'view' },

    // User Management
    { key: 'user.view', name: 'View Users', module: 'user', category: 'view' },
    { key: 'user.create.bulk', name: 'Bulk Create Users', module: 'user', category: 'create' },
    { key: 'user.student.manage', name: 'Manage Students', module: 'user', category: 'manage' },
    { key: 'user.faculty.manage', name: 'Manage Faculty', module: 'user', category: 'manage' },
    { key: 'faculty.assign', name: 'Assign Faculty to Courses', module: 'user', category: 'assign' },
    { key: 'company.manage', name: 'Manage Companies', module: 'user', category: 'manage' },

    // Content Management
    { key: 'content.view', name: 'View Content', module: 'content', category: 'view' },
    { key: 'question.approve', name: 'Approve Questions', module: 'content', category: 'approve' },
    { key: 'course.manage', name: 'Manage Courses', module: 'content', category: 'manage' },
    { key: 'syllabus.configure', name: 'Configure Syllabus', module: 'content', category: 'configure' },
    { key: 'problem.manage', name: 'Manage Problems', module: 'content', category: 'manage' },

    // Placement
    { key: 'placement.view', name: 'View Placement', module: 'placement', category: 'view' },
    { key: 'placement.drive.view', name: 'View Drives', module: 'placement', category: 'view' },
    { key: 'placement.criteria.manage', name: 'Manage Eligibility Criteria', module: 'placement', category: 'manage' },
    { key: 'placement.offer.manage', name: 'Manage Offers', module: 'placement', category: 'manage' },
    { key: 'placement.analytics.view', name: 'View Placement Analytics', module: 'placement', category: 'view' },

    // Assessments
    { key: 'assessment.view', name: 'View Assessments', module: 'assessment', category: 'view' },
    { key: 'assessment.manage', name: 'Manage Tests', module: 'assessment', category: 'manage' },
    { key: 'assignment.manage', name: 'Manage Assignments', module: 'assessment', category: 'manage' },
    { key: 'proctoring.view', name: 'View Proctoring Logs', module: 'assessment', category: 'view' },

    // Analytics
    { key: 'analytics.view', name: 'View Analytics', module: 'analytics', category: 'view' },
    { key: 'analytics.student.view', name: 'View Student Analytics', module: 'analytics', category: 'view' },
    { key: 'analytics.faculty.view', name: 'View Faculty Analytics', module: 'analytics', category: 'view' },
    { key: 'analytics.platform.view', name: 'View Platform Analytics', module: 'analytics', category: 'view' },

    // System
    { key: 'system.view', name: 'View System Settings', module: 'system', category: 'view' },
    { key: 'role.manage', name: 'Manage Roles & Permissions', module: 'system', category: 'manage' },
    { key: 'logs.view', name: 'View Audit Logs', module: 'system', category: 'view' },
    { key: 'system.configure', name: 'Configure System', module: 'system', category: 'configure' },
    { key: 'system.database.manage', name: 'Manage Database', module: 'system', category: 'manage' },

    // Quick Actions
    { key: 'announcement.create', name: 'Create Announcements', module: 'announcement', category: 'create' },
    { key: 'alert.emergency', name: 'Send Emergency Alerts', module: 'alert', category: 'create' }
];

// Roles
const roles = [
    {
        name: 'SUPER_ADMIN',
        description: 'Full system access including database management',
        permissions: permissions.map(p => p.key), // All permissions
        isSystemRole: true
    },
    {
        name: 'ADMIN',
        description: 'Full admin access except database management',
        permissions: permissions
            .filter(p => !p.key.includes('system.database'))
            .map(p => p.key),
        isSystemRole: true
    },
    {
        name: 'CONTENT_ADMIN',
        description: 'Manage content, courses, and questions',
        permissions: [
            'admin.dashboard.view',
            'content.view',
            'question.approve',
            'course.manage',
            'syllabus.configure',
            'problem.manage',
            'analytics.view'
        ],
        isSystemRole: true
    },
    {
        name: 'PLACEMENT_COORDINATOR',
        description: 'Manage placement drives and company relations',
        permissions: [
            'admin.dashboard.view',
            'company.manage',
            'placement.view',
            'placement.drive.view',
            'placement.criteria.manage',
            'placement.offer.manage',
            'placement.analytics.view',
            'analytics.view'
        ],
        isSystemRole: true
    }
];

async function seedPermissionsAndRoles() {
    try {
        // Connect to MongoDB
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing
        await Permission.deleteMany({});
        await Role.deleteMany({});
        console.log('🗑️  Cleared existing permissions and roles');

        // Insert permissions
        await Permission.insertMany(permissions);
        console.log(`✅ Created ${permissions.length} permissions`);

        // Insert roles
        await Role.insertMany(roles);
        console.log(`✅ Created ${roles.length} roles`);

        console.log('\n📊 Permissions by Module:');
        const modules = [...new Set(permissions.map(p => p.module))];
        modules.forEach(module => {
            const count = permissions.filter(p => p.module === module).length;
            console.log(`  ${module}: ${count} permissions`);
        });

        console.log('\n👥 Roles Created:');
        roles.forEach(role => {
            console.log(`  ${role.name}: ${role.permissions.length} permissions`);
        });

        console.log('\n🎉 Seeding complete!');
        console.log('\n📝 Next Steps:');
        console.log('1. Assign SUPER_ADMIN role to admin user');
        console.log('2. Update User model to include roleId reference');
        console.log('3. Implement checkPermission middleware');
        console.log('4. Add permission checks to admin routes');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding permissions:', error);
        process.exit(1);
    }
}

seedPermissionsAndRoles();
