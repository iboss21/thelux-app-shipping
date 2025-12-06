import packageService from '../services/packageService';
import { PackageStatus, ShippingMethod } from '../models/types';

describe('PackageService', () => {
  beforeEach(() => {
    // Clear all packages before each test
    const packages = packageService.getAllPackages();
    packages.forEach(pkg => {
      // We need to access the private map, so we'll just create a new test scenario
    });
  });

  describe('receivePackage', () => {
    it('should receive a new package', () => {
      const pkg = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Electronics',
        2.5,
        { length: 30, width: 20, height: 15 }
      );

      expect(pkg).toBeDefined();
      expect(pkg.id).toBeDefined();
      expect(pkg.userId).toBe('user-123');
      expect(pkg.trackingNumber).toBe('TRACK-001');
      expect(pkg.status).toBe(PackageStatus.RECEIVED);
      expect(pkg.receivedAt).toBeDefined();
    });

    it('should set correct package properties', () => {
      const pkg = packageService.receivePackage(
        'user-456',
        'TRACK-002',
        'Books',
        5.0,
        { length: 40, width: 30, height: 10 }
      );

      expect(pkg.weight).toBe(5.0);
      expect(pkg.dimensions.length).toBe(40);
      expect(pkg.dimensions.width).toBe(30);
      expect(pkg.dimensions.height).toBe(10);
    });
  });

  describe('getPackage', () => {
    it('should retrieve an existing package', () => {
      const created = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Test Package',
        1.0,
        { length: 10, width: 10, height: 10 }
      );

      const retrieved = packageService.getPackage(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });

    it('should return undefined for non-existent package', () => {
      const retrieved = packageService.getPackage('non-existent-id');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('getUserPackages', () => {
    it('should return all packages for a user', () => {
      packageService.receivePackage('user-1', 'TRACK-001', 'Package 1', 1.0, { length: 10, width: 10, height: 10 });
      packageService.receivePackage('user-1', 'TRACK-002', 'Package 2', 2.0, { length: 20, width: 20, height: 20 });
      packageService.receivePackage('user-2', 'TRACK-003', 'Package 3', 3.0, { length: 30, width: 30, height: 30 });

      const user1Packages = packageService.getUserPackages('user-1');
      expect(user1Packages.length).toBe(2);
      expect(user1Packages.every(pkg => pkg.userId === 'user-1')).toBe(true);
    });
  });

  describe('updatePackageStatus', () => {
    it('should update package status', () => {
      const pkg = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Test Package',
        1.0,
        { length: 10, width: 10, height: 10 }
      );

      const updated = packageService.updatePackageStatus(pkg.id, PackageStatus.PROCESSING);
      expect(updated).toBeDefined();
      expect(updated?.status).toBe(PackageStatus.PROCESSING);
    });

    it('should set forwardedAt when status changes to IN_TRANSIT', () => {
      const pkg = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Test Package',
        1.0,
        { length: 10, width: 10, height: 10 }
      );

      const updated = packageService.updatePackageStatus(pkg.id, PackageStatus.IN_TRANSIT);
      expect(updated?.forwardedAt).toBeDefined();
    });

    it('should set deliveredAt when status changes to DELIVERED', () => {
      const pkg = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Test Package',
        1.0,
        { length: 10, width: 10, height: 10 }
      );

      const updated = packageService.updatePackageStatus(pkg.id, PackageStatus.DELIVERED);
      expect(updated?.deliveredAt).toBeDefined();
    });
  });

  describe('forwardPackage', () => {
    it('should forward a received package', () => {
      const pkg = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Test Package',
        1.0,
        { length: 10, width: 10, height: 10 }
      );

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

      const forwarded = packageService.forwardPackage({
        packageId: pkg.id,
        shippingMethod: ShippingMethod.AIR_FREIGHT,
        destinationAddress: '123 Main St',
        destinationCountry: 'United Kingdom',
        estimatedDelivery
      });

      expect(forwarded).toBeDefined();
      expect(forwarded?.status).toBe(PackageStatus.IN_TRANSIT);
      expect(forwarded?.shippingMethod).toBe(ShippingMethod.AIR_FREIGHT);
      expect(forwarded?.forwardedAt).toBeDefined();
    });

    it('should throw error when forwarding package with invalid status', () => {
      const pkg = packageService.receivePackage(
        'user-123',
        'TRACK-001',
        'Test Package',
        1.0,
        { length: 10, width: 10, height: 10 }
      );

      // First forward it
      packageService.forwardPackage({
        packageId: pkg.id,
        shippingMethod: ShippingMethod.AIR_FREIGHT,
        destinationAddress: '123 Main St',
        destinationCountry: 'United Kingdom',
        estimatedDelivery: new Date()
      });

      // Try to forward again
      expect(() => {
        packageService.forwardPackage({
          packageId: pkg.id,
          shippingMethod: ShippingMethod.SEA_FREIGHT,
          destinationAddress: '456 Second St',
          destinationCountry: 'France',
          estimatedDelivery: new Date()
        });
      }).toThrow();
    });
  });

  describe('calculateShippingCost', () => {
    it('should calculate air freight cost correctly', () => {
      const cost = packageService.calculateShippingCost(5, ShippingMethod.AIR_FREIGHT, 'Europe');
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBe(5 * 15 * 1.2); // weight * base rate * multiplier
    });

    it('should calculate sea freight cost correctly', () => {
      const cost = packageService.calculateShippingCost(10, ShippingMethod.SEA_FREIGHT, 'Asia');
      expect(cost).toBe(10 * 5 * 1.3); // weight * base rate * multiplier
    });

    it('should use default multiplier for unknown destination', () => {
      const cost = packageService.calculateShippingCost(5, ShippingMethod.AIR_FREIGHT, 'Unknown');
      expect(cost).toBe(5 * 15 * 1.0); // weight * base rate * default multiplier
    });
  });

  describe('getEstimatedDeliveryDate', () => {
    it('should estimate 7 days for air freight', () => {
      const today = new Date();
      const estimated = packageService.getEstimatedDeliveryDate(ShippingMethod.AIR_FREIGHT);
      
      const diffInDays = Math.round((estimated.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffInDays).toBe(7);
    });

    it('should estimate 30 days for sea freight', () => {
      const today = new Date();
      const estimated = packageService.getEstimatedDeliveryDate(ShippingMethod.SEA_FREIGHT);
      
      const diffInDays = Math.round((estimated.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffInDays).toBe(30);
    });
  });
});
