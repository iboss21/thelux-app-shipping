import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'TheLux International Parcel Forwarding Service',
    description: 'Users in foreign countries get a USA address. Ship packages to that address. Forward to their international location via air/sea freight.',
    endpoints: {
      users: '/api/users',
      packages: '/api/packages',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} for API information`);
  });
}

export default app;
