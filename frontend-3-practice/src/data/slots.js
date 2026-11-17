// Имитация серверных данных со слотами

export const SERVER_DATA = {
  today: { day: 10, month: 10, year: 2026 }, // 10 ноября 2026
};

export const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "11:30", available: false },
  { time: "13:00", available: true },
  { time: "14:30", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: false },
  { time: "19:00", available: true },
];

export const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "11:30", available: true },
  { time: "13:00", available: false },
  { time: "14:30", available: true },
  { time: "16:00", available: false },
  { time: "17:30", available: true },
  { time: "19:00", available: false },
];

export function getSlotsForDay(day) {
  const isEven = day % 2 === 0;
  return isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
}
