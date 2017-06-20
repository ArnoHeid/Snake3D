var camera, scene, renderer, controls;
var container;
window.onload = init;
var cubeSize = 20;
var lastAddedSnakePart;
var YouBitTheWrongStuff = false;
var FoodID;
var collidableMeshList = [];
var collidableMeshListIndex;
var windowWidth;
var	windowHeight;
var deathCount = 1;

	var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.7,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.5, 0.5, 0.7 ),
		eye: [ 0, 30, 18 ],
		up: [ 0, 1, 0 ],
		fov: 70,
		updateCamera: function ( camera, scene, obj ) {
		  //camera.position.x += mouseX * 0.05;
		  //camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), -2000 );
		  camera.lookAt( scene.position );
		}
	},
	{
		left: 0.7,
		bottom: 0,
		width: 0.3,
		height: 0.5,
		background: new THREE.Color().setRGB( 0.7, 0.5, 0.5 ),
		eye: [ 0, 50, 0 ],
		up: [ 0, 0, 1 ],
		fov: 45,
		updateCamera: function ( camera, scene, obj) {
		  //camera.position.x -= mouseX * 0.05;
		  //camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), -2000 );
		  camera.lookAt( camera.position.clone().setY( 0 ) );
		}
	},
	{
		left: 0.7,
		bottom: 0.5,
		width: 0.3,
		height: 0.5,
		background: new THREE.Color().setRGB( 0.5, 0.7, 0.7 ),
		eye: [ 0, 0, 50 ],
		up: [ 0, 1, 0 ],
		fov: 30,
		updateCamera: function ( camera, scene, obj ) {
		  //camera.position.y -= mouseX * 0.05;
		  //camera.position.y = Math.max( Math.min( camera.position.y, 1600 ), -1600 );
		  camera.lookAt( scene.position );
		}
	}
];


