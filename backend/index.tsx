import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18以降はreact-dom/clientを使用
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
