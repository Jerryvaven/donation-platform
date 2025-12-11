'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Leaderboard from '@/components/user/Leaderboard';
export default function page() {
    const router = useRouter();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasConfirmationMessage = urlParams.get('message')?.includes('Confirmation') ||
            hashParams.get('message')?.includes('Confirmation') ||
            urlParams.get('type') === 'email_confirmation' ||
            hashParams.get('type') === 'email_confirmation';
        if (hasConfirmationMessage) {
            const confirmationMessage = { type: 'success' as const, text: 'Email confirmed successfully! Your email has been updated.' };
            localStorage.setItem('emailConfirmationMessage', JSON.stringify(confirmationMessage));
            router.push('/admin/profile');
            return;
        }
    }, [router]);
    return (<Leaderboard />);
}
