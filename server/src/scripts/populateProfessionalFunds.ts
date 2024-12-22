import mongoose from 'mongoose';
import { ProfessionalFund } from '../models/ProfessionalFund';
import dotenv from 'dotenv';

dotenv.config();

const professionalFunds = [
  {
    name: 'Cassa Forense',
    code: 'CF',
    description: 'Cassa Nazionale di Previdenza e Assistenza Forense',
    parameters: [{
      contributionRate: 14.5,
      minimumContribution: 2875,
      year: 2024
    }],
    allowManualEdit: true
  },
  {
    name: 'ENPAM',
    code: 'ENPAM',
    description: 'Ente Nazionale di Previdenza ed Assistenza Medici',
    parameters: [{
      contributionRate: 19.5,
      minimumContribution: 0, // ENPAM non ha un contributo minimo fisso
      year: 2024
    }],
    allowManualEdit: false
  },
  {
    name: 'INARCASSA',
    code: 'INARCASSA',
    description: 'Cassa Nazionale di Previdenza ed Assistenza per gli Ingegneri ed Architetti',
    parameters: [{
      contributionRate: 14.5,
      minimumContribution: 2340,
      year: 2024
    }],
    allowManualEdit: false
  },
  {
    name: 'CNPADC',
    code: 'CNPADC',
    description: 'Cassa Nazionale di Previdenza e Assistenza Dottori Commercialisti',
    parameters: [{
      contributionRate: 12,
      minimumContribution: 2840,
      year: 2024
    }],
    allowManualEdit: false
  },
  {
    name: 'ENPAP',
    code: 'ENPAP',
    description: 'Ente Nazionale di Previdenza ed Assistenza Psicologi',
    parameters: [{
      contributionRate: 10,
      minimumContribution: 780,
      year: 2024
    }],
    allowManualEdit: false
  }
];

async function populateProfessionalFunds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Delete existing funds
    await ProfessionalFund.deleteMany({});
    console.log('Cleared existing professional funds');

    // Insert new funds
    await ProfessionalFund.insertMany(professionalFunds);
    console.log('Successfully populated professional funds');

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error populating professional funds:', error);
    process.exit(1);
  }
}

populateProfessionalFunds();
