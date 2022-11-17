import { type DOMAttributes } from "react";

const FOCUSABLE_ELEMENTS_SELECTOR = `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`;

class FocusTrap extends HTMLElement {
	static get observedAttributes() {
		return ["trapped"];
	}

	private _returnTo: HTMLElement | null = null;

	constructor() {
		super();

		this._getFocusableElements = this._getFocusableElements.bind(this);
		this._onKeyDown = this._onKeyDown.bind(this);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name == "trapped") {
			if (newValue) {
				this._returnTo = document.activeElement as HTMLElement;
				setTimeout(() => {
					this._getFocusableElements().firstFocusableElement.focus();
				}, 1);
			} else if (this._returnTo) {
				setTimeout(() => {
					(this._returnTo as HTMLElement).focus();
				}, 1);
			}
			return;
		}
	}

	connectedCallback() {
		if (!this.isConnected) return;

		this.addEventListener("keydown", this._onKeyDown);
	}

	disconnectedCallback() {
		this.removeEventListener("keydown", this._onKeyDown);
		if (this._returnTo) {
			setTimeout(() => {
				(this._returnTo as HTMLElement).focus();
			}, 1);
		}
	}

	_onKeyDown(event: KeyboardEvent) {
		if (this.getAttribute("trapped") != "true") return;

		const isTabPressed = event.key === "Tab";
		if (!isTabPressed) return;

		const { firstFocusableElement, lastFocusableElement } =
			this._getFocusableElements();

		if (event.shiftKey) {
			if (document.activeElement === firstFocusableElement) {
				lastFocusableElement.focus();
				event.preventDefault();
			}
		} else {
			if (document.activeElement === lastFocusableElement) {
				firstFocusableElement.focus();
				event.preventDefault();
			}
		}
	}

	_getFocusableElements() {
		const focusableElements = this.querySelectorAll(
			FOCUSABLE_ELEMENTS_SELECTOR
		);
		const firstFocusableElement = focusableElements[0] as HTMLElement;
		const lastFocusableElement = focusableElements[
			focusableElements.length - 1
		] as HTMLElement;

		return {
			firstFocusableElement,
			lastFocusableElement,
		};
	}
}

let registered = false;

export function registerFocusTrap() {
	if (!registered) {
		registered = true;
		customElements.define("focus-trap", FocusTrap);
	}
}

type CustomElement<T> = Partial<
	T & DOMAttributes<T> & { children: any; class: string; ref?: any }
>;

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"focus-trap": CustomElement<FocusTrap & { trapped?: "true" }>;
		}
	}
}
