function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	let earliestdate = new Date(tweet_array[0].time);
	let latestdate = new Date(tweet_array[0].time);

	for (let i = 1; i < tweet_array.length; ++i) {
		let currentDate = new Date(tweet_array[i].time);

		if (currentDate < earliestdate) {
			earliestdate = currentDate;
		}

		if (currentDate > latestdate) {
			latestdate = currentDate;
		}
	}
	const options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};

	let earliest = earliestdate.toLocaleDateString('en-US', options);
	let latest = latestdate.toLocaleDateString('en-US', options);

	document.getElementById("firstDate").innerText = earliest;
	document.getElementById("lastDate").innerText = latest;

	let completedevents = 0;
	let liveevents = 0;
	let achievements = 0;
	let misc = 0;

	for (let i = 0; i < tweet_array.length; i++) {
		const category = tweet_array[i].source;

		if (category === "completed_event") {
			completedevents++;
		}
		else if (category === "live_event") {
			liveevents++;
		}
		else if (category === "achievement") {
			achievements++;
		}
		else {
			misc++;
		}
	}
	
	document.getElementsByClassName("completedEvents").innerText = completed;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});