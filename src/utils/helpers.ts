import crypto from 'crypto';

export function generateId(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateSuiteNumber(): string {
  // Generate a suite number in format: STE-XXXXX
  const number = Math.floor(10000 + Math.random() * 90000);
  return `STE-${number}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatAddress(address: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  suiteNumber?: string;
}): string {
  const suite = address.suiteNumber ? `Suite ${address.suiteNumber}, ` : '';
  return `${suite}${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
}
