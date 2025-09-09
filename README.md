# Document List App

## Reasoning and Ideas

This project is a modular, frameworkless TypeScript/Sass frontend for a document management app, designed with clean architecture and DDD principles.

The user interface is intentionally kept basic and may not be pixel-perfect. The focus is on clean architecture, modularity, and maintainability rather than exact visual matching. The styles are designed for clarity and usability in the latest versions of Chrome.

State management is modular and testable, and the codebase is organized for clarity and maintainability.

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
