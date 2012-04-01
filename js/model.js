// JavaScript Document

// The possible activity types
var ActivityType = ["presentation","group_work","discussion","break"]

// This is an activity constractor
// When you want to create a new activity you just call
// var act = new Activity("some activity",20,1,"Some description);
var Activity = function (name,length,typeid,description){
	this._name = name;
	this._length = length;
	this._typeid = typeid;
	this._description = description;
	
	// sets the name of the avtivity
	this.setName = function(name) {
		this._name = name;
		model.notify();
	}
	
	// sets the length of the avtivity
	this.setLength = function(length) {
		this._length = length;
		model.notify();
	}
	
	// sets the typeid of the avtivity
	this.setTypeId = function(typeid) {
		this._typeid = typeid;
		model.notify();
	}
	
	// sets the description of the avtivity
	this.setDescription = function(description) {
		this._description = description;
		model.notify();
	}
	
	// This method returns the string representation of the
	// activity type.
	this.getType = function () {
		return ActivityType[this._typeid];
	};
}

// This is a day consturctor. You can use it to create days, 
// but there is also a specific function in the Model that adds
// days to the model, so you don't need call this yourself.
var Day = function(startH,startM) {
	this._start = startH * 60 + startM;
	this._activities = [];

	// sets the start time to new value
	this.setStart = function(startH,startM) {
		this._start = startH * 60 + startM;
		model.notify();
	}

	// returns the total length of the acitivities in 
	// a day in minutes
	this.getTotalLength = function () {
		var totalLength = 0;
		$.each(this._activities,function(index,activity){
			totalLength += parseInt(activity._length);
		});
		if (totalLength < 10) {
			totalLength = '0' + totalLength; }
		return totalLength;
	};
	
	// returns the string representation Hours:Minutes of 
	// the end time of the day
	this.getEnd = function() {
		var end = this._start + this.getTotalLength();
		var min = end % 60;
		if (min < 10) {
			min = '0' + min; }
		return Math.floor(end/60) + ":" + min;
	};
	
	// returns the string representation Hours:Minutes of 
	// the start time of the day
	this.getStart = function() {
		var min = this._start % 60;
		alert(min);
		if (min < 10) {
			min = '0' + min; }
		return Math.floor(this._start/60) + ":" + min;
	};
	
	// returns the length (in minutes) of activities of certain type
	this.getLengthByType = function (typeid) {
		var length = 0;
		$.each(this._activities,function(index,activity){
			if(activity._typeid == typeid){
				length += parseInt(activity._length);
			}
		});
		if (length < 10) {
			length = '0' + length; }
		return length;
	};
	
	// adds an activity to specific position
	// if the position is not provided then it will add it to the 
	// end of the list
	this._addActivity = function(activity,position){
	//alert ("I'm here");
		if(position != null){
			//alert ("add activity ");
			this._activities.splice(position,0,activity);
		} else {
			//alert ("maybe here");
			this._activities.push(activity);
		}
	};
	
	// removes an activity from specific position
	// this method will be called when needed from the model
	// don't call it directly
	this._removeActivity = function(position) {
		//alert ("Remove :" + this_activities[position]);
		return this._activities.splice(position,1)[0];
	};
	
	// moves activity inside one day
	// this method will be called when needed from the model
	// don't call it directly
	this._moveActivity = function(oldposition,newposition) {
		if(newposition > oldposition) {
			newposition--;
		}
		var activity = this.removeActivity(oldposition);
		this.addActivity(activity, newposition);
	};
}


// this is our main module that contians days and praked activites
var Model = function (){
	this.days = [];
	this.parkedActivities = [ ];
	
	// adds a new day. if startH and startM (start hours and minutes)
	// are not provided it will set the default start of the day to 08:00
	this.addDay = function (startH,startM) {
		var day;
		if(startH){
			day = new Day(startH,startM);
		} else {
			day = new Day(8,0);
		}
		this.days.push(day);
		//alert ("number of days: " + this.days.length);
		//alert ("day " + this.days.length + ": " + this.days[this.days.length]);
		this.notify();
		return day;
	};
	
	// add an activity to model
	this.addActivity = function (activity,day,position) {
		if(day != null) {
			this.days[day]._addActivity(activity,position);
		} else {
			this.parkedActivities.push(activity);
		}
		this.notify();
	}
	
	// add an activity to parked activities
	this.addParkedActivity = function(activity){
		this.parkedActivities.push(activity);
		this.notify();
	};
	
	// remove an activity on provided position from parked activites 
	this.removeParkedActivity = function(position) {
		return this.parkedActivities.splice(position,1)[0];
		this.notify();
	};
	
	// moves activity between the days, or day and parked activities.
	// to park activity you need to set the new day to null
	// to move a parked activity to let's say day 0 you set oldday to null
	// and new day to 0
	this.moveActivity = function(oldday, oldposition, newday, newposition) {
		if(oldday !== "null" && oldday == newday) {
			//alert ("move only position");
			this.days[oldday]._moveActivity(oldposition,newposition);
		} else if(oldday == "null") {
			//alert ("remove parked activity");
			var activity = this.removeParkedActivity(oldposition);
			//alert ("new day: " + this.days[newday]);
			this.days[newday]._addActivity(activity,newposition);
			//alert ("activity: " + activity._name + " moved");
			//alert ("total time: " + this.days[newday].getTotalLength());
		} else if(newday == "null") {
			//alert ("move to parked list");
			var activity = this.days[oldday]._removeActivity(oldposition);
			this.addParkedActivity(activity);
		} else {
			//alert ("remove activity");
			var activity = this.days[oldday]._removeActivity(oldposition);
			//alert ("add activity");
			this.days[newday]._addActivity(activity,newposition);
			//alert ("activity moved");
		}
		this.notify();
	};
	
	//*** OBSERVABLE PATTERN ***
	this._listeners = [];
	
	this.notify = function (args) {
	    for (var i = 0; i < this._listeners.length; i++){
	        this._listeners[i](this, args);
	    }
	};
	
	this.attach = function (listener) {
	    this._listeners.push(listener);
	};
	//*** END OBSERVABLE PATTERN ***
}

// this is the instance of our main model
// this is what you should use in your application
var model = new Model();


// you can use this method to create some test data and test your implementation
function createTestData(){
	model.addDay();
	model.addActivity(new Activity("Introduction",10,0,""),0);
	model.addActivity(new Activity("Idea 1",30,0,""),0);
	model.addActivity(new Activity("Working in groups",35,1,""),0);
	model.addActivity(new Activity("Idea 1 discussion",15,2,""),0);
	model.addActivity(new Activity("Coffee break",20,3,""),0);
	
	console.log("Day Start: " + model.days[0].getStart());
	console.log("Day End: " + model.days[0].getEnd());
	console.log("Day Length: " + model.days[0].getTotalLength() + " min");
	$.each(ActivityType,function(index,type){
		console.log("Day '" + ActivityType[index] + "' Length: " +  model.days[0].getLengthByType(index) + " min");
	});
}