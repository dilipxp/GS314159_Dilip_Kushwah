import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client' 
import './index.css' 
import App from './App.tsx' 

// Creating the root element for rendering the React application
createRoot(document.getElementById('root')!).render(
  <StrictMode> 
    {/* StrictMode helps identify potential problems in the application during development */}
    <App /> {/* Renders the main App component */}
  </StrictMode>, 
)
