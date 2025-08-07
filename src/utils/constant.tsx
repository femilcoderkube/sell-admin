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

export const formatDate = (date: string | undefined) => {
  if (!date) return "N/A";
  return moment(date).format("MMM D h:mm A");
};

export const checkboxOptions = [
  {
    id: "scheduled",
    name: "scheduled",
    label: "Scheduled",
    defaultValue: 0,
  },
  {
    id: "completed",
    name: "completed",
    label: "Completed",
    defaultValue: 0,
  },
  {
    id: "in_progress",
    name: "in_progress",
    label: "In-progress",
    defaultValue: 1,
  },
  {
    id: "pending",
    name: "pending",
    label: "Pending",
    defaultValue: 1,
  },
];
