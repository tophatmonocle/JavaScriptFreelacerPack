function startDemo(plugin, media) {
	var mediaURL = media;
	var p = plugin;

	//------------------------------------------------------------------------------
	// Preamble & initialization
	logDebug("Body start");
	var thmDemo = new THP_Template(p, 545, 371, [1,1,1,1]);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("Determine whether or not 3 companies are associated.");
	thmDemo.setTitle("Associated Companies");

	//------------------------------------------------------------------------------
	// Globals

	// The flowchart sprite displayed in the explore mode
	var flowChart = new Sprite(p,"http://thm-media.s3.amazonaws.com/demo/newflowchart.png",40,16,380,230);
	flowChart.setShape("square");

	// Boolean flags to control if the question has been loaded
	var Q1loaded = false;
	var Q2loaded = false;
	var Q3loaded = false;
	var Q4loaded = false;

	//------------------------------------------------------------------------------
	//Q1 variables

	// Setup the drop down control for Q1
	var Q1dropdown = new DropDown(p, 50, 50, 350, 100);
	Q1dropdown.setDefaultOption("Drop down menu");
	Q1dropdown.addOption("Yes - because Company BB controls Company AA");
	Q1dropdown.addOption("No - because Mr. A controls Company AA");
	Q1dropdown.addOption("No - because Company BB controls Company CC");
	Q1dropdown.addOption("Yes - because Company AA controls Company BB");

	// Setup the question label on top of the drop down
	var Q1label = new Label(p, "Are Company AA and Company BB associated? Why?", 2, 50, 150, 330, 40);
	Q1label.setColor(0,0.7,1,1);
	Q1label.setCaptionColor(0,0,0,1);

	//------------------------------------------------------------------------------
	//Q2 variables

	// The Q2 calculator icons
	var iconURL = "http://thm-media.s3.amazonaws.com/demo/calculator_icon_img.jpg";
	var iconArray;
	var clickedIcon;

	// Setup the calculator and hide it
	var calculator = new THM_Calculator(p, thmDemo, 100,40,200,200);
	calculator.hide();

	//Initialize the scrolling up sprites
	var offsetCounter=0;
	var 	scroll_UP = new Sprite(p,"http://thm-media.s3.amazonaws.com/edumacation/gfx/scrollbar/greyScrollUp.png",410,128,20,96);
	scroll_UP.setShape("square");
	scroll_UP.clickCallback(window,"scrollUp");

	//Initialize the scrolling down sprites
	var scroll_DOWN = new Sprite(p,"http://thm-media.s3.amazonaws.com/edumacation/gfx/scrollbar/greyScrollDown.png",410,128-96,20,96);
	scroll_DOWN.setShape("square");
	scroll_DOWN.clickCallback(window,"scrollDown");

	var Q2table; // The spreadsheet for Q2

	// Setup the mask to block the sides
	var mask_1 = new Label(p,"",1,0,225,600,300);
	mask_1.setColor(225/255,225/255,225/255,1);
	var mask_2 = new Label(p,"",1,0,0,10,400);
	mask_2.setColor(225/255,225/255,225/255,1);
	var mask_3 = new Label(p,"",1,470,0,10,400);
	mask_3.setColor(225/255,225/255,225/255,1);
	var mask_4 = new Label(p,"",1,0,0,480,32);
	mask_4.setColor(225/255,225/255,225/255,1);

	// The headerArray incorperated into the spreadsheet
	var headerArray = new Array(6);

	//------------------------------------------------------------------------------
	//Q3 variables

	// Setup the drop down control for Q1
	var Q3dropdown = new DropDown(p, 50, 50, 350, 100);
	Q3dropdown.setDefaultOption("Drop down menu");
	Q3dropdown.addOption("Yes - because Company AA is controls entirely by Mr. A.");
	Q3dropdown.addOption("No - because Mr. A's controlling interest is less than 75%.");
	Q3dropdown.addOption("Yes - because Mr. A has a controlling interest in both companies.");
	Q3dropdown.addOption("No - because Mr. A's Deemed interest is not significant.");

	var Q3label = new Label(p, "Are Company AA and Company CC associated? Why?", 2, 50, 150, 330, 40)
	Q3label.setColor(0,0.7,1,1);
	Q3label.setCaptionColor(0,0,0,1);

	//------------------------------------------------------------------------------
	//Q4 variables
	var Q4dropdown = new DropDown(p, 50, 50, 350, 100);
	Q4dropdown.setDefaultOption("Drop down menu");
	Q4dropdown.addOption("Yes - because both companies are controlled by 1 person.");
	Q4dropdown.addOption("No - because Mr. A controls only Company AA.");
	Q4dropdown.addOption("No - because Company BB is already associated with Company AA.");
	Q4dropdown.addOption("Yes - because Mr. A's options are greater than 5%.");

	// Setup the question label on top of the drop down
	var Q4label = new Label(p, "Are Company BB and Company CC associated? Why?", 2, 50, 150, 330, 40)
	Q4label.setColor(0,0.7,1,1);
	Q4label.setCaptionColor(0,0,0,1);

	//------------------------------------------------------------------------------
	// Explore mode setup
	this.setupExplore = function() {
		// Set the boolean flag to turn on the explore mode
		thmDemo.boolExplore = true;

		// Set the initialize function for explore mode
		thmDemo.scnExplore.initQuiz = function() {
			logDebug("Explore Init");
			// Set the explore mode question text
			thmDemo.scnExplore.strInstruction = "Explore) Below is a flowchart illustrating company control for 3 companies. The arrows indicate control. They are labelled with the % of shares controlled. Press Go to Quiz.";

			// Add the flow chart to the background layer
			thmDemo.scnExplore.bgLayer.addChild(flowChart);
		}

		// Set the display function for explore mode
		thmDemo.scnExplore.loadQuiz = function() {
			logDebug("Explore Init");
		};

		// Set the clean up function for explore mode
		thmDemo.scnExplore.cleanUp = function() {
				logDebug("Explore Clean up");
		};
	};

	//------------------------------------------------------------------------------
	// Setup Question 1 Step 1
	this.setupQ1S1 = function() {
		 //Demo-specific sprites
		var sceneQ1S1 = thmDemo.getScene(0,0);

		// Set the initialize function for Q1
		sceneQ1S1.initQuiz = function() {
			logDebug("Question 1 initQuiz()");

			// Set the Q1 question text
			sceneQ1S1.strInstruction = "Q1: Answer with the drop down menu. (You can return to the diagram anytime with the \"?\" button on the bottom panel.) Press submit & next to continue.";

			// Add the drop down and the on top label
			sceneQ1S1.bgLayer.addChild(Q1dropdown);
			sceneQ1S1.bgLayer.addChild(Q1label);
		}

		// Set the display function for Q1
		sceneQ1S1.loadQuiz = function() {
			logDebug("Question 1 loadQuiz()");
			Q1dropdown.subscribe();
			// Set the drop down to the default text
			Q1dropdown.setText("Drop down menu");
		}

		// Set the clean up function for Q1
		sceneQ1S1.cleanUp = function() {
			Q1dropdown.unsubscribe();
			logDebug("Question 1 cleanUp()");
		}

		// Set the reset function for Q1
		sceneQ1S1.resetQuiz = function() {
			logDebug("Question 1 resetQuiz()");
			sceneQ1S1.loadQuiz();
		}

		// Set the show correct answer function for Q1
		sceneQ1S1.showCorrectAnswer = function() {
			logDebug("Question 1 showCorrectAnswer()");
			// Set the drop down to the correct answer
			Q1dropdown.setText("Yes – because Company AA controls Company BB");
		}

		// Set the check answer function for Q1
		sceneQ1S1.checkAnswer = function() {
			logDebug("Question 1 checkAnswer()");

			// Check the drop down if it's the correct answer
			if(Q1dropdown.getText() == "Yes – because Company AA controls Company BB")
				return true;
			else
				return false;
		}
	};

	//-------------------------------------------------------------
	// Setup Question 2 Step 1
	this.setupQ2S1 = function() {
		var sceneQ2S1 = thmDemo.getScene(1,0);

		// Set the initialize function for Q2
		sceneQ2S1.initQuiz = function() {
			logDebug("Question 2 initQuiz()");

			// Set the Q2 question text
			sceneQ2S1.strInstruction = "Q2: Companies AA & CC are associated under ITA 256(1)(b) if they are controlled by the same person. Use the spreadsheet to find Mr. A's controlling interest in company CC, then submit & press next. (For percentages, type in decimals!)";

			// Setup the spreadsheet for Q2
			Q2table = new THM_Spreadsheet(p, thmDemo, 13,1);
			Q2table.buildSheet(sceneQ2S1.bgLayer);
			Q2table.generateBorder();
			Q2table.deleteMouseEvents();
			Q2table.tableOffset(-30,-30);
			Q2table.resizeColumn(0,360);

			// Resize the height of each row to 20
			for(var i =0; i < Q2table.rows; i ++)
			{
				Q2table.resizeRow(i,20);
				Q2table.rowArray[i].setVisibility(false);
			}
			// Remove the label on top of the spreadsheet
			Q2table.colArray[0].setVisibility(false);

			// Setup the 1st cell for direct interest
			Q2table.cellArray[0][0].setText("(i) Direct Interest");
			Q2table.cellArray[0][1].setText("=%");
			Q2table.cellArray[0][1].addFocusChangedCallback(window,"textCallback");
			Q2table.cellArray[0][1].addEnterCallback(window,"textCallback");

			// Setup the 2nd cell for indirect interest through AA
			Q2table.cellArray[0][2].setText("(ii) Indirect Interest through Company AA");
			Q2table.cellArray[0][3].setText("= [Mr.A's % interest in AA] x [AA's % ownership of CC]");
			Q2table.cellArray[0][4].setText("=%");
			Q2table.cellArray[0][4].addFocusChangedCallback(window,"textCallback");
			Q2table.cellArray[0][4].addEnterCallback(window,"textCallback");

			// Setup the 3rd cell for indirect interest through BB
			Q2table.cellArray[0][5].setText("(iii) Indirect Interest through Company BB");
			Q2table.cellArray[0][6].setText("= [Mr.A's interest in AA x AA's interest in BB x BB's interest in CC]");
			Q2table.cellArray[0][7].setText("=%");
			Q2table.cellArray[0][7].addFocusChangedCallback(window,"textCallback");
			Q2table.cellArray[0][7].addEnterCallback(window,"textCallback");

			// Setup the 4th cell for deemed interest through Son
			Q2table.cellArray[0][8].setText("(iv) Deemed Interest through Son [ITA 256(1.3)]");
			Q2table.cellArray[0][9].setText("=%");
			Q2table.cellArray[0][9].addFocusChangedCallback(window,"textCallback");
			Q2table.cellArray[0][9].addEnterCallback(window,"textCallback");

			// Setup the 5th cell for deemed interest through options
			Q2table.cellArray[0][10].setText("(v) Deemed Interest through Options [ITA 256(1.4)]");
			Q2table.cellArray[0][11].setText("=%");
			Q2table.cellArray[0][11].addFocusChangedCallback(window,"textCallback");
			Q2table.cellArray[0][11].addEnterCallback(window,"textCallback");

			// Setup the 6th cell for the total
			Q2table.cellArray[0][12].setText("=%");
			Q2table.cellArray[0][12].setPosition(Q2table.cellArray[0][12].x + 200,Q2table.cellArray[0][12].y);
			Q2table.cellArray[0][12].setDimensions(Q2table.cellArray[0][12].width - 202, Q2table.cellArray[0][12].height);
			Q2table.cellArray[0][12].addFocusChangedCallback(window,"textCallback");
			Q2table.cellArray[0][12].addEnterCallback(window,"textCallback");

			// Setup the calculator icons
			iconArray = new Array(3);
			for(var i = 0; i < iconArray.length; i++)		{
				iconArray[i] = new Sprite(p,iconURL,0,0,20,20);
				iconArray[i].clickCallback(window,"iconClick");
				iconArray[i].setShape("square");
				sceneQ2S1.bgLayer.addChild(iconArray[i]);
			}

			// Positon the calculator using  the spread sheet as a refrence
			iconArray[0].setPosition(Q2table.cellArray[0][4].x+330,Q2table.cellArray[0][4].y);
			iconArray[1].setPosition(Q2table.cellArray[0][7].x+330,Q2table.cellArray[0][7].y);
			iconArray[2].setPosition(Q2table.cellArray[0][12].x+130,Q2table.cellArray[0][12].y);

			// Setup all the headers put over the spreadsheet
			for(var i = 0; i < headerArray.length; i ++)	{
				headerArray[i] = new Label(p,"",12,0,0,330,20);
				headerArray[i].setColor(0.2,0.7,1,1);
				headerArray[i].setCaptionColor(0,0,0,1);
				sceneQ2S1.bgLayer.addChild(headerArray[i]);
			}

			// Setup the 1st header for direct interest
			headerArray[0].setText("(i) Direct Interest");
			headerArray[0].setPosition(Q2table.cellArray[0][0].x,Q2table.cellArray[0][0].y);
			headerArray[0].setDimensions(Q2table.cellArray[0][0].width,Q2table.cellArray[0][0].height);

			// Setup the 2nd header for indirect interest through AA
			headerArray[1].setText("(ii) Indirect Interest through Company AA");
			headerArray[1].setPosition(Q2table.cellArray[0][2].x,Q2table.cellArray[0][2].y);
			headerArray[1].setDimensions(Q2table.cellArray[0][2].width,Q2table.cellArray[0][2].height);

			// Setup the 3rd header for indirect interest through BB
			headerArray[2].setText("(iii) Indirect Interest through Company AA and BB");
			headerArray[2].setPosition(Q2table.cellArray[0][5].x,Q2table.cellArray[0][5].y);
			headerArray[2].setDimensions(Q2table.cellArray[0][5].width,Q2table.cellArray[0][5].height);

			// Setup the 4th header for deemed interest through Son
			headerArray[3].setText("(iv) Deemed Interest through Son [ITA 256(1.3)]");
			headerArray[3].setPosition(Q2table.cellArray[0][8].x,Q2table.cellArray[0][8].y);
			headerArray[3].setDimensions(Q2table.cellArray[0][8].width,Q2table.cellArray[0][8].height);

			// Setup the 5th header for deemed interest through options
			headerArray[4].setText("(v) Deemed Interest through Options [ITA 256(1.4)]");
			headerArray[4].setPosition(Q2table.cellArray[0][10].x,Q2table.cellArray[0][10].y);
			headerArray[4].setDimensions(Q2table.cellArray[0][10].width,Q2table.cellArray[0][10].height);

			// Setup the 6th header for the total
			headerArray[5].setText("Controlling Interest = (i+ii+iii+iv+v)");
			headerArray[5].setPosition(Q2table.cellArray[0][10].x,Q2table.cellArray[0][12].y);
			headerArray[5].setDimensions(200,Q2table.cellArray[0][12].height);

			// Add the masks and scroll bars to the scene
			sceneQ2S1.bgLayer.addChild(mask_1);
			sceneQ2S1.bgLayer.addChild(mask_2);
			sceneQ2S1.bgLayer.addChild(mask_3);
			sceneQ2S1.bgLayer.addChild(mask_4);
			sceneQ2S1.bgLayer.addChild(scroll_UP);
			sceneQ2S1.bgLayer.addChild(scroll_DOWN);

			// Add the calculator and hide it
			sceneQ2S1.addChild(calculator.layer);
			calculator.hide();

			// Finally add the arrows to show the oanels slide in and out
			sceneQ2S1.addChild(thmDemo.answerPanelHoverArrowSprite);
			sceneQ2S1.addChild(thmDemo.bottomPanelHoverArrowSprite);
		}

		// Set the display function for Q2
		sceneQ2S1.loadQuiz = function() {
			logDebug("Question 2 loadQuiz()");

			// Reset any pervious answers
			Q2table.cellArray[0][1].setText("=%");
			Q2table.cellArray[0][4].setText("=%");
			Q2table.cellArray[0][7].setText("=%");
			Q2table.cellArray[0][9].setText("=%");
			Q2table.cellArray[0][11].setText("=%");
			Q2table.cellArray[0][12].setText("=%");

			// Set all the active cells to be orange
			Q2table.cellArray[0][1].setColor(1,0.7,0,0.3);
			Q2table.cellArray[0][4].setColor(1,0.7,0,0.3);
			Q2table.cellArray[0][7].setColor(1,0.7,0,0.3);
			Q2table.cellArray[0][9].setColor(1,0.7,0,0.3);
			Q2table.cellArray[0][11].setColor(1,0.7,0,0.3);
			Q2table.cellArray[0][12].setColor(1,0.7,0,0.3);

			// Subscribe all the active cells
			Q2table.cellArray[0][1].subscribe();
			Q2table.cellArray[0][4].subscribe();
			Q2table.cellArray[0][7].subscribe();
			Q2table.cellArray[0][9].subscribe();
			Q2table.cellArray[0][11].subscribe();
			Q2table.cellArray[0][12].subscribe();

			// Subscribe all the calculator icons
			iconArray[0].subscribe();
			iconArray[1].subscribe();
			iconArray[2].subscribe();

			// Subscribe the scrollbar
			scroll_UP.subscribe();
			scroll_DOWN.subscribe();
		}

		// Set the clean up function for Q2
		sceneQ2S1.cleanUp = function() {
			logDebug("Question 2 cleanUp()");

			// Unsubscribe all the active cells
			Q2table.cellArray[0][1].unsubscribe();
			Q2table.cellArray[0][4].unsubscribe();
			Q2table.cellArray[0][7].unsubscribe();
			Q2table.cellArray[0][9].unsubscribe();
			Q2table.cellArray[0][11].unsubscribe();
			Q2table.cellArray[0][12].unsubscribe();

			// Unsubscribe all the calculator icons
			iconArray[0].unsubscribe();
			iconArray[1].unsubscribe();
			iconArray[2].unsubscribe();

			// Unsubscribe the scrollbar
			scroll_UP.unsubscribe();
			scroll_DOWN.unsubscribe();
		}

		// Set the reset function for Q2
		sceneQ2S1.resetQuiz = function() {
			logDebug("Question 2 Step 1 resetQuiz()");
			sceneQ2S1.loadQuiz();
		}

		// Set the show correct answer function for Q2
		sceneQ2S1.showCorrectAnswer = function() {
			logDebug("Question 2 showCorrectAnswer()");
			// Set all the active cells to there correct values
			Q2table.cellArray[0][1].setText("=4%");
			Q2table.cellArray[0][4].setText("=11%");
			Q2table.cellArray[0][7].setText("=26%");
			Q2table.cellArray[0][9].setText("=13%");
			Q2table.cellArray[0][11].setText("=9%");
			Q2table.cellArray[0][12].setText("=63%");

			// Set all the active cells to green
			Q2table.cellArray[0][1].setColor(0,1,0,0.3);
			Q2table.cellArray[0][4].setColor(0,1,0,0.3);
			Q2table.cellArray[0][7].setColor(0,1,0,0.3);
			Q2table.cellArray[0][9].setColor(0,1,0,0.3);
			Q2table.cellArray[0][11].setColor(0,1,0,0.3);
			Q2table.cellArray[0][12].setColor(0,1,0,0.3);
		}

		// Set the check answer function for Q2
		sceneQ2S1.checkAnswer = function() {
			logDebug("Question 2 checkAnswer()");
			var is_correct = false;

			// If correct color cell green otherwise color cell red
			if(Q2table.cellArray[0][1].getText() == "=4%") {
				Q2table.cellArray[0][1].setColor(0,1,0,0.3);
			} else {
				Q2table.cellArray[0][1].setColor(1,0,0,0.3);
			}

			// If correct color cell green otherwise color cell red
			if(Q2table.cellArray[0][4].getText() == "=11%") {
				Q2table.cellArray[0][4].setColor(0,1,0,0.3);
			} else {
				Q2table.cellArray[0][4].setColor(1,0,0,0.3);
			}

			// If correct color cell green otherwise color cell red
			if(Q2table.cellArray[0][7].getText() == "=26%") {
				Q2table.cellArray[0][7].setColor(0,1,0,0.3);
			} else {
				Q2table.cellArray[0][7].setColor(1,0,0,0.3);
			}

			// If correct color cell green otherwise color cell red
			if(Q2table.cellArray[0][9].getText() == "=13%") {
				Q2table.cellArray[0][9].setColor(0,1,0,0.3);
			} else {
				Q2table.cellArray[0][9].setColor(1,0,0,0.3);
			}

			// If correct color cell green otherwise color cell red
			if(Q2table.cellArray[0][11].getText() == "=9%") {
				Q2table.cellArray[0][11].setColor(0,1,0,0.3);
			} else {
				Q2table.cellArray[0][11].setColor(1,0,0,0.3);
			}

			// If correct color cell green otherwise color cell red
			// This is the only cell that matters overall
			if(Q2table.cellArray[0][12].getText() == "=63%") {
				Q2table.cellArray[0][12].setColor(0,1,0,0.3);
				is_correct = true;
			} else {
				Q2table.cellArray[0][12].setColor(1,0,0,0.3);
			}

			return is_correct;
		}
	};

	//-------------------------------------------------------------
	// Setup Question 3 Step 1
	this.setupQ3S1 = function() {
		var sceneQ3S1 = thmDemo.getScene(2,0);

		// Set the initialize function for Q1
		sceneQ3S1.initQuiz = function() {
			logDebug("Question 3 initQuiz()");

			// Set the Q3 question text
			sceneQ3S1.strInstruction ="Q3: Answer with the drop down menu. (You can return to the diagram anytime with the \"?\" button on the bottom panel.)  Press submit & next to continue.";

			// Add the drop down and the on top label
			sceneQ3S1.bgLayer.addChild(Q3dropdown);
			sceneQ3S1.bgLayer.addChild(Q3label);
		}

		// Set the display function for Q2
		sceneQ3S1.loadQuiz = function() {
			logDebug("Question 3 Step 1 loadQuiz()");
			Q3dropdown.subscribe();
			// Set the drop down to the default text
			Q3dropdown.setText("Drop down menu");
		}

		// Set the clean up function for Q3
		sceneQ3S1.cleanUp = function() {
			logDebug("Question 3 Step 1 cleanUp()");
			Q3dropdown.unsubscribe();
		}

		// Set the reset function for Q3
		sceneQ3S1.resetQuiz = function() {
			logDebug("Question 3 Step 1 resetQuiz()");
			sceneQ3S1.loadQuiz();
		}

		// Set the show correct answer function for Q3
		sceneQ3S1.showCorrectAnswer = function() {
			logDebug("Question 3 Step 1 showCorrectAnswer()");
			// Set the drop down to the correct answer
			Q3dropdown.setText("Yes - because Mr. A has a controlling interest in both companies.");
		}

		// Set the check answer function for Q3
		sceneQ3S1.checkAnswer = function() {
			logDebug("Question 3 Step 1 checkAnswer()");
			// Check the drop down if it's the correct answer
			if(Q3dropdown.getText() == "Yes - because Mr. A has a controlling interest in both companies.")
				return true;
			else
				return false;
		}
	};

	//-------------------------------------------------------------
	// Setup Question 4 Step 1
	this.setupQ4S1 = function() {
		var sceneQ4S1 = thmDemo.getScene(3,0);

		// Set the initialize function for Q4
		sceneQ4S1.initQuiz = function() {
			logDebug("Question 4 initQuiz()");

			// Set the Q4 question text
			sceneQ4S1.strInstruction = "Q4: Answer with the drop down menu.  (You can return to the diagram anytime with the \"?\" button on the bottom panel.)  Then press submit.";

			sceneQ4S1.bgLayer.addChild(Q4dropdown);
			sceneQ4S1.bgLayer.addChild(Q4label);
		}

		// Set the display function for Q4
		sceneQ4S1.loadQuiz = function() {
			logDebug("Question 4 loadQuiz()");
			// Set the drop down to the default text
			Q4dropdown.setText("Drop down menu");
			Q4dropdown.subscribe();
		}

		// Set the clean up function for Q4
		sceneQ4S1.cleanUp = function() {
			Q4dropdown.unsubscribe();
			logDebug("Question 4 cleanUp()");
		}

		// Set the reset function for Q4
		sceneQ4S1.resetQuiz = function() {
			logDebug("Question 4 resetQuiz()");
			sceneQ4S1.loadQuiz();
		}

		// Set the show correct answer function for Q4
		sceneQ4S1.showCorrectAnswer = function() {
			logDebug("Question 4 showCorrectAnswer()");
			// Set the drop down to the correct answer
			Q4dropdown.setText("Yes – because both companies are controlled by 1 person.");
		}

		// Set the check answer function for Q4
		sceneQ4S1.checkAnswer = function() {
			logDebug("Question 4 checkAnswer()");
			// Check the drop down if it's the correct answer
			if(Q4dropdown.getText() == "Yes – because both companies are controlled by 1 person.")
				return true;
			else
				return false;
		}
	};

	// Callback called by the user closing the calculator
	window.updateCellString = function() {
		// Record the calculators answer member
		this.answer = calculator.answer;

		// Not a number then whatever
		if(isNaN(this.answer)) return;

		// Round the number 2 decimals places
		var rounded = Math.round(this.answer*100);

		// Figure out which cell to write the number to
		if(Q2table.cellArray[0][4].selected) {
			Q2table.cellArray[0][4].setText("="+String(rounded)+"%");
		} else if(Q2table.cellArray[0][7].selected) {
			Q2table.cellArray[0][7].setText("="+String(rounded)+"%");
		} else if(Q2table.cellArray[0][12].selected) {
			Q2table.cellArray[0][12].setText("="+String(rounded)+"%");
		}
	}

	// Callback called by the user press the bottom scrollbar
	window.scrollDown = function(x,y) {
		logDebug("Scroll Down");

		// If the table has not fully scrolled down then keep scrolling
		if(offsetCounter < 5) {
			offsetCounter++;
			logDebug(offsetCounter);

			// Scroll the table up
			offSet(0,30);
		}
	}

	// Callback called by the user pressing the top scrollbar
	window.scrollUp = function(x,y) {
		logDebug("Scroll Up");

		// If the table has not fully scrolled up then keep scrolling
		if(offsetCounter > 0) {
			offsetCounter--;
			logDebug(offsetCounter);

			// Scroll the table down
			offSet(0,-30);
		}
	}

	// Callback called by the user pressing the calculator icon
	function iconUp(x,y) {
		logDebug(this);

		// Show the calculator and record which icon was pressed
		calculator.show();
		clickedIcon = this;
	}

	// Offset the spreadsheet, header array and icon array
	function offSet(passX,passY) {
		// Offset the spreadsheet
		Q2table.tableOffset( passX, passY );

		// Offset all of the headers
		for(var i = 0; i < headerArray.length; i ++) {
			headerArray[i].setPosition(headerArray[i].x + passX, headerArray[i].y + passY);
		}

		// Offset the icons
		for(var i = 0; i < iconArray.length; i ++) {
			iconArray[i].setPosition(iconArray[i].x + passX, iconArray[i].y + passY);
		}
	}

	// Callback called by the user pressing enter or chaning textbox focus
	window.textCallback = function(x,y)
	{
		// Cycle through all the cells that are active
		for(var i = 0; i < Q2table.rows; i++) {
			if(i === 1 || i === 4 || i === 7 || i === 9 || i === 11 || i === 12) {

				// Set inital varibles
				var flag = false;
				var inputString = "";
				var text = new Array();
				var result = 0;
				var rounded = 0;

				// Get the text of each cell in an array of bytes
				text = Q2table.cellArray[0][i].getText().split("");

				// Cycle through each byte
				for(var m = 0; m < text.length; m ++) {
					// If a percent sign is found then remove and replace with a space
					if(text[m] == "%") {
						delete text[m];
						text[m] = " ";
						flag = true;
					}
					// If a equal sign is found then remove and replace with a space
					if(text[m] == "=") {
						delete text[m];
						text[m] = " ";
					}
				}

				// Put the string back together
				for(var j = 0; j < text.length; j++)	{
					inputString +=text[j];
				}

				// Try to eval the input string
				try	{
					result = eval(inputString);
					// If not a number then set to "=%"
					if( isNaN( result ) ){
						Q2table.cellArray[0][i].setText("=%");
						logDebug("Cell[0]["+i+"] =%");
					// Otherwise round the answer to 2 decimal places
					} else {
						rounded = Math.round(result*100);
						// If a % was detect earlier then the number is a percent
						if(flag && rounded > 100) rounded /= 100;
						Q2table.cellArray[0][i].setText("="+String(rounded)+"%");
						logDebug("Cell[0]["+i+"] ="+String(rounded)+"%");
					}
				} catch(err) {
					// If an error is caught then set to "=%"
					Q2table.cellArray[0][i].setText("=%");
					logDebug("Error: " + inputString);
				}
			}
		}
	}

	// Run the setup functions for each questions
	this.setupExplore();
	this.setupQ1S1();
	this.setupQ2S1();
	this.setupQ3S1();
	this.setupQ4S1();

	// Start the demo
	thmDemo.begin();
}
window.startDemo = startDemo;