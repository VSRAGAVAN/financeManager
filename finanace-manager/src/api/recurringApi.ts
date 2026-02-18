import apiClient from './apiClient';

export const getRecurringTransactions = async () => {
    const response = await apiClient.get('/recurring');
    return response.data.data;
};

export const createRecurringTransaction = async (data: any) => {
    const response = await apiClient.post('/recurring', data);
    return response.data.data;
};

export const updateRecurringTransaction = async (id: number, data: any) => {
    const response = await apiClient.put(`/recurring/${id}`, data);
    return response.data.data;
};

export const deleteRecurringTransaction = async (id: number) => {
    const response = await apiClient.delete(`/recurring/${id}`);
    return response.data.data;
};

export const getSubscriptionSuggestions = async () => {
    const response = await apiClient.get('/recurring/suggestions');
    return response.data.data;
};

export const getBills = async () => {
    const response = await apiClient.get('/bills');
    return response.data.data;
};

export const createBill = async (data: any) => {
    const response = await apiClient.post('/bills', data);
    return response.data.data;
};

export const updateBill = async (id: number, data: any) => {
    const response = await apiClient.put(`/bills/${id}`, data);
    return response.data.data;
};

export const deleteBill = async (id: number) => {
    const response = await apiClient.delete(`/bills/${id}`);
    return response.data.data;
};

export const getUpcomingBills = async () => {
    const response = await apiClient.get('/bills/upcoming');
    return response.data.data;
};
