/*
 * @Author: hongxu.lin
 * @Date: 2020-07-22 23:17:14
 * @LastEditTime: 2020-07-22 23:28:24
 */

const getImageData = (img: HTMLImageElement) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height).data;
};

export { getImageData };
