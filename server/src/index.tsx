import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Components
import ResponsiveDetecter from '../../src';

const App = () => {
  return (
    <StrictMode>
      <ResponsiveDetecter />
    </StrictMode>
  );
};

const domContainer = document.querySelector('#root');
const root = createRoot(domContainer);
root.render(<App />);
