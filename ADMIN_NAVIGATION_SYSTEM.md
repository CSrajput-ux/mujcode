# Admin Panel Navigation System - Complete Documentation

## 📋 Permission Matrix

| Module | Feature | Permission Key | HTTP Method | API Endpoint | Role Access |
|--------|---------|---------------|-------------|--------------|-------------|
| **Dashboard** | View Dashboard | `admin.dashboard.view` | GET | `/api/admin/dashboard` | Admin |
| **User Management** | View Users | `user.view` | GET | `/api/admin/users` | Admin |
| | Bulk Student Upload | `user.create.bulk` | POST | `/api/admin/students/bulk-upload` | Admin |
| | Manage Students | `user.student.manage` | CRUD | `/api/admin/students` | Admin |
| | Faculty Assignment | `faculty.assign` | POST | `/api/admin/faculty/assign` | Admin |
| | Manage Faculty | `user.faculty.manage` | CRUD | `/api/admin/faculty` | Admin |
| | Manage Companies | `company.manage` | CRUD | `/api/admin/companies` | Admin |
| **Content Management** | View Content | `content.view` | GET | `/api/admin/content` | Admin |
| | Approve Questions | `question.approve` | PATCH | `/api/admin/questions/approve` | Admin |
| | Manage Courses | `course.manage` | CRUD | `/api/admin/courses` | Admin |
| | Configure Syllabus | `syllabus.configure` | CRUD | `/api/admin/syllabus` | Admin |
| | Manage Problems | `problem.manage` | CRUD | `/api/admin/problems` | Admin |
| **Placement** | View Placements | `placement.view` | GET | `/api/admin/placement` | Admin |
| | Monitor Drives | `placement.drive.view` | GET | `/api/admin/placement/drives` | Admin |
| | Manage Criteria | `placement.criteria.manage` | CRUD | `/api/admin/placement/eligibility` | Admin |
| | Manage Offers | `placement.offer.manage` | CRUD | `/api/admin/placement/offers` | Admin |
| | View Analytics | `placement.analytics.view` | GET | `/api/admin/placement/analytics` | Admin |
| **Assessments** | View Assessments | `assessment.view` | GET | `/api/admin/assessments` | Admin |
| | Manage Tests | `assessment.manage` | CRUD | `/api/admin/tests` | Admin |
| | Manage Assignments | `assignment.manage` | CRUD | `/api/admin/assignments` | Admin |
| | View Proctoring | `proctoring.view` | GET | `/api/admin/proctoring/logs` | Admin |
| **Analytics** | View Analytics | `analytics.view` | GET | `/api/admin/analytics` | Admin |
| | Student Analytics | `analytics.student.view` | GET | `/api/admin/analytics/students` | Admin |
| | Faculty Analytics | `analytics.faculty.view` | GET | `/api/admin/analytics/faculty` | Admin |
| | Platform Analytics | `analytics.platform.view` | GET | `/api/admin/analytics/platform` | Admin |
| **System** | View System | `system.view` | GET | `/api/admin/system` | Admin |
| | Manage Roles | `role.manage` | CRUD | `/api/admin/roles` | Admin (Super) |
| | View Audit Logs | `logs.view` | GET | `/api/admin/audit-logs` | Admin (Super) |
| | Configure System | `system.configure` | PATCH | `/api/admin/settings` | Admin (Super) |
| | Manage Database | `system.database.manage` | GET/POST | `/api/admin/database/*` | Admin (Super) |
| **Quick Actions** | Create Announcement | `announcement.create` | POST | `/api/admin/announcements` | Admin |
| | Emergency Alert | `alert.emergency` | POST | `/api/admin/alerts/emergency` | Admin (Super) |

---

## 🗺️ Complete Route Map

### Frontend Routes (React Router)

