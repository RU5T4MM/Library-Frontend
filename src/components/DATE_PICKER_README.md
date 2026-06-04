# Date Picker Component Guide

## Overview
I've created a modern, reusable **DatePicker** component for your library management system. It allows users to select dates in forms (like when submitting fees/payments) with an intuitive calendar interface.

---

## Files Created

### 1. **DatePicker.jsx** (Core Component)
Main date picker component with calendar functionality.

**Features:**
- 📅 Interactive calendar view
- ◀️ ▶️ Month navigation (previous/next)
- 🎯 Visual selection highlighting
- ⏰ "Today" quick button
- 🚫 Min/Max date constraints (block past/future dates)
- 🎨 Fully styled with Tailwind CSS
- ♿ Accessible and responsive

---

## Usage Examples

### Basic Usage
```jsx
import DatePicker from './components/DatePicker';
import { useState } from 'react';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <DatePicker
      label="Select Date"
      value={selectedDate}
      onChange={setSelectedDate}
      placeholder="Choose a date"
    />
  );
}
```

### In a Payment/Fees Form
```jsx
import DatePicker from './components/DatePicker';
import { useState } from 'react';

function FeesForm() {
  const [paymentDate, setPaymentDate] = useState(null);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment Date:', paymentDate);
    console.log('Amount:', amount);
    // Submit to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      {/* Date Picker - Can only select dates up to today */}
      <DatePicker
        label="Payment Date"
        value={paymentDate}
        onChange={setPaymentDate}
        maxDate={new Date()}  // ← Prevents selecting future dates
        placeholder="When did you pay?"
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Date Constraints
```jsx
<DatePicker
  label="Select Transaction Date"
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date('2024-01-01')}  // Can't select before this
  maxDate={new Date()}                // Can't select after today
  placeholder="Choose date between Jan 1 and today"
/>
```

---

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | Date \| null | Yes | Current selected date |
| `onChange` | Function | Yes | Callback: `(date) => {}` |
| `label` | String | No | Label text above input |
| `placeholder` | String | No | Input placeholder text |
| `minDate` | Date | No | Minimum selectable date |
| `maxDate` | Date | No | Maximum selectable date |
| `disabled` | Boolean | No | Disable the picker |
| `className` | String | No | Additional CSS classes |

---

## Complete Payment Form Example

I've also created **PaymentForm.jsx** with:
- Amount input with currency symbol
- Plan selection (Monthly, Quarterly, etc.)
- **Date Picker** for transaction date
- File upload for payment screenshot
- Description field
- Form validation
- Loading state during submission

---

## How to Integrate

### 1. Use in Your Existing Form
Replace date input fields with DatePicker:

```jsx
// Before
<input type="date" name="date" />

// After
import DatePicker from './components/DatePicker';
<DatePicker 
  label="Select Date"
  value={date}
  onChange={setDate}
/>
```

### 2. Common Use Cases

**For Past Dates Only (Fees/Payments):**
```jsx
<DatePicker
  label="Payment Date"
  value={date}
  onChange={setDate}
  maxDate={new Date()}  // Only past dates
/>
```

**For Future Dates (Booking/Reservation):**
```jsx
<DatePicker
  label="Booking Date"
  value={date}
  onChange={setDate}
  minDate={new Date()}  // Only future dates
/>
```

**For Date Range (30 days ago to today):**
```jsx
const today = new Date();
const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

<DatePicker
  label="Transaction Date"
  value={date}
  onChange={setDate}
  minDate={thirtyDaysAgo}
  maxDate={today}
/>
```

---

## Styling

The component uses **Tailwind CSS**. Make sure your project has Tailwind configured.

To customize colors, edit the className values in `DatePicker.jsx`:
- Selected date: `bg-blue-500` → Change to your color
- Hover: `hover:bg-blue-100` → Change to your color
- Border: `border-blue-500` → Change to your color

---

## Files in Components Folder

```
src/components/
├── DatePicker.jsx           ← Main date picker component
├── PaymentForm.jsx          ← Example payment form using DatePicker
├── DatePickerExamples.jsx   ← Multiple usage examples
└── ...existing components
```

---

## Quick Start

1. **Import in your form:**
   ```jsx
   import DatePicker from './components/DatePicker';
   ```

2. **Add state:**
   ```jsx
   const [date, setDate] = useState(null);
   ```

3. **Use in JSX:**
   ```jsx
   <DatePicker 
     label="Select Date" 
     value={date} 
     onChange={setDate}
   />
   ```

4. **Access selected date:**
   ```jsx
   console.log(date); // Date object or null
   ```

---

## Browser Support
✅ All modern browsers (Chrome, Firefox, Safari, Edge)

---

## Need Help?
- Check `DatePickerExamples.jsx` for more usage examples
- See `PaymentForm.jsx` for a complete form implementation
- All components are well-commented

Happy coding! 🚀
