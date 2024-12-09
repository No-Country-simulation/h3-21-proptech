/*import axios from 'axios';
import { CreditScore } from '../modules/home/types/CreditScore.ts';

const API_URL = 'http://127.0.0.1:8000/api/v1/credit-scores/';

export const creditScoreService = {
  createCreditScore: async (data: Partial<CreditScore>) => {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  calculateCreditScore: async (creditScoreId: number) => {
    const response = await axios.post(`${API_URL}${creditScoreId}/calculate/`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getUserCreditScore: async () => {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Verificar si la respuesta contiene datos y si hay al menos un elemento
    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error('No se encontró un puntaje crediticio para este usuario.');
    }
  }
};*/

/*import axios from 'axios';
import { CreditScore } from '../modules/home/types/CreditScore.ts';

const API_URL = 'http://127.0.0.1:8000/api/v1/credit-scores/';

export const creditScoreService = {
  createCreditScore: async (data: Partial<CreditScore>) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  calculateCreditScore: async (creditScoreId: number) => {
    const response = await axios.post(`${API_URL}${creditScoreId}/calculate/`);
    return response.data;
  },

  getUserCreditScore: async () => {
    const response = await axios.get(`${API_URL}`);
    
    // Verificar si la respuesta contiene datos y si hay al menos un elemento
    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error('No se encontró un puntaje crediticio para este usuario.');
    }
  }
};*/

// src/services/creditScoreService.ts
/*import axios from 'axios';
import { CreditScore } from '../modules/home/types/CreditScore.ts';

const API_URL = 'http://127.0.0.1:8000/api/v1/credit-scores/';

export const creditScoreService = {
  createCreditScore: async (data: Partial<CreditScore>) => {
    // Simulamos la creación del puntaje crediticio
    const mockResponse = {
      id: 1,
      income: data.income,
      credit_history: data.credit_history,
      score: null,
      risk_category: null
    };
    return mockResponse;
  },

  calculateCreditScore: async (creditScoreId: number) => {
    // Simulamos el cálculo del puntaje crediticio
    const mockResponse = {
      id: creditScoreId,
      income: 50000,
      credit_history: true,
      score: 650,
      risk_category: {
        category: 'LOW',
        description: 'Riesgo bajo',
        score: 650
      }
    };
    return mockResponse;
  },

  getUserCreditScore: async () => {
    // Simulamos la obtención del puntaje crediticio
    const mockResponse = {
      id: 1,
      income: 50000,
      credit_history: true,
      score: null,
      risk_category: null
    };
    return mockResponse;
  }
};*/


// src/services/creditScoreService.ts
import axios from 'axios';
import { CreditScore } from '../modules/home/types/CreditScore.ts';

const API_URL = 'http://127.0.0.1:8000/api/v1/credit-scores/';

export const creditScoreService = {
  createCreditScore: async (data: Partial<CreditScore>) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (err) {
      console.error('Error al crear el puntaje crediticio:', err);
      throw err;
    }
  },

  calculateCreditScore: async (creditScoreId: number) => {
    try {
      const response = await axios.post(`${API_URL}${creditScoreId}/calculate/`);
      return response.data;
    } catch (err) {
      console.error('Error al calcular el puntaje crediticio:', err);
      throw err;
    }
  },

  getUserCreditScore: async (userId: number) => {
    try {
      const response = await axios.get(`${API_URL}${userId}/`);
      return response.data;
    } catch (err) {
      console.error('Error al obtener el puntaje crediticio:', err);
      throw err;
    }
  }
};