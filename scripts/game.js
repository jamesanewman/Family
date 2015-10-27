'use strict';

var Game = (function() {

    var instance;

    Game = function(args) {
        if (instance) {
            return instance;
        }

        instance = this;

        this.config = {
            nodes: 10,
            aliens: 50,
            maxSpawnRate: 1000,
        }

        this.fps = 1000 / 500;
        this.init();

    };

    Game.prototype.init = function() {
        this.aliens = [];
        this.path = new Path(randomPath(this.config.nodes, false));
        drawBoard(this.path.getWaypoints());

        this.alienCreator = undefined;
        this.alienLoop = undefined;
        this.gameState = 'stopped';
    };

    Game.prototype.start = function(config) {
        var _self = this;

        if (_self.gameState == 'running') return;
        if (_self.gameState == 'stopped') {
            if (config.aliens) _self.config.aliens = config.aliens;
            if (config.nodes) _self.config.nodes = config.nodes;
            _self.init();
        }
        _self.gameState = 'running';

        console.log('Game starting...');

        createAliens();
        this.alienLoop = gameLoop();

        function gameLoop() {

            return setInterval(function() {
                drawBoard(_self.path.getWaypoints());

                var runningAliens = _.filter(_self.aliens, function(alien) {
                    //console.log("Is running ", alien.isRunning() );
                    return alien.isRunning();
                });

                var aliensPending = _self.alienCreator !== undefined;

                if (!aliensPending && runningAliens.length === 0) {
                    _self.stop();
                    return;
                }

                _.forEach(runningAliens, function(alien) {
                    drawAlien(alien);
                    alien.move();
                });

            }, _self.fps);

        }

        function createAliens() {
            if (_self.config.aliens === 0) {
                _self.alienCreator = undefined;
                return;
            }

            var alien = createAlien(_self.path);
            _self.aliens.push(alien);
            console.log('Create alien (', _self.config.aliens, " left)");
            _self.config.aliens--;
            _self.alienCreator = setTimeout(createAliens, _.random(10, _self.config.maxSpawnRate));
        }


    }

    Game.prototype.stop = function(config) {

        // stop game
        console.log('Game stopping...');
        if (this.alienCreator) clearTimeout(this.alienCreator);
        if (this.alienLoop) clearInterval(this.alienLoop);
        this.gameState = 'stopped';


    };

    Game.prototype.pause = function(config) {

        // stop game
        console.log('Game pausing...');
        if (this.alienCreator) clearTimeout(this.alienCreator);
        if (this.alienLoop) clearInterval(this.alienLoop);
        this.gameState = 'paused';


    };

    return Game;

    function createAlien(path) {
        return new Alien(path, _.random(0, 5));
    }

    function randomPath(pointCount, close) {
        var path = [];
        for (var i = 0; i < pointCount; i++) {

            var pt = [],
                delta = 100,
                maxx = 600,
                minx = 0,
                maxy = 400,
                miny = 0;

            if (close && i > 0) {
                maxx = path[i - 1][0] + delta;
                minx = path[i - 1][0] - delta;
                maxy = path[i - 1][1] + delta;
                miny = path[i - 1][1] - delta;

                if (minx < 0) minx = 0 + delta;
                if (miny < 0) miny = 0 + delta;
                if (maxx > 600) maxx = 600 - delta;
                if (maxy > 400) maxy = 400 - delta;

            }
            pt[0] = _.random(minx, maxx);
            pt[1] = _.random(miny, maxy);

            path.push(pt);

        }

        return path;
    }
}());