import { Router } from 'express';
import {
  receivePackage,
  getPackage,
  getUserPackages,
  getAllPackages,
  updatePackageStatus,
  forwardPackage,
  calculateShipping
} from '../controllers/packageController';

const router = Router();

router.post('/', receivePackage);
router.get('/', getAllPackages);
router.get('/:packageId', getPackage);
router.get('/user/:userId', getUserPackages);
router.put('/:packageId/status', updatePackageStatus);
router.post('/:packageId/forward', forwardPackage);
router.post('/calculate-shipping', calculateShipping);

export default router;
