import { async } from '../../store';
import { rebate } from '../';
import {
  REBATE,
  REBATE_CREATE,
  REBATE_DELETE,
  REBATE_UPDATE,
  REBATES
} from './actions';

export default [
  ...async(REBATE, rebate.getRebate),
  ...async(REBATE_CREATE, rebate.postRebate),
  ...async(REBATE_DELETE, rebate.deleteRebate),
  ...async(REBATE_UPDATE, rebate.putRebate),
  ...async(REBATES, rebate.getRebates)
];
