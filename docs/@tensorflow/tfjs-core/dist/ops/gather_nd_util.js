import { computeStrides, sizeFromShape } from '../util';
/**
 * Validate gather nd inputs.
 *
 * @param tensor The tensor contains the source values.
 * @param indices The tensor contains the indices to slice the source.
 *
 * @returns [resultShape, numUpdates, sliceSize, strides]
 */
export function prepareAndValidate(tensor, indices) {
    const tensorRank = tensor.shape.length;
    const indicesRank = indices.shape.length;
    if (tensorRank < 1) {
        throw new Error('tf.gatherND() expects the input to be rank 1 or higher,' +
            ` but the rank was ${tensorRank}.`);
    }
    if (indicesRank < 1) {
        throw new Error('tf.gatherND() expects the indices to be rank 1 or higher,' +
            ` but the rank was ${indicesRank}.`);
    }
    if (indices.dtype !== 'int32') {
        throw new Error('tf.gatherND() expects the indices to be int32 type,' +
            ` but the dtype was ${indices.dtype}.`);
    }
    if (indices.shape[indicesRank - 1] > tensorRank) {
        throw new Error('index innermost dimension length must be <= tensor rank; saw: ' +
            `${indices.shape[indicesRank - 1]} vs. ${tensorRank}`);
    }
    if (sizeFromShape(tensor.shape) === 0) {
        throw new Error('Requested more than 0 entries, but input is empty.' +
            ` Input shape: ${tensor.shape}.`);
    }
    const indicesShape = indices.shape;
    const sliceRank = indicesShape[indicesShape.length - 1];
    // The result shape is
    //   indices.shape[:-1] + params.shape[indices.shape[-1]:]
    let nResult = 1;
    for (let i = 0; i < indicesShape.length - 1; ++i) {
        nResult *= indicesShape[i];
    }
    const inputShape = tensor.shape;
    const resultShape = indicesShape.slice();
    resultShape.pop();
    let sliceSize = 1;
    for (let i = sliceRank; i < tensorRank; ++i) {
        sliceSize *= inputShape[i];
        resultShape.push(inputShape[i]);
    }
    const strides = [...computeStrides(tensor.shape).map(stride => stride / sliceSize),
        1].slice(0, sliceRank);
    return [resultShape, nResult, sliceSize, strides];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F0aGVyX25kX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9nYXRoZXJfbmRfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFpQkEsT0FBTyxFQUFDLGNBQWMsRUFBRSxhQUFhLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFdEQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxNQUFrQixFQUFFLE9BQW1CO0lBRXhFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3pDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtRQUNsQixNQUFNLElBQUksS0FBSyxDQUNYLHlEQUF5RDtZQUN6RCxxQkFBcUIsVUFBVSxHQUFHLENBQUMsQ0FBQztLQUN6QztJQUNELElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtRQUNuQixNQUFNLElBQUksS0FBSyxDQUNYLDJEQUEyRDtZQUMzRCxxQkFBcUIsV0FBVyxHQUFHLENBQUMsQ0FBQztLQUMxQztJQUNELElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQUU7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FDWCxxREFBcUQ7WUFDckQsc0JBQXNCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQzdDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUU7UUFDL0MsTUFBTSxJQUFJLEtBQUssQ0FDWCxnRUFBZ0U7WUFDaEUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsUUFBUSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQzVEO0lBRUQsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNyQyxNQUFNLElBQUksS0FBSyxDQUNYLG9EQUFvRDtZQUNwRCxpQkFBaUIsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDdkM7SUFFRCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ25DLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXhELHNCQUFzQjtJQUN0QiwwREFBMEQ7SUFDMUQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNoRCxPQUFPLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVCO0lBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUVoQyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRWxCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzNDLFNBQVMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQztJQUVELE1BQU0sT0FBTyxHQUNULENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUU1QixPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7IFRlbnNvckluZm8gfSBmcm9tICcuLi90ZW5zb3JfaW5mbyc7XG5pbXBvcnQge2NvbXB1dGVTdHJpZGVzLCBzaXplRnJvbVNoYXBlfSBmcm9tICcuLi91dGlsJztcblxuLyoqXG4gKiBWYWxpZGF0ZSBnYXRoZXIgbmQgaW5wdXRzLlxuICpcbiAqIEBwYXJhbSB0ZW5zb3IgVGhlIHRlbnNvciBjb250YWlucyB0aGUgc291cmNlIHZhbHVlcy5cbiAqIEBwYXJhbSBpbmRpY2VzIFRoZSB0ZW5zb3IgY29udGFpbnMgdGhlIGluZGljZXMgdG8gc2xpY2UgdGhlIHNvdXJjZS5cbiAqXG4gKiBAcmV0dXJucyBbcmVzdWx0U2hhcGUsIG51bVVwZGF0ZXMsIHNsaWNlU2l6ZSwgc3RyaWRlc11cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVBbmRWYWxpZGF0ZSh0ZW5zb3I6IFRlbnNvckluZm8sIGluZGljZXM6IFRlbnNvckluZm8pOlxuICAgIFtudW1iZXJbXSwgbnVtYmVyLCBudW1iZXIsIG51bWJlcltdXSB7XG4gIGNvbnN0IHRlbnNvclJhbmsgPSB0ZW5zb3Iuc2hhcGUubGVuZ3RoO1xuICBjb25zdCBpbmRpY2VzUmFuayA9IGluZGljZXMuc2hhcGUubGVuZ3RoO1xuICBpZiAodGVuc29yUmFuayA8IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICd0Zi5nYXRoZXJORCgpIGV4cGVjdHMgdGhlIGlucHV0IHRvIGJlIHJhbmsgMSBvciBoaWdoZXIsJyArXG4gICAgICAgIGAgYnV0IHRoZSByYW5rIHdhcyAke3RlbnNvclJhbmt9LmApO1xuICB9XG4gIGlmIChpbmRpY2VzUmFuayA8IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICd0Zi5nYXRoZXJORCgpIGV4cGVjdHMgdGhlIGluZGljZXMgdG8gYmUgcmFuayAxIG9yIGhpZ2hlciwnICtcbiAgICAgICAgYCBidXQgdGhlIHJhbmsgd2FzICR7aW5kaWNlc1Jhbmt9LmApO1xuICB9XG4gIGlmIChpbmRpY2VzLmR0eXBlICE9PSAnaW50MzInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAndGYuZ2F0aGVyTkQoKSBleHBlY3RzIHRoZSBpbmRpY2VzIHRvIGJlIGludDMyIHR5cGUsJyArXG4gICAgICAgIGAgYnV0IHRoZSBkdHlwZSB3YXMgJHtpbmRpY2VzLmR0eXBlfS5gKTtcbiAgfVxuICBpZiAoaW5kaWNlcy5zaGFwZVtpbmRpY2VzUmFuayAtIDFdID4gdGVuc29yUmFuaykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2luZGV4IGlubmVybW9zdCBkaW1lbnNpb24gbGVuZ3RoIG11c3QgYmUgPD0gdGVuc29yIHJhbms7IHNhdzogJyArXG4gICAgICAgIGAke2luZGljZXMuc2hhcGVbaW5kaWNlc1JhbmsgLSAxXX0gdnMuICR7dGVuc29yUmFua31gKTtcbiAgfVxuXG4gIGlmIChzaXplRnJvbVNoYXBlKHRlbnNvci5zaGFwZSkgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdSZXF1ZXN0ZWQgbW9yZSB0aGFuIDAgZW50cmllcywgYnV0IGlucHV0IGlzIGVtcHR5LicgK1xuICAgICAgICBgIElucHV0IHNoYXBlOiAke3RlbnNvci5zaGFwZX0uYCk7XG4gIH1cblxuICBjb25zdCBpbmRpY2VzU2hhcGUgPSBpbmRpY2VzLnNoYXBlO1xuICBjb25zdCBzbGljZVJhbmsgPSBpbmRpY2VzU2hhcGVbaW5kaWNlc1NoYXBlLmxlbmd0aCAtIDFdO1xuXG4gIC8vIFRoZSByZXN1bHQgc2hhcGUgaXNcbiAgLy8gICBpbmRpY2VzLnNoYXBlWzotMV0gKyBwYXJhbXMuc2hhcGVbaW5kaWNlcy5zaGFwZVstMV06XVxuICBsZXQgblJlc3VsdCA9IDE7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlc1NoYXBlLmxlbmd0aCAtIDE7ICsraSkge1xuICAgIG5SZXN1bHQgKj0gaW5kaWNlc1NoYXBlW2ldO1xuICB9XG5cbiAgY29uc3QgaW5wdXRTaGFwZSA9IHRlbnNvci5zaGFwZTtcblxuICBjb25zdCByZXN1bHRTaGFwZSA9IGluZGljZXNTaGFwZS5zbGljZSgpO1xuICByZXN1bHRTaGFwZS5wb3AoKTtcblxuICBsZXQgc2xpY2VTaXplID0gMTtcbiAgZm9yIChsZXQgaSA9IHNsaWNlUmFuazsgaSA8IHRlbnNvclJhbms7ICsraSkge1xuICAgIHNsaWNlU2l6ZSAqPSBpbnB1dFNoYXBlW2ldO1xuICAgIHJlc3VsdFNoYXBlLnB1c2goaW5wdXRTaGFwZVtpXSk7XG4gIH1cblxuICBjb25zdCBzdHJpZGVzID1cbiAgICAgIFsuLi5jb21wdXRlU3RyaWRlcyh0ZW5zb3Iuc2hhcGUpLm1hcChzdHJpZGUgPT4gc3RyaWRlIC8gc2xpY2VTaXplKSxcbiAgICAgICAxXS5zbGljZSgwLCBzbGljZVJhbmspO1xuXG4gIHJldHVybiBbcmVzdWx0U2hhcGUsIG5SZXN1bHQsIHNsaWNlU2l6ZSwgc3RyaWRlc107XG59XG4iXX0=