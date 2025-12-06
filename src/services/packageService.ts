import { Package, PackageStatus, ShippingMethod, ForwardingRequest } from '../models/types';
import { generateId } from '../utils/helpers';

class PackageService {
  private packages: Map<string, Package> = new Map();

  receivePackage(
    userId: string,
    trackingNumber: string,
    description: string,
    weight: number,
    dimensions: { length: number; width: number; height: number }
  ): Package {
    const packageId = generateId();
    
    const newPackage: Package = {
      id: packageId,
      userId,
      trackingNumber,
      description,
      weight,
      dimensions,
      status: PackageStatus.RECEIVED,
      receivedAt: new Date()
    };

    this.packages.set(packageId, newPackage);
    return newPackage;
  }

  getPackage(packageId: string): Package | undefined {
    return this.packages.get(packageId);
  }

  getUserPackages(userId: string): Package[] {
    return Array.from(this.packages.values()).filter(pkg => pkg.userId === userId);
  }

  getAllPackages(): Package[] {
    return Array.from(this.packages.values());
  }

  updatePackageStatus(packageId: string, status: PackageStatus): Package | undefined {
    const pkg = this.packages.get(packageId);
    if (!pkg) {
      return undefined;
    }

    pkg.status = status;
    
    if (status === PackageStatus.IN_TRANSIT && !pkg.forwardedAt) {
      pkg.forwardedAt = new Date();
    } else if (status === PackageStatus.DELIVERED && !pkg.deliveredAt) {
      pkg.deliveredAt = new Date();
    }

    this.packages.set(packageId, pkg);
    return pkg;
  }

  forwardPackage(forwardingRequest: ForwardingRequest): Package | undefined {
    const pkg = this.packages.get(forwardingRequest.packageId);
    if (!pkg) {
      return undefined;
    }

    if (pkg.status !== PackageStatus.RECEIVED && pkg.status !== PackageStatus.PROCESSING) {
      throw new Error(`Package cannot be forwarded. Current status: ${pkg.status}`);
    }

    pkg.status = PackageStatus.IN_TRANSIT;
    pkg.shippingMethod = forwardingRequest.shippingMethod;
    pkg.estimatedDelivery = forwardingRequest.estimatedDelivery;
    pkg.forwardedAt = new Date();

    this.packages.set(forwardingRequest.packageId, pkg);
    return pkg;
  }

  calculateShippingCost(weight: number, shippingMethod: ShippingMethod, destination: string): number {
    // Base rates per kg
    const baseRates = {
      [ShippingMethod.AIR_FREIGHT]: 15,
      [ShippingMethod.SEA_FREIGHT]: 5
    };

    const baseRate = baseRates[shippingMethod];
    const baseCost = weight * baseRate;

    // Add a multiplier based on destination (simplified)
    const destinationMultipliers: { [key: string]: number } = {
      'Europe': 1.2,
      'Asia': 1.3,
      'Africa': 1.4,
      'South America': 1.15,
      'Australia': 1.35,
      'default': 1.0
    };

    const multiplier = destinationMultipliers[destination] || destinationMultipliers['default'];
    
    return baseCost * multiplier;
  }

  getEstimatedDeliveryDate(shippingMethod: ShippingMethod): Date {
    const today = new Date();
    const daysToAdd = shippingMethod === ShippingMethod.AIR_FREIGHT ? 7 : 30;
    
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + daysToAdd);
    
    return estimatedDate;
  }
}

export default new PackageService();
