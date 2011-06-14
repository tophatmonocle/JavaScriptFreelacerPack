function startDemo(plugin, media) {
	var mediaURL = media;
	var slugUUID = "973c420a-f57f-50c4-b6a9-5725444adc04_";
	//------------------------------------------------------------------------------
	// Preamble & initialization
	
	DEBUG_MODE = false;
	
	logDebug("Body start");
	var p = plugin;
	var thmDemo = new THP_Template(p, 545, 371, 2);
	var tween = new Tweener(p);
	var physics = new Physics(p);
	window.thmDemo = thmDemo;
	thmDemo.setInstructionText("This demo creates objects applies physics to them.");
	thmDemo.setTitle("Physics Test");
	
	this.setupQ1 = function() {
		 //Demo-specific sprites   
		var scene = thmDemo.getScene(0);
		var sprBaseball, sprTennis, sprSoccer, sprBasketball, sprBowling;
		var sprCrate, sprSteel, sprPlank;
		var bLoaded = false;
	
		// Set the initialize function
		scene.initQuiz = function() {
			logDebug("Question initQuiz()");
	
			// Set the Q1 question text and status bit
			scene.strInstruction = "Here you have a sandbox 5 balls and 3 blocks with gravity. If you have a device with an accelerometer then the gravity will be controlled by the angle of the device.";
			scene.setCorrect(true);
			scene.setCompleted(true);
			scene.setServerStatus(true); 
	
			sprBaseball = new Sprite(p,mediaURL + slugUUID + "Baseball-Ball-icon.png", 20, 210, 40, 40);
			sprBaseball.setDrag();
			scene.bgLayer.addChild(sprBaseball);
	
			sprTennis = new Sprite(p,mediaURL + slugUUID + "Tennis-Ball-icon.png", 200, 210, 32, 32);
			sprTennis.setDrag();
			scene.bgLayer.addChild(sprTennis);
	
			sprSoccer = new Sprite(p, mediaURL + slugUUID + "Soccer-Ball-icon.png", 20, 80, 56, 56);
			sprSoccer.setDrag();
			scene.bgLayer.addChild(sprSoccer);
			
			sprBasketball = new Sprite(p, mediaURL + slugUUID + "Basketball-Ball-icon.png", 200, 80, 64, 64);
			sprBasketball.setDrag();
			scene.bgLayer.addChild(sprBasketball);
	
			sprBowling = new Sprite(p, mediaURL + slugUUID + "bowling_ball.png", 110, 140, 60, 60);
			sprBowling.setDrag();
			scene.bgLayer.addChild(sprBowling);			
	
			sprCrate = new Sprite(p, mediaURL + slugUUID + "Wooden_Box.png", 320, 120, 72, 72);
			sprCrate.setDrag();
			scene.bgLayer.addChild(sprCrate);
	
			sprSteel = new Sprite(p, mediaURL + slugUUID + "metaluc0.png", 320, 40, 80, 80);
			sprSteel.setDrag();
			scene.bgLayer.addChild(sprSteel);
	
			sprPlank = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank.png", 260, 180, 186, 24);
			sprPlank.setDrag();
			scene.bgLayer.addChild(sprPlank);
		};
	
		// Set the display function
		scene.loadQuiz = function() {
			physics.setEnvironment("pause:true");	
	
			if(!bLoaded) {
				sprTennis.addPhysics("mass:30,elasticity:0.9,friction:0.5");
				sprSoccer.addPhysics("mass:100,elasticity:0.8,friction:0.4");
				sprBasketball.addPhysics("mass:125,elasticity:0.85,friction:0.7");
				sprBaseball.addPhysics("mass:60,elasticity:0.3,friction:0.3");
				sprBowling.addPhysics("mass:400,elasticity:0.1,friction:0.1");
				sprPlank.addPhysics("mass:80,elasticity:0.1,friction:0.7,type:box");
				sprSteel.addPhysics("mass:500,elasticity:0.05,friction:0.2,type:box");
				sprCrate.addPhysics("mass:100,elasticity:0.1,friction:0.7,type:box");
				
				physics.addSegment("Left Wall", 0.0, 0.0, 0.0, 320.0);
				physics.addSegment("Top Wall", 0.0, 320.0, 480.0, 320.0);
				physics.addSegment("Right Wall", 480.0, 0.0, 480.0, 320.0);
				physics.addSegment("Bottom Wall", 0.0, 0.0, 480.0, 0.0);
				
				sprBaseball.subscribe();
				sprTennis.subscribe();
				sprSoccer.subscribe();
				sprBasketball.subscribe();
				sprBowling.subscribe();
				sprCrate.subscribe();
				sprSteel.subscribe();
				sprPlank.subscribe();
				
				bLoaded = true;
			}
			
			sprBaseball.setPosition(20, 210);
			sprTennis.setPosition(200, 210);
			sprSoccer.setPosition(20, 80);
			sprBasketball.setPosition(200, 80);
			sprBowling.setPosition(110, 140);
			sprCrate.setPosition(320, 120);
			sprSteel.setPosition(320, 40);
			sprPlank.setPosition(260, 180);
	
			physics.setEnvironment("gravity_y:300, accelerometer:true, pause:false");
			
			logDebug("Question loadQuiz()");
		};
	
		// Set the clean up function
		scene.cleanUp = function() {
			sprBaseball.unsubscribe();
			sprTennis.unsubscribe();
			sprSoccer.unsubscribe();
			sprBasketball.unsubscribe();
			sprBowling.unsubscribe();
			sprCrate.unsubscribe();
			sprSteel.unsubscribe();
			sprPlank.unsubscribe();
	
			physics.removeAllPhysics();
			bLoaded = false;
			logDebug("Question cleanUp()");
		};
	
		// Set the reset function
		scene.resetQuiz = function() {
			logDebug("Question resetQuiz()");
		};
	
		// Set the show correct answer function
		scene.showCorrectAnswer = function() {
			logDebug("Question showCorrectAnswer()");
		};
	
		// Set the check answer function
		scene.checkAnswer = function() {
			logDebug("Question checkAnswer()");
			return false;
		};		
	};
	
	this.setupQ2 = function() {
		 //Demo-specific sprites   
		var scene = thmDemo.getScene(1);
		var sprRamp, sprBowling, lyrSensorTower;
		var sprBuilding = new Array(9);
		var arrPoints= new Array(9);
		
		var bLoaded = false;	
		var bZone = false;
	
		scene.bbSensorHill = function() {
			logDebug("Bowling ball on the hill.");
			physics.setEnvironment("pause:true");	
			if( bZone ) {
				for (i = 0; i < 10; i++) {
					sprBuilding[i].addTween("x:"+arrPoints[i].x+",y:"+arrPoints[i].y+",rotation:0,time:1");
				}
			}
			physics.setEnvironment("pause:false");	
			bZone = false;
		}
	
		scene.bbSensorTower = function() {
			logDebug("In the zone");
			bZone = true;
		}
	
		// Set the initialize function
		scene.initQuiz = function() {
			logDebug("Question initQuiz()");
	
			// Set the Q2 question text and status bit
			scene.strInstruction = "Here you have a bowling ball and 10 planks built into a tower.  Drag the bowling ball to the top of the hill then release it and watch the physics magic. After the bowl has hit the tower then drag it to the top again an the structure rebuilds.";				
			scene.setCorrect(true);
			scene.setCompleted(true);
			scene.setServerStatus(true); 
	
			sprRamp = new Sprite(p, mediaURL + slugUUID + "ramp.png", 0, 0, 480, 320);
			scene.bgLayer.addChild(sprRamp);	
	
			arrPoints[0] = new Point(336.0, 0.0);
			sprBuilding[0] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank90.png", arrPoints[0].x, arrPoints[0].y, 12, 48);
			scene.bgLayer.addChild(sprBuilding[0]);
	
			arrPoints[1] = new Point(372.0, 0.0);
			sprBuilding[1] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank90.png", arrPoints[1].x, arrPoints[1].y, 12, 48);
			scene.bgLayer.addChild(sprBuilding[1]);
	
			arrPoints[2] = new Point(408.0, 0.0);
			sprBuilding[2] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank90.png", arrPoints[2].x, arrPoints[2].y, 12, 48);
			scene.bgLayer.addChild(sprBuilding[2]);
	
			arrPoints[3] = new Point(444.0, 0.0);
			sprBuilding[3] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank90.png", arrPoints[3].x, arrPoints[3].y, 12, 48);
			scene.bgLayer.addChild(sprBuilding[3]);
	
			arrPoints[4] = new Point(336.0, 48.0);
			sprBuilding[4] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank.png", arrPoints[4].x, arrPoints[4].y, 48, 12);
			scene.bgLayer.addChild(sprBuilding[4]);
	
			arrPoints[5] = new Point(408.0, 48.0);
			sprBuilding[5] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank.png", arrPoints[5].x, arrPoints[5].y, 48, 12);
			scene.bgLayer.addChild(sprBuilding[5]);
			
			arrPoints[6] = new Point(372.0, 60.0);
			sprBuilding[6] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank.png", arrPoints[6].x, arrPoints[6].y, 48, 12);
			scene.bgLayer.addChild(sprBuilding[6]);
	
			arrPoints[7] = new Point(372.0, 72.0);
			sprBuilding[7] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank90.png", arrPoints[7].x, arrPoints[7].y, 12, 48);
			scene.bgLayer.addChild(sprBuilding[7]);
	
			arrPoints[8] = new Point(408.0, 72.0);
			sprBuilding[8] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank90.png", arrPoints[8].x, arrPoints[8].y, 12, 48);
			scene.bgLayer.addChild(sprBuilding[8]);
	
			arrPoints[9] = new Point(372.0, 120.0);
			sprBuilding[9] = new Sprite(p, mediaURL + slugUUID + "Wooden_Plank.png", arrPoints[9].x, arrPoints[9].y, 48, 12);
			scene.bgLayer.addChild(sprBuilding[9]);
			
			sprBowling = new Sprite(p, mediaURL + slugUUID + "bowling_ball.png", 192.0, 44.0, 48, 48);
			sprBowling.setDrag();
			scene.bgLayer.addChild(sprBowling);
	
			lyrSensorTower = new Layer(p, 336.0, 0, 120.0, 136.0);
			lyrSensorTower.setColor(0.0, 0.0, 0.0, 0.0);
	
			lyrSensorHill= new Layer(p, 0.0, 0, 240.0, 320.0);
			lyrSensorHill.setColor(0.0, 0.0, 0.0, 0.0);
		};
	
		// Set the display function
		scene.loadQuiz = function() {
			var i = 0;
			bZone = false;
			physics.setEnvironment("pause:true");	
	
			sprBowling.setPosition(192.0, 44.0);
			sprBowling.subscribe();
			
			for (i = 0; i < 10; i++) {
				sprBuilding[i].setRotation(0.0);
				sprBuilding[i].setPosition(arrPoints[i].x, arrPoints[i].y);
			}
	
			if(!bLoaded) {
				sprBowling.addPhysics("mass:200,elasticity:0.1,friction:0.1");
	
				for (i = 0; i < 10; i++) {
					sprBuilding[i].addPhysics("mass:10,elasticity:0.1,friction:0.7,type:box");
				}
				
				physics.addSegment("Left Wall",   0.0,   0.0,   0.0,   320.0);
				physics.addSegment("Top Wall",    0.0,   320.0, 480.0, 320.0);
				physics.addSegment("Right Wall",  480.0, 0.0,   480.0, 320.0);
				physics.addSegment("Bottom Wall", 0.0,   0.0,   480.0, 0.0);
	
				physics.addSegment("Ramp",   0.0, 270.0,  96.0, 107.0);
				physics.addSegment("Ramp",  96.0, 107.0, 144.0,  64.0);
				physics.addSegment("Ramp", 144.0,  64.0, 192.0,  43.0);
				physics.addSegment("Ramp", 192.0,  43.0, 240.0,  43.0);
				physics.addSegment("Ramp", 240.0,  43.0, 288.0,  64.0);
				physics.addSegment("Ramp", 288.0,  64.0, 312.0,   0,0);
	
				lyrSensorTower.addPhysics("sensor:true,type:box");
				lyrSensorTower.addCollision(sprBowling, scene, "bbSensorTower");
				pinMiddle(lyrSensorTower);
	
				lyrSensorHill.addPhysics("sensor:true,type:box");
				lyrSensorHill.addCollision(sprBowling, scene, "bbSensorHill");
				pinMiddle(lyrSensorHill);				
				
				bLoaded = true;
			}
	
			physics.setEnvironment("gravity_y:300,pause:false");	
			
			logDebug("Question loadQuiz()");
		};
	
		// Set the clean up function
		scene.cleanUp = function() {
			sprBowling.subscribe();
			physics.removeAllPhysics();
			bLoaded = false;
			logDebug("Question cleanUp()");
		};
	
		// Set the reset function
		scene.resetQuiz = function() {
			logDebug("Question resetQuiz()");
		};
	
		// Set the show correct answer function
		scene.showCorrectAnswer = function() {
			logDebug("Question showCorrectAnswer()");
		};
	
		// Set the check answer function
		scene.checkAnswer = function() {
			logDebug("Question checkAnswer()");
			return false;
		};			
	};
	
	function pinMiddle(sprite) {
		var centerX = sprite.x + (sprite.width * 0.5);
		var centerY = sprite.y + (sprite.height * 0.5);
	
		sprite.addJoint("NULL", "type:pivot,anchor_ax:" + centerX + ",anchor_ay:" + centerY);			
	}
	
	function pinSide(sprite) {
		var centerX = sprite.x + sprite.width;
		var centerY = sprite.y + (sprite.height * 0.5);
	
		sprite.addJoint("NULL", "type:pivot,anchor_ax:" + centerX + ",anchor_ay:" + centerY);			
	}
	
	// Run the setup functions for each questions
	this.setupQ1();
	this.setupQ2();
	
	// Start the demo
	thmDemo.begin();
	
}
window.startDemo = startDemo;
