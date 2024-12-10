const canvas = document.querySelector("#preview");
const fileName = './rick.jpg';
/**
 * @type {CanvasRenderingContext2D}
*/
const ctx = canvas.getContext("2d");

const img = new Image();

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    document.querySelector("#loading").textContent = '생성중...';
    reader.onload = function (e) {
      img.src = e.target.result;
      img.onload = function(e){
        document.querySelector("#loading").textContent = '';
        [width, height] = clampDimensions(img.width, img.height);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let grayScales = convertToGrayScales(ctx, canvas.width, canvas.height);
        drawAscii(grayScales, canvas.width);
    };
    };
    reader.readAsDataURL(input.files[0]);
  }
}

const MAXIMUM_WIDTH = 240;
const MAXIMUM_HEIGHT = 160;

const clampDimensions = (width, height) => {
  if (height > MAXIMUM_HEIGHT) {
    const reducedWidth = Math.floor((width * MAXIMUM_HEIGHT) / height);
    return [reducedWidth, MAXIMUM_HEIGHT];
  }

  if (width > MAXIMUM_WIDTH) {
    const reducedHeight = Math.floor((height * MAXIMUM_WIDTH) / width);
    return [MAXIMUM_WIDTH, reducedHeight];
  }

  return [width, height];
};


const convertToGrayScales = (context, w, h) => {
    let image = context.getImageData(0, 0, w, h);
    let grayScales = []
    for(let i = 0; i < image.data.length; i+=4){
        let R = image.data[i];
        let G = image.data[i+1];
        let B = image.data[i+2];

        let grayScale = 0.21 * R + 0.72 * G + 0.07 * B;

        image.data[i] = image.data[i+1] = image.data[i+2] = grayScale;
        grayScales.push(grayScale);
    }
    context.putImageData(image, 0, 0);
    return grayScales;
};

const drawAscii = (gs, width) => {
    let element = document.querySelector("#ascii-wrapper");
    let ascii = " $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'.";
    element.textContent = '';
    for(let i = 0; i < gs.length; i++){
        element.textContent += ascii[Math.ceil((ascii.length - 1)*gs[i]/255)];
        element.textContent += ascii[Math.ceil((ascii.length - 1)*gs[i]/255)];
        if((i+1) % width == 0){
            element.textContent += '\n';
        }
    }
}
//convertToGrayScales(ctx, canvas.width, canvas.height);
