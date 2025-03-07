import api from './axios';
import { HostsResponse, HostResponse } from '../../types/host';

export const getAllHosts = async (): Promise<HostsResponse> => {
  try {
    const response = await api.get('/host');
    console.log('Hosts API Response:', response);
    
    return response.data || { ok: true, data: response };
  } catch (error) {
    console.error('Error fetching hosts:', error);
    return { ok: false, message: 'Failed to fetch hosts' };
  }
};

export const getHostById = async (id: number): Promise<HostResponse> => {
  try {
    const response = await api.get(`/host/${id}`);
    return response.data || { ok: true, data: response };
  } catch (error) {
    console.error(`Error fetching host with id ${id}:`, error);
    return { ok: false, message: 'Failed to fetch host details' };
  }
};