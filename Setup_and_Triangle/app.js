var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
'   gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}',
''
].join('\n');


var fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'   gl_FragColor = vec4(fragColor, 1.0);',
'}',
].join('\n');

var initDemo = function () {
    console.log("This is working");

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not supoort WebGL');
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create Shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Especifica a fonte dos shaders. Neste caso as variáveis que criamos
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    
    // Compile vertex shader 
    gl.compileShader(vertexShader);
    // Check for errors in GLSL
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    // Compile fragment shader 
    gl.compileShader(fragmentShader);
    // Check for errors in GLSL
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Create the Program
    var program = gl.createProgram();
    // Attack the shaders
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // Linker
    gl.linkProgram(program);
    // Check for linker errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!',gl.getProgramInfoLog(program));
        return;
    }
    // ? - Check for more debug errors probaly
    // Validate de code
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!',gl.getProgramInfoLog(program));
        return;
    }

    // Create array of positions
    var triangleVertices = 
    [
        // x, y     R, G, B
        0.0, 0.5,   1.0, 1.0, 0.0,
        -0.5, -0.5, 0.7, 0.0, 1.0,
        0.5, -0.5,   0.1, 1.0, 0.6
    ];

    // Create buffer and attack the possition array
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    // Handle
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    
    // For the vertPosition
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );

    // For the vertColor
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    // Enables the attributes to use
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    // Main render loop
    //
    gl.useProgram(program);
    // Draw! Finalmente!
    // 0 = How many vertices i want to skip
    // 3 = How many vertices we have to actualy draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};



