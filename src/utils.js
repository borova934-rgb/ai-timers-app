import { fromZonedTime } from 'date-fns-tz';
import { differenceInMilliseconds } from 'date-fns';

export function calculateTimeRemaining(targetLocalStr, overridePercentage = null) {
  const fallbackPassed = overridePercentage !== null ? overridePercentage : 100;

  if (!targetLocalStr) {
    return { remainingMs: 0, days: 0, hours: 0, minutes: 0, passedPercentage: fallbackPassed, isZero: true };
  }

  // Expecting targetLocalStr format: "MM/DD/YYYY HH:MM:SS AM/PM"
  // E.g., "04/06/2026 04:02:01 PM"
  // Let's manually parse it to a standard UTC Date considering America/New_York
  let targetDateUTC;
  try {
    const timeMatch = targetLocalStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(AM|PM)$/i);
    if (!timeMatch) {
      throw new Error("Invalid format");
    }
    
    let [ , month, day, year, hourStr, min, sec, period ] = timeMatch;
    let hour = parseInt(hourStr, 10);
    if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
    
    // Explicit padding is needed for parsing in correct ISO 8601 format
    const isoStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${String(hour).padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
    targetDateUTC = fromZonedTime(isoStr, 'America/New_York');
  } catch (e) {
    return { remainingMs: 0, days: 0, hours: 0, minutes: 0, passedPercentage: fallbackPassed, isZero: true };
  }

  const nowUTC = new Date();
  const diffMs = differenceInMilliseconds(targetDateUTC, nowUTC);
  
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  if (diffMs <= 0) {
    return { 
      remainingMs: 0, 
      days: 0, 
      hours: 0, 
      minutes: 0, 
      passedPercentage: overridePercentage !== null ? overridePercentage : 100, 
      isZero: true 
    };
  }

  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));

  let passedMs = SEVEN_DAYS_MS - diffMs;
  if (passedMs < 0) passedMs = 0; // if more than 7 days left, passed is 0

  let passedPercentage = (passedMs / SEVEN_DAYS_MS) * 100;

  return {
    remainingMs: diffMs,
    days,
    hours,
    minutes,
    passedPercentage, // 0 to 100
    isZero: false
  };
}
