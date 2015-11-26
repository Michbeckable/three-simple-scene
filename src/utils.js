/**
 * Created by MKeutel on 24.02.2015.
 */

(function(ss, $) {

    ss.Utils = ss.Utils || {};

    ss.Utils.getLocalMouseEventCoordinates = function(event){
        var target = event.target || event.srcElement;
        var rect = target.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var offsetY = event.clientY - rect.top;
        return new THREE.Vector2(offsetX, offsetY);
    };

    ss.Utils.windowToNDC = function(p, viewportWidth, viewportHeight){
        return new THREE.Vector2(
            (p.x / viewportWidth) * 2.0 - 1.0,
            (p.y / viewportHeight) * -2.0 + 1.0  // inherently flip y-axis here
        );
    };

    ss.Utils.getProjectionRay = function(pNDC, camera){
        var rayOrigin = new THREE.Vector3(0.0, 0.0, 0.0);

        // we can calc a ray in camera coordinates through the image plane, even
        // without knowing near plane, just with the field of view of the camera
        // and the normalized device coordinates
        var FOVyHalf = THREE.Math.degToRad(camera.fov * 0.5);
        var tanFOVyHalf = Math.tan(FOVyHalf);
        var tanFOVxHalf = tanFOVyHalf * camera.aspect;
        var rayDir = new THREE.Vector3(
            pNDC.x * tanFOVxHalf,
            pNDC.y * tanFOVyHalf,
            -1.0
        );
        rayDir.normalize();

        return new THREE.Ray(rayOrigin, rayDir);
    };

    ss.Utils.getMousePick = function(pNDC, camera, scene){
        var projectRayCamera = ss.Utils.getProjectionRay(pNDC, camera);
        var projectRayWorld = new THREE.Ray(
            camera.localToWorld(projectRayCamera.origin),
            projectRayCamera.direction.transformDirection(camera.matrixWorld)
        );

        var raycaster = new THREE.Raycaster();
        raycaster.set(
            projectRayWorld.origin,
            projectRayWorld.direction
        );
        var intersections = raycaster.intersectObjects( scene.children, true );

        if (intersections[0])
            return intersections[0];
        else
            return null;
    };


}(window.SimpleScene = window.SimpleScene || {}, jQuery));