/*
 * @Author: hongxu.lin
 * @Date: 2020-07-08 18:04:25
 * @LastEditTime: 2020-07-15 17:19:06
 */
export default `#version 450
layout(location = 0) in vec4 vColor;
layout(location = 0) out vec4 outColor;
void main(void) {
  outColor = vColor;
}`;
