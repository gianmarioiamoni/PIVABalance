import { ProfessionalFund } from '../models/ProfessionalFund';

export const initializationService = {
  async initializeProfessionalFunds() {
    const professionalFunds = [
      {
        name: 'Cassa Forense (avvocati)',
        code: 'CF',
        description: 'Cassa Nazionale di Previdenza e Assistenza Forense',
        parameters: [{
          contributionRate: 16,
          minimumContribution: 1677.50,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'CNPDAC (commercialisti)',
        code: 'CNPADC',
        description: 'Cassa Nazionale di Previdenza e Assistenza Dottori Commercialisti',
        parameters: [{
          contributionRate: 12,
          minimumContribution: 3075,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'Cassa Ragionieri (ragionieri)',
        code: 'CNPR',
        description: 'Cassa Nazionale di Previdenza ed Assistenza a favore dei Ragionieri e Periti Commerciali',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'Cassa Geometri (geometri)',
        code: 'CIPAG',
        description: 'Cassa Italiana di Previdenza ed Assistenza dei Geometri Liberi Professionisti',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'INARCASSA (architetti e ingegneri)',
        code: 'INARCASSA',
        description: 'Cassa Nazionale di Previdenza ed Assistenza per gli Ingegneri ed Architetti',
        parameters: [{
          contributionRate: 14.5,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPACL (consulenti del lavoro)',
        code: 'ENPACL',
        description: 'Ente Nazionale di Previdenza e Assistenza per i Consulenti del Lavoro',
        parameters: [{
          contributionRate: 12,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAM (medici e odontoiatri)',
        code: 'ENPAM',
        description: 'Ente Nazionale di Previdenza ed Assistenza Medici e Odontoiatri',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAV (veterinari)',
        code: 'ENPAV',
        description: 'Ente Nazionale di Previdenza e Assistenza dei Veterinari',
        parameters: [{
          contributionRate: 15,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'INPGI (giornalisti)',
        code: 'INPGI',
        description: 'Istituto Nazionale di Previdenza dei Giornalisti Italiani',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'EPPI (periti industriali)',
        code: 'EPPI',
        description: 'Ente di Previdenza dei Periti Industriali',
        parameters: [{
          contributionRate: 15,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAP (psicologi)',
        code: 'ENPAP',
        description: 'Ente Nazionale di Previdenza ed Assistenza Psicologi',
        parameters: [{
          contributionRate: 10,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAPI (infermieri)',
        code: 'ENPAPI',
        description: 'Ente Nazionale di Previdenza e Assistenza della Professione Infermieristica',
        parameters: [{
          contributionRate: 15,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAF (farmacisti)',
        code: 'ENPAF',
        description: 'Ente Nazionale di Previdenza e Assistenza Farmacisti',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'EPAP (attuari, chimici, agronomi, forestali, geologi)',
        code: 'EPAP',
        description: 'Ente di Previdenza e Assistenza Pluricategoriale',
        parameters: [{
          contributionRate: 15,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAB (biologi)',
        code: 'ENPAB',
        description: 'Ente Nazionale di Previdenza e Assistenza a favore dei Biologi',
        parameters: [{
          contributionRate: 15,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENASARCO (agenti e rappresentanti)',
        code: 'ENASARCO',
        description: 'Ente Nazionale Assistenza Agenti e Rappresentanti di Commercio',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'ENPAIA (addetti in agricoltura)',
        code: 'ENPAIA',
        description: 'Ente Nazionale di Previdenza per gli Addetti e per gli Impiegati in Agricoltura',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'Cassa Nazionale del Notariato (notai)',
        code: 'CNN',
        description: 'Cassa Nazionale del Notariato',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      },
      {
        name: 'FASC (agenti spedizionieri e corrieri)',
        code: 'FASC',
        description: 'Fondazione FASC - Fondo Nazionale di Previdenza per gli Agenti Spedizionieri e Corrieri',
        parameters: [{
          contributionRate: 0,
          minimumContribution: 0,
          fixedAnnualContributions: 0,
          year: 2024
        }],
        allowManualEdit: true
      }
    ];

    try {
      // Controlla se esistono già dei fondi nel database
      const existingFunds = await ProfessionalFund.find();
      
      if (existingFunds.length === 0) {
        // Se non ci sono fondi, inserisci quelli di default
        await ProfessionalFund.insertMany(professionalFunds);
        console.log('Professional funds initialized successfully');
      } else {
        // Se ci sono già dei fondi, aggiorna solo i parametri per l'anno corrente
        for (const fund of professionalFunds) {
          await ProfessionalFund.findOneAndUpdate(
            { code: fund.code },
            {
              $set: {
                name: fund.name,
                description: fund.description,
                allowManualEdit: fund.allowManualEdit
              },
              $push: {
                parameters: {
                  $each: fund.parameters,
                  $sort: { year: -1 }
                }
              }
            },
            { upsert: true, new: true }
          );
        }
        console.log('Professional funds parameters updated successfully');
      }
    } catch (error) {
      console.error('Error initializing professional funds:', error);
      throw error;
    }
  }
};