function init() {
	document.getElementById("info").innerHTML = "Zaehler: " + deathCount;
	var clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45 , window.innerWidth / window.innerHeight , 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ 
        alpha: true,
      });
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
	
	//Create head of snake with texture
    var snakeHeadTexture = THREE.ImageUtils.loadTexture('snakehead.jpg');
    var snakeHeadGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeHeadMaterial = new THREE.MeshPhongMaterial();
    snakeHeadMaterial.map = snakeHeadTexture;
    var snakeHead = new THREE.Mesh(snakeHeadGeometry, snakeHeadMaterial);
	
    snakeHead.material.map.wrapS = THREE.RepeatWrapping;
    snakeHead.material.map.wrapT = THREE.RepeatWrapping;
    snakeHead.material.map.repeat.set(1, 1);
    snakeHead.name ="Snake";
    snakeHead.position.y = -cubeSize/2 + 2;

	collidableMeshList.push(snakeHead);

    var snaketexture = THREE.ImageUtils.loadTexture('snakeskin.jpg');
    var snakeGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeMaterial = new THREE.MeshPhongMaterial();
    snakeMaterial.map = snaketexture;
    var snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
	snake.name = "SnakeFirstPart";
    snake.material.map.wrapS = THREE.RepeatWrapping;
    snake.material.map.wrapT = THREE.RepeatWrapping;
    snake.material.map.repeat.set(1, 1);
    snake.position.z = 1; 

    var test = new THREE.SphereGeometry(1,1,1)

    var testGeometry = new THREE.SphereGeometry(0.2,5,5);
    var testMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var test = new THREE.Mesh(testGeometry, testMaterial);
    test.position.z = -4;

    snakeHead.add(test);

    snakeHead.add(snake);
	// add the snakeparts to collidable Objects
	//collidableMeshList.push(snake);
	lastAddedSnakePart = snake;
	scene.add(snakeHead);


	//Kameras
	for (var ii =  0; ii < views.length; ++ii ) {
		var view = views[ii];
		camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.x = view.eye[ 0 ];
		camera.position.y = view.eye[ 1 ];
		camera.position.z = view.eye[ 2 ];
		camera.up.x = view.up[ 0 ];
		camera.up.y = view.up[ 1 ];
		camera.up.z = view.up[ 2 ];
		view.camera = camera;
	}

	camera = views[0].camera;


    // create a playgroundCube
    var playgroundCubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
   
    var playgroundCubeMaterial = new THREE.MeshLambertMaterial( {
            color: 0xffffff,
            opacity: 0.4,
            transparent: true,
            shading: THREE.FlatShading,
            outline: true,
    } );
    var playgroundCube = new THREE.Mesh(playgroundCubeGeometry, playgroundCubeMaterial);
    playgroundCube.material.side = THREE.DoubleSide;
    // position the cube
    playgroundCube.position.x = 0;
    playgroundCube.position.y = 0;
    playgroundCube.position.z = 0;
    // add the cube to the scene
    scene.add(playgroundCube);
	//add edges
	var edges= new THREE.EdgesGeometry( playgroundCubeGeometry ); // or WireframeGeometry( geometry )
	var edgeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
	var cubeEdges = new THREE.LineSegments( edges, edgeMaterial );
	scene.add( cubeEdges );



	// add the cube to collidable Objects
	collidableMeshList.push(playgroundCube);


    var planeGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize, cubeSize);
    var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x6F00FF,
            opacity: 0,
            transparent: true,
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.material.side = THREE.DoubleSide;
    plane.rotation.x =  Math.PI / 2;
    plane.position.x = 0;
    plane.position.y = -cubeSize/2;
    plane.position.z = 0;
    //playgroundCube.add(plane);
	//scene.add(plane);
	// add the plane to collidable Objects
	//collidableMeshList.push(plane);


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
    spotLightCube.position.set(0, -100, 0);
    spotLightCube.castShadow = true;
    playgroundCube.add(spotLightCube);

    var pointLightCube = new THREE.PointLight(0xffffff);
    pointLightCube.position.set(0, 0, 0);
    pointLightCube.castShadow = true;
    playgroundCube.add(pointLightCube);
    

    //playgroundCube.material.side = THREE.DoubleSide;
    var rotateCamera = true;
    var addNewFood = true;
    var addSnake = true;
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
	var snaketexture = THREE.ImageUtils.loadTexture('snakeskin.jpg');
    var snakeGeometry = new THREE.SphereGeometry(1,5,5);
    var snakeMaterial = new THREE.MeshPhongMaterial();
    snakeMaterial.map = snaketexture;
    var snakePart = new THREE.Mesh(snakeGeometry, snakeMaterial);
	snakePart.name = "SnakePartX";
    snakePart.material.map.wrapS = THREE.RepeatWrapping;
    snakePart.material.map.wrapT = THREE.RepeatWrapping;
    snakePart.material.map.repeat.set(1, 1);
    snakePart.position.z = 1; 
    lastAddedSnakePart.add(snakePart);
	// add the snakeparts to collidable Objects
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

	function spawnSpaceTrees() {
		//TODO
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
				document.getElementById("info").text = "Zaehler: " + deathCount;
				deathCount++;
				}
			}
		}	
	}

	function updateSize() {

		if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

			windowWidth  = window.innerWidth;
			windowHeight = window.innerHeight;

			renderer.setSize ( windowWidth, windowHeight );

		}

	}
	

    render();
    function render() {
		updateSize();
        requestAnimationFrame(render);
		for ( var ii = 0; ii < views.length; ++ii ) {
		
		
			view = views[ii];
			camera = view.camera;

			view.updateCamera( camera, scene, test);

			var left   = Math.floor( windowWidth  * view.left );
			var bottom = Math.floor( windowHeight * view.bottom );
			var width  = Math.floor( windowWidth  * view.width );
			var height = Math.floor( windowHeight * view.height );
			renderer.setViewport( left, bottom, width, height );
			renderer.setScissor( left, bottom, width, height );
			renderer.setScissorTest( true );
			renderer.setClearColor( view.background );

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			if(ii==0){
				snakeHead.add(camera);
			}
			
			renderer.render( scene, camera );
	}
		
		camera = views[0].camera;
		
		
		//check collision
		if(YouBitTheWrongStuff==false) {
			collision();
		} else {
			controls.movementSpeed = 0;

			window.alert("You bit off more than you can chew! :(");
		}
		//Update the camera view
		var delta = clock.getDelta();
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
        //renderer.render(scene, camera);
    }
}