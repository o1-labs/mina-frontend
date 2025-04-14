export interface Experiment {
  exp: string;
  deployment_id: number;
  round: number;
  rate_min: string;
  zkapp_rate_min: string;
  payment_rate_min: string;
  duration: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  };
  max_latency: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  };
  missed: string;
  failed: string;
  successful: string;
  start: string;
  total: string;
  zkapps: string;
}

