function init() {   
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();
        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
      	

      	
        // create a playground
        var playgroundGeometry = new THREE.BoxGeometry(10, 10, 10);
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
        playground.position.y = 4 ;
        playground.position.z = 0;

        // add the cube to the scene
        scene.add(playground);

        // position and point the camera to the center of the scene
        camera.position.x = -20;
        camera.position.y = 20;
        camera.position.z = 50; 
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
        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        // call the render function
        var step = 0;

        render();

        function render() {
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    }
    window.onload = init;