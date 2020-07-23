/*
 * @Author: hongxu.lin
 * @Date: 2020-07-02 14:40:15
 * @LastEditTime: 2020-07-23 14:49:28
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

const modelMatrix = mat4.create();
const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();
const mvInvertTranspose = mat4.create();

const matrixArray = new Float32Array(48);

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
    // model view matrix
    mat4.mul(mvMatrix, viewMatrix, modelMatrix);
    // mvp matrix
    mat4.mul(mvpMatrix, projectionMtrix, mvMatrix);
    // invert mv matrix
    mat4.invert(mvInvertTranspose, mvMatrix);
    // invert transpose mv matrix
    mat4.transpose(mvInvertTranspose, mvInvertTranspose);

    matrixArray.set(mvpMatrix);
    matrixArray.set(mvMatrix, 16);
    matrixArray.set(mvInvertTranspose, 32);

    return matrixArray;
};

window.addEventListener("DOMContentLoaded", init);
