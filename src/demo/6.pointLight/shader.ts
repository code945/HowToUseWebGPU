/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:11
 * @LastEditTime: 2020-07-20 16:59:01
 */

const vs = `#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    mat4 uProjectionMatrix;
    mat4 uModelViewMatrix;
};

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;

layout(location = 0) out vec3 vNormal;
layout(location = 1) out vec4 vPosition;
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    vNormal = aNormal;
    vPosition = gl_Position;
}`;

const fs = `#version 450
    precision highp float; 
    layout(location=0) in vec3 vNormal;
    layout(location=1) in vec4 vPosition;
    layout(location=0) out vec4 fragColor;
    

    void main(){ 
        vec4 color = vec4(1, 0.7, 0.5, 1);  // 模型颜色
        vec3 lightColor = vec3(0.1, 1, 1); //光源颜色
        vec3 normal = normalize(vNormal); //法向量
        //光源位置
        vec3 lightPosition = vec3(30,50,20);
        //
        vec3 surfaceWorldPosition = vPosition.xyz; //(u_modelMatrix * vPosition).xyz;
        vec3 surface2light = lightPosition - surfaceWorldPosition;
        vec3 dir = normalize(surface2light); //光源方向
        float cosTheta = max(dot(normal, dir),0.0); // 计算夹角的cos值
        vec3 diffuse = lightColor * vec3(color) * cosTheta;
        fragColor  = vec4(diffuse,color.a);
    }
`;

export { fs, vs };
