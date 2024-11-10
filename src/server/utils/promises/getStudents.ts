'server only';

import { clerkClient, type User } from '@clerk/nextjs/server';

const getStudentsPromise = new Promise((resolve) => {
  clerkClient().then((clerk) => {
    clerk.users.getCount().then(async (userCount) => {
      const usersHolder: User[] = [];
      const defaultClerkLimit = 10;
      let offset = 0;

      async function* getUsers(offset: number = 0) {
        yield await clerk.users.getUserList({ offset });
      }

      while (usersHolder.length < userCount) {
        for await (const generatedUsers of getUsers(offset)) {
          if (generatedUsers !== undefined) {
            generatedUsers.data.forEach((s) => usersHolder.push(s));
          }
        }
        offset += defaultClerkLimit;
      }

      resolve(usersHolder);
    });
  });
}) as Promise<User[]>;

export default getStudentsPromise;
