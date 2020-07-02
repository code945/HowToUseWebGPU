// import glslangModule from "@webgpu/glslang/dist/web-devel/glslang.onefile";

import "../../style.less";

let canvas: HTMLCanvasElement;
let adapter: GPUAdapter;
let glslang: any;
let device: GPUDevice;
let context: GPUCanvasContext;
let swapChain: GPUSwapChain;
let format: GPUTextureFormat = "bgra8unorm";
let commandEncoder: GPUCommandEncoder;
let renderPassEncoder: GPURenderPassEncoder;

const init = async () => {
    const entry: GPU = navigator.gpu;
    if (!entry) {
        document.getElementById("notSupport").style.display = "";
        return;
    }
    // 拿到gpu的适配器（显卡）
    adapter = await navigator.gpu.requestAdapter({
        powerPreference: "high-performance",
    });

    // 适配器获取具体的device实例
    device = await adapter.requestDevice();

    // 获取canvas
    canvas = document.querySelector("#renderCanvas");
    // 这句非常顺序非常重要，不能在获取device之前获取context，否则会canvas不显示图形
    // 只有在dom更新（例如修改canvascss宽高）后才显示
    context = (<unknown>canvas.getContext("gpupresent")) as GPUCanvasContext;

    // 获取swapchain 用于向canvas输出渲染结果
    format = await context.getSwapChainPreferredFormat(device);
    swapChain = context.configureSwapChain({
        device: device,
        format: format,
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
    });

    // 创建command生成器 用来编码向gpu发送的command
    commandEncoder = device.createCommandEncoder();

    // 渲染pass的描述
    let backgroundColor = { r: 0.25, g: 0.5, b: 1, a: 1.0 };
    let renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                attachment: swapChain.getCurrentTexture().createView(),
                loadValue: backgroundColor,
            },
        ],
    };

    // 开始渲染pass
    renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPassEncoder.setViewport(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight,
        0,
        1
    );

    // 结束渲染pass
    renderPassEncoder.endPass();

    // 向GPU推送command
    device.defaultQueue.submit([commandEncoder.finish()]);
};

window.addEventListener("DOMContentLoaded", init);