```typescript
/admin
├── /dashboard                          [admin.dashboard.view]
├── /users
│   ├── /students
│   │   ├── /                          [user.student.manage]
│   │   └── /bulk-upload               [user.create.bulk]
│   ├── /faculty
│   │   ├── /                          [user.faculty.manage]
│   │   └── /assign                    [faculty.assign]
│   └── /companies                     [company.manage]
├── /content
│   ├── /questions
│   │   └── /approval                  [question.approve]
│   ├── /courses                       [course.manage]
│   ├── /syllabus                      [syllabus.configure]
│   └── /problems                      [problem.manage]
├── /placement
│   ├── /drives                        [placement.drive.view]
│   ├── /eligibility                   [placement.criteria.manage]
│   ├── /offers                        [placement.offer.manage]
│   └── /analytics                     [placement.analytics.view]
├── /assessments
│   ├── /tests                         [assessment.manage]
│   ├── /assignments                   [assignment.manage]
│   └── /proctoring                    [proctoring.view]
├── /analytics
│   ├── /students                      [analytics.student.view]
│   ├── /faculty                       [analytics.faculty.view]
│   └── /platform                      [analytics.platform.view]
├── /system
│   ├── /roles                         [role.manage]
│   ├── /audit-logs                    [logs.view]
│   ├── /settings                      [system.configure]
│   └── /database                      [system.database.manage]
├── /announcements
│   └── /create                        [announcement.create]
└── /alerts
    └── /emergency                     [alert.emergency]
```

### Backend API Routes

```
/api/admin
├── /dashboard                         GET
├── /students
│   ├── /                              GET, POST, PUT, DELETE
│   ├── /bulk-upload                   POST (multipart/form-data)
│   └── /pending-count                 GET (badge)
├── /faculty
│   ├── /                              GET, POST, PUT, DELETE
│   └── /assign                        POST
├── /companies                         GET, POST, PUT, DELETE
├── /questions
│   ├── /pending                       GET
│   ├── /pending-count                 GET (badge)
│   └── /approve                       PATCH
├── /courses                           GET, POST, PUT, DELETE
├── /syllabus                          GET, POST, PUT, DELETE
├── /problems                          GET, POST, PUT, DELETE
├── /placement
│   ├── /drives
│   │   ├── /                          GET, POST, PUT, DELETE
│   │   └── /live-count                GET (badge)
│   ├── /eligibility                   GET, POST, PUT, DELETE
│   ├── /offers                        GET, POST, PUT, DELETE
│   └── /analytics                     GET
├── /tests                             GET, POST, PUT, DELETE
├── /assignments                       GET, POST, PUT, DELETE
├── /proctoring
│   ├── /logs                          GET
│   └── /violations-count              GET (badge)
├── /analytics
│   ├── /students                      GET
│   ├── /faculty                       GET
│   └── /platform                      GET
├── /roles                             GET, POST, PUT, DELETE
├── /audit-logs                        GET
├── /settings                          GET, PATCH
├── /database
│   ├── /status                        GET
│   ├── /backup                        POST
│   └── /export                        POST
├── /announcements                     POST
└── /alerts
    └── /emergency                     POST
```

---

## 🔧 Backend Integration Guide

### 1. Permission Middleware

Create a permission checking middleware:

```javascript
// backend/src/shared/middlewares/checkPermission.js

const checkPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // From auth middleware
      
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user permissions from database
      const userPermissions = await getUserPermissions(user.id);

      // Check if user has at least one of the required permissions
      const hasPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Insufficient permissions',
          required: requiredPermissions
        });
      }

      req.userPermissions = userPermissions;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

module.exports = checkPermission;
```

### 2. Route Implementation Example

```javascript
// backend/src/domains/admin/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../shared/middlewares/authMiddleware');
const checkPermission = require('../../../shared/middlewares/checkPermission');
const studentController = require('../controllers/studentController');

// Bulk upload students
router.post(
  '/bulk-upload',
  authMiddleware,
  checkPermission(['user.create.bulk']),
  studentController.bulkUpload
);

// Get all students
router.get(
  '/',
  authMiddleware,
  checkPermission(['user.student.manage']),
  studentController.getAllStudents
);

// Get pending count (for badge)
router.get(
  '/pending-count',
  authMiddleware,
  checkPermission(['user.student.manage']),
  studentController.getPendingCount
);

module.exports = router;
```

### 3. Permission Database Schema

```javascript
// MongoDB Schema for Permissions

const PermissionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  description: String,
  module: String, // 'user', 'content', 'placement', etc.
  category: String
});

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    type: String, // Permission keys
    ref: 'Permission'
  }],
  isSystemRole: {
    type: Boolean,
    default: false
  }
});

// PostgreSQL - Add to User model
const User = sequelize.define('User', {
  // ... existing fields
  roleId: {
    type: DataTypes.UUID,
    references: { model: 'Roles', key: 'id' }
  }
});
```

