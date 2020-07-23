import { WebGPURenderEngin } from "./renderEngin";
import { getImageData } from "./utils";

/*
 * @Author: hongxu.lin
 * @Date: 2020-07-15 15:40:27
 * @LastEditTime: 2020-07-23 15:59:23
 */
export class WebGPURenderPipeline {
    engin: WebGPURenderEngin;
    pipeline: GPURenderPipeline;
    pipelineDesc: GPURenderPipelineDescriptor;
    colorState: GPUColorStateDescriptor;
    vertexState: GPUVertexStateDescriptor;
    rasterizationState: GPURasterizationStateDescriptor;

    attributes: Array<any> = [];

    uniformBindGroup: GPUBindGroup;
    uniformBindGroupLayout: GPUBindGroupLayout;

    uniformEntries: Map<number, any> = new Map<number, any>();
    indexBuffer: GPUBuffer;
    indexLength: number;

    vs: string;
    fs: string;
    vertModule: GPUShaderModule;
    fragModule: GPUShaderModule;

    vertexStage: any;
    fragmentStage: any;

    layout: GPUPipelineLayout;

    constructor(engine: WebGPURenderEngin, vs: string, fs: string) {
        this.engin = engine;
        this.engin.pipelines.push(this);
        this.vs = vs;
        this.fs = fs;

        this.vertModule = this.engin.device.createShaderModule({
            code: this.engin.glslang.compileGLSL(vs, "vertex", true),

            // @ts-ignore
            source: vs,
            // @ts-ignore
            transform: (source: any) => this.engin.glslang.compileGLSL(source, "vertex", true),
        });

        this.fragModule = this.engin.device.createShaderModule({
            code: this.engin.glslang.compileGLSL(fs, "fragment", true),

            // @ts-ignore
            source: fs,
            // @ts-ignore
            transform: (source: any) => this.engin.glslang.compileGLSL(source, "fragment", true),
        });
    }

    createBuffer(fromTypedArray: Float32Array | Uint16Array | Uint32Array, usage: GPUBufferUsage) {
        let desc = { size: fromTypedArray.byteLength, usage };
        let [buffer, bufferMapped] = this.engin.device.createBufferMapped(desc);

        // @ts-ignore
        new fromTypedArray.constructor(bufferMapped).set(fromTypedArray);
        buffer.unmap();
        return buffer;
    }

    updateBuffer(to: GPUBuffer, offset: number, fromTypedArray: Float32Array | Uint16Array | Uint32Array) {
        // @ts-ignore
        this.engin.device.defaultQueue.writeBuffer(to, offset, fromTypedArray, 0, fromTypedArray.byteLength);
    }

    addAttribute(typedArray: Float32Array | Uint16Array | Uint32Array, componentSize: number = 3) {
        const buffer = this.createBuffer(typedArray, GPUBufferUsage.VERTEX);
        this.attributes.push({ buffer, componentSize });
    }

    setIndex(typedArray: Uint16Array | Uint32Array) {
        this.indexBuffer = this.createBuffer(typedArray, GPUBufferUsage.INDEX);
        this.indexLength = typedArray.length;
    }
    /**
     *
     *
     * @param {*} options
     *  binding: 0,
     *  visibility: GPUShaderStage.VERTEX,
     *  type: "uniform-buffer",
     *  resource: buffer | sampler | textureView
     *
     * @memberof WebGPURenderPipeline
     */
    addUniformEntry(options: any) {
        this.uniformEntries.set(options.binding, options);
    }

    getUniformEntryByBinding(key: number): any {
        return this.uniformEntries.get(key);
    }

