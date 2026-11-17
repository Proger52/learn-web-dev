// «База данных» для BLACKWOOD barbershop

export const database = {
  // «Сегодня» по мнению сервера: 10 ноября 2026 (месяц 10)
  today: { day: 10, month: 10, year: 2026 },

  // Слоты для чётных дней
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "11:30", available: false },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "16:00", available: true },
    { time: "17:30", available: false },
    { time: "19:00", available: true },
  ],

  // Слоты для нечётных дней
  slotsOddDay: [
    { time: "10:00", available: true },
    { time: "11:30", available: true },
    { time: "13:00", available: false },
    { time: "14:30", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "19:00", available: false },
  ],
};
