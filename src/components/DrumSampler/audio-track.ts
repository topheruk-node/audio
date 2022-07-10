import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioTrackStyles, Effect } from "./templates-and-styles";

declare global {
    interface HTMLElementTagNameMap {
        "audio-track": AudioTrackElement;
    }
}

@customElement("audio-track")
export class AudioTrackElement extends LitElement {
    @property() name = "track";//type string

    @property() src?: string;

    fxs = new Map<Effect, number>();

    #onPointerDown() {
        this.dispatchEvent(new CustomEvent("play-back", { detail: this, bubbles: true, composed: true }));
    }

    render() {
        return html`<button @pointerdown=${this.#onPointerDown}>${this.name}</button>`;
    }

    static styles = audioTrackStyles;
}