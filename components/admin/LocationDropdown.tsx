'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

// Standard Kenya destinations - popular tourist locations
const KENYA_DESTINATIONS = [
    'Nairobi',
    'Mombasa',
    'Diani',
    'Masai Mara',
    'Amboseli',
    'Lake Nakuru',
    'Samburu',
    'Malindi',
    'Watamu',
    'Naivasha',
    'Voi',
    'Lamu',
    'Tsavo East',
    'Tsavo West',
    'Hell\'s Gate',
    'Mount Kenya',
    'Lake Bogoria',
    'Lake Baringo',
    'Meru National Park',
    'Aberdare National Park',
    'Ol Pejeta Conservancy',
    'Lewa Wildlife Conservancy',
    'Shimba Hills',
    'Arabuko Sokoke Forest',
    'Kakamega Forest',
    'Mount Elgon',
    'Lake Victoria',
    'Kisumu',
    'Eldoret',
    'Nakuru',
    'Thika'
];

interface LocationDropdownProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function LocationDropdown({
    value,
    onChange,
    placeholder = "Select or type location...",
    className
}: LocationDropdownProps) {
    const [open, setOpen] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherValue, setOtherValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    // Check if current value is a standard destination
    const isStandardDestination = KENYA_DESTINATIONS.includes(value);

    // Handle location selection
    const handleLocationSelect = (selectedValue: string) => {
        if (selectedValue === 'other') {
            setShowOtherInput(true);
            setOpen(false);
            // Keep the current value if it's not a standard destination
            if (!isStandardDestination && value) {
                setOtherValue(value);
            }
        } else {
            onChange(selectedValue);
            setShowOtherInput(false);
            setOtherValue('');
            setOpen(false);
        }
    };

    // Handle other input submission
    const handleOtherSubmit = () => {
        if (otherValue.trim()) {
            onChange(otherValue.trim());
            setShowOtherInput(false);
            setOtherValue('');
        }
    };

    // Handle other input change
    const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherValue(e.target.value);
    };

    // Filter destinations based on search
    const filteredDestinations = KENYA_DESTINATIONS.filter(dest =>
        dest.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Reset when value changes externally
    useEffect(() => {
        if (isStandardDestination) {
            setShowOtherInput(false);
            setOtherValue('');
        }
    }, [value, isStandardDestination]);

    return (
        <div className={cn("w-full", className)}>
            {showOtherInput ? (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter custom location..."
                            value={otherValue}
                            onChange={handleOtherChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleOtherSubmit();
                                }
                            }}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowOtherInput(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleOtherSubmit}
                        disabled={!otherValue.trim()}
                    >
                        Use Custom Location
                    </Button>
                </div>
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {value || placeholder}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Command>
                            <CommandInput
                                placeholder="Search destinations..."
                                value={searchValue}
                                onValueChange={setSearchValue}
                            />
                            <CommandList>
                                <CommandEmpty>No destination found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredDestinations.map((destination) => (
                                        <CommandItem
                                            key={destination}
                                            value={destination}
                                            onSelect={() => handleLocationSelect(destination)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === destination ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {destination}
                                        </CommandItem>
                                    ))}
                                    <CommandItem
                                        value="other"
                                        onSelect={() => handleLocationSelect('other')}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                !isStandardDestination && value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        Other (Custom Location)
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}

            {/* Display current selection info */}
            {value && (
                <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Selected:</span> {value}
                    {!isStandardDestination && (
                        <span className="ml-2 text-blue-600">(Custom location)</span>
                    )}
                </div>
            )}
        </div>
    );
}
