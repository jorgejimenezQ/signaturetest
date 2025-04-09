// src/services/InMemorySignatureService.js
import { BaseSignatureService } from './BaseSignatureService.js';

export class InMemorySignatureService extends BaseSignatureService {
    constructor() {
        super();
        this.cards = [];
    }

    /**
     * Save a card for a given cell.
     * @param {string} cellId - The identifier for the grid cell.
     * @param {Object} cardData - Composite data with property: composite.
     * @returns {Object} The created card.
     */
    addCard(cellId, cardData) {
        const card = {
            id: Date.now(),
            cell: cellId,
            composite: cardData.composite,
            createdAt: new Date(),
        };
        const existingIndex = this.cards.findIndex((c) => c.cell === cellId);
        if (existingIndex !== -1) {
            this.cards[existingIndex] = card;
        } else {
            this.cards.push(card);
        }
        return card;
    }

    getCards() {
        return this.cards;
    }

    getCardByCell(cellId) {
        return this.cards.find((card) => card.cell === cellId);
    }
}
