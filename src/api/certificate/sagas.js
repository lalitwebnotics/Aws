import { async } from '../../store';
import { certificate } from '../';
import {
  CERTIFICATE,
  CERTIFICATE_CREATE,
  CERTIFICATE_DELETE,
  CERTIFICATE_UPDATE,
  CERTIFICATES
} from './actions';

export default [
  ...async(CERTIFICATE, certificate.getCertificate),
  ...async(CERTIFICATE_CREATE, certificate.postCertificate),
  ...async(CERTIFICATE_DELETE, certificate.deleteCertificate),
  ...async(CERTIFICATE_UPDATE, certificate.putCertificate),
  ...async(CERTIFICATES, certificate.getCertificates)
];
