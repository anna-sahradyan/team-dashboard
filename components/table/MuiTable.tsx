'use client'

import {
    Avatar,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Pagination,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    SelectChangeEvent,
    Snackbar,
    Alert,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import { MuiBreadcrumbs } from "@/components/MuiBreadcrabs";
import { useQuery } from "@tanstack/react-query";
import {addUser, fetchUsers} from "@/services/userService";

// Типы
export interface ApiUser {
    id: number;
    name: string;
    email: string;
}

const roles = ['Admin', 'Manager', 'Developer', 'Designer'] as const;
const statuses = ['Active', 'Inactive', 'Pending'] as const;

interface UiUser extends ApiUser {
    role: typeof roles[number];
    status: typeof statuses[number];
    avatar: string;
}

interface MuiTableProps {
    itemsPerPage?: number;
}

/* ----- Мемоизированный набор ячеек (оставляем TableRow в месте вызова, чтобы разметка не менялась) ----- */
const RowCells = memo(({ user }: { user: UiUser }) => {
    return (
        <>
            <TableCell><Avatar src={user.avatar} alt={user.name} /></TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell sx={{
                backgroundColor:
                    user.status === 'Active' ? '#E6F4EA' :
                        user.status === 'Inactive' ? '#F0F0F0' :
                            '#FFF4E5',
                color:
                    user.status === 'Active' ? 'green' :
                        user.status === 'Inactive' ? 'gray' :
                            'orange',
                borderRadius: '4px',
                textAlign: 'center'
            }}>
                {user.status}
            </TableCell>
        </>
    );
});
RowCells.displayName = "RowCells";

export const MuiTable = ({ itemsPerPage = 10 }: MuiTableProps) => {
    const { data, isLoading, isError } = useQuery<ApiUser[], Error>({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | ''>('');
    const [page, setPage] = useState(1);

    const [openDialog, setOpenDialog] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState<typeof roles[number]>(roles[0]);

    const [addedUsers, setAddedUsers] = useState<UiUser[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const nextIdRef = useRef<number>(1);
    // Обновляем начальный nextId, когда подгрузятся данные
    useEffect(() => {
        if (data && data.length) {
            nextIdRef.current = data.length + 1;
        }
    }, [data]);

    const showWarning = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    /* ------------- разделяем трансформацию API пользователей и добавленных ------------- */
    const transformedApiUsers = useMemo<UiUser[]>(() => {
        if (!data) return [];
        return data.map((user, idx) => ({
            ...user,
            role: roles[idx % roles.length],
            status: statuses[idx % statuses.length],
            avatar: `https://i.pravatar.cc/150?u=${user.id}`,
        }));
    }, [data]);

    const transformedAddedUsers = useMemo<UiUser[]>(() => {
        // addedUsers уже приходят как UiUser — но мы всё равно можем гарантировать shape
        return addedUsers.map(u => ({ ...u }));
    }, [addedUsers]);

    /* ------------- объединённый список (used for filtering/pagination) ------------- */
    const allUsers = useMemo<UiUser[]>(() => {
        return [...transformedApiUsers, ...transformedAddedUsers];
    }, [transformedApiUsers, transformedAddedUsers]);

    /* ------------- фильтрация — мемоизация по allUsers, search, roleFilter ------------- */
    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return allUsers.filter(user =>
            ((user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q))) &&
            (roleFilter === '' || user.role === roleFilter)
        );
    }, [allUsers, search, roleFilter]);

    const start = useMemo(() => (page - 1) * itemsPerPage, [page, itemsPerPage]);
    const paginatedUsers = useMemo(() => filteredUsers.slice(start, start + itemsPerPage), [filteredUsers, start, itemsPerPage]);
    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

    /* ----- handlers ----- */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleRoleChange = (e: SelectChangeEvent<string>) => {
        setRoleFilter(e.target.value);
        setPage(1);
    };

    const handleAddUser = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newUserName.trim() || !emailRegex.test(newUserEmail)) {
            showWarning('Please enter a valid name and email');
            return;
        }

        const newUserData = {
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
        };

        try {
            // отправляем на сервер
            const added = await addUser(newUserData);

            // формируем UiUser для таблицы
            const newUser: UiUser = {
                id: added.id, // серверный ID или локальный fallback
                name: added.name,
                email: added.email,
                role: added.role as typeof roles[number],
                status: 'Active',
                avatar: `https://i.pravatar.cc/150?u=${added.id}`,
            };

            setAddedUsers(prev => [...prev, newUser]);

            setNewUserName('');
            setNewUserEmail('');
            setNewUserRole(roles[0]);

            const newPage = Math.ceil((filteredUsers.length + 1) / itemsPerPage);
            setPage(newPage);

            setOpenDialog(false);
        } catch (err) {
            showWarning('Failed to add user. Try again later.');
            console.error(err);
        }
    };

    const handleOpenDialog = () => {
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole(roles[0]);
        setOpenDialog(true);
    };

    if (isLoading) return <CircularProgress sx={{display: 'block', margin: '50px auto'}}/>;
    if (isError) return <Typography color="error" textAlign="center">Error loading users</Typography>;

    return (
        <Paper sx={{maxWidth: '100%', margin: '20px auto', p: 2}}>
            {/* Верхний фильтр-блок */}
            <MuiBreadcrumbs/>
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
                <TextField
                    size="small"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={handleSearchChange}
                    sx={{minWidth: '150px', width: '100%'}}
                />

                <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-start">
                    <Select
                        size="small"
                        value={roleFilter}
                        onChange={handleRoleChange}
                        displayEmpty
                        sx={{minWidth: '120px'}}
                    >
                        <MenuItem value=''>All Roles</MenuItem>
                        {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDialog}
                    >
                        Add User
                    </Button>
                </Box>
            </Box>

            {/* Таблица */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map(user => (
                                // оставляем TableRow в том же виде — меняется только содержимое через RowCells (мемо)
                                <TableRow key={user.id}>
                                    <RowCells user={user}/>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Пагинация */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_event, value: number) => setPage(value)}
                    color="primary"
                />
            </Box>

            {/* Диалог добавления пользователя */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300}}>
                    <TextField
                        label="Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                    <Select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as typeof roles[number])}
                    >
                        {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddUser} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity="warning" sx={{width: '100%'}} onClose={() => setSnackbarOpen(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};
