registerProcessor("white-noise", class extends AudioWorkletProcessor implements AudioWorkletProcessorImpl {
    process(_inputs: Float32Array[][], outputs: Float32Array[][], _parameters: Record<string, Float32Array>): boolean {
        for (let i = 0; i < outputs[0][0].length; i++) {
            outputs[0][0][i] = 2 * Math.random() - 1;
        }
        return true;
    }
});
