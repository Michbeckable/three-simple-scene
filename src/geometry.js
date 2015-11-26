/**
 * Created by MKeutel on 24.02.2015.
 */

(function(ss, $) {

    ss.createCubes = function(numCubes){
        var cubes = [];

        for (var i = 0; i < numCubes; i++) {

            var width = 2.0 + Math.random() * 10;
            //var length = Math.random() * 10;
            //var height = Math.random() * 10;


            var boxGeometry = new THREE.BoxGeometry(width, width, width, 1, 1, 1);
            var cube = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({color: 0xffaa00}));
            cube.name = "cube";
            cube.rotation.x = Math.random();
            cube.rotation.y = Math.random();

            cube.position.x = Math.random() * 300.0 - 150.0;
            cube.position.z = Math.random() * 300.0 - 150.0;
            cube.position.y = 15.0 + Math.random() * 40.0 - 20.0;
            cube.matrixAutoUpdate = true;

            cube.castShadow = true;
            cube.receiveShadow = true;
            cubes.push(cube);
        }

        return cubes;
    };

    ss.createFloor = function(){
        var floorGeometry = new THREE.PlaneGeometry(300, 300);
        var floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial( {color: 0xffffff} ));
        floor.name = 'The floor';

        floor.rotation.x = THREE.Math.degToRad(-90.0);
        floor.position.y -= 0.5;

        floor.receiveShadow = true;
        floor.castShadow = true;
        return floor;
    };

    ss.createTestCube = function(){
        var boxGeometry = new THREE.BoxGeometry(20, 60, 10);
        var cube = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({color: 0xffaa00}));
        cube.name = 'The cube';

        cube.castShadow = true;
        cube.receiveShadow = true;

        return cube;
    };

}(window.SimpleScene = window.SimpleScene || {}, jQuery));