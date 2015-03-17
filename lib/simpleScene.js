/**
 * Created by MKeutel on 23.02.2015.
 */

(function(ss, $) {

    ss.InitScene = function(){

        var canvasContainer = $('#canvasWrap');
        var canvasWidth = canvasContainer.width();
        var canvasHeight = canvasContainer.height();

        var scene = new THREE.Scene();

        //if (camera === undefined) {
            var cameraControl = new DH.DHCameraControl(canvasContainer.get(0), scene);
            var camera = cameraControl.camera;

        //}
        //var camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );


        var renderer = new THREE.WebGLRenderer({antialias:false});
        renderer.setSize( canvasWidth , canvasHeight );
        renderer.setClearColor('#86c2e1');
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.BasicShadowMap;

        canvasContainer.append( renderer.domElement );

        //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        //var cube = new THREE.Mesh( geometry, material );

        //var cubes = ss.CreateCubes(100);
       // var cube = cubes[0];

        //scene.add.apply(scene, cubes);
        //scene.add( cubes );

        var floor = ss.CreateFloor();
        scene.add( floor );

        var axisHelper = new THREE.AxisHelper( 50 );
        scene.add( axisHelper );


        var testCube = ss.CreateTestCube();
        scene.add( testCube );
        //scene.add (testCube.clone() );

        //testCube.matrixAutoUpdate = false;




        var rotX = new THREE.Matrix4();
        rotX.makeRotationAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));

        var rotY = new THREE.Matrix4();
        rotY.makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(45));

        var rotZ = new THREE.Matrix4();
        rotZ.makeRotationAxis(new THREE.Vector3(0, 0, 1), THREE.Math.degToRad(90));


        /*var light = new THREE.PointLight(0xffffff, 1.0);
        light.position.set(0.0, 100.0 ,30.0);
        scene.add(light);*/

        var light = new THREE.SpotLight(0xffffff, 1.0, 0, Math.PI / 2.0);
        light.position.set(100.0, 300.0, 300.0);
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        //light.shadowCameraVisible = true;
        light.shadowDarkness = 0.5;
        light.shadowCameraNear = 200.0;
        light.shadowCameraFar = 800.0;
        scene.add(light);

        var lightHelper = new THREE.SpotLightHelper(light, 100);
        scene.add(lightHelper);

        var render = function () {
            requestAnimationFrame( render );

            //cube.rotation.x += 0.01;
            //cube.rotation.y += 0.01;

            renderer.render(scene, camera);
            //console.log(Math.random());
        };

        render();
    };

}(window.SimpleScene = window.SimpleScene || {}, jQuery));
