import { css } from "lit";

export const EFFECT_TYPES = ["gain", "pan", "highpass", "lowpass"] as const;
export type Effect = typeof EFFECT_TYPES[number];

export const MODE_TYPES = ["solo", "group"] as const;
export type Mode = typeof MODE_TYPES[number];

export const drumSamplerStyles = css`
:host {
    width: calc(4*50px);
    height: calc(6*50px);
    display: grid;
}
    
#bus {
    display: flex;
}

slot[name=track]{
    display: grid;
    grid-template-columns: repeat(4, 50px);
    grid-template-rows: repeat(2,1fr);
    gap: 1fr;
}

slot[name=insert]{
    display: flex;
    flex-direction: column;
    width: 75px;
}
`;

export const audioTrackStyles = css`
:host {
  --size: 48px
}
button {
  width: var(--size);
  height: var(--size);
  background-color: none;
}
`;

export const effectInsertStyles = css`
:host {
    display: grid;
    grid-template-areas: "a b" "c c"
}
`;