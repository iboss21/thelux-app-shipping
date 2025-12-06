import { Request, Response } from 'express';
import userService from '../services/userService';
import { validateEmail } from '../utils/helpers';

export const createUser = (req: Request, res: Response): void => {
  try {
    const { name, email, homeCountry, homeAddress } = req.body;

    if (!name || !email || !homeCountry || !homeAddress) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const user = userService.createUser(name, email, homeCountry, homeAddress);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const getUser = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    const user = userService.getUser(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const users = userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const updateUser = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = userService.updateUser(userId, updates);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    const success = userService.deleteUser(userId);

    if (!success) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
