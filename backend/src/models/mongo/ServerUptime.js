const mongoose = require('mongoose');

const serverUptimeSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    restartEvents: [{
        timestamp: {
            type: Date,
            required: true
        },
        reason: {
            type: String,
            default: 'Unknown'
        },
        duration: {
            type: Number,  // Duration of downtime in milliseconds
            default: 0
        }
    }],
    totalDowntime: {
        type: Number,
        default: 0  // Cumulative downtime in milliseconds
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Singleton pattern - only one uptime record should exist
serverUptimeSchema.statics.getInstance = async function () {
    let instance = await this.findOne();
    if (!instance) {
        instance = await this.create({
            startTime: new Date(),
            restartEvents: [],
            totalDowntime: 0
        });
    }
    return instance;
};

// Calculate uptime percentage
serverUptimeSchema.methods.calculateUptime = function () {
    const now = Date.now();
    const totalTime = now - this.startTime.getTime();

    if (totalTime === 0) return 100;

    const uptimeMs = totalTime - this.totalDowntime;
    const percentage = (uptimeMs / totalTime) * 100;

    return Math.min(100, Math.max(0, percentage));
};

const ServerUptime = mongoose.model('ServerUptime', serverUptimeSchema);

module.exports = ServerUptime;
