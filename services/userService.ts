import { ApiUser } from "@/components/table/MuiTable";

export const fetchUsers = async (): Promise<ApiUser[]> => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};
