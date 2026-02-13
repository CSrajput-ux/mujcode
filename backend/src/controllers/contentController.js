const Content = require('../models/mongo/Content');
const path = require('path');
const fs = require('fs');

// Upload Content
exports.uploadContent = async (req, res) => {
    try {
        const { title, description, type, subject, branch, semester } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newContent = new Content({
            contentId: `CONT-${Date.now()}`,
            title,
            description,
            type,
            subject,
            branch,
            semester,
            fileUrl: `/uploads/${req.file.filename}`,
            fileType: path.extname(req.file.originalname).substring(1),
            uploadedBy: req.user.id // From auth middleware
        });

        await newContent.save();
        res.status(201).json({ message: 'Content uploaded successfully', content: newContent });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Server error during upload' });
    }
};

// Get Content (Filtered)
exports.getContent = async (req, res) => {
    try {
        const { branch, semester, subject, type } = req.query;
        const query = {};

        if (branch) query.branch = branch;
        if (semester) query.semester = semester;
        if (subject) query.subject = subject;
        if (type) query.type = type;

        const content = await Content.find(query).sort({ createdAt: -1 });
        res.status(200).json(content);

    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ error: 'Server error fetching content' });
    }
};

// Delete Content
exports.deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Content.findById(id);

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        // Verify ownership (Faculty can only delete their own uploads)
        if (content.uploadedBy !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to delete this content' });
        }

        // Delete file from filesystem
        const filePath = path.join(__dirname, '../../', content.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Content.findByIdAndDelete(id);
        res.status(200).json({ message: 'Content deleted successfully' });

    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ error: 'Server error during deletion' });
    }
};
