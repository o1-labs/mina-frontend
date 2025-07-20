import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ExperimentsState } from './experiments.state';
import {
EXPERIMENTS_INIT,
EXPERIMENTS_GET,
EXPERIMENTS_GET_SUCCESS,
EXPERIMENTS_SORT,
EXPERIMENTS_FILTER,
EXPERIMENTS_CLOSE,
EXPERIMENTS_SELECT_ROW,
EXPERIMENTS_GET_DETAILS_SUCCESS,
ExperimentsActions
} from './experiments.actions';
import { Experiment } from '@app/shared/types/experiments/experiments.type';
import { sort } from '@app/shared/helpers/array.helper';

const initialState: ExperimentsState = {
  data: [],
  sort: {
    sortBy: 'exp',
    sortDirection: SortDirection.ASC,
  },
  isLoading: false,
  activeExperiment: undefined,
  filter: {
    deployment: undefined,
    experiment: undefined,
    round: undefined,
  }
};

export function reducer(state: ExperimentsState = initialState, action: ExperimentsActions): ExperimentsState {
  switch (action.type) {

    case EXPERIMENTS_INIT: {
      return {
        ...state,
        filter: {
          deployment: undefined,
          experiment: undefined,
          round: undefined,
        },
      };
    }

    case EXPERIMENTS_GET_SUCCESS: {
      return {
        ...state,
        data: sortTxs(action.payload, state.sort),
        isLoading: false,
      };
    }

    case EXPERIMENTS_GET: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case EXPERIMENTS_SORT: {
      return {
        ...state,
        sort: action.payload,
        data: sortTxs(state.data, action.payload),
      };
    }

    case EXPERIMENTS_FILTER: {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      }
    }

    case EXPERIMENTS_SELECT_ROW: {
      return {
        ...state,
        activeExperiment: action.payload?.experiment as any, // Convert to ExperimentDetails
      };
    }

    case EXPERIMENTS_GET_DETAILS_SUCCESS: {
      return {
        ...state,
        activeExperiment: action.payload as any,
      };
    }

    case EXPERIMENTS_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortTxs(exps: Experiment[], tableSort: TableSort<Experiment>): Experiment[] {
  return sort<Experiment>(exps, tableSort, ['exp', 'start', 'deployment_id']);
}