import { async } from '../../store';
import { media } from '../';
import {
  UPLOAD_MEDIA
} from './actions';

export default [
  ...async(UPLOAD_MEDIA, media.uploadMedia)
];
