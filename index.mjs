import * as dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

const api_key = process.env.PD_API_KEY;

//hehe https://vsb.mcgill.ca/vsb/js/common.js?v=1781
function nWindow() {
	var f8b0=["\x26\x74\x3D","\x26\x65\x3D"]
	var t=(Math.floor((new Date())/60000))%1000;
	var e=t%3+t%19+t%42;
	return f8b0[0]+t+f8b0[1]+e;
}

let state = 0;
setInterval(async () => {
	const address = `https://vsb.mcgill.ca/vsb/getclassdata.jsp?term=202401&course_1_0=${process.env.COURSE}&rq_1_0=null${nWindow()}&nouser=1`;
	// https://vsb.mcgill.ca/vsb/getclassdata.jsp?term=202401&course_0_0=COMP-310&rq_0_0=null&t=449&e=43&nouser=1&_=1698086968300
	
	const resp = await fetch(address);
	const text = await resp.text();
	const block = (text).match(/os="(\d+)"/)[1];
	console.log(block);
	if (parseInt(block) != state) {
		// todo: pagerduty
	}

	
}, 1000);
