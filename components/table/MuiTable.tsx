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
    SelectChangeEvent, Snackbar, Alert,
} from "@mui/material";
import {useMemo, useState} from "react";
import {MuiBreadcrumbs} from "@/components/MuiBreadcrabs";
import {useQuery} from "@tanstack/react-query";
import {fetchUsers} from "@/services/userService";

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

export const MuiTable = ({itemsPerPage = 10}: MuiTableProps) => {
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
    const allUsers: (ApiUser | UiUser)[] = [...(data || []), ...addedUsers];
    const showWarning = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };
    const transformedUsers: UiUser[] = useMemo(() => {
        return allUsers.map((user) => ({
            ...user,
            role: 'role' in user ? user.role : roles[user.id % roles.length],
            status: 'status' in user ? user.status : statuses[user.id % statuses.length],
            avatar: 'avatar' in user ? user.avatar : `https://i.pravatar.cc/150?u=${user.id}`,
        }));
    }, [allUsers]);

    if (isLoading) return <CircularProgress sx={{display: 'block', margin: '50px auto'}}/>;
    if (isError) return <Typography color="error" textAlign="center">Error loading users</Typography>

    const filteredUsers = transformedUsers.filter(user =>
        (user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())) &&
        (roleFilter === '' || user.role === roleFilter)
    );

    const start = (page - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + itemsPerPage);
    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleRoleChange = (e: SelectChangeEvent<string>) => {
        setRoleFilter(e.target.value);
        setPage(1);
    };

    const handleAddUser = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newUserName.trim() || !emailRegex.test(newUserEmail)) {
            showWarning('Please enter a valid name and email');
            return;
        }

        const newUser: UiUser = {
            id: Date.now(),
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            status: 'Active',
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        };
        setAddedUsers([...addedUsers, newUser]);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole(roles[0]);
        const newPageCount = Math.ceil((transformedUsers.length + 1) / itemsPerPage);
        setPage(newPageCount);
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole(roles[0]);
        setOpenDialog(true);
    };
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
                                <TableRow key={user.id}>
                                    <TableCell><Avatar src={user.avatar} alt={user.name}/></TableCell>
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
