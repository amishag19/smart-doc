import './style.css';

import { useState, useEffect } from 'react';
import { format, formatDuration, intervalToDuration, isBefore, addDays, add, endOfDay, differenceInMilliseconds } from 'date-fns';
import Confetti from 'react-confetti';

function Countdown() {
  const now = new Date();
  const endOfToday = endOfDay(now);
  const initialEndDate = localStorage.getItem("endDate");
  const remainingHours = endOfToday.getHours() - now.getHours();
  const nextDayAndExtraTime = add(now, { hours: remainingHours + 4, seconds: 1 });
  const [countdown, setCountdown] = useState('');
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [endDate, setEndDate] = useState(() => {
    return initialEndDate ? new Date(initialEndDate) : new Date(Date.now() + differenceInMilliseconds(endOfToday, now));
  });

  function handleDateChange(event) {
    const chosenDate = new Date(event.target.value);
    const dateEST = add(chosenDate, { hours: 4 });
    localStorage.setItem("endDate", dateEST);
    setEndDate(dateEST);
    setCountdownEnded(false);
  };
  // useEffect hook: Updates the countdown every second and checks if the countdown has ended. If it has, it clears the interval and sets the countdownEnded state to true.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const duration = intervalToDuration({ start: now, end: endDate });

      if (isBefore(endDate, now)) { 
        setCountdownEnded(true);
        clearInterval(interval);
      } else { 
        setCountdown(`${formatDuration(duration)}`);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className='countdown'>
        <div className='countdown-timer-container'>
            {countdownEnded && <Confetti />}
            <div className='timer'>
                <h2>Countdown to 
                <input type="date" min={format(new Date(), "yyyy-MM-dd")} onChange={handleDateChange} /></h2>
                {!initialEndDate && <h3>{format(nextDayAndExtraTime, "MMMM do, yyyy")}</h3>}
                {/* {initialEndDate && <h3>{format(endDate, "MMMM do, yyyy")}</h3>} */}
                {!countdownEnded && <h3>{countdown}</h3>}
                {countdownEnded && <h4>Countdown Ended!</h4>}
            </div>
        </div>
    </div>
  );    
}

export default Countdown;