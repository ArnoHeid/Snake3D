var camera, scene, renderer;
window.onload = init;
var cubeSize = 20;

function showSnake() {
    //Create space background is a large sphere
    var snakeHeadTexture = THREE.ImageUtils.loadTexture('snakehead.jpg');
    var snakeHeadGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeHeadMaterial = new THREE.MeshPhongMaterial();
    snakeHeadMaterial.map = snakeHeadTexture;
    var snakeHead = new THREE.Mesh(snakeHeadGeometry, snakeHeadMaterial);
    snakeHead.material.side = THREE.DoubleSide;
    snakeHead.material.map.wrapS = THREE.RepeatWrapping;
    snakeHead.material.map.wrapT = THREE.RepeatWrapping;
    snakeHead.material.map.repeat.set(1, 1);
    snakeHead.position.y = -cubeSize/2 + 2;
    scene.add(snakeHead);


    var snaketexture = THREE.ImageUtils.loadTexture('snakeskin.jpg');
    var snakeGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeMaterial = new THREE.MeshPhongMaterial();
    snakeMaterial.map = snaketexture;
    var snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
    snake.material.map.wrapS = THREE.RepeatWrapping;
    snake.material.map.wrapT = THREE.RepeatWrapping;
    snake.material.map.repeat.set(1, 1);
    snake.position.x = -1;
    snakeHead.add(snake);
    return snakeHead;
}
function getNewFood() {
    var foodGeometry = new THREE.BoxGeometry(1, 1, 1);
    var foodMaterial = new THREE.MeshLambertMaterial( {
            color: 0x315DFF,
            opacity: 1.0,
            transparent: false
        } );
    var food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.position.x = Math.floor(Math.random() * ((cubeSize/2 - 1) + (cubeSize/2 - 1 + 1)) - (cubeSize/2));
    food.position.y = Math.floor(Math.random() * ((cubeSize/2 - 1) + (cubeSize/2 - 1 + 1)) - (cubeSize/2));
    food.position.z = Math.floor(Math.random() * ((cubeSize/2 - 1) + (cubeSize/2 - 1 + 1)) - (cubeSize/2));
    return food;
}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45 , window.innerWidth / window.innerHeight , 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    // create a playgroundCube
    var playgroundCubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
   
    var playgroundCubeMaterial = new THREE.MeshLambertMaterial( {
            color: 0xffffff,
            opacity: 0.5,
            transparent: true,
    } );
    playgroundCubeGeometry.faces[6].color = new THREE.Color(0x6F00FF); //Bottom 1
    playgroundCubeGeometry.faces[7].color = new THREE.Color(0x530070); //Bottom 2
    var playgroundCube = new THREE.Mesh(playgroundCubeGeometry, playgroundCubeMaterial);
    var rotateCamera = true;
    var addNewFood = true;
    var addSnake = true;
    // position the cube
    playgroundCube.position.x = 0;
    playgroundCube.position.y = 0;
    playgroundCube.position.z = 0;
    // add the cube to the scene
    scene.add(playgroundCube);


    var planeGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize, cubeSize);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x6F00FF });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.material.side = THREE.DoubleSide;
    plane.rotation.x =  Math.PI / 2;
    plane.position.x = 0;
    plane.position.y = -cubeSize/2;
    plane.position.z = 0;
    playgroundCube.add(plane);


    //Create space background is a large sphere
    var spacetexture = THREE.ImageUtils.loadTexture('space.jpg');
    var spacesphereGeometry = new THREE.SphereGeometry(60,60,60);
    var spacesphereMaterial = new THREE.MeshPhongMaterial();
    spacesphereMaterial.map = spacetexture;
    var spacesphere = new THREE.Mesh(spacesphereGeometry, spacesphereMaterial);
    //spacesphere needs to be double sided 
    spacesphere.material.side = THREE.DoubleSide;
    spacesphere.material.map.wrapS = THREE.RepeatWrapping;
    spacesphere.material.map.wrapT = THREE.RepeatWrapping;
    spacesphere.material.map.repeat.set(5, 3);
    scene.add(spacesphere);

    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = -50;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);
    // add spotlight for scene
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add spotlight in cube
    var spotLightCube = new THREE.SpotLight(0xffffff);
    spotLightCube.position.set(-40, 0, -40);
    spotLightCube.castShadow = true;
    scene.add(spotLightCube);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output"). append(renderer.domElement);

    // event listener for click on play
    var instruction = document.getElementById( 'instructions' );
    var blocker = document.getElementById( 'blocker' );
    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        // set camera in block
        camera.rotation.y = 45 * Math.PI/180;
        camera.position.x = 10;
        camera.position.y = 0;
        camera.position.z = -25; 
        // stop rotation
        rotateCamera = false;
    }, false );

    render();
    function render() {
        requestAnimationFrame(render);
        // check rotation
        if (rotateCamera) {
            spacesphere.rotation.y += 0.001;
        }
        // check if new food has to be added
        if (addNewFood) {
            scene.add(getNewFood());
            addNewFood = false;
        }

        if (addSnake) {
            scene.add(showSnake());
            addSnake = false;
        }
        renderer.render(scene, camera);
    }
}