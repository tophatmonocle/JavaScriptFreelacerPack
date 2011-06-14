/*! osmosis.js */
// ---------------------------------------------------------------------
// Osmosis Objected Oriented Compatibility Layer for MGL
// Author: Anson MacKeracher, Ethan Greavette
// Created: 6/9/2010
// Comments: This "library" acts as an intermetiate layer between monocleGL
//           and the JavaScript that implements the demo. Use this library
//           to access the plugin in a more object oriented way.
// ---------------------------------------------------------------------

var DEBUG_MODE = false;
var targetURL = "www.tophatmonocle.com";
var node_map = {};
var monoclegl_trigger_event = function() {
    try {
        var args = Array.prototype.slice.call(arguments);
        var node_id = args.shift();
        var node = node_map[node_id];
        if (node != undefined) {
            setTimeout(function() { node.trigger.apply(node, args); }, 0);
        }
    } catch (error) {
        logError("Error in trigger event.\n -> " + error);
    }
};

var monoclegl_initialize = function(plugin) {
    try {
        plugin.initialize(monoclegl_trigger_event);
    } catch (error) {
        logError("Error initializing monocleGL.\n -> " + error);
    }
};

// ---------------------------------------------------------------------
// Safe debug logging
function logDebug(passStr) {
    if(typeof console !== 'undefined' && DEBUG_MODE) {
        console.log(passStr);
    }
}

// ---------------------------------------------------------------------
// Safe error logging
function logError(passStr) {
    if(typeof console !== 'undefined') {
        console.log(passStr);
    }
}

function Osmosis() {
    this.boolSubscribed = false;
    this.boolCallbacks = false;

    this.x = 0.0;
    this.y = 0.0;
    this.width = 0.0;
    this.height = 0.0;
	this.scale = 1.0;
    this.rotation = 0.0;
    this.centerX = 0.5;
    this.centerY = 0.5;

    this.updateCallback = function(x, y, width, height, scale, rotation, centerX, centerY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.rotation = rotation;
        this.centerX = centerX;
        this.centerY = centerY;
    };

    this.getCallbacksByType = function(type) {
        if (typeof type !== "string") {
            logError("getCallbacksByType argument must be string type");
        }

        if (this.callbacks[type] === undefined) {
            logError("No callbacks of type " + type + " defined");
            return [];
        }

        return this.callbacks[type];
    };

    this.bind = function(eventType, funcObject, global) {
        try {
            // Inform MGL that we are listening for events of type eventType (pruned for duplicates)
            if (this.callbacks[eventType].length === 0) {
                this.listen(eventType);
            }

            this.callbacks[eventType].push(funcObject);
        } catch (error) {
            //debugger;
            logError("Unable to bind callback of type " + eventType + ".\n -> " + error);
        }
    };

    this.listen = function(eventType) {
        this.plugin.listen(this.id, eventType);
    };

    this.trigger = function() {
        var args = Array.prototype.slice.call(arguments);
        var event_type = args.shift();
        var cb_list = this.getCallbacksByType(event_type);

        var number = cb_list.length;
        for (var i = 0; i < number; i++) {
            if (typeof cb_list[i] === "object") {
                var cb_obj;
                var cb_func;

                // Tweener events have a special tween_id to keep track of their associated callbacks
                if (event_type === "tween_finished") {
                    // Check if the event's tween_id matches the callback's tween_id
                    var tween_id = args.shift();
                    if (cb_list[i].tween_id === tween_id) {
                        // Only call functions listening for this tween
                        cb_obj = cb_list[i].obj;
                        cb_func = cb_list[i].func;
                        cb_obj[cb_func].apply(cb_obj, args);

                        // Remove the callback from the callback list
                        cb_list.splice(i, 1);

                        i--;
                        number--;
                    }
                    continue;
                }

                // Physics events have an associated "other" node
                if (event_type === "physics_collision") {
                    var other_node = args.shift();
                    if (cb_list[i].node === other_node) {
                        // Only call functions listening for collisions between these nodes
                        cb_obj = cb_list[i].obj;
                        cb_func = cb_list[i].func;
                        cb_obj[cb_func].apply(cb_obj, args);
                    }
                    continue;
                }

                // All other callbacks are executed in the following way
                cb_obj = cb_list[i].obj;
                cb_func = cb_list[i].func;
                cb_obj[cb_func].apply(cb_obj, args);
            } else if (typeof cb_list[i] === "function") {
                cb_list[i].apply(null, args);
            } else {
                logError("Callback function object: " + cb_list[i] + " is invalid at index: " + i);
            }
        }
    };

    // Init function sets up the 'preemptive' position callback. This callback
    // is called before impressionist calls Drop callbacks, Animation finished
    // callbacks, drop down changed callbacks, etc. We maintain consistency in
    // the JavaScript through the liberal use of this callback mechanism.
    this.init = function() {
        // Add this node's instance to the node map
        node_map[this.id] = this;

        // Initialize callback list
        this.callbacks = {
            // TODO: Add more callback types!
            "mouse_down" : [],
            "mouse_up" : [],
            "mouse_over" : [],
            "mouse_moved" : [],
            "mouse_out" : [],
            "mouse_drag" : [],
            "mouse_drag_start" : [],
            "mouse_drag_enter" : [],
            "mouse_drag_exit" : [],
            "mouse_drop" : [],
            "position_changed" : [],
            "text_changed" : [],
            "tween_finished" : [],
            "enter_pressed" : [],
            "focus_changed" : [],
            "drop_down_changed" : [],
            "preload_update" : [],
            "preload_complete" : [],
            "physics_collision" : []
        };

        this.bind("position_changed", { "obj" : this, "func" : "updateCallback" });
    };

    // ----------------------------------------------------------------
    // Accessors
    this.getId = function() { return this.id; };

    // ----------------------------------------------------------------
    // Mutators
    this.setPosition = function(x, y) {
        if(typeof x !== "number" || typeof y !== "number") {
            logError("Invalid coordinates supplied for " + getId());
            return;
        }

        if(!this.checkId()) {
            return;
        }

        this.x = x;
        this.y = y;
        this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);
    };

    this.setDimensions = function(width, height) {
        if(typeof width !== "number" || typeof height !== "number") {
            logError("Invalid height or width supplied for " + getId());
            return;
        }

        if(!this.checkId()) {
            return;
        }

        this.width = width;
        this.height = height;
        this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);
    };

    this.setScale = function(scale, centerX, centerY) {
		if(!this.checkId()) {
            return;
        }

        if( typeof scale !== 'undefined') {
            this.scale = scale;
        }

		if( typeof centerX !== 'undefined' ) {
            this.centerX = centerX;
        }

        if( typeof centerY !== 'undefined' ) {
            this.centerY = centerY;
        }

        this.plugin.orientationIs(this.id, this.scale, this.rotation, this.centerX, this.centerY);
    };

	this.setRotation = function(rotation, centerX, centerY) {
		if(!this.checkId()) {
            return;
        }

        if( typeof rotation !== 'undefined' ) {
            this.rotation = rotation;
        }

		if( typeof centerX !== 'undefined' ) {
            this.centerX = centerX;
        }

        if( typeof centerY !== 'undefined' ) {
            this.centerY = centerY;
        }

        this.plugin.orientationIs(this.id, this.scale, this.rotation, this.centerX, this.centerY);
    };


    this.setColor = function(r, g, b, a) {
        if(typeof r !== "number" || typeof g !== "number" || typeof b !== "number" || typeof a !== "number") {
            logError("Invalid RGBA values provided");
            return;
        }

        if(!this.checkId()) {
            return;
        }

        this.plugin.colorIs(this.id, r, g, b, a);
    };

    this.toggleVisibility = function() {
        this.plugin.toggleVisibility(this.id);
    };

    this.setVisibility = function(visibility) {
        this.plugin.setVisibility(this.id, visibility);
    };

    // ----------------------------------------------------------------
    // Methods
    this.addChild = function(child) {
        if (child === undefined) {
            logError("trying to add undefined child");
        }

        if (this instanceof Sprite) {
            // error
            return;
        }

		if (child === this.id || child.id == this.id) {
            logError("Error in addChild. Node " + this.id + " cannot be a child of itself!");
            return;
        }

        if (typeof child === "string") {
            this.plugin.addChild(this.id, child);
        } else {
            this.plugin.addChild(this.id, child.getId());
        }
    };

    this.removeChild = function(child) {
        if (this instanceof Sprite) {
            // TODO: error
            return;
        }

        if(typeof child === "string") {
            this.plugin.removeChild(this.id, child);
        } else {
            this.plugin.removeChild(this.id, child.getId());
        }
    };

    this.addMoveTo = function(x, y, duration) {
        this.plugin.addTween(this.id, "x:" + x + ",y:" + y + ",time:" + duration);
    };

    this.addMoveBy = function(x, y, duration) {
        var rel_x = this.x + x;
        var rel_y = this.y + y;
        this.plugin.addTween(this.id, "x:" + rel_x + ",y:" + rel_y + ",time:" + duration);
    };


	// Empty tween studs
    this.addRotateTo = function(angle, duration) {};
    this.addRotateBy = function(angle, duration) {};
    this.addScaleTo = function(scale, duration) {};
    this.addScaleBy = function(scale, duration) {};

    this.addTween = function(command, obj, callback) {
   		if( typeof obj === 'undefined' || typeof callback === 'undefined' ) {
            this.plugin.addTween(this.id, command);
        } else {
			var tween_id = this.plugin.addTween(this.id, command);
            this.bind("tween_finished", { "tween_id" : tween_id, "obj" : obj, "func" : callback });
        }
   	};

   	this.removeTween = function() {
   		this.plugin.removeTween(this.id);
   	};

	this.pauseTween = function() {
   		this.plugin.pauseTween(this.id);
   	};

   	this.resumeTween = function() {
   		this.plugin.resumeTween(this.id);
   	};

   	this.addPhysics = function(command) {
    		this.plugin.addPhysics(this.id, command);
   	};

	this.addJoint = function(child, command) {
		if(child === "NULL") {
   			this.plugin.addJoint(this.id, child, command);
   		} else {
   			this.plugin.addJoint(this.id, child.id, command);
   		}
   	};

   	this.addCollision = function(nodeB, object, callback) {
        // Bind this callback
        this.bind("physics_collision", { "node" : nodeB.id, "obj" : object, "func" : callback});
        // Listen for physics collision events
        this.listen("physics_collision");
        // Let the physics engine know that we are interested in these events
   		this.plugin.addCollision(this.id, nodeB.id);
   	};

   	this.applyForce = function(fX, fY, vX, vY) {
   		this.plugin.applyForce(this.id, fX, fY, vX, vY);
   	};

   	this.removePhysics = function() {
   		this.plugin.removePhysics(this.id);
   	};

   	this.removeJoint = function(child) {
   		if(child === "NULL") {
   			this.plugin.removeJoint(this.id, child, command);
   		} else {
   			this.plugin.removeJoint(this.id, child.id, command);
   		}
   	};

   	this.removeCollision = function(nodeB) {
   		this.plugin.removeCollision(this.id, nodeB.id);
   	};

    this.getPosition = function() {
        return this.plugin.getPosition(this.id);
    };

    this.update = function() {
		// Depercaited
    };

    // Helper functions
    this.checkId = function() {
        if(this.getId() === undefined) {
            logError("Method called on uninitialized object: " + this);
            return false;
        } else {
            return true;
        }
    };

    this.addDragStartCallback = function(obj, callback) {
        this.bind("mouse_drag_start", { "obj" : obj, "func" : callback });
    };

    this.addDragCallback = function(obj, callback) {
        this.bind("mouse_drag", { "obj" : obj, "func" : callback });
    };

    this.addDropCallback = function(obj, callback) {
        this.bind("mouse_drop", { "obj" : obj, "func" : callback });
    };

    this.addDragEnterCallback = function(obj, callback) {
        this.bind("mouse_drag_enter", { "obj" : obj, "func" : callback });
    };

    this.addDragExitCallback = function(obj, callback) {
        this.bind("mouse_drag_exit", { "obj" : obj, "func" : callback });
    };

    // Enable / disable drag functionality for a node
    this.setDraggable = function(draggable) {
        this.plugin.setDraggable(this.id, draggable);
    };

    this.setDropTarget = function(dropTarget) {
        this.plugin.setDropTarget(this.id, dropTarget);
    };

    this.subscribe = function() {
        if(!this.boolSubscribed) { this.plugin.subscribe(this.id); }
        this.boolSubscribed = true;
    };

    this.unsubscribe = function() {
        if(this.boolSubscribed) { this.plugin.unsubscribe(this.id); }
        this.boolSubscribed = false;
    };

    this.subscribe = function() {
        if(!this.boolSubscribed) { this.plugin.subscribe(this.id); }
        this.boolSubscribed = true;
    };

    this.unsubscribe = function() {
        if(this.boolSubscribed) { this.plugin.unsubscribe(this.id); }
        this.boolSubscribed = false;
    };
    this.moveCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("mouse_moved", { "obj" : obj, "func" : func });
    };

    this.downCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("mouse_down", { "obj" : obj, "func" : func });
    };

    this.overCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("mouse_over", { "obj" : obj, "func" : func });
    };

    this.outCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("mouse_out", { "obj" : obj, "func" : func });
    };

    this.upCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("mouse_up", { "obj" : obj, "func" : func });
    };

    this.clickCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("mouse_up", { "obj" : obj, "func" : func });
    };

    this.setDragRegion = function(x, y, width, height) {
        this.plugin.setDragRegion(this.id, x, y, width, height);
    };

    // ---------------------------------------------------------------------
	// setDrag: Enables dragging for object
	this.setDrag = function(passMouse, passCenter, passRect, passGhost) {

		// Optional parameter for centering the sprite on the mouse
		if ( typeof passMouse === "undefined" ) { passMouse = this; }

		// Optional parameter for centering the sprite on the mouse
		if ( typeof passCenter === "undefined" ) { passCenter = true; }

		// Optional parameter for keeping the sprite inside the rectangle
		if ( typeof passRect === "undefined" ) { passRect = new Rectangle(0, 0, 480, 320); }

		// Optional parameter for making a ghost of the image before dragging it.
		if ( typeof passGhost === "undefined" ) { passGhost = false; }

		if(!this.boolCallbacks)	{
			this.setDraggable(true);
            this.setDragRegion(passRect.x, passRect.y, passRect.width, passRect.height);
		}
		this.boolCallbacks = true;
        this.subscribe();
	};

	// ---------------------------------------------------------------------
	// clearDrag: Disables dragging for object
	this.clearDrag = function() {
		this.unsubscribe();
	};
}

function BaseSprite(url, plugin, x, y, width, height) {
    this.setShape = function(shape) {
        if(typeof shape !== "string") {
            return;
        }

        if(!this.checkId()) {
            return;
        }

        // TODO: Check if shape parameter is a _valid_ string ("circle" or "square")

        this.plugin.shape(this.id, shape);
    };
}

function Sprite(plugin, url, x, y, width, height) {
    // Initialize everything
	this.plugin = plugin;
	this.url = url;
    this.id = plugin.newSprite(url);

	// Optional parameter default to default to 0
	if ( x === undefined ) { this.x = 0; } else { this.x = x; }
	if ( y === undefined ) { this.y = 0; } else { this.y = y; }
	if ( width === undefined ) { this.width = 0; } else { this.width = width; }
	if ( height === undefined ) { this.height = 0; } else { this.height = height; }

    this.init();

    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);

	// ---------------------------------------------------------------------
	// setUrl: set the url of the image being drawn to this sprite
    this.setUrl = function(url) {
        this.plugin.setUrl(this.getId(), url);
    };
}

function Layer(plugin, x, y, width, height) {
    this.plugin = plugin;
    this.id = plugin.newLayer();
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);
}

function Scene(passPlugin, passStep) {
    this.plugin = passPlugin;
    this.strInstruction = "";

	// Default initQuiz callback to be replaced by the developer
    this.initQuiz = function() {
    		logDebug("initQuiz() default callback");
    	};

    // Default loadQuiz callback to be replaced by the developer
    this.loadQuiz = function() {
    		logDebug("loadQuiz() default callback");
    	};

    // Default checkAnswer callback to be replaced by the developer
    this.checkAnswer = function() {
    		logDebug("checkAnswer() default callback");
    		return true;
    	};

    // Default resetQuiz callback to be replaced by the developer
    this.resetQuiz = function() {
    		logDebug("resetQuiz() default callback");
    		this.loadQuiz();
    	};

    // Default showCorrectAnswer callback to be replaced by the developer
    this.showCorrectAnswer = function() {
    		logDebug("showCorrectAnswer() default callback");
    	};

    // Default cleanUp callback to be replaced by the developer
    this.cleanUp = function() {
    		logDebug("cleanUp() default callback");
    	};

    // Question status flags
    this.tries = 3;
    this.correct = false;
    this.completed = false;
    this.serverStatus = false;
    this.id = this.plugin.newScene();

    this.bgLayer = new Layer(this.plugin, 0, 0, 480, 320);
    this.bgLayer.setColor(0, 0, 0, 0);

    this.addScene = function() {
        this.plugin.addScene(this.id);
    };

    this.nextScene = function() {
        this.plugin.nextScene();
    };

    this.prevScene = function() {
        this.plugin.prevScene();
    };

    this.setScene = function() {
        this.plugin.setScene(this.getId());
    };

    this.setTries = function(tries) {
        if(typeof tries !== "number") {
            return;
        }
        this.tries = tries;
    };

    this.decrementTries = function() {
        if(!(this.tries === 0)) {
            this.tries = this.tries - 1;
        }
    };

    this.getTries = function() { return this.tries; };

    this.setCorrect = function(correct) {
        if(typeof correct !== "boolean") {
            logError("correct must have a value of type 'boolean'");
            return;
        }
        this.correct = correct;
        this.completed = true;
    };

    this.getCorrect = function() { return this.correct; };

    this.setCompleted = function(completed) {
        if(typeof completed !== "boolean") {
            logError("completed must have a value of type 'boolean'");
            return;
        }
        this.completed = completed;
    };

    this.getCompleted = function() { return this.completed; };

    this.setServerStatus = function(serverStatus) {
        if(typeof serverStatus !== "boolean") {
            logError("serverStatus must have a value of type 'boolean'");
            return;
        }
        this.serverStatus = serverStatus;
    };

    this.getServerStatus = function() { return this.serverStatus; };
}

