'use client';

import { useState } from 'react';
import { LocationDropdown } from '@/components/admin/LocationDropdown';
import { Button } from '@/components/ui/button';

export default function TestLocationPage() {
    const [selectedLocation, setSelectedLocation] = useState('');

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Location Dropdown Test</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Location</label>
                    <LocationDropdown
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        placeholder="Choose a destination..."
                    />
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold mb-2">Selected Location:</h3>
                    <p className="text-gray-700">
                        {selectedLocation || 'No location selected'}
                    </p>
                </div>

                <div className="space-y-2">
                    <Button
                        onClick={() => setSelectedLocation('')}
                        variant="outline"
                    >
                        Clear Selection
                    </Button>

                    <Button
                        onClick={() => setSelectedLocation('Masai Mara')}
                        variant="outline"
                    >
                        Set to Masai Mara
                    </Button>

                    <Button
                        onClick={() => setSelectedLocation('Custom Location Test')}
                        variant="outline"
                    >
                        Set to Custom Location
                    </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Features to Test:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>Click dropdown to see Kenya destinations</li>
                        <li>Search for specific destinations</li>
                        <li>Select "Other (Custom Location)" to enter custom text</li>
                        <li>Verify custom locations are marked as such</li>
                        <li>Test form integration</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
