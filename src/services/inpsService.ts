import api from "@/services/api";

export interface InpsRate {
  type: string;
  description: string;
  rate: number;
}

export interface InpsParameters {
  year: number;
  rates: InpsRate[];
  maxIncome: number;
  minIncome: number;
  minContributions: {
    [key: string]: number;
  };
}

export const DEFAULT_INPS_RATE = {
  type: "PROFESSIONAL",
  description: "Professionisti senza altra copertura",
  rate: 26.07,
};

export const DEFAULT_INPS_PARAMETERS: InpsParameters = {
  year: new Date().getFullYear(),
  rates: [
    {
      type: "PROFESSIONAL",
      description: "Professionisti senza altra copertura",
      rate: 26.07,
    },
    {
      type: "PROFESSIONAL_WITH_OTHER",
      description: "Professionisti con altra copertura",
      rate: 24,
    },
  ],
  maxIncome: 103055,
  minIncome: 16243,
  minContributions: {
    PROFESSIONAL: 4231.41,
    PROFESSIONAL_WITH_OTHER: 3898.32,
  },
};

class InpsService {
  private currentParameters: InpsParameters | null = null;

  async getCurrentParameters(): Promise<InpsParameters> {
    try {
      if (!this.currentParameters) {
        const response = await api.get<InpsParameters>(
          "/inps/parameters/current"
        );
        this.currentParameters = response;
      }
      return this.currentParameters || DEFAULT_INPS_PARAMETERS;
    } catch (error) {
      console.warn("Failed to fetch INPS parameters, using defaults:", error);
      return DEFAULT_INPS_PARAMETERS;
    }
  }

  async getParametersByYear(year: number): Promise<InpsParameters> {
    const response = await api.get<InpsParameters>(
      `/inps/parameters/${year}`
    );
    return response;
  }

  getDefaultRate(): InpsRate {
    return DEFAULT_INPS_RATE;
  }
}

export const inpsService = new InpsService();
