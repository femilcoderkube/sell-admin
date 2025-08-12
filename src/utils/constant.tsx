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

export function getWinnerTeamName(matchData: any) {
  const winner = matchData?.winner; // Get the winner field ("opponent1" or "opponent2")
  const winnerTeam = matchData[winner]; // Access the winner's object dynamically
  return winnerTeam?.team?.teamName; // Return the teamName from the team sub-object
}

export function expandPositions(data: any) {
  return data.flatMap((item: any) => {
    if (typeof item.position === "string" && item.position.includes("-")) {
      const [start, end] = item.position.split("-").map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => ({
        position: start + i, // integer
        point: item.point,
      }));
    }
    return { ...item, position: Number(item.position) };
  });
}

export const setLocalZone = (date: Date, timezone: string) => {
  if (!date) return null;
  const dateWithoutZone = moment
    .tz(date, timezone)
    .format("YYYY-MM-DDTHH:mm:ss.SSS");
  const localZone = moment(dateWithoutZone).format("Z");
  const dateWithLocalZone = [dateWithoutZone, localZone].join("");

  return new Date(dateWithLocalZone);
};

export const setOtherZone = (date: Date, timezone: string) => {
  const dateWithoutZone = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS");
  const otherZone = moment.tz(date, timezone).format("Z");
  const dateWithOtherZone = [dateWithoutZone, otherZone].join("");

  return new Date(dateWithOtherZone);
};
