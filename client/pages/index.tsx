import { h } from 'preact';
import { useState } from 'preact/hooks';
import '../css/styles.css';

type Props = {
  name: string;
};

export const metadata = (props: Props) => ({
  title: 'Home for ' + props.name,
});

export default function Home({ name }: Props) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello {name} !</h1>
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
