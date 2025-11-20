import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

interface BookingFormModalProps {
    open: boolean;
    onClose: () => void;
    hotelName: string;
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
    roomType: 'Specify if you have a preferred room type (optional).',
    guests: 'How many people will be staying?',
    rooms: 'How many rooms do you need?',
    checkin: 'Select your check-in date.',
    checkout: 'Select your check-out date.',
    special: 'Let us know any special requests (optional).',
    payment: 'Choose your preferred payment method.',
};

const roomTypeOptions = [
    { value: 'Single Room', label: 'Single Room' },
    { value: 'Double Room', label: 'Double Room' },
    { value: 'Twin Room', label: 'Twin Room' },
    { value: 'Deluxe Room', label: 'Deluxe Room' },
    { value: 'Superior Room', label: 'Superior Room' },
    { value: 'Suite', label: 'Suite' },
    { value: 'Junior Suite', label: 'Junior Suite' },
    { value: 'Executive Suite', label: 'Executive Suite' },
    { value: 'Family Room', label: 'Family Room' },
    { value: 'Studio Room', label: 'Studio Room' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Bungalow', label: 'Bungalow' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Connecting Room', label: 'Connecting Room' },
    { value: 'Accessible Room', label: 'Accessible Room' },
    { value: 'Presidential Suite', label: 'Presidential Suite' },
    { value: 'Honeymoon Suite', label: 'Honeymoon Suite' },
    { value: 'Dormitory', label: 'Dormitory' },
    { value: 'Cabana', label: 'Cabana' },
    { value: 'Cottage', label: 'Cottage' },
    { value: 'Not Sure / Other', label: 'Not Sure / Other', value: 'other' },
];

export const BookingFormModal: React.FC<BookingFormModalProps> = ({ open, onClose, hotelName }) => {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        nationality: '',
        roomType: '',
        guests: 1,
        rooms: 1,
        checkin: '',
        checkout: '',
        special: '',
        payment: paymentMethods[0],
    });
    const [submitting, setSubmitting] = useState(false);
    const [showHelper, setShowHelper] = useState<Record<string, boolean>>({});
    const countryOptions = countryList().getData();
    const [roomTypeOther, setRoomTypeOther] = useState('');

    // Lock background scroll when modal is open
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

    // Show helper text on focus, hide after typing
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
    const handleRoomTypeChange = (option: any) => {
        setForm((prev) => ({ ...prev, roomType: option ? option.value : '' }));
        setShowHelper((prev) => ({ ...prev, roomType: false }));
        if (option && option.value !== 'other') {
            setRoomTypeOther('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const roomTypeToSend = form.roomType === 'other' ? roomTypeOther : form.roomType;
            const response = await fetch('/api/book-hotel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, roomType: roomTypeToSend, hotelName }),
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
                <h2 className="text-xl font-bold mb-4">Hotel Booking Request</h2>
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
                    {/* Hotel Name & Room Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hotel Name</label>
                            <input
                                type="text"
                                name="hotelName"
                                value={hotelName}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Room Type</label>
                            <Select
                                options={roomTypeOptions}
                                value={roomTypeOptions.find(option => option.value === form.roomType) || null}
                                onChange={handleRoomTypeChange}
                                onFocus={() => handleFocus('roomType')}
                                onBlur={() => handleBlur('roomType')}
                                classNamePrefix="react-select"
                                placeholder="Select room type..."
                                isSearchable={false}
                            />
                            {form.roomType === 'other' && (
                                <input
                                    type="text"
                                    name="roomTypeOther"
                                    value={roomTypeOther}
                                    onChange={e => setRoomTypeOther(e.target.value)}
                                    placeholder="Please specify room type"
                                    className="w-full border rounded px-3 py-2 mt-2 focus:outline-none focus:ring focus:border-blue-400"
                                />
                            )}
                            {showHelper.roomType && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.roomType}</div>}
                        </div>
                    </div>
                    {/* Guests & Rooms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Guests <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="number"
                                name="guests"
                                min={1}
                                value={form.guests}
                                onChange={handleNumberChange}
                                onFocus={() => handleFocus('guests')}
                                onBlur={() => handleBlur('guests')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.guests && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.guests}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Rooms <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="number"
                                name="rooms"
                                min={1}
                                value={form.rooms}
                                onChange={handleNumberChange}
                                onFocus={() => handleFocus('rooms')}
                                onBlur={() => handleBlur('rooms')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.rooms && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.rooms}</div>}
                        </div>
                    </div>
                    {/* Check-in & Check-out */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in Date <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="date"
                                name="checkin"
                                value={form.checkin}
                                onChange={handleChange}
                                onFocus={() => handleFocus('checkin')}
                                onBlur={() => handleBlur('checkin')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.checkin && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.checkin}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-out Date <span className="text-gray-400 text-xs">(required)</span></label>
                            <input
                                type="date"
                                name="checkout"
                                value={form.checkout}
                                onChange={handleChange}
                                onFocus={() => handleFocus('checkout')}
                                onBlur={() => handleBlur('checkout')}
                                required
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                            {showHelper.checkout && <div className="text-xs text-gray-500 mt-1 animate-fade-in">{fieldHelpers.checkout}</div>}
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
                    {/* Actions */}
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

export default BookingFormModal; 