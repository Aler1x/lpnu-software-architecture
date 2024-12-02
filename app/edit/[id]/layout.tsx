
import Header from '@/components/header';
import DiagramPage from './page';
import { cn } from '@/lib/utils';

export default async function RootLayout({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  return (
    <div className={cn('min-h-dvh flex flex-col')}>
      <Header />
      <DiagramPage id={id} />
    </div>
  );
}
