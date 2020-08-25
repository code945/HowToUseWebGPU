/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:11
 * @LastEditTime: 2020-07-24 09:48:59
 */

const vs = `#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    mat4 uMVPMatrix;
    mat4 uMVMatrix;
    mat4 uNormalMatrix;
};

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;

layout(location = 0) out vec3 vNormal;
void main() {
    gl_Position = uMVPMatrix * vec4(aPosition, 1.0);
    vNormal = (uNormalMatrix * vec4(aNormal, 0)).xyz;
}`;

const fs = `#version 450
    precision highp float; 
    layout(location=0) in vec3 vNormal;

    layout(location=0) out vec4 fragColor;

    void main(){ 
        vec4 color = vec4(1, 0, 0, 1);  // 模型颜色
        vec3 lightColor = vec3(1, 1, 1); //光源颜色
        vec3 normal = normalize(vNormal); //法向量
        vec3 dir = normalize(vec3(0.5,1.0,0.7)); //光源方向
        float cosTheta = max(dot(normal, dir),0.0); // 计算夹角的cos值
        vec3 diffuse = lightColor * vec3(color) * cosTheta;
        fragColor  = vec4(diffuse,1.0);
    }
`;

export { fs, vs };
