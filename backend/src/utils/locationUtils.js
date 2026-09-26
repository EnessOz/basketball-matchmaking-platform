const CHECK_IN_RADIUS_METERS = 100;
const CHECK_IN_EARLY_MINUTES = 30;
const MATCH_DURATION_MINUTES = 90;

const toRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const calculateDistanceInMeters = (
  lat1,
  lng1,
  lat2,
  lng2
) => {
  const earthRadiusMeters = 6371000;

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
};

const isWithinCheckInRadius = (
  userLat,
  userLng,
  courtLat,
  courtLng
) => {
  const distance = calculateDistanceInMeters(
    userLat,
    userLng,
    courtLat,
    courtLng
  );

  return {
    isWithinRadius: distance <= CHECK_IN_RADIUS_METERS,
    distance,
  };
};

const getMatchDateTime = (date, time) => {
  return new Date(`${date}T${time}:00+03:00`);
};

const getCheckInWindow = (date, time) => {
  const matchStart = getMatchDateTime(date, time);

  const checkInOpens = new Date(
    matchStart.getTime() -
      CHECK_IN_EARLY_MINUTES * 60 * 1000
  );

  const checkInCloses = new Date(
    matchStart.getTime() +
      MATCH_DURATION_MINUTES * 60 * 1000
  );

  return {
    matchStart,
    checkInOpens,
    checkInCloses,
  };
};

const isCheckInOpen = (date, time, now = new Date()) => {
  const { checkInOpens, checkInCloses } =
    getCheckInWindow(date, time);

  return (
    now >= checkInOpens &&
    now <= checkInCloses
  );
};

module.exports = {
  CHECK_IN_RADIUS_METERS,
  CHECK_IN_EARLY_MINUTES,
  MATCH_DURATION_MINUTES,
  calculateDistanceInMeters,
  isWithinCheckInRadius,
  getMatchDateTime,
  getCheckInWindow,
  isCheckInOpen,
};