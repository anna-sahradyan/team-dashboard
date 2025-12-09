// tests/userService.test.ts
import { fetchUsers } from '@/services/userService';

// Мокаешь глобальный fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve([
                { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
                { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
                // ... можно добавить все 10 или только нужные
            ]),
    } as Response)
);

describe('fetchUsers (mocked)', () => {
    it('returns parsed users', async () => {
        const users = await fetchUsers();
        expect(users).toHaveLength(2);
        expect(users[0].email).toBe('Sincere@april.biz');
    });
});