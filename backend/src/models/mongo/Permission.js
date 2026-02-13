const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    scope: {
        type: String,
        enum: ['student', 'course'],
        required: true
    },
    // If scope is 'student', targetId is the student's _id or 'all' (if blocking whole section, backend logic handles this)
    // Actually, for better query performance, let's keep it specific.
    // Logic: If blocking a section, we might create individual records OR a single record with targetId='SECTION_ID'.
    // Better Approach for this system:
    // 1. Block Student: scope='student', targetId=student._id
    // 2. Block Section (Student View): scope='student_section', targetId=sectionIdentifier (e.g., "CSE-A")
    // 3. Block Course (for Section): scope='course_section', targetId=courseId, section=sectionIdentifier

    // Simpler Approach matching user request:
    // - Individual student block: scope='student', targetId=studentId
    // - Whole section block: scope='section', targetId=sectionIdentifier (e.g. "CSE-3-A")
    // - Course block: scope='course', targetId=courseId, section=sectionIdentifier

    scope: {
        type: String,
        enum: ['student', 'section', 'course'],
        required: true
    },

    targetId: { type: String, required: true }, // studentId, section string, or courseId

    // Additional Context for faster querying
    branch: { type: String }, // e.g., "CSE"
    section: { type: String }, // e.g., "A"
    semester: { type: Number }, // e.g., 5

    // What is blocked?
    blockedFeatures: [{
        type: String,
        enum: [
            'learning',
            'tests',
            'assignments',
            'reports',
            'content', // Course content
            'ppts',
            'pyqs',
            'dashboard' // Entire panel
        ]
    }],

    reason: { type: String },

    blockedBy: { type: String, required: true }, // Faculty ID

    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active'
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for fast lookup during student login/navigation
// Student lookup: find({ scope: 'student', targetId: myId, status: 'active' })
// Section lookup: find({ scope: 'section', targetId: mySection, status: 'active' })
// Course lookup: find({ scope: 'course', targetId: courseId, section: mySection, status: 'active' })
PermissionSchema.index({ scope: 1, targetId: 1, status: 1 });
PermissionSchema.index({ branch: 1, section: 1, status: 1 });

module.exports = mongoose.model('Permission', PermissionSchema);
