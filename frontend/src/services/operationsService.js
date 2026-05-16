import { httpClient } from '../api/httpClient';

export const operationsService = {
  listShelters: () => httpClient.get('/shelters'),
  createShelter: (payload) => httpClient.post('/shelters', payload),
  listResources: () => httpClient.get('/resources'),
  createResource: (payload) => httpClient.post('/resources', payload),
  listMissingPersons: () => httpClient.get('/missing-persons'),
  createMissingPerson: (payload) => httpClient.post('/missing-persons', payload),
  listAlerts: () => httpClient.get('/alerts'),
  publishAlert: (payload) => httpClient.post('/alerts', payload),
  getAnalytics: () => httpClient.get('/analytics'),
  getAiPrediction: () => httpClient.get('/ai/predictions'),
  detectPanic: (payload) => httpClient.post('/ai/panic-detection', payload),
  getDroneMission: () => httpClient.get('/drone'),
  uploadFile: (formData) => httpClient.post('/uploads/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};
