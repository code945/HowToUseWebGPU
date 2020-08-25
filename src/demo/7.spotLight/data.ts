/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:05
 * @LastEditTime: 2020-07-20 17:01:59
 */

// prettier-ignore
const positions = new Float32Array([
  50,-50,0.0,
  -50,-50,0.0,
  -50,50,0.0,
  50,50,0.0,
]);
// prettier-ignore
const normals = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]);
// prettier-ignore
const indices = new Uint32Array([0, 2, 1, 0, 3, 2]);

export { positions, normals, indices };
