# ChatSpace 💬

A modern real-time chat application built with **React, GraphQL (Hasura), and Nhost Auth**.  
It supports **secure authentication, persistent chat history, and real-time updates**.  

---

## 🚀 Features

- 🔐 **Authentication**
  - Email & password login
  - Email verification before access
  - Secure session management with JWT

- 💬 **Chat System**
  - User + Assistant messages stored in Postgres via Hasura
  - Real-time updates using GraphQL Subscriptions
  - Messages persist after refresh

- 🎨 **Modern UI**
  - Built with **React + TailwindCSS**
  - Responsive design
  - Clean chat thread with timestamps

- ☁️ **Deployment**
  - Ready for **Netlify deployment**
  - Works with Hasura + Nhost backend

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS  
- **Backend:** Hasura GraphQL Engine, PostgreSQL  
- **Auth:** Nhost Authentication  
- **Deployment:** Netlify  

---

## 📂 Project Structure

```
ChatSpace/
│── src/
│   ├── components/        # UI components (Login, Thread, MessageBubble)
│   ├── graphql/           # Queries, Mutations, Subscriptions
│   ├── pages/             # Main app pages
│   └── App.tsx            # Entry point
│
│── package.json
│── tailwind.config.js
│── README.md
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/chatspace.git
cd chatspace
```

### 2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Setup Nhost/Hasura
- Create an **Nhost project** at [https://nhost.io](https://nhost.io)  
- Enable:
  - Authentication (Email/Password, Email Verification ON)
  - Database (messages table with fields: `id`, `chat_id`, `content`, `sender`, `created_at`)
  - GraphQL API

- Copy your **Nhost backend URL** & **GraphQL endpoint**

### 4️⃣ Configure environment
Create a `.env` file:
```env
VITE_NHOST_BACKEND_URL=https://your-nhost-backend-url
```

### 5️⃣ Run locally
```bash
npm run dev
```
Visit 👉 [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment (Netlify)

1. Push your code to GitHub  
2. Go to [Netlify](https://netlify.com) → **New site from Git**  
3. Connect your repo  
4. Add environment variable:
   ```
   VITE_NHOST_BACKEND_URL=https://your-nhost-backend-url
   ```
5. Deploy 🎉

---

## 📸 Screenshots

👉 *(Add images later, e.g. login page, chat UI, email verification flow)*

---

## 🔮 Future Improvements

- ✅ Dark mode support  
- ✅ File & image sharing  
- ✅ Better typing indicators  
- ✅ Chat rooms / multi-user support  

---

## 🤝 Contributing

Pull requests are welcome!  
If you’d like to add features, fix bugs, or improve docs, feel free to fork the repo and submit a PR.

---

## 📜 License

MIT License © 2025 Mandeep Malik
