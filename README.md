# AI‑Powered Daily Time Tracking and Analytics Dashboard

## Table of Contents

1. [Project Overview](#project-overview)
2. [Live Demo](#live-demo)
3. [Video Walkthrough](#video-walkthrough)  
4. [Motivation & Objectives](#motivation--objectives)  
5. [Features](#features)  
6. [Tech Stack](#tech-stack)  
7. [Project Architecture](#project-architecture)  
8. [Folder / File Structure](#folder--file-structure)
9. [Screenshots / GIFs](#screenshots--gifs)  
10. [Setup & Installation](#setup--installation)  
11. [Usage](#usage)  
12. [Data Flow & Storage](#data-flow--storage)  
13. [Extending / Contributing](#extending--contributing)  
14. [Future Enhancements / Roadmap](#future-enhancements--roadmap)  
15. [License & Acknowledgements](#license--acknowledgements)  
16. [Contact / Author Info](#contact--author-info)  

---

## Project Overview

The **AI‑Powered Daily Time Tracking and Analytics Dashboard** is a web application designed to help users track daily tasks and time usage, and analyze their productivity trends.  
Users can log daily activities, visualize the data on an interactive dashboard, and gain insights into how time is spent.  

The app is built using **TypeScript + Vite**, providing a fast, modular, and maintainable codebase.

---
## Live Demo

Check the live deployed application here:  
[**Live Demo**](https://ai.studio/apps/drive/1pvYcjJXYAaPY8-jjyBZ_S_fr6NKXJ-B4)

---

## Video Walkthrough

Watch the 2–5 minute project walkthrough here:  
[**Video Walkthrough**](https://drive.google.com/file/d/1C1V2U5lpd-7q7r3sH5f2aqHT0Mo-jBPt/view?usp=sharing)

**In this video:**
- Walkthrough of main features.  
- Demonstration of the dashboard and “No data available” state.  
- Explanation of how AI tools (Google AI Studio) were used.

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
```
git clone https://github.com/GanagallaJoshitha/AI-Powered-Daily-Time-Tracking-and-Analytics-Dashboard.git
```
2. **Navigate to the project folder**
```
cd AI-Powered-Daily-Time-Tracking-and-Analytics-Dashboard
```
3. **Install dependencies**
```
npm install
```
4. **Run the development server**
```
npm run dev
```
5. **Build for production**
```
npm run build
```
⚠️ Make sure Node.js and npm are installed.
⚠️ Google AI Studio is used for AI-powered analytics. Ensure API keys are configured in .env if required.
6. **Set up Google AI Studio / Firebase config (if required)**
Add your API keys or configuration in the .env file.


---
## Screenshots / GIFs
<img width="1875" height="860" alt="image" src="https://github.com/user-attachments/assets/90c42e1b-7c3b-4570-bf61-c7d42df76f9e" />


![SC1-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/639e6d1c-6367-411b-90fd-40b81011f909)


![SC2-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/e574a774-11f2-40d4-ae76-799ef32dd34b)


## Data Flow & Storage

1. User logs tasks/time via UI.
2. Components update the application state.
3. Data is persisted in LocalStorage or backend.
4. Dashboard displays analytics, including AI-generated insights from Google AI Studio.
5. On page reload, stored data is reloaded into the state.

Flow Diagram: 

User Input → Component State → Services → Storage (LocalStorage / Backend) → Dashboard → AI Studio Analytics → Dashboard Visualization

## Extending / Contributing

* Add multi-user authentication and backend storage.
* Enhance analytics with Google AI Studio or other AI APIs.
* Improve visualizations using charts (Chart.js, Recharts, D3.js).
* Add dark/light mode or theme customization.
* Export/import tasks in CSV/JSON formats.
* Add unit and integration tests.
* Deployment improvements using Docker or CI/CD.
* Contributions welcome via pull requests.

## Future Enhancements / Roadmap

* Multi-user support with secure login.

* Cloud syncing for tasks and analytics.

* AI-powered suggestions and predictions via Google AI Studio.

* Notifications or reminders for tasks.

* Dark mode and custom themes.

* Export/import logs in CSV/JSON formats.

* Automated testing and CI/CD deployment.

## License & Acknowledgements

* Licensed under the MIT License – see LICENSE file.

* Thanks to Google AI Studio for AI-powered analytics.

* Open-source libraries used: React, TypeScript, Vite.

## Contact / Author Info

Author: Ganagalla Joshitha
[GitHub](https://github.com/GanagallaJoshitha)
[Project Repository](https://github.com/GanagallaJoshitha/AI-Powered-Daily-Time-Tracking-and-Analytics-Dashboard)


