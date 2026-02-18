import api from './apiClient';

// Income API
export const getIncomes = async () => {
    const response = await api.get('/income');
    return response.data.data;
};

export const createIncome = async (data: any) => {
    const response = await api.post('/income', data);
    return response.data.data;
};

export const updateIncome = async (id: number, data: any) => {
    const response = await api.put(`/income/${id}`, data);
    return response.data.data;
};

export const deleteIncome = async (id: number) => {
    const response = await api.delete(`/income/${id}`);
    return response.data.data;
};

// Expense API
export const getExpenses = async () => {
    const response = await api.get('/expense');
    return response.data.data;
};

export const createExpense = async (data: any) => {
    const response = await api.post('/expense', data);
    return response.data.data;
};

export const updateExpense = async (id: number, data: any) => {
    const response = await api.put(`/expense/${id}`, data);
    return response.data.data;
};

export const deleteExpense = async (id: number) => {
    const response = await api.delete(`/expense/${id}`);
    return response.data.data;
};
// Analytics API
export const getAnalyticsSummary = async () => {
    const response = await api.get('/analytics/summary');
    return response.data.data;
};

export const getGSTSummary = async () => {
    const response = await api.get('/analytics/gst');
    return response.data.data;
};

export const downloadPDF = async () => {
    const response = await api.get('/analytics/export/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'financial_report.pdf');
    document.body.appendChild(link);
    link.click();
};

export const downloadExcel = async () => {
    const response = await api.get('/analytics/export/excel', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'financial_data.xlsx');
    document.body.appendChild(link);
    link.click();
};
