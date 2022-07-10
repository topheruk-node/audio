import { customElement, property, queryAssignedElements, state } from "lit/decorators.js";
import { LitElement, html } from "lit";
import { when } from "lit/directives/when.js";
import { ref, Ref, createRef } from "lit/directives/ref.js";
import { AudioTrackElement } from "./audio-track";
import { EffectInsertElement } from "./effect-insert";
import { drumSamplerStyles } from "./templates-and-styles";
import { createEffectNode, start, createBufferSource } from "../../web";

declare global {
    interface HTMLElementTagNameMap {
        "drum-sampler": DrumSamplerElement;
    }
}

/**
 * Removed caching from Drum Sampler, TODO: cache
 */
@customElement("drum-sampler")
export class DrumSamplerElement extends LitElement {
    @property({ attribute: "cache-name" }) cacheName = "default";

    @property({ type: Boolean, attribute: "no-cache" }) noCache = false;

    @queryAssignedElements({ slot: "insert" }) listOfInserts!: EffectInsertElement[];

    @queryAssignedElements({ slot: "track" }) listOfTracks!: AudioTrackElement[];

    @property({ type: Boolean }) bus = false;

    private currentTrack!: AudioTrackElement;

    busTrackRef: Ref<AudioTrackElement> = createRef();

    /** @debug debug purposes */
    @state() dbgAudioNodePath = "desination";

    /** @debug debug purposes */
    @state() dbgCurrentTrackName = "";


    firstUpdated() {
        const bus = this.busTrackRef.value;
        if (!bus) return;

        for (const insert of this.listOfInserts) {
            insert.for = bus.name;
            bus.fxs.set(insert.type, insert.value);
        }//O(n)

        this.dbgCurrentTrackName = bus.name;
    }

    #onTrackSlotChange() {
        for (const track of this.listOfTracks) {
            this.currentTrack = track;

            for (const insert of this.listOfInserts) {
                insert.for = track.name;
                track.fxs.set(insert.type, insert.value);
            };

            this.dbgCurrentTrackName = track.name;
        }//O(n^m) this could be concurrent
    }

    #onCacheValue(e: Event) {
        let target = e.target as EffectInsertElement;
        this.currentTrack.fxs.set(target.type, target.value);
    }

    normValue(min: number, max: number, value: number): number {
        return (value - min) / (max - value);
    }

    async #onPlayback(e: Event) {
        let target = e.target as AudioTrackElement;

        this.dbgCurrentTrackName = target.name;//TODO: render an icon maybe?

        let audioNodes = this.listOfInserts.flatMap(insert => {
            if (insert.for !== target.name) {
                insert.for = target.name;
                this.currentTrack = target;
            }

            insert.value = target.fxs.get(insert.type) ?? 0;
            console.log("pan", (insert.value - insert.min) / (insert.max - insert.min));
            const fx = createEffectNode({ type: insert.type, value: (insert.value - insert.min) / (insert.max - insert.min) });
            if (!this.bus || (target.name === "bus")) return fx;

            const value = this.busTrackRef.value!.fxs.get(insert.type) ?? 0;
            const busFx = createEffectNode({ type: insert.type, value: (value - insert.min) / (insert.max - insert.min) });
            return [fx, busFx];
        });

        if (target.src) {
            const data = await fetch(target.src);
            const audio = await createBufferSource(await data.arrayBuffer());
            start(audio, ...audioNodes);
        }
    }

    render() {
        let bus = html`<audio-track id="bus" ${ref(this.busTrackRef)} @play-back=${this.#onPlayback} name="bus" />`;

        return html`
        ${when(this.bus, () => bus)}
        
        <slot @cache-value=${this.#onCacheValue} name="insert"></slot>
        
        <slot @play-back=${this.#onPlayback} @slotchange=${this.#onTrackSlotChange} name="track"></slot>
        
        <br>
        [current selected track] ${this.dbgCurrentTrackName}
        `;
    }

    static styles = drumSamplerStyles;
}