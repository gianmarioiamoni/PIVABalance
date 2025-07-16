export interface PensionFund {
  id: string;
  name: string;
  description: string;
}

export type PensionSystemType = 'INPS' | 'PROFESSIONAL_FUND';

export const PENSION_SYSTEMS = {
  INPS: {
    id: 'INPS',
    name: 'Gestione Separata INPS',
    description: 'Gestione Separata INPS'
  },
  PROFESSIONAL_FUND: {
    id: 'PROFESSIONAL_FUND',
    name: 'Cassa Professionale',
    description: 'Cassa Professionale di categoria'
  }
};

export const PROFESSIONAL_FUNDS: PensionFund[] = [
  {
    id: 'forense',
    name: 'Cassa Forense',
    description: 'Avvocati'
  },
  {
    id: 'cnpdac',
    name: 'CNPDAC',
    description: 'Commercialisti'
  },
  {
    id: 'cassa_ragionieri',
    name: 'Cassa Ragionieri',
    description: 'Ragionieri'
  },
  {
    id: 'cassa_geometri',
    name: 'Cassa Geometri',
    description: 'Geometri'
  },
  {
    id: 'inarcassa',
    name: 'Inarcassa',
    description: 'Architetti e Ingegneri'
  },
  {
    id: 'enpacl',
    name: 'ENPACL',
    description: 'Consulenti del Lavoro'
  },
  {
    id: 'enpam',
    name: 'ENPAM',
    description: 'Medici e Odontoiatri'
  },
  {
    id: 'enpav',
    name: 'ENPAV',
    description: 'Veterinari'
  },
  {
    id: 'inpgi',
    name: 'INPGI',
    description: 'Giornalisti'
  },
  {
    id: 'eppi',
    name: 'EPPI',
    description: 'Periti Industriali'
  },
  {
    id: 'enpap',
    name: 'ENPAP',
    description: 'Psicologi'
  },
  {
    id: 'enpapi',
    name: 'ENPAPI',
    description: 'Infermieri'
  },
  {
    id: 'enpaf',
    name: 'ENPAF',
    description: 'Farmacisti'
  },
  {
    id: 'epap',
    name: 'EPAP',
    description: 'Attuari, Chimici, Agronomi, Forestali, Geologi'
  },
  {
    id: 'enpab',
    name: 'ENPAB',
    description: 'Biologi'
  },
  {
    id: 'enasarco',
    name: 'Enasarco',
    description: 'Agenti e Rappresentanti'
  },
  {
    id: 'enpaia',
    name: 'ENPAIA',
    description: 'Addetti in Agricoltura'
  },
  {
    id: 'notariato',
    name: 'Cassa Nazionale del Notariato',
    description: 'Notai'
  },
  {
    id: 'fasc',
    name: 'Fondazione FASC',
    description: 'Agenti Spedizionieri e Corrieri'
  }
];
