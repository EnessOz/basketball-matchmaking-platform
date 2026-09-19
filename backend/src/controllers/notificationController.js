const Notification = require("../models/Notification");
const Match = require("../models/Match");
const User = require("../models/User");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.userId,
    })
      .populate("sender", "username")
      .populate("match")
      .populate("court", "name district")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Bildirimler alınamadı",
    });
  }
};

const getNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "notificationsMutedUntil"
    );

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const mutedUntil = user.notificationsMutedUntil;

    const isMuted =
      mutedUntil && new Date(mutedUntil) > new Date();

    res.json({
      isMuted: Boolean(isMuted),
      notificationsMutedUntil: isMuted
        ? mutedUntil
        : null,
    });
  } catch (error) {
    console.error(
      "Get notification settings error:",
      error
    );

    res.status(500).json({
      message: "Bildirim ayarları alınamadı",
    });
  }
};

const acceptNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Bildirim bulunamadı",
      });
    }

    if (notification.status !== "pending") {
      return res.status(400).json({
        message: "Bu bildirim daha önce cevaplandı",
      });
    }

    const match = await Match.findById(notification.match);

    if (!match) {
      return res.status(404).json({
        message: "Bu bildirime ait maç bulunamadı",
      });
    }

    if (match.createdBy.toString() === req.userId) {
      return res.status(400).json({
        message:
          "Kendi oluşturduğun maça bu bildirim üzerinden katılamazsın",
      });
    }

    const alreadyJoined = match.participants.some(
      (participantId) =>
        participantId.toString() === req.userId
    );

    if (!alreadyJoined) {
      match.participants.push(req.userId);
      await match.save();
    }

    notification.status = "accepted";
    notification.isRead = true;

    await notification.save();

    res.json({
      message: alreadyJoined
        ? "Zaten bu maça katılıyorsun"
        : "Maça katılım kabul edildi",
      notification,
      match,
    });
  } catch (error) {
    console.error("Accept notification error:", error);

    res.status(500).json({
      message: "Bildirim kabul edilemedi",
    });
  }
};

const rejectNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Bildirim bulunamadı",
      });
    }

    if (notification.status !== "pending") {
      return res.status(400).json({
        message: "Bu bildirim daha önce cevaplandı",
      });
    }

    notification.status = "rejected";
    notification.isRead = true;

    await notification.save();

    res.json({
      message: "Maç daveti reddedildi",
      notification,
    });
  } catch (error) {
    console.error("Reject notification error:", error);

    res.status(500).json({
      message: "Bildirim reddedilemedi",
    });
  }
};

const muteNotifications = async (req, res) => {
  try {
    const { duration } = req.body;

    const durations = {
      "1h": 1 * 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "12h": 12 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
    };

    if (!durations[duration]) {
      return res.status(400).json({
        message: "Geçersiz sessize alma süresi",
      });
    }

    const mutedUntil = new Date(
      Date.now() + durations[duration]
    );

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        notificationsMutedUntil: mutedUntil,
      },
      {
        new: true,
      }
    ).select("notificationsMutedUntil");

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json({
      message: "Bildirimler sessize alındı",
      notificationsMutedUntil:
        user.notificationsMutedUntil,
    });
  } catch (error) {
    console.error("Mute notifications error:", error);

    res.status(500).json({
      message: "Bildirimler sessize alınamadı",
    });
  }
};

const unmuteNotifications = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        notificationsMutedUntil: null,
      },
      {
        new: true,
      }
    ).select("notificationsMutedUntil");

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json({
      message: "Bildirimlerin sesi açıldı",
      notificationsMutedUntil: null,
    });
  } catch (error) {
    console.error("Unmute notifications error:", error);

    res.status(500).json({
      message: "Bildirimlerin sesi açılamadı",
    });
  }
};

module.exports = {
  getMyNotifications,
  getNotificationSettings,
  acceptNotification,
  rejectNotification,
  muteNotifications,
  unmuteNotifications,
};