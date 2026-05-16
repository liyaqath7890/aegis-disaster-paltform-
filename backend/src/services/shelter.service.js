import { Shelter } from '../models/index.js';

export function listShelters() {
  return Shelter.findAll({ order: [['createdAt', 'DESC']] });
}

export function createShelter(payload) {
  return Shelter.create(payload);
}

export async function updateShelter(id, payload) {
  const shelter = await Shelter.findByPk(id);
  if (!shelter) {
    const error = new Error('Shelter not found');
    error.statusCode = 404;
    throw error;
  }
  return shelter.update(payload);
}
