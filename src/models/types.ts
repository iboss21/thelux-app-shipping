export interface User {
  id: string;
  name: string;
  email: string;
  homeCountry: string;
  homeAddress: string;
  usaAddress: USAAddress;
  createdAt: Date;
}

export interface USAAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  suiteNumber: string; // Unique identifier for the user
}

export interface Package {
  id: string;
  userId: string;
  trackingNumber: string;
  description: string;
  weight: number; // in kg
  dimensions: Dimensions;
  status: PackageStatus;
  receivedAt?: Date;
  forwardedAt?: Date;
  deliveredAt?: Date;
  shippingMethod?: ShippingMethod;
  estimatedDelivery?: Date;
}

export interface Dimensions {
  length: number; // in cm
  width: number;
  height: number;
}

export enum PackageStatus {
  AWAITING_ARRIVAL = 'AWAITING_ARRIVAL',
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION'
}

export enum ShippingMethod {
  AIR_FREIGHT = 'AIR_FREIGHT',
  SEA_FREIGHT = 'SEA_FREIGHT'
}

export interface ForwardingRequest {
  packageId: string;
  shippingMethod: ShippingMethod;
  destinationAddress: string;
  destinationCountry: string;
  estimatedDelivery: Date;
}
