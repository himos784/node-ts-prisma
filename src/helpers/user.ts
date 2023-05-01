import prisma from "../configs/database";
import { UserWithPassword, User } from "../types/user";

// Exclude keys from user
const exclude = <User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> => {
  for (let key of keys) {
    delete user[key];
  }

  return user;
};

const createUser = async (data: UserWithPassword) => {
  const user = await prisma.user.create({
    data,
  });
  const userWithoutPassword: User = exclude(user, ["password"]);

  return userWithoutPassword;
};

const updateUser = async (id: number, data: User): Promise<User> => {
  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data,
  });

  let userWithoutPassword: User = user;
  if (user) {
    userWithoutPassword = exclude(user, ["password"]);
  }

  return userWithoutPassword;
};

const deleteUser = async (id: number): Promise<User> => {
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  let userWithoutPassword: User = user;
  if (user) {
    userWithoutPassword = exclude(user, ["password"]);
  }

  return userWithoutPassword;
};

const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();

  let usersExcludedPassword: User[] = [];
  if (users) {
    usersExcludedPassword = users.map((data) => {
      return exclude(data, ["password"]);
    });
  }

  return usersExcludedPassword;
};

const getUser = async (id: number): Promise<User> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: Number(id),
    },
  });

  let userWithoutPassword: User = user;
  if (user) {
    userWithoutPassword = exclude(user, ["password"]);
  }

  return userWithoutPassword;
};

export { exclude, createUser, updateUser, deleteUser, getUsers, getUser };
