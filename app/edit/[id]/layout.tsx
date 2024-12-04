
import Header from '@/components/header';
import { cn } from '@/lib/utils';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('min-h-dvh flex flex-col')}>
      <Header />
      {children}
    </div>
  );
}
