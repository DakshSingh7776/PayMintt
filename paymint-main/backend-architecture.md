# PayMint Backend Architecture

## 🏗️ Backend Technology Stack

### **Primary Backend**
- **Node.js** with **Express.js** or **Fastify** (high-performance API)
- **TypeScript** for type safety and better DX
- **PostgreSQL** as primary database (ACID compliance for financial data)
- **Redis** for caching and session management
- **Prisma** as ORM for type-safe database operations

### **Blockchain Integration**
- **Stacks.js SDK** for Stacks blockchain integration
- **Bitcoin.js** for Bitcoin layer integration
- **Web3.js** for Ethereum compatibility (future expansion)

### **Authentication & Security**
- **JWT** for stateless authentication
- **bcrypt** for password hashing
- **OAuth2** for social logins
- **Rate limiting** with Redis
- **CORS** configuration

### **File Storage**
- **AWS S3** or **Cloudflare R2** for document storage
- **Multer** for file upload handling
- **Image processing** with Sharp

### **AI/ML Services**
- **Google AI API** integration (already configured)
- **Document processing** pipeline
- **Risk scoring** algorithms

### **Monitoring & Logging**
- **Winston** for structured logging
- **Sentry** for error tracking
- **Prometheus** for metrics
- **Grafana** for dashboards

## 📊 Database Schema

### **Core Tables**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('business', 'lender', 'admin')),
  kyc_status VARCHAR(20) DEFAULT 'pending',
  kyc_data JSONB,
  wallet_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  gst_number VARCHAR(50),
  business_type VARCHAR(100),
  address JSONB,
  documents JSONB,
  verification_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  issuer_name VARCHAR(255) NOT NULL,
  debtor_name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  ask_amount DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  status VARCHAR(20) DEFAULT 'pending',
  penalty DECIMAL(15,2) DEFAULT 0,
  document_url VARCHAR(500),
  extracted_data JSONB,
  nft_token_id VARCHAR(255),
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  lender_id UUID REFERENCES users(id),
  amount DECIMAL(15,2) NOT NULL,
  yield_percentage DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  funded_at TIMESTAMP DEFAULT NOW(),
  repaid_at TIMESTAMP,
  blockchain_tx_hash VARCHAR(255)
);

-- Settlements table
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(15,2) NOT NULL,
  settlement_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Compliance alerts table
CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  alert_type VARCHAR(50) NOT NULL,
  details TEXT NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Liquidity pool table
CREATE TABLE liquidity_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES users(id),
  amount DECIMAL(15,2) NOT NULL,
  apy DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  withdrawn_at TIMESTAMP
);
```

## 🔄 API Endpoints Structure

### **Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### **Users & Profiles**
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/kyc
GET    /api/users/kyc-status
POST   /api/users/connect-wallet
```

### **Invoices**
```
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PUT    /api/invoices/:id
DELETE /api/invoices/:id
POST   /api/invoices/:id/upload
POST   /api/invoices/:id/extract-data
POST   /api/invoices/:id/mint-nft
```

### **Marketplace**
```
GET    /api/marketplace
GET    /api/marketplace/filters
POST   /api/marketplace/fund
GET    /api/marketplace/stats
```

### **Investments**
```
GET    /api/investments
GET    /api/investments/:id
POST   /api/investments
GET    /api/investments/history
```

### **Liquidity Pool**
```
GET    /api/pool/stats
POST   /api/pool/deposit
POST   /api/pool/withdraw
GET    /api/pool/yield-calculator
```

### **Settlements**
```
GET    /api/settlements
POST   /api/settlements
GET    /api/settlements/:id
PUT    /api/settlements/:id
```

### **Admin**
```
GET    /api/admin/dashboard
GET    /api/admin/users
PUT    /api/admin/users/:id
GET    /api/admin/compliance
POST    /api/admin/compliance/:id/resolve
GET    /api/admin/reports
```

## 🔐 Security Implementation

### **Authentication Flow**
1. **Registration**: Email verification required
2. **Login**: JWT token with refresh mechanism
3. **KYC/KYB**: Document verification pipeline
4. **Wallet Connection**: Stacks wallet integration
5. **2FA**: Optional two-factor authentication

### **Data Protection**
- **Encryption**: AES-256 for sensitive data
- **Hashing**: bcrypt for passwords
- **Rate Limiting**: Per-user and per-endpoint limits
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection**: Prisma ORM protection

### **Compliance Features**
- **AML Monitoring**: Automated suspicious activity detection
- **KYC Verification**: Document validation and verification
- **Audit Trails**: Complete transaction logging
- **Data Retention**: GDPR-compliant data policies

## 🚀 Deployment Architecture

### **Development Environment**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       └─────────────────┘
```

### **Production Environment**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer │    │   API Gateway   │
│   (Cloudflare)  │◄──►│   (Nginx)       │◄──►│   (Kong)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Storage  │    │   Backend API   │    │   Database      │
│   (S3/R2)       │◄──►│   (Docker)      │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       └─────────────────┘
```

## 📋 Implementation Roadmap

### **Phase 1: Core Backend (Week 1-2)**
- [ ] Set up Node.js/Express server with TypeScript
- [ ] Configure PostgreSQL database with Prisma
- [ ] Implement user authentication system
- [ ] Create basic CRUD operations for invoices
- [ ] Set up Redis for caching

### **Phase 2: Business Logic (Week 3-4)**
- [ ] Implement invoice upload and OCR processing
- [ ] Create marketplace functionality
- [ ] Build investment tracking system
- [ ] Add settlement processing
- [ ] Implement risk scoring algorithms

### **Phase 3: Blockchain Integration (Week 5-6)**
- [ ] Integrate Stacks.js SDK
- [ ] Implement NFT minting for invoices
- [ ] Add wallet connection functionality
- [ ] Create smart contract interactions
- [ ] Build liquidity pool mechanics

### **Phase 4: Admin & Compliance (Week 7-8)**
- [ ] Build admin dashboard APIs
- [ ] Implement compliance monitoring
- [ ] Add AML detection algorithms
- [ ] Create reporting system
- [ ] Set up audit trails

### **Phase 5: Production Ready (Week 9-10)**
- [ ] Add comprehensive error handling
- [ ] Implement monitoring and logging
- [ ] Set up CI/CD pipeline
- [ ] Performance optimization
- [ ] Security hardening

## 🛠️ Development Tools

### **Backend Development**
```bash
# Initialize backend
mkdir paymint-backend
cd paymint-backend
npm init -y
npm install express typescript @types/node prisma @prisma/client
npm install -D ts-node nodemon @types/express

# Database setup
npx prisma init
npx prisma generate
npx prisma db push

# Development server
npm run dev
```

### **Environment Variables**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/paymint"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Blockchain
STACKS_NETWORK="testnet"
STACKS_API_URL="https://api.testnet.hiro.so"

# File Storage
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="paymint-documents"

# AI Services
GOOGLE_AI_API_KEY="your-google-ai-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

This backend architecture will provide a solid foundation for your PayMint platform, ensuring scalability, security, and compliance with financial regulations.

