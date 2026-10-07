const Match = require("../models/Match");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Court = require("../models/Court");

const { getRankLimits } = require("../utils/rankUtils");
const { changeUserPoints } = require("../services/pointService");

const {
  CHECK_IN_RADIUS_METERS,
  isWithinCheckInRadius,
  isCheckInOpen,
  getCheckInWindow,
} = require("../utils/locationUtils");

const MATCH_CREATION_COOLDOWN_MS = 60 * 1000;
const MATCH_DURATION_MINUTES = 90;

const DELETION_WINDOW_DAYS = 7;
const DELETION_LIMIT_BEFORE_LOCATION_REQUIRED = 5;
const REQUIRED_LOCATION_PENALTY = -25;

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

// Son 7 günlük kayan pencerenin başlangıcını döndürür.
const getDeletionWindowStart = (now = new Date()) => {
  return new Date(
    now.getTime() -
      DELETION_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );
};

// Kullanıcının sadece son 7 gündeki silme kayıtlarını döndürür.
const getRecentDeletionHistory = (
  deletionHistory = [],
  now = new Date()
) => {
  const windowStart = getDeletionWindowStart(now);

  return deletionHistory.filter((date) => {
    const deletionDate = new Date(date);

    return (
      !Number.isNaN(deletionDate.getTime()) &&
      deletionDate >= windowStart &&
      deletionDate <= now
    );
  });
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

// Maçın başlangıç tarih ve saatini Türkiye saatine göre
// gerçek bir Date nesnesine çevirir.
const getMatchStartDate = (date, time) => {
  return new Date(`${date}T${time}:00+03:00`);
};

// Maç başlangıcının üzerine 90 dakika ekleyerek
// maçın gerçek bitiş zamanını hesaplar.
//
// Örnek:
// 2026-09-27 18:00 -> 19:30
// 2026-09-27 23:30 -> 2026-09-28 01:00
const getMatchEndDate = (date, time) => {
  const matchStart = getMatchStartDate(date, time);

  return new Date(
    matchStart.getTime() +
      MATCH_DURATION_MINUTES * 60 * 1000
  );
};

// Maçın 90 dakikalık süresi sona ermiş mi?
const isMatchExpired = (match, now = new Date()) => {
  const matchEnd = getMatchEndDate(
    match.date,
    match.time
  );

  return matchEnd <= now;
};

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();

    // Geçmiş maçları MongoDB'den silmiyoruz.
    // Sadece genel maç listesinden gizliyoruz.
    //
    // Böylece ileride:
    // - maç geçmişi
    // - lokasyon doğrulamaları
    // - oyuncu puanlamaları
    // - PointTransaction kayıtları
    // gibi sistemlerde maç kaydı kullanılmaya devam edebilir.
    const now = new Date();

    const activeMatches = matches
      .filter((match) => !isMatchExpired(match, now))
      .sort((firstMatch, secondMatch) => {
        const firstStart = getMatchStartDate(
          firstMatch.date,
          firstMatch.time
        );

        const secondStart = getMatchStartDate(
          secondMatch.date,
          secondMatch.time
        );

        return firstStart - secondStart;
      });

    res.json(activeMatches);
  } catch (error) {
    console.error("Get all matches error:", error);

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

    const creationHistory =
      user.matchCreationHistory || [];

    const rankPoints =
      typeof user.rankPoints === "number"
        ? user.rankPoints
        : 1000;

    const { dailyCreateLimit } =
      getRankLimits(rankPoints);

    if (dailyCreateLimit === 0) {
      return res.status(403).json({
        message:
          "Mevcut rank puanınla maç oluşturma hakkın bulunmuyor.",
      });
    }

    if (creationHistory.length > 0) {
      const lastCreation =
        creationHistory[
          creationHistory.length - 1
        ];

      const timeSinceLastCreation =
        now.getTime() -
        new Date(lastCreation).getTime();

      if (
        timeSinceLastCreation <
        MATCH_CREATION_COOLDOWN_MS
      ) {
        const remainingSeconds = Math.ceil(
          (MATCH_CREATION_COOLDOWN_MS -
            timeSinceLastCreation) /
            1000
        );

        return res.status(429).json({
          message: `Yeni bir maç oluşturmak için ${remainingSeconds} saniye beklemelisin.`,
        });
      }
    }

    const { startOfDay, endOfDay } =
      getTurkeyDayRange();

    const todaysCreations =
      creationHistory.filter((date) => {
        const creationDate = new Date(date);

        return (
          creationDate >= startOfDay &&
          creationDate <= endOfDay
        );
      });

    if (
      todaysCreations.length >=
      dailyCreateLimit
    ) {
      return res.status(429).json({
        message: `Bugün için maç oluşturma limitine ulaştın. Mevcut rank seviyende günde en fazla ${dailyCreateLimit} maç oluşturabilirsin.`,
      });
    }

    // Son 7 gündeki silme kayıtlarını hesapla.
    //
    // 0-4 silme:
    // Yeni maç normal oluşturulur.
    //
    // 5 veya daha fazla silme:
    // Bundan sonra oluşturulan maç için
    // creator'ın saha konumunu doğrulaması zorunludur.
    const recentDeletionHistory =
      getRecentDeletionHistory(
        user.matchDeletionHistory || [],
        now
      );

    const locationRequired =
      recentDeletionHistory.length >=
      DELETION_LIMIT_BEFORE_LOCATION_REQUIRED;

    const newMatch = await Match.create({
      ...req.body,
      createdBy: req.userId,
      participants: [req.userId],
      locationRequired,
      requiredLocationPenaltyApplied: false,
    });

    user.matchCreationHistory = [
      ...todaysCreations,
      now,
    ];

    // Eski silme kayıtlarını User üzerinde sonsuza kadar
    // biriktirmiyoruz. Sadece halen geçerli olan
    // son 7 günlük kayıtları tutuyoruz.
    user.matchDeletionHistory =
      recentDeletionHistory;

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
      const notifications =
        usersToNotify.map(
          (userToNotify) => ({
            recipient: userToNotify._id,
            sender: req.userId,
            match: newMatch._id,
            court: newMatch.courtId,
            type: "favorite_court_match",
          })
        );

      await Notification.insertMany(
        notifications,
        {
          ordered: false,
        }
      );
    }

    res.status(201).json({
      ...newMatch.toObject(),
      locationRequirementWarning:
        locationRequired
          ? "Son 7 gün içinde 5 veya daha fazla maç sildiğin için bu maçta konum doğrulaması zorunludur."
          : null,
    });
  } catch (error) {
    console.error(
      "Create match error:",
      error
    );

    res.status(400).json({
      message: "Maç oluşturulamadı",
    });
  }
};

const joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(
      req.params.id
    );

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (
      match.createdBy.toString() ===
      req.userId
    ) {
      return res.status(400).json({
        message: "Bu maçın sahibi sensin",
      });
    }

    const alreadyJoined =
      match.participants.some(
        (participantId) =>
          participantId.toString() ===
          req.userId
      );

    if (alreadyJoined) {
      return res.status(400).json({
        message: "Bu maça zaten katıldın",
      });
    }

    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const rankPoints =
      typeof user.rankPoints === "number"
        ? user.rankPoints
        : 1000;

    const { dailyJoinLimit } =
      getRankLimits(rankPoints);

    // Hedef maçın oynanacağı gün
    // kullanıcının dahil olduğu bütün
    // maçları getir.
    const matchesOnSameDay =
      await Match.find({
        date: match.date,
        participants: req.userId,
      });

    if (
      matchesOnSameDay.length >=
      dailyJoinLimit
    ) {
      return res.status(429).json({
        message: `Bu tarih için maç katılım limitine ulaştın. Mevcut rank seviyende aynı gün en fazla ${dailyJoinLimit} maça katılabilirsin.`,
      });
    }

    // Kullanıcının o gün dahil olduğu
    // maçlardan herhangi biri hedef
    // maçın 90 dakikalık zaman
    // aralığıyla çakışıyor mu?
    const conflictingMatch =
      matchesOnSameDay.find(
        (existingMatch) =>
          matchesOverlap(
            existingMatch.time,
            match.time
          )
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
    console.error(
      "Join match error:",
      error
    );

    res.status(500).json({
      message: "Maça katılınamadı",
    });
  }
};

const leaveMatch = async (req, res) => {
  try {
    const match = await Match.findById(
      req.params.id
    );

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (
      match.createdBy.toString() ===
      req.userId
    ) {
      return res.status(400).json({
        message:
          "Kendi oluşturduğun maçtan ayrılamazsın",
      });
    }

    const participantIndex =
      match.participants.findIndex(
        (participantId) =>
          participantId.toString() ===
          req.userId
      );

    if (participantIndex === -1) {
      return res.status(400).json({
        message:
          "Bu maça zaten katılmıyorsun",
      });
    }

    match.participants.splice(
      participantIndex,
      1
    );

    await match.save();

    res.json(match);
  } catch (error) {
    console.error(
      "Leave match error:",
      error
    );

    res.status(500).json({
      message: "Maçtan ayrılınamadı",
    });
  }
};

