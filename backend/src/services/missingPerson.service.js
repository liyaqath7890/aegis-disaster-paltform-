import { MissingPerson, User } from '../models/index.js';

export function listMissingPersons() {
  return MissingPerson.findAll({
    include: [{ model: User, as: 'reportedBy', attributes: ['id', 'name', 'role'] }],
    order: [['createdAt', 'DESC']]
  });
}

export function createMissingPerson(userId, payload) {
  return MissingPerson.create({ ...payload, reportedById: userId });
}

export async function updateMissingPersonStatus(id, status) {
  const report = await MissingPerson.findByPk(id);
  if (!report) {
    const error = new Error('Missing person report not found');
    error.statusCode = 404;
    throw error;
  }
  return report.update({ status });
}
