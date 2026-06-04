import { useState } from 'react';
import DatePicker from './DatePicker';

/**
 * DatePicker Component Usage Examples
 * 
 * The DatePicker component is a reusable, calendar-based date selector
 * that can be used in any form where date selection is needed.
 */

const DatePickerExamples = () => {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);

  // Example 1: Basic usage
  const Example1 = () => (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-4">Example 1: Basic Date Picker</h3>
      <DatePicker
        label="Select Date"
        value={date1}
        onChange={setDate1}
        placeholder="Choose any date"
      />
      {date1 && <p className="mt-2 text-green-600">Selected: {date1.toDateString()}</p>}
    </div>
  );

  // Example 2: With constraints
  const Example2 = () => {
    const today = new Date();
    const maxDate = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() - 30); // 30 days ago
    
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="font-bold mb-4">Example 2: Date Picker with Min/Max Date</h3>
        <DatePicker
          label="Select Date (Last 30 days)"
          value={date2}
          onChange={setDate2}
          minDate={minDate}
          maxDate={today}
          placeholder="Choose from last 30 days"
        />
        {date2 && <p className="mt-2 text-green-600">Selected: {date2.toDateString()}</p>}
      </div>
    );
  };

  // Example 3: In a form context
  const Example3 = () => (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-4">Example 3: Date Picker in Form</h3>
      <form className="space-y-4">
        <DatePicker
          label="Payment Date"
          value={date3}
          onChange={setDate3}
          maxDate={new Date()}
          placeholder="When did you pay?"
        />
        <input
          type="text"
          placeholder="Reference Number"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg">Submit</button>
      </form>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">DatePicker Component Examples</h1>
      <Example1 />
      <Example2 />
      <Example3 />
    </div>
  );
};

export default DatePickerExamples;

/**
 * HOW TO USE IN YOUR PROJECT:
 * 
 * 1. Import the component:
 *    import DatePicker from './components/DatePicker';
 * 
 * 2. Use in your form:
 *    const [selectedDate, setSelectedDate] = useState(null);
 *    
 *    <DatePicker
 *      label="Transaction Date"
 *      value={selectedDate}
 *      onChange={setSelectedDate}
 *      maxDate={new Date()}  // Can't select future dates
 *      placeholder="Select date"
 *    />
 * 
 * 3. Props available:
 *    - value: Current selected date (Date object or null)
 *    - onChange: Callback function when date is selected
 *    - label: Label text above the input (optional)
 *    - placeholder: Placeholder text (optional)
 *    - minDate: Minimum date that can be selected (optional)
 *    - maxDate: Maximum date that can be selected (optional)
 *    - disabled: Disable the date picker (optional)
 *    - className: Additional CSS classes (optional)
 * 
 * 4. Features:
 *    ✓ Calendar view with month navigation
 *    ✓ Visual selection of date
 *    ✓ "Today" button for quick selection
 *    ✓ Min/max date constraints
 *    ✓ Click outside to close
 *    ✓ Formatted date display (DD-MM-YYYY)
 *    ✓ Fully responsive and accessible
 */
