const User = require("../models/User");
const PointTransaction = require("../models/PointTransaction");

const changeUserPoints = async ({
  userId,
  amount,
  reason,
  matchId = null,
  description = "",
}) => {
  if (!userId) {
    throw new Error("Puan işlemi için kullanıcı gerekli");
  }

  if (!Number.isFinite(amount) || amount === 0) {
    throw new Error("Geçerli bir puan miktarı gerekli");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const currentPoints =
    typeof user.rankPoints === "number"
      ? user.rankPoints
      : 1000;

  // Rank puanı 0'ın altına düşmesin.
  const newPoints = Math.max(0, currentPoints + amount);

  // Gerçekte uygulanan puan değişimi.
  // Örneğin kullanıcı 5 puandayken -10 ceza alırsa
  // işlem -5 olarak kaydedilir.
  const appliedAmount = newPoints - currentPoints;

  user.rankPoints = newPoints;

  await user.save();

  const transaction = await PointTransaction.create({
    user: userId,
    match: matchId,
    amount: appliedAmount,
    reason,
    description,
  });

  return {
    previousPoints: currentPoints,
    newPoints,
    appliedAmount,
    transaction,
  };
};

module.exports = {
  changeUserPoints,
};