# Document List App Test

## Reasoning and Ideas

This project is a modular, frameworkless TypeScript/Sass frontend for a document management app, designed with clean architecture and DDD principles.

The user interface is intentionally kept basic and may not be pixel-perfect. The focus is on clean architecture, modularity, and maintainability rather than exact visual matching. The styles are designed for clarity and usability in the latest versions of Chrome.

State management is modular and testable, and the codebase is organized for clarity and maintainability.

**Key ideas:**

- No framework: pure TypeScript, modular components, and clean separation of concerns.
- Modern Sass: variables, partials, and encapsulated styles for each component.
- Real-time updates: WebSocket integration for live document list updates.
- Robust testing: Vitest for unit and integration tests, colocated with features.
- Linting: ESLint with TypeScript support for code quality.

## Features

### 1. Document Synchronization Modes

The application supports two synchronization modes for handling documents from different sources (user-created via UI and external via WebSocket):

#### Merge Mode (Default)

```typescript
documentStore.setMergeMode('merge');
```

**Behavior:**

- Preserves locally created documents (added via the form)
- Adds new documents received from WebSocket notifications at the beginning of the list
- Maintains existing documents from previous API calls
- Document order: `[New API docs, User-created docs, Existing API docs]`

**Use Case:** Ideal for collaborative environments where users want to see both their own work and updates from other sources without losing their local changes.

#### Replace Mode

```typescript
documentStore.setMergeMode('replace');
```

**Behavior:**

- Replaces the entire document list with fresh data from the API
- Does not preserve locally created documents
- Shows only the most up-to-date server state

**Use Case:** Useful when you want to ensure the UI always reflects the exact server state, prioritizing data consistency over local changes.

#### Technical Implementation

The synchronization logic handles three types of documents:

1. **New API Documents**: Fresh documents received after a fetch triggered by the WebSocket notifications
2. **User-Created Documents**: Documents added locally via the form that haven't been synced to the server yet
3. **Existing API Documents**: Documents that were previously fetched and are still present in the server response

#### Why This Pattern?

**Problem Solved:**

- **Race Conditions**: Prevents user-created documents from being overwritten by WebSocket updates
- **Data Loss**: Ensures locally created content isn't lost during real-time synchronization
- **Flexibility**: Allows different synchronization strategies based on use case requirements
- **User Experience**: Maintains user's work while keeping them updated with external changes

**Configuration:**
The mode can be changed at runtime or set during application initialization in `main.ts`.

### 2. Relative Date Display

Each document shows its creation date in a user-friendly relative format below the version number.

### 3. UX Design Decisions

**Fixed Add Button & Scrollable List**

Based on the requirement that new documents (from WebSocket notifications) should appear at the top of the list, I implemented a fixed "Add Document" button with a scrollable document container. This design ensures:

- **Immediate visibility** of new documents without requiring user scroll
- **Persistent accessibility** of the add document button regardless of list length

## Possible Future Features

### Offline Support

Enable seamless offline functionality through a combination of Service Workers (for caching), IndexedDB (for local storage), and sync queues (for conflict resolution when reconnecting).

### Enhanced Search & Filtering

Implement full-text search, advanced filtering by date/contributor/attachments, and saved filter presets.

### Pagination or Lazy Loading

Handle large datasets efficiently by loading and displaying data progressively, improving performance and user experience with techniques like virtual scrolling or chunked API requests.

## How to Run the App

1. **Install dependencies:**

```sh
npm install
```

2. **Start the development server:**

```sh
npm run dev
```

The app will be available at [http://localhost:8081/](http://localhost:8081/)

## How to Run the Tests

1. **Run all tests:**

```sh
npm run test
```

This will execute all unit and integration tests using Vitest.

---

Feel free to explore the code and reach out for comments or questions!
