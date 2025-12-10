# TheLux International Parcel Forwarding Service - API Documentation

## Overview

This API provides an international parcel forwarding service where users in foreign countries receive a unique USA address to ship their packages. The service then forwards these packages to the user's international location via air or sea freight.

## Base URL

```
http://localhost:3000
```

## Endpoints

### Users

#### Create User
Register a new user and receive a unique USA forwarding address.

**Request:**
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "homeCountry": "United Kingdom",
  "homeAddress": "10 Downing Street, London, UK"
}
```

**Response:**
```json
{
  "id": "a1b2c3d4e5f6...",
  "name": "John Doe",
  "email": "john@example.com",
  "homeCountry": "United Kingdom",
  "homeAddress": "10 Downing Street, London, UK",
  "usaAddress": {
    "id": "x7y8z9...",
    "street": "1234 Shipping Way",
    "city": "Miami",
    "state": "FL",
    "zipCode": "33101",
    "suiteNumber": "STE-12345"
  },
  "createdAt": "2025-12-06T08:00:00.000Z"
}
```

#### Get User
Retrieve user information by ID.

**Request:**
```
GET /api/users/:userId
```

**Response:**
```json
{
  "id": "a1b2c3d4e5f6...",
  "name": "John Doe",
  ...
}
```

#### Get All Users
Retrieve all registered users.

**Request:**
```
GET /api/users
```

**Response:**
```json
[
  {
    "id": "a1b2c3d4e5f6...",
    "name": "John Doe",
    ...
  }
]
```

#### Update User
Update user information.

**Request:**
```
PUT /api/users/:userId
Content-Type: application/json

{
  "name": "Jane Doe",
  "homeAddress": "New Address"
}
```

#### Delete User
Delete a user account.

**Request:**
```
DELETE /api/users/:userId
```

**Response:**
```
204 No Content
```

### Packages

#### Receive Package
Register a package received at the USA warehouse.

**Request:**
```
POST /api/packages
Content-Type: application/json

{
  "userId": "a1b2c3d4e5f6...",
  "trackingNumber": "USPS-1234567890",
  "description": "Electronics - Laptop",
  "weight": 2.5,
  "dimensions": {
    "length": 40,
    "width": 30,
    "height": 10
  }
}
```

**Response:**
```json
{
  "id": "pkg123...",
  "userId": "a1b2c3d4e5f6...",
  "trackingNumber": "USPS-1234567890",
  "description": "Electronics - Laptop",
  "weight": 2.5,
  "dimensions": {
    "length": 40,
    "width": 30,
    "height": 10
  },
  "status": "RECEIVED",
  "receivedAt": "2025-12-06T08:00:00.000Z"
}
```

#### Get Package
Retrieve package information by ID.

**Request:**
```
GET /api/packages/:packageId
```

#### Get User Packages
Retrieve all packages for a specific user.

**Request:**
```
GET /api/packages/user/:userId
```

#### Get All Packages
Retrieve all packages in the system.

**Request:**
```
GET /api/packages
```

#### Update Package Status
Update the status of a package.

**Request:**
```
PUT /api/packages/:packageId/status
Content-Type: application/json

{
  "status": "PROCESSING"
}
```

**Package Statuses:**
- `AWAITING_ARRIVAL` - Package expected but not yet received
- `RECEIVED` - Package received at USA warehouse
- `PROCESSING` - Package being prepared for forwarding
- `IN_TRANSIT` - Package shipped to destination
- `DELIVERED` - Package delivered to recipient
- `EXCEPTION` - Issue with package

#### Forward Package
Forward a package to the user's international address.

**Request:**
```
POST /api/packages/:packageId/forward
Content-Type: application/json

{
  "shippingMethod": "AIR_FREIGHT",
  "destinationAddress": "10 Downing Street, London, UK",
  "destinationCountry": "United Kingdom"
}
```

**Shipping Methods:**
- `AIR_FREIGHT` - Fast delivery (approx. 7 days)
- `SEA_FREIGHT` - Economy delivery (approx. 30 days)

**Response:**
```json
{
  "id": "pkg123...",
  "status": "IN_TRANSIT",
  "shippingMethod": "AIR_FREIGHT",
  "forwardedAt": "2025-12-06T09:00:00.000Z",
  "estimatedDelivery": "2025-12-13T09:00:00.000Z",
  ...
}
```

#### Calculate Shipping Cost
Calculate the cost to ship a package.

**Request:**
```
POST /api/packages/calculate-shipping
Content-Type: application/json

{
  "weight": 5.0,
  "shippingMethod": "AIR_FREIGHT",
  "destination": "Europe"
}
```

**Destinations:**
- `Europe` - European countries
- `Asia` - Asian countries
- `Africa` - African countries
- `South America` - South American countries
- `Australia` - Australia and Oceania
- `default` - Other destinations

**Response:**
```json
{
  "cost": 90.0,
  "estimatedDelivery": "2025-12-13T09:00:00.000Z",
  "shippingMethod": "AIR_FREIGHT",
  "weight": 5.0,
  "destination": "Europe"
}
```

### System

#### Health Check
Check if the service is running.

**Request:**
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T08:00:00.000Z"
}
```

#### API Information
Get general information about the API.

**Request:**
```
GET /
```

**Response:**
```json
{
  "message": "TheLux International Parcel Forwarding Service",
  "description": "Users in foreign countries get a USA address. Ship packages to that address. Forward to their international location via air/sea freight.",
  "endpoints": {
    "users": "/api/users",
    "packages": "/api/packages",
    "health": "/health"
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Example Workflow

1. **Register a User:**
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Alice Smith",
       "email": "alice@example.com",
       "homeCountry": "France",
       "homeAddress": "123 Rue de Paris, Paris, France"
     }'
   ```
   This returns a unique USA address for the user.

2. **Ship to USA Address:**
   User ships their package to the assigned USA address (Suite STE-XXXXX).

3. **Register Package Receipt:**
   ```bash
   curl -X POST http://localhost:3000/api/packages \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "user-id-from-step-1",
       "trackingNumber": "FEDEX-123456789",
       "description": "Books",
       "weight": 3.0,
       "dimensions": {"length": 30, "width": 25, "height": 15}
     }'
   ```

4. **Calculate Shipping Cost:**
   ```bash
   curl -X POST http://localhost:3000/api/packages/calculate-shipping \
     -H "Content-Type: application/json" \
     -d '{
       "weight": 3.0,
       "shippingMethod": "SEA_FREIGHT",
       "destination": "Europe"
     }'
   ```

5. **Forward Package:**
   ```bash
   curl -X POST http://localhost:3000/api/packages/package-id/forward \
     -H "Content-Type: application/json" \
     -d '{
       "shippingMethod": "SEA_FREIGHT",
       "destinationAddress": "123 Rue de Paris, Paris, France",
       "destinationCountry": "France"
     }'
   ```

6. **Track Package:**
   ```bash
   curl http://localhost:3000/api/packages/package-id
   ```
