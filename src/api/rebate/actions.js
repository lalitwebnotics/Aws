import { createAction } from 'redux-actions';

export const REBATE = 'REBATE';
export const REBATE_CREATE = 'REBATE_CREATE';
export const REBATE_DELETE = 'REBATE_DELETE';
export const REBATE_UPDATE = 'REBATE_UPDATE';
export const REBATES = 'REBATES';

export const getRebate = createAction(REBATE);
export const createRebate = createAction(REBATE_CREATE);
export const deleteRebate = createAction(REBATE_DELETE);
export const updateRebate = createAction(REBATE_UPDATE);
export const getRebates = createAction(REBATES);
