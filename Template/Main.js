function startDemo(plugin, media) {
	var mediaURL = media;
	var p = plugin;
	var thmDemo = new THP_Template(p, 545, 371, 2);
	var tween = new Tweener(p);
	var physics = new Physics(p);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("[Insert instruction here.]");
	thmDemo.setTitle("[Insert title here]");
	
	//------------------------------------------------------------------------------
	// Explore mode setup
	this.setupExplore = function() {				
		// Set the boolean flag to turn on the explore mode    
		thmDemo.boolExplore = true;
	
		// Set the initialize function for explore mode
		thmDemo.scnExplore.initQuiz = function() {
			logDebug("Explore Init");
			// Set the explore mode question text
			thmDemo.scnExplore.strInstruction = "Explore Mode) [Enter explore mode text]";
		};
	
		// Set the display function for explore mode
		thmDemo.scnExplore.loadQuiz = function() {		
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
		
			// Set the Q1 question text
			scene.strInstruction = "Q1) [Enter question text]";
		};
	
		// Set the display function for Q1
		scene.loadQuiz = function() {
			logDebug("Question 1 loadQuiz()");
		};
	
		// Set the clean up function for Q1
		scene.cleanUp = function() {
			logDebug("Question 1 cleanUp()");
		};
	
		// Set the reset function for Q1
		scene.resetQuiz = function() {
			logDebug("Question 1 resetQuiz()");
			scene.loadQuiz();
		};
	
		// Set the show correct answer function for Q1
		scene.showCorrectAnswer = function() {
			logDebug("Question 1 showCorrectAnswer()");
		};
	
		// Set the check answer function for Q1
		scene.checkAnswer = function() {
			logDebug("Question 1 checkAnswer()");
			return false;
		};			
	};
	
	//------------------------------------------------------------------------------
	// Setup Question 2
	this.setupQ2 = function() {
		//Demo-specific sprites   
		var scene = thmDemo.getScene(1);	
	
		// Set the initialize function for Q2
		scene.initQuiz = function() {
			logDebug("Question 2 initQuiz()");
		
			// Set the Q2 question text
			scene.strInstruction = "Q2) [Enter question text]";
		};
	
		// Set the display function for Q2
		scene.loadQuiz = function() {
			logDebug("Question 2 loadQuiz()");
		};
	
		// Set the clean up function for Q2
		scene.cleanUp = function() {
			logDebug("Question 2 cleanUp()");
		};
	
		// Set the reset function for Q2
		scene.resetQuiz = function() {
			logDebug("Question 2 resetQuiz()");
			scene.loadQuiz();
		};
	
		// Set the show correct answer function for Q2
		scene.showCorrectAnswer = function() {
			logDebug("Question 2 showCorrectAnswer()");
		};
	
		// Set the check answer function for Q2
		scene.checkAnswer = function() {
			logDebug("Question 2 checkAnswer()");
			return false;
		};	
	};
	
	
	// Run the setup functions for each questions
	this.setupExplore();
	this.setupQ1();
	this.setupQ2();
	
	// Start the demo
	thmDemo.begin();
}
