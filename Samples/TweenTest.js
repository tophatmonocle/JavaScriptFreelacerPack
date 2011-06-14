function startDemo(plugin, media) {
	//------------------------------------------------------------------------------
	// Preamble & initialization
	DEBUG_MODE = false;
	
	var mediaURL = media;
	var p = plugin;
	var thmDemo = new THP_Template(p, 545, 371, 4);
	var tween = new Tweener(p);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("This demo creates objects and tweens them.");
	thmDemo.setTitle("Tweener Test");
	
	var bPaused = false;
	window.playPause = function(x,y) {
		if(bPaused) {
			tween.resumeAllTweens();
			bPaused = false;
		} else {
			tween.pauseAllTweens();
			bPaused = true;
		}
	}
	
	//------------------------------------------------------------------------------
	// Setup Question 1
	this.setupQ1 = function() {
		 //Demo-specific sprites   
		var scene = thmDemo.getScene(0);
		var sprLinear, sprEaseIn, sprEaseOut, label;
	
		// Set the initialize function
		scene.initQuiz = function() {
			logDebug("Question initQuiz()");
		
			// Set the Q1 question text and status bit
			scene.strInstruction = "Test 1) Here you see 3 different tweens in various forms.";
			scene.setCorrect(true);
			scene.setCompleted(true);
			scene.setServerStatus(true); 
	
			sprLinear = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 20, 210, 64, 64);
			sprLinear.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprLinear);
	
			label = new Label(p, "5 second tween linear tween", 12, 10, 205, 300, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
			
			sprEaseIn = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 20, 130, 64, 64);
			sprEaseIn.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprEaseIn);
	
			label = new Label(p, "5 second tween ease in tween", 12, 10, 125, 300, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
	
			sprEaseOut = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 20, 50, 64, 64);
			sprEaseOut.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprEaseOut);
	
			label = new Label(p, "5 second tween ease out tween", 12, 10, 45, 300, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
		}
	
		// Set the display function
		scene.loadQuiz = function(x,y) {
			logDebug("Question loadQuiz()");
			bPaused = false;
	
			sprLinear.subscribe();
			sprEaseIn.subscribe();
			sprEaseOut.subscribe();
	
			sprLinear.removeTween();
			sprEaseIn.removeTween();
			sprEaseOut.removeTween();
				
			sprLinear.setPosition(20, 210);
			sprEaseIn.setPosition(20, 130);
			sprEaseOut.setPosition(20, 50);
	
			sprLinear.addTween("x:420, time:5", scene, "loadQuiz");
			sprEaseIn.addTween("x:420, time:5, transition:ease_in");
			sprEaseOut.addTween("x:420, time:5, transition:ease_out");
		}
	
		// Set the clean up function
		scene.cleanUp = function() {
			sprLinear.unsubscribe();
			sprEaseIn.unsubscribe();
			sprEaseOut.unsubscribe();
		
			sprLinear.removeTween();
			sprEaseIn.removeTween();
			sprEaseOut.removeTween();
			logDebug("Question cleanUp()");
		}
	
		// Set the reset function
		scene.resetQuiz = function() {
			logDebug("Question resetQuiz()");
			scene.loadQuiz();
		}
	
		// Set the show correct answer function
		scene.showCorrectAnswer = function() {
			logDebug("Question showCorrectAnswer()");
		}
	
		// Set the check answer function
		scene.checkAnswer = function() {
			logDebug("Question checkAnswer()");
			return false;
		}			
	};
	
	//------------------------------------------------------------------------------
	// Setup Question 2
	this.setupQ2 = function() {
		 //Demo-specific sprites   
		var scene = thmDemo.getScene(1);	
		var sprDelay;
	
		// Set the initialize function
		scene.initQuiz = function() {
			logDebug("Question initQuiz()");
	
			scene.strInstruction = "Test 2) The following object has 4 tweens on and 3 of them are delayed.";
			scene.setCorrect(true);
			scene.setCompleted(true);
			scene.setServerStatus(true); 
	
			sprDelay = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 20, 200, 64, 64);
			sprDelay.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprDelay);
		}
	
		// Set the display function
		scene.loadQuiz = function(x,y) {
			bPaused = false;
	
			sprDelay.subscribe();
			sprDelay.removeTween();
					
			sprDelay.setPosition(20, 200);
			sprDelay.addTween("x:420,       time:2");
			sprDelay.addTween("x:20, y:40,  time:2, delay:2");
			sprDelay.addTween("x:420,       time:2, delay:4");
			sprDelay.addTween("y:200, x:20, time:2, delay:6", scene, "loadQuiz");
	
			logDebug("Question loadQuiz()");
		}
	
		// Set the clean up function
		scene.cleanUp = function() {
			sprDelay.unsubscribe();
			sprDelay.removeTween();
			logDebug("Question cleanUp()");
		}
	
		// Set the reset function
		scene.resetQuiz = function() {
			logDebug("Question resetQuiz()");
			scene.loadQuiz();
		}
	
		// Set the show correct answer function
		scene.showCorrectAnswer = function() {
			logDebug("Question showCorrectAnswer()");
		}
	
		// Set the check answer function
		scene.checkAnswer = function() {
			logDebug("Question checkAnswer()");
			return false;
		}			
	};
	
	//------------------------------------------------------------------------------
	// Setup Question 3
	this.setupQ3 = function() {
		 //Demo-specific sprites   
		var scene = thmDemo.getScene(2);	
		var sprScale, sprRotate;
	
		// Set the initialize function
		scene.initQuiz = function() {
			logDebug("Question initQuiz()");
	
			scene.strInstruction = "Test 3) These two objects have a scale and rotation tween on them.";
			scene.setCorrect(true);
			scene.setCompleted(true);
			scene.setServerStatus(true); 
	
			sprScale = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 80, 100, 96, 96);
			sprScale.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprScale);
	
			sprRotate = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 300, 100, 96, 96);
			sprRotate.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprRotate);
		}
	
		// Set the display function
		scene.loadQuiz = function(x,y) {
			bPaused = false;
			
			sprScale.subscribe();
			sprRotate.subscribe();
		
			sprScale.removeTween();
			sprRotate.removeTween();
	
			sprScale.setScale(0.5);
			sprRotate.setRotation(0.0);
					
			sprScale.addTween("scale:2,       time:3");
			sprScale.addTween("scale:0.5,     time:3, delay:3");
			
			sprRotate.addTween("rotation:360, time:3");
			sprRotate.addTween("rotation:0,   time:3, delay:3", scene, "loadQuiz");
	
			logDebug("Question loadQuiz()");
		}
	
		// Set the clean up function
		scene.cleanUp = function() {
			sprScale.unsubscribe();
			sprRotate.unsubscribe();
		
			sprScale.removeTween();
			sprRotate.removeTween();
			logDebug("Question cleanUp()");
		}
	
		// Set the reset function
		scene.resetQuiz = function() {
			logDebug("Question resetQuiz()");
			scene.loadQuiz();
		}
	
		// Set the show correct answer function
		scene.showCorrectAnswer = function() {
			logDebug("Question showCorrectAnswer()");
		}
	
		// Set the check answer function
		scene.checkAnswer = function() {
			logDebug("Question checkAnswer()");
			return false;
		}			
	};
	
	//------------------------------------------------------------------------------
	// Setup Question 4
	this.setupQ4 = function() {
		 //Demo-specific sprites   
		var scene = thmDemo.getScene(3);	
		var sprRed, sprGreen, sprBlue, sprAlpha, label;
	
		// Set the initialize function
		scene.initQuiz = function() {
			logDebug("Question initQuiz()");
	
			scene.strInstruction = "Test 4) These objects have their RGBA values tweened.";
			scene.setCorrect(true);
			scene.setCompleted(true);
			scene.setServerStatus(true); 
	
			sprRed = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 80, 180, 96, 96);
			sprRed.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprRed);
	
			label = new Label(p, "Red color tween", 12, 70, 180, 96, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
	
			sprGreen = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 300, 180, 96, 96);
			sprGreen.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprGreen);
	
			label = new Label(p, "Green color tween", 12, 290, 180, 96, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
	
			sprBlue = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 80, 60, 96, 96);
			sprBlue.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprBlue);
	
			label = new Label(p, "Blue color tween", 12, 70, 60, 96, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
	
			sprAlpha = new Sprite(p, "http://www.iconpng.com/png/transports/ufo.png", 300, 60, 96, 96);
			sprAlpha.downCallback(window, "playPause");
			scene.bgLayer.addChild(sprAlpha);
	
			label = new Label(p, "Alpha color tween", 12, 290, 60, 96, 12);
			label.setCaptionColor(0.0, 0.0, 0.0, 1.0);
			label.setColor(0.0, 0.0, 0.0, 0.0);		
			scene.bgLayer.addChild(label);
		}
	
		// Set the display function
		scene.loadQuiz = function(x,y) {
			bPaused = false;
	
			sprRed.subscribe();
			sprGreen.subscribe();
			sprBlue.subscribe();
			sprAlpha.subscribe();
	
			sprRed.removeTween();
			sprGreen.removeTween();
			sprBlue.removeTween();
			sprAlpha.removeTween();
	
			sprRed.setColor(1.0, 0.0, 0.0, 1.0);
			sprGreen.setColor(0.0, 1.0, 0.0, 1.0);
			sprBlue.setColor(0.0, 0.0, 1.0, 1.0);
			sprAlpha.setColor(1.0, 1.0, 1.0, 0.0);
					
			sprRed.addTween("green:1, blue:1,  time:2");
			sprRed.addTween("green:0, blue:0,  time:2, delay:2");
	
			sprGreen.addTween("red:1, blue:1,  time:2");
			sprGreen.addTween("red:0, blue:0,  time:2, delay:2");
	
			sprBlue.addTween("red:1,  green:1, time:2");
			sprBlue.addTween("red:0,  green:0, time:2, delay:2");
			
			sprAlpha.addTween("alpha:1, time:2");
			sprAlpha.addTween("alpha:0, time:2, delay:2", scene, "loadQuiz");
	
			logDebug("Question loadQuiz()");
		}
	
		// Set the clean up function
		scene.cleanUp = function() {
			sprRed.unsubscribe();
			sprGreen.unsubscribe();
			sprBlue.unsubscribe();
			sprAlpha.unsubscribe();
		
			sprRed.removeTween();
			sprGreen.removeTween();
			sprBlue.removeTween();
			sprAlpha.removeTween();
			logDebug("Question cleanUp()");
		}
	
		// Set the reset function
		scene.resetQuiz = function() {
			logDebug("Question resetQuiz()");
			scene.loadQuiz();
		}
	
		// Set the show correct answer function
		scene.showCorrectAnswer = function() {
			logDebug("Question showCorrectAnswer()");
		}
	
		// Set the check answer function
		scene.checkAnswer = function() {
			logDebug("Question checkAnswer()");
			return false;
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
