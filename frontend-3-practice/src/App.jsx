import { useState } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import MasterInfo from "./components/MasterInfo";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";
import { SERVER_DATA, getSlotsForDay } from "./data/slots";
import { MONTHS_GENITIVE } from "./utils/date";

export default function App() {
  // Пять состояний по требованиям задания:
  const [currentMonth, setCurrentMonth] = useState(10); // Ноябрь (0-индексный: 10)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(12); // По умолчанию выбран 12 ноября
  const [selectedTime, setSelectedTime] = useState("14:30"); // По умолчанию выбрано 14:30
  const [slots, setSlots] = useState(() => getSlotsForDay(12));

  // Перелистывание месяца назад
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // Перелистывание месяца вперёд
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Выбор дня: меняет день, сбрасывает выбранное время, подгружает новые слоты
  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlotsForDay(day));
  };

  // Выбор слота времени
  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  // Клик по кнопке «Далее»
  const handleNext = () => {
    if (!selectedTime) {
      alert("Пожалуйста, выберите удобное время для записи.");
      return;
    }

    const bookingData = {
      day: selectedDay,
      month: currentMonth,
      year: currentYear,
      time: selectedTime,
    };

    try {
      localStorage.setItem("blackwood-booking", JSON.stringify(bookingData));
    } catch (e) {
      console.error("Ошибка сохранения в localStorage:", e);
    }

    alert(
      `Вы успешно записались на: ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear}, время ${selectedTime}`
    );
  };

  return (
    <div className="booking-page">
      <Header />
      <StepIndicator />

      <main className="main-content">
        <div className="content-container">
          <div className="booking-columns">
            {/* Левая колонка: заголовок и календарь */}
            <div className="booking-left-col">
              <div className="page-heading">
                <h1 className="page-title">Выберите дату и время</h1>
                <p className="page-subtitle">
                  Выберите удобный день и свободное время для посещения.
                </p>
              </div>

              <Calendar
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDay={selectedDay}
                today={SERVER_DATA.today}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onSelectDay={handleSelectDay}
              />
            </div>

            {/* Правая колонка: информация о мастере и слоты времени */}
            <div className="booking-right-col">
              <MasterInfo />
              <TimeSlots
                slots={slots}
                selectedTime={selectedTime}
                onSelectTime={handleSelectTime}
              />
            </div>
          </div>

          {/* Нижняя панель подтверждения */}
          <BookingBottomBar
            selectedDay={selectedDay}
            selectedMonth={currentMonth}
            selectedYear={currentYear}
            selectedTime={selectedTime}
            onNext={handleNext}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
