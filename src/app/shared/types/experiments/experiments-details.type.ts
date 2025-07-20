export interface ExperimentDetails {
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    ended_at: string;
    status: string;
    comment: string;
    setup_json: any;
    current_step_no: number
    current_step_name: string;
    warnings: string[];
    errors: string[];
    logs: string[];
  }
  
  