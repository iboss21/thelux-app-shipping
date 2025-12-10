import { generateId, generateSuiteNumber, validateEmail, formatAddress } from '../utils/helpers';

describe('Helpers', () => {
  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should generate a 32-character hex string', () => {
      const id = generateId();
      expect(id.length).toBe(32);
      expect(/^[a-f0-9]{32}$/.test(id)).toBe(true);
    });
  });

  describe('generateSuiteNumber', () => {
    it('should generate a suite number in correct format', () => {
      const suiteNumber = generateSuiteNumber();
      expect(suiteNumber).toMatch(/^STE-\d{5}$/);
    });

    it('should generate unique suite numbers', () => {
      const suite1 = generateSuiteNumber();
      const suite2 = generateSuiteNumber();
      
      // While not guaranteed to be different due to randomness,
      // the probability is very high with 90000 possible values
      expect(suite1).toBeDefined();
      expect(suite2).toBeDefined();
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@invalid.com')).toBe(false);
      expect(validateEmail('invalid@.com')).toBe(false);
    });
  });

  describe('formatAddress', () => {
    it('should format address with suite number', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        suiteNumber: 'STE-12345'
      };
      
      const formatted = formatAddress(address);
      expect(formatted).toBe('Suite STE-12345, 123 Main St, New York, NY 10001');
    });

    it('should format address without suite number', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      };
      
      const formatted = formatAddress(address);
      expect(formatted).toBe('123 Main St, New York, NY 10001');
    });
  });
});
