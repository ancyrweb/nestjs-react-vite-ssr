import { h } from 'preact';
import { useState } from 'preact/hooks';

export const metadata = () => ({
  title: 'About',
});

export default function Page() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
