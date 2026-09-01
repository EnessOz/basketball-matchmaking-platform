const User = require("../models/User");

const getFavoriteCourts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("favoriteCourts");

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json(user.favoriteCourts);
  } catch (error) {
    res.status(500).json({
      message: "Favori sahalar alınamadı",
    });
  }
};

const addFavoriteCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const alreadyFavorite = user.favoriteCourts.some(
      (favoriteCourtId) => favoriteCourtId.toString() === courtId
    );

    if (alreadyFavorite) {
      return res.status(400).json({
        message: "Bu saha zaten favorilerinde",
      });
    }

    user.favoriteCourts.push(courtId);

    await user.save();

    res.json({
      message: "Saha favorilere eklendi",
      favoriteCourts: user.favoriteCourts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Saha favorilere eklenemedi",
    });
  }
};

const removeFavoriteCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const favoriteIndex = user.favoriteCourts.findIndex(
      (favoriteCourtId) => favoriteCourtId.toString() === courtId
    );

    if (favoriteIndex === -1) {
      return res.status(400).json({
        message: "Bu saha favorilerinde değil",
      });
    }

    user.favoriteCourts.splice(favoriteIndex, 1);

    await user.save();

    res.json({
      message: "Saha favorilerden çıkarıldı",
      favoriteCourts: user.favoriteCourts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Saha favorilerden çıkarılamadı",
    });
  }
};

module.exports = {
  getFavoriteCourts,
  addFavoriteCourt,
  removeFavoriteCourt,
};