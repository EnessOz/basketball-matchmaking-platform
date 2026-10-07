const Match = require("../models/Match");
const { changeUserPoints } = require("./pointService");

const MATCH_DURATION_MINUTES = 90;
const REQUIRED_LOCATION_PENALTY = -25;

const getMatchEndDate = (date, time) => {
  const matchStart = new Date(
    `${date}T${time}:00+03:00`
  );

  return new Date(
    matchStart.getTime() +
      MATCH_DURATION_MINUTES * 60 * 1000
  );
};

const processRequiredLocationPenalties =
  async () => {
    try {
      const now = new Date();

      // Sadece zorunlu lokasyonlu ve henüz
      // cezası işlenmemiş maçlarla ilgileniyoruz.
      const matches = await Match.find({
        locationRequired: true,
        requiredLocationPenaltyApplied: false,
      });

      for (const match of matches) {
        const matchEnd = getMatchEndDate(
          match.date,
          match.time
        );

        // Maç henüz bitmediyse hiçbir şey yapma.
        if (matchEnd > now) {
          continue;
        }

        const creatorId =
          match.createdBy.toString();

        // Creator bu maçta konumunu doğrulamış mı?
        const creatorVerifiedLocation =
          match.locationVerifications.some(
            (verification) =>
              verification.user.toString() ===
              creatorId
          );

        // Konum doğrulandıysa ceza yok.
        //
        // Bu maçı tekrar tekrar kontrol etmemek
        // için işlem tamamlandı olarak işaretliyoruz.
        if (creatorVerifiedLocation) {
          match.requiredLocationPenaltyApplied =
            true;

          await match.save();

          continue;
        }

        // Maç bitti ve creator zorunlu konum
        // doğrulamasını yapmadı: -25.
        await changeUserPoints({
          userId: creatorId,
          amount: REQUIRED_LOCATION_PENALTY,
          reason: "required_location_penalty",
          matchId: match._id,
          description: `${match.courtName} sahasındaki zorunlu konum doğrulaması maç süresi içinde yapılmadı`,
        });

        match.requiredLocationPenaltyApplied =
          true;

        await match.save();

        console.log(
          `Required location penalty applied for match ${match._id}`
        );
      }
    } catch (error) {
      console.error(
        "Required location penalty processing error:",
        error
      );
    }
  };

module.exports = {
  processRequiredLocationPenalties,
};