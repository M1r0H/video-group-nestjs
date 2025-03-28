export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  type: string;
  sub: string;
}