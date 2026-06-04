import { useState } from 'react';
import DatePicker from './DatePicker';

const PaymentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    plan: 'monthly',
    transactionDate: new Date(),
    screenshot: null,
    description: ''
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      transactionDate: date
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        screenshot: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.screenshot || !formData.transactionDate) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Call parent's onSubmit function or API
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form
      setFormData({
        amount: '',
        plan: 'monthly',
        transactionDate: new Date(),
        screenshot: null,
        description: ''
      });
      setPreview(null);
      
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
              className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Type <span className="text-red-500">*</span>
          </label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="monthly">Monthly - ₹500</option>
            <option value="quarterly">Quarterly - ₹1200</option>
            <option value="halfyearly">Half Yearly - ₹2000</option>
            <option value="yearly">Yearly - ₹3500</option>
          </select>
        </div>

        {/* Date Picker */}
        <DatePicker
          label="Transaction Date"
          value={formData.transactionDate}
          onChange={handleDateChange}
          maxDate={new Date()}
          placeholder="Select payment date"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add any additional details..."
            rows="3"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Screenshot <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="hidden"
              id="screenshot-input"
            />
            <label htmlFor="screenshot-input" className="cursor-pointer">
              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
                  <p className="text-sm text-blue-600 font-medium">{formData.screenshot.name}</p>
                  <p className="text-xs text-gray-500">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="20" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M40 12l-8 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
