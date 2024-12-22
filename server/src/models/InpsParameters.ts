import mongoose from 'mongoose';

export interface InpsRate {
  type: string;
  description: string;
  rate: number;
}

export interface InpsParameters {
  year: number;
  rates: InpsRate[];
  maxIncome: number;  // massimale di reddito
  minIncome: number;  // minimale contributivo
  minContributions: {  // contributi minimi per ogni aliquota
    [key: string]: number;
  };
}

const inpsRateSchema = new mongoose.Schema<InpsRate>({
  type: { type: String, required: true },
  description: { type: String, required: true },
  rate: { type: Number, required: true }
});

const inpsParametersSchema = new mongoose.Schema<InpsParameters>({
  year: { type: Number, required: true, unique: true },
  rates: [inpsRateSchema],
  maxIncome: { type: Number, required: true },
  minIncome: { type: Number, required: true },
  minContributions: { type: Map, of: Number, required: true }
});

export const InpsParameters = mongoose.model<InpsParameters>('InpsParameters', inpsParametersSchema);

// Funzione per inizializzare i parametri 2024
export async function initializeInpsParameters2024() {
  const parameters = {
    year: 2024,
    rates: [
      {
        type: 'COLLABORATOR_WITH_DISCOLL',
        description: 'Collaboratori con DIS-COLL',
        rate: 35.03
      },
      {
        type: 'COLLABORATOR_WITHOUT_DISCOLL',
        description: 'Collaboratori senza DIS-COLL',
        rate: 33.72
      },
      {
        type: 'PROFESSIONAL',
        description: 'Professionisti senza altra copertura',
        rate: 26.07
      },
      {
        type: 'PENSIONER',
        description: 'Pensionati o con altra copertura',
        rate: 24.00
      }
    ],
    maxIncome: 119650.00,
    minIncome: 18415.00,
    minContributions: {
      'PENSIONER': 4419.60,
      'PROFESSIONAL': 4800.79,
      'COLLABORATOR_WITHOUT_DISCOLL': 6209.54,
      'COLLABORATOR_WITH_DISCOLL': 6450.77
    }
  };

  try {
    await InpsParameters.findOneAndUpdate(
      { year: 2024 },
      parameters,
      { upsert: true, new: true }
    );
    console.log('Parametri INPS 2024 inizializzati con successo');
  } catch (error) {
    console.error('Errore nell\'inizializzazione dei parametri INPS:', error);
    throw error;
  }
}
