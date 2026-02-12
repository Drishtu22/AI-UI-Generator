*AI UI Generator*

Groq-Powered Deterministic UI Generation System

An AI-driven UI generator that creates dynamic user interfaces using a fixed, deterministic component library.
The system ensures AI can only compose existing components — never create new ones — making the UI stable, predictable, and assignment-compliant.

Project Overview->

This project uses:

1)Groq LLM for AI reasoning

2)Planner → Generator → Explainer architecture

3)Deterministic Component Library

4)React frontend

5)Node.js backend

The AI does not generate raw HTML or new components.
It only selects and configures components from an existing fixed component library.

🏗 Architecture
1️⃣ Planner

Takes user prompt

Decides which components are needed

Returns structured JSON plan

Example:
{
  "components": [
    {
      "type": "Card",
      "props": {
        "title": "Sales Report"
      }
    }
  ]
}

2️⃣ Generator

Converts plan into valid component configuration

Ensures props follow strict schema

Returns safe JSON

3️⃣ Explainer

Explains why those components were chosen

Describes layout logic

🎨 Deterministic Component Library

The UI can only use these components:

Button

Card

Input

Table

Modal

Sidebar

Navbar

Chart

These components:

Never change structure

Have fixed styling

Are crash-safe

Validate AI props defensively

⚙️ Tech Stack
Frontend->

React
CSS (deterministic styling)
Dynamic component renderer

Backend->

Node.js
Express
Groq SDK
JSON validation

📂 Project Structure->
AI-UI-Generator/
│
├── backend/
│   ├── planner.js
│   ├── generator.js
│   ├── explainer.js
│   ├── test-groq.js
│   └── server.js
│
├── frontend/
│   ├── components/
│   │   └── ComponentLibrary.js
│   ├── PreviewRenderer.js
│   └── App.js
│
└── README.md


🎯 Assignment Compliance

This project strictly follows the rule:

AI must use only existing components to generate or update UI.

✔ No new components created by AI
✔ No dynamic HTML injection
✔ No unsafe eval
✔ Fully structured JSON rendering

🔥 Key Features

Groq-powered AI reasoning

Structured JSON generation

Deterministic UI components

Crash-proof rendering

Safe prop validation

Modular AI pipeline

Assignment compliant architecture