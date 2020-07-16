/*
 * @Author: hongxu.lin
 * @Date: 2020-07-08 18:04:14
 * @LastEditTime: 2020-07-15 22:49:49
 */
export default `#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    mat4 uProjectionMatrix;
    mat4 uModelViewMatrix;
};

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;

layout(location = 0) out vec4 vColor;
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}`;
