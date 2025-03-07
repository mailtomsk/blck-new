export interface Host {
  id: number;
  name: string;
  bio: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
}

export interface HostResponse {
  ok: boolean;
  data?: Host;
  message?: string;
}

export interface HostsResponse {
  ok: boolean;
  data?: Host[];
  message?: string;
}
