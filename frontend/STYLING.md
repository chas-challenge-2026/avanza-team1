# Styling Guidelines for CSS

## File structure (what goes where)

- `src/index.css`: Global styles and resets
    
    Put styles that apply to the outlines of the application here. 
    - CSS resets
    - typography 
    - variables for colors, spacing and other global properties.

- `src/App.css`: App countainer layout
    
    Put styles that are specific to the main application layout and here.
    - page sections placing
    - responsive handling for page sections

- `src/components/`: Component-specific styles
    
    Put styles for individual components here, ensuring they are scoped to avoid conflicts with other components.

    Controll the sizing of the component in its .module.css file, and let the parent component handle the placement of the component on the page. The component should handle its own internal responsive behavior (using @media or @container queries or flexbox/grid, whatever is appropriate).

## Naming conventions
- Use camelCase for class names, IDs and CSS variables if clear descriptions require multiple words.
    - **Don't:** .card-title
    - **Do:** .cardTitle

- Avoid concatenating class names for specificity. Instead, use a class name that describes only that element and rely on the component structure and scoped CSS modules to manage specificity.
    - **Don't:** .card with .cardTitle and .cardBody children
    - **Do:** .card with .title and .body children