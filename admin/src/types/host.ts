export interface Host {
    id: number;
    name: string;
    bio?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface HostFormData {
    name: string;
    bio: string;
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