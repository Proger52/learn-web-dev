import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import MasterInfo from "./components/MasterInfo";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";
import { fetchToday, fetchSlots } from "./api";
import { MONTHS_GENITIVE } from "./utils/date";

export default function App() {
  // ==========================================================================
  // Состояние загрузки сервера (today)
  // ==========================================================================
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  // ==========================================================================
  // Состояние календаря и выбора
  // ==========================================================================
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // ==========================================================================
  // Состояние слотов
  // ==========================================================================
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  // Реф для защиты от гонок (race condition): хранит последнюю запрошенную дату
  const latestRequestRef = useRef(null);

  // 1. Загрузка «сегодня» при открытии страницы
  useEffect(() => {
    async function loadToday() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        setToday(data);

        // Инициализируем календарь и день из ответа сервера
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        // По умолчанию выбираем дату (если 10 ноября, то можно выбрать 12 или data.day)
        const initialDay = data.day + 2 <= 30 ? data.day + 2 : data.day;
        setSelectedDay(initialDay);
      } catch (err) {
        setErrorToday(err.message || "Не удалось загрузить данные с сервера");
      } finally {
        setLoadingToday(false);
      }
    }

    loadToday();
  }, []);

  // 2. Загрузка слотов при изменении selectedDay / месяца / года
  useEffect(() => {
    if (!selectedDay || currentMonth === null || currentYear === null) {
      return;
    }

    const requestDate = {
      day: selectedDay,
      month: currentMonth,
      year: currentYear,
    };
    latestRequestRef.current = requestDate;

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);

        const response = await fetchSlots(requestDate);

        // Защита от гонок: проверяем, что ответ соответствует последнему выбранному дню
        if (
          latestRequestRef.current.day === response.date.day &&
          latestRequestRef.current.month === response.date.month &&
          latestRequestRef.current.year === response.date.year
        ) {
          setSlots(response.slots);
          // Если на новом дне есть слоты, можно оставить null или выбрать свободный слот
        }
      } catch (err) {
        setErrorSlots(err.message || "Не удалось загрузить слоты времени");
      } finally {
        if (
          latestRequestRef.current.day === requestDate.day &&
          latestRequestRef.current.month === requestDate.month &&
          latestRequestRef.current.year === requestDate.year
        ) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();
  }, [selectedDay, currentMonth, currentYear]);

  // Обработчик перелистывания месяца назад
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // Обработчик перелистывания месяца вперёд
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Выбор дня: меняем selectedDay, сбрасываем selectedTime
  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
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
          {loadingToday ? (
            <div className="loading-box">
              <span>Загрузка данных с сервера...</span>
            </div>
          ) : errorToday ? (
            <div className="error-box">
              <p>Не удалось подключиться к серверу:</p>
              <strong>{errorToday}</strong>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => window.location.reload()}
                style={{ marginTop: 12 }}
              >
                Повторить попытку
              </button>
            </div>
          ) : (
            <>
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
                    today={today}
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
                    loading={loadingSlots}
                    error={errorSlots}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
