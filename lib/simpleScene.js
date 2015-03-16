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


        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( canvasWidth , canvasHeight );
        renderer.setClearColor('#86c2e1');
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

        var testCube = ss.CreateTestCube();
        scene.add( testCube );
        //scene.add (testCube.clone() );

        testCube.matrixAutoUpdate = false;

        var rotX = new THREE.Matrix4();
        rotX.makeRotationAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));

        var rotY = new THREE.Matrix4();
        rotY.makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(45));

        var rotZ = new THREE.Matrix4();
        rotZ.makeRotationAxis(new THREE.Vector3(0, 0, 1), THREE.Math.degToRad(90));


        // local dependent rotations
        //testCube.matrix.multiply(rotX); // third rotation applied to object
        //testCube.matrix.multiply(rotY); // second rotation applied to object
        //testCube.matrix.multiply(rotZ); // first rotation applied to object
        // Wie in OpenGL. Die Transformation die am nähesten am Objekt steht ist die erste die ausgeführt wird!


        // world rotations
        //var rotAll = rotZ.clone().multiply(rotY.clone().multiply(rotX));
        //var rotAll = rotY.clone().multiply(rotX);
        // Interpret: rotation um x-achse (lokal = world da erste transformation)
        // dann rotation um die WORLD y-achse!
        // die zweite rotation erfolgt nicht in der lokalen y-achse, deshalb kann man nicht sagen, dass die erste
        // Rotation den Raum für die zweite Rotation schafft



        //var rotAll = rotX.clone().multiply(rotY);
        // Interpret: rotation um y-achse (lokal = world da erste transformation)
        // dann rotation um die WORLD x-achse

        // andersherum interpretiert (von links nach rechts) ergibt sich das Ergebnis wenn man die Rotationen als
        // mit lokale Achsen ansieht
        // Eine Rotation um lokale Achsen statt World-Achsen ergibt sich demnach durch die Umkehrung der Reihenfolge
        // der Rotationen.

        var rotAll = rotX.clone();
        testCube.matrix = rotAll.clone();

        var transY = new THREE.Matrix4();
        transY.makeTranslation(0.0, 50.0, 0.0);

        //testCube.matrix.multiply(transY);   // lokale translation: m * transY * v
        // Das sieht nur so aus als wäre es eine lokale Translation nach einer Rotation. Die Reihenfolge ist aber
        // andersherum. Zuerst erfolgt die globale Translation, dann eine Drehung um die x-Achse, die nun nicht mehr
        // durch das Objekt geht.
        // Die Translation verschiebt das Objekt. Der Punkt des Objektes der vorher (0,0,0) war ist nun genau
        // der Translationsvektor (0, 50, 0). Andersherum kann man auch sagen, das Koordinatensystem wurde um (0, -50, 0)
        // verschoben. Die nachfolgende Rotation wird aber um die Achsen des Koordinatensystems ausgeführt, nicht um
        // die lokalen Achsen des Objektes.

       // testCube.matrix.multiplyMatrices(transY, testCube.matrix);  // world translation: transY * rotX * v

        //testCube.matrix.multiplyMatrices(rotY, testCube.matrix);    // rotY * transY * rotX * v



        var v = new THREE.Vector4(1.0, 2.0, -1.0, 1.0);
        var v1 = v.clone();
        v1.applyMatrix4(rotX);
        v1.applyMatrix4(rotY);
        v1.applyMatrix4(rotZ);

        console.log(v1);

        var v2 = v.clone();

        var rotAll = rotZ.clone().multiply(rotY.clone().multiply(rotX));
        v2.applyMatrix4(rotAll);

        console.log(v2);

        //rotY.multiply(rotX);
        //rotZ.multiply(rotY);


        //testCube.matrix = rotZ;
        //testCube.matrixWorld.copy(testCube.matrix);

        //testCube.matrix.multiply(rotX);


        //camera.position.y = 5;
        //camera.position.z = 50;

        //camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        var light = new THREE.PointLight(0xffffff, 1.0);
        light.position.set(0.0, 100.0 ,30.0);
        scene.add(light);

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
