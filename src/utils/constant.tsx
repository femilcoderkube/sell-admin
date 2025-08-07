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

const allParticipants: any[] = [
  { id: "1", name: "John Doe", shortName: "JD" },
  { id: "2", name: "Jane Smith", shortName: "JS" },
  { id: "3", name: "Alice Johnson", shortName: "AJ" },
  { id: "4", name: "Bob Williams", shortName: "BW" },
  { id: "5", name: "Charlie Brown", shortName: "CB" },
  { id: "6", name: "Emma Davis", shortName: "ED" },
  { id: "7", name: "Michael Lee", shortName: "ML" },
  { id: "8", name: "Sarah Wilson", shortName: "SW" },
];

// Dummy data for groups
export const groups = [
  {
    groupNumber: 1,
    participants: [
      allParticipants[0], // John Doe
      allParticipants[1], // Jane Smith
      null, // Empty slot
    ],
  },
  {
    groupNumber: 2,
    participants: [
      allParticipants[2], // Alice Johnson
      allParticipants[3], // Bob Williams
      allParticipants[4], // Charlie Brown
    ],
  },
  {
    groupNumber: 3,
    participants: [
      null, // Empty slot
      allParticipants[5], // Emma Davis
      null, // Empty slot
    ],
  },
];
