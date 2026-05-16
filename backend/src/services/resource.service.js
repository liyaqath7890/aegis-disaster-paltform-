import { Resource } from '../models/index.js';

export function listResources() {
  return Resource.findAll({ order: [['createdAt', 'DESC']] });
}

export function createResource(userId, payload) {
  return Resource.create({ ...payload, ownerId: userId });
}

export async function updateResource(id, payload) {
  const resource = await Resource.findByPk(id);
  if (!resource) {
    const error = new Error('Resource not found');
    error.statusCode = 404;
    throw error;
  }
  return resource.update(payload);
}
