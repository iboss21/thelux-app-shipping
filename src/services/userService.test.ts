import userService from '../services/userService';

describe('UserService', () => {
  beforeEach(() => {
    // Clear all users before each test
    const users = userService.getAllUsers();
    users.forEach(user => userService.deleteUser(user.id));
  });

  describe('createUser', () => {
    it('should create a new user with USA address', () => {
      const user = userService.createUser(
        'John Doe',
        'john@example.com',
        'United Kingdom',
        '10 Downing Street, London'
      );

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.homeCountry).toBe('United Kingdom');
      expect(user.usaAddress).toBeDefined();
      expect(user.usaAddress.suiteNumber).toMatch(/^STE-\d{5}$/);
      expect(user.usaAddress.city).toBe('Miami');
      expect(user.usaAddress.state).toBe('FL');
    });

    it('should assign unique suite numbers to different users', () => {
      const user1 = userService.createUser('User 1', 'user1@example.com', 'UK', 'Address 1');
      const user2 = userService.createUser('User 2', 'user2@example.com', 'FR', 'Address 2');

      expect(user1.usaAddress.suiteNumber).not.toBe(user2.usaAddress.suiteNumber);
    });
  });

  describe('getUser', () => {
    it('should retrieve an existing user', () => {
      const created = userService.createUser('Jane Doe', 'jane@example.com', 'Canada', 'Toronto Address');
      const retrieved = userService.getUser(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.name).toBe('Jane Doe');
    });

    it('should return undefined for non-existent user', () => {
      const retrieved = userService.getUser('non-existent-id');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', () => {
      userService.createUser('User 1', 'user1@example.com', 'UK', 'Address 1');
      userService.createUser('User 2', 'user2@example.com', 'FR', 'Address 2');

      const users = userService.getAllUsers();
      expect(users.length).toBe(2);
    });

    it('should return empty array when no users exist', () => {
      const users = userService.getAllUsers();
      expect(users).toEqual([]);
    });
  });

  describe('updateUser', () => {
    it('should update user information', () => {
      const user = userService.createUser('Original Name', 'original@example.com', 'UK', 'Address');
      const updated = userService.updateUser(user.id, { name: 'Updated Name' });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.email).toBe('original@example.com');
    });

    it('should return undefined for non-existent user', () => {
      const updated = userService.updateUser('non-existent-id', { name: 'New Name' });
      expect(updated).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', () => {
      const user = userService.createUser('Test User', 'test@example.com', 'UK', 'Address');
      const deleted = userService.deleteUser(user.id);

      expect(deleted).toBe(true);
      expect(userService.getUser(user.id)).toBeUndefined();
    });

    it('should return false for non-existent user', () => {
      const deleted = userService.deleteUser('non-existent-id');
      expect(deleted).toBe(false);
    });
  });
});
