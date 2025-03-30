// src/services/index.js
import { InMemorySignatureService } from './InMemorySignatureService.js';

// For now, we use the in-memory implementation.
// Later you can swap this with an API-based service without changing the rest of your code.
const signatureService = new InMemorySignatureService();

export default signatureService;