### 4. Seed Default Permissions

```javascript
// backend/src/scripts/seedPermissions.js

const permissions = [
  { key: 'admin.dashboard.view', name: 'View Dashboard', module: 'dashboard' },
  { key: 'user.create.bulk', name: 'Bulk Create Users', module: 'user' },
  { key: 'user.student.manage', name: 'Manage Students', module: 'user' },
  // ... all permissions from matrix
];

const roles = [
  {
    name: 'SUPER_ADMIN',
    permissions: permissions.map(p => p.key), // All permissions
    isSystemRole: true
  },
  {
    name: 'ADMIN',
    permissions: [
      'admin.dashboard.view',
      'user.view',
      'user.student.manage',
      // ... admin permissions (excluding system.database.manage)
    ],
    isSystemRole: true
  }
];
```

### 5. Frontend Permission Check (React Hook)

```typescript
// frontend/src/shared/hooks/usePermissions.ts

import { useAuth } from './useAuth';
import { PermissionKey } from '../types/admin-sidebar.types';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (requiredPermissions: PermissionKey[]): boolean => {
    if (!user || !user.permissions) return false;
    
    return requiredPermissions.some(permission =>
      user.permissions.includes(permission)
    );
  };

  const hasAllPermissions = (requiredPermissions: PermissionKey[]): boolean => {
    if (!user || !user.permissions) return false;
    
    return requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );
  };

  return { hasPermission, hasAllPermissions, permissions: user?.permissions || [] };
}
```

---

## 🎨 Frontend Implementation Notes

### 1. Sidebar Component Structure

```
AdminLayout/
├── AdminSidebar.tsx           # Main sidebar component
├── SidebarSection.tsx         # Collapsible section
├── SidebarItem.tsx            # Individual menu item
├── SidebarBadge.tsx           # Notification badge
└── QuickActions.tsx           # Quick action buttons
```

### 2. State Management

Use React Context or Zustand for:
- User permissions
- Sidebar collapsed state
- Badge counts (real-time updates)
- Active route tracking

### 3. Badge Real-time Updates

```typescript
// Use polling or WebSocket for live updates
useEffect(() => {
  const interval = setInterval(async () => {
    const badgeData = await fetchBadgeData(sidebar.sections);
    setBadges(badgeData);
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, []);
```

### 4. Route Protection

```typescript
// ProtectedRoute.tsx
const ProtectedRoute = ({ permissions, children }) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permissions)) {
    return <Navigate to="/admin/unauthorized" />;
  }
  
  return children;
};
```

---

## 🚀 Implementation Checklist

### Backend
- [ ] Create Permission model (MongoDB)
- [ ] Create Role model with permission references
- [ ] Implement `checkPermission` middleware
- [ ] Seed default permissions
- [ ] Create SUPER_ADMIN role with all permissions
- [ ] Add permission routes to all admin endpoints
- [ ] Implement badge count endpoints
- [ ] Add audit logging for admin actions

### Frontend
- [ ] Create TypeScript types
- [ ] Implement sidebar config
- [ ] Create reusable sidebar components
- [ ] Implement permission-based filtering
- [ ] Add route protection
- [ ] Implement badge polling/WebSocket
- [ ] Add active route highlighting
- [ ] Implement collapsible sections
- [ ] Add dark mode support
- [ ] Create mobile responsive version

### Testing
- [ ] Test permission middleware
- [ ] Test role-based access
- [ ] Test sidebar rendering for different roles
- [ ] Test badge updates
- [ ] Test route protection
- [ ] Test audit logging

---

## 📊 Future Enhancements

1. **Dynamic Permission Loading**: Load permissions from database instead of hardcoded
2. **Permission Dependencies**: Some permissions require others
3. **Time-based Permissions**: Permissions valid only during certain hours
4. **IP-based Restrictions**: Geo-restrict certain admin actions
5. **Two-Factor for Sensitive Actions**: Require 2FA for database operations
6. **Action Approval Workflow**: Multi-level approval for critical changes
7. **Custom Roles**: Allow creating custom roles beyond system roles

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-08  
**Maintained By**: MujCode Platform Team
