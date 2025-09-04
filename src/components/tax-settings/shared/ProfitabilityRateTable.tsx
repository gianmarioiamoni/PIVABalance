import React from 'react';

export interface ProfitabilityRate {
  sector: string;
  atecoCode: string;
  rate: number;
}

export const profitabilityRates: ProfitabilityRate[] = [
  {
    sector: "Industrie alimentari e delle bevande",
    atecoCode: "(10-11)",
    rate: 40
  },
  {
    sector: "Commercio all'ingrosso e al dettaglio",
    atecoCode: "45- (da 46.2 a 46.9) – (da 47.1 a 47.7) – 47.9",
    rate: 40
  },
  {
    sector: "Commercio ambulante di prodotti alimentari e bevande",
    atecoCode: "47.81",
    rate: 40
  },
  {
    sector: "Attività dei servizi di alloggio e di ristorazione",
    atecoCode: "(55-56)",
    rate: 40
  },
  {
    sector: "Commercio ambulante di altri prodotti",
    atecoCode: "47.82-47.89",
    rate: 54
  },
  {
    sector: "Intermediari del commercio",
    atecoCode: "46.1",
    rate: 62
  },
  {
    sector: "Altre attività economiche",
    atecoCode: "(01-02-03) – (05-06-07-08-09) – (12-13-14-15-16-17-18-19-20-22-22-23-24-25-26-27-28-29-30-31-32-33) – (35) – (36-37-38-39) – (53-58-59-60-61-62-63) – (77-78-79-80-81-82) – (84) – (90-91-92-93) (94-95-96) – (97-98) – (99)",
    rate: 67
  },
  {
    sector: "Attività professionali, scientifiche, tecniche, sanitarie, di istruzione, servizi finanziari ed assicurativi",
    atecoCode: "(64-65-66) – (69-70-71-72-73-74-75) – (85) – (86-87-88)",
    rate: 78
  },
  {
    sector: "Costruzioni e attività immobiliari",
    atecoCode: "(41-42-43) – (68)",
    rate: 86
  }
];

interface ProfitabilityRateTableProps {
  onSelect: (rate: ProfitabilityRate) => void;
  selectedRate?: number;
  onClose: () => void;
}

export default function ProfitabilityRateTable({ onSelect, selectedRate, onClose }: ProfitabilityRateTableProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Seleziona il Coefficiente di Redditività
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Chiudi</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gruppo/Settore
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Codici Attività ATECO 2007
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coefficiente
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Seleziona</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profitabilityRates.map((rate, index) => (
                <tr 
                  key={index}
                  className={`${
                    selectedRate === rate.rate 
                      ? 'bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                    {rate.sector}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                    {rate.atecoCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onSelect(rate)}
                      className={`text-blue-600 hover:text-blue-900 ${
                        selectedRate === rate.rate ? 'font-bold' : ''
                      }`}
                    >
                      {selectedRate === rate.rate ? 'Selezionato' : 'Seleziona'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
