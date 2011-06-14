function startDemo(plugin, media) {
	var mediaURL = media;
	var slugUUID = "9d1afea3-8202-5739-99b3-1ebe7eed0db4_";
	// --------------------------------------------------------------------------------------------
	// THM Slider.js
	// The slider class

	function THM_Slider(plugin, x, y, width, height) {
	    this.plugin = plugin;

	    if(!x) { this.x = 0; } else { this.x = x; }
	    if(!y) { this.y = 0; } else { this.y = y; }
	    if(!width) { this.width = 0; } else { this.width = width; }
	    if(!height) { this.height = 0; } else { this.height = height; }

		// Create a background label to add all the sprites and callbacks to
	   	this.lyrBG = new Layer(this.plugin, this.x, this.y, this.width, this.height);
	   	this.lyrBG.setColor(0.0, 0.0, 0.0, 0.0);

		// Create sensor sprite that grabs mousRadioButton.prototype = new Osmosis();e events about the
	   	this.sprSensor = new Sprite(this.plugin, "", -480, -320, 960, 640);
	   	this.sprSensor.setVisibility(false);
	   	this.sprSensor.upCallback(this, "mouseUp");
	   	this.sprSensor.moveCallback(this, "mouseMove");
	   	this.lyrBG.addChild(this.sprSensor);

	    // Set this object ID to be the same as the background layer ID
	   	this.id = this.lyrBG.getId();

		// Set slider valuesRadioButton.prototype = new Osmosis();
		this.max = 1;
		this.min = 0;
		this.value = 1;

		// Leave function point undefined
		this.funcChange = undefined;
		this.funcUp = undefined;

		// Create the track sprite
	   	this.sprTrack = new Sprite(this.plugin, mediaURL + slugUUID + "shadow_track.png", this.width * 0.33, 0, this.width * 0.33, this.height);
		this.sprTrack.setShape("square");
		this.lyrBG.addChild(this.sprTrack);

		// Create the checkmark sprite and make invisible
	   	this.sprSlider = new Sprite(this.plugin, mediaURL + slugUUID + "shadow_slider.png", 0, 0, this.width, this.height * 0.25);
	   	this.sprSlider.setShape("square");
		this.sprSlider.downCallback(this, "mouseDown");
		this.sprSlider.subscribe();
		this.sprSlider.setDrag();
	   	this.sprSlider.setDragRegion(0.0, 0.0, this.width, this.height);
	   	this.lyrBG.addChild(this.sprSlider);

	   	// Save the graphical range
		this.range = this.sprTrack.height - this.sprSlider.height;

		// internal mouse down event
		this.mouseDown = function(x,y) {
			this.sprSensor.subscribe();
			logDebug("mouse down");
		};

		// internal mouse move event
		this.mouseMove = function(x,y) {
			this.updateValue(x,y);
		};

		// internal mouse up event
		this.mouseUp = function(x,y) {
			this.updateValue(x,y);
			this.sprSensor.unsubscribe();
			if(this.funcUp !== undefined) this.funcUp();
			logDebug("mouse up value "+this.value);
		};

		// Update
		this.updateValue = function(x,y) {
			// Get the current mouse position inside of this control
			var posY = y - this.y - (this.sprSlider.height * 0.5);

			// Limit below 0
			if (posY < 0)
				posY = 0;

			// Limit above rangethis.width
			if (posY > this.range)
				posY = this.range;

			// Figure the value based on intMin and intMax
			var ratio = (this.range - posY) / this.range;
			this.value = (ratio * (this.max - this.min));

			if(this.funcChange !== undefined) this.funcChange();
		};
	}
	THM_Slider.prototype = new Osmosis();

	// --------------------------------------------------------------------------------------------
	// THM Graph.js
	// The Graph class

	function THM_Graph(plugin, arr, x, y, width, height) {
	    this.plugin = plugin;

	    if(!x) { this.x = 0; } else { this.x = x; }
	    if(!y) { this.y = 0; } else { this.y = y; }
	    if(!width) { this.width = 0; } else { this.width = width; }
	    if(!height) { this.height = 0; } else { this.height = height; }

		// Create a background label to add all the sprites and callbacks to
	   	this.lyrBG = new Layer(this.plugin, this.x, this.y, this.width, this.height);
	   	this.lyrBG.setColor(0.0, 0.0, 0.0, 0.0);

	    // Set this object ID to be the same as the background layer ID
	   	this.id = this.lyrBG.getId();

		var yMax = 0;
		for(var i = 0; i < arr.length; i++) {
			if(yMax < arr[i]) yMax = arr[i];
		}

		var lastX = 0;
		var lastY = (arr[0] / yMax) * this.height;
		var stepX = (1 / arr.length) * this.width;

		this.nLine = new Array();
		this.nPoints = new Array();
		this.nOrg = new Array();

		this.nPoints.push(new Point(lastX, lastY));
		this.nOrg.push(new Point(lastX, lastY));

		for(i = 1; i < arr.length; i++) {
			this.nLine[i-1] = new Line(this.plugin, lastX, lastY, lastX + stepX, (arr[i] / yMax) * this.height);
			//this.nLine[i-1].setThickness(2);
			this.nLine[i-1].setColor(0.0, 0.0, 0.0, 1.0);
			this.lyrBG.addChild(this.nLine[i-1]);
			this.nPoints.push(new Point(lastX + stepX, (arr[i] / yMax) * this.height));
			this.nOrg.push(new Point(lastX + stepX, (arr[i] / yMax) * this.height));

			lastX += stepX;
			lastY = (arr[i] / yMax) * this.height;
		}

		this.offsetPoints = function(x,y) {
			for(var i = 0; i < this.nOrg.length; i++) {
				this.nPoints[i].x = this.nOrg[i].x + x;
				this.nPoints[i].y = this.nOrg[i].y + y;
			}
		};

		this.setColor = function(r,g,b,a) {
			for(var i = 1; i < arr.length; i++) {
				this.nLine[i-1].setColor(r,g,b,a);
			}
		};
	}
	THM_Graph.prototype = new Osmosis();

	// --------------------------------------------------------------------------------------------
	// Marker.js
	// The intersection marker class

	function Marker(plugin, x, y) {
	    this.plugin = plugin;

	    if(!x) { this.x = 0; } else { this.x = x; }
	    if(!y) { this.y = 0; } else { this.y = y; }
	    this.width = 0;
	    this.height = 0;

		// Create a background label to add all the sprites and callbacks to
	   	this.lyrBG = new Layer(this.plugin, this.x, this.y, 0.0, 0.0);
	   	this.lyrBG.setColor(0.0, 0.0, 0.0, 0.0);

		this.downLine = new Line(this.plugin, 0, 0, 0, -200);
	   	this.lyrBG.addChild(this.downLine);

	   	this.sprMarker = new Sprite(this.plugin, mediaURL + slugUUID + "intersectMarker.png", -8, -8, 16, 16);
	   	this.sprMarker.setShape("square");
	   	this.lyrBG.addChild(this.sprMarker);

	    // Set this object ID to be the same as the background layer ID
	   	this.id = this.lyrBG.getId();
	}
	Marker.prototype = new Osmosis();

	function THM_CustomButton(plugin, text, x, y, width, height){
		this.plugin = plugin;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.borderCol = new Array(0,0,0,1);
		this.bgCol = new Array(0.5,0.5,0.5,1);
		this.textCol = new Array(0,0,0,1);

		this.text = text;
		this.fontSize = 12;
		this.highlight = false;

		//the main layer
		this.layer = new Layer(this.plugin, this.x, this.y, this.width, this.height);
		this.layer.setColor(0.0,0.0,0.0,0.0);
		this.id = this.layer.getId();

		// Creat background
		this.background = new Primitive(this.plugin, "rectangle", 0.0, 0.0, this.width, this.height);
		this.background.setColor(this.bgCol[0], this.bgCol[1], this.bgCol[2], this.bgCol[3]);
		this.background.setBorderColor(this.borderCol[0], this.borderCol[1], this.borderCol[2], this.borderCol[3]);
		this.background.setBorderWidth(2);
		this.layer.addChild(this.background);

		//invisible sprite for button actions
		this.inv = new Sprite(this.plugin, "", 0.0, 0.0, this.width, this.height);
		this.inv.setVisibility(false);
		this.inv.upCallback(this, "invOut");
		this.inv.downCallback(this, "invOver");
		this.inv.subscribe();
		this.layer.addChild(this.inv);

		this.label = new Label(this.plugin, this.text, this.fontSize, -2, 2, this.width*2, this.height-4);
		this.label.setVisibility(true);
		this.label.setWrap(true);
		this.label.setColor(0,0,0,0);
		this.label.setCaptionColor(this.textCol[0], this.textCol[1], this.textCol[2], this.textCol[3]);
		this.layer.addChild(this.label);

		//borders
		this.setBorderColor = function(col1,col2,col3,col4){
			this.borderCol = new Array(col1,col2,col3,col4);
			this.background.setBorderColor(col1,col2,col3,col4);
		};
		//background
		this.setColor = function(col1,col2,col3,col4){
			this.bgCol = new Array(col1,col2,col3,col4);
			this.background.setColor(col1,col2,col3,col4);
		};

		this.invOver = function(x,y){
			logDebug("over");
			if(!this.highlight) {
				this.setBorderColor(this.borderCol[0]+0.1, this.borderCol[1]+0.1, this.borderCol[2]+0.1, this.borderCol[3]);
				this.setColor(this.bgCol[0]+0.1, this.bgCol[1]+0.1, this.bgCol[2]+0.1, this.bgCol[3]);
				this.label.setCaptionColor(this.textCol[0]-0.1, this.textCol[1]-0.1, this.textCol[2]-0.1, this.textCol[3]);
				this.highlight = true;
			}
		};
		this.invOut = function(x,y){
			logDebug("out");
			if(this.highlight) {
				this.setBorderColor(this.borderCol[0]-0.1, this.borderCol[1]-0.1, this.borderCol[2]-0.1, this.borderCol[3]);
				this.setColor(this.bgCol[0]-0.1, this.bgCol[1]-0.1, this.bgCol[2]-0.1, this.bgCol[3]);
				this.label.setCaptionColor(this.textCol[0]+0.1, this.textCol[1]+0.1, this.textCol[2]+0.1, this.textCol[3]);
				this.highlight = false;
			}
		};
		this.upCallback = function(object, func){
			this.inv.upCallback(object, func);
		};
		this.downCallback = function(object, func){
			this.inv.downCallback(object, func);
		};

		//label
		this.setCaptionColor = function(col1, col2, col3, col4){
			this.textColor = new Array(col1, col2, col3, col4);
			this.label.setCaptionColor(col1, col2, col3, col4);
		};

		this.setText = function(text){
			this.text = text;
			this.label.setText(this.text);
		};

		this.subscribe = function(){
			this.inv.subscribe();
		};

		this.unsubscribe = function(){
			this.inv.unsubscribe();
		};
	}
	THM_CustomButton.prototype = new Osmosis();

	//------------------------------------------------------------------------------
	// Preamble & initialization
	DEBUG_MODE = false;

	logDebug("Body start");
	var p = plugin;
	var thmDemo = new THP_Template(p, 545, 371, 2);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("See how changes in spending can affect 2 sets of curves.");
	thmDemo.setTitle("The Crowding Out of Investment");

	thmDemo.questionLabel.setPosition(thmDemo.questionLabel.x, thmDemo.questionLabel.y + 3);

	var sprGraph1 = new Sprite(p,mediaURL + slugUUID + "graph1.png",0,0,480,320);
	sprGraph1.setShape("square");

	var sprGraph2 = new Sprite(p,mediaURL + slugUUID + "graph2.png",0,0,480,320);
	sprGraph2.setShape("square");
	sprGraph2.setVisibility(false);

	var nQuiz = 0;

	var graphX = 66;
	var graphY = 64;
	var graphType = false;

	var arrExp = new Array();
	var arrInv = new Array();
	for(var i = 0; i < 11; i++) {
		arrExp.push(i*i);
		arrInv.push((10.1-i)*(10.1-i));
	}

	var blueGraph = new THM_Graph(p, arrInv, graphX, graphY, 256, 166);
	blueGraph.setColor(0.0,0.0,1.0,1.0);

	var redGraph = new THM_Graph(p, arrExp, graphX, graphY, 256, 166);
	redGraph.setColor(1.0,0.0,0.0,1.0);

	var intersectMarker = new Marker(p, graphX, graphY);

	var slider = new THM_Slider(p, 10, 70, 48, 124);
	slider.min = 0.0;
	slider.max = 1.0;
	thmDemo.answerPanelLayer.addChild(slider);

	var btnChangeDisplay = new THM_CustomButton(p, "Change    display", 5, 210, 55, 40);
	btnChangeDisplay.setColor(0.2,0.6,0.9,1.0);
	btnChangeDisplay.setBorderColor(0.1,0.3,0.6,1.0);
	btnChangeDisplay.downCallback(this, "buttonDown");
	thmDemo.answerPanelLayer.addChild(btnChangeDisplay);

	var txtOutput = new TextBox(plugin, "", 12, 390, 68, 64, 24);

	var intAnimation = 0;
	var nCurrent = new Point(0,0);
	var nChange = new Point(0,0);
	var nStep = 5.0;

	var dropLayerQ1 = new Layer(p, 0, 0, 480, 320);
	dropLayerQ1.setColor(0,0,0,0);

	var lblBottomQ1 = new Label(p, "AD Direction", 12, 325, 130, 150, 25);
	lblBottomQ1.setCaptionColor(0,0,0,1);
	lblBottomQ1.setColor(0,0,0,0);
	dropLayerQ1.addChild(lblBottomQ1);

	var lblTopQ1 = new Label(p, "AS Direction", 12, 325, 195, 150, 25);
	lblTopQ1.setCaptionColor(0,0,0,1);
	lblTopQ1.setColor(0,0,0,0);
	dropLayerQ1.addChild(lblTopQ1);

	var dropLayerQ2 = new Layer(p, 0, 0, 480, 320);
	dropLayerQ2.setColor(0,0,0,0);

	var lblBottomQ2 = new Label(p, "ID Direction", 12, 325, 130, 150, 25);
	lblBottomQ2.setCaptionColor(0,0,0,1);
	lblBottomQ2.setColor(0,0,0,0);
	dropLayerQ2.addChild(lblBottomQ2);

	var lblTopQ2 = new Label(p, "NS Direction", 12, 325, 195, 150, 25);
	lblTopQ2.setCaptionColor(0,0,0,1);
	lblTopQ2.setColor(0,0,0,0);
	dropLayerQ2.addChild(lblTopQ2);

	var Drop1 = new DropDown(p, 325, 70, 100, 60);
	Drop1.addOption("Select One");
	Drop1.addOption("Left");
	Drop1.addOption("Right");
	Drop1.addOption("Reversed");
	Drop1.addOption("Up");
	Drop1.addOption("Down");
	Drop1.addOption("No Shift");
	Drop1.addOption("Rotated");
	Drop1.setDefaultOption("Select One");
	Drop1.updateText = function(text) {
        Drop1.text = text;
        txtOutput.setColor(1.0,0.7,0.2,0.7);
		txtOutput.subscribe();
		overlayDrop1.subscribe();
		overlayDrop2.subscribe();
    };

	dropLayerQ1.addChild(Drop1);
	dropLayerQ2.addChild(Drop1);

	var Drop2 = new DropDown(p, 325, 135, 100, 60);
	Drop2.addOption("Select One");
	Drop2.addOption("Left");
	Drop2.addOption("Right");
	Drop2.addOption("Reversed");
	Drop2.addOption("Up");
	Drop2.addOption("Down");
	Drop2.addOption("No Shift");
	Drop2.addOption("Rotated");
	Drop2.setDefaultOption("Select One");
	Drop2.updateText = function(text) {
        Drop2.text = text;
        txtOutput.setColor(1.0,0.7,0.2,0.7);
		txtOutput.subscribe();
		overlayDrop1.subscribe();
		overlayDrop2.subscribe();
    };

	dropLayerQ1.addChild(Drop2);
	dropLayerQ2.addChild(Drop2);

	var overlayDrop1 = new Label(p, "", 1, 325, 110, 100, 20);
	overlayDrop1.downCallback(this, "downDrop");
	overlayDrop1.setColor(0,0,0,0);
	dropLayerQ1.addChild(overlayDrop1);
	dropLayerQ2.addChild(overlayDrop1);

	var overlayDrop2 = new Label(p, "", 1, 325, 175, 100, 20);
	overlayDrop2.downCallback(this, "downDrop");
	overlayDrop2.setColor(0,0,0,0);
	dropLayerQ1.addChild(overlayDrop2);
	dropLayerQ2.addChild(overlayDrop2);

	//------------------------------------------------------------------------------
	// downDrop - triggers when the user clicks on a dropdown
	this.downDrop = function(x,y) {
		logDebug("Text box disabled");
		txtOutput.setColor(0,0,0,0.7);
		txtOutput.unsubscribe();
		overlayDrop1.unsubscribe();
		overlayDrop2.unsubscribe();
	}


	//------------------------------------------------------------------------------
	// buttonDown - triggers when the user clicks on the change display button
	this.buttonDown = function(x,y) {
		logDebug("Button press");
		graphType = !graphType;

		if(!graphType) {
			sprGraph1.setVisibility(true);
			sprGraph2.setVisibility(false);
		} else {
			sprGraph1.setVisibility(false);
			sprGraph2.setVisibility(true);
		}

		changeValue();
		if(!graphType) {
			redPoint = new Point(0.0, redGraph.y - graphY);
			bluePoint = new Point(0.0, (1.0 - slider.value) * 130);
			updateGraph(redPoint, bluePoint);
		}
	}

	//------------------------------------------------------------------------------
	// updateGraph - Update the graphs based on the passed offsets
	function updateGraph(offsetRed, offsetBlue) {
		var intersect = null;

		redGraph.offsetPoints(offsetRed.x, offsetRed.y);
		blueGraph.offsetPoints(offsetBlue.x, offsetBlue.y);

		for(var i = 0; i < blueGraph.nPoints.length - 1; i++) {
			for(var j = i; j < redGraph.nPoints.length - 1; j++) {
				intersect = lineIntersectLine(blueGraph.nPoints[i], blueGraph.nPoints[i+1], redGraph.nPoints[j], redGraph.nPoints[j+1]);
				//logDebug("test i:"+i+"("+blueGraph.nPoints[i]+")("+blueGraph.nPoints[i+1]+") j:"+j+"("+redGraph.nPoints[j]+")("+redGraph.nPoints[j+1]+") intersect:"+intersect);
				if(intersect !== null) {
					//logDebug("intersect found x:" + intersect.x + " y:" + intersect.y);
					if(	nQuiz === 0 && intersectMarker.y !== graphY + intersect.y) {
						var output = "";
						var ratio = intersect.y / redGraph.height;
						if(!graphType) {
							output = "" + Math.round((ratio * 97) + 60);
						} else {
							output = "" + Math.round((ratio * 5) + 1) + "%";
						}
						logDebug("output: " + output);
						txtOutput.setText(output)
					}

					if(redGraph.x !== offsetRed.x || redGraph.y !== offsetRed.y) {
						redGraph.setPosition(graphX + offsetRed.x, graphY + offsetRed.y);
					}

					if(blueGraph.x !== offsetBlue.x || blueGraph.y !== offsetBlue.y) {
						blueGraph.setPosition(graphX + offsetBlue.x, graphY + offsetBlue.y);
					}

					if(intersectMarker.x !== graphX + intersect.x || intersectMarker.y !== graphY + intersect.y ) {
						intersectMarker.setPosition(graphX + intersect.x, graphY + intersect.y);
					}
					return;
				}
			}
		}
	}

	//------------------------------------------------------------------------------
	// animationGraph - Animated the blue graph until it's in the right position
	function animationGraph() {
		var bDone = true;

		if( nCurrent.y >= nChange.y - nStep && nCurrent.y <= nChange.y + nStep ) {
			nCurrent.y = nChange.y;
		} else {
			if(nCurrent.y <= nChange.y) {
				nCurrent.y+=nStep;
			} else if(nCurrent.y >= nChange.y) {
				nCurrent.y-=nStep;
			}
			bDone = false;
		}

		if( nCurrent.x >= nChange.x - nStep && nCurrent.x <= nChange.x + nStep ) {
			nCurrent.x = nChange.x;
		} else {
			if(nCurrent.x <= nChange.x) {
				nCurrent.x+=nStep;
			} else if(nCurrent.x >= nChange.x) {
				nCurrent.x-=nStep;
			}
			bDone = false;
		}

		if(	bDone ) {
			thmDemo.hideCurtain();
			clearInterval(intAnimation);
		}

		var redPoint = new Point(redGraph.x - graphX, redGraph.y - graphY);
		var bluePoint = new Point(nCurrent.x, nCurrent.y);

		updateGraph(redPoint, bluePoint);
	}

	//------------------------------------------------------------------------------
	// changeValue - called when the slider changes values
	function changeValue() {
		var redPoint;
		var bluePoint;

		if(graphType) {
			redPoint = new Point(-170 + ((1.0 - slider.value) * 130), 0.0);
			bluePoint = new Point(0.0, 0.0);
		} else {
			redPoint = new Point(0.0, (1.0 - slider.value) * 105);
			bluePoint = new Point(0.0, blueGraph.y - graphY);
		}
		updateGraph(redPoint, bluePoint);

	}
	slider.funcChange = changeValue;

	//------------------------------------------------------------------------------
	// changeUp - called when the user releases the slider
	function changeUp() {
		var redPoint;
		var bluePoint;

		if(graphType) {
			redPoint = new Point(-170 + ((1.0 - slider.value) * 130), 0.0);
			bluePoint = new Point(0.0, 0.0);
			updateGraph(redPoint, bluePoint);
		} else {
			nCurrent.y = blueGraph.y - graphY;
			nChange.y = (1.0 - slider.value) * 100;
			intAnimation = setInterval(animationGraph, 105);
			thmDemo.showCurtain();
		}
	}
	slider.funcUp = changeUp;

	//------------------------------------------------------------------------------
	// Explore mode setup
	this.setupExplore = function() {
		// Set the boolean flag to turn on the explore mode
	    thmDemo.boolExplore = true;

		// Set the initialize function for explore mode
		thmDemo.scnExplore.initQuiz = function() {
			logDebug("Explore Init");

			thmDemo.scnExplore.bgLayer.addChild(blueGraph);
			thmDemo.scnExplore.bgLayer.addChild(redGraph);
			thmDemo.scnExplore.bgLayer.addChild(intersectMarker);
			thmDemo.scnExplore.bgLayer.addChild(sprGraph1);
			thmDemo.scnExplore.bgLayer.addChild(sprGraph2);
			thmDemo.scnExplore.bgLayer.addChild(txtOutput);

			// Set the explore mode question text
			thmDemo.scnExplore.strInstruction = "An increase in the budget deficit can crowd out investment. Use the slider on the control panel to change spending, press the blue button to change the display of data, or press Go to Quiz to continue.";
		};

		// Set the display function for explore mode
		thmDemo.scnExplore.loadQuiz = function() {
			nQuiz = 0;
			txtOutput.setColor(1.0,1.0,1.0,1.0);
			txtOutput.unsubscribe();

			graphType = false
			sprGraph1.setVisibility(true);
			sprGraph2.setVisibility(false);

			changeValue();

			var redPoint = new Point(0.0, redGraph.y - graphY);
			var bluePoint = new Point(0.0, (1.0 - slider.value) * 130);
			updateGraph(redPoint, bluePoint);

			btnChangeDisplay.subscribe();
			btnChangeDisplay.setVisibility(true);

			overlayDrop1.unsubscribe();
			overlayDrop2.unsubscribe();

			logDebug("Explore Load");
		};

		// Set the clean up function for explore mode
		thmDemo.scnExplore.cleanUp = function() {
			logDebug("Explore Clean up");
		};
	};

	//------------------------------------------------------------------------------
	// Setup Question 1
	this.setupQ1 = function() {
		//Demo-specific sprites
		var scene = thmDemo.getScene(0);

		// Set the initialize function for Q1
		scene.initQuiz = function() {
			logDebug("Question 1 initQuiz()");

			scene.bgLayer.addChild(blueGraph);
			scene.bgLayer.addChild(redGraph);
			scene.bgLayer.addChild(intersectMarker);
			scene.bgLayer.addChild(sprGraph1);
			scene.bgLayer.addChild(sprGraph2);
			scene.bgLayer.addChild(txtOutput);
			scene.bgLayer.addChild(dropLayerQ1);

			// Set the Q1 question text
			scene.strInstruction = "Q1) Use the graph to find the equilibrium price level for the highest level of spending, where Real GDP = Y*. In the drop down box, state the direction in which the AS and AD curves shifted. Then, submit.";
		};

		// Set the display function for Q1
		scene.loadQuiz = function() {
			nQuiz = 1;
			txtOutput.setColor(1.0,0.7,0.2,0.7);
			txtOutput.setText("");
			txtOutput.subscribe();

			graphType = false
			sprGraph1.setVisibility(true);
			sprGraph2.setVisibility(false);

			changeValue();

			var redPoint = new Point(0.0, redGraph.y - graphY);
			var bluePoint = new Point(0.0, (1.0 - slider.value) * 130);
			updateGraph(redPoint, bluePoint);

			btnChangeDisplay.unsubscribe();
			btnChangeDisplay.setVisibility(false);

			overlayDrop1.subscribe();
			overlayDrop2.subscribe();

			Drop1.setText("Select One");
			Drop2.setText("Select One");

			logDebug("Question 1 loadQuiz()");
		};

		// Set the clean up function for Q1
		scene.cleanUp = function() {
			logDebug("Question 1 cleanUp()");
		};

		// Set the reset function for Q1
		scene.resetQuiz = function() {
			logDebug("Question 1 resetQuiz()");
		};

		// Set the show correct answer function for Q1
		scene.showCorrectAnswer = function() {
			logDebug("Question 1 showCorrectAnswer()");

			Drop1.setText("Up");
			Drop2.setText("Up");
			txtOutput.setText("145");
			txtOutput.setColor(0.0,0.7,0.0,0.7);
		};

		// Set the check answer function for Q1
		scene.checkAnswer = function() {
			logDebug("Question 1 checkAnswer()");
			var bCorrect = true;

			if (Drop1.getText() !== "Up") {
				overlayDrop1.setColor(0.7,0,0,0.5);
				setTimeout(function(){overlayDrop1.setColor(0,0,0,0);}, 2000);
				bCorrect = false;
			}

			if (Drop2.getText() !== "Up") {
				overlayDrop2.setColor(0.7,0,0,0.5);
				setTimeout(function(){overlayDrop2.setColor(0,0,0,0);}, 2000);
				bCorrect = false;
			}

			var nNum = parseInt(txtOutput.getText());

			if(nNum < 135 || nNum > 150) {
				txtOutput.setColor(0.7,0,0,0.7);
				setTimeout(function(){txtOutput.setColor(1.0,0.7,0.2,0.7);}, 2000);
				bCorrect = false;
			}

			return bCorrect;
		};
	};

	//------------------------------------------------------------------------------
	// Setup Question 2
	this.setupQ2 = function() {
		//Demo-specific sprites
		var scene = thmDemo.getScene(1);

		// Set the initialize function for Q1
		scene.initQuiz = function() {
			logDebug("Question 2 initQuiz()");

			scene.bgLayer.addChild(blueGraph);
			scene.bgLayer.addChild(redGraph);
			scene.bgLayer.addChild(intersectMarker);
			scene.bgLayer.addChild(sprGraph1);
			scene.bgLayer.addChild(sprGraph2);
			scene.bgLayer.addChild(txtOutput);
			scene.bgLayer.addChild(dropLayerQ2);

			// Set the Q1 question text
			scene.strInstruction = "Q2) Use the graph to find the Real Interest Rate for the highest level of spending. In the drop down box, state the direction in which NS and ID curves shifted. Then, submit.";
		};

		// Set the display function for Q1
		scene.loadQuiz = function() {
			nQuiz = 2;
			txtOutput.setColor(1.0,0.7,0.2,0.7);
			txtOutput.setText("");
			txtOutput.subscribe();

			graphType = true

			sprGraph1.setVisibility(false);
			sprGraph2.setVisibility(true);
			changeValue();

			btnChangeDisplay.unsubscribe();
			btnChangeDisplay.setVisibility(false);

			overlayDrop1.subscribe();
			overlayDrop2.subscribe();

			Drop1.setText("Select One");
			Drop2.setText("Select One");

			logDebug("Question 2 loadQuiz()");
		};

		// Set the clean up function for Q1
		scene.cleanUp = function() {
			logDebug("Question 2 cleanUp()");
		};

		// Set the reset function for Q1
		scene.resetQuiz = function() {
			logDebug("Question 2 resetQuiz()");
		};

		// Set the show correct answer function for Q1
		scene.showCorrectAnswer = function() {
			logDebug("Question 2 showCorrectAnswer()");
			Drop1.setText("No Shift");
			Drop2.setText("Left");
			txtOutput.setText("5.0%");
			txtOutput.setColor(0.0,0.7,0.0,0.7);
		};

		// Set the check answer function for Q1
		scene.checkAnswer = function() {
			logDebug("Question 2 checkAnswer()");
			var bCorrect = true;

			if (Drop1.getText() !== "No Shift") {
				overlayDrop1.setColor(0.7,0,0,0.5);
				setTimeout(function(){overlayDrop1.setColor(0,0,0,0);}, 2000);
				bCorrect = false;
			}

			if (Drop2.getText() !== "Left") {
				overlayDrop2.setColor(0.7,0,0,0.5);
				setTimeout(function(){overlayDrop2.setColor(0,0,0,0);}, 2000);
				bCorrect = false;
			}

			var nNum = parseFloat(txtOutput.getText());

			if(nNum < 4.6 || nNum > 5.4) {
				txtOutput.setColor(0.7,0,0,0.7);
				setTimeout(function(){txtOutput.setColor(1.0,0.7,0.2,0.7);}, 2000);
				bCorrect = false;
			}

			return bCorrect;
		};
	};

	//---------------------------------------------------------------
	//Return intersection of Segment AB and Segment EF as a Point
	//Return null if there is no intersection
	//---------------------------------------------------------------
	function lineIntersectLine(A,B,E,F){
	    var ip = new Point();
	    var a1;
	    var a2;
	    var b1;
	    var b2;
	    var c1;
	    var c2;

	    a1= B.y-A.y;
	    b1= A.x-B.x;
	    c1= B.x*A.y - A.x*B.y;
	    a2= F.y-E.y;
	    b2= E.x-F.x;
	    c2= F.x*E.y - E.x*F.y;

	    var denom = a1*b2 - a2*b1;
	    if (denom === 0) {
	        return null;
	    }

	    ip.x=(b1*c2 - b2*c1)/denom;
	    ip.y=(a2*c1 - a1*c2)/denom;

	    if( ((ip.x-B.x)*(ip.x-B.x)) + ((ip.y-B.y)*(ip.y-B.y)) > ((A.x-B.x)*(A.x-B.x)) + ((A.y-B.y)*(A.y-B.y)) )
	    {
	       return null;
	    }
	    if( ((ip.x-A.x)*(ip.x-A.x)) + ((ip.y-A.y)*(ip.y-A.y)) > ((A.x-B.x)*(A.x-B.x)) + ((A.y-B.y)*(A.y-B.y)) )
	    {
	       return null;
	    }

	    if( ((ip.x-F.x)*(ip.x-F.x)) + ((ip.y-F.y)*(ip.y-F.y)) > ((E.x-F.x)*(E.x-F.x)) + ((E.y-F.y)*(E.y-F.y)) )
	    {
	       return null;
	    }
	    if( ((ip.x-E.x)*(ip.x-E.x)) + ((ip.y-E.y)*(ip.y-E.y)) > ((E.x-F.x)*(E.x-F.x)) + ((E.y-F.y)*(E.y-F.y)) )
	    {
	       return null;
	    }

	    return ip;
	}


	// Run the setup functions for each questions
	this.setupExplore();
	this.setupQ1();
	this.setupQ2();

	// Start the demo
	thmDemo.begin();

}
window.startDemo = startDemo;