    addUniformBuffer(typedArray: Float32Array | Uint16Array | Uint32Array, binding: number = 0) {
        const buffer = this.createBuffer(typedArray, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        this.addUniformEntry({
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            type: "uniform-buffer",
            resource: {
                buffer: buffer,
            },
        });
    }

    addSampler(binding: number, magFilter: GPUFilterMode = "linear", minFilter: GPUFilterMode = "linear") {
        const sampler = this.engin.device.createSampler({
            magFilter: magFilter,
            minFilter: minFilter,
            maxAnisotropy: 4,
        });

        this.addUniformEntry({
            binding: binding,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampler",
            resource: sampler,
        });
    }

    async addTextureView(binding: number, url: string, needCors: boolean = true) {
        // 加载图片
        const img = new Image();
        if (needCors) {
            img.crossOrigin = "anonymous";
        }
        img.src = url;
        await img.decode();

        // 创建GPUTexture
        const texture = this.engin.device.createTexture({
            size: {
                width: img.width,
                height: img.height,
                depth: 1,
            },
            format: "rgba8unorm",
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
        });

        const textureData = getImageData(img);

        //@ts-ignore
        if (typeof this.engin.device.defaultQueue.writeTexture === "function") {
            //@ts-ignore
            this.engin.device.defaultQueue.writeTexture({ texture }, textureData, { bytesPerRow: img.width * 4 }, [
                img.width,
                img.height,
                1,
            ]);
        } else if (createImageBitmap !== undefined) {
            // 生成bitmap
            const bitmap = await createImageBitmap(img);

            // 设置copy的源
            let source: GPUImageBitmapCopyView = { imageBitmap: bitmap };
            // 设置copy到的地方
            let destination: GPUTextureCopyView = { texture: texture };
            // 设置copy的尺寸
            let copySize: GPUExtent3D = {
                width: img.width,
                height: img.height,
                depth: 1,
            };
            // 执行copy操作
            this.engin.device.defaultQueue.copyImageBitmapToTexture(source, destination, copySize);
            // 释放bitmap数据
            bitmap.close();
        } else {
            // NOTE: Fallback until Queue.writeTexture is implemented.
            const textureDataBuffer = this.engin.device.createBuffer({
                size: textureData.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
            });
            //@ts-ignore
            this.engin.device.defaultQueue.writeBuffer(textureDataBuffer, 0, textureData);

            const textureLoadEncoder = this.engin.device.createCommandEncoder();
            textureLoadEncoder.copyBufferToTexture(
                {
                    buffer: textureDataBuffer,
                    //@ts-ignore
                    bytesPerRow: img.width * 4,
                    imageHeight: img.height,
                },
                {
                    texture,
                },
                [img.width, img.height, 1]
            );

            this.engin.device.defaultQueue.submit([textureLoadEncoder.finish()]);
        }

        this.addUniformEntry({
            binding: binding,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture",
            resource: texture.createView(),
        });
    }

    generateUniforms() {
        const bindGroupLayoutDes: any = { entries: [] };
        const bindGroupEntries: Array<any> = [];
        this.uniformEntries.forEach((entry, key) => {
            bindGroupLayoutDes.entries.push({
                binding: entry.binding,
                visibility: entry.visibility,
                type: entry.type,
            });
            bindGroupEntries.push({
                binding: entry.binding,
                resource: entry.resource,
            });
        });

        this.uniformBindGroupLayout = this.engin.device.createBindGroupLayout(bindGroupLayoutDes);
        this.uniformBindGroup = this.engin.device.createBindGroup({
            layout: this.uniformBindGroupLayout,
            // @ts-ignore
            entries: bindGroupEntries,
        });
    }

    generatePipline() {
        this.generateUniforms();
        // 🖍️ Shader Modules
        this.vertexStage = {
            module: this.vertModule,
            entryPoint: "main",
        };

        this.fragmentStage = {
            module: this.fragModule,
            entryPoint: "main",
        };

        // 🍥 Blend State
        this.colorState = {
            format: "bgra8unorm",
            // alphaBlend: {
            //     srcFactor: "src-alpha",
            //     dstFactor: "one-minus-src-alpha",
            //     operation: "add",
            // },
            colorBlend: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add",
            },
            writeMask: GPUColorWrite.ALL,
        };

        // 🔺 Rasterization
        this.rasterizationState = {
            // frontFace: "cw",
            // cullMode: "back",
        };

        // 💾 Uniform Data
        this.layout = this.engin.device.createPipelineLayout({
            bindGroupLayouts: [this.uniformBindGroupLayout],
        });

        this.vertexState = {
            indexFormat: "uint16",
            vertexBuffers: this.getVertexBufferDesc(),
        };

        this.pipelineDesc = {
            layout: this.layout,
            vertexStage: this.vertexStage,
            fragmentStage: this.fragmentStage,
            primitiveTopology: "triangle-list",
            colorStates: [this.colorState],
            vertexState: this.vertexState,
            depthStencilState: {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: "depth24plus-stencil8",
            },
            rasterizationState: this.rasterizationState,
        };
        this.pipeline = this.engin.device.createRenderPipeline(this.pipelineDesc);
    }

    getVertexBufferDesc() {
        return this.attributes.map((item, index) => {
            const bufferDesc: GPUVertexBufferLayoutDescriptor = {
                attributes: [
                    {
                        shaderLocation: index, // [[attribute(index)]]
                        offset: 0,
                        // @ts-ignore
                        format: `float${item.componentSize}`,
                    },
                ],
                arrayStride: 4 * item.componentSize, // sizeof(float) * 3
                stepMode: "vertex",
            };
            return bufferDesc;
        });
    }
}
