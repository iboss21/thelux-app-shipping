import { Request, Response } from 'express';
import packageService from '../services/packageService';
import userService from '../services/userService';
import { PackageStatus, ShippingMethod } from '../models/types';

export const receivePackage = (req: Request, res: Response): void => {
  try {
    const { userId, trackingNumber, description, weight, dimensions } = req.body;

    if (!userId || !trackingNumber || !description || !weight || !dimensions) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const user = userService.getUser(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const pkg = packageService.receivePackage(
      userId,
      trackingNumber,
      description,
      weight,
      dimensions
    );

    res.status(201).json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to receive package' });
  }
};

export const getPackage = (req: Request, res: Response): void => {
  try {
    const { packageId } = req.params;
    const pkg = packageService.getPackage(packageId);

    if (!pkg) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }

    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve package' });
  }
};

export const getUserPackages = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    const packages = packageService.getUserPackages(userId);
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve packages' });
  }
};

export const getAllPackages = (req: Request, res: Response): void => {
  try {
    const packages = packageService.getAllPackages();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve packages' });
  }
};

export const updatePackageStatus = (req: Request, res: Response): void => {
  try {
    const { packageId } = req.params;
    const { status } = req.body;

    if (!Object.values(PackageStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const pkg = packageService.updatePackageStatus(packageId, status);

    if (!pkg) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }

    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update package status' });
  }
};

export const forwardPackage = (req: Request, res: Response): void => {
  try {
    const { packageId } = req.params;
    const { shippingMethod, destinationAddress, destinationCountry } = req.body;

    if (!shippingMethod || !destinationAddress || !destinationCountry) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!Object.values(ShippingMethod).includes(shippingMethod)) {
      res.status(400).json({ error: 'Invalid shipping method' });
      return;
    }

    const estimatedDelivery = packageService.getEstimatedDeliveryDate(shippingMethod);

    const pkg = packageService.forwardPackage({
      packageId,
      shippingMethod,
      destinationAddress,
      destinationCountry,
      estimatedDelivery
    });

    if (!pkg) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }

    res.status(200).json(pkg);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to forward package' });
  }
};

export const calculateShipping = (req: Request, res: Response): void => {
  try {
    const { weight, shippingMethod, destination } = req.body;

    if (!weight || !shippingMethod || !destination) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!Object.values(ShippingMethod).includes(shippingMethod)) {
      res.status(400).json({ error: 'Invalid shipping method' });
      return;
    }

    const cost = packageService.calculateShippingCost(weight, shippingMethod, destination);
    const estimatedDelivery = packageService.getEstimatedDeliveryDate(shippingMethod);

    res.status(200).json({
      cost,
      estimatedDelivery,
      shippingMethod,
      weight,
      destination
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate shipping cost' });
  }
};
