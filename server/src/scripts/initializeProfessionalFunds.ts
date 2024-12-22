import mongoose from 'mongoose';
import { ProfessionalFund } from '../models/ProfessionalFund';

const initializeProfessionalFunds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/windsurf');

    // Initialize Cassa Forense
    const cassaForense = {
      name: 'Cassa Forense',
      code: 'FORENSE',
      description: 'Cassa Nazionale di Previdenza e Assistenza Forense',
      parameters: [{
        contributionRate: 16, // 16%
        minimumContribution: 2750, // €2,750
        year: new Date().getFullYear()
      }]
    };

    // Create or update Cassa Forense
    await ProfessionalFund.findOneAndUpdate(
      { code: cassaForense.code },
      cassaForense,
      { upsert: true, new: true }
    );

    console.log('Professional funds initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing professional funds:', error);
    process.exit(1);
  }
};

initializeProfessionalFunds();