const verifyLocation = async (
  req,
  res
) => {
  try {
    const { latitude, longitude } =
      req.body;

    const userLat = Number(latitude);
    const userLng = Number(longitude);

    // Geçerli koordinat gönderilmiş mi?
    if (
      !Number.isFinite(userLat) ||
      !Number.isFinite(userLng) ||
      userLat < -90 ||
      userLat > 90 ||
      userLng < -180 ||
      userLng > 180
    ) {
      return res.status(400).json({
        message:
          "Geçerli bir konum bilgisi gönderilmedi.",
      });
    }

    const match = await Match.findById(
      req.params.id
    );

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    // Sadece maça dahil olan kullanıcı
    // konum doğrulayabilir.
    // Maç sahibi de oluşturulurken
    // participants içine ekleniyor.
    const isParticipant =
      match.participants.some(
        (participantId) =>
          participantId.toString() ===
          req.userId
      );

    if (!isParticipant) {
      return res.status(403).json({
        message:
          "Konum doğrulaması yapabilmek için bu maça katılıyor olmalısın.",
      });
    }

    // Aynı kullanıcı aynı maçtan
    // ikinci kez +20 alamaz.
    const alreadyVerified =
      match.locationVerifications.some(
        (verification) =>
          verification.user.toString() ===
          req.userId
      );

    if (alreadyVerified) {
      return res.status(409).json({
        message:
          "Bu maç için konumunu daha önce doğruladın.",
      });
    }

    // Check-in maçtan 30 dakika önce
    // açılır ve maçın 90 dakikalık
    // süresi sonunda kapanır.
    if (
      !isCheckInOpen(
        match.date,
        match.time
      )
    ) {
      const {
        checkInOpens,
        checkInCloses,
      } = getCheckInWindow(
        match.date,
        match.time
      );

      return res.status(400).json({
        message:
          "Bu maç için konum doğrulama zamanı henüz açık değil veya sona erdi.",
        checkInOpens,
        checkInCloses,
      });
    }

    const court = await Court.findById(
      match.courtId
    );

    if (!court) {
      return res.status(404).json({
        message:
          "Maçın oynanacağı saha bulunamadı.",
      });
    }

    const {
      isWithinRadius,
      distance,
    } = isWithinCheckInRadius(
      userLat,
      userLng,
      court.location.lat,
      court.location.lng
    );

    if (!isWithinRadius) {
      return res.status(400).json({
        message: `Konum doğrulanamadı. Sahaya en fazla ${CHECK_IN_RADIUS_METERS} metre uzaklıkta olmalısın.`,
        distanceMeters:
          Math.round(distance),
      });
    }

    // Konum doğrulamasını maç
    // üzerinde sakla.
    match.locationVerifications.push({
      user: req.userId,
      verifiedAt: new Date(),
    });

    await match.save();

    // Başarılı saha doğrulaması
    // +20 rank puanı verir.
    const pointResult =
      await changeUserPoints({
        userId: req.userId,
        amount: 20,
        reason:
          "location_verification",
        matchId: match._id,
        description: `${match.courtName} sahasında konum doğrulandı`,
      });

    const verification =
      match.locationVerifications[
        match.locationVerifications.length -
          1
      ];

    res.json({
      message:
        "Konum başarıyla doğrulandı. +20 rank puanı kazandın.",
      rankPoints:
        pointResult.newPoints,
      pointsEarned:
        pointResult.appliedAmount,
      verifiedAt:
        verification.verifiedAt,
    });
  } catch (error) {
    console.error(
      "Verify location error:",
      error
    );

    res.status(500).json({
      message: "Konum doğrulanamadı.",
    });
  }
};

const deleteMatch = async (
  req,
  res
) => {
  try {
    const match = await Match.findById(
      req.params.id
    );

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (
      match.createdBy.toString() !==
      req.userId
    ) {
      return res.status(403).json({
        message:
          "Bu maçı silme yetkin yok",
      });
    }

    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const now = new Date();

    // Sadece son 7 günlük silme kayıtlarını koru.
    const recentDeletionHistory =
      getRecentDeletionHistory(
        user.matchDeletionHistory || [],
        now
      );

    // Zorunlu lokasyonlu maçlarda creator'ın
    // gerçekten konum doğrulayıp doğrulamadığını kontrol et.
    const creatorVerifiedLocation =
      match.locationVerifications.some(
        (verification) =>
          verification.user.toString() ===
          req.userId
      );

    let penaltyApplied = false;
    let updatedRankPoints =
      typeof user.rankPoints === "number"
        ? user.rankPoints
        : 1000;

    // Maç zorunlu lokasyonluysa ve creator
    // konumunu doğrulamadan maçı siliyorsa -25.
    //
    // Creator konumunu daha önce doğrulamışsa
    // maçı sonradan silmesi ceza oluşturmaz.
    if (
      match.locationRequired &&
      !creatorVerifiedLocation &&
      !match.requiredLocationPenaltyApplied
    ) {
      const pointResult =
        await changeUserPoints({
          userId: req.userId,
          amount:
            REQUIRED_LOCATION_PENALTY,
          reason:
            "required_location_penalty",
          matchId: match._id,
          description: `${match.courtName} sahasındaki zorunlu konum doğrulamalı maç, konum doğrulanmadan silindi`,
        });

      match.requiredLocationPenaltyApplied =
        true;

      penaltyApplied = true;
      updatedRankPoints =
        pointResult.newPoints;
    }

    // Bu silmeyi rolling 7 günlük geçmişe ekle.
    user.matchDeletionHistory = [
      ...recentDeletionHistory,
      now,
    ];

    await user.save();

    await match.deleteOne();

    res.json({
      message: penaltyApplied
        ? "Maç silindi. Zorunlu konum doğrulaması yapılmadığı için 25 rank puanı düşürüldü."
        : "Maç başarıyla silindi",
      penaltyApplied,
      rankPoints: updatedRankPoints,
      deletionsLast7Days:
        user.matchDeletionHistory.length,
    });
  } catch (error) {
    console.error(
      "Delete match error:",
      error
    );

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
  verifyLocation,
  deleteMatch,
};