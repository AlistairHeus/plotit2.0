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

---

## Phase 3: Advanced Worldbuilding (Connecting the Pieces)
The current system excellently handles the static entities of a world (Places, People, Magic, Items). This phase introduces time, society, nature, and information to breathe life and conflict into those entities.

### 1. Factions & Organizations
Political and social groupings that drive plot, trade, and conflict.
- [ ] Define Faction Schema (`name`, `type` [Guild, Government, Cult, etc.], `influence`, `wealth`)
- [ ] Establish Relations: Faction to `Region` (headquarters/territory), Faction to `Character` (members/leaders)
- [ ] Build Faction Server Layer (Repository, Service, Controller, Router)
- [ ] Build Faction Client Layer (API, UI Pages: List & Detail)
- [ ] **Challenge**: Implement a "Rivalries/Alliances" self-referencing relation.

### 2. History & Timeline System
The chronological backbone of the world. Essential for tracking cause and effect.
- [ ] Define Era Schema (e.g., "The First Age", `startYear`, `endYear`)
- [ ] Define Historical Event Schema (`name`, `date/year`, `description`, `eraId`)
- [ ] Establish Relations: Event to any entity (Characters born, Constructs built, Regions destroyed, Factions formed)
- [ ] Build History Server Layer (Repository, Service, Controller, Router)
- [ ] Build History Client Layer (API, Timeline View UI to visualize events chronologically)

### 3. Flora, Fauna, and Materials (The Natural World)
The ecosystem and resources that populate the world and fuel the economy/magic.
- [ ] Define Species/Material Schema (`name`, `type` [Plant, Animal, Monster, Mineral], `rarity`, `properties`)
- [ ] Establish Relations: Species to `Region` (habitat), Species to `Power System` (magical catalysts)
- [ ] Build Natural World Server Layer (Repository, Service, Controller, Router)
- [ ] Build Natural World Client Layer (API, UI Pages: List & Detail)

### 4. Lore, Myths, & Documents
Intangible worldbuilding elements that characters interact with or believe in.
- [ ] Define Document/Lore Schema (`title`, `content`, `author`, `type` [Prophecy, Law, Myth, Song])
- [ ] Establish Relations: Document to `Character` (author/subject), Document to `Religion` (sacred text)
- [ ] Build Lore Server Layer
- [ ] Build Lore Client Layer (API, UI Pages: List & Detail - needs a good rich-text viewer)

---

## Phase 4: Pre-Writing & Plotting (The Bridge)
This phase connects the worldbuilding wiki to narrative structure. It’s where the user starts planning what happens in the world.

### 1. Story Arcs & Plotlines
High-level structural containers for the narrative.
- [ ] Define Arc Schema (`title`, `summary`, `status`, `type` [Main Plot, Character Subplot, World Event])
- [ ] Establish Relations: Arc to `Character` (who it affects), Arc to `Historical Event` (what it culminates in)
- [ ] Build Arc Server Layer
- [ ] Build Arc Client Layer (API, Kanban-style board for dragging and dropping arc progression)

### 2. Scenes & Chapters
The most granular level of planning before actual writing.
- [ ] Define Scene Schema (`title`, `summary`, `povCharacterId`, `locationId`, `orderIndex`)
- [ ] Establish Relations: Scene to `Character` (POV), Scene to `Region`/`Construct` (Setting), Scene to `Arc`
- [ ] Build Scene Server Layer
- [ ] Build Scene Client Layer (API, Outline List View with drag-and-drop reordering)

---

## Phase 5: Story/Book Writing (The Execution)
The final phase turns PlotIt into a functional word processor deeply integrated with the user's world database.

### 1. The Manuscript Workspace
- [ ] Define Manuscript/Book Schema (Top-level container for chapters/scenes)
- [ ] Build a robust Rich Text Editor component (e.g., using TipTap or Slate.js)
- [ ] Implement auto-saving and word count tracking.
- [ ] Implement a "Distraction-Free" writing mode UI.

### 2. The Context Panel (The Killer Feature)
- [ ] Build a collapsible side-panel in the manuscript editor.
- [ ] Implement cross-referencing: Allow users to highlight a word (e.g., a Character or Region name) and quickly pull up that entity's wiki page in the side-panel without leaving the editor.
- [ ] Implement quick-create: Allow users to create brief stubs for new entities (like a new Faction) directly from the writing interface to flesh out later.

---

## Technical Debt & Continuous Integration (Ongoing)
- [ ] **Asset Management**: Ensure the generic image/avatar upload system is robust enough to handle the sheer volume of entities coming in these new phases.
- [ ] **Global Search**: As the database grows, implement a global search bar (Omnibar) to quickly jump between any entity type (Character -> Region -> Scene).
- [ ] **Performance**: Optimize heavily relation-dependent queries (like fetching a Region and all its Factions, Flora, Historical Events, and Scenes).
