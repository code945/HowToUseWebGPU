/*
 * @Author: hongxu.lin
 * @Date: 2020-07-08 18:04:14
 * @LastEditTime: 2020-07-15 22:53:42
 */
export default `#version 450 

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;

layout(location = 0) out vec4 vColor;
void main() {
    gl_Position = vec4(aPosition, 1.0);
    vColor = aColor;
}`;
