// 頂点シェーダープログラムのソースコード
const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    varying vec2 vTextureCoord;
    void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aVertexPosition.xy * 0.5 + 0.5; // [-1, 1] -> [0, 1]
    }
`;

// フラグメントシェーダープログラムのソースコード
const fragmentShaderSource = `
    precision mediump float;
    varying vec2 vTextureCoord;
    void main(void) {
        gl_FragColor = vec4(vTextureCoord.x, 0.0, 1.0 - vTextureCoord.x, 1.0); // 赤から青へのグラデーション
    }
`;

function initWebGL(canvas) {
    let gl = null;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
        console.error('WebGL not supported', e);
    }
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        gl = null;
    }
    return gl;
}

function initShaders(gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(vertexShader));
        return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    return shaderProgram;
}

function initBuffers(gl) {
    const vertices = new Float32Array([
        1.0,  1.0,  0.0,
       -1.0,  1.0,  0.0,
        1.0, -1.0,  0.0,
       -1.0, -1.0,  0.0
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numItems = 4;

    return vertexBuffer;
}

function drawScene(gl, shaderProgram, vertexBuffer) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numItems);
}

function start() {
    const canvas = document.getElementById('glcanvas');
    const gl = initWebGL(canvas);

    if (!gl) {
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaders(gl);
    const vertexBuffer = initBuffers(gl);

    drawScene(gl, shaderProgram, vertexBuffer);
}

window.onload = start;
