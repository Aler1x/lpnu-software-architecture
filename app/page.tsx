"use client"
import { cn } from '@/lib/utils';
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  return (
    <main className={cn('flex items-center justify-center min-h-dvh')}>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </main>
  );
}
