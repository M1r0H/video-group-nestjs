import { UserRole } from '@modules/users/constans';

export interface UserCreateParams {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}