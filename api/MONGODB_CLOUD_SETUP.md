# MongoDB Cloud Configuration Guide

This guide explains how to configure your VTC Connect Pro application to work with MongoDB Cloud (MongoDB Atlas).

## Prerequisites

1. A MongoDB Atlas account (free tier available)
2. A MongoDB cluster created in Atlas
3. Database access configured with username and password

## Configuration Steps

### 1. Get Your Connection String

From your MongoDB Atlas dashboard:
1. Go to your cluster
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

It should look like:
```
mongodb+srv://vtcuser:<db_password>@vtcconnectpro.oclbe5s.mongodb.net/?retryWrites=true&w=majority&appName=VTCConnectPro
```

### 2. Configure Environment Variables

Create a `.env` file in the `api` directory based on `.env.example`:

```env
# Database - MongoDB Cloud
MONGODB_URI=mongodb+srv://vtcuser:<db_password>@vtcconnectpro.oclbe5s.mongodb.net/?retryWrites=true&w=majority&appName=VTCConnectPro
DB_PASSWORD=your_actual_database_password
```

**Important:** Replace `<db_password>` with your actual database password and `your_actual_database_password` with the same password.

### 3. Update the Connection String

Replace `<db_password>` in the URI with your actual database password:
```env
MONGODB_URI=mongodb+srv://vtcuser:yourActualPassword@vtcconnectpro.oclbe5s.mongodb.net/?retryWrites=true&w=majority&appName=VTCConnectPro
```

## Testing the Connection

### Using the Test Script

Run the MongoDB connection test:
```bash
cd api
npm run test:db
```

### Using the Health Check

Start the server and check the health endpoint:
```bash
cd api
npm start
```

Then visit: `http://localhost:5000/health`

You should see a response like:
```json
{
  "status": "OK",
  "timestamp": "2025-01-05T10:30:00.000Z",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "connection": "MongoDB Cloud"
  }
}
```

## Features

The MongoDB Cloud integration includes:

- **Stable API Version**: Uses MongoDB Stable API v1 for forward compatibility
- **Automatic Retry**: Configured for automatic retry on write operations
- **Connection Ping**: Tests connection health on startup
- **Error Handling**: Comprehensive error handling and logging
- **Health Monitoring**: Health check endpoint includes database status

## Connection Options

The application uses the following MongoDB connection options:

```javascript
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
}
```

These options ensure:
- Compatibility with MongoDB Cloud
- Use of the Stable API
- Proper connection pooling
- Deprecation error detection

## Troubleshooting

### Common Issues

1. **Authentication Error**: Verify your username and password
2. **Network Access**: Ensure your IP is whitelisted in Atlas
3. **Database Name**: Check that the database name matches your Atlas configuration
4. **Connection String**: Verify the cluster name and region

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide more detailed connection logs.

## Security Notes

- Never commit your actual database password to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your database passwords
- Use IP whitelisting in MongoDB Atlas for additional security