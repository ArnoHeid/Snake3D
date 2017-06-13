var camera, scene, renderer;
var directionalLight, pointLight;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
window.onload = init;
function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 4;
	mouseY = ( event.clientY - windowHalfY ) * 4;
}

function init() {   
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();
        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45 , window.innerWidth / window.innerHeight , 0.1, 1000); 
        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        // create a playground
        var playgroundGeometry = new THREE.BoxGeometry(5, 5, 5);
        var playgroundMaterial = new THREE.MeshLambertMaterial( {
        	color: 0xffffff,
        	opacity: 0.3,
        	transparent: true
    	} );
        playgroundMaterial.opacity = 0.5;
        var playground = new THREE.Mesh(playgroundGeometry, playgroundMaterial);
        playground.castShadow = true;

        // position the cube
        playground.position.x = 0;
        playground.position.y = 0 ;
        playground.position.z = 0;

        // add the cube to the scene
        scene.add(playground);

        //Space background is a large sphere
  		var spacetex = THREE.ImageUtils.loadTexture('space.jpg');
  		var spacesphereGeo = new THREE.SphereGeometry(20,20,20);
  		var spacesphereMat = new THREE.MeshPhongMaterial();
  		spacesphereMat.map = spacetex;

  		var spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);
  
  		//spacesphere needs to be double sided as the camera is within the spacesphere
  		spacesphere.material.side = THREE.DoubleSide;
  		spacesphere.material.map.wrapS = THREE.RepeatWrapping; 
  		spacesphere.material.map.wrapT = THREE.RepeatWrapping;
  		spacesphere.material.map.repeat.set( 5, 3);
  
  		scene.add(spacesphere);

        // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = -15; 
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

        render();

        function render() {
            requestAnimationFrame(render);
            spacesphere.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
    }
   