'use strict';

var Alien = (function() {

    function Alien(path, type) {
        // enforces new
        if (!(this instanceof Alien)) {
            return new Alien(path);
        }
        this.path = path;
        this.speed = 0.1;
        this.moves = 0;
        this.wp = path.getStart();
        this.x = this.wp.x;
        this.y = this.wp.y;
        this.type = type;
    }

    Alien.prototype.move = function() {

        if (this.path.isEnd(this.wp.targetWP)) {
            //console.log("Reached the end, stop");
            return false;
        }

        var nextWP = this.path.seek(this.wp, this.speed);
        //console.log("Alien startWP ", this.wp );
        //console.log("Alien nextWP ", nextWP );

        this.wp = nextWP;
        this.x = this.wp.x;
        this.y = this.wp.y;

        //console.log("X=",this.x,", Y=", this.y);
        this.moves++;
        return true;
    };

    Alien.prototype.isRunning = function() {
        return !this.path.isEnd(this.wp.targetWP);
    };

    Alien.prototype.getMoves = function() {
        return this.moves;
    };

    return Alien;
}());