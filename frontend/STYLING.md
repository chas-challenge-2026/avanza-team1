# Styling Guidelines

## File structure (what goes where)

- `src/index.css`: Global styles and resets
    
    Put styles that apply to the entire application here, such as CSS resets, typography, and variables for colors, spacing and other global properties.

- `src/App.css`: App-specific styles
    
    Put styles that are specific to the main application layout and here, such as rules for responsive design.

- `src/components/`: Component-specific styles
    
    Put styles for individual components here, ensuring they are scoped to avoid conflicts with other components.

## Naming conventions

- *Use camelCase for class names and IDs.* This makes for cleaner code when applying modular styles in React components (`className={styles.myClass}` instead of `className={styles["logout-button"]}`).