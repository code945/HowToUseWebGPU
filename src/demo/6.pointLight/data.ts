/*
 * @Author: hongxu.lin
 * @Date: 2020-07-20 16:44:05
 * @LastEditTime: 2020-07-20 16:57:17
 */

// prettier-ignore
const size = 10;
const longSize = 100;
const shortSize = 50;
// prettier-ignore
const positions = new Float32Array([
    // 长边正面
    0,				0,				0,
    size,			longSize,		0,
    0,				longSize,		0, 
    0,				0,				0,
    size,			0,				0,
    size,			longSize,		0,
    
    
    // 长边背面
	   0,				0,				-size,
    0,				longSize,		-size,
    size,			longSize,		-size,
    0,				0,				-size,
    size,			longSize,		-size,
    size,			0,				-size,
	
    //长边顶
    0,				longSize,		0,  
    size,			longSize,		0,
    size,			longSize,		-size,
    0,				longSize,		0,  
    size,			longSize,		-size,
    0,				longSize,		-size,

    //长边底
    0,				0,				0, 
    size,			0,				-size,
    size,			0,				0,
    0,				0,				0, 
    0,				0,				-size,
    size,			0,				-size,

    //长边左侧
    0,				0,				0,  
    0,				longSize,		0,
    0,				0,				-size,
    0,				0,				-size, 
    0,				longSize,		0,
    0,				longSize,		-size,

    //长边右侧
    size,			size,			0, 
    size,			size,			-size,
    size,			longSize,		0,
    size,			size,			-size,
    size,			longSize,		-size,
    size,			longSize,		0,

   //短边前
    size,			0,				0,  
    size+shortSize,	size,			0,
    size,			size,			0,
    size,			0,				0,  
    size+shortSize,	0,				0,
    size+shortSize,	size,			0,

    //短边后
    size,			0,				-size, 
    size,			size,			-size,
    size+shortSize,	size,			-size,
    size,			0,				-size, 
    size+shortSize,	size,			-size,
    size+shortSize,	0,				-size,


    //短边上
    size,			size,			0,  
    size+shortSize,	size,			-size,
    size,			size,			-size,
    size,			size,			0,  
    size+shortSize,	size,			0,
    size+shortSize,	size,			-size,
    
    //短边下
    size,			0,				0, 
    size,			0,				-size,
    size+shortSize,	0,				-size,
    size,			0,				0, 
    size+shortSize,	0,				-size,
    size+shortSize,	0,				0,

    //短边右侧
    size+shortSize,			0,				0,  
    size+shortSize,			size,			-size,
    size+shortSize,			size,			0,
    size+shortSize,			0,				0,  
    size+shortSize,			0,			-size,
    size+shortSize,			size,			-size,
    
           ]);
// prettier-ignore
const normals = new Float32Array(
    [
   // 长边正面
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1,
   
   
   // 长边背面
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1,
   
   //长边顶
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0,

   //长边底
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0,

   //长边左侧
   -1,        0,      0, 
   -1,        0,      0, 
   -1,        0,      0, 
   -1,        0,      0, 
   -1,        0,      0, 
   -1,        0,      0,

   //长边右侧
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0,

  //短边前
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1, 
   0,        0,      1,

   //短边后
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1, 
   0,        0,      -1,


   //短边上
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0, 
   0,        1,      0,
   
   //短边下
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0, 
   0,        -1,      0,

   //短边右侧
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
   1,        0,      0, 
     ]
);

export { positions, normals, longSize };
