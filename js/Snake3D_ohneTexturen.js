var camera, scene, renderer, controls;
var container;
window.onload = init;
var cubeSize = 20;
var lastAddedSnakePart;
var YouBitTheWrongStuff = false;
var FoodID;
var collidableMeshList = [];
var collidableMeshListIndex;


function init() {
	var clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45 , window.innerWidth / window.innerHeight , 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
	
	    //Create space background is a large sphere
    //var snakeHeadTexture = THREE.ImageUtils.loadTexture('snakehead.jpg');
    var snakeHeadGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeHeadMaterial = new THREE.MeshBasicMaterial(new THREE.Color(0xEEEEEE, 0.0));
    //snakeHeadMaterial.map = snakeHeadTexture;
    var snakeHead = new THREE.Mesh(snakeHeadGeometry, snakeHeadMaterial);
	snakeHead.name = "SnakeHead";
    /* snakeHead.material.side = THREE.DoubleSide;
    snakeHead.material.map.wrapS = THREE.RepeatWrapping;
    snakeHead.material.map.wrapT = THREE.RepeatWrapping;
    snakeHead.material.map.repeat.set(1, 1);
    snakeHead.position.y = -cubeSize/2 + 2; */
	collidableMeshList.push(snakeHead);


    //var snaketexture = THREE.ImageUtils.loadTexture('snakeskin.jpg');
    var snakeGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeMaterial = new THREE.MeshPhongMaterial();
    //snakeMaterial.map = snaketexture;
    var snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
	snake.name = "SnakeFirstPart";
    /* snake.material.map.wrapS = THREE.RepeatWrapping;
    snake.material.map.wrapT = THREE.RepeatWrapping;
    snake.material.map.repeat.set(1, 1);
    snake.position.x = -1; */
    snakeHead.add(snake);
	// add the snakeparts to collidable Objects
	collidableMeshList.push(snake);
	lastAddedSnakePart = snake;
	scene.add(snakeHead);

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
	// add the cube to collidable Objects
	collidableMeshList.push(playgroundCube);


    var planeGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize, cubeSize);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x6F00FF });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.material.side = THREE.DoubleSide;
    plane.rotation.x =  Math.PI / 2;
    plane.position.x = 0;
    plane.position.y = -cubeSize/2;
    plane.position.z = 0;
    playgroundCube.add(plane);
	scene.add(plane);
	// add the plane to collidable Objects
	collidableMeshList.push(plane);


    //Create space background is a large sphere
    //var spacetexture = THREE.ImageUtils.loadTexture('space.jpg');
    var spacesphereGeometry = new THREE.SphereGeometry(60,60,60);
    var spacesphereMaterial = new THREE.MeshPhongMaterial();
    //spacesphereMaterial.map = spacetexture;
    var spacesphere = new THREE.Mesh(spacesphereGeometry, spacesphereMaterial);
    //spacesphere needs to be double sided 
    /* spacesphere.material.side = THREE.DoubleSide;
    spacesphere.material.map.wrapS = THREE.RepeatWrapping;
    spacesphere.material.map.wrapT = THREE.RepeatWrapping;
    spacesphere.material.map.repeat.set(5, 3); */
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
    //document.getElementById("WebGL-output"). append(renderer.domElement);
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	
	// Fly Controls
	controls = new THREE.FlyControls( snakeHead );
	
	controls.movementSpeed = 1;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
	
	container.appendChild( renderer.domElement );

    // event listener for click on play
    var instruction = document.getElementById( 'instructions' );
    var blocker = document.getElementById( 'blocker' );
    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        // set camera in block
        //camera.rotation.y = 45 * Math.PI/180;
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0; 
        // stop rotation
        rotateCamera = false;
    }, false );
	
	//event listener to resize the scene
	window.addEventListener( 'resize', onWindowResize, false );
	
	function onWindowResize( event ) {

				SCREEN_HEIGHT = window.innerHeight;
				SCREEN_WIDTH  = window.innerWidth;

				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();
	}
	
	function addToTail() {
	//var snaketexture = THREE.ImageUtils.loadTexture('snakeskin.jpg');
    var snakeGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeMaterial = new THREE.MeshPhongMaterial();
    //snakeMaterial.map = snaketexture;
    var snakePart = new THREE.Mesh(snakeGeometry, snakeMaterial);
	snakePart.name = "SnakePartX";
    /* snakePart.material.map.wrapS = THREE.RepeatWrapping;
    snakePart.material.map.wrapT = THREE.RepeatWrapping;
    snakePart.material.map.repeat.set(1, 1);
    snakePart.position.x = -1; */
    lastAddedSnakePart.add(snakePart);
	// add the snakeparts to collidable Objects
	collidableMeshList.push(snakePart);
	lastAddedSnakePart = snakePart;
	}
	
	// Spawn new Food
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
	food.name = "Food";
	FoodID = food.id;
	collidableMeshList.push(food);	// adds food as a collidable object
	collidableMeshListIndex = collidableMeshList.length - 1;
    return food;
	}
	
	//	Collision Check
	function collision() {
	
		var originPoint = snakeHead.position.clone();
		
		for (var vertexIndex = 0; vertexIndex < snakeHead.geometry.vertices.length; vertexIndex++)
		{		
		var localVertex = snakeHead.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( snakeHead.matrix );
		var directionVector = globalVertex.sub( snakeHead.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) { 
			if(collisionResults[0].object.name == "Food") {
				collidableMeshList.splice(collidableMeshListIndex,1);
				scene.remove(scene.getObjectById(FoodID));
				addToTail();
				scene.add(getNewFood());
				scene.add(snakeHead);
				}
			else {
				YouBitTheWrongStuff = true;
				}
			}
		}	
	}


    render();
    function render() {
        requestAnimationFrame(render);
		//check collision
		if(YouBitTheWrongStuff==false) {
			collision();
		} else {
			controls.movementSpeed = 0;
			window.alert("You bit off more than you can chew! :(");
		}
		//Update the camera view
		var delta = clock.getDelta();
		snakeHead.add(camera);
		controls.update( delta );
        // check rotation
        if (rotateCamera) {
            spacesphere.rotation.y += 0.001;
        }
        // check if new food has to be added
        if (addNewFood) {
            scene.add(getNewFood());
            addNewFood = false;
        }

        /*if (addSnake) {
            scene.add(showSnake());
            addSnake = false;
        }*/
        renderer.render(scene, camera);
    }
}