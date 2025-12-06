# TheLux International Parcel Forwarding Service

International parcel forwarding service that enables users in foreign countries to receive a unique USA address. They can ship packages to that address, and the service forwards them to their international location via air or sea freight.

## Features

- **Unique USA Addresses**: Each user receives a unique suite number at our Miami, FL warehouse
- **Package Tracking**: Track packages from receipt to delivery
- **Multiple Shipping Options**: Choose between air freight (7 days) or sea freight (30 days)
- **Cost Calculator**: Calculate shipping costs based on weight, method, and destination
- **RESTful API**: Complete API for integration with external systems

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iboss21/thelux-app-shipping.git
   cd thelux-app-shipping
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The server will start on http://localhost:3000 with auto-reload on file changes.

#### Production Mode
```bash
npm run build
npm start
```

### Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## API Documentation

See [API.md](./API.md) for complete API documentation.

### Quick Start Example

1. Create a user and get their USA address:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "homeCountry": "United Kingdom",
       "homeAddress": "10 Downing Street, London"
     }'
   ```

2. Register a received package:
   ```bash
   curl -X POST http://localhost:3000/api/packages \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "USER_ID",
       "trackingNumber": "TRACK123",
       "description": "Books",
       "weight": 2.5,
       "dimensions": {"length": 30, "width": 20, "height": 15}
     }'
   ```

3. Forward the package:
   ```bash
   curl -X POST http://localhost:3000/api/packages/PACKAGE_ID/forward \
     -H "Content-Type: application/json" \
     -d '{
       "shippingMethod": "AIR_FREIGHT",
       "destinationAddress": "10 Downing Street, London",
       "destinationCountry": "United Kingdom"
     }'
   ```

## Project Structure

```
thelux-app-shipping/
├── src/
│   ├── controllers/       # Request handlers
│   ├── models/           # Data types and interfaces
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── index.ts          # Application entry point
├── dist/                 # Compiled JavaScript (generated)
├── node_modules/         # Dependencies (generated)
├── API.md               # API documentation
├── package.json         # Project metadata
├── tsconfig.json        # TypeScript configuration
└── jest.config.js       # Test configuration
```

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Testing**: Jest
- **Development**: ts-node, nodemon

## How It Works

1. **User Registration**: Users from foreign countries register and receive a unique USA warehouse address with a suite number (e.g., Suite STE-12345, 1234 Shipping Way, Miami, FL 33101)

2. **Package Receipt**: When packages arrive at the warehouse, they're registered in the system with tracking information

3. **Forwarding Options**:
   - **Air Freight**: Fast delivery (~7 days), higher cost
   - **Sea Freight**: Economy delivery (~30 days), lower cost

4. **Cost Calculation**: Shipping costs are calculated based on:
   - Package weight
   - Shipping method (air/sea)
   - Destination region

5. **Package Forwarding**: Packages are consolidated and shipped to the user's international address

6. **Status Tracking**: Users can track their packages through various statuses:
   - AWAITING_ARRIVAL
   - RECEIVED
   - PROCESSING
   - IN_TRANSIT
   - DELIVERED
   - EXCEPTION

## License

ISC
