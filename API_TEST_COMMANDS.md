# API Test Commands (cURL)

## Categories

### Create Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Новая категория"}'
```

### Get All Categories
```bash
curl http://localhost:3000/api/categories
```

### Get Category by ID
```bash
curl http://localhost:3000/api/categories/1
```

### Get Paginated Categories
```bash
curl "http://localhost:3000/api/categories/paged?page=1&size=10"
```

### Get Category Statistics
```bash
curl http://localhost:3000/api/categories/stats
```

### Get Most Popular Categories
```bash
curl "http://localhost:3000/api/categories/popular?limit=5"
```

### Update Category
```bash
curl -X PUT http://localhost:3000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Обновленная категория"}'
```

### Delete Category
```bash
curl -X DELETE http://localhost:3000/api/categories/1
```

### Delete All Categories
```bash
curl -X DELETE http://localhost:3000/api/categories
```

## Equipment

### Create Equipment
```bash
curl -X POST http://localhost:3000/api/equipment \
  -H "Content-Type: application/json" \
  -d '{"name": "Новое оборудование", "inventoryNumber": "INV-100", "categoryId": 1}'
```

### Get All Equipment
```bash
curl http://localhost:3000/api/equipment
```

### Get Available Equipment
```bash
curl "http://localhost:3000/api/equipment/available?dateStart=2024-01-01T00:00:00Z&dateEnd=2024-12-31T23:59:59Z"
```

### Get Equipment by Price Range
```bash
curl "http://localhost:3000/api/equipment/price-range?minPrice=1000&maxPrice=5000"
```

### Get Equipment Rental History
```bash
curl http://localhost:3000/api/equipment/1/rental-history
```

## Clients

### Create Client
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Иванов Иван", "phone": "+79991234567"}'
```

### Get All Clients
```bash
curl http://localhost:3000/api/clients
```

### Get Top Clients
```bash
curl "http://localhost:3000/api/clients/top?limit=10"
```

### Get Client Debt
```bash
curl http://localhost:3000/api/clients/1/debt
```

## Orders

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "dateStart": "2024-01-15T08:00:00Z",
    "dateEnd": "2024-01-20T18:00:00Z",
    "status": "active",
    "clientId": 1,
    "priceCategoryId": 1
  }'
```

### Get All Orders
```bash
curl http://localhost:3000/api/orders
```

### Get Active Orders
```bash
curl http://localhost:3000/api/orders/active
```

### Get Orders by Period
```bash
curl "http://localhost:3000/api/orders/period?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z"
```

### Calculate Order Total
```bash
curl http://localhost:3000/api/orders/1/total
```

## Payments

### Create Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000.00,
    "paymentDate": "2024-01-15T10:00:00Z",
    "paymentType": "cash",
    "orderId": 1
  }'
```

### Get All Payments
```bash
curl http://localhost:3000/api/payments
```

### Get Payment Statistics by Month
```bash
curl http://localhost:3000/api/payments/stats/monthly
```

### Get Unpaid Orders
```bash
curl http://localhost:3000/api/payments/unpaid-orders
```

## Price Categories

### Create Price Category
```bash
curl -X POST http://localhost:3000/api/price-categories \
  -H "Content-Type: application/json" \
  -d '{
    "dateStart": "2024-01-01T00:00:00Z",
    "dateEnd": "2024-12-31T23:59:59Z"
  }'
```

## Order Equipment

### Create Order-Equipment Relation
```bash
curl -X POST http://localhost:3000/api/order-equipment \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 2,
    "rentPrice": 1500.00,
    "orderId": 1,
    "equipmentId": 1
  }'
```

### Get All Order-Equipment Relations
```bash
curl http://localhost:3000/api/order-equipment
```

