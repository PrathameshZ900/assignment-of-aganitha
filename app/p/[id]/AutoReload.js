'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoReload({ expiresAt }) {
    const router = useRouter();

    useEffect(() => {
        if (!expiresAt) return;

        const checkExpiry = () => {
            const now = Date.now();
            const timeLeft = expiresAt - now;

            if (timeLeft <= 0) {
                // Time is up, reload to show 404/expired state
                window.location.reload();
            } else {
                // Check again when time is up
                const timer = setTimeout(() => {
                    window.location.reload();
                }, timeLeft);
                return () => clearTimeout(timer);
            }
        };

        return checkExpiry();
    }, [expiresAt, router]);

    return null; // Logic only, no UI
}
