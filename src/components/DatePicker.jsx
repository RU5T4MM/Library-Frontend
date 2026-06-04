import { useState, useEffect, useRef } from 'react';

const DatePicker = ({ 
  value, 
  onChange, 
  label = 'Select Date', 
  placeholder = 'Choose a date',
  minDate = null,
  maxDate = null,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef(null);

  // Format date for input display
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  // Handle date selection
  const handleSelectDate = (date) => {
    if (!isDateDisabled(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const calendarDays = generateCalendarDays();
  const selectedDate = value ? new Date(value) : null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={formatDate(value)}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          disabled={disabled}
          className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors cursor-pointer ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        />
        
        <svg
          className="absolute right-3 top-3 w-5 h-5 text-gray-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 w-80">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-lg font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                onClick={() => date && handleSelectDate(date)}
                disabled={!date || isDateDisabled(date)}
                className={`p-2 text-sm rounded font-medium transition-colors ${
                  !date
                    ? 'invisible'
                    : isDateDisabled(date)
                    ? 'text-gray-300 cursor-not-allowed'
                    : selectedDate &&
                      date.getDate() === selectedDate.getDate() &&
                      date.getMonth() === selectedDate.getMonth() &&
                      date.getFullYear() === selectedDate.getFullYear()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>

          {/* Today Button */}
          <button
            onClick={() => handleSelectDate(new Date())}
            className="w-full mt-4 py-2 px-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors text-sm"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
