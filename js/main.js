var camera, scene, renderer;
window.onload = init;
var cubeSize = 20;
function getNewFood() {
var foodGeometry = new THREE.BoxGeometry(1, 1, 1);
var foodMaterial = new THREE.MeshLambertMaterial( {
        color: 0x315DFF,
        opacity: 1.0,
        transparent: false
    } );
var food = new THREE.Mesh(foodGeometry, foodMaterial);
food.position.x = Math.floor(Math.random() * ((cubeSize/2 - 1) + (cubeSize/2 - 1 + 1)) - (cubeSize/2));
console.log(food.position.x);
food.position.y = Math.floor(Math.random() * ((cubeSize/2 - 1) + (cubeSize/2 - 1 + 1)) - (cubeSize/2));
console.log(food.position.y);
food.position.z = Math.floor(Math.random() * ((cubeSize/2 - 1) + (cubeSize/2 - 1 + 1)) - (cubeSize/2));
console.log(food.position.z);
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
            opacity: 0.7,
            transparent: true,
    } );
    var playgroundCube = new THREE.Mesh(playgroundCubeGeometry, playgroundCubeMaterial);
    var rotateCamera = true;
    var addNewFood = true;
    // position the cube
    playgroundCube.position.x = 0;
    playgroundCube.position.y = 0;
    playgroundCube.position.z = 0;
    // add the cube to the scene
    scene.add(playgroundCube);

    //Create space background is a large sphere
    var spacetex = THREE.ImageUtils.loadTexture('space.jpg');
    var spacesphereGeo = new THREE.SphereGeometry(60,60,60);
    var spacesphereMat = new THREE.MeshPhongMaterial();
    spacesphereMat.map = spacetex;
    var spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);
    //spacesphere needs to be double sided 
    spacesphere.material.side = THREE.DoubleSide;
    spacesphere.material.map.wrapS = THREE.RepeatWrapping;
    spacesphere.material.map.wrapT = THREE.RepeatWrapping;
    spacesphere.material.map.repeat.set( 5, 3);
    scene.add(spacesphere);

    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 30;
    camera.position.z = -50;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);
    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output"). append(renderer.domElement);

    // event listener for click on play
    var instruction = document.getElementById( 'instructions' );
    var blocker = document.getElementById( 'blocker' );
    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        // set camera in block
        camera.position.y = 10;
         camera.position.z = -20; 
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
        renderer.render(scene, camera);
    }
}