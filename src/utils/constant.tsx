import moment from "moment-timezone";

export const SOCKET = {
  MATCHUPDATE: "matchUpdate",
  ONADMINMESSAGE: "onAdminMessage",
  ONADMINMESSAGESTART: "onAdminMessageStart",
};

// Helper to convert Saudi time to local time for form display
export function toLocalTimeFromSaudi(saudiTime) {
  if (!saudiTime) return "";
  // Parse as Saudi time, then convert to local, then format as "HH:mm"
  return moment
    .tz(`1970-01-01T${saudiTime}`, "YYYY-MM-DDTHH:mm", "Asia/Riyadh")
    .tz(moment.tz.guess())
    .format("HH:mm");
}

// Helper to convert Saudi time to local time for form display
export function toLocaldateTimeFromSaudi(saudiTime: string) {
  if (!saudiTime) return "";
  return moment
    .tz(saudiTime, moment.ISO_8601, "Asia/Riyadh")
    .tz(moment.tz.guess())
    .toISOString();
}
