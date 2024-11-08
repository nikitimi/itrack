'use client';

import { useAuth, useClerk, useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const AuthenticationHelper = () => {
  const { signOut } = useClerk();
  const { userId } = useAuth();
  const { isLoaded, signIn } = useSignIn();

  if (isLoaded) {
    console.log(signIn);
  }

  return (
    <>
      <section className="flex gap-2">
        <label htmlFor="userId">current user</label>
        <h2 id="userId">{userId?.toString()}</h2>
      </section>
      <Button onClick={() => void signOut()}>Signout</Button>
    </>
  );
};

export default AuthenticationHelper;
