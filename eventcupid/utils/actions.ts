import { auth, currentUser } from '@clerk/nextjs/server';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  return user;
};
const passUser = async () => {
    const user = await getAuthUser();
    return user.id;
}


