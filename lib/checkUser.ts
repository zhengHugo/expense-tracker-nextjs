import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/**
 * Check if current user (get from clerk) is already in our database.
 * If not, create a user record in our database.
 * @return User instance of the currently logged-in user; null if no current user
 */
export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Check if the user is already in the database
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  // If user is in database, return user
  if (loggedInUser) {
    return loggedInUser;
  }

  return db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
};
