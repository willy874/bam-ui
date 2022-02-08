import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BamDialog, openFrame, useDialog } from '../../packages/react';

function DialogView() {
  return (
    <div className="view" style={{ background: '#888' }}>
      <div>
        <div style={{ padding: '4rem' }}>
          <button onClick={() => {}}>關閉</button>
          <div className="py-2"></div>
          <div>拖拉</div>
          <div className="py-2"></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  const onOpenDialog = async () => {
    console.log(useDialog());
    const frame = await openFrame(() => DialogView);
    console.log('frame', frame);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
        <button type="button" onClick={onOpenDialog}>
          打開
        </button>
      </header>
      <BamDialog />
    </div>
  );
}

export default App;
