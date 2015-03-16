/**
 * Created by MKeutel on 24.02.2015.
 */

(function(ss, $) {

    ss.Utils = ss.Utils || {};

    ss.Utils.GetLocalMouseEventCoordinates = function(event){
        var target = event.target || event.srcElement;
        var rect = target.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var offsetY = event.clientY - rect.top;
        return new THREE.Vector2(offsetX, offsetY);
    };

    ss.Utils.GetMousePickPoint = function(mouseCoordinatesNDC, camera, scene){
        var mouseVec = new THREE.Vector3(mouseCoordinatesNDC.x, mouseCoordinatesNDC.y, -1.0);
        mouseVec.unproject(camera);

        var raycaster = new THREE.Raycaster();
        raycaster.set(camera.position, mouseVec.sub(camera.position).normalize());
        var intersections = raycaster.intersectObjects( scene.children, true );

        if (intersections[0])
            return intersections[0].point;
        else
            return null;
    };

}(window.SimpleScene = window.SimpleScene || {}, jQuery));

