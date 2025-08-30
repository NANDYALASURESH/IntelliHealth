const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const { logger } = require('../utils/logger');

class DatabaseMigrator {
  constructor() {
    this.migrations = [];
  }

  // Add migration
  addMigration(version, description, up, down) {
    this.migrations.push({
      version,
      description,
      up,
      down,
      executed: false
    });
  }

  // Execute migrations
  async migrate() {
    try {
      await connectDB();
      logger.info('Starting database migrations...');

      // Create migrations collection if it doesn't exist
      const db = mongoose.connection.db;
      const migrationsCollection = db.collection('migrations');

      // Get executed migrations
      const executedMigrations = await migrationsCollection.find({}).toArray();
      const executedVersions = new Set(executedMigrations.map(m => m.version));

      // Execute pending migrations
      for (const migration of this.migrations) {
        if (!executedVersions.has(migration.version)) {
          logger.info(`Executing migration ${migration.version}: ${migration.description}`);
          
          try {
            await migration.up();
            
            // Record successful migration
            await migrationsCollection.insertOne({
              version: migration.version,
              description: migration.description,
              executedAt: new Date()
            });
            
            logger.info(`Migration ${migration.version} completed successfully`);
          } catch (error) {
            logger.error(`Migration ${migration.version} failed:`, error);
            throw error;
          }
        } else {
          logger.info(`Migration ${migration.version} already executed`);
        }
      }

      logger.info('All migrations completed successfully');
      process.exit(0);

    } catch (error) {
      logger.error('Migration failed:', error);
      process.exit(1);
    }
  }

  // Rollback migration
  async rollback(version) {
    try {
      await connectDB();
      logger.info(`Rolling back migration ${version}...`);

      const migration = this.migrations.find(m => m.version === version);
      if (!migration) {
        throw new Error(`Migration ${version} not found`);
      }

      // Execute rollback
      await migration.down();

      // Remove from migrations collection
      const db = mongoose.connection.db;
      const migrationsCollection = db.collection('migrations');
      await migrationsCollection.deleteOne({ version });

      logger.info(`Migration ${version} rolled back successfully`);
      process.exit(0);

    } catch (error) {
      logger.error('Rollback failed:', error);
      process.exit(1);
    }
  }
}

// Initialize migrator
const migrator = new DatabaseMigrator();

// Add your migrations here
migrator.addMigration(
  '001',
  'Add health score field to patients',
  async () => {
    const Patient = require('../models/Patient');
    await Patient.updateMany(
      { healthScore: { $exists: false } },
      { $set: { healthScore: 85 } }
    );
  },
  async () => {
    const Patient = require('../models/Patient');
    await Patient.updateMany(
      {},
      { $unset: { healthScore: 1 } }
    );
  }
);

migrator.addMigration(
  '002',
  'Add notification preferences to users',
  async () => {
    const User = require('../models/User');
    await User.updateMany(
      { notificationPreferences: { $exists: false } },
      {
        $set: {
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
            appointments: true,
            labResults: true,
            prescriptions: true
          }
        }
      }
    );
  },
  async () => {
    const User = require('../models/User');
    await User.updateMany(
      {},
      { $unset: { notificationPreferences: 1 } }
    );
  }
);

// Run migration if called directly
if (require.main === module) {
  const command = process.argv[2];
  const version = process.argv[3];

  if (command === 'rollback' && version) {
    migrator.rollback(version);
  } else {
    migrator.migrate();
  }
}

module.exports = migrator;