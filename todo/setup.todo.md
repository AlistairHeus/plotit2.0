## 🛠️ Server Rewrite Technical Specification

### Entities 

[x] **Users**

[x] **Universe**

[x] **Region**

[x] **Map**

[x] **SvgMapping**

[ ] **Race**

[ ] **Religion**
[ ] **Ethnic Group**
[ ] **Construct**
[ ] **Power System**
[ ] **Power Subsystem**
[ ] **Power Category**
[ ] **Power Ability**
[ ] **Character Power Access**
[ ] **Character**



### Phase 0: Base Infrastructure (Already Completed)
* [x] **Registration:** Sign-up flow with email/password.
* [x] **Profile:** CRUD for `User` (bio, social links, username).
* [x] **Auth Guard:** Validates session/token.
* [x] **Authentication:** JWT or Session token issuance.
* [x] **Validation:** Schema-based input validation (e.g., Zod, Joi, or Pydantic).
* [x] **Error Handler:** Global wrapper for consistent HTTP status codes.

---

### Step 1: The Foundational Utilities
**Goal:** Establish systems that all future entities rely on.

* **Global Middleware**
* [ ] **Ownership Guard:** Validates resource ownership via `UniverseID`.

* **File Services**
* [ ] **Upload Service:** Handle `multipart/form-data`.
* [ ] **Image Processor:** Avatar/Map resizing and validation.
* [ ] **Storage Integration:** Local storage or S3/CDN provider.

---

### Step 2: The Lore Primitives (Zero-Dependency Entities)
**Goal:** Core lore entities that only depend on the Universe.

* **World Elements (Primitives)**
* [ ] **Religions:** Tracking Deities, Tenets, and Holy Sites.
* [ ] **Races:** Define lifespans, origins, and languages.
* [ ] **Ethnic Groups:** Regional adaptations and cultural traits.
* [ ] **Constructs:** Data models for Afflictions, Manifestations, and Vestiges.

---

### Step 3: The Core Actors
**Goal:** Build entities that rely on primitives.

* **Demographics API (CRUD)**
* [ ] **Characters:** Core entity (backgrounds/traits) with image gallery support. Requires File Services (avatars), Races, and Ethnic Groups.

---

### Step 4: The Physical World (Cosmology & Geography)
**Goal:** Strictly hierarchical physical world building.

* **The Celestial Stack**
* [ ] **Cosmology Entities:** Hierarchy: `Galaxy` → `Solar System` → `Star/Planet` → `Moon`.

* **Geographical Mapping**
* [ ] **Regions:** Recursive hierarchy (Continent → Ocean → City). Links to Planets and Religions.
* [ ] **Fantasy Maps:** Image/SVG upload and management.
* [ ] **Grid System:** Logic for hex/square coordinate data (terrain, elevation).
* [ ] **Map Regions:** Overlaying sub-regions onto map canvases.

---

### Step 5: Power Architecture
**Goal:** Highly relational power trees.

* **Magic & Power Systems**
* [ ] **Root of Power:** Base structure.
* [ ] **Power Systems:** Main systems inside the Root.
* [ ] **Power Subsystems & Categories:** Subdivisions of Power Systems.
* [ ] **Ability Catalog (Power Abilities):** Spells/techniques with mana cost, damage, and cooldowns.
* [ ] **Character Power Access:** Bridge table linking Characters to Abilities (Mastery, Usage).

---

### Step 6: The Interconnective Tissue (Notes)
**Goal:** Enable cross-referencing and rich-text associations across all modules.

* **The Mentions System**
* [ ] **Notes API:** Rich text storage attachable to any entity ID.
* [ ] **Entity Linking:** Automatic/Manual tracking of mentions (e.g., "Character A" mentioned in "Region B's" lore).
* [ ] **Relationship Graph:** API to list all entities linked to a specific note or record.

---

### 📊 Data Hierarchy Overview

| Module | Primary Complexity | Dependencies |
| --- | --- | --- |
| **Auth** | Security/Encryption | None |
| **Foundation Utilities** | File processing | Universe ID |
| **Primitives** | Self-contained CRUD | Universe ID |
| **Characters** | Image Gallaries | Races, Ethnic Groups, File Services |
| **Cosmology** | Nested Relationships | Universe ID |
| **Maps & Regions** | Coordinate Logic | Regions, Religions, Planets, Assets |
| **Power Systems** | Relational Overlap | Characters |
| **Notes** | Polymorphic Links | All Entities |