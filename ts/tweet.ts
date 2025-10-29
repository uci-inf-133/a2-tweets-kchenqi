class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const text = this.text.toLowerCase();

        if (text.includes("completed") || text.includes("posted")) {
            return "completed_event";
        }
        if (text.includes("watch my")) {
            return "live_event";
        }
        if (text.includes("achieved")) {
            return "achievement"
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        // if(!this.written) {
        //     return "";
        // }
        //TODO: parse the written text from the tweet

        let text = this.text;

        const linkIndex = text.indexOf("https://");
        let endIndex = text.length;
        if (linkIndex !== -1) {
            endIndex = linkIndex;
        }

        const dashIndex = text.indexOf("-");
        if (dashIndex === -1) {
           return "";
        }
        let written = text.slice(dashIndex + 3, endIndex);
        written = written.replace(/#RunKeeper/, "");
        return written.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const text = this.text.toLowerCase();

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}