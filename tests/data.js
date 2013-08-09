/**
 *    Test the Data module
 */

var test = require('tap').test,
	ccmf = require('ccmf'),
	fs = require('fs'),
	winston = require('winston'),
	firebase = require('firebase');

/**
 * 	Testing Parameters
 */
var n = 10,
	testFileName = '/tests/data.js',
	sampleFile = '../samples/reuters/reut2-000.sgm',
	outputFileName = '../logs/tests/data.txt';

/**
 *  Logger
 */
winston.profile('test');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({filename: outputFileName })
    ]
});

/**
 *  Prepare Test Situation 
 */

var	startTime = null,
	endTime = null,
	elapsedTime = null,
	recvAck = 0;
	
var testAsync = function(error){
	if (error) {
	    console.log('Data could not be saved.' + error);
	 } else {
	    console.log('Data saved successfully.');
	    
	    endTime = new Date().getTime();
		
		elapsedTime = endTime - startTime;
		
		logger.log('info',
				testName,
				{
					testFile:testFileName,
					purpose:'networklatency-ack',
					description:'Received Band Stored Ack',
					textId:recvAck,
					connectionType:'recv',
					elapsedTime:elapsedTime,
					timeType:'ms'
				}
			);
		
	 }
};

/**
 *  Generate Test Cases  
 */
test('Network Latency for Saving '+n+' Text Content',function(t){
	
	fs.unlink(outputFileName);	
	
	fs.readFile(sampleFile,function read(err,data){
		if(err){
			console.log('Error Reading File : '+err);
		}
		else{
			var content = data,
			textContent = content.toString(),
			registeringText = '',
			bodyIdx = 0,
			max = 0,
		
			bodyTextArr  = textContent.match(/<\s*BODY[^>]*>([^<]*)<\s*\/\s*BODY\s*>/g);
			
			if(bodyTextArr!==null){
				
				max=bodyTextArr.length;
				if(n<max){
					max = n;
				}
				
				for(bodyIdx=0;bodyIdx<max;bodyIdx++){
					
					registeringText = bodyTextArr[bodyIdx].replace(/(<([^>]+)>)/ig,"");
					
					var textMod = ccmf.ccmf.Text.create();
					var dataMod = ccmf.ccmf.Data.create();
					
					var registeringTextShingles = textMod.removedStopWordShingles(registeringText,9);
					
					var registerShinglesFing = textMod.shinglesFingerprintConv(registeringTextShingles);
					
					var minHashSignature = textMod.minHashSignaturesGen(registerShinglesFing);
					
					/* Register the Signature into the Registry*/
					startTime = new Date().getTime();
					
					dataMod.storeLsh(minHashSignature,testAsync);
				}
			}else{
				console.log("No String Found");
			}
		}
	});
	
	fs.close(outputFileName);
	
	t.end();
});


/**
 *  Time to Received Search Queries
 */
test('Network Latency for Saving '+n+' Text Content',function(t){



});
}