type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
};

type UserWithPassword = {
  password: string;
} & User;

export { User, UserWithPassword };
