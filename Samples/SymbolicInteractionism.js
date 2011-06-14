function startDemo(plugin, media) {
	var mediaURL = media;
	var slugUUID = "202d8e9c-be41-528e-b5bf-e10053c64cae_";

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
	
		// Create background
		this.background = new Primitive(this.plugin, "rectangle", 0.0, 0.0, this.width, this.height);
		this.background.setColor(this.bgCol[0], this.bgCol[1], this.bgCol[2], this.bgCol[3]);
		this.background.setBorderColor(this.borderCol[0], this.borderCol[1], this.borderCol[2], this.borderCol[3]);
		this.background.setBorderWidth(2);
		this.layer.addChild(this.background);
	
		//invisible sprite for button actionsbZoom
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
	logDebug("Body start");
	var p = plugin;
	var thmDemo = new THP_Template(p, 545, 371, 4);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("In the following three questions, you will create a concept map relating Symbolic Interactionism, Dramaturgical Analysis, Ethnomethodology, and Grounded Theory. For the links between each concept, select the word that best describes the relationship.");
	thmDemo.setTitle("Symbolic Interactionism");
	
	var rectInstruction = new Primitive(p, "rectangle", 10, 238, 460, 50);
	rectInstruction.setColor(1.0,1.0,1.0,0.8);

	var nScene = 0;
	var nWidth = 630;
	var nHeight = 420;
	
	var arrPoints = new Array();
	arrPoints.push(new Point(-210,-160));
	arrPoints.push(new Point(-210,10));
	arrPoints.push(new Point(0,-160));
	arrPoints.push(new Point(0,10));
	
	var lyrBg = new Layer(p, 0, 0, 630, 440);
	lyrBg.setColor(0,0,0,0);
	lyrBg.setDrag(undefined, undefined, new Rectangle(-210, -180, 840, 640));
	lyrBg.subscribe();
	
	var sprBg = new Sprite(p, mediaURL + slugUUID + "cMap.png", 0, 0, 630, 420);
	
	lyrBg.addChild(sprBg);

	var arrLocal = new Array();
	arrLocal.push(new Point(500, 260));
	arrLocal.push(new Point(340, 260));
	arrLocal.push(new Point(366, 190));
	
	arrLocal.push(new Point(420, 145));
	arrLocal.push(new Point(340, 165));
	arrLocal.push(new Point(340, 30));
	arrLocal.push(new Point(270, 95));
	
	arrLocal.push(new Point(260, 330));
	arrLocal.push(new Point(230, 260));
	arrLocal.push(new Point(140, 260));
	arrLocal.push(new Point(40, 260));
	
	arrLocal.push(new Point(190, 160));
	arrLocal.push(new Point(60, 30));
	arrLocal.push(new Point(140, 30));

	var arrAnswer = new Array();
	arrAnswer.push("Studies");
	arrAnswer.push("Studies");
	arrAnswer.push("Creates");

	arrAnswer.push("Includes");
	arrAnswer.push("Studies");
	arrAnswer.push("Studies");
	arrAnswer.push("Is");

	arrAnswer.push("Includes");
	arrAnswer.push("Studies");
	arrAnswer.push("Studies");
	arrAnswer.push("Studies");

	arrAnswer.push("Includes");
	arrAnswer.push("Is");
	arrAnswer.push("Develops");

	var lyrQ1 = new Layer(p,0,0,0,0);
	lyrQ1.setColor(0,0,0,0);
	
	var lyrQ2 = new Layer(p,0,0,0,0);
	lyrQ2.setColor(0,0,0,0);
	
	var lyrQ3 = new Layer(p,0,0,0,0);
	lyrQ3.setColor(0,0,0,0);
	
	var lyrQ4 = new Layer(p,0,0,0,0);
	lyrQ4.setColor(0,0,0,0);

	var arrLayer = new Array();
	var arrLabel = new Array();
	var arrDrop = new Array();

	for ( var i = 0; i < 14; i++) {

		if (i < 11) {
			arrLabel[i] = new Label(p, arrAnswer[i], 12, arrLocal[i].x, arrLocal[i].y + 40, 64, 20);
			arrLabel[i].setCaptionColor(0,1,0,1);
			arrLabel[i].setColor(0,0,0,0.5);
		}
	
		arrDrop[i] = new DropDown(p, arrLocal[i].x, arrLocal[i].y, 80, 60);
		arrDrop[i].addOption("Select one");
		arrDrop[i].addOption("Studies");
		arrDrop[i].addOption("Creates");
		arrDrop[i].addOption("Includes");
		arrDrop[i].addOption("Is");
		arrDrop[i].addOption("Develops");

		arrLayer[i] = new Layer(p, arrDrop[i].x, arrDrop[i].y + 40, arrDrop[i].width, 20);
		arrLayer[i].setColor(1.0,0.0,0.0,0.0);

		if (i < 3) {
			lyrQ4.addChild(arrLabel[i]);
			lyrQ3.addChild(arrLabel[i]);
			lyrQ2.addChild(arrLabel[i]);
			lyrQ1.addChild(arrDrop[i]);
			lyrQ1.addChild(arrLayer[i]);			
		} else if (i < 7) {
			lyrQ4.addChild(arrLabel[i]);
			lyrQ3.addChild(arrLabel[i]);
			lyrQ2.addChild(arrDrop[i]);
			lyrQ2.addChild(arrLayer[i]);			
		} else if (i < 11) {
			lyrQ4.addChild(arrLabel[i]);
			lyrQ3.addChild(arrDrop[i]);
			lyrQ3.addChild(arrLayer[i]);			
		} else {
			lyrQ4.addChild(arrDrop[i]);
			lyrQ4.addChild(arrLayer[i]);			
		}		
	}

	lyrBg.addChild(lyrQ1);
	lyrBg.addChild(lyrQ2);
	lyrBg.addChild(lyrQ3);
	lyrBg.addChild(lyrQ4);

	lyrQ1.setVisibility(false);
	lyrQ2.setVisibility(false);
	lyrQ3.setVisibility(false);
	lyrQ4.setVisibility(false);

	var btnChangeDisplay = new THM_CustomButton(p, "Zoom", 5, 200, 55, 24);
	btnChangeDisplay.setColor(0.2,0.6,0.9,1.0);
	btnChangeDisplay.setBorderColor(0.1,0.3,0.6,1.0);
	btnChangeDisplay.downCallback(this, "buttonDown");
	thmDemo.answerPanelLayer.addChild(btnChangeDisplay);
	
	var bZoom = false;

	this.endZoomOut = function() {
		if(nScene == 0) lyrQ1.setVisibility(true);
		if(nScene == 1) lyrQ2.setVisibility(true);
		if(nScene == 2) lyrQ3.setVisibility(true);
		if(nScene == 3) lyrQ4.setVisibility(true);
		lyrBg.setDraggable(true);
		thmDemo.hideCurtain();
	}

	//------------------------------------------------------------------------------
	// buttonDown - triggers when the user clicks on the change display button
	this.buttonDown = function(x,y) {
		logDebug("Button press");
		bZoom = !bZoom;
	
		if(bZoom) {
			if(nScene == 0) lyrQ1.setVisibility(false);
			if(nScene == 1) lyrQ2.setVisibility(false);
			if(nScene == 2) lyrQ3.setVisibility(false);
			if(nScene == 3) lyrQ4.setVisibility(false);
			lyrBg.setDraggable(false);
			lyrBg.addTween("x:60,y:20,time:2");
			sprBg.addTween("width:360,height:240,time:2");

			thmDemo.showCurtain();
			setTimeout(function() { thmDemo.hideCurtain(); }, 2000);
		} else {
			
			sprBg.addTween("width:630,height:420,time:2");
			lyrBg.addTween("x:"+arrPoints[nScene].x+",y:"+arrPoints[nScene].y+",time:2");

			thmDemo.showCurtain();
			setTimeout(this.endZoomOut, 2000);
		}	
	}
	
	//------------------------------------------------------------------------------
	// Setup Question 1
	this.setupQ1 = function() {
		//Demo-specific sprites   
		var scene = thmDemo.getScene(0);	
	
		// Set the initialize function for Q1
		scene.initQuiz = function() {
			logDebug("Question 1 initQuiz()");
			scene.bgLayer.addChild(lyrBg);

			scene.bgLayer.addChild(rectInstruction);
			
			// Set the Q1 question text
			scene.strInstruction = "Q1) Select the correct relationships between the 3 concepts shown. You may zoom out to full size or zoom in to show only the 3 concepts. Submit answer and continue to complete the rest of the concept map.";
		}
	
		// Set the display function for Q1
		scene.loadQuiz = function() {
			nScene = 0;
			lyrBg.addTween("x:"+arrPoints[nScene].x+",y:"+arrPoints[nScene].y+",time:1");
			if(bZoom) {
				sprBg.addTween("width:630,height:420,time:1");
				lyrBg.setDraggable(true);
				bZoom = false;
			}
			
			lyrQ1.setVisibility(true);
			lyrQ2.setVisibility(false);
			lyrQ3.setVisibility(false);
			lyrQ4.setVisibility(false);

			for(var i = 0; i < 3; i++) {
				arrDrop[i].setText("Select one");
				arrDrop[i].subscribe();
				arrLayer[i].setColor(0,0,0,0);
			}
			
			logDebug("Question 1 loadQuiz()");
		}
	
		// Set the clean up function for Q1
		scene.cleanUp = function() {
			for(var i = 0; i < 3; i++) {
				arrDrop[i].unsubscribe();
			}
			logDebug("Question 1 cleanUp()");
		}
	
		// Set the reset function for Q1
		scene.resetQuiz = function() {
			logDebug("Question 1 resetQuiz()");
		}
	
		// Set the show correct answer function for Q1
		scene.showCorrectAnswer = function() {
			for(var i = 0; i < 3; i++) {
				arrDrop[i].setText(arrAnswer[i]);
				arrLayer[i].setColor(0,1,0,0.33);
			}
			logDebug("sprBg x:"+sprBg.x+" y:"+sprBg.y); 
			logDebug("Question 1 showCorrectAnswer()");
		}
	
		// Set the check answer function for Q1
		scene.checkAnswer = function() {
			logDebug("Question 1 checkAnswer()");
			bCorrect = true;

			for(var i = 0; i < 3; i++) {
				if(arrDrop[i].getText() != arrAnswer[i]) {
					arrLayer[i].setColor(1,0,0,0.33);
					bCorrect = false;
				} else {
					arrLayer[i].setColor(0,1,0,0.33);
				}
			}
			
			return bCorrect;
		}			
	};
	
	//------------------------------------------------------------------------------
	// Setup Question 2
	this.setupQ2 = function() {
		//Demo-specific sprites   
		var scene = thmDemo.getScene(1);	
	
		// Set the initialize function for Q2
		scene.initQuiz = function() {
			logDebug("Question 2 initQuiz()");
			scene.bgLayer.addChild(lyrBg);

			scene.bgLayer.addChild(rectInstruction);
		
			// Set the Q2 question text
			scene.strInstruction = "Q2) Select the correct relationships between the 4 concepts shown.  You may zoom out to full size or zoom in to show only the 4 concepts.  Submit answer and continue to complete the rest of the concept map.";
		}
	
		// Set the display function for Q2
		scene.loadQuiz = function() {
			nScene = 1;		
			lyrBg.addTween("x:"+arrPoints[nScene].x+",y:"+arrPoints[nScene].y+",time:1");
			if(bZoom) {
				sprBg.addTween("width:630,height:420,time:1");
				lyrBg.setDraggable(true);
				bZoom = false;
			}
			
			lyrQ1.setVisibility(false);
			lyrQ2.setVisibility(true);
			lyrQ3.setVisibility(false);
			lyrQ4.setVisibility(false);

			for(var i = 3; i < 7; i++) {
				arrDrop[i].setText("Select one");
				arrDrop[i].subscribe();
				arrLayer[i].setColor(0,0,0,0);
			}		
			
			logDebug("Question 2 loadQuiz()");
		}
	
		// Set the clean up function for Q2
		scene.cleanUp = function() {
			for(var i = 3; i < 7; i++) {
				arrDrop[i].unsubscribe();
			}
			logDebug("Question 2 cleanUp()");
		}
	
		// Set the reset function for Q2
		scene.resetQuiz = function() {
			logDebug("Question 2 resetQuiz()");
		}
	
		// Set the show correct answer function for Q2
		scene.showCorrectAnswer = function() {
			logDebug("Question 2 showCorrectAnswer()");
			for(var i = 3; i < 7; i++) {
				arrDrop[i].setText(arrAnswer[i]);
				arrLayer[i].setColor(0,1,0,0.33);
			}
		}
	
		// Set the check answer function for Q2
		scene.checkAnswer = function() {
			logDebug("Question 2 checkAnswer()");
			bCorrect = true;

			for(var i = 3; i < 7; i++) {
				if(arrDrop[i].getText() != arrAnswer[i]) {
					arrLayer[i].setColor(1,0,0,0.33);
					bCorrect = false;
				} else {
					arrLayer[i].setColor(0,1,0,0.33);
				}
			}
			
			return bCorrect;
		}			
	};
	
	
	//------------------------------------------------------------------------------
	// Setup Question 3
	this.setupQ3 = function() {
		//Demo-specific sprites   
		var scene = thmDemo.getScene(2);	
	
		// Set the initialize function for Q3
		scene.initQuiz = function() {
			logDebug("Question 3 initQuiz()");
			scene.bgLayer.addChild(lyrBg);

			scene.bgLayer.addChild(rectInstruction);
		
			// Set the Q3 question text
			scene.strInstruction = "Q3) Select the correct relationships between the 4 concepts shown.  You may zoom out to full size or zoom in to show only the 4 concepts.  Submit answer and continue to complete the rest of the concept map.";
		}
	
		// Set the display function for Q3
		scene.loadQuiz = function() {
			nScene = 2;
			lyrBg.addTween("x:"+arrPoints[nScene].x+",y:"+arrPoints[nScene].y+",time:1");
			if(bZoom) {
				sprBg.addTween("width:630,height:420,time:1");
				lyrBg.setDraggable(true);
				bZoom = false;
			}
			
			lyrQ1.setVisibility(false);
			lyrQ2.setVisibility(false);
			lyrQ3.setVisibility(true);
			lyrQ4.setVisibility(false);

			for(var i = 7; i < 11; i++) {
				arrDrop[i].setText("Select one");
				arrDrop[i].subscribe();
				arrLayer[i].setColor(0,0,0,0);
			}		
			
			logDebug("Question 3 loadQuiz()");
		}
	
		// Set the clean up function for Q3
		scene.cleanUp = function() {
			for(var i = 7; i < 11; i++) {
				arrDrop[i].unsubscribe();
			}
			logDebug("Question 3 cleanUp()");
		}
	
		// Set the reset function for Q3
		scene.resetQuiz = function() {
			logDebug("Question 3 resetQuiz()");
		}
	
		// Set the show correct answer function for Q3
		scene.showCorrectAnswer = function() {
			logDebug("Question 3 showCorrectAnswer()");
			for(var i = 7; i < 11; i++) {
				arrDrop[i].setText(arrAnswer[i]);
				arrLayer[i].setColor(0,1,0,0.33);
			}
		}
	
		// Set the check answer function for Q3
		scene.checkAnswer = function() {
			logDebug("Question 3 checkAnswer()");
			bCorrect = true;

			for(var i = 7; i < 11; i++) {
				if(arrDrop[i].getText() != arrAnswer[i]) {
					arrLayer[i].setColor(1,0,0,0.33);
					bCorrect = false;
				} else {
					arrLayer[i].setColor(0,1,0,0.33);
				}
			}
			
			return bCorrect;
		}			
	};
	
	
	//------------------------------------------------------------------------------
	// Setup Question 4
	this.setupQ4 = function() {
		//Demo-specific sprites   
		var scene = thmDemo.getScene(3);	
	
		// Set the initialize function for Q4
		scene.initQuiz = function() {
			logDebug("Question 4 initQuiz()");
			scene.bgLayer.addChild(lyrBg);

			scene.bgLayer.addChild(rectInstruction);
		
			// Set the Q4 question text
			scene.strInstruction = "Q4) Select the correct relationships between the 3 concepts shown. You may zoom out to full size or zoom in to show only the 3 concepts. Submit answer to finish.";
		}
	
		// Set the display function for Q4
		scene.loadQuiz = function() {
			nScene = 3;
			lyrBg.addTween("x:"+arrPoints[nScene].x+",y:"+arrPoints[nScene].y+",time:1");
			if(bZoom) {
				sprBg.addTween("width:630,height:420,time:1");
				lyrBg.setDraggable(true);
				bZoom = false;
			}
			
			lyrQ1.setVisibility(false);
			lyrQ2.setVisibility(false);
			lyrQ3.setVisibility(false);
			lyrQ4.setVisibility(true);

			for(var i = 11; i < 14; i++) {
				arrDrop[i].setText("Select one");
				arrDrop[i].subscribe();
				arrLayer[i].setColor(0,0,0,0);
			}		
						
			logDebug("Question 4 loadQuiz()");
		}
	
		// Set the clean up function for Q4
		scene.cleanUp = function() {
			for(var i = 7; i < 11; i++) {
				arrDrop[i].unsubscribe();
			}
			logDebug("Question 4 cleanUp()");
		}
	
		// Set the reset function for Q4
		scene.resetQuiz = function() {
			logDebug("Question 4 resetQuiz()");
		}
	
		// Set the show correct answer function for Q4
		scene.showCorrectAnswer = function() {
			logDebug("Question 4 showCorrectAnswer()");
			for(var i = 11; i < 14; i++) {
				arrDrop[i].setText(arrAnswer[i]);
				arrLayer[i].setColor(0,1,0,0.33);
			}
		}
	
		// Set the check answer function for Q4
		scene.checkAnswer = function() {
			logDebug("Question 4 checkAnswer()");
			bCorrect = true;

			for(var i = 11; i < 14; i++) {
				if(arrDrop[i].getText() != arrAnswer[i]) {
					arrLayer[i].setColor(1,0,0,0.33);
					bCorrect = false;
				} else {
					arrLayer[i].setColor(0,1,0,0.33);
				}
			}
			
			return bCorrect;
		}			
	};
	
	// Run the setup functions for each questions
	this.setupQ1();
	this.setupQ2();
	this.setupQ3();
	this.setupQ4();
	
	// Start the demo
	thmDemo.begin();
	
}
window.startDemo = startDemo;
