/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:11
 * @LastEditTime: 2020-07-20 16:51:52
 */

const vs = `#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    mat4 uProjectionMatrix;
    mat4 uModelViewMatrix;
};

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUV;

layout(location = 0) out vec2 vUV;
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    vUV = aUV;
}`;

const fs = `#version 450
    precision highp float;
    layout(set=0, binding=1) uniform sampler uSampler;
    layout(set=0, binding=2) uniform texture2D uTexture0; 
    layout(location=0) in vec2 vUV;

    layout(location=0) out vec4 fragColor;

    void main(){ 
        fragColor = texture(sampler2D(uTexture0, uSampler), vUV);
    }
`;

export { fs, vs };
