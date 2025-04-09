export function mergeMemeAndSignature(memeUrl, canvasEl) {
    return new Promise((resolve, reject) => {
        const offscreen = document.createElement('canvas');
        offscreen.width = canvasEl.width;
        offscreen.height = canvasEl.height;
        const ctx = offscreen.getContext('2d');

        const memeImg = new Image();
        memeImg.crossOrigin = 'anonymous';
        memeImg.src = memeUrl;
        memeImg.onload = () => {
            ctx.drawImage(memeImg, 0, 0, offscreen.width, offscreen.height);
            ctx.drawImage(canvasEl, 0, 0);
            resolve(offscreen.toDataURL());
        };
        memeImg.onerror = (err) => reject(err);
    });
}
