import { Alert } from '../models/Alert.js';

export async function createAlert(userId, payload) {
  return Alert.create({ ...payload, createdById: userId });
}

export async function listAlerts() {
  return Alert.findAll({ order: [['createdAt', 'DESC']] });
}
