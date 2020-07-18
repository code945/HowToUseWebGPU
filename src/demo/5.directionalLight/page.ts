/*
 * @Author: hongxu.lin
 * @Date: 2020-07-02 14:40:15
 * @LastEditTime: 2020-07-18 23:02:26
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
layout(location = 1) in vec3 aNormal;

layout(location = 0) out vec3 vNormal;
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    vNormal = aNormal;
}`;

const fs = `#version 450
    precision highp float; 
    layout(location=0) in vec3 vNormal;

    layout(location=0) out vec4 fragColor;

    void main(){ 
        vec4 color = vec4(1, 0.7, 0.5, 1);  // 模型颜色
        vec3 lightColor = vec3(0.1, 1, 1); //光源颜色
        vec3 normal = normalize(vNormal); //法向量
        vec3 dir = normalize(vec3(0.5,1.0,0.7)); //光源方向
        float cosTheta = max(dot(normal, dir),0.0); // 计算夹角的cos值
        vec3 diffuse = lightColor * vec3(color) * cosTheta;
        fragColor  = vec4(diffuse,1.0);
    }
`;

const renderEngine: WebGPURenderEngin = new WebGPURenderEngin("renderCanvas");

var size = 10;
var longSize = 100;
var shortSize = 50;

const positions = new Float32Array([
    // 长边正面
    0,
    0,
    0,
    size,
    longSize,
    0,
    0,
    longSize,
    0,
    0,
    0,
    0,
    size,
    0,
    0,
    size,
    longSize,
    0,

    // 长边背面
    0,
    0,
    -size,
    0,
    longSize,
    -size,
    size,
    longSize,
    -size,
    0,
    0,
    -size,
    size,
    longSize,
    -size,
    size,
    0,
    -size,

    //长边顶
    0,
    longSize,
    0,
    size,
    longSize,
    0,
    size,
    longSize,
    -size,
    0,
    longSize,
    0,
    size,
    longSize,
    -size,
    0,
    longSize,
    -size,

    //长边底
    0,
    0,
    0,
    size,
    0,
    -size,
    size,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    -size,
    size,
    0,
    -size,

    //长边左侧
    0,
    0,
    0,
    0,
    longSize,
    0,
    0,
    0,
    -size,
    0,
    0,
    -size,
    0,
    longSize,
    0,
    0,
    longSize,
    -size,

    //长边右侧
    size,
    size,
    0,
    size,
    size,
    -size,
    size,
    longSize,
    0,
    size,
    size,
    -size,
    size,
    longSize,
    -size,
    size,
    longSize,
    0,

    //短边前
    size,
    0,
    0,
    size + shortSize,
    size,
    0,
    size,
    size,
    0,
    size,
    0,
    0,
    size + shortSize,
    0,
    0,
    size + shortSize,
    size,
    0,

    //短边后
    size,
    0,
    -size,
    size,
    size,
    -size,
    size + shortSize,
    size,
    -size,
    size,
    0,
    -size,
    size + shortSize,
    size,
    -size,
    size + shortSize,
    0,
    -size,

    //短边上
    size,
    size,
    0,
    size + shortSize,
    size,
    -size,
    size,
    size,
    -size,
    size,
    size,
    0,
    size + shortSize,
    size,
    0,
    size + shortSize,
    size,
    -size,

    //短边下
    size,
    0,
    0,
    size,
    0,
    -size,
    size + shortSize,
    0,
    -size,
    size,
    0,
    0,
    size + shortSize,
    0,
    -size,
    size + shortSize,
    0,
    0,

    //短边右侧
    size + shortSize,
    0,
    0,
    size + shortSize,
    size,
    -size,
    size + shortSize,
    size,
    0,
    size + shortSize,
    0,
    0,
    size + shortSize,
    0,
    -size,
    size + shortSize,
    size,
    -size,
]);

const normals = new Float32Array(
    new Float32Array([
        // 长边正面
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,

        // 长边背面
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,

        //长边顶
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,

        //长边底
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,

        //长边左侧
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,

        //长边右侧
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,

        //短边前
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,

        //短边后
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,

        //短边上
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,

        //短边下
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,

        //短边右侧
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
    ])
);

const projectionMtrix = mat4.perspective(
    mat4.create(),
    Math.PI / 3.5,
    renderEngine.canvas.width / renderEngine.canvas.height,
    0.01,
    10000
);

const viewMatrix = mat4.lookAt(
    mat4.create(),
    vec3.fromValues(0, longSize * 1.5, 200),
    vec3.fromValues(0, longSize / 2, 0),
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
        pipline.addAttribute(normals);
        pipline.addUniformBuffer(matrixArray);
        pipline.generatePipline();
        render();
    }
};

const render = () => {
    let buffer = pipline.getUniformEntryByBinding(0).resource
        .buffer as GPUBuffer;
    pipline.updateBuffer(buffer, 0, getRotateMatrix());
    renderEngine.draw(positions.length / 3);
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
