import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

interface PackageBookingFormModalProps {
    open: boolean;
    onClose: () => void;
    packageName: string;
}

const paymentMethods = [
    'M-Pesa',
    'Credit Card',
    'Cash on Arrival',
];

const fieldHelpers: Record<string, string> = {
    fullName: 'Please enter your full legal name as it appears on your ID/passport.',
    phone: 'Include your country code for accurate contact.',
    email: 'We will send your booking confirmation to this email.',
    nationality: 'Select your nationality for booking requirements.',
    travelers: 'How many people are booking this package?',
    startDate: 'Select your preferred start date.',
    special: 'Let us know any special requests (optional).',
    payment: 'Choose your preferred payment method.',
};

export const PackageBookingFormModal: React.FC<PackageBookingFormModalProps> = ({ open, onClose, packageName }) => {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        nationality: '',
        travelers: 1,
        startDate: '',
        special: '',
        payment: paymentMethods[0],
    });
    const [submitting, setSubmitting] = useState(false);
    const [showHelper, setShowHelper] = useState<Record<string, boolean>>({});
    const countryOptions = countryList().getData();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleFocus = (field: string) => {
        setShowHelper((prev) => ({ ...prev, [field]: true }));
    };
    const handleBlur = (field: string) => {
        setTimeout(() => setShowHelper((prev) => ({ ...prev, [field]: false })), 1500);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setShowHelper((prev) => ({ ...prev, [name]: false }));
    };
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: Number(value) }));
        setShowHelper((prev) => ({ ...prev, [name]: false }));
    };
    const handlePhoneChange = (value: string) => {
        setForm((prev) => ({ ...prev, phone: value }));
        setShowHelper((prev) => ({ ...prev, phone: false }));
    };
    const handleNationalityChange = (option: any) => {
        setForm((prev) => ({ ...prev, nationality: option ? option.label : '' }));
        setShowHelper((prev) => ({ ...prev, nationality: false }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('/api/book-package', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, packageName }),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Booking request sent! We will contact you soon.');
                setSubmitting(false);
                onClose();
            } else {
                toast.error(result.error || 'Failed to send booking request.');
                setSubmitting(false);
            }
        } catch (err: any) {
            toast.error('An error occurred. Please try again.');
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Package Booking Request</h2>
                <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                    {/* Full Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                onFocus={() => handleFocus('fullName')}
                                onBlur={() => handleBlur('fullName')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.fullName && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.fullName}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number <span className="text-gray-400 text-xs">(required)</span></label>
                            <PhoneInput
                                country={'ke'}
                                value={form.phone}
                                onChange={handlePhoneChange}
                                inputClass="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                inputStyle={{ width: '100%' }}
                                onFocus={() => handleFocus('phone')}
                                onBlur={() => handleBlur('phone')}
                                specialLabel=""
                                required
                            />
                            {showHelper.phone && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.phone}</div>}
                        </div>
                    </div>
                    {/* Email & Nationality */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email Address <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                onFocus={() => handleFocus('email')}
                                onBlur={() => handleBlur('email')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.email && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.email}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nationality <span className="text-gray-400 text-xs">(required)</span></label>
                            <Select
                                options={countryOptions}
                                value={countryOptions.find(option => option.label === form.nationality)}
                                onChange={handleNationalityChange}
                                onFocus={() => handleFocus('nationality')}
                                onBlur={() => handleBlur('nationality')}
                                classNamePrefix="react-select"
                                placeholder="Select nationality..."
                                isSearchable
                                required
                            />
                            {showHelper.nationality && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.nationality}</div>}
                        </div>
                    </div>
                    {/* Travelers & Start Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Travelers <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="number"
                                name="travelers"
                                min={1}
                                value={form.travelers}
                                onChange={handleNumberChange}
                                onFocus={() => handleFocus('travelers')}
                                onBlur={() => handleBlur('travelers')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.travelers && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.travelers}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Preferred Start Date <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                onFocus={() => handleFocus('startDate')}
                                onBlur={() => handleBlur('startDate')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.startDate && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.startDate}</div>}
                        </div>
                    </div>
                    {/* Special Requests */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Special Requests</label>
                        <textarea
                            name="special"
                            value={form.special}
                            onChange={handleChange}
                            onFocus={() => handleFocus('special')}
                            onBlur={() => handleBlur('special')}
                            rows={3}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                        />
                        {showHelper.special && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.special}</div>}
                    </div>
                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Preferred Payment Method <span className="text-gray-400 text-xs">(required)</span></label>
                        <select
                            name="payment"
                            value={form.payment}
                            onChange={handleChange}
                            onFocus={() => handleFocus('payment')}
                            onBlur={() => handleBlur('payment')}
                            required
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                        >
                            {paymentMethods.map((method) => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                        {showHelper.payment && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.payment}</div>}
                    </div>
                    {/* Hidden Package Name */}
                    <input type="hidden" name="packageName" value={packageName} />
                    <p className="text-xs text-gray-500 text-center sm:text-left">
                        By submitting, you agree to our{" "}
                        <a
                            href="https://listwr.com/live-privacy-policy&token=d2e96632b36184bdf38355c7c1678a40e3205a0e"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Privacy Policy
                        </a>
                        .
                    </p>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackageBookingFormModal; 