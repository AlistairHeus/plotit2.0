## 🛠️ Server Rewrite Technical Specification

### Entities 

[x] **Users**
[x] **Universe**
[x] **Region**
[x] **Map** (Image/SVG)
[x] **SvgMapping** (Regions/Points on SVG)
[x] **Race**
[x] **Ethnic Group**
[x] **Celestial** (Galaxies, Solar Systems, Stars, Planets)
[x] **Religion**
[x] **Construct**
[x] **Power System** (Root, System, Subsystem, Category, Ability)
[x] **Power Subsystem**
[x] **Power Category**
[x] **Power Ability**
[x] **Character Power Access**
[x] **Character**

---

### Phase 0: Base Infrastructure
* [x] **Registration:** Sign-up flow with email/password.
* [x] **Profile:** CRUD for `User`.
* [x] **Auth Guard:** Validates session/token.
* [x] **Authentication:** JWT issuance.
* [x] **Validation:** Zod-based validation.
* [x] **Error Handler:** Global wrapper for consistent HTTP status codes.

---

### Step 1: Foundational Utilities
**Goal:** Establish systems that all future entities rely on.

* **Global Middleware**
* [x] **Ownership Guard:** Validates resource ownership via `UniverseID` (`validateUniverseOwnership`).

* **File Services**
* [x] **Upload Service:** Handle `multipart/form-data` via Multer.
* [ ] **Image Processor:** Advanced Avatar/Map resizing and optimization.
* [x] **Storage Integration:** Local storage implemented. (S3/CDN integration pending).

---

### Step 2: The Lore Primitives
**Goal:** Core lore entities that only depend on the Universe.

* **World Elements (Primitives)**
* [x] **Religions:** Tracking Deities, Tenets, and Holy Sites.
* [x] **Races:** Lifespans, origins, and languages.
* [x] **Ethnic Groups:** Regional adaptations (Integrated with Races).
* [x] **Constructs:** Afflictions, Manifestations, and Vestiges.

---

### Step 3: The Core Actors
**Goal:** Build entities that rely on primitives.

* **Demographics API (CRUD)**
* [x] **Characters:** Core entity with image gallery, Race, and Ethnic group associations.

---

### Step 4: The Physical World (Cosmology & Geography)
**Goal:** Strictly hierarchical physical world building.

* **The Celestial Stack**
* [x] **Cosmology Entities:** ✅ `Galaxy` → `Solar System` → `Star/Planet` → `Moon`.

* **Geographical Mapping**
* [x] **Regions:** Recursive hierarchy (Continent → City).
* [x] **Fantasy Maps:** Image/SVG upload and point/region mapping.
* [ ] **Grid System:** Logic for hex/square coordinate data (terrain, elevation).
* [x] **Map Regions:** Overlaying sub-regions onto map canvases.

---

### Step 5: Power Architecture
**Goal:** Highly relational power trees.

* **Magic & Power Systems**
* [x] **Power Architecture:** 5-level hierarchy (Root → System → Subsystem → Category → Ability).
* [x] **Character Power Access:** Linkages between characters and their mastery.
* [x] **Power Canvas:** (Frontend) Tree visualization for power hierarchies.

---

### 📊 Data Hierarchy Overview

| Module | Primary Complexity | Dependencies | Status |
| --- | --- | --- | --- |
| **Auth** | Security/Encryption | None | ✅ Done |
| **Foundation Utilities** | Ownership / Uploads | Universe ID | 🟡 In Progress (Optimization) |
| **Primitives** | Self-contained CRUD | Universe ID | ✅ Done |
| **Characters** | Image Galleries | Races, Ethnic Groups | ✅ Done |
| **Cosmology** | Nested Relationships | Universe ID | ✅ Done |
| **Maps & Regions** | Coordinate / SVG Logic | Regions, Religions | ✅ Done |
| **Power Systems** | Relational Overlap | Characters | ✅ Done |
| **Mentions** | Polymorphic Links | All Entities | ❌ Pending |
