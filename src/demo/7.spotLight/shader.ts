/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:11
 * @LastEditTime: 2020-07-20 17:00:05
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
        //光锥角度的cos值 
    //在js中使用math.cos(度数) 使用uniform变量传入也可
    float lowerLimit= 0.95;
    float upperLimit = 0.95 * 1.02;
    vec4 color = vec4(1, 0.7, 0.5, 1);  // 模型颜色
    vec3 lightColor = vec3(0.1, 1, 1); //光源颜色
    vec3 normal = normalize(vNormal); //法向量 
    vec3 lightPosition = vec3(25,25,30);//光源位置 
    vec3 lightDir = normalize(vec3(0,0,1)); //光源方向
    //
    vec3 surfaceWorldPosition = vPosition.xyz; // (u_modelMatrix * v_position).xyz;
    vec3 surface2light = normalize(lightPosition - surfaceWorldPosition);//面到光源方向
    float dotFromDirection = dot(surface2light, -lightDir);  
    //判断点乘后的结果是不是大于限定值 并平滑插值
    float inLight = smoothstep(lowerLimit, upperLimit, dotFromDirection);//平滑过渡
    float cosTheta = max(dot(normal, surface2light),0.0); // 计算面到光源向量与法向量夹角的cos值
    vec3 diffuse = lightColor * vec3(color) * inLight *  cosTheta;
        fragColor  = vec4(diffuse,color.a);
    }
`;

export { fs, vs };
