# HerWay – Urban Awareness Mapping Platform (SoReMo Project)

HerWay is a data-driven platform that analyzes urban signals to understand **neighborhood-level awareness patterns** using public datasets such as 311 service requests, community data, and future multimodal inputs.

Unlike traditional “safety” tools, HerWay focuses on **awareness indicators** — highlighting patterns in infrastructure issues, response delays, and community-reported concerns.

---

## 🌍 Project Motivation

Urban data is often fragmented across multiple sources and difficult to interpret at a neighborhood level.

HerWay aims to:
- Aggregate multiple public data sources
- Identify patterns in urban issues (e.g., street lights, sanitation, complaints)
- Visualize insights interactively on a map
- Provide a foundation for awareness-based scoring

---

## 🚀 Features

- 📊 **Exploratory Data Analysis (EDA)**
  - Analysis of 311 service request data
  - Neighborhood-level aggregation and trends
  - Resolution time and request volume insights

- 🗺️ **Interactive Map Visualization**
  - Chicago neighborhood-based mapping
  - Hover-based interaction for quick insights
  - Dynamic highlighting of areas based on data patterns

- ⚙️ **Backend (In Progress)**
  - API structure for serving processed data
  - Modular design for future integrations

- 🤖 **LLM Integration (Planned)**
  - LLaMA-based chatbot for:
    - Querying neighborhood insights
    - Explaining patterns in natural language
    - Supporting decision-making

---

## 🧠 Key Idea: Awareness vs Safety

Instead of labeling areas as "safe" or "unsafe", HerWay:
- Focuses on **observable signals**
- Uses **data-backed indicators**
- Avoids subjective or biased classifications

Examples:
- High streetlight outage frequency → low night awareness
- Slow resolution times → infrastructure inefficiency
- High complaint density → active reporting zones

---

## 🏗️ Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React, JavaScript |
| Backend      | Node.js (WIP) |
| Data         | Python (pandas, geopandas) |
| Visualization| Map-based UI (GeoJSON) |
| LLM (Planned)| LLaMA |
| Deployment   | (Planned) |

