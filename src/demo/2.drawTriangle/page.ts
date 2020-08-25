/*
 * @Author: hongxu.lin
 * @Date: 2020-07-02 14:40:15
 * @LastEditTime: 2020-07-20 16:46:13
 */

import glslangModule from "@webgpu/glslang/dist/web-devel/glslang.onefile";
import "../../style.less";

import { fs, vs } from "./shader";
import { positions, indices, colors } from "./data";

const init = async () => {
    const entry: GPU = navigator.gpu;
    if (!entry) {
        document.getElementById("notSupport").style.display = "";
        return;
    }
    // 拿到gpu的适配器（显卡）
    const adapter: GPUAdapter = await navigator.gpu.requestAdapter({
        powerPreference: "high-performance",
    });

    // 适配器获取具体的device实例
    const device: GPUDevice = await adapter.requestDevice();

    // 获取canvas
    const canvas: HTMLCanvasElement = document.querySelector("#renderCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 这句非常顺序非常重要，不能在获取device之前获取context，否则会canvas不显示图形
    // 只有在dom更新（例如修改canvascss宽高）后才显示
    const context = (<unknown>canvas.getContext("gpupresent")) as GPUCanvasContext;

    // 获取swapchain 用于向canvas输出渲染结果
    const format = await context.getSwapChainPreferredFormat(device);
    const swapChain: GPUSwapChain = context.configureSwapChain({
        device: device,
        format: format,
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
    });

    const glslang = await glslangModule();

    let createBuffer = (arr: Float32Array | Uint16Array | Uint32Array, usage: number) => {
        const gpubuffer = device.createBuffer({
            size: arr.byteLength,
            usage,
            //@ts-ignore
            mappedAtCreation: true,
        });
        //@ts-ignore
        new arr.constructor(gpubuffer.getMappedRange()).set(arr);
        gpubuffer.unmap();
        return gpubuffer;
    };

    // 创建command生成器 用来编码向gpu发送的command
    const commandEncoder: GPUCommandEncoder = device.createCommandEncoder();

    // 渲染pass的描述
    const backgroundColor = { r: 0.25, g: 0.5, b: 1, a: 1.0 };
    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                attachment: swapChain.getCurrentTexture().createView(),
                loadValue: backgroundColor,
            },
        ],
    };

    // 开始渲染pass
    const renderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    const positionBuffer = createBuffer(positions, GPUBufferUsage.VERTEX);
    const colorBuffer = createBuffer(colors, GPUBufferUsage.VERTEX);
    const indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX);

    /// ⚗️ Graphics Pipeline

    // 🔣 Input Assembly
    const positionAttribDesc: GPUVertexAttributeDescriptor = {
        shaderLocation: 0, // [[attribute(0)]]
        offset: 0,
        format: "float3",
    };
    const colorAttribDesc: GPUVertexAttributeDescriptor = {
        shaderLocation: 1, // [[attribute(1)]]
        offset: 0,
        format: "float3",
    };
    const positionBufferDesc: GPUVertexBufferLayoutDescriptor = {
        attributes: [positionAttribDesc],
        arrayStride: 4 * 3, // sizeof(float) * 3
        stepMode: "vertex",
    };
    const colorBufferDesc: GPUVertexBufferLayoutDescriptor = {
        attributes: [colorAttribDesc],
        arrayStride: 4 * 3, // sizeof(float) * 3
        stepMode: "vertex",
    };

    const vertexState: GPUVertexStateDescriptor = {
        indexFormat: "uint32",
        vertexBuffers: [positionBufferDesc, colorBufferDesc],
    };

    // 🖍️ Shader Modules
    const vertexStage = {
        module: device.createShaderModule({
            code: glslang.compileGLSL(vs, "vertex", true),
        }),
        entryPoint: "main",
    };

    const fragmentStage = {
        module: device.createShaderModule({
            code: glslang.compileGLSL(fs, "fragment", true),
        }),
        entryPoint: "main",
    };

    // 🍥 Blend State
    const colorState: GPUColorStateDescriptor = {
        format: "bgra8unorm",
        alphaBlend: {
            srcFactor: "src-alpha",
            dstFactor: "one-minus-src-alpha",
            operation: "add",
        },
        colorBlend: {
            srcFactor: "src-alpha",
            dstFactor: "one-minus-src-alpha",
            operation: "add",
        },
        writeMask: GPUColorWrite.ALL,
    };

    // 🔺 Rasterization
    const rasterizationState: GPURasterizationStateDescriptor = {
        frontFace: "ccw",
        cullMode: "back",
    };

    // 💾 Uniform Data
    const layout = device.createPipelineLayout({
        bindGroupLayouts: [],
    });

    const pipelineDesc: GPURenderPipelineDescriptor = {
        layout,
        vertexStage,
        fragmentStage,
        primitiveTopology: "triangle-list",
        colorStates: [colorState],
        vertexState,
        rasterizationState,
    };
    const pipeline = device.createRenderPipeline(pipelineDesc);

    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight, 0, 1);
    renderPassEncoder.setScissorRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    renderPassEncoder.setVertexBuffer(0, positionBuffer);
    renderPassEncoder.setVertexBuffer(1, colorBuffer);
    renderPassEncoder.setIndexBuffer(indexBuffer);
    renderPassEncoder.drawIndexed(3, 1, 0, 0, 0);
    renderPassEncoder.endPass();

    // 向GPU推送command
    device.defaultQueue.submit([commandEncoder.finish()]);
};

window.addEventListener("DOMContentLoaded", init);
