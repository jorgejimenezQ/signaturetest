// src/modules/signatureModule.js
import SignaturePad from 'signature_pad';

export class SignatureModule {
    /**
     * @param {HTMLCanvasElement} canvasElement - The canvas to attach the signature pad.
     */
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.signaturePad = new SignaturePad(canvasElement);
        this._resizeCanvas();
        window.addEventListener('resize', () => this._resizeCanvas());
    }

    // Private: Handle high DPI resizing.
    _resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.canvas.getContext('2d').scale(ratio, ratio);
    }

    /** Check if the pad is empty */
    isEmpty() {
        return this.signaturePad.isEmpty();
    }

    /**
     * Returns the current signature as a Data URI.
     * @returns {string|null}
     */
    saveSignature() {
        if (this.signaturePad.isEmpty()) {
            return null;
        }
        return this.signaturePad.toDataURL();
    }

    /** Clear the pad */
    clear() {
        this.signaturePad.clear();
    }
}
