/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/// <amd-module name="@tensorflow/tfjs-layers/dist/engine/input_layer" />
import { DataType, serialization, Tensor } from '@tensorflow/tfjs-core';
import { Shape } from '../keras_format/common';
import { Kwargs } from '../types';
import { DisposeResult, Layer, SymbolicTensor } from './topology';
/**
 * Constructor arguments for InputLayer.
 *
 * Note: You should provide only inputShape or batchInputShape (not both).
 * If only inputShape is provided, then the batchInputShape is determined by
 * the batchSize argument and the inputShape: [batchSize].concat(inputShape).
 */
export declare interface InputLayerArgs {
    /** Input shape, not including the batch axis. */
    inputShape?: Shape;
    /** Optional input batch size (integer or null). */
    batchSize?: number;
    /** Batch input shape, including the batch axis. */
    batchInputShape?: Shape;
    /** Datatype of the input.  */
    dtype?: DataType;
    /**
     * Whether the placeholder created is meant to be sparse.
     */
    sparse?: boolean;
    /** Name of the layer. */
    name?: string;
}
export declare class InputLayer extends Layer {
    /** @nocollapse */
    static readonly className = "InputLayer";
    sparse: boolean;
    constructor(args: InputLayerArgs);
    apply(inputs: Tensor | Tensor[] | SymbolicTensor | SymbolicTensor[], kwargs?: Kwargs): Tensor | Tensor[] | SymbolicTensor;
    dispose(): DisposeResult;
    getConfig(): serialization.ConfigDict;
}
/**
 * Config for the Input function.
 *
 * Note: You should provide only shape or batchShape (not both).
 * If only shape is provided, then the batchShape becomes
 * [null].concat(inputShape).
 */
export interface InputConfig {
    /**
     * A shape, not including the batch size. For instance, `shape=[32]`
     * indicates that the expected input will be batches of 32-dimensional
     * vectors.
     */
    shape?: Shape;
    /**
     * A shape tuple (integer), including the batch size. For instance,
     * `batchShape=[10, 32]` indicates that the expected input will be batches of
     * 10 32-dimensional vectors. `batchShape=[null, 32]` indicates batches of an
     * arbitrary number of 32-dimensional vectors.
     */
    batchShape?: Shape;
    /**
     * An optional name string for the layer. Should be unique in a model (do not
     * reuse the same name twice). It will be autogenerated if it isn't provided.
     */
    name?: string;
    dtype?: DataType;
    /**
     * A boolean specifying whether the placeholder to be created is sparse.
     */
    sparse?: boolean;
}
export declare function Input(config: InputConfig): SymbolicTensor;