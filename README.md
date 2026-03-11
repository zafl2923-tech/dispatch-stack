# :truck: DispatchStack

### **North American Logistics & Regulatory Compliance Platform**
**DispatchStack** is a full-stack Electronic Logging Device (ELD) solution architected to manage cross-border commercial transit across **Canada, the USA, and Mexico**. It features a high-performance **.NET 10** backend and a reactive **Next.js** dashboard designed to enforce the complex, location-specific **Hours of Service (HOS)** regulations of the USMCA zone.

---

## :building_construction: System Architecture
Built for sub-second validation and high data integrity to meet federal audit standards.

* **Backend:** .NET 10 Web API (C#) using a **Strategy Pattern** for multi-jurisdictional compliance.
* **Frontend:** Next.js 15 (TypeScript) with real-time state synchronization.
* **Database:** PostgreSQL + EF Core (Optimized for time-series duty status logs).
* **Geospatial:** Jurisdictional switching triggered by GPS-based boundary detection.

---

## :balance_scale: The USMCA Compliance Engine
The "Brain" of DispatchStack automatically swaps validation rules as drivers cross international borders:

| Feature | :canada: Canada (South of 60°) | :us: USA (Federal) | :mexico: Mexico (NOM-087) |
| :--- | :--- | :--- | :--- |
| **Max Drive Time** | 13 Hours | 11 Hours | 14 Hours |
| **Daily Duty Limit** | 14 Hours | 14 Hours | 14 Hours |
| **Mandatory Break** | N/A | 30m after 8h driving | **30m after 5h driving** |
| **Daily Rest** | 10 Hours | 10 Hours | 8 Hours |

---

## :brain: Key Technical Challenges Solved
* **State Machine Persistence:** Tracking active "Driving" or "On-Duty" states through a heartbeat system to prevent data loss during 11+ hour journeys.
* **Cross-Border Transition:** Implementing a seamless logic handoff when a driver moves between jurisdictions (e.g., detecting the 2-hour drive-time reduction when entering the USA from Canada).
* **High-Integrity Audit Trail:** Database architecture designed for immutability, ensuring that log certifications meet **Transport Canada** and **FMCSA** forensic standards.

---

## :rocket: Development Status
* **Current Focus:** Architecting the `JurisdictionStrategy` in C# to handle the 2026 Mexico NOM-087 break requirements.
* **Database:** PostgreSQL schema initialized with `Drivers`, `Trucks`, and `Companies` tables.
* **Frontend:** Next.js dashboard scaffolded with real-time "Time Remaining" countdowns.

---

## 📚 Documentation

- **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** - Complete database setup, testing, and management guide

---
