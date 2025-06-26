'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MakeAdminPage() {
    const { user } = useAuth();

    const handleMakeAdmin = async () => {
        if (!user) {
            toast.error('You must be logged in to perform this action.');
            return;
        }

        const targetEmail = prompt("Enter the email address to make an admin:", user.email || "");
        if (!targetEmail) {
            toast.info("Action cancelled.");
            return;
        }

        try {
            toast.info(`Attempting to make ${targetEmail} an admin...`);
            const token = await user.getIdToken();

            const response = await fetch('/api/auth/set-admin-claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: targetEmail }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.details || 'Failed to set admin claim.');
            }

            toast.success(result.message);
            toast.info('Please log out and log back in for the changes to take effect.');

        } catch (error: any) {
            toast.error(error.message);
            console.error('Error in MakeAdminPage:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Admin Claim Setter</h1>
                <p className="mb-6">Click the button below to grant admin privileges to a user.</p>
                <Button onClick={handleMakeAdmin} disabled={!user}>
                    Make User an Admin
                </Button>
                {!user && <p className="text-red-500 mt-4">Please log in first.</p>}
            </div>
        </div>
    );
} 