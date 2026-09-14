import WeatherAlert from "../models/WeatherAlert.js";

// GET ALL ALERTS
export async function getAlerts(req, res) {
    try {
        const alerts = await WeatherAlert.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 });

        res.json({ alerts });
    } catch (e) {
        res.status(500).json({
            message: "Unable to load weather alerts",
        });
    }
}


// CREATE ALERT
export async function createAlert(req, res) {
    try {
        const {
            city,
            type,
            message,
            severity,
        } = req.body;

        if (!city || !type || !message) {
            return res.status(400).json({
                message: "City, alert type and message are required",
            });
        }

        const alert = await WeatherAlert.create({
            userId: req.user._id,
            city,
            type,
            message,
            severity: severity || "medium",
        });

        res.status(201).json({
            alert,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
}


// MARK ALERT AS READ
export async function markAlertRead(req, res) {
    try {
        const alert = await WeatherAlert.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

        if (!alert) {
            return res.status(404).json({
                message: "Alert not found",
            });
        }

        res.json({
            alert,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
}


// DELETE ONE ALERT
export async function deleteAlert(req, res) {
    try {
        await WeatherAlert.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        res.json({
            message: "Alert deleted",
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
}


// CLEAR ALL ALERTS
export async function clearAlerts(req, res) {
    try {
        await WeatherAlert.deleteMany({
            userId: req.user._id,
        });

        res.json({
            message: "All alerts cleared",
        });
    } catch (e) {
        res.status(500).json({
            message: "Unable to clear alerts",
        });
    }
}