/*
 * @Author: hongxu.lin
 * @Date: 2020-07-02 14:40:15
 * @LastEditTime: 2020-07-18 22:47:32
 */

import { mat4, vec3 } from "gl-matrix";
import { WebGPURenderEngin } from "../../engine/renderEngin";
import { WebGPURenderPipeline } from "../../engine/pipline";

import "../../style.less";

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

const renderEngine: WebGPURenderEngin = new WebGPURenderEngin("renderCanvas");
const positions = new Float32Array([
    0.5,
    -0.5,
    0.0,
    -0.5,
    -0.5,
    0.0,
    -0.5,
    0.5,
    0.0,
    0.5,
    0.5,
    0.0,
]);

const uvs = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);

// 🗄️ Index Buffer Data
const indices = new Uint16Array([0, 2, 1, 0, 3, 2]);

const projectionMtrix = mat4.perspective(
    mat4.create(),
    Math.PI / 3.5,
    renderEngine.canvas.width / renderEngine.canvas.height,
    0.01,
    10000
);

const viewMatrix = mat4.lookAt(
    mat4.create(),
    vec3.fromValues(0, 0, -1.2),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(0, 1, 0)
);

const modelMatrix = mat4.fromTranslation(
    mat4.create(),
    vec3.fromValues(0, 0, 0)
);
const mvMatrix = mat4.mul(mat4.create(), modelMatrix, viewMatrix);

const matrixArray = new Float32Array(32);
matrixArray.set(projectionMtrix);
matrixArray.set(mvMatrix, 16);

let pipline: WebGPURenderPipeline = null;
const init = async () => {
    const engineReady = await renderEngine.init();
    if (engineReady) {
        pipline = new WebGPURenderPipeline(renderEngine, vs, fs);
        pipline.addAttribute(positions);
        pipline.addAttribute(uvs, 2);
        pipline.setIndex(indices);
        pipline.addUniformBuffer(matrixArray);
        pipline.addSampler(1);
        await pipline.addTextureView(
            2,
            "https://cdn.linhongxu.com/uv_grid_opengl.jpg"
        );
        pipline.generatePipline();
        render();
    }
};

const render = () => {
    let buffer = pipline.getUniformEntryByBinding(0).resource
        .buffer as GPUBuffer;
    pipline.updateBuffer(buffer, 0, getRotateMatrix());
    renderEngine.draw();
    requestAnimationFrame(render);
};

const getRotateMatrix = () => {
    mat4.fromRotation(
        modelMatrix,
        0.0005 * new Date().getTime(),
        vec3.fromValues(0, 1, 0)
    );
    mat4.mul(mvMatrix, viewMatrix, modelMatrix);
    matrixArray.set(projectionMtrix);
    matrixArray.set(mvMatrix, 16);
    return matrixArray;
};

window.addEventListener("DOMContentLoaded", init);
