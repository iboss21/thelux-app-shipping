# TheLux Shipping - API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the TheLux Shipping application.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.vercel.app`

## Authentication

Most endpoints require authentication via Supabase session cookies. Users must be logged in to access protected routes.

Admin-only endpoints additionally require the user to have `role = 'admin'` in the database.

---

## API Endpoints

### 1. Shipping Rate Calculator

**Endpoint:** `POST /api/calculate-rate`

**Description:** Calculate shipping costs based on weight, destination, and shipping method.

**Authentication:** Required (User)

**Request Body:**
```json
{
  "weight": 5.5,
  "destination": "United Kingdom",
  "method": "air_economy"
}
```

**Parameters:**
- `weight` (number, required): Package weight in pounds (0-10000)
- `destination` (string, required): Destination country
- `method` (string, required): Shipping method
  - Valid values: `air_express`, `air_economy`, `sea_lcl`, `sea_fcl`

**Response:**
```json
{
  "method": "air_economy",
  "weight": 5.5,
  "destination": "United Kingdom",
  "base_fee": 10.00,
  "cost_per_lb": 5.00,
  "total_cost": 37.50,
  "estimated_delivery": "7-10 business days",
  "currency": "USD"
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

---

### 2. Package Consolidation

**Endpoint:** `POST /api/consolidate`

**Description:** Create a consolidation request to combine multiple packages into one shipment.

**Authentication:** Required (User)

**Request Body:**
```json
{
  "packageIds": ["uuid-1", "uuid-2", "uuid-3"],
  "shippingMethod": "air_economy",
  "destinationAddress": {
    "address": "123 Main Street",
    "city": "London",
    "state": "England",
    "zip": "SW1A 1AA",
    "country": "United Kingdom"
  }
}
```

**Parameters:**
- `packageIds` (array, required): Array of package UUIDs to consolidate
- `shippingMethod` (string, required): Shipping method (`air_express`, `air_economy`, `sea_lcl`, `sea_fcl`)
- `destinationAddress` (object, required): Destination address details
  - `address` (string, required)
  - `city` (string, required)
  - `state` (string, optional)
  - `zip` (string, required)
  - `country` (string, required)

**Response:**
```json
{
  "success": true,
  "shipment": {
    "id": "shipment-uuid",
    "user_id": "user-uuid",
    "package_ids": ["uuid-1", "uuid-2"],
    "shipping_method": "air_economy",
    "destination_address": {...},
    "cost_usd": 42.50,
    "status": "pending",
    "created_at": "2024-12-06T10:00:00Z"
  },
  "cost_breakdown": {
    "shipping_cost": 37.50,
    "consolidation_fee": 5.00,
    "total_cost": 42.50
  },
  "total_weight": 7.5,
  "package_count": 2
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Invalid package IDs or parameters
- `404 Not Found`: One or more packages not found
- `500 Internal Server Error`: Server error

---

### 3. Payment Checkout

**Endpoint:** `POST /api/payment/checkout`

**Description:** Create a Stripe checkout session for invoice payment.

**Authentication:** Required (User)

**Request Body:**
```json
{
  "invoiceId": "invoice-uuid"
}
```

**Parameters:**
- `invoiceId` (string, required): UUID of the invoice to pay

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Invalid invoice ID or invoice already paid
- `404 Not Found`: Invoice not found
- `500 Internal Server Error`: Payment system error

---

### 4. Payment Webhook

**Endpoint:** `POST /api/payment/webhook`

**Description:** Stripe webhook handler for payment events.

**Authentication:** Stripe signature verification

**Headers:**
- `stripe-signature`: Stripe webhook signature (required)

**Supported Events:**
- `checkout.session.completed`: Payment successful
- `payment_intent.succeeded`: Payment intent completed
- `payment_intent.payment_failed`: Payment failed
- `customer.subscription.created`: Subscription created
- `customer.subscription.updated`: Subscription updated
- `customer.subscription.deleted`: Subscription cancelled

**Response:**
```json
{
  "received": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid signature or missing header
- `500 Internal Server Error`: Processing error

---

### 5. Tracking Updates

**Endpoint:** `POST /api/tracking`

**Description:** Receive tracking updates from shipping carriers (webhook).

**Authentication:** None (public webhook)

**Request Body:**
```json
{
  "trackingNumber": "1Z999AA10123456784",
  "status": "in_transit",
  "carrier": "UPS",
  "location": "Memphis, TN",
  "timestamp": "2024-12-06T10:00:00Z",
  "estimatedDelivery": "2024-12-10"
}
```

**Parameters:**
- `trackingNumber` (string, required): Shipment tracking number
- `status` (string, required): Current status
  - Valid values: `in_transit`, `out_for_delivery`, `delivered`, `customs`, `exception`, `returned`
- `carrier` (string, optional): Carrier name
- `location` (string, optional): Current location
- `timestamp` (string, optional): Update timestamp (ISO 8601)
- `estimatedDelivery` (string, optional): Estimated delivery date

**Response:**
```json
{
  "success": true,
  "shipment_id": "shipment-uuid",
  "status": "in_transit"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `404 Not Found`: Shipment not found
- `500 Internal Server Error`: Processing error

---

**Endpoint:** `GET /api/tracking?tracking={trackingNumber}`

**Description:** Get tracking information for a shipment.

**Authentication:** Required (User)

**Query Parameters:**
- `tracking` (string, required): Tracking number

**Response:**
```json
{
  "tracking_number": "1Z999AA10123456784",
  "status": "in_transit",
  "carrier": "UPS",
  "estimated_delivery": "2024-12-10",
  "actual_delivery": null,
  "updated_at": "2024-12-06T10:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Missing tracking parameter
- `404 Not Found`: Shipment not found
- `500 Internal Server Error`: Server error

---

### 6. Email Notification Trigger

**Endpoint:** `POST /api/notify`

**Description:** Trigger email notification for a package (admin only).

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "packageId": "package-uuid"
}
```

**Parameters:**
- `packageId` (string, required): UUID of the package

**Response:**
```json
{
  "success": true,
  "message": "Notification sent"
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User is not admin
- `400 Bad Request`: Missing package ID
- `404 Not Found`: Package not found
- `500 Internal Server Error`: Email sending failed

---

## Email Notification Types

The application sends the following email notifications:

### 1. Package Received
- **Trigger:** Admin receives a package
- **Recipients:** Package owner
- **Content:** Tracking number, carrier, received date, package details

### 2. Shipment Update
- **Trigger:** Tracking status changes
- **Recipients:** Shipment owner
- **Content:** New status, tracking number, estimated delivery

### 3. Invoice Notification
- **Trigger:** New invoice created
- **Recipients:** Invoice owner
- **Content:** Invoice ID, amount, type, due date

### 4. Payment Confirmation
- **Trigger:** Payment successful
- **Recipients:** Payment payer
- **Content:** Invoice ID, amount paid, type

### 5. Delivery Confirmation
- **Trigger:** Shipment delivered
- **Recipients:** Shipment owner
- **Content:** Tracking number, delivery date

---

## Database Schema Reference

### Key Tables

**users**
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `name` (TEXT)
- `subscription_tier` ('free' | 'standard' | 'premium')
- `stripe_customer_id` (TEXT, UNIQUE)
- `role` ('user' | 'admin')

**packages**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `tracking_number` (TEXT, UNIQUE)
- `status` ('received' | 'stored' | 'shipped' | 'delivered' | 'discarded')
- `weight_lbs` (DECIMAL)
- `consolidated_shipment_id` (UUID, FK → shipments)

**shipments**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `package_ids` (UUID[])
- `shipping_method` ('air_express' | 'air_economy' | 'sea_lcl' | 'sea_fcl')
- `tracking_number` (TEXT, UNIQUE)
- `status` ('pending' | 'in_transit' | 'customs' | 'delivered' | 'cancelled')
- `cost_usd` (DECIMAL)

**invoices**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `shipment_id` (UUID, FK → shipments)
- `type` ('storage' | 'consolidation' | 'shipping' | 'repackaging')
- `amount_usd` (DECIMAL)
- `status` ('pending' | 'paid' | 'failed' | 'cancelled')

**shipping_rates**
- `id` (UUID, PK)
- `method` (TEXT)
- `weight_min_lbs` (DECIMAL)
- `weight_max_lbs` (DECIMAL)
- `cost_per_lb` (DECIMAL)
- `base_fee` (DECIMAL)

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider implementing rate limiting on:
- Payment endpoints
- Email notification endpoints
- Public webhooks

---

## Webhooks Configuration

### Stripe Webhooks
**Endpoint:** `/api/payment/webhook`
**Events to Subscribe:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### Tracking Webhooks
**Endpoint:** `/api/tracking`
Configure with your shipping carrier or tracking service provider.

---

## Environment Variables

Required environment variables for API functionality:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STANDARD_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Support

For API support:
- GitHub Issues: https://github.com/iboss21/thelux-app-shipping/issues
- Email: support@theluxshipping.com
