export interface GroupEditParams {
  name?: string;
  description?: string;
  parentId?: string;
}

export interface GroupCreateParams {
  name: string;
  description?: string;
  parentId?: string;
}

export interface GetAllParams {
  name?: string;
  parentId?: string;
}
