var Path = (function() {

    function Path(waypoints) {
        // enforces new
        if (!(this instanceof Path)) {
            return new Path(waypoints);
        }

        this.waypoints = waypoints;
        this.baseSpeed = 2; // pixels per sec
    }

    Path.prototype.isEnd = function(idx) {
        return (idx >= this.waypoints.length);
    };

    Path.prototype.getStart = function() {
        var wp = this.waypoints[0],
            wpInfo = {
                x: wp[0],
                y: wp[1],
                targetWP: 1
            };
        return wpInfo;
    };

    Path.prototype.seekOLD = function(targetWP, speed) {

        // TODO: Problem, this currently works wrong
        // Approximates path, I believe because it essentially covers the
        // nodes in time X, regardless of distance :)
        // Looks nice though :)

        var baseSpeed = this.baseSpeed * speed,
            nextWP = this.waypoints[targetWP.targetWP];

        if (nextWP === undefined) return targetWP;

        var currentX = targetWP.x,
            currentY = targetWP.y,
            distX = nextWP[0] - currentX,
            distY = nextWP[1] - currentY;

        //console.log('Current position = ', currentX, ', ' , currentY, ' ==> ', targetWP.targetWP );
        //console.log( 'Distance : ' , distX , ':', distY , ' => ', nextWP[1], ',' , currentY);

        if (distX === 0 && distY === 0) {
            targetWP.targetWP = targetWP.targetWP + 1;
            return this.seek(targetWP, speed);
        }

        var speedX = baseSpeed * Math.abs(distX / distY),
            speedY = baseSpeed * Math.abs(distY / distX),
            travelX = baseSpeed * (distX / Math.abs(distY)),
            travelY = baseSpeed * (distY / Math.abs(distX));



        //console.log( 'Speed : ' , speedX , ':', speedY );
        //console.log( 'Travel : ' , travelX , ':', travelY );
        if (Math.abs(distX) == 0 && Math.abs(distY) == 0) {
            // I will make it there this go, just jump to it
            var t = targetWP.targetWP + 1;
            console.log('Already there, move to next')
            var wp = this.waypoints[targetWP.targetWP],
                wpInfo = {
                    x: wp[0],
                    y: wp[1],
                    targetWP: t
                };
            return wpInfo;

        }

        // otherwise move towards it
        var x = (Math.abs(distX) < baseSpeed) ? nextWP[0] : (currentX + travelX),
            y = (Math.abs(distY) < baseSpeed) ? nextWP[1] : (currentY + travelY),
            wpInfo = {
                x: x,
                y: y,
                targetWP: targetWP.targetWP
            };


        return wpInfo;
    };

    Path.prototype.seek = function(targetWP, speed) {
        var WP = this.waypoints[targetWP.targetWP];

        if (WP === undefined) return targetWP;

        var baseDistance = 20 * speed,
            currentX = targetWP.x,
            currentY = targetWP.y,
            vecX = WP[0] - currentX,
            vecY = WP[1] - currentY,
            totalDistance = Math.abs(vecX) + Math.abs(vecY),
            distX = baseDistance * (Math.abs(vecX) / totalDistance),
            distY = baseDistance * (Math.abs(vecY) / totalDistance),
            dirX = vecX > 0 ? 1 : -1,
            dirY = vecY > 0 ? 1 : -1;

        // console.log("current = " , currentX, ', ', currentY);
        // console.log("vec = " , vecX, ', ', vecY);
        // console.log("dist = " , distX, ', ', distY);

        if (distX >= Math.abs(vecX) || distY >= Math.abs(vecY)) {
            // just reach the bloody thing
            var t = targetWP.targetWP + 1;
            //console.log('Already there, move to next')
            var wp = this.waypoints[targetWP.targetWP],
                wpInfo = {
                    x: wp[0],
                    y: wp[1],
                    targetWP: t
                };
            return wpInfo;
        }

        var x = currentX + (distX * dirX),
            y = currentY + (distY * dirY),
            wpInfo = {
                x: x,
                y: y,
                targetWP: targetWP.targetWP
            };

        //console.log("Moving...");
        return wpInfo;
    };

    Path.prototype.getWaypoints = function() {
        return this.waypoints;
    };

    return Path;


}());