function BaseLabel() {
    this.setText = function(text) {
        if(typeof text == "string") {
            this.text = text;
        } else {
            var str = "";
            for (el in text) {
                str = str + text[el];
            }
            this.text = str;
        }
        this.plugin.captionIs(this.id, this.text);
    };

    this.setCaptionColor = function(r, g, b, a) {
        this.plugin.captionColorIs(this.id, r, g, b, a);
    };

    this.setWrap = function(wrap) {
        if (typeof wrap != "boolean") {
            // error...
            return;
        }

        this.plugin.wrapText(this.id, wrap);
    };

    this.addKeyListener = function() {
        this.plugin.addKeyListener(this.id);
    };

    this.setBold = function(bold) {
        if (typeof bold != "boolean") {
            return;
        }

        this.plugin.setBold(this.id, bold);
    };

    this.setItalic = function(italic) {
        if (typeof italic != "boolean") {
            return;
        }

        this.plugin.setItalic(this.id, italic);
    };

    this.setAnchor = function(anchor) {
        if (typeof anchor !== "string") {
            return;
        }

        this.plugin.setAnchor(this.id, anchor);
    };
}

function Label(plugin, text, size, x, y, width, height) {
    this.plugin = plugin;
    this.id = this.plugin.newLabel(text, size);
    this.text = text;
	this.pntOffset = new Point();

    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);
}

function TextBox(plugin, text, size, x, y, width, height) {
    this.plugin = plugin;
    this.id = plugin.newTextBox(text, size);
    this.text = text;
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.bind("text_changed", { "obj" : this, "func" : "updateText" });
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);
    this.addKeyListener(this.getId());

    this.updateText = function(text) {
        logDebug("UPDATED: " + text);
        this.text = text;
    };

    this.addEnterCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("enter_pressed", { "obj" : obj, "func" : func });
    };

    this.addFocusChangedCallback = function(obj, func) {
        if(typeof obj != "object") {
            return;
        }
        this.bind("focus_changed", { "obj" : obj, "func" : func });
    };

    this.setInteraction = function(interaction) {
        if(typeof interaction != "boolean") {
            return;
        }
        this.plugin.setTextBoxInteraction(this.getId(), interaction);
    };

    this.getText = function() {
        return this.text;
    };
}

function Button(plugin, type, x, y, width, height) {
    // Initialize everything
    this.plugin = plugin;
    this.type = type;
    this.id = plugin.newButton(type);
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);

    this.setActive = function(active) {
        if(typeof active != "boolean") {
            return;
        }
        this.plugin.setButtonActive(this.getId(), active);

        // Restore the button's subscribed/unsubscribed state
        if(active === true) {
            this.subscribe();
        } else if (active === false) {
            this.unsubscribe();
        }
    };
}

function Primitive(plugin, shape, x, y, width, height) {
    // Initialize everything
    this.plugin = plugin;
    if(typeof shape != "string") {
        // TODO: Error
        return;
    }

    this.id = plugin.newPrimitive(shape);
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);

    this.setPoints = function(x1, y1, x2, y2) {
        this.setPosition(x1, y1);
        this.setDimensions(x2, y2);
    };

    this.setCornerRadius = function(radius) {
        this.plugin.setRectangleCornerRadius(this.getId(), radius);
    };

    this.setBorderWidth = function(width) {
        this.plugin.setBorderWidth(this.getId(), width);
    };

    this.setBorderColor = function(r, g, b, a) {
        this.plugin.setBorderColor(this.getId(), r, g, b, a);
    };
}

function Line(plugin, x, y, width, height) {
    // Initialize everything
    this.plugin = plugin;
    this.id = plugin.newPrimitive("line");
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);

    this.setThickness = function(radius) {
        this.plugin.setLineThickness(this.id, radius);
    };
}

function ScrollBar(plugin, x, y, width, height) {
    this.plugin = plugin;
    this.id = plugin.newScrollBar();
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);
}

function DropDown(plugin, x, y, width, height) {
    this.plugin = plugin;
    this.id = plugin.newDropDown();
    this.text = "";
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }
    this.init();
    this.bind("text_changed", { "obj" : this, "func" : "updateText" });
    this.plugin.positionIs(this.id, this.x, this.y, this.width, this.height);

	this.updateText = function(text) {
        logDebug("UPDATED: " + text);
        this.text = text;
    };

    this.addOption = function(option) {
        if(typeof option != "string") {
            //TODO: error
            return;
        }
        if (this.text === "") {
            this.text = option;
        }
        this.plugin.addOptionToDropDown(this.id, option);
    };

    this.addChangedCallback = function(obj, callback) {
        this.bind("drop_down_changed", { "obj" : obj, "func" : callback });
    };

    this.removeChangedCallback = function(obj, callback) {
        this.plugin.removeDropDownCallback(this.getId(), obj, callback);
    };

    this.removeAllCallbacks = function() {
        this.plugin.removeAllDropDownCallbacks(this.getId());
    };

    this.setDefaultOption = function(option) {
        if(typeof option != "string") {
            return;
        }
        this.plugin.setDefaultDropDownOption(this.getId(), option);
    };

    this.getText = function() {
        return this.text;
    };

    this.setText = function(text) {
        return this.plugin.setDropDownText(this.getId(), text);
    };

    this.setColor = function(r, g, b, a) {
        this.plugin.colorIs(this.getId(), r, g, b, a);
    };

    this.setTextColor = function(r, g, b, a) {
        this.plugin.setDropDownTextColor(this.getId(), r, g, b, a);
    };
}

function Bezier(plugin, points) {
    this.plugin = plugin;
    this.id = plugin.newBezier();

    // Set the points of the Bezier (in a flat array)
    // Example: var points = new Array(x1, y1, x2, y2, x3, y3, ...);
    this.setPoints = function(points) {
        if(points.constructor.toString().indexOf("Array") != -1) { // Object is an array
            this.plugin.setBezierPoints(this.getId(), points);
        } else {
            return;
        }
    };
    this.setPoints(points);

    this.setThickness = function(thickness) {
        if(typeof thickness == "number") {
            this.plugin.setBezierThickness(thickness);
        } else {
            return;
        }
    };
}

function Checkbox(plugin, txt, x, y, width, height) {
    this.plugin = plugin;

    if(!txt) { this.txt = "Checkbox"; } else { this.txt = txt; }
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }

	// This boolean flag is the status of the check box
	this.selected = false;

	// Create a background label to add all the sprites and callbacks to
   	this.lblBG = new Label(this.plugin, "", 1, this.x, this.y, this.width, this.height);
	this.lblBG.downCallback(this, "mouseClick");
   	this.lblBG.setColor(0.0, 0.0, 0.0, 0.0);
    this.lblBG.setCaptionColor(0.0, 0.0, 0.0, 1.0);
	this.lblBG.subscribe();

    // Set this object ID to be the same as the background label ID
   	this.id = this.lblBG.getId();

	// Create the empty checkbox sprite
	// TODO Remove the http:// when the plugin has the images internally
   	this.sprBox = new Sprite(this.plugin, "checkbox.png", this.x, this.y, this.height, this.height);

	// Create the checkmark sprite and make invisible
   	this.sprCheck = new Sprite(this.plugin, "check.png", this.x, this.y, this.height, this.height);
   	this.sprCheck.setVisibility(false);

	// Figure out the y offset based on the height
	var txtY = this.y;
	if(this.height > 16) txtY = this.y - (this.height * this.height * 0.005);


	// Create the label which display the checkbox's text
   	this.lblTxt = new Label(this.plugin, this.txt, this.height, this.x + (this.height * 0.8), txtY, this.width - this.height, this.height);
	this.lblTxt.setColor(0.0, 0.0, 0.0, 0.0);
    this.lblTxt.setCaptionColor(0.0, 0.0, 0.0, 1.0);

	// Add everything to the background label
   	this.lblBG.addChild(this.sprBox);
   	this.lblBG.addChild(this.sprCheck);
   	this.lblBG.addChild(this.lblTxt);

	// if the user clicks on the check boxes toggle selected flag
	this.mouseClick = function(x,y) {
		this.selected = !this.selected;
		this.sprCheck.setVisibility(this.selected);
	};

	// Set the selected flag and checkmark visibility
	this.setSelected = function(bool) {
		this.selected = bool;
		this.sprCheck.setVisibility(this.selected);
	};

	// Get the selected flag
	this.getSelected = function() {
		return this.selected;
	};

	// Get text from the text label
    this.getText = function() {
    		this.txt = this.lblTxt.getText();
        return this.txt;
    };

	// Set the text of the text label
    this.setText = function(text) {
  		this.txt = text;
        return this.lblTxt.setText(this.txt);
    };
}

var arrRadioList = new Array();
function RadioButton(plugin, txt, group, x, y, width, height) {
	this.plugin = plugin;

	// Add the radio button to the global list
    arrRadioList.push(this);

    if(!txt) { this.txt = "RadioButton"; } else { this.txt = txt; }
    if(!group) { this.group = "default"; } else { this.group = group; }
    if(!x) { this.x = 0; } else { this.x = x; }
    if(!y) { this.y = 0; } else { this.y = y; }
    if(!width) { this.width = 0; } else { this.width = width; }
    if(!height) { this.height = 0; } else { this.height = height; }

	// This boolean flag is the status of the check box
	this.selected = false;

	// Create a background label to add all the sprites and callbacks to
   	this.lblBG = new Label(this.plugin, "", 1, this.x, this.y, this.width, this.height);
	this.lblBG.downCallback(this, "mouseClick");
   	this.lblBG.setColor(0.0, 0.0, 0.0, 0.0);
    this.lblBG.setCaptionColor(0.0, 0.0, 0.0, 1.0);
	this.lblBG.subscribe();

    // Set this object ID to be the same as the background label ID
   	this.id = this.lblBG.getId();

	// Create the empty checkbox sprite
	// TODO Remove the http:// when the plugin has the images internally
   	this.sprOff = new Sprite(this.plugin, "radioOff.png", this.x, this.y, this.height, this.height);

	// Create the checkmark sprite and make invisible
   	this.sprOn = new Sprite(this.plugin, "radioOn.png", this.x, this.y, this.height, this.height);
   	this.sprOn.setVisibility(false);

	// Figure out the y offset based on the height
	var txtY = this.y;
	if(this.height > 16) txtY = this.y - (this.height * this.height * 0.005);

	// Create the label which display the checkbox's text
   	this.lblTxt = new Label(this.plugin, this.txt, this.height, this.x + (this.height * 0.8), txtY, this.width - this.height, this.height);
	this.lblTxt.setColor(0.0, 0.0, 0.0, 0.0);
    this.lblTxt.setCaptionColor(0.0, 0.0, 0.0, 1.0);

	// Add everything to the background label
   	this.lblBG.addChild(this.sprOff);
   	this.lblBG.addChild(this.sprOn);
   	this.lblBG.addChild(this.lblTxt);

	// if the user clicks on the check boxes toggle selected flag
	this.mouseClick = function(x,y) {
		this.setSelected(true);
	};

	// Set the selected flag and checkmark visibility
	this.setSelected = function(bool) {
		if(bool) {
			for(var i = 0; i < arrRadioList.length; i++) {
				if(arrRadioList[i].group === this.group) {
					arrRadioList[i].selected = false;
					arrRadioList[i].sprOn.setVisibility(false);
					arrRadioList[i].sprOff.setVisibility(true);
				}
			}
		}

		this.selected = bool;
		this.sprOn.setVisibility(this.selected);
		this.sprOff.setVisibility(!this.selected);
	};

	// Get the selected flag
	this.getSelected = function() {
		return this.selected;
	};

	// Get text from the text label
    this.getText = function() {
    		this.txt = this.lblTxt.getText();
        return this.txt;
    };

	// Set the text of the text label
    this.setText = function(text) {
  		this.txt = text;
        return this.lblTxt.setText(this.txt);
    };
}

// ---------------------------------------------------------------------
// Physics wrapper functions
function Physics(plugin) {
	this.plugin = plugin;

	this.setEnvironment = function(command) {
   		this.plugin.setEnvironment(command);
   	};

   	this.addPhysics = function(node, command)  {
   		this.plugin.addPhysics(node.id, command);
   	};

	this.addSegment = function(name, x1, y1, x2, y2) {
   		this.plugin.addSegment(name, x1, y1, x2, y2);
   	};

   	this.addJoint = function(parent, child, command) {
		if( parent === "NULL" && child === "NULL") {
			return;
   		} else if(parent === "NULL") {
   			this.plugin.addJoint(parent, child.id, command);
   		} else if(child === "NULL") {
   			this.plugin.addJoint(parent.id, child, command);
   		} else {
   			this.plugin.addJoint(parent.id, child.id, command);
   		}
   	};

   	this.addCollision = function(nodeA, nodeB, object, callback) {
        // Bind this callback
        nodeA.bind("physics_collision", { "node" : nodeB.id, "obj" : object, "func" : callback});
        // Listen for physics collision events
        nodeA.listen("physics_collision");
        // Let the physics engine know that we are interested in these events
   		this.plugin.addCollision(nodeA.id, nodeB.id);
   	};

   	this.applyForce = function(node, fX, fY, vX, vY) {
   		this.plugin.addSegment(node.id, fX, fY, vX, vY);
   	};

   	this.removePhysics = function(node) {
   		this.plugin.removePhysics(node.id);
   	};

	this.removeSegment = function(name) {
   		this.plugin.removeSegment(name);
   	};

   	this.removeJoint = function(parent, child) {
   		if( parent === "NULL" && child === "NULL") {
			return;
   		} else if(parent === "NULL") {
   			this.plugin.removeJoint(parent, child.id);
   		} else if(child === "NULL") {
   			this.plugin.removeJoint(parent.id, child);
   		} else {
   			this.plugin.removeJoint(parent.id, child.id);
   		}
   	};

   	this.removeCollision = function(nodeA, nodeB) {
   		this.plugin.removeCollision(nodeA.id, nodeB.id);
   	};

   	this.removeAllPhysics = function() {
   		this.plugin.removeAllPhysics();
   	};
}

// ---------------------------------------------------------------------
// Tweener wrapper functions
function Tweener(plugin) {
	this.plugin = plugin;

	this.addTween = function(node, command, obj, callback) {
   		var tween_id = this.plugin.addTween(node.id, command);
        node.bind("tween_finished", { "tween_id" : tween_id, "obj" : obj, "func" : callback });
   	};

   	this.removeTween = function(node) {
   		this.plugin.removeTween(node.id);
   	};

	this.pauseTween = function(node) {
   		this.plugin.pauseTween(node.id);
   	};

   	this.resumeTween = function(node) {
   		this.plugin.resumeTween(node.id);
   	};

   	this.removeAllTweens = function() {
   		this.plugin.removeAllTweens();
   	};

	this.pauseAllTweens = function() {
   		this.plugin.pauseAllTweens();
   	};

   	this.resumeAllTweens = function() {
   		this.plugin.resumeAllTweens();
   	};
}

