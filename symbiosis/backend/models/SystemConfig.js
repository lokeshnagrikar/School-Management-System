const mongoose = require('mongoose');

const systemConfigSchema = mongoose.Schema({
    schoolName: { type: String, default: 'ISBM School' },
    address: { type: String, default: 'Education City' },
    contactEmail: { type: String, default: 'info@isbm.com' },
    contactPhone: { type: String, default: '+91 98765 43210' },
    currentAcademicYear: { type: String, default: '2025-2026' },
    maintenanceMode: { type: Boolean, default: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
