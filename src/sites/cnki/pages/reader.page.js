import { createLibraryReaderRegistration } from '../../../composables/library-reader.js';
import { installCnkiSlider } from '../reader/slide-verification.js';

export const register = createLibraryReaderRegistration('cnki', installCnkiSlider);
