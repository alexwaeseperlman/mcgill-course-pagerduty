import * as dotenv from 'dotenv';
dotenv.config();
import * as fetch from 'node-fetch';

//hehe https://vsb.mcgill.ca/vsb/js/common.js?v=1781
function nWindow() {
	var f8b0=["\x26\x74\x3D","\x26\x65\x3D"]
	var t=(Math.floor((new Date())/60000))%1000;
	var e=t%3+t%19+t%42;
	return f8b0[0]+t+f8b0[1]+e;
}

let state = 1;
setInterval(async () => {
	const address = `http://vsb.mcgill.ca/vsb/getclassdata.jsp?term=202401&course_0_0=${process.env.COURSE}&rq_0_0=null${nWindow()}&nouser=1`;
	// https://vsb.mcgill.ca/vsb/getclassdata.jsp?term=202401&course_0_0=COMP-310&rq_0_0=null&t=449&e=43&nouser=1&_=1698086968300
	
	const resp = await fetch.default(address, {
		headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'}
	});
	const text = await resp.text();
	const block = (text).match(/os="(\d+)"/)[1];
	console.log(block);
	if (parseInt(block) != state) {
		console.log("Sending alert");
		fetch.default("https://events.pagerduty.com/v2/enqueue", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"payload": {
						"summary": `${block} spaces available in ${process.env.COURSE}`,
						"severity": "critical",
						"source": "Course monitoring"
				},
				"routing_key": process.env.ROUTING_KEY,
				"event_action": "trigger"
			})
		});
	}
	state = parseInt(block);

	
}, 120000);
