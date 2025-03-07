export const tasks = [
    {
      id: "frontend-dashboard",
      title: "Frontend React Dashboard",
      category: "Frontend",
      description: `
        <p>In this task, you will build a responsive admin dashboard using React. The dashboard should include data visualization components, user authentication, and responsive design.</p>
        
        <h3>Background</h3>
        <p>ABC Corp needs a new admin dashboard to monitor their business metrics. They want a clean, modern interface that works well on both desktop and mobile devices.</p>
        
        <h3>Task Overview</h3>
        <p>Create a responsive admin dashboard with the following features:</p>
        <ul>
          <li>User authentication (login/logout)</li>
          <li>Dashboard overview with key metrics</li>
          <li>Data visualization (charts, graphs)</li>
          <li>Responsive design (mobile-friendly)</li>
          <li>Dark/light mode toggle</li>
        </ul>
        
        <h3>Data</h3>
        <p>You can use mock data for the dashboard. Create realistic sample data that would make sense for a business dashboard.</p>
      `,
      requirements: [
        "Use React for the frontend implementation",
        "Implement responsive design that works on mobile and desktop",
        "Include at least 3 different types of data visualization components",
        "Implement user authentication (can be simulated with mock data)",
        "Include dark/light mode toggle",
        "Use a component library of your choice (Material UI, Chakra UI, etc.)",
        "Implement proper error handling and loading states",
      ],
      evaluationCriteria: [
        "Code quality and organization",
        "UI/UX design and responsiveness",
        "Implementation of all required features",
        "Performance and optimization",
        "Error handling and edge cases",
        "Documentation and code comments",
      ],
    },
    {
      id: "backend-api",
      title: "Backend API Development",
      category: "Backend",
      description: `
        <p>In this task, you will create a RESTful API using Node.js and Express that includes user authentication, data validation, and proper error handling.</p>
        
        <h3>Background</h3>
        <p>XYZ Company needs a backend API for their new mobile application. The API will handle user management, product information, and order processing.</p>
        
        <h3>Task Overview</h3>
        <p>Create a RESTful API with the following features:</p>
        <ul>
          <li>User authentication and authorization</li>
          <li>CRUD operations for products</li>
          <li>Order creation and management</li>
          <li>Data validation and error handling</li>
          <li>API documentation</li>
        </ul>
        
        <h3>Data</h3>
        <p>You can use an in-memory database or a simple JSON file for data storage. Focus on the API design and implementation rather than database setup.</p>
      `,
      requirements: [
        "Use Node.js and Express for the API implementation",
        "Implement JWT-based authentication",
        "Create RESTful endpoints for users, products, and orders",
        "Implement proper data validation",
        "Handle errors gracefully with appropriate status codes",
        "Include middleware for authentication and logging",
        "Document the API endpoints",
      ],
      evaluationCriteria: [
        "API design and RESTful principles",
        "Authentication and authorization implementation",
        "Data validation and error handling",
        "Code organization and structure",
        "Security considerations",
        "Documentation quality",
      ],
    },
    {
      id: "fullstack-app",
      title: "Full-Stack Web Application",
      category: "Full-Stack",
      description: `
        <p>In this task, you will build a complete web application using Next.js that includes user authentication, data fetching from an API, and responsive design.</p>
        
        <h3>Background</h3>
        <p>123 Startup needs a simple task management application for their team. The application should allow users to create, assign, and track tasks.</p>
        
        <h3>Task Overview</h3>
        <p>Create a full-stack web application with the following features:</p>
        <ul>
          <li>User authentication (login/signup)</li>
          <li>Task creation, assignment, and status tracking</li>
          <li>Dashboard with task overview</li>
          <li>Responsive design</li>
          <li>API integration</li>
        </ul>
        
        <h3>Data</h3>
        <p>You can use mock data or implement a simple backend with Next.js API routes. Focus on the full-stack implementation and user experience.</p>
      `,
      requirements: [
        "Use Next.js for the full-stack implementation",
        "Implement user authentication",
        "Create API routes for task management",
        "Design a responsive UI that works on mobile and desktop",
        "Implement proper error handling and loading states",
        "Use a CSS framework or styled-components for styling",
        "Include form validation",
      ],
      evaluationCriteria: [
        "Full-stack implementation quality",
        "User experience and interface design",
        "Authentication implementation",
        "API design and integration",
        "Code organization and structure",
        "Performance and optimization",
        "Error handling and edge cases",
      ],
    },
  ]
  