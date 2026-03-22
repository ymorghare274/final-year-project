# 📊 YUKTA JEWELLERY SHOP - SYSTEM FLOWCHARTS

This document contains the detailed logical workflows of the Yukta Jewellery project. These diagrams use Mermaid syntax and can be rendered by GitHub, VS Code, or moved to [Mermaid Live Editor](https://mermaid.live/) for high-resolution exports.

---

## 1. Unified System Workflow (Overall Architecture)
This flowchart represents the high-level movement of data between the User, the API, and the external services.

```mermaid
graph TD
    A([User Dashboard]) -->|Browse/Search| B{App State}
    B -->|Fetch| C[Express.js API Router]
    C -->|Query| D[(Supabase PostgreSQL)]
    D -->|Recordset| C
    C -->|JSON| B
    
    B -->|Checkout| E[Stripe API Handshake]
    E -->|Redirect| F{Stripe Secure Portal}
    F -->|Payment Success| G[Webhook Listener]
    G -->|Update Status| D
    G -->|Email Notification| H([Customer Receipt])
    
    I([Admin Login]) -->|Verify JWT| J[Admin Controller]
    J -->|Inventory CRUD| D
    J -->|Sales Reports| K([Business Analytics])
```

---

## 2. Secure User Authentication Flow
This describes the logic protecting the "Digital Vault" of the user.

```mermaid
flowchart TD
    Start([User Login]) --> Input[Enter Email & Password]
    Input --> Hash[Bcrypt Hashing Comparison]
    Hash --> Verify{Valid Credentials?}
    
    Verify -- No --> Error[Show Invalid Credentials Alert]
    Error --> Input
    
    Verify -- Yes --> SignJWT[Generate Signed JWT Token]
    SignJWT --> LocalStore[Save Token to LocalStorage/Zustand]
    LocalStore --> Redirect[Redirect to Profile/Shop]
    
    Redirect --> Middle[Auth Middleware]
    Middle --> ValidToken{Token Verified?}
    ValidToken -- No --> Start
    ValidToken -- Yes --> Access([Access Orders/Wishlist])
```

---

## 3. The Precision Purchase Flow (Checkout Logic)
This describes how the system handles the transition from jewelry selection to financial confirmation.

```mermaid
flowchart TD
    A[Add Item to Cart] --> B[Zustand State Update]
    B --> C{User clicks Checkout?}
    C -- No --> A
    C -- Yes --> D[Verify Stock in DB]
    
    D --> StockCheck{Available?}
    StockCheck -- No --> Alert[Show 'Out of Stock' Error]
    StockCheck -- Yes --> Session[Create Stripe Checkout Session]
    
    Session --> Pay[External Payment Processing]
    Pay --> Result{Payment Approved?}
    
    Result -- No --> Fail[Redirect to Cart with Error]
    Result -- Yes --> DBUpdate[Update Order Status to 'Paid']
    DBUpdate --> StockDown[Decrement Inventory Stock]
    StockDown --> Success([Show Payment Success Page])
```

---

## 4. Admin Inventory Management Flow
This describes the internal logic used by the shop owner to maintain the digital showroom.

```mermaid
flowchart LR
    Login([Admin Dashboard]) --> Select[Select Action]
    
    Select --> Add[Add New Jewelry]
    Select --> Update[Edit Existing Item]
    Select --> Delete[Remove Product]
    
    Add --> Form[Enter Weight/Karat/Price/Image]
    Form --> Valid{Valid?}
    Valid -- Yes --> Commit[(Insert into Supabase)]
    Commit --> Refresh[Update Frontend Catalog]
    
    Update --> Patch[Query specific UUID]
    Patch --> Save[Update specific fields]
    Save --> Refresh
```
