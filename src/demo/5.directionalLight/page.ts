/*
 * @Author: hongxu.lin
 * @Date: 2020-07-02 14:40:15
 * @LastEditTime: 2020-07-21 11:54:58
 */

import { mat4, vec3 } from "gl-matrix";
import { WebGPURenderEngin } from "../../engine/renderEngin";
import { WebGPURenderPipeline } from "../../engine/pipline";

import "../../style.less";

import { fs, vs } from "./shader";
import { positions, normals, longSize } from "./data";

const renderEngine: WebGPURenderEngin = new WebGPURenderEngin("renderCanvas");

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

const modelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, 0));
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
    let buffer = pipline.getUniformEntryByBinding(0).resource.buffer as GPUBuffer;
    pipline.updateBuffer(buffer, 0, getRotateMatrix());
    renderEngine.draw(positions.length / 3);
    requestAnimationFrame(render);
};

const getRotateMatrix = () => {
    mat4.fromRotation(modelMatrix, 0.0005 * new Date().getTime(), vec3.fromValues(0, 1, 0));
    mat4.mul(mvMatrix, viewMatrix, modelMatrix);
    matrixArray.set(projectionMtrix);
    matrixArray.set(mvMatrix, 16);
    return matrixArray;
};

window.addEventListener("DOMContentLoaded", init);
