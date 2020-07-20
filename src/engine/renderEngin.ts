/*
 * @Author: hongxu.lin
 * @Date: 2020-07-08 15:48:10
 * @LastEditTime: 2020-07-20 22:20:43
 */

import { Glslang } from "@webgpu/glslang/dist/web-devel/glslang.onefile";
import glslangModule from "@webgpu/glslang/dist/web-devel/glslang.onefile";
import { WebGPURenderPipeline } from "./pipline";

export class WebGPURenderEngin {
    gpu: GPU;
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext;

    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    swapChain: GPUSwapChain;
    swapChainTextureFormat: GPUTextureFormat;
    depthTexture: GPUTexture;

    glslang: Glslang;
    pipelines: Array<WebGPURenderPipeline> = [];

    commandEncoder: GPUCommandEncoder;
    renderPassEncoder: GPURenderPassEncoder;

    clearColor = { r: 0.25, g: 0.5, b: 1, a: 1.0 };
    constructor(canvasOrDomId: HTMLCanvasElement | string) {
        this.gpu = navigator.gpu;
        if (canvasOrDomId instanceof HTMLCanvasElement) {
            this.canvas = canvasOrDomId;
        } else {
            this.canvas = document.getElementById(canvasOrDomId) as HTMLCanvasElement;
        }
    }

    async init(): Promise<boolean> {
        try {
            if (this.gpu) {
                // 拿到gpu的适配器（显卡）
                this.adapter = await navigator.gpu.requestAdapter({
                    powerPreference: "high-performance",
                });

                // 适配器获取具体的device实例
                this.device = await this.adapter.requestDevice();

                this.canvas.width = this.canvas.parentElement.clientWidth;
                this.canvas.height = this.canvas.parentElement.clientHeight;

                // 这句非常顺序非常重要，不能在获取device之前获取context，否则会canvas不显示图形
                // 只有在dom更新（例如修改canvascss宽高）后才显示
                this.context = (<unknown>this.canvas.getContext("gpupresent")) as GPUCanvasContext;

                // 获取swapchain 用于向canvas输出渲染结果
                this.swapChainTextureFormat = await this.context.getSwapChainPreferredFormat(this.device);
                this.swapChain = this.context.configureSwapChain({
                    device: this.device,
                    format: this.swapChainTextureFormat,
                    usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
                });

                this.glslang = await glslangModule();

                this.depthTexture = this.device.createTexture({
                    size: {
                        width: this.canvas.width,
                        height: this.canvas.height,
                        depth: 1,
                    },
                    format: "depth24plus-stencil8",
                    usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
                });
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    draw(vertNum?: number) {
        // 创建command生成器 用来编码向gpu发送的command
        this.commandEncoder = this.device.createCommandEncoder();
        // 渲染pass的描述
        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    attachment: this.swapChain.getCurrentTexture().createView(),
                    loadValue: this.clearColor,
                    storeOp: "store",
                },
            ],
            depthStencilAttachment: {
                attachment: this.depthTexture.createView(),

                depthLoadValue: 1.0,
                depthStoreOp: "store",
                stencilLoadValue: 0,
                stencilStoreOp: "store",
            },
        };
        // 🖌️ Encode drawing commands
        this.renderPassEncoder = this.commandEncoder.beginRenderPass(renderPassDesc);
        let currentPipeline = this.pipelines[0];
        this.renderPassEncoder.setPipeline(currentPipeline.pipeline);

        this.renderPassEncoder.setBindGroup(0, currentPipeline.uniformBindGroup);

        this.renderPassEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
        this.renderPassEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < currentPipeline.attributes.length; i++) {
            let buffer = currentPipeline.attributes[i].buffer;
            this.renderPassEncoder.setVertexBuffer(i, buffer);
        }

        if (currentPipeline.indexLength > 0) {
            this.renderPassEncoder.setIndexBuffer(currentPipeline.indexBuffer);

            this.renderPassEncoder.drawIndexed(currentPipeline.indexLength, 1, 0, 0, 0);
        } else {
            this.renderPassEncoder.draw(vertNum, 1, 0, 0);
        }

        this.renderPassEncoder.endPass();

        this.device.defaultQueue.submit([this.commandEncoder.finish()]);
    }
}
