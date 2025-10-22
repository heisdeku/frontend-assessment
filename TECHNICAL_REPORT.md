# Technical Report: Frontend Assessment Optimizations

This report details the technical improvements made to the frontend assessment codebase, focusing on performance, modularity, user experience and maintainability.

## 1. Performance Optimizations

### Heavy CPU Computation Offloading with Web Workers

To prevent the main thread from becoming blocked during CPU-intensive operations, a web worker has been implemented to handle heavy computations. This ensures a smooth and responsive user interface, even when processing large amounts of data. The implementation can be found in `src/workers/risk-worker.ts`.

### Virtualizing Large Datasets

To efficiently render large lists of transactions without sacrificing performance, the application utilizes list virtualization. The `DesktopTransactionList.tsx` component leverages the `@tanstack/react-virtual` library to render only the items currently visible to the user. This significantly reduces the number of DOM elements and improves rendering speed, especially for large datasets.

### Debouncing User Input

To optimize performance and prevent excessive API calls or re-renders, user input in components like the search bar is debounced. The `useDebounce` hook in `src/hooks/useDebounce.ts` is used for this purpose.

## 2. Architecture & Code Quality

### Modularized Components and Separation of Concerns

The application's components have been refactored to promote modularity and a clear separation of concerns. This makes the codebase easier to understand, maintain, and test.

- **`src/components/`**: The `Dashboard.tsx` component serves as the main container, composing smaller, more focused components:

  - `DashboardStats.tsx`: Displays key metrics and statistics.
  - `SearchBar.tsx`: Provides search functionality.
  - `DashboardFilterControls.tsx`: Allows users to filter transactions.
  - `TransactionList.tsx`: Renders the list of transactions.
  - `TransactionDetailModal.tsx`: Shows detailed information for a selected transaction.

- **Custom Hooks**: Business logic has been extracted from components into custom hooks, separating the UI from the underlying logic and improving reusability and testability:
  - `useTransactions`: Manages the state of transactions, including fetching, filtering, and searching.
  - `useRiskAnalytics`: Handles the calculation of transaction risk analytics, offloading heavy computations to a web worker.
  - `useDebounce`: Debounces user input to optimize performance.
  - `useClickOutside`: Detects clicks outside of a specified element, useful for closing modals or dropdowns.
  - `useIsMobile`: Checks if the current device is a mobile device, allowing for responsive UI adjustments.

### State Management

The `UserContext.tsx` in `src/contexts/` provides a centralized way to manage user-related state throughout the application.

## 3. UI/UX Enhancements

### Responsive Design

The application employs a responsive design to provide an optimal viewing experience across a wide range of devices. The `TransactionList.tsx` component dynamically renders either a `DesktopTransactionList.tsx` or a `MobileTransactionList.tsx` based on the screen size, detected using the `useIsMobile` hook. Both versions are optimized for performance, using virtualization to handle large datasets efficiently.

### Error Handling

The `ErrorBoundary.tsx` component is used to catch JavaScript errors anywhere in its child component tree and display a fallback UI, which prevents the entire application from crashing.

## 4. Testing

The project includes a suite of tests to ensure code quality and prevent regressions.

- **Unit Tests**: The `__tests__` directories within `src/components`, `src/hooks`, `src/utils`, and `src/workers` contain unit tests for individual components, hooks, and utility functions.

- **Testing Framework**: The testing setup uses Vitest, as indicated by the presence of `vitest.config.ts` in the root directory. Where Unit testing for functions (helpers & generators) & UI & Componet Testing with React Testing Library & Vitest
