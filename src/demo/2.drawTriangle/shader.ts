/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:11
 * @LastEditTime: 2020-07-20 16:50:52
 */
const vs = `#version 450 
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;

layout(location = 0) out vec4 vColor;
void main() {
    gl_Position = vec4(aPosition, 1.0);
    vColor = aColor;
}`;

const fs = `#version 450
layout(location = 0) in vec4 vColor;
layout(location = 0) out vec4 outColor;
void main(void) {
  outColor = vColor;
}`;

export { fs, vs };
