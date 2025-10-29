function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
	const completed = [];
	const activitycount = {};
	const stats = {};
	const week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

	for (let tweet of tweet_array) {
		if (tweet.distance > 0 && tweet.activityType !== "other" && tweet.activityType !== "yoga") {
			completed.push(tweet);

			activitycount[tweet.activityType] = (activitycount[tweet.activityType] || 0) + 1;

			if (!stats[tweet.activityType]) {
				stats[tweet.activityType] = { distances: [], weekdays: [], weekends: [] };
			}
			stats[tweet.activityType].distances.push(tweet.distance);

			const day = new Date(tweet.created_at).getDay();
			if (day ===0 || day === 6) {
				stats[tweet.activityType].weekends.push(tweet.distance);
			}
			else {
				stats[tweet.activityType].weekdays.push(tweet.distance);
			}
		}
	}

	document.getElementById("numberActivities").textContent = completed.length;

	const sortedactivities = Object.entries(activitycount).sort((a,b) => b[1]-a[1]);
	const topactivities = [];
	for (let i = 0; i < 3 && i < sortedactivities.length; i++) {
		topactivities.push(sortedactivities[i][0]);
	}
	document.getElementById("firstMost").textContent = topactivities[0] || "???";
	document.getElementById("secondMost").textContent = topactivities[1] || "???";
	document.getElementById("thirdMost").textContent = topactivities[2] || "???";

	const avgdist = {};
	for (let activity in stats) {
		const array = stats[activity].distances;
		avgdist[activity] = array.reduce((sum,d)=>sum+d,0)/array.length;
	}

	const furthest = Object.keys(avgdist).reduce((a,b)=>avgdist[a]<avgdist[b]?b:a);
    const shortest = Object.keys(avgdist).reduce((a,b)=>avgdist[a]>avgdist[b]?b:a);

	document.getElementById("longestActivityType").textContent = furthest;
	document.getElementById("shortestActivityType").textContent = shortest;

	const longestStats = stats[furthest];
    const avgWeekday = longestStats.weekdays.length ? longestStats.weekdays.reduce((s,d)=>s+d,0)/longestStats.weekdays.length : 0;
    const avgWeekend = longestStats.weekends.length ? longestStats.weekends.reduce((s,d)=>s+d,0)/longestStats.weekends.length : 0;
    document.getElementById("weekdayOrWeekendLonger").textContent = avgWeekday >= avgWeekend ? "weekdays" : "weekends";

	const topdata = [];
	for (let tweet of completed) {
        if (topactivities.includes(tweet.activityType)) {
            const date = new Date(tweet.time);
            topdata.push({
                day: week[date.getDay()],
                distance: tweet.distance,
                activity: tweet.activityType
            });
        }
    }

	tweet_array.forEach(tweet => {
    tweet.activityType = tweet.activityType;
    tweet.distance = tweet.distance; 
	});

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": tweet_array
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": { "field": "activityType", "type": "nominal", "axis": { "labelAngle": 0 } },
		"y": { "aggregate": "count", "type": "quantitative" },
		"tooltip": [
			{ "field": "activityType", "type": "nominal" },
			{ "aggregate": "count", "type": "quantitative" }
		]},
	  "width": 400,
	  "height": 400
	};

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	
	const distanceRawSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Distances by day of the week (raw points)",
        "data": { "values": topdata },
        "mark": "point",
        "encoding": {
            "x": { "field": "day", "type": "ordinal" },
            "y": { "field": "distance", "type": "quantitative" },
            "color": { "field": "activity", "type": "nominal" },
            "tooltip": [
                { "field": "activity", "type": "nominal" },
                { "field": "distance", "type": "quantitative" },
                { "field": "day", "type": "ordinal" }
            ]
        },
	  	"width": 400,
	  	"height": 400
    };

	    const distanceMeanSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Mean distances by day of the week",
        "data": { "values": topdata },
        "mark": "line",
        "encoding": {
            "x": { "field": "day", "type": "ordinal" },
            "y": { "field": "distance", "type": "quantitative", "aggregate": "mean" },
            "color": { "field": "activity", "type": "nominal" },
            "tooltip": [
                { "field": "activity", "type": "nominal" },
                { "aggregate": "mean", "field": "distance", "type": "quantitative" },
                { "field": "day", "type": "ordinal" }
            ]
        },
		"width": 400,
	  	"height": 400
    };

    // --- Toggle button for raw/mean ---
    let showingRaw = true;
    document.getElementById("aggregate").addEventListener("click", () => {
        showingRaw = !showingRaw;
        const spec = showingRaw ? distanceRawSpec : distanceMeanSpec;
        vegaEmbed('#distanceVis', spec, { actions: false });
    });

    // Initial render: raw distances
    vegaEmbed('#distanceVis', distanceRawSpec, { actions: false });

	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});