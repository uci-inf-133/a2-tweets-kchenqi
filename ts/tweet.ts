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
        const text = this.text.toLowerCase();

        if (text.includes("walk")) return "walk";
        if (text.includes("chair ride") || text.includes("bike")) return "biking";
        if (text.includes("run")) return "run";
        if (text.includes("yoga")) return "yoga";
        if (text.includes("swim")) return "swimming";
        if (text.includes("elliptical")) return "elliptical";

        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const text = this.text.toLowerCase();

        const kmmatch = this.text.match(/([\d.]+)\s?km/);
        if (kmmatch) {
            return parseFloat(kmmatch[1]) / 1.609;
        }

        const mimatch = this.text.match(/([\d.]+)\s?mi/);
            if (mimatch) {
            return parseFloat(mimatch[1]);
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const links = this.text.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>')
        return `<tr>
                <td>${rowNumber}</td>
                <td>${this.activityType}</td>
                <td>${links}</td>
            </tr>`;
    }
}