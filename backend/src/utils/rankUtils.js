const getRankLimits = (rankPoints = 1000) => {
  if (rankPoints < 500) {
    return {
      dailyJoinLimit: 1,
      dailyCreateLimit: 0,
    };
  }

  if (rankPoints < 1000) {
    return {
      dailyJoinLimit: 1,
      dailyCreateLimit: 1,
    };
  }

  if (rankPoints < 1500) {
    return {
      dailyJoinLimit: 2,
      dailyCreateLimit: 1,
    };
  }

  return {
    dailyJoinLimit: 2,
    dailyCreateLimit: 2,
  };
};

const getBadgeLevel = (rankPoints = 1000) => {
  if (rankPoints < 2500) {
    return 0;
  }

  return Math.floor((rankPoints - 2000) / 500);
};

module.exports = {
  getRankLimits,
  getBadgeLevel,
};