BaseSprite.prototype = new Osmosis();
Sprite.prototype = new BaseSprite();
BaseLabel.prototype = new Osmosis();
Label.prototype = new BaseLabel();
Primitive.prototype = new Osmosis();
Layer.prototype = new Osmosis();
Scene.prototype = new Osmosis();
DropDown.prototype = new Osmosis();
ScrollBar.prototype = new Osmosis();
Button.prototype = new BaseSprite();
TextBox.prototype = new BaseLabel();
Bezier.prototype = new Osmosis();
Checkbox.prototype = new Osmosis();
RadioButton.prototype = new Osmosis();
Line.prototype = new Osmosis();
function bar_graph(plugin, scene,x, y, width, height,startingX,endingX,startingY,endingY)
{
    this.plugin = plugin;
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.points = [];
    this.startingX = startingX;
    this.endingX = endingX;
    this.startingY = startingY;
    this.endingY = endingY;
    this.rectangles = [];
    this.bottomLine;
    this.leftLine;
    this.labels = new Array();
    this.visible = true;
    this.layer = new Layer(this.plugin,0, 0,480,320);
    this.scene.bgLayer.addChild(this.layer);
    this.layer.setColor(1,1,1,0);
      this.build = function()
      {
           this.buildAxis();
           this.plot();
      };

      this.buildAxis = function()
      {
          this.bottomLine = new Primitive(this.plugin,"line");
          this.bottomLine.setPoints(x,y,x+width,y);
          this.leftLine = new Primitive(this.plugin,"line");
          this.leftLine.setPoints(x,y,x,y+height);
          this.scene.bgLayer.addChild(this.bottomLine);
          this.scene.bgLayer.addChild(this.leftLine);
      };

      this.setLabels = function(hlabels, hunit, hdimension,vlabels,vunit,vdimension)
      {
      		var label;
            for(var i = 0; i < hlabels.length; i++)
            {
                 if(hlabels.length == 1) {
                     label = new Label (this.plugin, hlabels[i], 1, this.x+ hunit*(i+1), this.y-hdimension[1], hdimension[0], hdimension[1]);
                 } else {
                     label = new Label (this.plugin, hlabels[i], 1, this.x+ hunit*i, this.y-hdimension[1], hdimension[0], hdimension[1]);
                 }

                 label.setColor(1,1,0,0);
                 label.setCaptionColor(0,0,0,1);
                 this.scene.bgLayer.addChild(label);
                 this.labels.push(label);
            }

            for(var j = 0; j < vlabels.length; j++)
            {
                 label = new Label (this.plugin, vlabels[j], 1, this.x - vdimension[0], this.y+ vunit*j, vdimension[0], vdimension[1]);
                 label.setColor(1,1,0,0);
                 label.setCaptionColor(0,0,0,1);
                 this.scene.bgLayer.addChild(label);
                 this.labels.push(label);
            }
      };

      this.add = function(localX,localY) {
          var stageX = this.x + this.width/(this.endingX - this.startingX)*(localX- this.startingX);
          var stageY = this.y + this.height/(this.endingY - this.startingY)*(localY - this.startingY);
          this.points.push([stageX,stageY]);
      };

      this.update = function(index,localX,localY) {
          var stageX = this.x + this.width/(this.endingX - this.startingX)*(localX- this.startingX);
          var stageY = this.y + this.height/(this.endingY - this.startingY)*(localY - this.startingY);
          this.points[index][0] = stageX;
          this.points[index][1] = stageY;
      };

      this.plot = function() {
          this.rectangles = new Array();
          this.rectangles = [];

          if(this.points.length === 0)
          return;

          for(var i = 0; i < this.points.length; i++)
          {
               var halfwidth = width/(this.endingX - this.startingX)*1/3;
               var rectangle = new Layer(this.plugin,this.points[i][0]-halfwidth, this.y , halfwidth*2,this.points[i][1] - this.y);
               this.rectangles.push(rectangle);
          }

          for(i = 0; i < this.rectangles.length; i++)
          {
              //this.scene.bgLayer.addChild(this.rectangles[i]);
              this.layer.addChild(this.rectangles[i]);
          }
      };


      this.clear = function()
      {
          for(var i = 0; i < this.rectangles.length; i++) {
              //this.scene.bgLayer.removeChild(this.rectangles[i]);
              this.layer.removeChild(this.rectangles[i]);
          }
      };

      this.setVisible = function(flag)
      {
           var i = 0;
           var j = 0;

           if(!flag) {
               this.bottomLine.setVisibility(false);
               this.leftLine.setVisibility(false);

               for(i = 0; i <this.labels.length; i++) {
                   this.labels[i].setVisibility(false);
               }
               for(j = 0; j < this.rectangles.length; j++) {
                  // this.scene.bgLayer.removeChild(this.rectangles[j]);
                  this.layer.removeChild(this.rectangles[j]);
               }
               this.visible = false;
           } else {
               this.bottomLine.setVisibility(true);
               this.leftLine.setVisibility(true);

               for(i = 0; i <this.labels.length; i++) {
                   this.labels[i].setVisibility(true);
               }
               for(j = 0; j < this.rectangles.length; j++) {
                  // this.scene.bgLayer.addChild(this.rectangles[j]);
                  this.layer.removeChild(this.rectangles[j]);
               }
               this.visible = true;
           }
      };
}
function circleVector(passRadial, passTheta)

{

    this.radial=passRadial;

	this.theta=passTheta;



	this.setVector = function(passRadial, passTheta)

	{

		this.radial = passRadial;

		this.theta = passTheta;

		this.checkAngles();

	};



	this.clone = function()

	{

		var ret= new circleVector();



		ret.setVector(this.radial, this.theta);



		return ret;

	};



	this.addTheta = function(passTheta)

	{

		this.theta += passTheta;

		this.checkAngles();

	};



	this.checkAngles = function()

	{

		while(this.theta < 0 || this.theta >= 360)

		{

			if(this.theta < 0) this.theta += 360;

			if(this.theta >= 360) this.theta -= 360;

		}

	};



	this.getPolar = function(startPoint, endPoint)

	{

		var ret= -1;

		var x = startPoint.x - endPoint.x;

		var y = (320- startPoint.y) - (320 - endPoint.y);



		// Get length

		radial = distancePoints(startPoint,endPoint);



		// do special cases first of 0, 90, 180, 270 angles

		if (startPoint.x == endPoint.x && startPoint.y == endPoint.y) ret = 0;



		if (startPoint.x == endPoint.x && startPoint.y < endPoint.y)  ret = 90;

		if (startPoint.x == endPoint.x && startPoint.y > endPoint.y)  ret = 270;



		if (startPoint.y == endPoint.y && startPoint.x > endPoint.x)  ret = 180;

		if (startPoint.y == endPoint.y && startPoint.x < endPoint.x)  ret = 0;



		// Check if we already have answer

		if(ret != -1)

		{

			this.theta = ret;

			return ret;

		}



		// test which side we are on

		if(x < 0  && y < 0)

			ret = Math.atan(y/x) * (180 / Math.PI);

		else if (x < 0 && y > 0)

			ret = 360 + Math.atan(y/x) * (180 / Math.PI);

		else

			ret = 180 + (Math.atan(y/x) * (180 / Math.PI));



		this.theta = ret;

		return ret;

	};



	if(passRadial===undefined) {

		passRadial=0;

	}

	if(passTheta===undefined) {

		passTheta=0;

	}



	this.setVector(passRadial, passTheta);

}

/*
*	line_graph.js : line graph Library for the THP.
*
*	Author: Ryan
*	Date: July 28 '10
*	About:  This library allows for creation of line graph based on points user puts in.
*			This library requires Osmosis and THP_Template to function.
*/

function line_graph(plugin, scene ,x, y, width, height,startingX,endingX,startingY,endingY)
{
      this.plugin = plugin;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.scene = scene;
      this.points = [];
      this.lines = [];
      this.startingX = startingX;
      this.endingX = endingX;
      this.startingY = startingY;
      this.endingY = endingY;
      this.dots = new Array();
      //build the graph
      this.build = function()
      {
           this.buildAxis();
           this.plot();
      };

      //programmably draws the axis
      this.buildAxis = function()
      {
          var bottomLine = new Primitive(this.plugin,"line");
          bottomLine.setPoints(x,y,x+width,y);
          var leftLine = new Primitive(this.plugin,"line");
          leftLine.setPoints(x,y,x,y+height);
          this.scene.addChild(bottomLine);
          this.scene.addChild(leftLine);
      };

      //add point to points array
      this.add = function(localX,localY)
      {
          var stageX = this.x + this.width/(this.endingX - this.startingX)*(localX- this.startingX);
          var stageY = this.y + this.height/(this.endingY - this.startingY)*(localY - this.startingY);
          var dot = new Layer(this.plugin,stageX,stageY,5,5);
          this.points.push([stageX,stageY]);
          this.scene.addChild(dot);
          this.dots.push(dot);
      };

      //connect the points added to points array
      this.plot = function()
      {
          this.lines = new Array();
          this.lines = [];

          if(this.points.length === 0)
          return;

          for(var i = 0; i < this.points.length; i++)
          {
               var line = new Primitive(this.plugin,"line");

               if( i === this.points.length -1) {
                   break;
               }

               line.setPoints(this.points[i][0],this.points[i][1],this.points[i+1][0],this.points[i+1][1]);
               this.lines.push(line);

          }

          for(i = 0; i < this.lines.length; i++)
          {
              this.scene.addChild(this.lines[i]);
          }

          /*for(var i = 0; i < this.dots.length; i++)
          {
              this.scene.addChild(this.dots[i]);
          }*/

      };

      this.clearDots = function()
      {
          for(var i = 0; i < this.dots.length; i++)
          {
              this.scene.removeChild(this.dots[i]);
          }
          this.dots = new Array();
          this.points = new Array();
      };

      this.clear = function()
      {
          for(var i = 0; i < this.lines.length; i++)
          {
              this.scene.removeChild(this.lines[i]);
          }
          this.lines = new Array();

      };

      //update point
      this.update = function(index,localX,localY)
      {
            var stageX = this.x + this.width/(this.endingX - this.startingX)*(localX- this.startingX);
            var stageY = this.y + this.height/(this.endingY - this.startingY)*(localY - this.startingY);
            this.points[index][0] = stageX;
            this.points[index][1] = stageY;
            this.scene.removeChild(this.dots[index]);
            this.dots[index] = new Layer(this.plugin,stageX,stageY,5,5);
            this.scene.addChild(this.dots[index]);
      };

      //set axis labels
      this.setLabels = function(hlabels, hunit, hdimension,vlabels,vunit,vdimension)
      {
			var label;
            for(var i = 0; i < hlabels.length; i++)
            {
                 label = new Label (this.plugin, hlabels[i], 1, this.x+ hunit*i, this.y-hdimension[1], hdimension[0], hdimension[1]);
                 label.setColor(1,1,0,0);
                 label.setCaptionColor(0,0,0,1);
                 this.scene.addChild(label);
            }

            for(var j = 0; j < vlabels.length; j++)
            {
                 label = new Label (this.plugin, vlabels[j], 1, this.x - vdimension[0], this.y+ vunit*j, vdimension[0], vdimension[1]);
                 label.setColor(1,1,0,0);
                 label.setCaptionColor(0,0,0,1);
                 this.scene.addChild(label);
            }
      };

      //gives the option to import axis image
      this.importAxis = function(url)
      {
           var sprite = new Sprite();
           this.scene.addChild(label);
      };
}

//line_graph.prototype = new Osmosis();



// ---------------------------------------------------------------------

// The mouse object

// Author: Ethan Greavette

// Date: 7/15/2010

// Comments:  Handles it's own event and updates its members based on

//			  safe javascript events.

// ---------------------------------------------------------------------



// ---------------------------------------------------------------------

// Mouser capture mouse events and records them in a easy to find spot

