  // Cube state: Each face has a 3x3 grid of colors.
    // Faces: U (top), D (bottom), L (left), R (right), F (front), B (back)
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const colorsMap = {
      U: 'white',
      D: 'yellow',
      L: 'orange',
      R: 'red',
      F: 'green',
      B: 'blue'
    };

    // Cube data structure: each face stores a flat array of 9 colors
    let cubeState = {};

    // Initialize cube state to solved
    function initCube() {
      cubeState = {};
      faces.forEach(f => {
        const c = colorsMap[f];
        cubeState[f] = new Array(9).fill(c);
      });
    }

    // Render cube faces and stickers to DOM
    const cube = document.getElementById('cube');
    function renderCube() {
      cube.innerHTML = ''; // clear
      faces.forEach(face => {
        const faceDiv = document.createElement('div');
        faceDiv.classList.add('face', faceClass(face));
        faceDiv.setAttribute('aria-label', faceName(face) + ' face');
        cubeState[face].forEach((color, i) => {
          const sticker = document.createElement('div');
          sticker.classList.add('sticker', color);
          sticker.setAttribute('data-face', face);
          sticker.setAttribute('data-index', i);
          faceDiv.appendChild(sticker);
        });
        cube.appendChild(faceDiv);
      });
    }

    // Face class names to match CSS
    function faceClass(face) {
      switch(face) {
        case 'U': return 'top';
        case 'D': return 'bottom';
        case 'L': return 'left';
        case 'R': return 'right';
        case 'F': return 'front';
        case 'B': return 'back';
      }
    }

    function faceName(face) {
      switch(face) {
        case 'U': return 'Up';
        case 'D': return 'Down';
        case 'L': return 'Left';
        case 'R': return 'Right';
        case 'F': return 'Front';
        case 'B': return 'Back';
      }
    }

    // Rotate a face 90 degrees clockwise on the face itself
    // Input: array of 9 colors
    // Returns new array rotated clockwise
    function rotateFace(arr) {
      return [
        arr[6], arr[3], arr[0],
        arr[7], arr[4], arr[1],
        arr[8], arr[5], arr[2]
      ];
    }
    // Rotate face counterclockwise by rotating clockwise 3 times
    function rotateFaceCounter(arr) {
      return rotateFace(rotateFace(rotateFace(arr)));
    }

    // Actions for moves (U, Ui, etc.)
    // Each move modifies cubeState accordingly
    // Moves are standard Rubik's Cube notation

    // Helper: swapping elements in array by indexes
    function swapElems(arr, idxs1, idxs2) {
      for(let i=0; i<idxs1.length; i++) {
        let temp = arr[idxs1[i]];
        arr[idxs1[i]] = arr[idxs2[i]];
        arr[idxs2[i]] = temp;
      }
    }

    // Move functions - these mutate cubeState

    // U move - rotate Up face clockwise and swap corresponding edges on sides
    function moveU() {
      cubeState.U = rotateFace(cubeState.U);

      // Save slices from F, R, B, L faces (top rows)
      // indices 0,1,2 of these faces
      const tempF = cubeState.F.slice(0,3);
      const tempR = cubeState.R.slice(0,3);
      const tempB = cubeState.B.slice(0,3);
      const tempL = cubeState.L.slice(0,3);

      cubeState.F.splice(0,3, ...tempR);
      cubeState.R.splice(0,3, ...tempB);
      cubeState.B.splice(0,3, ...tempL);
      cubeState.L.splice(0,3, ...tempF);
    }
    function moveUi() {
      moveU(); moveU(); moveU();
    }

    // D move - rotate Down face clockwise and swap corresponding edges on sides
    function moveD() {
      cubeState.D = rotateFace(cubeState.D);

      // bottom rows (indices 6,7,8) of F, L, B, R
      const tempF = cubeState.F.slice(6,9);
      const tempL = cubeState.L.slice(6,9);
      const tempB = cubeState.B.slice(6,9);
      const tempR = cubeState.R.slice(6,9);

      cubeState.F.splice(6,3, ...tempL);
      cubeState.L.splice(6,3, ...tempB);
      cubeState.B.splice(6,3, ...tempR);
      cubeState.R.splice(6,3, ...tempF);
    }
    function moveDi() {
      moveD(); moveD(); moveD();
    }

    // L move - rotate Left face clockwise and swap corresponding edge columns on U,F,D,B
    function moveL() {
      cubeState.L = rotateFace(cubeState.L);

      // left column indices 0,3,6 on U, F, D, B (B reversed)
      const tempU = [cubeState.U[0], cubeState.U[3], cubeState.U[6]];
      const tempF = [cubeState.F[0], cubeState.F[3], cubeState.F[6]];
      const tempD = [cubeState.D[0], cubeState.D[3], cubeState.D[6]];
      const tempB = [cubeState.B[8], cubeState.B[5], cubeState.B[2]]; // reversed order

      cubeState.U[0] = tempB[0]; cubeState.U[3] = tempB[1]; cubeState.U[6] = tempB[2];
      cubeState.F[0] = tempU[0]; cubeState.F[3] = tempU[1]; cubeState.F[6] = tempU[2];
      cubeState.D[0] = tempF[0]; cubeState.D[3] = tempF[1]; cubeState.D[6] = tempF[2];
      cubeState.B[8] = tempD[0]; cubeState.B[5] = tempD[1]; cubeState.B[2] = tempD[2];
    }
    function moveLi() {
      moveL(); moveL(); moveL();
    }

    // R move - rotate Right face clockwise and swap edge columns on U,F,D,B
    function moveR() {
      cubeState.R = rotateFace(cubeState.R);

      // right column indices 2,5,8 on U, F, D, B (B reversed)
      const tempU = [cubeState.U[2], cubeState.U[5], cubeState.U[8]];
      const tempF = [cubeState.F[2], cubeState.F[5], cubeState.F[8]];
      const tempD = [cubeState.D[2], cubeState.D[5], cubeState.D[8]];
      const tempB = [cubeState.B[6], cubeState.B[3], cubeState.B[0]]; // reversed order

      cubeState.U[2] = tempF[0]; cubeState.U[5] = tempF[1]; cubeState.U[8] = tempF[2];
      cubeState.F[2] = tempD[0]; cubeState.F[5] = tempD[1]; cubeState.F[8] = tempD[2];
      cubeState.D[2] = tempB[0]; cubeState.D[5] = tempB[1]; cubeState.D[8] = tempB[2];
      cubeState.B[6] = tempU[2]; cubeState.B[3] = tempU[1]; cubeState.B[0] = tempU[0];
    }
    function moveRi() {
      moveR(); moveR(); moveR();
    }

    // F move - rotate Front face clockwise and swap edges on U,R,D,L
    function moveF() {
      cubeState.F = rotateFace(cubeState.F);

      // indices for edges affected:
      // U bottom row: 6,7,8
      // R left column: 0,3,6
      // D top row: 2,1,0 (reversed)
      // L right column: 8,5,2 (reversed)

      const tempU = [cubeState.U[6], cubeState.U[7], cubeState.U[8]];
      const tempR = [cubeState.R[0], cubeState.R[3], cubeState.R[6]];
      const tempD = [cubeState.D[2], cubeState.D[1], cubeState.D[0]];
      const tempL = [cubeState.L[8], cubeState.L[5], cubeState.L[2]];

      cubeState.U[6] = tempL[0]; cubeState.U[7] = tempL[1]; cubeState.U[8] = tempL[2];
      cubeState.R[0] = tempU[2]; cubeState.R[3] = tempU[1]; cubeState.R[6] = tempU[0];
      cubeState.D[2] = tempR[0]; cubeState.D[1] = tempR[1]; cubeState.D[0] = tempR[2];
      cubeState.L[8] = tempD[2]; cubeState.L[5] = tempD[1]; cubeState.L[2] = tempD[0];
    }
    function moveFi() {
      moveF(); moveF(); moveF();
    }

    // B move - rotate Back face clockwise and swap edges on U,L,D,R
    function moveB() {
      cubeState.B = rotateFace(cubeState.B);

      // edges affected:
      // U top row: 0,1,2
      // L left column: 0,3,6
      // D bottom row: 8,7,6 (reversed)
      // R right column: 8,5,2 (reversed)

      const tempU = [cubeState.U[0], cubeState.U[1], cubeState.U[2]];
      const tempL = [cubeState.L[0], cubeState.L[3], cubeState.L[6]];
      const tempD = [cubeState.D[8], cubeState.D[7], cubeState.D[6]];
      const tempR = [cubeState.R[8], cubeState.R[5], cubeState.R[2]];

      cubeState.U[0] = tempR[2]; cubeState.U[1] = tempR[1]; cubeState.U[2] = tempR[0];
      cubeState.L[0] = tempU[2]; cubeState.L[3] = tempU[1]; cubeState.L[6] = tempU[0];
      cubeState.D[8] = tempL[0]; cubeState.D[7] = tempL[1]; cubeState.D[6] = tempL[2];
      cubeState.R[8] = tempD[2]; cubeState.R[5] = tempD[1]; cubeState.R[2] = tempD[0];
    }
    function moveBi() {
      moveB(); moveB(); moveB();
    }

    // Move function dispatcher by notation
    function performMove(move) {
      switch(move) {
        case 'U': moveU(); break;
        case "U'": moveUi(); break;
        case 'D': moveD(); break;
        case "D'": moveDi(); break;
        case 'L': moveL(); break;
        case "L'": moveLi(); break;
        case 'R': moveR(); break;
        case "R'": moveRi(); break;
        case 'F': moveF(); break;
        case "F'": moveFi(); break;
        case 'B': moveB(); break;
        case "B'": moveBi(); break;
      }
      renderCube();
    }

    // Shuffle function - random moves
    function shuffleCube(times=20) {
      const moves = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"];
      for(let i=0; i<times; i++) {
        const choice = moves[Math.floor(Math.random()*moves.length)];
        performMove(choice);
      }
    }

    // Reset cube to solved
    function resetCube() {
      initCube();
      renderCube();
      currentRotation = {x: -30, y: -30};
      applyCubeRotation();
    }

    // Cube rotation for 3d view
    let currentRotation = {x: -30, y: -30};
    let isDragging = false;
    let lastPos = {x:0, y:0};

    function applyCubeRotation() {
      cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
    }

    // Mouse drag for cube rotate
    cube.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastPos = {x: e.clientX, y: e.clientY};
      cube.classList.add('grabbing');
    });
    window.addEventListener('mouseup', e => {
      isDragging = false;
      cube.classList.remove('grabbing');
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      lastPos = {x: e.clientX, y: e.clientY};
      currentRotation.y += dx * 0.8;
      currentRotation.x -= dy * 0.8;
      currentRotation.x = Math.min(90, Math.max(-90, currentRotation.x));
      applyCubeRotation();
    });

    // Keyboard controls for moves and cube rotation
    window.addEventListener('keydown', e => {
      if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA"){
        return; // ignore typing in inputs if any present in future
      }
      const key = e.key.toUpperCase();
      if(faces.includes(key)) {
        // Check shift for inverse move
        const move = e.shiftKey ? key + "'" : key;
        performMove(move);
      }
      // Arrow keys rotate cube view
      if(e.key === 'ArrowUp') {
        currentRotation.x -= 15;
        currentRotation.x = Math.min(90, Math.max(-90, currentRotation.x));
        applyCubeRotation();
      } else if(e.key === 'ArrowDown') {
        currentRotation.x += 15;
        currentRotation.x = Math.min(90, Math.max(-90, currentRotation.x));
        applyCubeRotation();
      } else if(e.key === 'ArrowLeft') {
        currentRotation.y -= 15;
        applyCubeRotation();
      } else if(e.key === 'ArrowRight') {
        currentRotation.y += 15;
        applyCubeRotation();
      }
    });

    // Setup buttons
    document.getElementById('controls').addEventListener('click', e => {
      if(e.target.tagName === 'BUTTON') {
        const rotateMove = e.target.getAttribute('data-rotate');
        if(rotateMove) {
          performMove(rotateMove.replace('i', "'"));
        } else if(e.target.id === 'shuffle') {
          shuffleCube(30);
        } else if(e.target.id === 'reset') {
          resetCube();
        }
      }
    });

    // Initialize
    initCube();
    renderCube();
    applyCubeRotation();
