export type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;

  createdAt: string;
  updatedAt: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
