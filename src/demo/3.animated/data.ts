/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:05
 * @LastEditTime: 2020-07-20 16:48:43
 */

// prettier-ignore
const positions = new Float32Array([
    0.5,    -0.5,   0.0,
    -0.5,   -0.5,   0.0,
    -0.5,   0.5,    0.0,
    0.5,    0.5,    0.0,
]);

// 🎨 Color Vertex Buffer Data
// prettier-ignore
const colors = new Float32Array([
    1.0, 0.0, 0.0, // red
    0.0, 1.0, 0.0, // green
    0.0, 0.0, 1.0, // blue
    1.0, 1.0, 0.0, // yellow
]);

// 🗄️ Index Buffer Data
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

export { positions, colors, indices };
