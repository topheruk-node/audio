import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, effectInsertStyles } from "./templates-and-styles";

declare global {
    interface HTMLElementTagNameMap {
        "effect-insert": EffectInsertElement;
    }
}

@customElement("effect-insert")
export class EffectInsertElement extends LitElement {
    @property() type: Effect = "gain";

    @property({ type: Number, reflect: true }) value = 0;

    @property({ type: Number, reflect: true, attribute: true }) min = 0;

    @property({ type: Number, reflect: true, attribute: true }) max = 1;

    @property({ type: Number, reflect: true, attribute: true }) step = 0.01;

    @property() for = "track";//type string

    #onPointerUp() {
        this.dispatchEvent(new CustomEvent("cache-value", { detail: this, bubbles: true, composed: true }));
    };

    #onInput(e: Event) {
        this.value = (e.target as HTMLInputElement).valueAsNumber;
    }

    render() {
        return html`
            <label style="grid-area: a">${this.type}</label>
            <input style="grid-area: c" @input=${this.#onInput} @pointerup=${this.#onPointerUp} .value=${this.value}
                .max=${this.max} .min=${this.min} .step=${this.step} type="range">
            <output style="grid-area: b">${this.value}</output>
        `;
    }

    static styles = effectInsertStyles;
}



