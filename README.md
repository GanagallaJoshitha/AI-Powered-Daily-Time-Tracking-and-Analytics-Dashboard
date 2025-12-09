# AI‑Powered Daily Time Tracking and Analytics Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/GanagallaJoshitha/AI-Powered-Daily-Time-Tracking-and-Analytics-Dashboard/actions)
[![Demo](https://img.shields.io/badge/demo-online-blue)](https://your-live-demo-link.com)

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Motivation & Objectives](#motivation--objectives)  
3. [Features](#features)  
4. [Tech Stack](#tech-stack)  
5. [Project Architecture](#project-architecture)  
6. [Folder / File Structure](#folder--file-structure)  
7. [Setup & Installation](#setup--installation)  
8. [Usage](#usage)  
9. [Data Flow & Storage](#data-flow--storage)  
10. [Extending / Contributing](#extending--contributing)  
11. [Future Enhancements / Roadmap](#future-enhancements--roadmap)  
12. [License & Acknowledgements](#license--acknowledgements)  
13. [Contact / Author Info](#contact--author-info)  

---

## Project Overview

The **AI‑Powered Daily Time Tracking and Analytics Dashboard** is a web application designed to help users track daily tasks and time usage, and analyze their productivity trends.  
Users can log daily activities, visualize the data on an interactive dashboard, and gain insights into how time is spent.  

The app is built using **TypeScript + Vite**, providing a fast, modular, and maintainable codebase.

---

## Motivation & Objectives

- Provide a simple and intuitive dashboard for daily time/task tracking.  
- Allow users to log tasks and time efficiently.  
- Offer analytics to show trends and insights over days/weeks/months.  
- Demonstrate modern **TypeScript + Vite + React** project structure.  
- Serve as a portfolio project showcasing real-world application development skills.

---

## Features

| Feature | Description |
|---------|-------------|
| Log Time/Tasks | Add new daily entries with task details and time spent |
| Edit / Delete Entries | Update or remove logged entries |
| Dashboard Visualization | View logged data in a structured and readable way |
| Analytics & Insights | Summarize trends, totals, or patterns over time |
| Responsive Design | Works on desktop and mobile devices |
| Extensible & Modular | Component-based structure for easy maintenance |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, HTML, CSS (or TailwindCSS) |
| Build Tool | Vite + Rollup |
| State Management | React Hooks (`useState`, `useEffect`) |
| Storage | LocalStorage (or backend if implemented) |
| Version Control | Git + GitHub |

---

## Project Architecture

- Modular design with **components**, **services**, and configuration files.  
- **Entry Point:** `index.tsx` → main component `App.tsx`.  
- **Components:** UI logic is separated into reusable React components.  
- **Services:** Handle data operations like CRUD and storage interactions.  
- **Build Setup:** Vite + TypeScript for fast builds and modern JS features.  

**Data Flow:**
User Interaction → Component State → Services → LocalStorage / Backend → Dashboard Visualization

---

## Folder / File Structure

<img width="421" height="272" alt="image" src="https://github.com/user-attachments/assets/3b2dce09-34d8-481f-94c9-917f3b971d80" />

## Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/GanagallaJoshitha/AI-Powered-Daily-Time-Tracking-and-Analytics-Dashboard.git
2. Navigate to project folder
cd AI-Powered-Daily-Time-Tracking-and-Analytics-Dashboard
3. Install dependencies
npm install
4. Run development server
npm run dev
5. Build for production
npm run build
⚠️ Make sure Node.js and npm are installed.
⚠️ This project integrates Google AI Studio for AI-powered analytics, so ensure API keys or project setup is configured in .env if required.
