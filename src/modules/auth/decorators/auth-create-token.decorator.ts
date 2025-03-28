import { SetMetadata } from '@nestjs/common';

export const CREATE_TOKEN_KEY = 'create_token';
export const CreateToken = () => SetMetadata(CREATE_TOKEN_KEY, true);
