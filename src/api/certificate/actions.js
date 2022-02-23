import { createAction } from 'redux-actions';

export const CERTIFICATE = 'CERTIFICATE';
export const CERTIFICATE_CREATE = 'CERTIFICATE_CREATE';
export const CERTIFICATE_DELETE = 'CERTIFICATE_DELETE';
export const CERTIFICATE_UPDATE = 'CERTIFICATE_UPDATE';
export const CERTIFICATES = 'CERTIFICATES';

export const getCertificate = createAction(CERTIFICATE);
export const createCertificate = createAction(CERTIFICATE_CREATE);
export const deleteCertificate = createAction(CERTIFICATE_DELETE);
export const updateCertificate = createAction(CERTIFICATE_UPDATE);
export const getCertificates = createAction(CERTIFICATES);
