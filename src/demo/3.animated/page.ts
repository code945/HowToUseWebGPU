/*
 * @Author: hongxu.lin
 * @Date: 2020-07-02 14:40:15
 * @LastEditTime: 2020-07-21 10:01:34
 */

import { mat4, vec3 } from "gl-matrix";
import "../../style.less";
import { WebGPURenderEngin } from "../../engine/renderEngin";
import { WebGPURenderPipeline } from "../../engine/pipline";
import { fs, vs } from "./shader";
import { positions, indices, colors } from "./data";

const renderEngine: WebGPURenderEngin = new WebGPURenderEngin("renderCanvas");
let pipline: WebGPURenderPipeline = null;

const projectionMtrix = mat4.perspective(
    mat4.create(),
    Math.PI / 3.5,
    renderEngine.canvas.width / renderEngine.canvas.height,
    0.01,
    10000
);

const viewMatrix = mat4.lookAt(
    mat4.create(),
    vec3.fromValues(0, 0, -5),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(0, 1, 0)
);

mat4.invert(viewMatrix, viewMatrix);

const modelMatrix = mat4.create();
const mvMatrix = mat4.create();

const matrixArray = new Float32Array(32);

// 初始化方法
const init = async () => {
    // 初始化引擎 注意这里是个promise
    const engineReady = await renderEngine.init();
    if (engineReady) {
        // 创建pipeline
        pipline = new WebGPURenderPipeline(renderEngine, vs, fs);
        // 设置顶点
        pipline.addAttribute(positions);
        // 设置颜色
        pipline.addAttribute(colors);
        // 设置索引
        pipline.setIndex(indices);
        // 设置mvp矩阵内容
        pipline.addUniformBuffer(matrixArray);
        // 生成pipeline
        pipline.generatePipline();
        // 开启主渲染循环
        render();
    }
};

// 渲染循环
const render = () => {
    // 获取mvp的矩阵内容
    let buffer = pipline.getUniformEntryByBinding(0).resource.buffer as GPUBuffer;
    // 更新物体的model旋转矩阵buffer
    pipline.updateBuffer(buffer, 0, getRotateMatrix());
    // 调用绘制
    renderEngine.draw();
    requestAnimationFrame(render);
};

const getRotateMatrix = () => {
    mat4.fromRotation(modelMatrix, 0.005 * new Date().getTime(), vec3.fromValues(0, 1, 0));
    mat4.mul(mvMatrix, viewMatrix, modelMatrix);
    matrixArray.set(projectionMtrix);
    matrixArray.set(mvMatrix, 16);
    return matrixArray;
};

window.addEventListener("DOMContentLoaded", init);
