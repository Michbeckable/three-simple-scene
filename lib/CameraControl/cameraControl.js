/* author: MKeutel 11/2013  
 */


(function(ss, $) {

    ss.CameraControl = function (camera, scene, eventReceiver, canvasSize) {
        this.camera = camera;
        this.eventReceiver = eventReceiver;

        this.moveMode = false;
        this.rotateMode = false;
        this.radius = 0.0;
        this.camPhi = 0.0;
        this.camTheta = 0.0;
        this.mouseDownPos = new THREE.Vector3(0, 0, 0);

        this.scene = scene;

        var context = this;

        // local functions saving scope
        this.onMouseDown = function (event) {
            if (!event)
                event = window.event;

            // add event listeners
            context.eventReceiver.addEventListener('mouseup', context.onMouseUp);
            context.eventReceiver.addEventListener('mousemove', context.onMouseMove);
            context.eventReceiver.addEventListener('mouseout', context.onMouseOut);

            if (event.button === 0)
                context.rotateMode = true;

            if (event.button === 2)
                context.moveMode = true;

            context.mouseDownPos.x = event.clientX;
            context.mouseDownPos.y = event.clientY;

            event.preventDefault();
        };


        this.onMouseUp = function (event) {
            if (!event)
                event = window.event;

            if (event.button === 0)
                context.rotateMode = false;

            if (event.button === 2)
                context.moveMode = false;

            event.preventDefault();
            event.stopPropagation();

            // remove event listeners
            context.eventReceiver.removeEventListener('mouseup', context.onMouseUp);
            context.eventReceiver.removeEventListener('mousemove', context.onMouseMove);
            context.eventReceiver.removeEventListener('mouseout', context.onMouseOut);
        };

        this.onMouseMove = function (event) {
            if (!event)
                event = window.event;

            if (context.rotateMode) {
                var deltaX = event.clientX - context.mouseDownPos.x;
                context.camPhi = context.camPhi - deltaX * 0.01;

                var deltaY = event.clientY - context.mouseDownPos.y;
                context.camTheta = Math.max(0.01, Math.min(Math.PI * 0.47, context.camTheta - deltaY * 0.01));
                context.updateCamera();

                //console.log("worldInverse: ");
                //console.log(context.camera.matrixWorld.elements);
                /*
                 var mat = new THREE.Matrix4();
                 mat.getInverse(context.camera.matrixWorld);
                 console.log("local inverse: ");
                 console.log(mat);
                 */
                /*
                 var matI = context.camera.matrixWorldInverse.clone();
                 matI.multiply(context.camera.matrixWorld);

                 for (var i = 0; i < matI.elements.length; i++)
                 {
                 if (matI.elements[i] < 0.00001)
                 matI.elements[i] = 0.0;
                 }

                 console.log("identity: ");
                 console.log(matI.elements);
                 */
                //console.log(context.camera.matrix.elements);
                //console.log(context.camera.matrixWorld.elements);
            }

            if (context.moveMode) {
                var deltaX = event.clientX - context.mouseDownPos.x;
                var deltaY = event.clientY - context.mouseDownPos.y;

                var vPan = new THREE.Vector3(-deltaX, deltaY, 0.0);
                var normalMatrix = new THREE.Matrix3();
                normalMatrix.getNormalMatrix(context.camera.matrix);  // transformation vector from camera to world
                vPan.applyMatrix3(normalMatrix);

                // scale translation dependent on current radius
                vPan.multiplyScalar(context.radius / 480.0);

                context.camera.position.add(vPan);
                context.camera.target.add(vPan);

                context.updateCamera();
            }

            context.mouseDownPos.x = event.clientX;
            context.mouseDownPos.y = event.clientY;

            event.preventDefault();
        };

        this.onMouseScroll = function (event) {
            event = event || window.event;
            var oldRadius = context.radius;

            // zoom to current mouse pointer
            var diffZoom = event.deltaY;//event.detail ? event.detail * (-120) : event.wheelDelta;
            // limit zoom
            if (diffZoom > 0 && context.radius >= 300)
                return;

            var radiusMultiplier = Math.abs(diffZoom) * -0.000416 + 1;
            context.radius = (diffZoom < 0) ? context.radius * radiusMultiplier : context.radius / radiusMultiplier;

            var mouseEventCoords = window.SimpleScene.Utils.getLocalMouseEventCoordinates(event);

            var mouseEventCoordsNDC = ss.Utils.windowToNDC(
                mouseEventCoords,
                canvasSize.x,
                canvasSize.y
            ) ;

            var mousePick = SimpleScene.Utils.getMousePick(mouseEventCoordsNDC, context.camera, context.scene);

            if (mousePick) {
                var iPoint = mousePick.point;//intersections[0].point;
                var camTargetWorld = new THREE.Vector3();
                camTargetWorld.copy(context.camera.target);
                var t = new THREE.Vector3().subVectors(iPoint, camTargetWorld);

                var tAddLength = t.length() - t.length() / oldRadius * context.radius;
                t.normalize().multiplyScalar(tAddLength);
                context.camera.target.add(t);

                //showPickCube(iPoint);
            }

            context.updateCamera();

            event.preventDefault();
            event.stopPropagation();

            return false;
        };

        this.onMouseOut = function (event) {
            context.moveMode = false;
            context.rotateMode = false;
        };

        this.onDoNothing = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        this.updateCamera = function () {
            this.camera.position.x = this.camera.target.x + this.radius * Math.sin(this.camTheta) * Math.sin(this.camPhi);
            this.camera.position.z = this.camera.target.z + this.radius * Math.sin(this.camTheta) * Math.cos(this.camPhi);
            this.camera.position.y = this.camera.target.y + this.radius * Math.cos(this.camTheta);
            this.camera.lookAt(this.camera.target);
            this.camera.updateMatrix();
            this.camera.updateMatrixWorld();
            this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
            //console.log((new THREE.Vector3()).setFromMatrixPosition(this.camera.matrix));
            //console.log(this.camera.matrix.elements);

        };


        // init camera
        this.setCameraInitPos();

        // mouseDown event takes care of adding listeners for move/out/up
        eventReceiver.addEventListener('mousedown', this.onMouseDown);
        eventReceiver.addEventListener('mousewheel', this.onMouseScroll);
        eventReceiver.addEventListener('DOMMouseScroll', this.onMouseScroll);
        eventReceiver.addEventListener('MozMousePixelScroll', this.onDoNothing);
        eventReceiver.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        }, false);    // discard context menu over rendering area
    };

    ss.CameraControl.prototype = Object.create(THREE.Object3D.prototype);	// sinnvoll??

    ss.CameraControl.prototype.setCameraInitPos = function () {
        this.camera.position.set(
            this.camera.positionInit.x,
            this.camera.positionInit.y,
            this.camera.positionInit.z);

        this.camera.target = this.camera.targetInit.clone();

        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(this.camera.target);
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();

        // compute radius
        var vecRadius = new THREE.Vector3();
        vecRadius.subVectors(this.camera.position, this.camera.target);
        this.radius = vecRadius.length();

        // compute camPhi angle
        // Change this if z is Up axis in your application
        this.camPhi = Math.atan2(vecRadius.x, vecRadius.z);

        // compute camTheta angle
        // Change this if z is Up axis in your application
        this.camTheta = Math.acos(vecRadius.y / this.radius);
    };

}(window.SimpleScene = window.SimpleScene || {}, jQuery));