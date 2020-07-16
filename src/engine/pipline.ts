import { WebGPURenderEngin } from "./renderEngin";

/*
 * @Author: hongxu.lin
 * @Date: 2020-07-15 15:40:27
 * @LastEditTime: 2020-07-16 09:48:19
 */
export class WebGPURenderPipeline {
    engin: WebGPURenderEngin;
    pipeline: GPURenderPipeline;
    pipelineDesc: GPURenderPipelineDescriptor;
    colorState: GPUColorStateDescriptor;
    vertexState: GPUVertexStateDescriptor;
    rasterizationState: GPURasterizationStateDescriptor;

    attributes: Array<any> = [];
    uniformGroupInfo: any;
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
            transform: (source: any) =>
                this.engin.glslang.compileGLSL(source, "vertex", true),
        });

        this.fragModule = this.engin.device.createShaderModule({
            code: this.engin.glslang.compileGLSL(fs, "fragment", true),

            // @ts-ignore
            source: fs,
            // @ts-ignore
            transform: (source: any) =>
                this.engin.glslang.compileGLSL(source, "fragment", true),
        });
    }

    createBuffer(
        fromTypedArray: Float32Array | Uint16Array | Uint32Array,
        usage: GPUBufferUsage
    ) {
        let desc = { size: fromTypedArray.byteLength, usage };
        let [buffer, bufferMapped] = this.engin.device.createBufferMapped(desc);

        // @ts-ignore
        new fromTypedArray.constructor(bufferMapped).set(fromTypedArray);
        buffer.unmap();
        return buffer;
    }

    updateBuffer(
        to: GPUBuffer,
        offset: number,
        fromTypedArray: Float32Array | Uint16Array | Uint32Array
    ) {
        const [
            uploadBuffer,
            bufferMapped,
        ] = this.engin.device.createBufferMapped({
            size: fromTypedArray.byteLength,
            usage: GPUBufferUsage.COPY_SRC,
        });

        // @ts-ignore
        new fromTypedArray.constructor(bufferMapped).set(fromTypedArray);
        uploadBuffer.unmap();
        // @ts-ignore
        this.engin.device.defaultQueue.writeBuffer(
            to,
            offset,
            fromTypedArray,
            0,
            fromTypedArray.byteLength
        );
    }

    addAttribute(typedArray: Float32Array | Uint16Array | Uint32Array) {
        const buffer = this.createBuffer(typedArray, GPUBufferUsage.VERTEX);
        this.attributes.push(buffer);
    }

    setIndex(typedArray: Uint16Array | Uint32Array) {
        this.indexBuffer = this.createBuffer(typedArray, GPUBufferUsage.INDEX);
        this.indexLength = typedArray.length;
    }

    addUniform(typedArray: Float32Array | Uint16Array | Uint32Array) {
        const buffer = this.createBuffer(
            typedArray,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        );

        let uniformBindGroup: GPUBindGroup = null;

        // @ts-ignore
        const bindGroupLayoutDes: GPUBindGroupLayoutDescriptor = {
            // @ts-ignore
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    type: "uniform-buffer",
                },
            ],
        };
        const uniformBindGroupLayout = this.engin.device.createBindGroupLayout(
            bindGroupLayoutDes
        );
        // 🗄️ Bind Group
        // ✍ This would be used when encoding commands
        uniformBindGroup = this.engin.device.createBindGroup({
            layout: uniformBindGroupLayout,
            // @ts-ignore
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: buffer,
                    },
                },
            ],
        });

        this.uniformGroupInfo = {
            buffer,
            uniformBindGroupLayout,
            uniformBindGroup,
        };
    }

    generatePipline() {
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
        this.rasterizationState = {
            frontFace: "cw",
            cullMode: "none",
        };

        // 💾 Uniform Data
        this.layout = this.engin.device.createPipelineLayout({
            bindGroupLayouts: [this.uniformGroupInfo.uniformBindGroupLayout],
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
            rasterizationState: this.rasterizationState,
        };
        this.pipeline = this.engin.device.createRenderPipeline(
            this.pipelineDesc
        );
    }

    getVertexBufferDesc() {
        return this.attributes.map((item, index) => {
            const attribDesc: GPUVertexAttributeDescriptor = {
                shaderLocation: index, // [[attribute(index)]]
                offset: 0,
                format: "float3",
            };
            const bufferDesc: GPUVertexBufferLayoutDescriptor = {
                attributes: [attribDesc],
                arrayStride: 4 * 3, // sizeof(float) * 3
                stepMode: "vertex",
            };
            return bufferDesc;
        });
    }
}
