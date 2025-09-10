# Document List App

## Reasoning and Ideas

This project is a modular, frameworkless TypeScript/Sass frontend for a document management app, designed with clean architecture and DDD principles.

The user interface is intentionally kept basic and may not be pixel-perfect. The focus is on clean architecture, modularity, and maintainability rather than exact visual matching. The styles are designed for clarity and usability in the latest versions of Chrome.

State management is modular and testable, and the codebase is organized for clarity and maintainability.

## Document Synchronization Modes

The application supports two synchronization modes for handling documents from different sources (user-created via UI and external via WebSocket):

### Merge Mode (Default)

```typescript
documentStore.setMergeMode('merge');
```

**Behavior:**

- Preserves locally created documents (added via the form)
- Adds new documents received from WebSocket notifications
- Maintains existing documents from previous API calls
- Document order: `[New API docs, User-created docs, Existing API docs]`

**Use Case:** Ideal for collaborative environments where users want to see both their own work and updates from other sources without losing their local changes.

### Replace Mode

```typescript
documentStore.setMergeMode('replace');
```

**Behavior:**

- Replaces the entire document list with fresh data from the API
- Does not preserve locally created documents
- Shows only the most up-to-date server state

**Use Case:** Useful when you want to ensure the UI always reflects the exact server state, prioritizing data consistency over local changes.

### Technical Implementation

The synchronization logic handles three types of documents:

1. **New API Documents**: Fresh documents received from WebSocket notifications
2. **User-Created Documents**: Documents added locally via the form that haven't been synced to the server yet
3. **Existing API Documents**: Documents that were previously fetched and are still present in the server response

```typescript
// Example of merge logic in WebSocket handler
if (documentStore.getMergeMode() === 'merge') {
  const userCreatedDocs = currentDocs.filter((doc) => !docs.some((apiDoc) => apiDoc.id === doc.id));

  const existingApiDocs = currentDocs.filter((doc) => docs.some((apiDoc) => apiDoc.id === doc.id));

  const newApiDocs = docs.filter((doc) => !existingApiIds.includes(doc.id));

  documentStore.setDocuments([...newApiDocs, ...userCreatedDocs, ...existingApiDocs]);
}
```

### Why This Pattern?

**Problem Solved:**

- **Race Conditions**: Prevents user-created documents from being overwritten by WebSocket updates
- **Data Loss**: Ensures locally created content isn't lost during real-time synchronization
- **Flexibility**: Allows different synchronization strategies based on use case requirements
- **User Experience**: Maintains user's work while keeping them updated with external changes

**Configuration:**
The mode can be changed at runtime or set during application initialization in `main.ts`.

### UX Note: Add Document Button & List Behavior

I understood that documents added via notifications should appear at the top of the list. This led me to design the UI with a fixed "Add document" button and a scrollable document list. This approach ensures that new documents are always visible immediately, and the add action is always accessible, making the interface more user friendly. I guess in a production environment, a pagination could be a good option.

**Key ideas:**

- No framework: pure TypeScript, modular components, and clean separation of concerns.
- Modern Sass: variables, partials, and encapsulated styles for each component.
- Real-time updates: WebSocket integration for live document list updates.
- Robust testing: Vitest for unit and integration tests, colocated with features.
- Linting: ESLint with TypeScript support for code quality.

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

Feel free to explore the code and reach out for improvements or questions!
