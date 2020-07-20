/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:05
 * @LastEditTime: 2020-07-20 16:45:03
 */

// Position Vertex Buffer Data
// prettier-ignore
export const positions = new Float32Array([
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
    0.0, 1.0, 0.0,
]);

// Color Vertex Buffer Data
// prettier-ignore
export const colors = new Float32Array([
    1.0, 0.0, 0.0, // 🔴
    0.0, 1.0, 0.0, // 🟢
    0.0, 0.0, 1.0, // 🔵
]);

// Index Buffer Data
export const indices = new Uint16Array([0, 2, 1]);
