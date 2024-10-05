import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import TimerProvider from '../src/contexts/TimerProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TimerProvider>
      <Component {...pageProps} />
    </TimerProvider>
  );
}
