import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello from Vite...</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Counter
      </button>
      <p>{count}</p>
    </div>
  );
}
