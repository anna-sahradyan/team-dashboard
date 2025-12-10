
import { ApiUser } from "@/components/table/MuiTable";

const API_URL = '/api/users';

export const fetchUsers = async (): Promise<ApiUser[]> => {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch users from server');
        return res.json();
    } catch {
        // fallback на JSONPlaceholder
        const fallback = await fetch('https://jsonplaceholder.typicode.com/users');
        return fallback.json();
    }
};

export const addUser = async (user: { name: string; email: string; role: string }) => {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Failed to add user on server');
        return res.json();
    } catch {
        return { id: Date.now(), ...user };
    }
};
