function startDemo(plugin, media) {
	var mediaURL = media;
	var p = plugin;

	//------------------------------------------------------------------------------
	// Preamble & initialization
	logDebug("Body start");
	var thmDemo = new THP_Template(p, 545, 371, 4);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("Income attribution implies a splitting of income to reduce taxes payable.");
	thmDemo.setTitle("Income Attribution");

	//------------------------------------------------------------------------------
	// Globals
	var intStep = 0;

	// Setup the common question label
	var instructionLabel = new Label(p,"",2,10,250,460,40);
	instructionLabel.setColor(0,0,0,0);
	instructionLabel.setCaptionColor(0,0,0,1);
	instructionLabel.setWrap(true);

	// Load all the sprites from amazon
	var wife = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/wife.png", 25, 60, 110, 160);
	var husband = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/husband.png", 325, 50, 120, 180);
	var stranger = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/stranger.png", 625, 50, 114, 180);
	var gift = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/Gift.png", 125, 60, 77, 76);
	var stock = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/Stock.png", 225, 60, 112, 80);
	var moneyBag = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/MoneyBag.png", 175, 160, 80, 80);
	var time = new Sprite(p, "http://thm-media.s3.amazonaws.com/edumacation/gfx/IncomeAttribution/Time.png", 175, 60, 128,180);


	// Set the start points for each sprite for all four questions
	var arrWife = new Array(new Point(25, 60), new Point(25, 60), new Point(25, 60), new Point(25, 60));
	var arrHusband = new Array(new Point(325, 50), new Point(325, 50), new Point(325, 50), new Point(325, 50));
	var arrStranger = new Array(new Point(725, 50), new Point(725, 50), new Point(725, 50), new Point(725, 50));
	var arrGift = new Array(new Point(125, 60), new Point(-77, 60), new Point(-77, 60), new Point(-77, 60));
	var arrStock = new Array(new Point(525, 60), new Point(125, 60), new Point(125, 60), new Point(125, 60));
	var arrMoneyBag = new Array(new Point(625, 60), new Point(245, 60), new Point(245, 60), new Point(245, 60));
	var arrTime = new Array(new Point(480, 60), new Point(480, 60), new Point(480, 60), new Point(480, 60));

	// Setup the main spreadsheet
	var mainSheet = new THM_Spreadsheet(p,thmDemo,3,3);
	var boolShowSheet = false;

	// Setup the claculator and bind it
	var calc = new THM_Calculator(p, thmDemo, 140,35,180,220);
	window.calculator = calc;
	calc.bindSheet = true;

	// Load all the calculator icons
	var calcIcon = new Sprite(p,"http://thm-media.s3.amazonaws.com/edumacation/gfx/calculator/calcIcon.png",0,0,16,16);
	var calcIcon1 = new Sprite(p,"http://thm-media.s3.amazonaws.com/edumacation/gfx/calculator/calcIcon.png",0,0,16,16);
	var calcIcon2 = new Sprite(p,"http://thm-media.s3.amazonaws.com/edumacation/gfx/calculator/calcIcon.png",0,0,16,16);

	//------------------------------------------------------------------------------
	// Setup the scene based on the scene number
	window.setupScene = function(passNum) {
		wife.setPosition(arrWife[passNum].x, arrWife[passNum].y);
		husband.setPosition(arrHusband[passNum].x, arrHusband[passNum].y);
		gift.setPosition(arrGift[passNum].x, arrGift[passNum].y);
		stranger.setPosition(arrStranger[passNum].x, arrStranger[passNum].y);
		stock.setPosition(arrStock[passNum].x, arrStock[passNum].y);
		moneyBag.setPosition(arrMoneyBag[passNum].x, arrMoneyBag[passNum].y);
		time.setPosition(arrTime[passNum].x, arrTime[passNum].y);
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 1 to step 2 transistion
	window.animateQ1S1 = function() {
		// Move the wife off the screen and move the stranger on screen
		wife.addMoveTo(-125, 60, 2);
		husband.addMoveTo(20, 50, 2);
		stranger.addMoveTo(330, 50, 2)

		// Move the gift off-screen and slide in the stock and money bags
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(125, 60, 2);
		moneyBag.addMoveTo(245, 60, 2);

		// Slide the hourglass to show the passing of time
		time.addMoveTo(-128, 60, 2);

		// Change the instructions to the step 2 label
		instructionLabel.setText("Step 2) After some time passes the husband sells the shares to a stranger for a new FMV of $175,000.  Drag the stock over to the stranger and the money bag over to the husband.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 2 to step 3 transistion
	window.animateQ1S2 = function() {
		// Move extra sprites off the screen
		wife.addMoveTo(-125, 60, 2);
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(480, 60, 2);
		moneyBag.addMoveTo(-80, 60, 2);
		time.addMoveTo(-128, 60, 2);

		// Roll the spreadsheet up
		mainSheet.tableOffset(0,320);
		boolShowSheet = true;

		// Move the calculator icons on to the spreadsheet
		calcIcon.setPosition(mainSheet.cellArray[2][0].x + mainSheet.cellArray[2][0].width - 16, mainSheet.cellArray[2][0].y + 2);
		calcIcon1.setPosition(mainSheet.cellArray[2][1].x + mainSheet.cellArray[2][1].width - 16, mainSheet.cellArray[2][1].y + 2);
		calcIcon2.setPosition(mainSheet.cellArray[2][2].x + mainSheet.cellArray[2][2].width - 16, mainSheet.cellArray[2][2].y + 2);

		// Subscribe all the calculator icons
		calcIcon.subscribe();
		calcIcon1.subscribe();
		calcIcon2.subscribe();

		// Show all the calculator icons
		calcIcon.setVisibility(true);
		calcIcon1.setVisibility(true);
		calcIcon2.setVisibility(true);

		// Change the instructions to the step 3 label
		instructionLabel.setText("Step 3) Fill out the table below based on the previous scenario.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 4 to step 5 transistion
	window.animateQ2S1 = function() {
		// Move the wife off the screen and move the stranger on screen
		wife.addMoveTo(-125, 60, 2);
		husband.addMoveTo(20, 50, 2);
		stranger.addMoveTo(330, 50, 2);

		// Move the gift off-screen and slide in the stock and money bags
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(125, 60, 2);
		moneyBag.addMoveTo(245, 60, 2);

		// Slide the hourglass to show the passing of time
		time.addMoveTo(-128, 60, 2);

		// Change the instructions to the step 5 label
		instructionLabel.setText("Step 5) After some time passes the husband sells the shares to a stranger for a new FMV of $175,000.  Drag the stock over to the stranger and the money bag over to the husband.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 5 to step 6 transistion
	window.animateQ2S2 = function() {
		// Move extra sprites off the screen
		wife.addMoveTo(-125, 60, 2);
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(480, 60, 2);
		moneyBag.addMoveTo(-80, 60, 2);
		time.addMoveTo(-128, 60, 2);

		// Roll the spreadsheet up
		mainSheet.tableOffset(0,320);
		boolShowSheet = true;

		// Move the calculator icons on to the spreadsheet
		calcIcon.setPosition(mainSheet.cellArray[2][0].x + mainSheet.cellArray[2][0].width - 16, mainSheet.cellArray[2][0].y + 2);
		calcIcon1.setPosition(mainSheet.cellArray[2][1].x + mainSheet.cellArray[2][1].width - 16, mainSheet.cellArray[2][1].y + 2);
		calcIcon2.setPosition(mainSheet.cellArray[2][2].x + mainSheet.cellArray[2][2].width - 16, mainSheet.cellArray[2][2].y + 2);

		// Subscribe all the calculator icons
		calcIcon.subscribe();
		calcIcon1.subscribe();
		calcIcon2.subscribe();

		// Show all the calculator icons
		calcIcon.setVisibility(true);
		calcIcon1.setVisibility(true);
		calcIcon2.setVisibility(true);

		// Change the instructions to the step 6 label
		instructionLabel.setText("Step 6) Fill out the table below based on the previous scenario.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 7 to step 8 transistion
	window.animateQ3S1 = function() {
		// Move the wife off the screen and move the stranger on screen
		wife.addMoveTo(-125, 60, 2);
		husband.addMoveTo(20, 50, 2);
		stranger.addMoveTo(330, 50, 2);

		// Move the gift off-screen and slide in the stock and money bags
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(125, 60, 2);
		moneyBag.addMoveTo(245, 60, 2);

		// Slide the hourglass to show the passing of time
		time.addMoveTo(-128, 60, 2);

		// Change the instructions to the step 8 label
		instructionLabel.setText("Step 8) After some time passes the husband sells the shares to a stranger for a new FMV of $175,000.  Drag the stock over to the stranger and the money bag over to the husband.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 8 to step 9 transistion
	window.animateQ3S2 = function() {
		// Move extra sprites off the screen
		wife.addMoveTo(-125, 60, 2);
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(480, 60, 2);
		moneyBag.addMoveTo(-80, 60, 2);
		time.addMoveTo(-128, 60, 2);

		// Roll the spreadsheet up
		mainSheet.tableOffset(0,320);
		boolShowSheet = true;

		// Move the calculator icons on to the spreadsheet
		calcIcon.setPosition(mainSheet.cellArray[2][0].x + mainSheet.cellArray[2][0].width - 16, mainSheet.cellArray[2][0].y + 2);
		calcIcon1.setPosition(mainSheet.cellArray[2][1].x + mainSheet.cellArray[2][1].width - 16, mainSheet.cellArray[2][1].y + 2);
		calcIcon2.setPosition(mainSheet.cellArray[2][2].x + mainSheet.cellArray[2][2].width - 16, mainSheet.cellArray[2][2].y + 2);

		// Subscribe all the calculator icons
		calcIcon.subscribe();
		calcIcon1.subscribe();
		calcIcon2.subscribe();

		// Show all the calculator icons
		calcIcon.setVisibility(true);
		calcIcon1.setVisibility(true);
		calcIcon2.setVisibility(true);

		// Change the instructions to the step 9 label
		instructionLabel.setText("Step 9) Fill out the table below based on the previous scenario.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 10 to step 11 transistion
	window.animateQ4S1 = function() {
		// Move the wife off the screen and move the stranger on screen
		wife.addMoveTo(-125, 60, 2);
		husband.addMoveTo(20, 50, 2);
		stranger.addMoveTo(330, 50, 2);

		// Move the gift off-screen and slide in the stock and money bags
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(125, 60, 2);
		moneyBag.addMoveTo(245, 60, 2);

		// Slide the hourglass to show the passing of time
		time.addMoveTo(-128, 60, 2);

		// Change the instructions to the step 11 label
		instructionLabel.setText("Step 11) After some time passes the husband sells the shares to a stranger for a new FMV of $175,000.  Drag the stock over to the stranger and the money bag over to the husband.");
	};

	//------------------------------------------------------------------------------
	// Animation logic for the step 11 to step 12 transistion
	window.animateQ4S2 = function() {
		// Move extra sprites off the screen
		wife.addMoveTo(-125, 60, 2);
		gift.addMoveTo(-77, 60, 2);
		stock.addMoveTo(480, 60, 2);
		moneyBag.addMoveTo(-80, 60, 2);
		time.addMoveTo(-128, 60, 2);

		// Roll the spreadsheet up
		mainSheet.tableOffset(0,320);
		boolShowSheet = true;

		// Move the calculator icons on to the spreadsheet
		calcIcon.setPosition(mainSheet.cellArray[2][0].x + mainSheet.cellArray[2][0].width - 16, mainSheet.cellArray[2][0].y + 2);
		calcIcon1.setPosition(mainSheet.cellArray[2][1].x + mainSheet.cellArray[2][1].width - 16, mainSheet.cellArray[2][1].y + 2);
		calcIcon2.setPosition(mainSheet.cellArray[2][2].x + mainSheet.cellArray[2][2].width - 16, mainSheet.cellArray[2][2].y + 2);

		// Subscribe all the calculator icons
		calcIcon.subscribe();
		calcIcon1.subscribe();
		calcIcon2.subscribe();

		// Show all the calculator icons
		calcIcon.setVisibility(true);
		calcIcon1.setVisibility(true);
		calcIcon2.setVisibility(true);

		// Change the instructions to the step 12 label
		instructionLabel.setText("Step 12) Fill out the table below based on the previous scenario.");
	};

	//------------------------------------------------------------------------------
	// Callback triggered when the user clicks on the gift
	window.giftDown = function(x,y) {
		gift.update();
		logDebug("Gift down " + intStep);
	};

	//------------------------------------------------------------------------------
	// Callback triggered when the user clicks on the stock
	window.stockDown = function(x,y) {
		stock.update();
		logDebug("Stock down " + intStep);
	};

	//------------------------------------------------------------------------------
	// Callback triggered when the user clicks on the money
	window.moneyDown = function(x,y) {
		moneyBag.update();
		logDebug("Money down " + intStep);
	};

	//------------------------------------------------------------------------------
	// Callback triggered when the user release the mouse
	window.mouseUp = function(x,y) {
		// Update the gift, stock and money positions
		gift.update();
		stock.update();
		moneyBag.update();

		// Update the wife. husband and stranger positions
		wife.update();
		husband.update();
		stranger.update();

		// Get the center point of the gift, stock and money bags
		var pntGift = new Point(gift.x + (gift.width * 0.5), gift.y + (gift.height * 0.5));
		var pntStock = new Point(stock.x + (stock.width * 0.5), stock.y + (stock.height * 0.5));
		var pntMoneyBag = new Point(moneyBag.x + (moneyBag.width * 0.5), moneyBag.y + (moneyBag.height * 0.5));

		// Get the rectangle of the wife, husband and stranger
		var rectWife = new Rectangle(wife.x, wife.y, wife.width, wife.height);
		var rectHusband = new Rectangle(husband.x, husband.y, husband.width, husband.height);
		var rectStranger = new Rectangle(stranger.x, stranger.y, stranger.width, stranger.height);

		// Logic for question 1
		if(intStep === 1) {
			if(rectHusband.containsPoint(pntGift)) {
				window.animateQ1S1();
			}
			if(rectHusband.containsPoint(pntMoneyBag) && rectStranger.containsPoint(pntStock)) {
				window.animateQ1S2();
			}

		// Logic for question 2
		} else if (intStep === 2) {
			if(rectWife.containsPoint(pntMoneyBag) && rectHusband.containsPoint(pntStock)) {
				window.animateQ2S1();
			}
			if(rectHusband.containsPoint(pntMoneyBag) && rectStranger.containsPoint(pntStock)) {
				window.animateQ2S2();
			}
		// Logic for question 3
		} else if (intStep === 3) {
			if(rectWife.containsPoint(pntMoneyBag) && rectHusband.containsPoint(pntStock)) {
				window.animateQ3S1();
			}
			if(rectHusband.containsPoint(pntMoneyBag) && rectStranger.containsPoint(pntStock)) {
				window.animateQ3S2();
			}
		// Logic for question 4
		} else if (intStep === 4) {
			if(rectWife.containsPoint(pntMoneyBag) && rectHusband.containsPoint(pntStock)) {
				window.animateQ4S1();
			}
			if(rectHusband.containsPoint(pntMoneyBag) && rectStranger.containsPoint(pntStock)) {
				window.animateQ4S2();
			}
		}

		logDebug("mouse up " + intStep);
	};

	// Setup the mouse down callback for the gift, stock and money
	gift.downCallback(window, "giftDown");
	stock.downCallback(window, "stockDown");
	moneyBag.downCallback(window, "moneyDown");

	// Setup the mouse up callback for the gift, stock and money
	gift.upCallback(window, "mouseUp");
	stock.upCallback(window, "mouseUp");
	moneyBag.upCallback(window, "mouseUp");

	//------------------------------------------------------------------------------
	// Build the main spreadsheet
	window.buildDB = function(scene) {

		// Make a spreadsheet offscreen with a border
		mainSheet.buildSheet(scene);
		mainSheet.tableOffset(85,-430);
		mainSheet.generateBorder();
		mainSheet.deleteMouseEvents();

		// Rename and reposition the "TCG at time of transfer" column
		mainSheet.colArray[0].setPosition(mainSheet.colArray[0].x - 30, mainSheet.colArray[0].y);
		mainSheet.colArray[0].setDimensions(65,50);
		mainSheet.colArray[0].setWrap(true);
		mainSheet.colArray[0].unsubscribe();
		mainSheet.colArray[0].setText("TCG at time of transfer");

		// Rename and reposition the "TCG when shares sold to stranger" column
		mainSheet.colArray[1].setPosition(mainSheet.colArray[1].x - 30, mainSheet.colArray[1].y);
		mainSheet.colArray[1].setDimensions(65,50);
		mainSheet.colArray[1].setWrap(true);
		mainSheet.colArray[1].unsubscribe();
		mainSheet.colArray[1].setText("TCG when shares sold to stranger");

		// Rename and reposition the "Total TCG" column
		mainSheet.colArray[2].setPosition(mainSheet.colArray[2].x - 30, mainSheet.colArray[2].y);
		mainSheet.colArray[2].setDimensions(65,20);
		mainSheet.colArray[2].setWrap(true);
		mainSheet.colArray[2].unsubscribe();
		mainSheet.colArray[2].setText("Total TCG");

		// Rename and reposition the "Wife" row
		mainSheet.rowArray[0].setPosition(mainSheet.rowArray[0].x - 30, mainSheet.rowArray[0].y);
		mainSheet.rowArray[0].setDimensions(70,20);
		mainSheet.rowArray[0].setWrap(true);
		mainSheet.rowArray[0].unsubscribe();
		mainSheet.rowArray[0].setText("Wife");

		// Rename and reposition the "Husband" row
		mainSheet.rowArray[1].setPosition(mainSheet.rowArray[1].x - 30, mainSheet.rowArray[1].y);
		mainSheet.rowArray[1].setDimensions(70,20);
		mainSheet.rowArray[1].setWrap(true);
		mainSheet.rowArray[1].unsubscribe();
		mainSheet.rowArray[1].setText("Husband");

		// Rename and reposition the "Total" row
		mainSheet.rowArray[2].setPosition(mainSheet.rowArray[2].x - 30, mainSheet.rowArray[2].y);
		mainSheet.rowArray[2].setDimensions(70,20);
		mainSheet.rowArray[2].setWrap(true);
		mainSheet.rowArray[2].unsubscribe();
		mainSheet.rowArray[2].setText("Total");

		// Set text callbacks on the the wife total cell
		mainSheet.cellArray[2][0].addFocusChangedCallback(window,"cellCallback");
		mainSheet.cellArray[2][0].addEnterCallback(window,"cellCallback");

		// Set text callbacks on the the husband total cell
		mainSheet.cellArray[2][1].addFocusChangedCallback(window,"cellCallback");
		mainSheet.cellArray[2][1].addEnterCallback(window,"cellCallback");

		// Set text callbacks on the the total total cell
		mainSheet.cellArray[2][2].addFocusChangedCallback(window,"cellCallback");
		mainSheet.cellArray[2][2].addEnterCallback(window,"cellCallback");

		// Setup the first icon and push it onto the icon array
		calcIcon.subscribe();
		calcIcon.clickCallback(window,"iconClick");
		calcIcon.bind = mainSheet.cellArray[2][0];
		calcIcon.setPosition(mainSheet.cellArray[2][0].x + mainSheet.cellArray[2][0].width - 16, mainSheet.cellArray[2][0].y + 2);
		mainSheet.iconArray.push(calcIcon);

		// Setup the second icon and push it onto the icon array
		calcIcon1.subscribe();
		calcIcon1.clickCallback(window,"iconClick");
		calcIcon1.bind = mainSheet.cellArray[2][1];
		calcIcon1.setPosition(mainSheet.cellArray[2][1].x + mainSheet.cellArray[2][1].width - 16, mainSheet.cellArray[2][1].y + 2);
		mainSheet.iconArray.push(calcIcon1);


		// Setup the third icon and push it onto the icon array
		calcIcon2.subscribe();
		calcIcon2.clickCallback(window,"iconClick");
		calcIcon2.bind = mainSheet.cellArray[2][2];
		calcIcon2.setPosition(mainSheet.cellArray[2][2].x + mainSheet.cellArray[2][2].width - 16, mainSheet.cellArray[2][2].y + 2);
		mainSheet.iconArray.push(calcIcon2);
	};

	//------------------------------------------------------------------------------
	// Callback called when the user presses enter or changes textbox focus
	window.cellCallback = function(x,y)
	{
		// Perform any math need if an equation was written
		checkCell(mainSheet.cellArray[2][0]);
		checkCell(mainSheet.cellArray[2][1]);
		checkCell(mainSheet.cellArray[2][2]);
	}

	//------------------------------------------------------------------------------
	// Check if the string in passed text boxes is a valid number
	function checkCell(textbox) {
		var tempVar = textbox.getText();

		if(isNaN(tempVar)) {
			// Try to parse the equation to solve whats inside
			try {
				tempVar = eval(tempVar);
			// If it doesn't work then set to zero
			} catch(e) {
				tempVar = "0";
			}
		}

		// If still a fail then set to zero
		if(isNaN(tempVar)) { tempVar = "0"; }
		textbox.setText(String(tempVar));
	}

	//------------------------------------------------------------------------------
	//  Called when the user exits the calculator dialog
	window.updateCellString = function(){
		var calcAnswer = String(calc.answer);
		if( typeof(calc.answer) === "undefined" ) calcAnswer = "0";
		mainSheet.activeCell.setText(calcAnswer);
		calc.hide();
		calc.calculator.unsubscribe();

	};

	//------------------------------------------------------------------------------
	// Setup Question 1 Step 1
	this.setupQ1S1 = function() {
		// Get the scene reference
		var sceneQ1S1 = thmDemo.getScene(0,0);

		sceneQ1S1.initQuiz = function() {
			logDebug("Question 1 Step 1 initQuiz()");

			// Build the main spread sheet
			window.buildDB(sceneQ1S1.bgLayer);

			// Add all the sprites to scene 1 background layer
			sceneQ1S1.bgLayer.addChild(wife);
			sceneQ1S1.bgLayer.addChild(husband);
			sceneQ1S1.bgLayer.addChild(stranger);
			sceneQ1S1.bgLayer.addChild(gift);
			sceneQ1S1.bgLayer.addChild(stock);
			sceneQ1S1.bgLayer.addChild(moneyBag);
			sceneQ1S1.bgLayer.addChild(time);

			// Add the instruction label
			sceneQ1S1.bgLayer.addChild(instructionLabel);
		}

		sceneQ1S1.loadQuiz = function() {
			logDebug("Question 1 Step 1 loadQuiz()");

			// Set the scene number and setup sprite positions
			intStep = 1;
			window.setupScene(0);

			// If the sheet is on screen move it off screen
			if(boolShowSheet) {
				mainSheet.tableOffset(0,-320);
			}

			// Update flag that the spreadsheet is off screen
			boolShowSheet = false;

			// Set the gift, stock and money bag to be dragable
			gift.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));
			stock.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));
			moneyBag.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));

			// Set the wife's row of the main spreadsheet
			mainSheet.cellArray[0][0].setText("50000");
			mainSheet.cellArray[1][0].setText("nil");
			mainSheet.cellArray[2][0].setText("0");

			// Set the husband's row of the main spreadsheet
			mainSheet.cellArray[0][1].setText("nil");
			mainSheet.cellArray[1][1].setText("25000");
			mainSheet.cellArray[2][1].setText("0");

			// Set the total row of the main spreadsheet
			mainSheet.cellArray[0][2].setText("50000");
			mainSheet.cellArray[1][2].setText("25000");
			mainSheet.cellArray[2][2].setText("0");

			// Subscribe the total column
			mainSheet.cellArray[2][0].subscribe();
			mainSheet.cellArray[2][1].subscribe();
			mainSheet.cellArray[2][2].subscribe();

			// Set the color of the total column to be orange
			mainSheet.cellArray[2][0].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][1].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][2].setColor(1,0.7,0,0.3);

			// Add the calculator icons so they are on top of the main spreadsheet
			sceneQ1S1.addChild(calcIcon);
			sceneQ1S1.addChild(calcIcon1);
			sceneQ1S1.addChild(calcIcon2);

			// Unsubscribe the calculator icons
			calcIcon.unsubscribe();
			calcIcon1.unsubscribe();
			calcIcon2.unsubscribe();

			// Set the calculator icon to be invisible
			calcIcon.setVisibility(false);
			calcIcon1.setVisibility(false);
			calcIcon2.setVisibility(false);

			// Add the calculator and set it invisible
			sceneQ1S1.addChild(calculator.layer);
			calculator.layer.setVisibility(false);
			calc.calculator.unsubscribe();

			// Change the instructions to the step 1 label
			instructionLabel.setText("Step 1) Wife owns shares for the Autumn Company with an ACB = $25,000 and a FMV = $125,000.  She wants to give the husband her shares as a gift in order to split income with him.  Drag the gift over to the husband.");
		}

		sceneQ1S1.cleanUp = function() {
			logDebug("Question 1 Step 1 cleanUp()");

			// Clear dragable from the gift, stock and money bag
			gift.clearDrag();
			stock.clearDrag();
			moneyBag.clearDrag();
		}

		sceneQ1S1.resetQuiz = function() {
			logDebug("Question 1 Step 1 resetQuiz()");
			// Re-run the display function
			sceneQ1S1.loadQuiz();
		}

		sceneQ1S1.showCorrectAnswer = function() {
			// Re-run the display function
			sceneQ1S1.loadQuiz();

			// Raise the curtain
			thmDemo.showCurtain();
			gift.addMoveTo(330, 60, 2);

			// Setup a series of timeouts to run all the animations
			setTimeout("window.animateQ1S1()",2000);
			setTimeout("stock.addMoveTo(330, 80, 2);	moneyBag.addMoveTo(25, 80, 2);",3000);
			setTimeout("window.animateQ1S2()",4000);
			setTimeout("thmDemo.hideCurtain()",5000);

			// Set the active cells to there correct values
			mainSheet.cellArray[2][0].setText("50000");
			mainSheet.cellArray[2][1].setText("25000");
			mainSheet.cellArray[2][2].setText("75000");

			// Set the active cells to be green
			mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
			logDebug("Question 1 Step 1 showCorrectAnswer()");
		}

		sceneQ1S1.checkAnswer = function() {
			logDebug("Question 1 Step 1 checkAnswer()");
			var boolTest = true;

			// If the wife total is correct set green otherwise set red
			if(mainSheet.cellArray[2][0].getText() !== "50000") {
				mainSheet.cellArray[2][0].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			}

			// If the husbands total is correct set green otherwise set red
			if(mainSheet.cellArray[2][1].getText() !== "25000") {
				mainSheet.cellArray[2][1].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			}

			// If the total total is correct set green otherwise set red
			if(mainSheet.cellArray[2][2].getText() !== "75000") {
				mainSheet.cellArray[2][2].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
			}

			return boolTest;
		}
	};
	//------------------------------------------------------------------------------
	// Setup Question 2 Step 1
	this.setupQ2S1 = function() {
		// Get the scene reference
		var sceneQ2S1 = thmDemo.getScene(1,0);

		sceneQ2S1.initQuiz = function() {
			// Add the instruction label
			sceneQ2S1.bgLayer.addChild(instructionLabel);

			// Add all the sprites to scene 2 background layer
			sceneQ2S1.bgLayer.addChild(wife);
			sceneQ2S1.bgLayer.addChild(husband);
			sceneQ2S1.bgLayer.addChild(stranger);
			sceneQ2S1.bgLayer.addChild(gift);
			sceneQ2S1.bgLayer.addChild(stock);
			sceneQ2S1.bgLayer.addChild(moneyBag);
			sceneQ2S1.bgLayer.addChild(time);

			logDebug("Question 2 Step 1 initQuiz()");
		}

		sceneQ2S1.loadQuiz = function() {
			logDebug("Question 2 Step 1 loadQuiz()");

			// Set the scene number and setup sprite positions
			intStep = 2;
			window.setupScene(1);

			// Add the spreadsheet to scene 2 as well
			mainSheet.addParent(sceneQ2S1.bgLayer);

			// If the sheet is on screen move it off screen
			if(boolShowSheet) {
				mainSheet.tableOffset(0,-320);
			}

			// Update flag that the spreadsheet is off screen
			boolShowSheet = false;

			// Set the stock and money bag to be dragable
			stock.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));
			moneyBag.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));

			// Set the wife's row of the main spreadsheet
			mainSheet.cellArray[0][0].setText("62500");
			mainSheet.cellArray[1][0].setText("nil");
			mainSheet.cellArray[2][0].setText("0");

			// Set the husband's row of the main spreadsheet
			mainSheet.cellArray[0][1].setText("nil");
			mainSheet.cellArray[1][1].setText("25000");
			mainSheet.cellArray[2][1].setText("0");

			// Set the total row of the main spreadsheet
			mainSheet.cellArray[0][2].setText("62500");
			mainSheet.cellArray[1][2].setText("25000");
			mainSheet.cellArray[2][2].setText("0");

			// Subscribe the total column
			mainSheet.cellArray[2][0].subscribe();
			mainSheet.cellArray[2][1].subscribe();
			mainSheet.cellArray[2][2].subscribe();

			// Set the color of the total column to be orange
			mainSheet.cellArray[2][0].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][1].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][2].setColor(1,0.7,0,0.3);

			// Add the calculator icons so they are on top of the main spreadsheet
			sceneQ2S1.addChild(calcIcon);
			sceneQ2S1.addChild(calcIcon1);
			sceneQ2S1.addChild(calcIcon2);

			// Unsubscribe the calculator icons
			calcIcon.unsubscribe();
			calcIcon1.unsubscribe();
			calcIcon2.unsubscribe();

			// Set the calculator icon to be invisible
			calcIcon.setVisibility(false);
			calcIcon1.setVisibility(false);
			calcIcon2.setVisibility(false);

			// Add the calculator and set it invisible
			sceneQ2S1.addChild(calculator.layer);
			calculator.layer.setVisibility(false);
			calc.calculator.unsubscribe();

			// Change the instructions to the step 4 label
			instructionLabel.setText("Step 4) Wife owns shares for the Autumn Company with an ACB = $25,000 and a FMV = $125,000.  She wants to sell her shares to her husband for $150,000.  Drag the stock to the husband and the money bag to the wife.");
		}

		sceneQ2S1.cleanUp = function() {
			logDebug("Question 2 Step 1 cleanUp()");

			// Clear dragable from the gift, stock and money bag
			stock.clearDrag();
			moneyBag.clearDrag();
		}

		sceneQ2S1.resetQuiz = function() {
			logDebug("Question 2 Step 1 resetQuiz()");
			// Re-run the display function
			sceneQ2S1.loadQuiz();
		}

		sceneQ2S1.showCorrectAnswer = function() {
			// Re-run the display function
			sceneQ2S1.loadQuiz();

			// Raise the curtain
			thmDemo.showCurtain();
			stock.addMoveTo(330, 80, 2);
			moneyBag.addMoveTo(25, 80, 2);

			// Setup a series of timeouts to run all the animations
			setTimeout("window.animateQ2S1()",2000);
			setTimeout("stock.addMoveTo(330, 80, 2); moneyBag.addMoveTo(25, 80, 2);",3000);
			setTimeout("window.animateQ2S2()",4000);
			setTimeout("thmDemo.hideCurtain()",5000);

			// Set the active cells to there correct values
			mainSheet.cellArray[2][0].setText("62500");
			mainSheet.cellArray[2][1].setText("25000");
			mainSheet.cellArray[2][2].setText("87500");

			// Set the active cells to be green
			mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
			logDebug("Question 2 Step 1 showCorrectAnswer()");
		}

		sceneQ2S1.checkAnswer = function() {
			logDebug("Question 2 Step 1 checkAnswer()");
			var boolTest = true;

			// If the wife total is correct set green otherwise set red
			if(mainSheet.cellArray[2][0].getText() !== "62500") {
				mainSheet.cellArray[2][0].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			}

			// If the husbands total is correct set green otherwise set red
			if(mainSheet.cellArray[2][1].getText() !== "25000") {
				mainSheet.cellArray[2][1].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			}

			// If the total total is correct set green otherwise set red
			if(mainSheet.cellArray[2][2].getText() !== "87500") {
				mainSheet.cellArray[2][2].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
			}

			return boolTest;
		}
	};

	//------------------------------------------------------------------------------
	// Setup Question 3 Step 1
	this.setupQ3S1 = function() {
		// Get the scene refernce
		var sceneQ3S1 = thmDemo.getScene(2,0);

		sceneQ3S1.initQuiz = function() {
			logDebug("Question 3 Step 1 initQuiz()");

			// Add all the sprites to scene 3 background layer
			sceneQ3S1.bgLayer.addChild(wife);
			sceneQ3S1.bgLayer.addChild(husband);
			sceneQ3S1.bgLayer.addChild(stranger);
			sceneQ3S1.bgLayer.addChild(gift);
			sceneQ3S1.bgLayer.addChild(stock);
			sceneQ3S1.bgLayer.addChild(moneyBag);
			sceneQ3S1.bgLayer.addChild(time);

			// Add the instruction label
			sceneQ3S1.bgLayer.addChild(instructionLabel);
		}

		sceneQ3S1.loadQuiz = function() {
			logDebug("Question 3 Step 1 loadQuiz()");

			// Set the scene number and setup sprite positions
			intStep = 3;
			window.setupScene(2);
			mainSheet.addParent(sceneQ3S1.bgLayer);

			// If the sheet is on screen move it off screen
			if(boolShowSheet) {
				mainSheet.tableOffset(0,-320);
			}

			// Update flag that the spreadsheet is off screen
			boolShowSheet = false;

			// Set the stock and money bag to be dragable
			stock.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));
			moneyBag.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));

			// Set the wife's row of the main spreadsheet
			mainSheet.cellArray[0][0].setText("50000");
			mainSheet.cellArray[1][0].setText("nil");
			mainSheet.cellArray[2][0].setText("0");

			// Set the husband's row of the main spreadsheet
			mainSheet.cellArray[0][1].setText("nil");
			mainSheet.cellArray[1][1].setText("65000");
			mainSheet.cellArray[2][1].setText("0");

			// Set the total row of the main spreadsheet
			mainSheet.cellArray[0][2].setText("50000");
			mainSheet.cellArray[1][2].setText("65000");
			mainSheet.cellArray[2][2].setText("0");

			// Subscribe the total column
			mainSheet.cellArray[2][0].subscribe();
			mainSheet.cellArray[2][1].subscribe();
			mainSheet.cellArray[2][2].subscribe();

			// Set the color of the total column to be orange
			mainSheet.cellArray[2][0].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][1].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][2].setColor(1,0.7,0,0.3);

			// Add the calculator icons so they are on top of the main spreadsheet
			sceneQ3S1.addChild(calcIcon);
			sceneQ3S1.addChild(calcIcon1);
			sceneQ3S1.addChild(calcIcon2);

			// Unsubscribe the calculator icons
			calcIcon.unsubscribe();
			calcIcon1.unsubscribe();
			calcIcon2.unsubscribe();

			// Set the calculator icon to be invisible
			calcIcon.setVisibility(false);
			calcIcon1.setVisibility(false);
			calcIcon2.setVisibility(false);

			// Add the calculator and set it invisible
			sceneQ3S1.addChild(calculator.layer);
			calculator.layer.setVisibility(false);
			calc.calculator.unsubscribe();

			// Change the instructions to the step 7 label
			instructionLabel.setText("Step 7) Wife owns shares for the Autumn Company with an ACB = $25,000 and a FMV = $125,000.  She wants to sell her shares to her husband for $45,000.  Drag the stock to the husband and the money bag to the wife.");
		}

		sceneQ3S1.cleanUp = function() {
			logDebug("Question 3 Step 1 cleanUp()");
			// Clear dragable from the stock and money bag
			stock.clearDrag();
			moneyBag.clearDrag();
		}

		sceneQ3S1.resetQuiz = function() {
			logDebug("Question 3 Step 1 resetQuiz()");
			// Re-run the display function
			sceneQ3S1.loadQuiz();
		}

		sceneQ3S1.showCorrectAnswer = function() {
			logDebug("Question 3 Step 1 showCorrectAnswer()");

			// Re-run the display function
			sceneQ3S1.loadQuiz();

			// Raise the curtain
			thmDemo.showCurtain();
			stock.addMoveTo(330, 80, 2);
			moneyBag.addMoveTo(25, 80, 2);

			// Setup a series of timeouts to run all the animations
			setTimeout("window.animateQ3S1()",2000);
			setTimeout("stock.addMoveTo(330, 80, 2); moneyBag.addMoveTo(25, 80, 2);",3000);
			setTimeout("window.animateQ3S2()",4000);
			setTimeout("thmDemo.hideCurtain()",5000);

			// Set the active cells to there correct values
			mainSheet.cellArray[2][0].setText("50000");
			mainSheet.cellArray[2][1].setText("65000");
			mainSheet.cellArray[2][2].setText("115000");

			// Set the active cells to be green
			mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
		}

		sceneQ3S1.checkAnswer = function() {
			logDebug("Question 3 Step 1 checkAnswer()");
			var boolTest = true;

			// If the wife total is correct set green otherwise set red
			if(mainSheet.cellArray[2][0].getText() !== "50000") {
				mainSheet.cellArray[2][0].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			}

			// If the husbands total is correct set green otherwise set red
			if(mainSheet.cellArray[2][1].getText() !== "65000") {
				mainSheet.cellArray[2][1].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			}

			// If the total total is correct set green otherwise set red
			if(mainSheet.cellArray[2][2].getText() !== "115000") {
				mainSheet.cellArray[2][2].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
			}

			return boolTest;
		}
	};

	//------------------------------------------------------------------------------
	// Setup Question 4 Step 1
	this.setupQ4S1 = function() {
		 //Demo-specific sprites
		var sceneQ4S1 = thmDemo.getScene(3,0);

		sceneQ4S1.initQuiz = function() {
			logDebug("Question 4 Step 1 initQuiz()");

			// Add all the sprites to scene 1 background layer
			sceneQ4S1.bgLayer.addChild(wife);
			sceneQ4S1.bgLayer.addChild(husband);
			sceneQ4S1.bgLayer.addChild(stranger);
			sceneQ4S1.bgLayer.addChild(gift);
			sceneQ4S1.bgLayer.addChild(stock);
			sceneQ4S1.bgLayer.addChild(moneyBag);
			sceneQ4S1.bgLayer.addChild(time);

			// Add the instruction label
			sceneQ4S1.bgLayer.addChild(instructionLabel);
		}

		sceneQ4S1.loadQuiz = function() {
			logDebug("Question 4 Step 1 loadQuiz()");

			// Set the scene number and setup sprite positions
			intStep = 4;
			window.setupScene(3);
			mainSheet.addParent(sceneQ4S1.bgLayer);

			// If the sheet is on screen move it off screen
			if(boolShowSheet) {
				mainSheet.tableOffset(0,-320);
			}

			// Update flag that the spreadsheet is off screen
			boolShowSheet = false;

			// Set the gift, stock and money bag to be dragable
			stock.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));
			moneyBag.setDrag(thmDemo.Mouse, false, new Rectangle(0, 10, 470, 310));

			// Set the wife's row of the main spreadsheet
			mainSheet.cellArray[0][0].setText("50000");
			mainSheet.cellArray[1][0].setText("nil");
			mainSheet.cellArray[2][0].setText("0");

			// Set the husband's row of the main spreadsheet
			mainSheet.cellArray[0][1].setText("nil");
			mainSheet.cellArray[1][1].setText("25000");
			mainSheet.cellArray[2][1].setText("0");

			// Set the total row of the main spreadsheet
			mainSheet.cellArray[0][2].setText("50000");
			mainSheet.cellArray[1][2].setText("25000");
			mainSheet.cellArray[2][2].setText("0");

			// Subscribe the total column
			mainSheet.cellArray[2][0].subscribe();
			mainSheet.cellArray[2][1].subscribe();
			mainSheet.cellArray[2][2].subscribe();

			// Set the color of the total column to be orange
			mainSheet.cellArray[2][0].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][1].setColor(1,0.7,0,0.3);
			mainSheet.cellArray[2][2].setColor(1,0.7,0,0.3);

			// Unsubscribe the calculator icons
			calcIcon.unsubscribe();
			calcIcon1.unsubscribe();
			calcIcon2.unsubscribe();

			// Set the calculator icon to be invisible
			calcIcon.setVisibility(false);
			calcIcon1.setVisibility(false);
			calcIcon2.setVisibility(false);

			// Add the calculator icons so they are on top of the main spreadsheet
			sceneQ4S1.addChild(calcIcon);
			sceneQ4S1.addChild(calcIcon1);
			sceneQ4S1.addChild(calcIcon2);

			//mainSheet.addCalculatorIcon(thmDemo,"column",0);
			sceneQ4S1.addChild(calculator.layer);
			calculator.layer.setVisibility(false);
			calc.calculator.unsubscribe();

			// Change the instructions to the step 10 label
			instructionLabel.setText("Step 10) Wife owns shares for the Autumn Company with an ACB = $25,000 and a FMV = $125,000.  She wants to sell her shares to her husband for $125,000.  Drag the stock to the husband and the money bag to the wife.");
		}

		sceneQ4S1.cleanUp = function() {
			logDebug("Question 4 Step 1 cleanUp()");

			// Clear dragable from the gift, stock and money bag
			stock.clearDrag();
			moneyBag.clearDrag();
		}

		sceneQ4S1.resetQuiz = function() {
			logDebug("Question 4 Step 1 resetQuiz()");
			// Re-run the display function
			sceneQ4S1.loadQuiz();
		}

		sceneQ4S1.showCorrectAnswer = function() {
					logDebug("Question 4 Step 1 showCorrectAnswer()");

			// Re-run the display function
			sceneQ4S1.loadQuiz();

			// Raise the curtain
			thmDemo.showCurtain();
			stock.addMoveTo(330, 80, 2);
			moneyBag.addMoveTo(25, 80, 2);

			// Setup a series of timeouts to run all the animations
			setTimeout("window.animateQ4S1()",2000);
			setTimeout("stock.addMoveTo(330, 80, 2); moneyBag.addMoveTo(25, 80, 2);",3000);
			setTimeout("window.animateQ4S2()",4000);
			setTimeout("thmDemo.hideCurtain()",5000);

			// Set the active cells to there correct values
			mainSheet.cellArray[2][0].setText("50000");
			mainSheet.cellArray[2][1].setText("25000");
			mainSheet.cellArray[2][2].setText("75000");

			// Set the active cells to be green
			mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
		}

		sceneQ4S1.checkAnswer = function() {
			logDebug("Question 4 Step 1 checkAnswer()");
			var boolTest = true;

			// If the wife total is correct set green otherwise set red
			if(mainSheet.cellArray[2][0].getText() !== "50000") {
				mainSheet.cellArray[2][0].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][0].setColor(0,1,0,0.3);
			}

			// If the husbands total is correct set green otherwise set red
			if(mainSheet.cellArray[2][1].getText() !== "25000") {
				mainSheet.cellArray[2][1].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][1].setColor(0,1,0,0.3);
			}

			// If the total total is correct set green otherwise set red
			if(mainSheet.cellArray[2][2].getText() !== "75000") {
				mainSheet.cellArray[2][2].setColor(1,0,0,0.3);
				boolTest = false;
			} else {
				mainSheet.cellArray[2][2].setColor(0,1,0,0.3);
			}

			return boolTest;
		}
	};

	// Setup all the questions
	this.setupQ1S1();
	this.setupQ2S1();
	this.setupQ3S1();
	this.setupQ4S1();

	// Start the demo
	thmDemo.begin();
}
window.startDemo = startDemo;