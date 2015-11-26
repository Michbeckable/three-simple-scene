/**
 * Created by MKeutel on 23.02.2015.
 */

(function(ss, $) {

    ss.initScene = function(){
        var canvasContainer = $('#canvasWrap');
        var canvasWidth = canvasContainer.width();
        var canvasHeight = canvasContainer.height();
        var canvasSize = new THREE.Vector2(canvasWidth, canvasHeight);
        var aspectRatio = canvasSize.x / canvasSize.y;

        var scene = new THREE.Scene();
        ss.__defineGetter__('scene', function(){
            return scene;
        });

        var light = new THREE.SpotLight(0xffffff, 1.0, 0, Math.PI / 2.0);
        light.position.set(100.0, 300.0, 300.0);
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        light.shadowCameraVisible = true;
        light.shadowDarkness = 0.7;
        light.shadowCameraNear = 200.0;
        light.shadowCameraFar = 800.0;
        scene.add(light);

        var floor = ss.createFloor();
        scene.add( floor );

        var camera = ss.initCamera(aspectRatio);
        var cameraControl = new ss.CameraControl(camera, scene, canvasContainer.get(0), canvasSize);

        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize( canvasWidth , canvasHeight );
        renderer.setClearColor('#86c2e1');
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.BasicShadowMap;
        canvasContainer.append( renderer.domElement );

        var axisHelper = new THREE.AxisHelper( 50 );
        scene.add( axisHelper );

        var testCube = ss.createTestCube();
        scene.add( testCube );

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

    ss.initCamera = function (aspectRatio) {
        var camera = new THREE.PerspectiveCamera(65, aspectRatio, 2, 2000);
        camera.name = "Perspective Camera";
        camera.matrixAutoUpdate = false;

        // up vector and target are currently not loaded by SceneLoader
        camera.positionInit = new THREE.Vector3(0.0, 60, 100.0);
        camera.targetInit = new THREE.Vector3(0.0, 0.0, 0.0);

        return camera;
    };

    ss.disposeScene = function(){
        // remove the floor
        var floor = ss.scene.getObjectByName('The floor');
        ss.scene.remove(floor);
        floor.geometry.dispose();
        floor.material.dispose();

        // remove the test cube
        var testCube = ss.scene.getObjectByName('The cube');
        ss.scene.remove(testCube);
        testCube.geometry.dispose();
        testCube.material.dispose();
    };

}(window.SimpleScene = window.SimpleScene || {}, jQuery));
