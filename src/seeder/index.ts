import * as dotenv from 'dotenv'
import { ConfigAppDataSource } from '../data-source';
import { populateDB } from './seeder';

async function SeedDatabase() {
    dotenv.config();
  
    await ConfigAppDataSource();
    await populateDB();
  }

SeedDatabase()