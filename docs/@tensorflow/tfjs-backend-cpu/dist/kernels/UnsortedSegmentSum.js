/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { UnsortedSegmentSum, util } from '@tensorflow/tfjs-core';
import { assertNotComplex } from '../cpu_util';
import { cast } from './Cast';
import { equal } from './Equal';
import { expandDims } from './ExpandDims';
import { multiply } from './Multiply';
import { pack } from './Pack';
import { sum } from './Sum';
export function unsortedSegmentSum(args) {
    const { inputs, backend, attrs } = args;
    const { x, segmentIds } = inputs;
    const { numSegments } = attrs;
    assertNotComplex(x, 'unsortedSegmentSum');
    const xRank = x.shape.length;
    const segmentIdsRank = segmentIds.shape.length;
    const res = [];
    const intermediates = [];
    // Reshape the segment id's so that they can be broadcast with
    // x. The new shape should be [segmentIds.shape, 1, ..., 1]
    const numIters = xRank - segmentIdsRank;
    let $segmentIds = segmentIds;
    for (let i = 0; i < numIters; ++i) {
        const expanded = expandDims({ inputs: { input: $segmentIds }, backend, attrs: { dim: i + 1 } });
        $segmentIds = expanded;
        intermediates.push(expanded);
    }
    for (let i = 0; i < numSegments; ++i) {
        const scalarValue = util.createScalarValue(i, 'int32');
        const segmentId = backend.makeTensorInfo([], 'int32', scalarValue);
        const mask = equal({ inputs: { a: segmentId, b: $segmentIds }, backend });
        const maskCasted = cast({ inputs: { x: mask }, backend, attrs: { dtype: 'float32' } });
        const mul = multiply({ inputs: { a: maskCasted, b: x }, backend });
        const sumTensorInfo = sum({ inputs: { x: mul }, backend, attrs: { axis: 0, keepDims: false } });
        res.push(sumTensorInfo);
        intermediates.push(segmentId);
        intermediates.push(mask);
        intermediates.push(maskCasted);
        intermediates.push(mul);
        intermediates.push(sumTensorInfo);
    }
    const result = pack({ inputs: res, backend, attrs: { axis: 0 } });
    intermediates.forEach(t => backend.disposeIntermediateTensorInfo(t));
    return result;
}
export const unsortedSegmentSumConfig = {
    kernelName: UnsortedSegmentSum,
    backendName: 'cpu',
    kernelFunc: unsortedSegmentSum
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5zb3J0ZWRTZWdtZW50U3VtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9VbnNvcnRlZFNlZ21lbnRTdW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUF1QyxrQkFBa0IsRUFBcUQsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHeEosT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxJQUlsQztJQUNDLE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztJQUN0QyxNQUFNLEVBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUMvQixNQUFNLEVBQUMsV0FBVyxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRTVCLGdCQUFnQixDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBRTFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzdCLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQy9DLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJ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cHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFRlbnNvckluZm8sIFVuc29ydGVkU2VnbWVudFN1bSwgVW5zb3J0ZWRTZWdtZW50U3VtQXR0cnMsIFVuc29ydGVkU2VnbWVudFN1bUlucHV0cywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZENQVX0gZnJvbSAnLi4vYmFja2VuZF9jcHUnO1xuaW1wb3J0IHthc3NlcnROb3RDb21wbGV4fSBmcm9tICcuLi9jcHVfdXRpbCc7XG5pbXBvcnQge2Nhc3R9IGZyb20gJy4vQ2FzdCc7XG5pbXBvcnQge2VxdWFsfSBmcm9tICcuL0VxdWFsJztcbmltcG9ydCB7ZXhwYW5kRGltc30gZnJvbSAnLi9FeHBhbmREaW1zJztcbmltcG9ydCB7bXVsdGlwbHl9IGZyb20gJy4vTXVsdGlwbHknO1xuaW1wb3J0IHtwYWNrfSBmcm9tICcuL1BhY2snO1xuaW1wb3J0IHtzdW19IGZyb20gJy4vU3VtJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVuc29ydGVkU2VnbWVudFN1bShhcmdzOiB7XG4gIGlucHV0czogVW5zb3J0ZWRTZWdtZW50U3VtSW5wdXRzLFxuICBiYWNrZW5kOiBNYXRoQmFja2VuZENQVSxcbiAgYXR0cnM6IFVuc29ydGVkU2VnbWVudFN1bUF0dHJzXG59KTogVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmQsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHt4LCBzZWdtZW50SWRzfSA9IGlucHV0cztcbiAgY29uc3Qge251bVNlZ21lbnRzfSA9IGF0dHJzO1xuXG4gIGFzc2VydE5vdENvbXBsZXgoeCwgJ3Vuc29ydGVkU2VnbWVudFN1bScpO1xuXG4gIGNvbnN0IHhSYW5rID0geC5zaGFwZS5sZW5ndGg7XG4gIGNvbnN0IHNlZ21lbnRJZHNSYW5rID0gc2VnbWVudElkcy5zaGFwZS5sZW5ndGg7XG4gIGNvbnN0IHJlcyA9IFtdO1xuICBjb25zdCBpbnRlcm1lZGlhdGVzOiBUZW5zb3JJbmZvW10gPSBbXTtcblxuICAvLyBSZXNoYXBlIHRoZSBzZWdtZW50IGlkJ3Mgc28gdGhhdCB0aGV5IGNhbiBiZSBicm9hZGNhc3Qgd2l0aFxuICAvLyB4LiBUaGUgbmV3IHNoYXBlIHNob3VsZCBiZSBbc2VnbWVudElkcy5zaGFwZSwgMSwgLi4uLCAxXVxuICBjb25zdCBudW1JdGVycyA9IHhSYW5rIC0gc2VnbWVudElkc1Jhbms7XG4gIGxldCAkc2VnbWVudElkcyA9IHNlZ21lbnRJZHM7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1JdGVyczsgKytpKSB7XG4gICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmREaW1zKFxuICAgICAgICB7aW5wdXRzOiB7aW5wdXQ6ICRzZWdtZW50SWRzfSwgYmFja2VuZCwgYXR0cnM6IHtkaW06IGkgKyAxfX0pO1xuICAgICRzZWdtZW50SWRzID0gZXhwYW5kZWQ7XG4gICAgaW50ZXJtZWRpYXRlcy5wdXNoKGV4cGFuZGVkKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2VnbWVudHM7ICsraSkge1xuICAgIGNvbnN0IHNjYWxhclZhbHVlID0gdXRpbC5jcmVhdGVTY2FsYXJWYWx1ZShcbiAgICAgIGkgYXMgdW5rbm93biBhcyAnaW50MzInLCAnaW50MzInKTtcbiAgICBjb25zdCBzZWdtZW50SWQgPSBiYWNrZW5kLm1ha2VUZW5zb3JJbmZvKFtdLCAnaW50MzInLCBzY2FsYXJWYWx1ZSk7XG4gICAgY29uc3QgbWFzayA9XG4gICAgICAgIGVxdWFsKHtpbnB1dHM6IHthOiBzZWdtZW50SWQsIGI6ICRzZWdtZW50SWRzfSwgYmFja2VuZH0pIGFzIFRlbnNvckluZm87XG4gICAgY29uc3QgbWFza0Nhc3RlZCA9XG4gICAgICAgIGNhc3Qoe2lucHV0czoge3g6IG1hc2t9LCBiYWNrZW5kLCBhdHRyczoge2R0eXBlOiAnZmxvYXQzMid9fSk7XG4gICAgY29uc3QgbXVsID1cbiAgICAgICAgbXVsdGlwbHkoe2lucHV0czoge2E6IG1hc2tDYXN0ZWQsIGI6IHh9LCBiYWNrZW5kfSkgYXMgVGVuc29ySW5mbztcbiAgICBjb25zdCBzdW1UZW5zb3JJbmZvID1cbiAgICAgICAgc3VtKHtpbnB1dHM6IHt4OiBtdWx9LCBiYWNrZW5kLCBhdHRyczoge2F4aXM6IDAsIGtlZXBEaW1zOiBmYWxzZX19KTtcbiAgICByZXMucHVzaChzdW1UZW5zb3JJbmZvKTtcbiAgICBpbnRlcm1lZGlhdGVzLnB1c2goc2VnbWVudElkKTtcbiAgICBpbnRlcm1lZGlhdGVzLnB1c2gobWFzayk7XG4gICAgaW50ZXJtZWRpYXRlcy5wdXNoKG1hc2tDYXN0ZWQpO1xuICAgIGludGVybWVkaWF0ZXMucHVzaChtdWwpO1xuICAgIGludGVybWVkaWF0ZXMucHVzaChzdW1UZW5zb3JJbmZvKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHBhY2soe2lucHV0czogcmVzLCBiYWNrZW5kLCBhdHRyczoge2F4aXM6IDB9fSk7XG5cbiAgaW50ZXJtZWRpYXRlcy5mb3JFYWNoKHQgPT4gYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyh0KSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGNvbnN0IHVuc29ydGVkU2VnbWVudFN1bUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBVbnNvcnRlZFNlZ21lbnRTdW0sXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogdW5zb3J0ZWRTZWdtZW50U3VtIGFzIHVua25vd24gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==