/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:05
 * @LastEditTime: 2020-07-20 16:54:08
 */

// prettier-ignore
const positions = new Float32Array([
    0.5,    -0.5,   0.0,
    -0.5,   -0.5,   0.0,
    -0.5,   0.5,    0.0,
    0.5,    0.5,    0.0,
]);

// 🗄️ Index Buffer Data
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

// uv Vertex Buffer Data
// prettier-ignore
const uvs = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);

export { positions, uvs, indices };
