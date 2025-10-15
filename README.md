# medusa-coolify
This is for octochem
> Integration module for deploying Medusa.js projects seamlessly using [Coolify](https://coolify.io).

![image](https://github.com/user-attachments/assets/15c9cafe-ea75-4356-9917-960176b11e1d)



## 🚀 Create PostgreSQL Database

Follow these steps to set up your PostgreSQL database:

1. **Create a PostgreSQL 16 database**  
   Use the default settings unless your project requires custom configuration.

2. **Enable SSL**  
   Ensure SSL is enabled for secure database connections. (required on medusa in production mode) 
![image](https://github.com/user-attachments/assets/6841025e-58d4-4f4e-a3f3-d6ac37402770)

## ⚡ Create Redis Database

No special configuration is required — simply create a Redis instance and you're good to go!
![image](https://github.com/user-attachments/assets/c06b2c5c-b0ab-43fe-a88a-cd91ef38f7dc)

## 🧩 Create `medusa-server`

Set up the Medusa backend service with the following steps:

### 1. Configure Service

Use the Coolify UI to create a new service named **`medusa-server`**.  

Refer to the screenshots below for guidance:

![Step 1](https://github.com/user-attachments/assets/0cd80df3-eee9-4453-9859-b8ee8167ebee)  
![Step 2](https://github.com/user-attachments/assets/0bd527f4-b3bf-4942-bf5d-a77c02ed3ad3)

---

### 2. Add Environment Variables

Use the Coolify environment UI to set the following variables:

```env
# Secrets (generate securely, e.g. `openssl rand -hex 32`)
COOKIE_SECRET=supersecret
JWT_SECRET=supersecret2

# CORS settings
STORE_CORS=https://front.site.com
ADMIN_CORS=https://admin.site.com
AUTH_CORS=https://admin.site.com,https://front.site.com

# Backend configuration
BACKEND_URL=https://admin.site.com
DISABLE_ADMIN=false
WORKER_MODE=server
PORT=9000

# Database connections
DATABASE_URL=postgres://user:password@host:port/database
REDIS_URL=redis://user:password@host:port/database
```

> ⚠️ **Important:**  
> Make sure to set **"Build Variable?"** to `true` for at least `DATABASE_URL`, `WORKER_MODE` and `REDIS_URL`.

---

📘 **For more information**  
To better understand how the Medusa server and worker setup works, visit the official documentation:  
🔗 [https://docs.medusajs.com/learn/deployment](https://docs.medusajs.com/learn/deployment)


## 🧩 Create `medusa-worker`

![image](https://github.com/user-attachments/assets/0cd80df3-eee9-4453-9859-b8ee8167ebee)

![image](https://github.com/user-attachments/assets/0bd527f4-b3bf-4942-bf5d-a77c02ed3ad3)

```env
# Secrets (generate securely, e.g. `openssl rand -hex 32`)
COOKIE_SECRET=supersecret
JWT_SECRET=supersecret2

# CORS settings
STORE_CORS=https://front.site.com
ADMIN_CORS=https://admin.site.com
AUTH_CORS=https://admin.site.com,https://front.site.com

# Backend configuration
BACKEND_URL=https://admin.site.com
DISABLE_ADMIN=true
WORKER_MODE=worker
PORT=9000

# Database connections
DATABASE_URL=postgres://user:password@host:port/database
REDIS_URL=redis://user:password@host:port/database
```

> ⚠️ **Important:**  
> Make sure to set **"Build Variable?"** to `true` for at least `DATABASE_URL`, `WORKER_MODE` and `REDIS_URL`.


## 💡 Advice, Tips, Plans & More

Here are a few things to keep in mind when working with this setup:

- 🛠️ **Using the Medusa CLI**  
  To run Medusa CLI commands inside the `medusa-server`, open the Terminal tab and run:  
  ```bash
  node_modules/.bin/medusa <command>
  node_modules/.bin/medusa user --email admin@example.com --password secure_password
  ```

- 📦 **Database Migrations**  
  Only the `medusa-server` is responsible for running database migrations.

- 📁 **S3/File Storage Not Configured**  
  This setup does **not** include S3 or file storage integration by default.  
  If needed, you'll need to configure it yourself — fortunately, it’s quite simple!

- 🧪 **Development Workflow (Optional)**  
  For local development, you can use the provided `docker-compose.yaml` and fill `/medusa/.env`.  
  Start the services and run:
  ```bash
  yarn run dev
  ```
  > 💬 _Not sure if this is the optimal dev workflow — feel free to share your thoughts!_

---

🎉 That's all for now — until next time!

