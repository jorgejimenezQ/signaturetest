import SignaturePad from 'signature_pad';
import signatureService from './services/index.js';

const canvas = document.getElementById('signatureCanvas');

// Resize the canvas for high DPI devices
function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize the signature pad
const signaturePad = new SignaturePad(canvas);

// Save button event: Save the current signature using the service
document.getElementById('saveBtn').addEventListener('click', () => {
    if (signaturePad.isEmpty()) {
        alert('Please provide a signature first.');
    } else {
        const signatureData = signaturePad.toDataURL();
        const savedSignature = signatureService.addSignature(signatureData);
        console.log('Saved signature:', savedSignature);
        alert('Signature saved locally!');
        signaturePad.clear();
    }
});

// Display button event: Retrieve all saved signatures and display them
document.getElementById('displayBtn').addEventListener('click', () => {
    const signatures = signatureService.getSignatures();
    const container = document.getElementById('signatureContainer');
    container.innerHTML = ''; // Clear any previously displayed signatures

    if (signatures.length === 0) {
        container.innerHTML = '<p>No signatures saved.</p>';
    } else {
        signatures.forEach((signature) => {
            const img = document.createElement('img');
            img.src = signature.data;
            img.alt = 'Saved Signature';
            container.appendChild(img);
        });
    }
});
