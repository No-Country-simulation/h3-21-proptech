// src/services/financingService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/financings/';

export const getFinancings = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}?user=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching financings:', error);
    throw error;
  }
};

export const createFinancing = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating financing:', error);
    throw error;
  }
};