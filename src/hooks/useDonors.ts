'use client';
import { useEffect, useState } from 'react';
import { fetchDonors } from '@/lib/api-client';
import type { Donor, FireDepartment, ProductDonation } from '@/types';
export type { Donor, FireDepartment, ProductDonation } from '@/types';
export const useDonors = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const loadDonors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchDonors();
            setDonors(response.data || []);
        }
        catch (err: any) {
            console.log('Error fetching donors:', err);
            setError(err.message || 'Failed to fetch donors');
        }
        finally {
            setLoading(false);
            if (initialLoading) {
                setInitialLoading(false);
            }
        }
    };
    useEffect(() => {
        loadDonors();
        const interval = setInterval(() => {
            loadDonors();
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    const refetch = async () => {
        await loadDonors();
    };
    return { donors, loading, initialLoading, error, refetch };
};
