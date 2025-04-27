# AI PERSONAL TRAINER AND CALORIE TRACKER
This website helps calculate your daily Total Energy Expenditure (TEE) to achieve your goal, whether it's to cut, maintain, or bulk.
It also allows you to analyze food nutrition and calories based on your input, making calorie tracking much easier!

Key Features:
- **Calorie Tracker:** Automatically calculates and tracks the calories and nutrition in your food.
- **AI Chatbot:** Recommends daily food based on your TEE, considering your dietary preferences (vegetarian, vegan, keto, etc.) and allergies (fish, shrimp, nuts, etc.).
- **Exercise Form Detection:** Detects your push-up or squat form and provides feedback on correctness, helping you avoid injury.

This project is built by:
The Fifth Sense:
- Abdur Robi Alfian (231111968)
- James (231111512)
- Miranda Nadilla Putri (231112195)
- Nailah Assyifa (231112334)
- Wilmer Tanton (231112849)

## Table of Contents
- [Prerequisites](#book-prerequisites)
- [Database Setup](#database-setup)
- [Setup Instructions](#setup-instructions)
- [Chatbot Input Format](#chatbot-input-format)
- [Troubleshooting](#troubleshooting)

### :book: Prerequisites
- **Node.js** (make sure Node.js is installed, at least version 14.x or higher)
- **MySQL** (for the backend)
- You also need to have your API keys for third-party services (e.g., Spoonacular, Huggingface) ready.

## Database Setup

The project uses a MySQL database for storing data. To set up the database, follow these steps:

1. **Import the Default Database Schema:**
   - The default database schema is located in the `database/` folder of the repository (`database_projectAI.sql`).
   - You can import the SQL file into your MySQL server using the following command:
     ```sh
     mysql -u yourusername -p yourpassword yourdatabase < path/to/database.sql
     ```

2. **Update Database Credentials:**
   - Make sure the credentials in the `.env` file match your local MySQL setup. This includes `DB_NAME`, `DB_USER`, `DB_PASS`, and other database settings.

### Example of the database.sql file:
Here’s a sample of how the `database.sql` file might look:
```sql
CREATE DATABASE IF NOT EXISTS yourdatabase;

USE yourdatabase;

CREATE TABLE if not exists `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birthdate` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `height_cm` int(11) NOT NULL,
  `weight_kg` int(11) NOT NULL,
  `gender` enum('m','f') DEFAULT NULL,
  `goal` enum('cut','maintain','bulk') DEFAULT NULL,
  `daily_activity_category` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);
```

## SETUP INSTRUCTIONS
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/LordJmw/Projek_AI
cd Projek_AI
```

### 2️⃣ Install Dependencies
#### For Backend
```sh
cd personal-trainer-ai-backend
npm install
```

#### For Frontend
```sh
cd ../personal-trainer-ai
npm install
```

### :three Set Up The Environment Variables
create a .env file in both folders to configure it properly
For the Backend (/personal-trainer-ai-backend/.env):
```sh
DB_NAME=yourdatabase
PORT=3000
DB_USER=root
DB_PORT=3306
DB_PASS=yourpassword
DB_HOST=localhost
DB_DIALECT=mysql
SPOONACULAR_API_KEY=yourspoonacularapikey
JWT_SECRET=yourjwtsecret
REPLICATE_API_TOKEN=yourreplicateapikey
HUGGINGFACE_API_KEY=yourhuggingfaceapikey
```

For the FrontEnd (/personal-trainer-ai/.env):
```sh
VITE_API_URL=http://localhost:3000
```

### 4️⃣ Start the Project
Start the Backend
```sh
cd personal-trainer-ai-backend
npm start
```

Start The Front End
```sh
cd ../personal-trainer-ai
npm run dev
```

Front End wil run on:
- htpp://localhost:5173

### CHATBOT Input Format
While using the chatbot, make sure your input has the word:
- **daily**, if you want the chatbox to recommend daily food for you
```sh
recommend daily food for me
```
you can also add TEE(Total Energy Expenditure) if you want the chatbox to recommend daily food based on that
```sh
recommend daily food for me based on my tee
```
you can also include your diet type(vegan,keto,etc) and your allergies(fish,shrimp,etc)
```sh
recommend daily food for me i'm allergic to fish
recommend daily food for me i'm keto
```
- **Calories** if you want to know some food around x calories
```sh
tell me some food around 250 calories
```
same as the one above, you can add your diet type and your allergic
```sh
tell me some food around 250 calories and i'm allergic to nut
```

### TroubleShooting
If you run into any issues, here are some common fixes:

- **Error: Could not connect to database**: Ensure that your MySQL server is running, and the credentials in your `.env` file are correct.
- **Error: API key missing**: Double-check that you've added your API keys in the respective `.env` files.
