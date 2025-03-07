import { Host, HostResponse, HostsResponse, HostFormData } from '../../types/host';
import api from './axios';

export const hostsApi = {
  getHosts: async (): Promise<HostsResponse> => {
    return api.get('/host');
  },
  
  createHost: async (hostData: HostFormData): Promise<HostResponse> => {
    return api.post('/host', hostData);
  },
  
  updateHost: async (id: number, hostData: HostFormData): Promise<HostResponse> => {
    return api.put(`/host/${id}`, hostData);
  },
  
  deleteHost: async (id: number): Promise<HostResponse> => {
    return api.delete(`/host/${id}`);
  },
};