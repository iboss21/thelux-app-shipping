import { User, USAAddress } from '../models/types';
import { generateId, generateSuiteNumber } from '../utils/helpers';

class UserService {
  private users: Map<string, User> = new Map();
  private usedSuiteNumbers: Set<string> = new Set();

  // USA warehouse address base
  private readonly warehouseAddress = {
    street: '1234 Shipping Way',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101'
  };

  createUser(name: string, email: string, homeCountry: string, homeAddress: string): User {
    const userId = generateId();
    const suiteNumber = this.generateUniqueSuiteNumber();
    
    const usaAddress: USAAddress = {
      id: generateId(),
      ...this.warehouseAddress,
      suiteNumber
    };

    const user: User = {
      id: userId,
      name,
      email,
      homeCountry,
      homeAddress,
      usaAddress,
      createdAt: new Date()
    };

    this.users.set(userId, user);
    this.usedSuiteNumbers.add(suiteNumber);
    
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(userId: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    this.usedSuiteNumbers.delete(user.usaAddress.suiteNumber);
    return this.users.delete(userId);
  }

  private generateUniqueSuiteNumber(): string {
    let suiteNumber: string;
    do {
      suiteNumber = generateSuiteNumber();
    } while (this.usedSuiteNumbers.has(suiteNumber));
    
    return suiteNumber;
  }
}

export default new UserService();
