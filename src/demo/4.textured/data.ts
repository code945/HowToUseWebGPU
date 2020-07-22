/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:05
 * @LastEditTime: 2020-07-21 22:29:09
 */

// prettier-ignore
const positions = new Float32Array([
    0.5,    -0.5,   0.0, //右下
    -0.5,   -0.5,   0.0, //左下
    -0.5,   0.5,    0.0, //左上
    0.5,    0.5,    0.0, //右上
]);

// Index Buffer Data
// prettier-ignore
const indices = new Uint16Array([
    0, 2, 1, 
    0, 3, 2
]);

// uv Vertex Buffer Data
// prettier-ignore
const uvs = new Float32Array([
    1.0, 1.0,   //右下
    0.0, 1.0,   //左下
    0.0, 0.0,   //左上
    1.0, 0.0    //右上
]);

export { positions, uvs, indices };
