const Match = require("../models/Match");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { getRankLimits } = require("../utils/rankUtils");

const MATCH_CREATION_COOLDOWN_MS = 60 * 1000;
const MATCH_DURATION_MINUTES = 90;

const getTurkeyDayRange = () => {
  const now = new Date();

  const turkeyDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const startOfDay = new Date(`${turkeyDate}T00:00:00+03:00`);
  const endOfDay = new Date(`${turkeyDate}T23:59:59.999+03:00`);

  return {
    startOfDay,
    endOfDay,
  };
};

// "18:30" gibi bir saati gece yarısından itibaren
// geçen toplam dakikaya çevirir.
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

// İki maçın 90 dakikalık zaman blokları çakışıyor mu?
const matchesOverlap = (firstTime, secondTime) => {
  const firstStart = timeToMinutes(firstTime);
  const firstEnd = firstStart + MATCH_DURATION_MINUTES;

  const secondStart = timeToMinutes(secondTime);
  const secondEnd = secondStart + MATCH_DURATION_MINUTES;

  return firstStart < secondEnd && secondStart < firstEnd;
};

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Maçlar alınamadı",
    });
  }
};

const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      createdBy: req.userId,
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Maçların alınamadı",
    });
  }
};

const getJoinedMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      participants: req.userId,
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Katıldığın maçlar alınamadı",
    });
  }
};

const createMatch = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const now = new Date();

    const creationHistory = user.matchCreationHistory || [];

    const rankPoints =
      typeof user.rankPoints === "number"
        ? user.rankPoints
        : 1000;

    const { dailyCreateLimit } = getRankLimits(rankPoints);

    if (dailyCreateLimit === 0) {
      return res.status(403).json({
        message:
          "Mevcut rank puanınla maç oluşturma hakkın bulunmuyor.",
      });
    }

    if (creationHistory.length > 0) {
      const lastCreation =
        creationHistory[creationHistory.length - 1];

      const timeSinceLastCreation =
        now.getTime() - new Date(lastCreation).getTime();

      if (timeSinceLastCreation < MATCH_CREATION_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil(
          (MATCH_CREATION_COOLDOWN_MS - timeSinceLastCreation) /
            1000
        );

        return res.status(429).json({
          message: `Yeni bir maç oluşturmak için ${remainingSeconds} saniye beklemelisin.`,
        });
      }
    }

    const { startOfDay, endOfDay } = getTurkeyDayRange();

    const todaysCreations = creationHistory.filter((date) => {
      const creationDate = new Date(date);

      return (
        creationDate >= startOfDay &&
        creationDate <= endOfDay
      );
    });

    if (todaysCreations.length >= dailyCreateLimit) {
      return res.status(429).json({
        message: `Bugün için maç oluşturma limitine ulaştın. Mevcut rank seviyende günde en fazla ${dailyCreateLimit} maç oluşturabilirsin.`,
      });
    }

    const newMatch = await Match.create({
      ...req.body,
      createdBy: req.userId,
      participants: [req.userId],
    });

    user.matchCreationHistory = [
      ...todaysCreations,
      now,
    ];

    await user.save();

    const usersToNotify = await User.find({
      _id: { $ne: req.userId },
      favoriteCourts: newMatch.courtId,
      $or: [
        {
          notificationsMutedUntil: null,
        },
        {
          notificationsMutedUntil: {
            $lte: now,
          },
        },
        {
          notificationsMutedUntil: {
            $exists: false,
          },
        },
      ],
    }).select("_id");

    if (usersToNotify.length > 0) {
      const notifications = usersToNotify.map(
        (userToNotify) => ({
          recipient: userToNotify._id,
          sender: req.userId,
          match: newMatch._id,
          court: newMatch.courtId,
          type: "favorite_court_match",
        })
      );

      await Notification.insertMany(notifications, {
        ordered: false,
      });
    }

    res.status(201).json(newMatch);
  } catch (error) {
    console.error("Create match error:", error);

    res.status(400).json({
      message: "Maç oluşturulamadı",
    });
  }
};

const joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (match.createdBy.toString() === req.userId) {
      return res.status(400).json({
        message: "Bu maçın sahibi sensin",
      });
    }

    const alreadyJoined = match.participants.some(
      (participantId) =>
        participantId.toString() === req.userId
    );

    if (alreadyJoined) {
      return res.status(400).json({
        message: "Bu maça zaten katıldın",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const rankPoints =
      typeof user.rankPoints === "number"
        ? user.rankPoints
        : 1000;

    const { dailyJoinLimit } = getRankLimits(rankPoints);

    // Hedef maçın oynanacağı gün kullanıcının dahil olduğu
    // bütün maçları getir.
    const matchesOnSameDay = await Match.find({
      date: match.date,
      participants: req.userId,
    });

    if (matchesOnSameDay.length >= dailyJoinLimit) {
      return res.status(429).json({
        message: `Bu tarih için maç katılım limitine ulaştın. Mevcut rank seviyende aynı gün en fazla ${dailyJoinLimit} maça katılabilirsin.`,
      });
    }

    // Kullanıcının o gün dahil olduğu maçlardan herhangi biri
    // hedef maçın 90 dakikalık zaman aralığıyla çakışıyor mu?
    const conflictingMatch = matchesOnSameDay.find(
      (existingMatch) =>
        matchesOverlap(existingMatch.time, match.time)
    );

    if (conflictingMatch) {
      return res.status(409).json({
        message: `Bu maç, zaten katıldığın ${conflictingMatch.time} başlangıç saatli maçın zaman aralığıyla çakışıyor. Her maç 90 dakika olarak hesaplanır.`,
      });
    }

    match.participants.push(req.userId);

    await match.save();

    res.json(match);
  } catch (error) {
    console.error("Join match error:", error);

    res.status(500).json({
      message: "Maça katılınamadı",
    });
  }
};

const leaveMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (match.createdBy.toString() === req.userId) {
      return res.status(400).json({
        message: "Kendi oluşturduğun maçtan ayrılamazsın",
      });
    }

    const participantIndex = match.participants.findIndex(
      (participantId) =>
        participantId.toString() === req.userId
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        message: "Bu maça zaten katılmıyorsun",
      });
    }

    match.participants.splice(participantIndex, 1);

    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({
      message: "Maçtan ayrılınamadı",
    });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (match.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        message: "Bu maçı silme yetkin yok",
      });
    }

    await match.deleteOne();

    res.json({
      message: "Maç başarıyla silindi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Maç silinemedi",
    });
  }
};

module.exports = {
  getAllMatches,
  getMyMatches,
  getJoinedMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
};