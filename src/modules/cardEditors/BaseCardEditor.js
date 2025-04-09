/*
This class definition is for an abstract base class `BaseCardEditor`. It cannot be instantiated directly and is intended to be subclassed by other classes that implement the editor functionality.

Here's a brief explanation of each class method:

* `constructor()`: Prevents direct instantiation of the class and throws an error if attempted.
* `init(containerElement)`: Initializes the editor UI inside a given container element. **Must be implemented by subclasses.**
* `isValid()`: Checks if the editor's input is valid (e.g., meme selected, signature provided). **Must be implemented by subclasses.**
* `getComposite()`: Returns a Promise that resolves to the composite output (e.g., a merged image data URL). **Must be implemented by subclasses.**
* `clear()`: Resets the editor's internal state. **Must be implemented by subclasses.**

*/

export class BaseCardEditor {
    constructor() {
        if (new.target === BaseCardEditor) {
            throw new TypeError('Cannot instantiate BaseCardEditor directly');
        }
    }

    /**
     * Initialize the editor UI inside the given container element.
     * @param {HTMLElement} containerElement
     */
    init(containerElement) {
        throw new Error('init() must be implemented by subclasses');
    }

    /**
     * Returns true if the editor’s input is valid (e.g. meme selected, signature provided).
     * @returns {boolean}
     */
    isValid() {
        throw new Error('isValid() must be implemented by subclasses');
    }

    /**
     * Returns a Promise that resolves to the composite output (e.g. a merged image data URL).
     * @returns {Promise<string>}
     */
    getComposite() {
        throw new Error('getComposite() must be implemented by subclasses');
    }

    /**
     * Resets the editor's internal state.
     */
    clear() {
        throw new Error('clear() must be implemented by subclasses');
    }
}