function Mouser( plugin ) {



	this.p = plugin;

	this.funcCallback = function() {};



	// Mouser members

	this.mouseX = 0;

	this.mouseY = 0;

	this.boolMouse = false;

	this.boolOnPlugin = false;



	// ---------------------------------------------------------------------

	// Sets the funcCallback function for updating

	this.setCallback = function( passCallback ) {

		this.funcCallback = passCallback;

	};



	// ---------------------------------------------------------------------

	// Capture the pMouseMove event

	this.pMouseMove= function( x, y ) {

		this.mouseX = x;

		this.mouseY = y;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// ---------------------------------------------------------------------

	// Capture the pMouseDown event

	this.pMouseDown = function( x, y ) {

		this.boolMouse = true;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// ---------------------------------------------------------------------

	// Capture the pMouseUp event

	this.pMouseUp = function( x, y ) {

		this.boolMouse = false;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// ---------------------------------------------------------------------

	// Capture the onMouseDown event

	this.mouseDown = function( event ) {

		if(typeof this.p.captionIs === "undefined") {

			logDebug("Mouse down global call (you shouldn't see this)");

			return;

		}

		this.boolMouse = true;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// ---------------------------------------------------------------------

	// Capture the onMouseUp event

	this.mouseUp = function(event) {

		if(typeof this.p.captionIs === "undefined") {

			logDebug("Mouse up global call (you shouldn't see this)");

			return;

		}

		this.boolMouse = false;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// ---------------------------------------------------------------------

	// Capture the mouseOver event

	this.mouseOver = function(event) {

		this.boolOnPlugin = true;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// ---------------------------------------------------------------------

	// Capture the mouseOut event

	this.mouseOut = function(event) {

		this.boolOnPlugin = false;

		if(typeof this.funcCallback !== "undefined"){ this.funcCallback();}

	};



	// Setup event listeners on the document

	var thisObject = this;

	//document.onmousedown = function(){thisObject.mouseDown();};

	//document.onmouseup = function(){thisObject.mouseUp();};

	//this.p.onmouseover = function(){thisObject.mouseOver();};

	//this.p.onmouseout = function(){thisObject.mouseOut();};



	// Set up mouse layer.

    this.mouseSprite = new Sprite(this.p, "", 0, 0, this.p.width, this.p.height);

    //this.mouseSprite.setVisibility(false);

    //this.mouseSprite.downCallback(this, "pMouseDown");

	//this.mouseSprite.upCallback(this, "pMouseUp");

	//this.mouseSprite.moveCallback(this, "pMouseMove");

	//this.mouseSprite.subscribe();

}

// ---------------------------------------------------------------------

// multidim_array.js

// Date: 7/15/2010

// Comments: This appends some useful funcstions on Array

// Source: The two functions were taken from the book titled

//			 "JavaScript - The Good Parts, Chapter 6.7"

// ---------------------------------------------------------------------



// ---------------------------------------------------------------------

// Tests if an object is an array and returns true if it is

var is_array = function (value) {

    return value &&

        typeof value === 'object' &&

        typeof value.length === 'number' &&

        typeof value.splice === 'function' &&

        !(value.propertyIsEnumerable('length'));

};



// ---------------------------------------------------------------------

// Fill an array with initial

Array.dim = function (dimension, initial) {

    var a = [], i;

    for (i = 0; i < dimension; i += 1) {

        a[i] = initial;

    }

    return a;

};



// ---------------------------------------------------------------------

// Create a matrix and fill it with the initial value

Array.matrix = function (m, n, initial) {

    var a, i, j, mat = [];

    for (i = 0; i < m; i += 1) {

        a = [];

        for (j = 0; j < n; j += 1) {

            a[j] = initial;

        }

        mat[i] = a;

    }

    return mat;

};



// ---------------------------------------------------------------------

// point.js

// Author: Ethan Greavette

// Date: 7/07/2010

// Comments: Contain a x,y point location

// ---------------------------------------------------------------------



// ---------------------------------------------------------------------

// Point: The main object of the plugin

function Point(passX, passY)

{

	// Optional parameter x, y default to 0

	if ( passX === undefined ) { this.x = 0; } else { this.x = passX; }

	if ( passY === undefined ) { this.y = 0; } else { this.y = passY; }



	//This function checks if another point is equal to "this" one.

	this.equals = function(comparedPoint)

	{

		this.comparedPoint=comparedPoint;



		if(this.y===this.comparedPoint.y && this.x===this.comparedPoint.x)

		{

			return true;

		}

		else

		{

			return false;

		}

	};

	this.clone = function()

	{

		var tempX = this.x;

		var tempY = this.y;

		var tempPoint = new Point(this.x,this.y);



		return tempPoint;

	};

	this.normalize = function()

	{

		var length = Math.sqrt ( this.x*this.x + this.y*this.y );

		this.x=this.x/length;

		this.y=this.y/length;

	};

	this.offset = function(pass_dx,pass_dy)

	{

		var dx;

		var dy;

		if ( pass_dx === undefined ) { dx = 0; } else { dx = pass_dx; }

		if ( pass_dy === undefined ) { dy = 0; } else { dy = pass_dy; }

		this.x+=dx;

		this.y+=dy;

	};

	this.toString = function()

	{

		var pointString =("(x=" + this.x + ", y=" + this.y + ")");

		return pointString;

	};

}

function interpolatePoints(point1,point2,f)

{

	var interpolatedPoint=new Point();

	var deltaX= point2.x-point1.x;

	var deltaY= point2.y-point1.y;



	interpolatedPoint.x=point2.x-deltaX*f;

	interpolatedPoint.y=point2.y-deltaY*f;



	return interpolatedPoint;

}



function distancePoints(point1,point2)

{

	var thisDistance;

	var deltaX=point2.x-point1.x;

	var deltaY=point2.y-point1.y;



	thisDistance=Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2));

	return thisDistance;

}





// If no jQuery then don't load server code
/*****************
	math.uuid
	****************/
	/*!
	Math.uuid.js (v1.4)
	http://www.broofa.com
	mailto:robert@broofa.com

	Copyright (c) 2010 Robert Kieffer
	Dual licensed under the MIT and GPL licenses.
	*/

	/*
	 * Generate a random uuid.
	 *
	 * USAGE: Math.uuid(length, radix)
	 *   length - the desired number of characters
	 *   radix  - the number of allowable values for each character.
	 *
	 * EXAMPLES:
	 *   // No arguments  - returns RFC4122, version 4 ID
	 *   >>> Math.uuid()
	 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
	 *
	 *   // One argument - returns ID of the specified length
	 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
	 *   "VcydxgltxrVZSTV"
	 *
	 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
	 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
	 *   "01001010"
	 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
	 *   "47473046"
	 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
	 *   "098F4D35"
	 */
	(function() {
	  // Private array of chars to use
	  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

	  Math.uuid = function (len, radix) {
	    var chars = CHARS, uuid = [];
	    radix = radix || chars.length;

	    if (len) {
	      // Compact form
	      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	    } else {
	      // rfc4122, version 4 form
	      var r;

	      // rfc4122 requires these characters
	      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	      uuid[14] = '4';

	      // Fill in random data.  At i==19 set the high bits of clock sequence as
	      // per rfc4122, sec. 4.1.5
	      for (i = 0; i < 36; i++) {
	        if (!uuid[i]) {
	          r = 0 | Math.random()*16;
	          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	        }
	      }
	    }

	    return uuid.join('');
	  };

	  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
	  // by minimizing calls to random()
	  Math.uuidFast = function() {
	    var chars = CHARS, uuid = new Array(36), rnd=0, r;
	    for (var i = 0; i < 36; i++) {
	      if (i==8 || i==13 ||  i==18 || i==23) {
	        uuid[i] = '-';
	      } else if (i==14) {
	        uuid[i] = '4';
	      } else {
	        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
	        r = rnd & 0xf;
	        rnd = rnd >> 4;
	        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	      }
	    }
	    return uuid.join('');
	  };

	  // A more compact, but less performant, RFC4122v4 solution:
	  Math.uuidCompact = function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	      return v.toString(16);
	    }).toUpperCase();
	  };
	})();

if(typeof jQuery !== "undefined") {
	/*************************
	jquery-json
	*************************/

	(function($){$.toJSON=function(o)
	{var type;
	if(typeof(JSON)=='object'&&JSON.stringify)
	return JSON.stringify(o);type=typeof(o);if(o===null)
	return"null";if(type=="undefined")
	return undefined;if(type=="number"||type=="boolean")
	return o+"";if(type=="string")
	return $.quoteString(o);if(type=='object')
	{if(typeof o.toJSON=="function")
	return $.toJSON(o.toJSON());if(o.constructor===Date)
	{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
	hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
	if(o.constructor===Array)
	{var ret=[];for(var i=0;i<o.length;i++)
	ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
	var pairs=[];for(var k in o){var name;type=typeof k;if(type=="number")
	name='"'+k+'"';else if(type=="string")
	name=$.quoteString(k);else
	continue;if(typeof o[k]=="function")
	continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
	return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
	{if(typeof(JSON)=='object'&&JSON.parse)
	return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
	{if(typeof(JSON)=='object'&&JSON.parse)
	return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
	return eval("("+src+")");else
	throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
	{if(string.match(_escapeable))
	{return'"'+string.replace(_escapeable,function(a)
	{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
	return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);

	/****************************
	JS Demo submission
	****************************/
	function submit_demo_quiz_answer(demo_name, quiz_name, is_correct, callback) {
	    var uuid = Math.uuid();
	    var timestamp = timestamp = (new Date()).getTime()/1000.0;
	    var publisherURL = "http://" + targetURL + "/epublisher/";
	    var data = [{
	        "module_id": "demo",
	        "command_id": "student_submit_demo_question_answer",
	        "command_uuid": uuid,
	        "timestamp": timestamp,
	        "data": "",
	        "args": {
	            "demo_name": demo_name,
	            "question_name": quiz_name,
	            "is_correct": is_correct
	        }
	    }];
	    data = $.toJSON(data);
	    $.ajax({
	        "url": publisherURL,
	        "type": "POST",
	        "data": { data: data },
	        "success": callback
    	});
	}
	function register_questions(demo_name, number_of_questions, question_names){
        if( typeof window.site_data !== "undefined" ) {
        		if( window.site_data.settings.THM_USER_ROLE  != "teacher" ) { return false; }

			var uuid = Math.uuid();
			var timestamp = timestamp = (new Date()).getTime()/1000.0;
			var publisherURL = "http://" + targetURL + "/epublisher/";
			var data = [{
			    "module_id": "demo",
			    "command_id": "add_demo_questions",
			    "command_uuid": uuid,
			    "timestamp": timestamp,
			    "data": "",
			    "args": {
			        "demo_target_id": demo_name,
			        "array_of_demo_question_names": question_names
			    }
			}];
			data = $.toJSON(data);
			$.ajax({
			    "url": publisherURL,
			    "type": "POST",
			    "data": { data: data }
			});
		}
		return true;
	}
}
// ---------------------------------------------------------------------

// rectangle.js

// Author: Ethan Greavette

// Date: 7/07/2010

// Comments: Contain a x, y, width and height box

// ---------------------------------------------------------------------



// ---------------------------------------------------------------------

// Rectangle: The main object of the plugin

function Rectangle(passX, passY, passW, passH) {



	// Optional parameter default to default to 0

	if ( passX === undefined ) { this.x = 0; } else {this.x = passX;}

	if ( passY === undefined ) { this.y = 0; } else {this.y = passY;}

	if ( passW === undefined ) { this.width = 0; } else {this.width = passW;}

	if ( passH === undefined ) { this.height = 0; } else {this.height = passH;}



	// Check if rectangles intersect. Return true or false

	this.intersects = function(Rectangle)

	{

	    if( ((this.x + this.width) < Rectangle.x) || ((Rectangle.x + Rectangle.width) < this.x) || ((this.y + this.height) < Rectangle.y) || ((Rectangle.y + Rectangle.height) < this.y)) {

		   return false;

		} else {

		   return true;

		}

	};

	this.containsPoint = function(passPoint)

	{

		var containerPoint = passPoint;



		if(passPoint.x >= this.x && passPoint.x <= (this.x + this.width) && passPoint.y >= this.y && passPoint.y <= (this.y + this.height)) {

			return true;

		} else {

			return false;

		}

	};

	this.containsRect = function(passRect)

	{

		var testRect = passRect;

		var point1 = new Array();

		var point2 = new Array();

		var counter = 0;

		point1.push(new Point(this.x,this.y));

		point1.push(new Point(this.x+this.width,this.y+this.height));



		point2.push(new Point(passRect.x,passRect.y));

		point2.push(new Point(passRect.x+passRect.width,passRect.y+passRect.height));



		for(var i = 0 ; i < point2.length ; i++)

		{

			if(point2[i].x >= point1[0].x && point2[i].x <= point1[1].x && point2[i].y >= point1[0].y && point2[i].y <= point1[1].y)

			{

				counter++;

			}

		}

		if(counter==2)

		{

			return true;

		}

		else

		{

			return false;

		}

	};

	this.clone = function()

	{

		var tempX = this.x;

		var tempY = this.y;

		var tempW = this.width;

		var tempH = this.height;



		var tempRect = new Rectangle(tempX,tempY,tempW,tempH);



		return tempRect;

	};

}


/*
*	THM_Calculator.js : Calculator Library for the THP.
*	Last Updated: August 27, 2010.
*
*	Authors: Ryan Cui, Paul Vilchez, Elwin Ha
*	Date: ?
*	About:  This library provides calculator functionality to THP demos.
*				This library requires Osmosis and THP_Template to function.
*/

var hackFunc; // global variable req'd

/*
*	Constructor: THM_Calculator(plugin, template, x, y, width, height)
*	Parameters: Plugin ID, Template ID, X-coord, Y-coord, Desired width, desired height.
*	Callable functions:	- show()
*									- hide()
*									- remove()
*/
function THM_Calculator(plugin, template, x,y,width,height)
{
	this.visible = true;
	var object = this;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.plugin = plugin;
	this.template = template;
	this.layer = new Layer(this.plugin,0, 0,480,320);

	this.label = new Label(this.plugin,"",1,0,0,480,320);
	this.label.setColor(1,1,1,0);
	this.label.subscribe();

	this.calculator = new Sprite(this.plugin,"newcalculator4%20.png",this.x,this.y,this.width,this.height);
	this.input = new Label (this.plugin, "0", 2, (this.x + 5), (this.y+this.height-35), (this.width - 5 * 2), 30);
	this.calculator.setShape("square");

	this.calculator.setDrag();
	this.label.moveCallback(this.label,"mouseMove");
	this.calculator.downCallback(this.calculator,"mouseDown");
	this.calculator.upCallback(this.label,"mouseUp");

	this.layer.addChild(this.calculator);
	this.calculator.addChild(this.label);
	this.layer.addChild(this.calculator);
	this.layer.setColor(1,1,0,0);

	var buttonArray;
	var colArray;
	//this.passAnswerString;
	//this.bindSheet;
	this.answer = 0;
	this.inputstring = "";
	//this.mouseX;
	//this.mouseY;
	var initalX;
	var initalY;
	var initialize = 0;
	var buttonWidth;
	var buttonHeight;

	this.equalFunction = function(){};

		this.setMouseXY = function(x,y){
		   this.mouseX = x;
		   this.mouseY = y;
		};

		this.label.mouseMove = function(x,y){
		   if(object.mouseDown){
				object.input.setPosition(object.calculator.x + 5,object.calculator.y+object.calculator.height-35);
				object.positionStuff();
		   }
		};
		this.calculator.mouseDown = function(x,y){
			object.mouseDown = true;
			initalX = object.mouseX;
			initalY = object.mouseY;
		};
		this.calculator.mouseUp = function(x,y){
			clearInterval(initialize);
			object.mouseDown = false;
		};
		this.changePosition = function(x,y){
			this.calculator.setPosition(x,y);
		};
		this.changeDimension = function(width,height){
			this.calculator.setDimensions(width,height);
		};

    this.updateString = function(value){
			if(value == "="){
				try {
					this.answer = eval(this.inputstring);
				} catch (e) {
					this.answer = 0;
				}
                if(isNaN(this.answer)) this.answer = 0;
				this.input.setText(String(this.answer));
				object.equalFunction();
			} else if(value == "clear"){
				this.input.setText("");
				this.inputstring = "";
			} else if(value == "exit"){
				this.answer = 0;
				try {
					this.answer = eval(this.inputstring);
				} catch (e) {
					this.answer = 0;
				}
				logDebug("calc.updateString exit answer: " + this.answer);
				this.input.setText(String(this.answer));
				this.externalFunction();
				this.inputstring = "";
				this.input.setText("0");
				this.hide();
			} else{
				this.inputstring += value;
				this.input.setText(this.inputstring);
			}
	};
/*
*	function externalFunction()
*	This function is currenty set up for interaction with the THM_Spreadsheet module.
*	It checks for a flag in the demo file (bindSheet), and if it is present and true, it calls a function in that demo (window.updateCellString())
*	This functionality can be extended by adding other flags to check for; and other functions to call.
*/
	this.externalFunction = function(){
		if (this.bindSheet === true){
			window.updateCellString();
		}
	};
	this.mouseClick = function(x,y){
		object.updateString(this.value);
	};

	this.positionStuff = function(){
		for(var i = 0; i<buttonArray.length; i ++){
			for(var j = 0; j<buttonArray[i].length; j++){
				buttonArray[i][j].setPosition(object.calculator.x+5+i*(buttonWidth+5),object.calculator.y+object.calculator.height-object.input.height-5*2-(buttonHeight+6)*j-20);
			}
		}
	};

	this.build = function(){
		this.input.setColor(1,1,1,1);
		this.input.setCaptionColor(0,0,0,1);
		this.input.setWrap(true);
		this.layer.addChild(this.input);

		buttonArray = new Array(4);
		buttonWidth = (this.width - 4*5)/4;
		buttonHeight = (this.height - 8*5 - this.input.height)/6;

		for(var i = 0; i<buttonArray.length; i ++){
			if(i===0){
				colArray = new Array(6);
			} else if(i==3){
				colArray = new Array(4);
			} else {
				colArray = new Array(5);
			}

			buttonArray[i] = colArray;

			for(var j = 0; j<colArray.length;j++){
				colArray[j] = new Label(this.plugin,"",1,this.x+5+i*(buttonWidth+5),this.y+this.height-this.input.height-5*2-(buttonHeight+6)*j-20,buttonWidth,buttonHeight);

				buttonArray[i][j] = colArray[j];
				buttonArray[i][j].clickCallback(buttonArray[i][j],"buttonClick");

				buttonArray[i][j].setVisibility(false);
				this.layer.addChild(buttonArray[i][j]);

				buttonArray[i][j].buttonClick = this.mouseClick;
				if(i === 0 && j == 5){
					buttonArray[i][j].setDimensions(this.width -5*2, buttonHeight);
				}
				if(i == 2 && j == 4){
					buttonArray[i][j].setDimensions(buttonWidth*2+5, buttonHeight);
				}
				buttonArray[i][j].unsubscribe();
			}
		}
		buttonArray[0][0].value = "7";
		buttonArray[0][1].value = "4";
		buttonArray[0][2].value = "1";
		buttonArray[0][3].value = ".";
		buttonArray[0][4].value = "(";
		buttonArray[0][5].value = "exit";

		buttonArray[1][0].value = "8";
		buttonArray[1][1].value = "5";
		buttonArray[1][2].value = "2";
		buttonArray[1][3].value = "0";
		buttonArray[1][4].value = ")";

		buttonArray[2][0].value = "9";
		buttonArray[2][1].value = "6";
		buttonArray[2][2].value = "3";
		buttonArray[2][3].value = "=";
		buttonArray[2][4].value = "clear";

		buttonArray[3][0].value = "+";
		buttonArray[3][1].value = "-";
		buttonArray[3][2].value = "*";
		buttonArray[3][3].value = "/";
	};
/*
*	function show()
*	Call this function to make the calculator visible. A curtain is generated behind it to block unwanted clicks.
*/
	this.show = function(){
		plugin.addSpecial(buttonArray[0][0].getId());
		plugin.addSpecial(buttonArray[0][1].getId());
		plugin.addSpecial(buttonArray[0][2].getId());
		plugin.addSpecial(buttonArray[0][3].getId());
		plugin.addSpecial(buttonArray[0][4].getId());
		plugin.addSpecial(buttonArray[0][5].getId());

		plugin.addSpecial(buttonArray[1][0].getId());
		plugin.addSpecial(buttonArray[1][1].getId());
		plugin.addSpecial(buttonArray[1][2].getId());
		plugin.addSpecial(buttonArray[1][3].getId());
		plugin.addSpecial(buttonArray[1][4].getId());

		plugin.addSpecial(buttonArray[2][0].getId());
		plugin.addSpecial(buttonArray[2][1].getId());
		plugin.addSpecial(buttonArray[2][2].getId());
		plugin.addSpecial(buttonArray[2][3].getId());
		plugin.addSpecial(buttonArray[2][4].getId());

		plugin.addSpecial(buttonArray[3][0].getId());
		plugin.addSpecial(buttonArray[3][1].getId());
		plugin.addSpecial(buttonArray[3][2].getId());
		plugin.addSpecial(buttonArray[3][3].getId());

		plugin.addSpecial(this.calculator.getId());
		plugin.addSpecial(this.label.getId());
		plugin.addSpecial(this.template.curtainLayer.getId());

		this.template.showCurtain();

		buttonArray[0][0].subscribe();
		buttonArray[0][1].subscribe();
		buttonArray[0][2].subscribe();
		buttonArray[0][3].subscribe();
		buttonArray[0][4].subscribe();
		buttonArray[0][5].subscribe();

		buttonArray[1][0].subscribe();
		buttonArray[1][1].subscribe();
		buttonArray[1][2].subscribe();
		buttonArray[1][3].subscribe();
		buttonArray[1][4].subscribe();

		buttonArray[2][0].subscribe();
		buttonArray[2][1].subscribe();
		buttonArray[2][2].subscribe();
		buttonArray[2][3].subscribe();
		buttonArray[2][4].subscribe();

		buttonArray[3][0].subscribe();
		buttonArray[3][1].subscribe();
		buttonArray[3][2].subscribe();
		buttonArray[3][3].subscribe();

		this.calculator.subscribe();
		this.label.subscribe();
		this.layer.setVisibility(true);
		this.visible = true;
	};
/*
*	function hide()
*	Call this function to hide the calculator and remove unwanted interactivity.
*/
	this.hide = function(){

		plugin.removeSpecial(buttonArray[0][0].getId());
		plugin.removeSpecial(buttonArray[0][1].getId());
		plugin.removeSpecial(buttonArray[0][2].getId());
		plugin.removeSpecial(buttonArray[0][3].getId());
		plugin.removeSpecial(buttonArray[0][4].getId());
		plugin.removeSpecial(buttonArray[0][5].getId());

		plugin.removeSpecial(buttonArray[1][0].getId());
		plugin.removeSpecial(buttonArray[1][1].getId());
		plugin.removeSpecial(buttonArray[1][2].getId());
		plugin.removeSpecial(buttonArray[1][3].getId());
		plugin.removeSpecial(buttonArray[1][4].getId());

		plugin.removeSpecial(buttonArray[2][0].getId());
		plugin.removeSpecial(buttonArray[2][1].getId());
		plugin.removeSpecial(buttonArray[2][2].getId());
		plugin.removeSpecial(buttonArray[2][3].getId());
		plugin.removeSpecial(buttonArray[2][4].getId());

		plugin.removeSpecial(buttonArray[3][0].getId());
		plugin.removeSpecial(buttonArray[3][1].getId());
		plugin.removeSpecial(buttonArray[3][2].getId());
		plugin.removeSpecial(buttonArray[3][3].getId());

		plugin.removeSpecial(this.calculator.getId());
		plugin.removeSpecial(this.label.getId());
		plugin.removeSpecial(this.template.curtainLayer.getId());

		this.template.hideCurtain();

		buttonArray[0][0].unsubscribe();
		buttonArray[0][1].unsubscribe();
		buttonArray[0][2].unsubscribe();
		buttonArray[0][3].unsubscribe();
		buttonArray[0][4].unsubscribe();
		buttonArray[0][5].unsubscribe();
		buttonArray[1][0].unsubscribe();
		buttonArray[1][1].unsubscribe();
		buttonArray[1][2].unsubscribe();
		buttonArray[1][3].unsubscribe();
		buttonArray[1][4].unsubscribe();

		buttonArray[2][0].unsubscribe();
		buttonArray[2][1].unsubscribe();
		buttonArray[2][2].unsubscribe();
		buttonArray[2][3].unsubscribe();
		buttonArray[2][4].unsubscribe();

		buttonArray[3][0].unsubscribe();
		buttonArray[3][1].unsubscribe();
		buttonArray[3][2].unsubscribe();
		buttonArray[3][3].unsubscribe();

		this.layer.setVisibility(false);

		this.visible = false;
	};
/*
*	function remove()
*	Call this function on clean up so that ghost callbacks from previous scenes don't occur.
*/
	this.remove = function(){
		buttonArray[0][0].clickCallback(this, "blank");
		buttonArray[0][1].clickCallback(this, "blank");
		buttonArray[0][2].clickCallback(this, "blank");
		buttonArray[0][3].clickCallback(this, "blank");
		buttonArray[0][4].clickCallback(this, "blank");
		buttonArray[0][5].clickCallback(this, "blank");
		buttonArray[1][0].clickCallback(this, "blank");
		buttonArray[1][1].clickCallback(this, "blank");
		buttonArray[1][2].clickCallback(this, "blank");
		buttonArray[1][3].clickCallback(this, "blank");
		buttonArray[1][4].clickCallback(this, "blank");

		buttonArray[2][0].clickCallback(this, "blank");
		buttonArray[2][1].clickCallback(this, "blank");
		buttonArray[2][2].clickCallback(this, "blank");
		buttonArray[2][3].clickCallback(this, "blank");
		buttonArray[2][4].clickCallback(this, "blank");

		buttonArray[3][0].clickCallback(this, "blank");
		buttonArray[3][1].clickCallback(this, "blank");
		buttonArray[3][2].clickCallback(this, "blank");
		buttonArray[3][3].clickCallback(this, "blank");
	};
	this.blank = function(){};
	this.build();
}
function THM_fastMath()

{

	var sinTable = new Array(3600);

	var cosTable = new Array(3600);



	for(var i = 0 ; i < 3600 ; i++)

	{

		sinTable[i] = Math.sin((Math.PI/1800)*i);

		cosTable[i] = Math.cos((Math.PI/1800)*i);

	}



	this.sin = function(passAngle)

	{

		this.theta = Math.round(passAngle*10);

		this.checkAngles();

		return sinTable[this.theta];

	};

	this.cos = function(passAngle)

	{

		this.theta = Math.round(passAngle*10);

		this.checkAngles();

		return cosTable[this.theta];

	};

	this.tan = function(passAngle)

	{

		this.theta = Math.round(passAngle*10);

		this.checkAngles();

		//Should return some arbitrary value if cosTable=0;

		return (sinTable[this.theta]/cosTable[this.theta]);

	};



	this.checkAngles = function()

	{

		while(this.theta< 0 || this.theta>= 3600)

		{

			if(this.theta>=3600)

			{

				this.theta-=3600;

			}

			else if(this.theta<0)

			{

				this.theta+=3600;

			}

		}

	};



	this.moveVector2D = function(passPoint,passCircleVector)

	{

		passCircleVector.checkAngles();

		var tempPoint = new Point();



		tempPoint.x = passPoint.x + passCircleVector.radial*this.sin(passCircleVector.theta);

		tempPoint.y = passPoint.y + passCircleVector.radial*this.cos(passCircleVector.theta);



		return tempPoint;

	};

}



/*

*	THM_Spreadsheet.js : Spreadsheet Library for the THP.

*	Last Updated: August 30, 2010.

*

*	Authors: Paul Vilchez, Elwin Ha, Ryan Cui

*	Date: July 26 '10

*	About:  This library allows for rapid templating of spreadsheets for THP demos.

*				This library requires Osmosis and THP_Template to function.

*/



/*

*	Constructor: THM_Spreadsheet(plugin,demo, rows, cols)

*	Parameters: plugin ID, demo ID, number of rows, number of columns

*	Callable functions:				- buildSheet()

*									- setCellDimensions()

*									- setCellText()

*									- swap()

*									- deleteMouseEvents()

*									- tableOffset()

*									- resizeRow()

*									- resizeColumn()

*									- addCalculatorIcon()

*/

function THM_Spreadsheet(plugin, demo, rows, cols){

	//Variables

	this.demo = demo;

	this.plugin = plugin;

	this.rows = rows;

	this.cols = cols;

	this.buildLayer = new Layer(this.plugin, 0, 0, 480, 320);

	this.buildLayer.setColor(0,0,0,0);



	//Arrays

	this.cellArray = new Array(cols);

	this.rowArray = [];

	this.colArray = [];

	this.rowCoordArray = new Array(this.rows);

	this.rowCoordArray.x = new Array(this.rows);

	this.rowCoordArray.y = new Array(this.rows);

	this.colCoordArray = new Array(this.cols);

	this.colCoordArray.x = new Array(this.cols);

	this.colCoordArray.y = new Array(this.cols);



	this.lineArray_col = [];

	this.lineArray_row = [];

	this.iconArray = [];

	//Flags

	this.lineLoaded=false;

	this.offsetX=0;

	this.offsetY=0;

	//this.activeCell;

	//Init

	for(var i = 0 ; i < this.rows ; i++){

		this.rowCoordArray[i]=0;

		this.rowCoordArray.x[i]=0;

		this.rowCoordArray.y[i]=0;

	}

	for(i = 0 ; i < this.cols ; i++){

		this.colCoordArray[i]=0;

		this.colCoordArray.x[i]=0;

		this.colCoordArray.y[i]=0;

	}

	for (i = 0; i < cols; i++){

		this.cellArray[i] = new Array(rows);

	}

/*

*	function buildSheet(passScene)

*	In: The scene on which the sheet will be drawn, eg. sceneQ1S1

*	Out: A spreadsheet using the parameters passed in the constructor.

*/

	this.buildSheet = function(scene){

		var i = 0;

		var j = 0;

		this.scene = scene;



		for(i = 0; i < this.cols; i++){

			for(j = 0; j < this.rows; j++){

				this.cell = new TextBox(this.plugin, "("+i+","+j+")",1, 60 + 65*i, 225-25*j,60,20);

				this.cell.subscribe();

				this.cell.clickCallback(this, "cellClick");

				this.buildLayer.addChild(this.cell);

				this.cellArray[i][j] = this.cell;

				this.cellArray[i][j].selected = false; //boolean flag for callback;

			}

		}

		for(i = 0; i < this.rows; i++){

			this.rowLabel = new Label(this.plugin, i, 1, 30, 225 - 25*i, 20, 20);

			// --- Remove callbacks on the rows for speed ---

			//this.rowLabel.subscribe();

			//this.rowLabel.clickCallback(this, "rowClick");

			//this.rowLabel.setDrag(this.demo.Mouse, true);



			//this.rowLabel.selected = false; //boolean flag for callback;

			//this.rowLabel.downCallback(this, "rowDown");

			this.rowLabel.setCaptionColor(0,0,0,1);

			this.rowLabel.setColor(1,1,1,0);



			this.rowArray.push(this.rowLabel);

			this.rowCoordArray.x[i] = this.rowLabel.x;

			this.rowCoordArray.y[i] = this.rowLabel.y;



			this.buildLayer.addChild(this.rowLabel);

		}

		for(j = 0; j < this.cols; j++){

			this.colLabel = new Label(this.plugin, j, 1, 90 + 60*j, 250, 20, 20 );



			// --- Remove callbacks on the columns for speed ---

			//this.colLabel.clickCallback(this, "colClick");

			//this.colLabel.setDrag(this.demo.Mouse, true);

			//this.colLabel.subscribe();



			//this.colLabel.selected = false; //boolean flag for callback;

			//this.colLabel.downCallback(this, "colDown");



			this.colLabel.setCaptionColor(0,0,0,1);

			this.colLabel.setColor(1,1,1,0);



			this.colArray.push(this.colLabel);

			this.colCoordArray.x[j] = this.colLabel.x;

			this.colCoordArray.y[j] = this.colLabel.y;

			this.buildLayer.addChild(this.colLabel);

		}



		this.scene.addChild(this.buildLayer);

	};

/*

*	function setCellDimensions(width,height)

*	Lets you specify the dimensions of the cells within the sheet.

*/

	this.setCellDimensions = function(width, height){

		this.width = width;

		this.height = height;

		var i = 0;



		for(i = 0; i < this.cols; i++){

			for(var j = 0; j < this.rows; j++){

				this.cellArray[i][j].setPosition(60 + (this.width+5)*i, 225 - (this.height+5)*j);

				this.cellArray[i][j].setDimensions(this.width, this.height);

			}

		}

		for(i = 0 ; i <this.rowArray.length ; i ++ ) {

			this.rowArray[i].setPosition(this.rowArray[i].x,this.cellArray[0][i].y+this.cellArray[0][i].height/2-this.rowArray[i].height/2);

			this.rowCoordArray.x[i]=this.rowArray[i].x;

			this.rowCoordArray.y[i]=this.rowArray[i].y;

		}

		for(i = 0 ; i <this.colArray.length ; i ++ ) {

			this.colArray[i].setPosition(this.cellArray[i][0].x+this.cellArray[i][0].width/2-this.colArray[i].width/2,this.cellArray[i][0].height+this.cellArray[i][0].y);

			this.colCoordArray.x[i]=this.colArray[i].x;

			this.colCoordArray.y[i]=this.colArray[i].y;

		}

	};

/*

*	function setCellText(row, col, text)

*	Set the text of a cell at a specified index.

*/

	this.setCellText = function(row, col, text){

		this.text = text;

		this.row = row;

		this.col = col;

		this.cellArray[col][row].setText(this.text);

	};

/*

*	function cellClick(x,y)

*	Determines which cell in a sheet is the active one.

*/

	this.cellClick = function(x,y){

		var i = 0;

		var j = 0;

		var tempCol;

		var tempRow;



		for(i = 0; i < this.cols; i++){

		    for(j = 0; j < this.rows; j++){

		        this.cellArray[i][j].selected = false;

		    }

		}

		for(i = 0; i < this.cols; i++){

			for(j = 0; j < this.rows; j++){

				if(x>=this.cellArray[i][j].x && x <= this.cellArray[i][j].x+this.cellArray[i][j].width){

					tempCol = i;

				}

				if(y >= this.cellArray[i][j].y && y <= this.cellArray[i][j].y+this.cellArray[i][j].height){

					tempRow = j;

				}

			}

		}

		this.cellArray[tempCol][tempRow].selected = true;

		logDebug("(col: " + tempCol + ", row: " + tempRow +  ") is clicked.");

		this.activeCell = this.cellArray[tempCol][tempRow];

		//if (this.cellArray[tempCol][tempRow].getText() == "undefined"){

		//	this.cellArray[tempCol][tempRow].setText("");

		//}

	};

/*

*	function rowClick(x,y)

*	row-swapping functionality using mouse drag events

*/

	this.rowClick = function(x, y){

		for(var i = 0 ; i < this.rows; i++){

			if(this.rowArray[i].y != this.rowCoordArray.y[i]){

				for(var j = 0 ; j < this.rows; j++){

					if(j!=i){

						if(((this.rowArray[i].y+this.rowArray[i].height/2)>this.rowArray[j].y) && ((this.rowArray[i].y+this.rowArray[i].height/2)<(this.rowArray[j].y+this.rowArray[j].height)) && this.rowArray[i].selected){

							this.swap("row",i,j);

							logDebug("ROW " + i + " and ROW " + j + " have been swapped.");

						}

					}

				}

			}

			this.rowArray[i].selected=false;

		}

		for(i = 0 ; i < this.rows; i++){

			this.rowArray[i].setPosition(this.rowCoordArray.x[i]+this.offsetX,this.rowCoordArray.y[i]+this.offsetY);

		}

	};

/*

*	function colClick(x,y)

*	column-swapping functionality using mouse drag events

*/

	this.colClick = function(x, y){

		for(var i = 0 ; i < this.cols; i++){

			if(this.colArray[i].x != this.colCoordArray.x[i]){

				for(var j = 0 ; j < this.cols; j++){

					if(j!=i){

						if(((this.colArray[i].x+this.colArray[i].width/2)>this.colArray[j].x) && ((this.colArray[i].x+this.colArray[i].width/2)<(this.colArray[j].x+this.colArray[j].width)) && this.colArray[i].selected){

							this.swap("column",i,j);

							logDebug("COLUMN " + i + " and COLUMN " + j + " have been swapped.");

						}

					}

				}

			}

			this.colArray[i].selected=false;

		}

		for(i = 0 ; i < this.cols; i++){

			this.colArray[i].setPosition(this.colCoordArray.x[i]+this.offsetX,this.colCoordArray.y[i]+this.offsetY);

		}

	};

/*

*	function rowDown(x,y)

*	Selects a row on click.

*/

	this.rowDown = function(x,y){

		for(var i = 0 ; i < this.rowArray.length ; i++){

			if( x > this.rowArray[i].x && x < (this.rowArray[i].x+this.rowArray[i].width) &&  y > this.rowArray[i].y && y < (this.rowArray[i].y+this.rowArray[i].height)){

				this.rowArray[i].selected=true;

			}

		}

	};

/*

*	function colDown(x,y)

*	Selects a column on click.

*/

	this.colDown = function(x,y){

		for(var i = 0 ; i < this.colArray.length ; i++){

			if( x > this.colArray[i].x && x < (this.colArray[i].x+this.colArray[i].width) &&  y > this.colArray[i].y && y < (this.colArray[i].y+this.colArray[i].height)){

				this.colArray[i].selected=true;

			}

		}

	};

/*

*	function swap(type, first, second)

*	Takes in type="row" or type="col", then 2 index values, which will be swapped.

*/

	this.swap = function(type, first, second){

		var tempArray = [];

		var tempHolder = "";

		var i = 0;

		if(type == "row"){

			for(i = 0; i < this.cols; i++){

				tempHolder = this.cellArray[i][first].getText();

				tempArray.push(tempHolder);



				this.cellArray[i][first].setText(this.cellArray[i][second].getText());

				this.cellArray[i][second].setText(tempArray[i]);

			}

		}

		else if(type == "column"){

			for(i = 0; i < this.rows; i++){

				tempHolder = this.cellArray[first][i].getText();

				tempArray.push(tempHolder);



				this.cellArray[first][i].setText(this.cellArray[second][i].getText());

				this.cellArray[second][i].setText(tempArray[i]);

			}

		}

		else {

			logDebug("Invalid type specifed. Please use 'row' or 'column'.");

		}

	};

/*

*	function deleteMouseEvents()

*	Sets the entire sheet to a non-interactive state.

*/

	this.deleteMouseEvents = function(){

		var i = 0;

		var j = 0;

	    for(j = 0 ; j < this.cols ; j++){

			for(i = 0 ; i < this.rows ; i++ ){

				this.cellArray[j][i].unsubscribe();

			}

		}

		for(i = 0 ; i < this.rows ; i++){

			this.rowArray[i].unsubscribe();

		}

		for(i = 0 ; i < this.cols ; i++){

			this.colArray[i].unsubscribe();

		}

	};

/*

*	function deleteLabelEvents()

*	Sets all labels to a non-interactive state.

*/

    this.deleteLabelEvents = function()

	{

		var i = 0;

	    for(i = 0 ; i < this.rows ; i++)

		{

			this.rowArray[i].unsubscribe();

		}

		for(i = 0 ; i < this.cols ; i++)

		{

			this.colArray[i].unsubscribe();

		}

	};

/*

*	function generateBorder()

*	Draws a border around each cell in the sheet.

*/

	this.generateBorder = function()

	{



			var xOffset = -5/2;

			var yOffset = 5/2;

			var i = 0;



			for(i = 0 ; i<this.cols ; i++){

				if(!this.lineLoaded) {

					this.lineArray_col.push(new Primitive(this.plugin,"line"));

					this.buildLayer.addChild(this.lineArray_col[i]);

				}

				this.lineArray_col[i].setPoints(this.cellArray[i][0].x+xOffset , this.cellArray[i][0].y+this.cellArray[i][0].height+yOffset,this.cellArray[i][0].x +xOffset,this.cellArray[0][this.rows-1].y-5+yOffset);

				this.lineArray_col[i].setVisibility(true);

			}



			if(!this.lineLoaded) {

				this.lineArray_col.push(new Primitive(this.plugin,"line"));

				this.buildLayer.addChild(this.lineArray_col[this.lineArray_col.length-1]);

			}

			this.lineArray_col[this.lineArray_col.length-1].setPoints(this.cellArray[this.cols-1][0].x+this.cellArray[this.cols-1][0].width+5+xOffset , this.cellArray[0][0].y+this.cellArray[0][0].height+yOffset,this.cellArray[this.cols-1][0].x+this.cellArray[this.cols-1][0].width + 5 +xOffset,this.cellArray[0][this.rows-1].y-5+yOffset);

			this.lineArray_col[this.lineArray_col.length-1].setVisibility(true);





			for(i = 0 ; i<this.rows ; i++){

				if(!this.lineLoaded) {

					this.lineArray_row.push(new Primitive(this.plugin,"line"));

					this.buildLayer.addChild(this.lineArray_row[i]);

				}



				this.lineArray_row[i].setPoints(this.cellArray[0][0].x+xOffset,this.cellArray[0][i].y+this.cellArray[0][i].height+yOffset,this.cellArray[this.cols-1][0].x+this.cellArray[this.cols-1][0].width+5+xOffset,this.cellArray[0][i].y+this.cellArray[0][i].height+yOffset);

				this.lineArray_row[i].setVisibility(true);

			}



			if(!this.lineLoaded) {

				this.lineArray_row.push(new Primitive(this.plugin,"line"));

				this.buildLayer.addChild(this.lineArray_row[this.lineArray_row.length-1]);

			}



			this.lineArray_row[this.lineArray_row.length-1].setPoints(this.cellArray[0][0].x+xOffset,this.cellArray[0][this.rows-1].y-5+yOffset,this.cellArray[this.cols-1][0].x+this.cellArray[this.cols-1][0].width+5+xOffset,this.cellArray[0][this.rows-1].y-5+yOffset);

			this.lineArray_row[this.lineArray_row.length-1].setVisibility(true);



		this.lineLoaded=true;

	};



    this.addParent = function(passScene)

	{

		var i = 0;

		this.scene=passScene;

		this.scene.addChild(this.buildLayer);

		/*for(i = 0 ; i < this.cols ; i++){

			for(var j = 0 ; j < this.rows ; j++){

				this.scene.addChild(this.cellArray[i][j]);

			}

		}

		for(i = 0 ; i < this.lineArray_row.length ; i++){

			this.scene.addChild(this.lineArray_row[i]);

		}

		for(i = 0 ; i < this.lineArray_col.length ; i++){

			this.scene.addChild(this.lineArray_col[i]);

		}

		for(i = 0 ; i < this.rows ; i++){

			this.scene.addChild(this.rowArray[i]);

		}

		for(i = 0 ; i < this.cols ; i++){

			this.scene.addChild(this.colArray[i]);

		}*/

	};



/*

*	function tableOffset(passX, passY);

*	Useful for positioning the table after creation, since the table is created at the same coordinates each time.

*	Parameters are the desired x and y coordinates.

*/

	this.tableOffset = function(passX,passY){

		var i = 0;

		this.offsetX =passX;

		this.offsetY =passY;



		for(i = 0 ; i < this.rowArray.length ; i++){

			this.rowArray[i].setPosition(this.rowArray[i].x+passX,this.rowArray[i].y+passY);

		}

		for(i = 0 ; i < this.colArray.length ; i++){

			this.colArray[i].setPosition(this.colArray[i].x+passX,this.colArray[i].y+passY);

		}

		for(i = 0 ; i < this.cellArray.length ; i++){

			for(var j = 0 ; j < this.cellArray[0].length ; j++){

				this.cellArray[i][j].setPosition(this.cellArray[i][j].x+passX,this.cellArray[i][j].y+passY);

			}

		}

		for(i = 0 ; i < this.lineArray_row.length ; i++){

			this.lineArray_row[i].setPoints(this.lineArray_row[i].x+passX,this.lineArray_row[i].y+passY,this.lineArray_row[i].width+passX,this.lineArray_row[i].height+passY);

		}

		for(i = 0 ; i < this.lineArray_col.length ; i++){

			this.lineArray_col[i].setPoints(this.lineArray_col[i].x+passX,this.lineArray_col[i].y+passY,this.lineArray_col[i].width+passX,this.lineArray_col[i].height+passY);

		}

	};

/*

*	function labelOffset(passX, passY)

*	TODO: function for repositioning the row/col labels

*/

	this.labelOffset = function(passX, passY){

		this.offsetX =passX;

		this.offsetY =passY;

		//Do stuff.

	};

/*

*	function resizeColumn(passIndex, passWidth)

*	Parameters: desired column index; desired width of cells

*/

	this.resizeColumn = function(passIndex,passWidth){

		var i = 0;

		var deltaWidth = passWidth-this.cellArray[passIndex][0].width;

		for(i = 0 ; i < this.rows ; i++){

			this.cellArray[passIndex][i].setDimensions(passWidth,this.cellArray[passIndex][i].height);

		}

		for(i = (passIndex+1) ; i < this.cols ; i++){

			for(var j = 0 ; j < this.rows ; j ++){

				this.cellArray[i][j].setPosition(this.cellArray[i][j].x+deltaWidth,this.cellArray[i][j].y);

			}

		}



		for(i = 0 ; i <this.rowArray.length ; i ++ ) {

			this.rowArray[i].setPosition(this.rowArray[i].x,this.cellArray[0][i].y+this.cellArray[0][i].height/2-this.rowArray[i].height/2);

			this.rowCoordArray.x[i]=this.rowArray[i].x;

			this.rowCoordArray.y[i]=this.rowArray[i].y;

		}

		for(i = 0 ; i <this.colArray.length ; i ++ ) {

			this.colArray[i].setPosition(this.cellArray[i][0].x+this.cellArray[i][0].width/2-this.colArray[i].width/2,this.cellArray[i][0].height+this.cellArray[i][0].y);

			this.colCoordArray.x[i]=this.colArray[i].x;

			this.colCoordArray.y[i]=this.colArray[i].y;

		}



		this.generateBorder();

	};

	this.resizeRow = function(passIndex,passHeight){

		var i = 0;

		var deltaHeight = passHeight-this.cellArray[0][passIndex].height;

		for(i = 0 ; i < this.cols ; i++){

			this.cellArray[i][passIndex].setDimensions(this.cellArray[i][passIndex].width,passHeight);

			this.cellArray[i][passIndex].setPosition(this.cellArray[i][passIndex].x,this.cellArray[i][passIndex].y-deltaHeight);

		}

		for(i = (passIndex+1) ; i < this.rows ; i++){

			for(var j = 0 ; j < this.cols ; j++){

				this.cellArray[j][i].setPosition(this.cellArray[j][i].x, this.cellArray[j][i].y-deltaHeight);

			}

		}



		for(i = 0 ; i <this.rowArray.length ; i ++ ) {

			this.rowArray[i].setPosition(this.rowArray[i].x,this.cellArray[0][i].y+this.cellArray[0][i].height/2-this.rowArray[i].height/2);

			this.rowCoordArray.x[i]=this.rowArray[i].x;

			this.rowCoordArray.y[i]=this.rowArray[i].y;

		}

		for(i = 0 ; i <this.colArray.length ; i ++ ) {

			this.colArray[i].setPosition(this.cellArray[i][0].x+this.cellArray[i][0].width/2-this.colArray[i].width/2,this.cellArray[i][0].height+this.cellArray[i][0].y);

			this.colCoordArray.x[i]=this.colArray[i].x;

			this.colCoordArray.y[i]=this.colArray[i].y;

		}



		this.generateBorder();

	};

/*

*	DEPRECATED function hideSheet();

*	Please use deleteMouseEvents() in the future.

*/

	this.hideSheet = function(){

		for(var i = 0; i < this.cols; i++){

			for(var j = 0; j < this.rows; j++){

				this.cell.unsubscribe();

			}

		}

	};

/*

*	function addCalculatorIcon(passTemplate, passType, passNum)

*	Adds small calculator icons to the right-most side of specified rows or columns.

*	Parameters: template ID, type="row" or type="column", desired index.

*	Note that this needs the THM_Calculator class included to function properly.

*/

	this.addCalculatorIcon = function(passTemplate, passType, passNum){

		this.scene = passTemplate.getCurrentScene();

		logDebug(this.scene);

		this.type = passType;

		this.num = passNum;

		var i = 0;

		var calcIcon;



		if(this.type == "row"){

			for(i = 0; i < this.cols; i++){

				calcIcon = new Sprite(this.plugin,"calcIcon.png",0,0,15,15);

				calcIcon.subscribe();

				calcIcon.clickCallback(window,"iconClick");

				calcIcon.downCallback(window,"iconDown");

				this.buildLayer.addChild(calcIcon);

				calcIcon.setPosition(this.cellArray[i][this.num].x + this.cellArray[i][this.num].width - 15, this.cellArray[i][this.num].y+2);

			}

		} else if(this.type == "column"){

			for(i = 0; i < this.rows; i++){

				calcIcon = new Sprite(this.plugin,"calcIcon.png",0,0,15,15);

				calcIcon.setShape("square");

				calcIcon.subscribe();

				calcIcon.clickCallback(window,"iconClick");

				calcIcon.bind = this.cellArray[this.num][i];

				this.buildLayer.addChild(calcIcon);

				calcIcon.setPosition(this.cellArray[this.num][i].x + this.cellArray[this.num][i].width - 15, this.cellArray[this.num][i].y+2);

				this.iconArray.push(calcIcon);

			}

		} else {

			logDebug("Invalid type specified. Please use ''row' or 'column'.");

		}

	};

}

/*

*	function iconClick(x,y)

*	Click callback for the icons added by addCalculatorIcon()

*	Note: For Calculator extending only, at the moment.

*			 Please call the Calculator variable "calculator"

*/

window.iconClick = function(x,y){

	calculator.layer.setVisibility(true);

	calculator.show();

};

/*

*	function clickHighlight(object)

*/

function clickHighlight(object){

	this.x = object.x+1;

	this.y = object.y+1;

	this.width = object.width+1;

	this.height = object.height+1;

}

/*! THP_Template.js */
// ---------------------------------------------------------------------
// THP_Template.js
// Author: Anson MacKeracher, Ethan Greavette
// Date: 6/21/2010
// Comments: This template script constructs the demo template that the
//           demo lives in. Please note that THP_Template.js requires
//           the presence of osmosis.js compatibility layer to function
//           properly!
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// THP_Template: The main object of the plugin
function THP_Template(plugin, width, height, sceneDescriptor) {
    var that = this;
	if (typeof jQuery === "undefined")	{
		logDebug("Demo on local server");
		this.boolSimulate = true;
	} else {
		logDebug("Demo on THM server");
		this.boolSimulate = false;
	}

	if(typeof plugin.isMobile !== "undefined") {
		this.boolMobile = plugin.isMobile();
	} else {
		// TODO use only isMobile once implemented
		this.boolMobile = true;
	}

	if(typeof plugin.getPluginVersion === "undefined") {
		logDebug("No plugin found");
	 	return false;
    }
	logDebug("monocleGL version: " + plugin.getPluginVersion() );

	// Record plugin infromation
    this.plugin = plugin; // Keep a reference to the plugin object
    this.width = width;
    this.height = height;
	this.travelTime = 0.25;

	// Set demo spefic varibles
    this.totalFinished = 0;
    this.plugin.setInteractive(true);
	this.demo_name = window.demo_name;
	this.submissionRetryID = 0;


	// Setup explore mode varibles
	this.funcExploreInit = null;
	this.funcExploreCleanUp = null;
	this.scnExplore = new Scene(this.plugin, false);
	this.boolExplore = false;
	this.boolExploring = false;
	this.expLayer = new Layer(this.plugin, 0, 0, 480, 320);
	this.expLayer.setColor(0, 0, 0, 0);
	this.scnLast;

	// Create the scene array if the user entered a number for the # of questions
	this.currentScene = 0;
    this.totalScenes = 0;
	if( typeof sceneDescriptor === "number")	{
		this.totalScenes = sceneDescriptor;
		sceneDescriptor = new Array();

		// Push a 1 for each question in the demo
		for(i = 0; i < this.totalScenes; i++) {
			sceneDescriptor.push(1);
		}
	} else {
		// Record of the total number of questions
		for(i = 0; i < sceneDescriptor.length; i++) {
			this.totalScenes = this.totalScenes + sceneDescriptor[i];
		}
	}

    // ---------------------------------------------------------------------
    // Set up demo layers and sprites

 	// Create the very back layer
    this.preload_layer = new Layer(this.plugin, 0, 0, 480, 320);

	// Create the background image
    this.preload_sprite = new Sprite(this.plugin, "thm_loader.png", 0, 0, 480, 320);

	// Create the progress bar
    this.preload_loadingbar_container = new Primitive(this.plugin, "rectangle", 115, 30, 250, 20);
    this.preload_loadingbar_container.setColor(0.7, 0.7, 0.7, 0.7);
    this.preload_loadingbar = new Primitive(this.plugin, "rectangle", 118, 33, 0, 14);
    this.preload_loadingbar.setColor(0.3, 0.3, 0.9, 1.0);

	// Create the loading label
    this.preload_label = new Label(this.plugin, "Loading...", 2, 115, 30, 250, 20);
    this.preload_label.setColor(0.0, 0.0, 0.0, 0.0);
    this.preload_label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
    this.preload_label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
    this.preload_label.setAnchor("center");

	// Make a new scene and add all the childern
    this.preload_scene = new Scene(this.plugin, false);
    this.preload_scene.addChild(this.preload_layer);
    this.preload_layer.addChild(this.preload_sprite);
    this.preload_layer.addChild(this.preload_loadingbar_container);
    this.preload_layer.addChild(this.preload_loadingbar);
    this.preload_layer.addChild(this.preload_label);
    this.plugin.setScene(this.preload_scene.getId());

    // The arrow on the answer and bottom panel
    this.bottomPanelHoverArrowSprite = new Sprite(this.plugin, "btnSmallArrowUpGrey.png", 230, 55, 20, 20);
    this.answerPanelHoverArrowSprite = new Sprite(this.plugin, "btnSmallArrowLeftGrey.png", -24, 150, 20, 20);

    // Demo background
    this.layoutFrameSprite = new Sprite(this.plugin, "demo_layout_frame.png", 0, 0, 480, 320);

    // Set up menus and their callbacks.
    this.answerPanelLayer = new Layer(this.plugin, 480, 0, 65, 320);
    this.answerPanelLayer.setColor(0.0, 0.0, 0.0, 0.0);

    // Submit answer button
    this.submitButton = new Button(this.plugin, "submit", 0, 250, 60, 39);
    this.submitButton.subscribe();
    this.submitButton.clickCallback(this, "submitAnswer");

    // Answer button appears once the tries are used up
    this.answerButton = new Button(this.plugin, "answer", 0, 250, 60, 39);
    this.answerButton.clickCallback(this, "showAnswer");
	this.answerButton.setVisibility(false);
    this.answerButton.setActive(false);

    // Explore button appears once the tries are used up
    this.readyButton = new Button(this.plugin, "ready", 0, 250, 60, 39);
    this.readyButton.clickCallback(this, "endExplore");
	this.readyButton.setVisibility(false);
	this.readyButton.setActive(false);


	// The "wifi connecting" indicator
    this.wifiGreySprite = new Sprite(this.plugin, "wifiGrey.png", 35, 230, 20, 20);
    this.wifiGreySprite.setVisibility(false);

	// The "wifi connected" indicator
    this.wifiGreenSprite = new Sprite(this.plugin, "wifiGreen.png", 35, 230, 20, 20);
    this.wifiGreenSprite.setVisibility(false);

	// The "wifi simulated" indicator
    this.wifiBlueSprite = new Sprite(this.plugin, "wifiBlue.png", 35, 230, 20, 20);
    this.wifiBlueSprite.setVisibility(false);

    // The "correct answer" indicator
    this.checkSprite = new Sprite(this.plugin, "check.png", 6, 230, 24, 20);
    this.checkSprite.setVisibility(false);

    // The "incorrect answer" indicator
    this.crossSprite = new Sprite(this.plugin, "cross.png", 10, 230, 20, 20);
    this.crossSprite.setVisibility(false);

	// The answer panel graphics
    this.answerPanelSprite = new Sprite(this.plugin, "demo_menu_right.png", 0, 0, 65, 320);

	// The label "title" on the progress bar
    this.questionLabel = new Label(this.plugin, "", 12,  10, 210, 460, 80);
    this.questionLabel.setColor(0.0, 0.0, 0.0, 0.0);
    this.questionLabel.setCaptionColor(0.0, 0.0, 0.0, 1.0);
	this.questionLabel.setVisibility(true);
	this.questionLabel.setWrap(true);

	// The label "title" on the progress bar
    this.titleLabel = new Label(this.plugin, "", 12, -320, 290, 315, 20);
    this.titleLabel.setColor(0.0, 0.0, 0.0, 0.0);
    this.titleLabel.setCaptionColor(0.0, 0.0, 0.0, 1.0);
    this.titleLabel.setVisibility(true);
    this.titleLabel.setAnchor("right");

	// Add all the childern to the answer panel layer
    this.answerPanelLayer.addChild(this.answerPanelSprite);
    this.answerPanelLayer.addChild(this.titleLabel);
    this.answerPanelLayer.addChild(this.submitButton);
    this.answerPanelLayer.addChild(this.answerButton);
	this.answerPanelLayer.addChild(this.readyButton);
	this.answerPanelLayer.addChild(this.wifiGreySprite);
	this.answerPanelLayer.addChild(this.wifiGreenSprite);
	this.answerPanelLayer.addChild(this.wifiBlueSprite);
    this.answerPanelLayer.addChild(this.checkSprite);
    this.answerPanelLayer.addChild(this.crossSprite);
    this.answerPanelLayer.addChild(this.answerPanelHoverArrowSprite);

	// Create the bottom panel layer
    this.bottomPanelLayer = new Layer(this.plugin, 0, -51, 480, 51);
    this.bottomPanelLayer.setColor(0.0, 0.0, 0.0, 0.0);

	// The bottom panel graphic
    this.menuBottomSprite = new Sprite(this.plugin, "demo_menu_bottom.png", 0, 0, 480, 51);

	// The status bar for showing user how many questions they have
    this.demoStatusSprite = new Sprite(this.plugin, "demo_status_white.png", 45, 6, 259, 26);

	// The previous scene button
    this.previousSceneButton = new Button(this.plugin, "prevScene", 3, 10, 39, 39);
    this.previousSceneButton.upCallback(this, "prevScene");
	this.previousSceneButton.setActive(false);

	// The next scene button
    this.nextSceneButton = new Button(this.plugin, "nextScene", 437, 10, 39, 39);
    this.nextSceneButton.upCallback(this, "nextScene");
	this.nextSceneButton.setActive(false);

	// The reset scene button
    this.refreshButton = new Button(this.plugin, "refresh", 320, 6, 42, 27);
    this.refreshButton.upCallback(this, "resetButtonClickCallback");
	this.refreshButton.setActive(true);

	// The explore button
    this.exploreButton = new Button(this.plugin, "explore", 360, 6, 42, 27);
	this.exploreButton.clickCallback(this, "gotoExplore");
	this.exploreButton.setActive(false);

	// Set up the tries & status labels
    this.triesLabel = new Label(this.plugin, "Quiz: Submission chances left 3", 1, 50, 12, 200, 20);
    this.triesLabel.setColor(1.0, 1.0, 1.0, 0.0);
    this.triesLabel.setCaptionColor(0.0, 0.0, 0.0, 1.0);

	// Add all the childern to the bottom panel layer
    this.bottomPanelLayer.addChild(this.menuBottomSprite);
    this.bottomPanelLayer.addChild(this.nextSceneButton);
    this.bottomPanelLayer.addChild(this.previousSceneButton);
    this.bottomPanelLayer.addChild(this.demoStatusSprite);
    this.bottomPanelLayer.addChild(this.refreshButton);
    this.bottomPanelLayer.addChild(this.exploreButton);
    this.bottomPanelLayer.addChild(this.triesLabel);
    this.bottomPanelLayer.addChild(this.bottomPanelHoverArrowSprite);

	// Add the arrows pointing up to the bottom of the screen
    this.bottomPanelHoverSprite = new Sprite(this.plugin, "", 0, 0, this.width, 32);
    this.bottomPanelHoverSprite.subscribe();
    this.bottomPanelHoverSprite.overCallback(this, "bottomPanelHoverCallback");
	this.bottomPanelHoverSprite.clickCallback(this, "bottomPanelHoverCallback");

	// Add the arrows pointing left to the right of the screen
    this.answerPanelHoverSprite = new Sprite(this.plugin, "", 460, 0, 20, this.height);
    this.answerPanelHoverSprite.subscribe();
    this.answerPanelHoverSprite.overCallback(this, "answerPanelHoverCallback");
	this.answerPanelHoverSprite.clickCallback(this, "answerPanelHoverCallback");

	// Add to the middle of the screen from moving panel back
    this.problemAreaHoverSprite = new Sprite(this.plugin, "", 0, 50, 400, 270);
    this.problemAreaHoverSprite.subscribe();
    this.problemAreaHoverSprite.overCallback(this, "problemAreaHoverCallback");
	this.problemAreaHoverSprite.clickCallback(this, "problemAreaHoverCallback");

	// Back to PhoneGap button
    // TODO: Make the functionality of this button more obvious
    this.backToPG = new Button(this.plugin, "prevScene", 10, 285, 30, 30);
    this.backToPG.bind("mouse_up", function() {
            that.plugin.loadPhoneGap();
        });
    this.backToPG.subscribe();

	var xOffset = 0;
	if(this.boolMobile) xOffset = 30;

	// The progress bar sprite
    this.progressBarSprite = new Sprite(this.plugin, "demo_progress_red.png", 15 + xOffset, 290, 110, 20);

	// The label "update" on the progress bar
    this.progressBarLabel = new Label(this.plugin, "Progress ", 1, 28 + xOffset, 292, 40, 20);
    this.progressBarLabel.setColor(0.0, 0.0, 0.0, 0.0);
    this.progressBarLabel.setCaptionColor(1.0, 1.0, 1.0, 1.0);

	// The label to update how many quizzes the user has finished
    this.progressBarCount = new Label(this.plugin, "(" + this.totalFinished + "/" + this.totalScenes + ")", 1, 80 + xOffset, 292, 30, 20);
    this.progressBarCount.setColor(0.0, 0.0, 0.0, 0.0);
    this.progressBarCount.setCaptionColor(1.0, 1.0, 1.0, 1.0);

    // Add the left "cap" to the progress bar
    this.progressLeftSprite = new Sprite(this.plugin, "demo_progress_left.png", 15 + xOffset, 290, 8, 20);
    this.progressLeftSprite.setVisibility(false);

    // Add the right "cap" to the progress bar
    this.progressRightSprite = new Sprite(this.plugin, "demo_progress_right.png", 120 + xOffset, 290, 8, 20);
    this.progressRightSprite.setVisibility(false);

    // Add the "middle" sprite to the progress bar
    this.progressMiddleSprite = new Sprite(this.plugin, "demo_progress_middle.png", 17 + xOffset, 290, 8, 0);

	// Add the instruct sprite at the beginning
    this.instructionsSprite = new Sprite(this.plugin, "demo_instructions_bg.png", 115, 65, 250, 200);
    this.instructionsSprite.setVisibility(false);

	// Add the "ok" button the allow the user to continue
    this.instructionsButton = new Button(this.plugin, "ok", 318, 79, 36, 28);
    this.instructionsButton.subscribe();
    this.instructionsButton.setVisibility(false);
    this.instructionsButton.upCallback(this, "hideInstructions");

	// Add the label for "Instructions:"
    this.instructionsLabel = new Label(this.plugin, "Instructions:", 3, 130, 200, 200, 50);
    this.instructionsLabel.setColor(1.0, 1.0, 1.0, 0.0);
    this.instructionsLabel.setCaptionColor(0.0, 0.0, 0.0, 1.0);
    this.instructionsLabel.setVisibility(false);

	// Add the label for the instruction text
    this.instructionsTextLabel = new Label(this.plugin, "Placeholder", 1, 130, 100, 200, 100);
    this.instructionsTextLabel.setColor(1.0, 1.0, 1.0, 0.0);
    this.instructionsTextLabel.setCaptionColor(0.0, 0.0, 0.0, 1.0);
    this.instructionsTextLabel.setVisibility(false);
    this.instructionsTextLabel.setWrap(true);

    // Setup the promblem area label layers
    this.problemLayer = new Layer(this.plugin, 0, 0, 480, 320);
    this.problemLayer.setColor(0.88, 0.88, 0.88, 1.0);
    this.problemLayer.addChild(this.layoutFrameSprite);

    // Setup the curtain layer to darken the screen
    this.curtainLayer = new Layer(this.plugin, 0, 0, this.width, this.height);
    this.curtainLayer.setColor(0.0, 0.0, 0.0, 0.0);
    this.curtainLayer.addChild(this.instructionsSprite);
    this.curtainLayer.addChild(this.instructionsButton);

    this.panelState = {
        RETRACTED  : 0,
        EXTENDING  : 1,
        EXTENDED   : 2,
        RETRACTING : 3
    };

    // Initialize the state machine
    this.bottomPanelState = this.panelState.RETRACTED;
    this.answerPanelState = this.panelState.RETRACTED;

    // Controls whether the panels are locked
	this.bottomPanelLock = false;
    this.answerPanelLock = false;

	// Setup the scene array
    this.sceneArray = [];
	this.quizNames = [];
    for(var j = 0; j < sceneDescriptor.length; j++) {
        this.sceneArray[j] = new Scene(this.plugin);
		this.quizNames.push("Q"+(j+1));
		logDebug("Scene created " + this.quizNames);
    }

    // CLIPPING INFORMATION FOR PLUGIN
    // Ask Anson before fux0ring with this plz
    this.headerClipping = 60;
    this.footerClipping = 25;

	// -------------------------------------------------------------------------
    // Functions

	// -------------------------------------------------------------------------
    // Returns the cliping information for the top and the bottom of the plugin
    this.getWindowClipping = new function() {
    		logDebug("Clipping infromation called, header: "+ this.headerClipping + " footer: " + this.footerClipping);
        return [this.headerClipping, this.footerClipping];
    };

	// -------------------------------------------------------------------------
    // Set up callback functions for the show answer button
    this.showAnswer = function(x, y) {
   		var scene = this.getCurrentScene();

        //logDebug("Show answer scene: " + scene);
		scene.showCorrectAnswer();
	};

    // -------------------------------------------------------------------------
    // Set up callback functions for the submit button
    this.submitAnswer = function() {
        if( this.totalFinished === this.totalScenes || this.getCurrentScene().getCompleted() ) {
        		logError("The demo tried to submit a question after it's done answering all the questions.");
            return;
        }

		// Check if answer is right or not
        if(this.getCurrentScene().checkAnswer()) {

			// If the user was correct then update progress and set scene bits
			logDebug("Check answer true");
			this.totalFinished = this.totalFinished + 1;
			this.updateProgress();
			this.getCurrentScene().setCorrect(true);
			this.getCurrentScene().setCompleted(true);

			// Send the correct message to the server
			this.persistentSubmission(this);
		} else {

			// If the user was incorrect subtract a try from the scene
			logDebug("Check answer false");
            this.getCurrentScene().decrementTries();
            if(this.getCurrentScene().getTries() === 0) {

            		// Update progress and set scene bits
				this.totalFinished = this.totalFinished + 1;
				this.updateProgress();
				this.getCurrentScene().setCorrect(false);
				this.getCurrentScene().setCompleted(true);

				// Send the correct message to the server and show the answer
				this.persistentSubmission(this);
				this.showAnswer();
            }
        }

        // Update the UI to reflect the new state changes
        this.drawUI();
    };

	// -------------------------------------------------------------------------
    // Set up the bottom panel callback
    this.bottomPanelHoverCallback = function(x, y) {
    		// Check if state of bottom panel is retracted then extend the bottom panel
        if(this.bottomPanelState === this.panelState.RETRACTED) {
            this.extendBottomPanel();
        }
    };

	// ---------------------------------------------------------------------
    // Set up the answer panel callback
    this.answerPanelHoverCallback = function(x, y) {
    		// Check if state of answer panel is retracted then extend the answer panel
        if(this.answerPanelState === this.panelState.RETRACTED) {
            this.extendAnswerPanel();
        }
    };

	// ---------------------------------------------------------------------
    // Set up the problem area callback
    this.problemAreaHoverCallback = function(x, y) {
    		// Check if the answer panel is extended then retract the answer panel
        if(this.answerPanelState === this.panelState.EXTENDED) {
            this.retractAnswerPanel();
        // Check if the answer panel is extending then set the waiting bit to retract after extension
        } else if(this.answerPanelState === this.panelState.EXTENDING) {
            this.waitingToRetractAnswer = true;
        }

        // Check if the bottom panel is extended then retract the bottom panel
        if(this.bottomPanelState === this.panelState.EXTENDED) {
            this.retractBottomPanel();
        // Check if the bottom panel is extending then set the waiting bit to retract after extension
        } else if(this.bottomPanelState === this.panelState.EXTENDING) {
            this.waitingToRetractBottom = true;
        }
    };

	// ---------------------------------------------------------------------
    // Retract the answer panel
	this.retractAnswerPanel = function() {
		// Check if the answer panel is locked before retracting it
        if(!this.answerPanelLock) {
        		// Set the answer panel state to retracting and the arrows the by visible
            this.answerPanelState = this.panelState.RETRACTING;
			this.answerPanelHoverArrowSprite.setVisibility(true);

			// Set the tweens to retract the answer panel and a callback when complete
			this.answerPanelLayer.addTween("x:480,persistent:true,transition:ease_out,time:"+this.travelTime);
			setTimeout(this.answerMoveDone, (this.travelTime * 1000) + 250, this);
        }
	};

	// ---------------------------------------------------------------------
    // Extend the answer panel
	this.extendAnswerPanel = function() {
		// Check if the answer panel is locked before extending it
        if(!this.answerPanelLock) {
        		// Set the answer panel state to extending and the arrows the by invisible
            this.answerPanelState = this.panelState.EXTENDING;
			this.answerPanelHoverArrowSprite.setVisibility(false);

			// Set the tweens to extend the answer panel and a callback when complete
			this.answerPanelLayer.addTween("x:415,persistent:true,transition:ease_out,time:"+this.travelTime);
			setTimeout(this.answerMoveDone, (this.travelTime * 1000) + 250, this);
        }
	};

	// ---------------------------------------------------------------------
    // Retract the bottom panel
	this.retractBottomPanel = function() {
		// Check if the bottom panel is locked before retracting it
        if(!this.bottomPanelLock) {
      		// Set the bottom panel state to retracting and the arrows the by visible
            this.bottomPanelState = this.panelState.RETRACTING;
            this.bottomPanelHoverArrowSprite.setVisibility(true);

            // Set the tweens to retract the bottom panel and a callback when complete
            this.bottomPanelLayer.addTween("y:-51,persistent:true,transition:ease_out,time:"+this.travelTime);
			setTimeout(this.bottomMoveDone, (this.travelTime * 1000) + 250, this);
        }
	};

	// ---------------------------------------------------------------------
    // Extend the bottom panel
	this.extendBottomPanel = function() {
		// Check if the bottom panel is locked before extending it
        if(!this.bottomPanelLock) {
        		// Set the bottom panel state to extending and the arrows the by invisible
            this.bottomPanelState = this.panelState.EXTENDING;
            this.bottomPanelHoverArrowSprite.setVisibility(false);

            // Set the tweens to retract the answer panel and a callback when complete
            this.bottomPanelLayer.addTween("y:0,persistent:true,transition:ease_out,time:"+this.travelTime);
			setTimeout(this.bottomMoveDone, (this.travelTime * 1000) + 250, this);
        }
	};

	// ---------------------------------------------------------------------
    // Called when the answer panel is done moving
	this.answerMoveDone = function(instance) {
		// Check if the answer panel is state is extending
        if(instance.answerPanelState === instance.panelState.EXTENDING) {
			// Check if the waitingToRetractAnswer bit is set
            if(instance.waitingToRetractAnswer) {
            		// Start answer panel retraction and turn off the bit
                instance.retractAnswerPanel();
                instance.waitingToRetractAnswer = false;
            } else {
            		// Change the answer panel state to be fully extended
                instance.answerPanelState = instance.panelState.EXTENDED;
            }
        // Check if the answer panel is state is retracting
        } else if (instance.answerPanelState === instance.panelState.RETRACTING) {
        		// Change the answer panel state to be fully retracted
            instance.answerPanelState = instance.panelState.RETRACTED;
        }
	};

	// ---------------------------------------------------------------------
    // Called when the bottom panel is done moving
	this.bottomMoveDone = function(instance) {
		// Check if the bottom panel is state is extending
        if(instance.bottomPanelState === instance.panelState.EXTENDING) {
       		// Check if the waitingToRetractBottom bit is set
            if(instance.waitingToRetractBottom) {
            		// Start bottom panel retraction and turn off the bit
                instance.retractBottomPanel();
                instance.waitingToRetractBottom = false;
            } else {
            		// Change the bottom panel state to be fully extended
                instance.bottomPanelState = instance.panelState.EXTENDED;
            }
        // Check if the bottom panel is state is retracting
        } else if (instance.bottomPanelState === instance.panelState.RETRACTING) {
        		// Change the bottom panel state to be fully retracted
            instance.bottomPanelState = instance.panelState.RETRACTED;
        }
	};

	// ---------------------------------------------------------------------
    // Callback for the reset button
	this.resetButtonClickCallback = function(x, y) {
		// Check if in explore mode
		if(this.boolExploring === true) {
			// Reset explore mode
			this.scnExplore.resetQuiz();
			// Run the init script for explore mode
			if(this.funcExploreInit !== null) this.funcExploreInit();
		} else {
			// Reset the question and run the load quiz again
			this.getCurrentScene().resetQuiz();
  	  	}
    };

    // ---------------------------------------------------------------------
    // Change the demo's title
    this.setTitle = function(title) {
        this.titleLabel.setText(title);
    };

    // ---------------------------------------------------------------------
    // Change the number of tries on the indicated scene
    this.setTries = function(tries, scene) {
        if(typeof tries !== "number") {
			logError("Demo tried to set the number of tries with a non-numeric varible.");
            return;
        }
        scene.setTries(tries);
    };

    // ---------------------------------------------------------------------
    // Returns the scene object at the specified indices
    this.getScene = function(scene, step) {
        return this.sceneArray[scene];
    };

    // ---------------------------------------------------------------------
    // Returns the scene object currently being presented
    this.getCurrentScene = function() {
        return this.getScene( this.currentScene );
    };

    // ---------------------------------------------------------------------
    // Returns an array with the scene number and the step number
    this.getSceneNumber = function() {
        return this.currentScene;
    };

    // ---------------------------------------------------------------------
    // Returns a flat array with each scene's id
    this.getFlatSceneIdList = function() {
        var flatSceneIdList = new Array();
		flatSceneIdList.push(this.scnExplore.getId());

        // Populate the flat ID array with the ID with the ID for every scene
        for (var i = 0; i < this.sceneArray.length; i++) {
            flatSceneIdList.push(this.sceneArray[i].getId());
        }
        return flatSceneIdList;
    };

    // ---------------------------------------------------------------------
    // Returns a flat array with each scene
    this.getFlatSceneList = function() {
        var flatSceneList = new Array();
		flatSceneList.push(this.scnExplore);

        // Populate the flat scene array with the refence for every scene
        for (var i = 0; i < this.sceneArray.length; i++) {
            flatSceneList.push(this.sceneArray[i]);
        }
        return flatSceneList;
    };

    // ---------------------------------------------------------------------
    // Called when the preloader has finished completely
    this.donePreload = function() {
		// Show 100% complete progress bar
        that.preload_loadingbar.setDimensions(240, 14);

		that.plugin.setScene(that.sceneArray[0].getId());
        that.showInstructions();

        logDebug("Preload complete");
    };

	// ---------------------------------------------------------------------
    // Called when the preloader has finished loading a single resource
    this.updatePreload = function(increment, total) {
		// Update the width based on precent done
        var width = 240 * (increment/total);
        that.preload_loadingbar.setDimensions(width, 14);
        logDebug("loaded: " + increment / total);
    };

    // ---------------------------------------------------------------------
    // Start the demo
    this.begin = function() {
        plugin.hideSpinner();

		// Create the flat scene list and id list
        sceneIdArray = this.getFlatSceneIdList();
        sceneArray = this.getFlatSceneList();

		// Register questions with the
		if (typeof register_questions === "function") {
			register_questions(this.demo_name, this.js_getNumberOfQuizzes(), this.js_getQuizNames());
		}

		// Build up explore mode
		if (this.funcExploreInit !== null) this.funcExploreInit();
		if (this.boolExplore) this.scnExplore.initQuiz();
		this.buildExplore();

		// Build up each scene and call initQuiz function
		for(var i = 0; i < this.sceneArray.length; i++) {
			this.sceneArray[i].initQuiz();
			this.buildScene(this.sceneArray[i]);
        }

		// Start the preload
        logDebug("starting preload");
        this.preload_layer.bind("preload_update", this.updatePreload);
        this.preload_layer.bind("preload_complete", this.donePreload);
        this.plugin.preload(this.preload_layer.getId(), sceneIdArray);
    };

    // ---------------------------------------------------------------------
    // Set up the next scene
    this.nextScene = function() {
		clearTimeout(this.submissionRetryID);

        // Check if current scene is the last one
        if(this.currentScene  === this.totalScenes) {
            return;
        }
        this.getCurrentScene().cleanUp();

        // We are out of steps
        if(this.currentScene == this.sceneArray.length - 1) {
            this.nextSceneButton.setActive(false);
            return;
        }

        // Increment the scene and change it
        this.currentScene++;
        this.changeScene(this.sceneArray[this.currentScene]);

		// If the question is complete but it doesn't has the response on the server then try to resend
		if( this.getCurrentScene().getCompleted() && !this.getCurrentScene().getServerStatus() ) {
			this.submissionRetryID = setTimeout(this.persistentSubmission, 8000, this);
			logDebug("Submissive number = " + this.submissionRetryID);
		}
    };

    // ---------------------------------------------------------------------
    // Changes the current scene to the one provided
    this.changeScene = function(scene) {
        this.plugin.setScene(scene.getId());
        this.drawUI();
		this.getCurrentScene().loadQuiz();
    };

    // ---------------------------------------------------------------------
    // Set up the previous scene
    this.prevScene = function() {
		clearTimeout(this.submissionRetryID);

		// Is this the frist step
        if(this.currentScene === 0) {
        		logDebug("Frist scene");
            return;
        // Decrement the scene and change it
        } else {
       		this.getCurrentScene().cleanUp();
            this.currentScene--;
            this.changeScene(this.sceneArray[this.currentScene]);
        }

		// If the question is complete but it doesn't has the response on the server then try to resend
		if( this.getCurrentScene().getCompleted() && !this.getCurrentScene().getServerStatus() ) {
			this.submissionRetryID = setTimeout(this.persistentSubmission,8000, this);
			logDebug("Submissive number = " + this.submissionRetryID);
		}
    };

    // ---------------------------------------------------------------------
    // Draw the current scene as well as the controls & menus
    this.drawUI = function() {
        var scene = this.getCurrentScene();
		//this.plugin.setScene(scene.getId());

		if(scene.strInstruction === "") {
			this.questionLabel.setVisibility(false);
		} else {
			this.questionLabel.setVisibility(true);
			this.questionLabel.setText(scene.strInstruction);
		}

        // Update correct/incorrect indicators
        if(scene.getCompleted()) {
            if(scene.getCorrect()) {
				// is correct so show check
                this.crossSprite.setVisibility(false);
                this.checkSprite.setVisibility(true);
            } else {
				// Is incorrect so shown 'X'
                this.crossSprite.setVisibility(true);
                this.checkSprite.setVisibility(false);
            }

			if( scene.getServerStatus() && this.boolSimulate ) {
				// received by server (simulated)
				this.wifiGreenSprite.setVisibility(false);
				this.wifiBlueSprite.setVisibility(true);
				this.wifiGreySprite.setVisibility(false);
				// receive by server
			} else if ( scene.getServerStatus() && !this.boolSimulate ) {
				this.wifiGreenSprite.setVisibility(true);
                this.wifiBlueSprite.setVisibility(false);
				this.wifiGreySprite.setVisibility(false);
            } else {
				// not received by server
				this.wifiGreenSprite.setVisibility(false);
                this.wifiBlueSprite.setVisibility(false);
				this.wifiGreySprite.setVisibility(true);
            }

			// Activate the answer button
            this.submitButton.setActive(false);
			this.answerButton.setActive(true);
			this.readyButton.setActive(false);

			// Set the answer button to be visible
	  	  	this.submitButton.setVisibility(false);
		    this.answerButton.setVisibility(true);
		    this.readyButton.setVisibility(false);
        } else {
			// Set check and "X" icon off
			this.crossSprite.setVisibility(false);
            this.checkSprite.setVisibility(false);

			// Set all the wifi icons off
			this.wifiGreySprite.setVisibility(false);
			this.wifiGreenSprite.setVisibility(false);
			this.wifiBlueSprite.setVisibility(false);

			// Show grey wifi if the user has tried at least once
			if(scene.getTries() != 3) {
				this.wifiGreySprite.setVisibility(true);
				this.crossSprite.setVisibility(true);
			}

			// Activate the submit button
			this.submitButton.setActive(true);
			this.answerButton.setActive(false);
			this.readyButton.setActive(false);

			// Set the submit button to be visible
	  	  	this.submitButton.setVisibility(true);
		    this.answerButton.setVisibility(false);
		    this.readyButton.setVisibility(false);
        }

        // Update the next scene buttons
        if( !(this.currentScene === this.sceneArray.length - 1) ) {
			// If the question is complete and not at the end of the demo set next button to be active
            if(scene.getCompleted()) {
                this.nextSceneButton.setActive(true);
            //Else set next button to be inactive
            } else {
                this.nextSceneButton.setActive(false);
            }
        // If on the last question set next button to be inactive
        } else {
            this.nextSceneButton.setActive(false);
        }

        // Update the previous scene buttons
        if(!(this.currentScene === 0)) {
        		// If NOT on the frist question set previous button to be active
            this.previousSceneButton.setActive(true);
        } else {
       	 	// If on the frist question set previous button to be inactive
            this.previousSceneButton.setActive(false);
        }

		//
        this.triesLabel.setText("Quiz: Submission chances left " + scene.getTries());
    };

    // ---------------------------------------------------------------------
    // Update the progress bar to reflect the current state of the demo
    this.updateProgress = function() {
        	var progressWidth = 0;
        if(this.totalFinished === 0) {
			logError("The demo has tried to up date the progress with 0 totalFinished");
            return;
        }

		// Set the progress bar text to update the totalFinished
        this.progressBarCount.setText("(" + this.totalFinished + "/" + this.totalScenes + ")");

		if(this.totalFinished === 1 && this.totalScenes !== 1) {
            // Remaining percentage of scenes
			progressWidth = (this.totalFinished / this.totalScenes)*94;
            this.progressMiddleSprite.setDimensions(progressWidth, 20);

            // Add the left "cap" to the progress bar
            this.progressLeftSprite.setVisibility(true);
        } else if (this.totalFinished == this.totalScenes) {

        		// Setup the middle and right cap to make it look complete
            this.progressMiddleSprite.setDimensions(109, 20);
            this.progressRightSprite.setVisibility(true);
        } else {

            // We are somewhere in the middle of the scene list
            progressWidth = (this.totalFinished / this.totalScenes)*94;
            this.progressMiddleSprite.setDimensions(progressWidth, 20);
            this.progressRightSprite.setVisibility(false);
            this.progressLeftSprite.setVisibility(true);
        }
    };

	// ---------------------------------------------------------------------
    // Show the curtain and disable the interactive events
	this.showCurtain = function() {
		this.curtainLayer.setColor(0.0, 0.0, 0.0, 0.25);
		this.plugin.setInteractive(false);
	};

	// ---------------------------------------------------------------------
    // Hide the curtain and enable the interactive events
	this.hideCurtain = function() {
		this.curtainLayer.setColor(0.0, 0.0, 0.0, 0.0);
		this.plugin.setInteractive(true);
	};

    // ---------------------------------------------------------------------
    // Show the instructions panel (auto-show the curtain)
    this.showInstructions = function() {
		// Make the OK button active during the curtain
        this.plugin.addSpecial(this.instructionsButton.getId());
        this.showCurtain();

		// Set the instruction box to be visible
        this.instructionsSprite.setVisibility(true);
        this.instructionsLabel.setVisibility(true);
        this.instructionsTextLabel.setVisibility(true);
        this.instructionsButton.setVisibility(true);
        this.instructionsButton.subscribe();
    };

    // ---------------------------------------------------------------------
    // Hide the instructions panel
    this.hideInstructions = function() {
   		// Make the OK button active during the curtain
        this.plugin.removeSpecial(this.instructionsButton.getId());
        this.hideCurtain();

        // Set the instruction box to be invisible
        this.instructionsSprite.setVisibility(false);
        this.instructionsLabel.setVisibility(false);
        this.instructionsTextLabel.setVisibility(false);
        this.instructionsButton.setVisibility(false);
        this.instructionsButton.unsubscribe();

        // Test if explore mode has been defined otherwise goto question 1
        if (this.funcExploreInit !== null || this.boolExplore) {
       	 	this.startExplore();
        } else {
			this.changeScene(this.sceneArray[0]);
        }
    };

    // ---------------------------------------------------------------------
    // Change the actual text displayed in the instructions panel
    this.setInstructionText = function(text) {
        if(typeof text != "string") {
            logError("Cannnot set text of label to non-string value");
            return;
        }
        this.instructionsTextLabel.setText(text);
    };

	// ---------------------------------------------------------------------
    // The tell the template that the question has been answered correctly
	this.gotoScene = function(numQ, numS) {
		var scene = this.getScene(numQ, numS);
		this.currentScene = numQ;
		this.changeScene(scene);
	};

	// ---------------------------------------------------------------------
    // Calls the current scenes clean up frist
    this.gotoExplore = function() {
    		this.getCurrentScene().cleanUp();
    		this.startExplore();
    };

    // ---------------------------------------------------------------------
    // Draw the current scene as well as the controls & menus
    this.buildScene = function(scene) {
		// Add the problem layer, developer backgrond the the question label
		scene.addChild(this.problemLayer);
   		scene.addChild(scene.bgLayer);
        scene.addChild(this.questionLabel);

		// Add the panels
        scene.addChild(this.answerPanelLayer);
        scene.addChild(this.bottomPanelLayer);

        	// Add the progress bar
		scene.addChild(this.progressBarSprite);
		scene.addChild(this.progressMiddleSprite);
		scene.addChild(this.progressLeftSprite);
		scene.addChild(this.progressRightSprite);
    	    scene.addChild(this.progressBarLabel);
        scene.addChild(this.progressBarCount);

        // Add back to phone gap button if mobile
        if(this.boolMobile) scene.addChild(this.backToPG);

		// Add the curtain and everything that should be displayed over it
        scene.addChild(this.curtainLayer);
        scene.addChild(this.instructionsLabel);
        scene.addChild(this.instructionsTextLabel);
	};

	// ---------------------------------------------------------------------
    // Build the scene for explore mode
	this.buildExplore = function() {
		logDebug("Building up explore mode");

		// Add the problem layer, developer backgrond the the question label
		this.scnExplore.addChild(this.problemLayer);
		this.scnExplore.addChild(this.expLayer);
		this.scnExplore.addChild(this.scnExplore.bgLayer);
		this.scnExplore.addChild(this.questionLabel);

		// Add the panels
		this.scnExplore.addChild(this.answerPanelLayer);
        this.scnExplore.addChild(this.bottomPanelLayer);

		// Add the progress bar
	    this.scnExplore.addChild(this.progressBarSprite);
  	  	this.scnExplore.addChild(this.progressMiddleSprite);
  	  	this.scnExplore.addChild(this.progressLeftSprite);
   	 	this.scnExplore.addChild(this.progressRightSprite);
        this.scnExplore.addChild(this.progressBarLabel);
        this.scnExplore.addChild(this.progressBarCount);

        // Add back to phone gap button if mobile
        if(this.boolMobile) this.scnExplore.addChild(this.backToPG);

		// Add the curtain and everything that should be displayed over it
        this.scnExplore.addChild(this.curtainLayer);
        this.scnExplore.addChild(this.instructionsLabel);
        this.scnExplore.addChild(this.instructionsTextLabel);
	};

	// ---------------------------------------------------------------------
    // Start explore mode
    this.startExplore = function() {
		logDebug("Starting in explore mode");

		// Record the current scene and change to explore mode
    		this.scnLast = this.getCurrentScene();
		this.plugin.setScene(this.scnExplore.getId());

		// Use the internal instruction unless it is empty
		if(this.scnExplore.strInstruction === "") {
			this.questionLabel.setVisibility(false);
		} else {
			this.questionLabel.setVisibility(true);
			this.questionLabel.setText(this.scnExplore.strInstruction);
		}

        	// Set the ready button to be active
		this.submitButton.setActive(false);
		this.answerButton.setActive(false);
		this.readyButton.setActive(true);
		this.exploreButton.setActive(false);

		// Set the ready button to be visible
  	  	this.submitButton.setVisibility(false);
        this.answerButton.setVisibility(false);
        this.readyButton.setVisibility(true);

		// Set the all the status symbols to false
		this.crossSprite.setVisibility(false);
		this.checkSprite.setVisibility(false);
		this.wifiGreenSprite.setVisibility(false);
        this.wifiBlueSprite.setVisibility(false);
		this.wifiGreySprite.setVisibility(false);

		// Run explore mode load function
		if(this.funcExploreInit !== null) {
			this.funcExploreInit();
		}
		this.boolExploring = true;
		this.scnExplore.loadQuiz();
    };

    // ---------------------------------------------------------------------
    // End explore mode
    this.endExplore = function() {
		logDebug("Exiting explore mode");

		// Set the subbit button to be active
        this.submitButton.setVisibility(true);
		this.answerButton.setVisibility(false);
        this.readyButton.setVisibility(false);

		// Set the subbit button to be visible
		this.submitButton.setActive(true);
		this.answerButton.setActive(false);
		this.readyButton.setActive(false);
		this.exploreButton.setActive(true);

		// Run the clean function for explore mode
		if(this.funcExploreCleanUp !== null) {
			this.funcExploreCleanUp();
		}
		this.boolExploring = false;
		this.scnExplore.cleanUp();

		// Return to the original question
		if(typeof this.scnLast !== 'undefined') this.changeScene(this.scnLast);
    };

    // ---------------------------------------------------------------------
    // Get the demo name for the quiz
    this.js_getDemoName = function() {
		return this.demo_name;
	};

	// ---------------------------------------------------------------------
    // Set the demo name for the quiz
    this.js_setDemoName = function(passName) {
		this.demo_name = passName;
	};

	// ---------------------------------------------------------------------
    // Gets the number of quizzes in demo
    this.js_getNumberOfQuizzes = function() {
		return this.sceneArray.length;
	};

	// ---------------------------------------------------------------------
    // Gets the number of quizzes in demo
    this.js_getQuizNames = function() {
		return this.quizNames;
	};

	// ---------------------------------------------------------------------
    // Gets the number of quizzes in demo
    this.js_onQuizSubmit = function( result1, result2 ) {
		logDebug("answer received by server result1:" + result1 + " result2:" + result2);

		// Set server status to true
		var intQuiz = parseInt(result1.substr(1), 10) - 1;

		this.sceneArray[intQuiz].serverStatus = true;

		// Clear previous timer
		clearTimeout(this.submissionRetryID);

		if (result2 ==  "Simulate") {
			//  Set wifi to the blue symbol
			this.boolSimulate = true;
		} else {
			//  Set wifi to the green symbol
			this.boolSimulate = false;
		}

		this.drawUI();
	};

	// ---------------------------------------------------------------------
    // Gets the number of quizzes in demo
	this.persistentSubmission = function(that) {
		// Clear previous timer
		clearTimeout(that.submissionRetryID);
		var strQuiz = "Q" + (that.currentScene + 1);

		// If the javascript is not on a remote server then use server simulation
		if (this.boolSimulate)	{
			that.js_onQuizSubmit(strQuiz, "Simulate");
			that.boolSimulate = true;
			return;
		} else {
			submit_demo_quiz_answer(that.demo_name, strQuiz, that.getCurrentScene().getCorrect(), function() { that.js_onQuizSubmit(strQuiz, "THM"); });
			that.boolSimulate = false;
		}

		// Set timer to try sending data again in 8 seconds
		that.submissionRetryID = setTimeout(that.persistentSubmission,8000, that);
		logDebug(that.submissionRetryID + " id: Try submission");

		return;
	};

	return true;
}
