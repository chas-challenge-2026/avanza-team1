# Styling Guidelines for CSS

## File structure (what goes where)

- `src/index.css`: Global styles and resets
    
    Put styles that apply to the entire application here, such as CSS resets, typography, and variables for colors, spacing and other global properties.

- `src/App.css`: App-specific styles
    
    Put styles that are specific to the main application layout and here, such as rules for responsive design.

- `src/components/`: Component-specific styles
    
    Put styles for individual components here, ensuring they are scoped to avoid conflicts with other components.

## Naming conventions

- Use kebab-case for class names, IDs and CSS variables.
- Avoid concatenating class names for specificity (ex: .card .card-title .card-body). Instead, use a class name that describes that element and rely on the component structure and scoped CSS modules to manage styles (ex: .card .title .body).