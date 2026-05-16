import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const MissingPerson = sequelize.define(
  'MissingPerson',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING(40),
    lastSeenLocation: DataTypes.JSONB,
    description: DataTypes.TEXT,
    photoUrl: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('missing', 'sighted', 'found'),
      defaultValue: 'missing'
    }
  },
  {
    tableName: 'missing_persons',
    underscored: true
  }
);
