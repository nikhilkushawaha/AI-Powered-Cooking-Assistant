import { GroceryListResponse, GroceryRequest } from '../types';
import axiosInstance from './axios';

export const groceryApi = {
  generateGroceryList: async (data: GroceryRequest): Promise<GroceryListResponse> => {
    const response = await axiosInstance.post('/api/grocery/generate', data);
    return response.data;
  }
};
