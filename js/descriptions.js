function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let writtenText = [];
	for (let i = 0; i < runkeeper_tweets.length; i++) {
		const tweetData = runkeeper_tweets[i];
		const tweet = new Tweet(tweetData.text, tweetData.created_at);

		if (tweet.source === 'completed_event' && tweet.written){
			writtenText.push(tweet);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById()
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});