export interface CreateVideoParams {
  title: string;
  url: string;
  description?: string;
  groupId?: string;
}

export interface UpdateVideoParams {
  title?: string;
  url?: string;
  description?: string;
  groupId?: string;
}

export interface VideosListQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: {
    groupId?: string;
    title?: string;
  };
}
