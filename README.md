<div align="center">

# 🖋️ `.mr` Playground

**Marathi programming, right in the browser.**

Write, compile, and execute `.mr` source code in a lightweight interactive IDE.  
Under the hood, code runs through the native C++20 compiler targeting Linux x86-64 NASM—not a mock engine.

<br>

[![Playground](https://img.shields.io/badge/Live-Playground-00599C?style=for-the-badge&logo=googlechrome&logoColor=white)](https://mrplayground.vercel.app)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)]()

<br>

**[Open Live Playground →](https://mrplayground.vercel.app)**

</div>

---

## 📌 Highlights

- **Dual-Layer Editor**: Synchronized input and stateful, multiline-aware syntax highlighting engine.
- **Contextual Autocomplete & Docs**: In-editor symbol discovery, token documentation cards, and Marathi/English syntax reference.
- **Native Assembly Execution**: Connects to the `.mr` backend to run real assembly generation (`nasm` + `ld`) and streams back stdout and exit codes.
- **Interactive Preset Suite**: Instant access to language examples covering expressions, functions, loops, and conditions.

---

## ⚡ Execution Pipeline

```text
 Browser (.mr source)
          ↓
  FastAPI Runner
          ↓
  custom-compiler (C++20)
          ↓
  NASM (x86-64 ELF)
          ↓
  Native ./out
          ↓
 Terminal UI (stdout & exit status)

```

---

## 🛠️ Tech Stack

| Layer         | Technologies                                        |
| ------------- | --------------------------------------------------- |
| **Frontend**  | React, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend**   | FastAPI, Python 3.11, Uvicorn                       |
| **Toolchain** | `.mr` Native Compiler, NASM, GNU `ld`, Linux x86-64 |

---

## 🚀 Local Setup

```bash
# Clone the repository
git clone [https://github.com/anvaymayekar/mr-playground.git](https://github.com/anvaymayekar/mr-playground.git)
cd mr-playground

# Install frontend dependencies
pnpm install

# Start development server
pnpm dev

```

Visit the local workspace at `http://localhost:5173`.

---

## ⚖️ License

Apache License 2.0 — free to use, modify, and distribute with attribution.

---

## 👨‍💻 Author

> **Anvay Mayekar**  
> 🎓 B.Tech in Electronics & Computer Science — SAKEC, Mumbai
>
> [![Portfolio](https://img.shields.io/badge/Portfolio-000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://anvaymayekar.vercel.app/)
> [![GitHub](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://www.github.com/anvaymayekar)
> [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2.svg?style=for-the-badge&logo=LinkedIn&logoColor=white)](https://in.linkedin.com/in/anvaymayekar)
> [![Gmail](https://img.shields.io/badge/Gmail-D14836.svg?style=for-the-badge&logo=gmail&logoColor=white)](mailto:anvaay@gmail.com)
