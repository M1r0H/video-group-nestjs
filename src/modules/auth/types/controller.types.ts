import { User } from '@modules/users/entities/user.entity';

export interface GenerateTokenParams {
  user: User;
  expiry: string;
}

export interface ResponseInterface {
  user: User | null;
  token?: string;
}
