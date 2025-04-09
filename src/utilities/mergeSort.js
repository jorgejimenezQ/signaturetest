// utilities/mergeSort.js

/**
 * Sorts an array of meme objects (each with a .name property)
 * in lexicographical order using merge sort.
 *
 * @param {Array} a - The array of meme objects.
 */
export function sortMemes(a) {
    const aux = new Array(a.length);
    sort(a, aux, 0, a.length - 1);
}

function sort(a, aux, lo, hi) {
    if (hi <= lo) return;
    const mid = Math.floor(lo + (hi - lo) / 2);
    sort(a, aux, lo, mid);
    sort(a, aux, mid + 1, hi);
    merge(a, aux, lo, mid, hi);
}

function merge(a, aux, lo, mid, hi) {
    // Copy a[lo..hi] to aux[lo..hi].
    for (let k = lo; k <= hi; k++) {
        aux[k] = a[k];
    }

    let i = lo,
        j = mid + 1;
    for (let k = lo; k <= hi; k++) {
        if (i > mid) a[k] = aux[j++];
        else if (j > hi) a[k] = aux[i++];
        // Use localeCompare on meme's name to compare lexically.
        else if (aux[j].name.localeCompare(aux[i].name) < 0) a[k] = aux[j++];
        else a[k] = aux[i++];
    }
}

export default sortMemes;
