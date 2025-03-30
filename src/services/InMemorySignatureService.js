// src/services/InMemorySignatureService.js
import { BaseSignatureService } from './BaseSignatureService.js';

export class InMemorySignatureService extends BaseSignatureService {
    /**
     * Initialize the in-memory signature service.
     *
     * This service uses a simple in-memory array to store signatures.
     * It is not suitable for production use, but is useful for development
     * and testing when a database is not available.
     */
    constructor() {
        super();
        this.signatures = [];
    }

    /**
     * Adds a new signature to the in-memory store.
     *
     * Returns the stored signature with an auto-generated ID.
     * @param {string} signatureData - The signature data to store.
     * @returns {object} The stored signature
     */
    addSignature(signatureData) {
        const signature = {
            id: Date.now(), // simple unique ID based on timestamp
            data: signatureData,
            createdAt: new Date(),
        };
        this.signatures.push(signature);
        return signature;
    }

    /**
     * Retrieves all stored signatures.
     *
     * @returns {array} The signatures, as an array of objects with `id`, `data`, and `createdAt` properties.
     */
    getSignatures() {
        return this.signatures;
    }

    /**
     * Retrieves a single signature by its ID.
     *
     * @param {number} id - The ID of the signature to retrieve.
     * @returns {object} The signature, as an object with `id`, `data`, and `createdAt` properties, or null if no matching signature is found.
     */
    getSignatureById(id) {
        return this.signatures.find((sig) => sig.id === id);
    }

    /**
     * Updates a stored signature with new data.
     *
     * @param {number} id - The ID of the signature to update.
     * @param {string} newData - The new signature data to store.
     * @returns {object} The updated signature, with `id`, `data`, and `updatedAt` properties, or null if the signature was not found.
     */
    updateSignature(id, newData) {
        const signature = this.getSignatureById(id);
        if (signature) {
            signature.data = newData;
            signature.updatedAt = new Date();
            return signature;
        }
        return null;
    }

    /**
     * Deletes a stored signature by its ID.
     *
     * @param {number} id - The ID of the signature to delete.
     * @returns {object} The deleted signature, with `id`, `data`, and `createdAt` properties, or null if the signature was not found.
     */
    deleteSignature(id) {
        const index = this.signatures.findIndex((sig) => sig.id === id);
        if (index !== -1) {
            return this.signatures.splice(index, 1)[0];
        }
        return null;
    }
}
