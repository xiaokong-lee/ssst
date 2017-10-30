(function(){
	if(typeof(Stomp) == "undefined"){
		console.log("error:please load stomp.js file");
		return false;
	}
	//var stompPackage=Object.create(Stomp);
	var stompPackage=new Object();
	var connectUrl,connectLogin,connectPasscode,connectSuccessCallback,registerTopic,registerHeader,registerValue,subscribeTopic,subscribeCallback;
	var self=this;
	stompPackage.stompDebug=false;
	self.log = function(log){
		if(stompPackage.stompDebug){
			console.log(log);
		}
	};
	function stompConnect(url,user,password,callback){
		if(functionType(callback)){
			connectUrl=url;
			connectLogin=user;
			connectPasscode=password;
			stompPackage.stompClient=Stomp.client(url);
			//if(!(stompPackage.stompDebug==true) && stompPackage.stompClient){
			//	stompPackage.stompClient.debug=false;
			//}
			stompPackage.stompClient.debug=false;
			connectSuccessCallback=callback;
			stompPackage.stompClient.connect(connectLogin, connectPasscode,connectSuccessCallback,connectFailureCallback);
			return stompPackage.stompClient;
		}
	}
	function _stompConnect(url,user,password,callback){
		return function(){
			stompConnect(url,user,password,callback);
		}
	}
	function connectFailureCallback(error){
		self.log('STOMP fail: ' + error);
		//---重新連接stomp服務器，實現自動重連機制
		if(stompPackage.stompClient && stompPackage.stompClient.disconnect){
			stompPackage.stompClient.disconnect();
		}
		setTimeout(_stompConnect(connectUrl,connectLogin,connectPasscode,connectSuccessCallback), 5000);
		self.log('STOMP: Reconecting in 5 seconds');
	}
	function messageParse(message){
		var data=message.body;
		try{
			data=JSON.parse(message.body);
		}
		catch(e){
			self.log('json parse error');
		}
		return data;
	}
	function functionType(func){
		if(typeof(func) === "function"){
			return true;
		}else{
			self.log("there is no callback functions");
			return false;
		}
	}
	function stompSubscribe(topic,callback){
		if(!functionType(callback)){
			return false;
		};
		if(topic.indexOf(",")>=0){
			self.log("the topic is contain char ,");
			strs=topic.split(",");
			for (i=0;i<strs.length ;i++ )
			{
				topic=strs[i];
//				console.log("topic:",topic);
				stompPackage.stompClient.subscribe(topic,function(message){
					var data=messageParse(message);
					callback(data);
				});
			} 
		}else{
			return stompPackage.stompClient.subscribe(topic,function(message){
				var data=messageParse(message);
				callback(data);
			});
		}
	}
	// subscribe for smartPark 
	function stompResourceSubscribe(measureList,onMessageCallback){
		var registerHeader={};
		var registerTopic = '/topic/register';
	    var resourceTopicArray = [];
	    var registerValue,subscribeTopic;
	    if(measureList.constructor == Array){
		    for (var i in measureList) {
		        var resourceId = measureList[i];
		        rsTp = '/topic/new' + resourceId;
		        resourceTopicArray.push(rsTp);
		    }
		    registerValue = measureList.join(',');
		    subscribeTopic = resourceTopicArray.join(',');
	    }else{
	    	registerValue = measureList;
	    	subscribeTopic = '/topic/new' + measureList;
	    }
		if(registerTopic && registerHeader && registerValue){
			stompSend(registerTopic,registerHeader,registerValue);
		}
		if(subscribeTopic && onMessageCallback){
			return stompSubscribe(subscribeTopic,onMessageCallback);
		}
	}
	function stompSend(topic,header,value){
		stompPackage.stompClient.send(topic, header, value);
	}
	function stompIntegrate(info){
		var cnInfo=info.connect;
		var sdInfo=info.send;
		var sbInfo=info.subscribe;
		var dgInfo=info.debug;
		stompPackage.stompDebug=dgInfo;
		if(info && cnInfo  && cnInfo.url && cnInfo.user && cnInfo.password){
			connectUrl=cnInfo.url;
			connectLogin=cnInfo.user;
			connectPasscode=cnInfo.password;
			if(sdInfo){
				registerTopic=sdInfo.topic;
				registerHeader=sdInfo.header || {};
				registerValue=sdInfo.value;
			}
			if(sbInfo){
				subscribeTopic=sbInfo.topic;
				subscribeCallback=sbInfo.onmessage;
			}
			stompConnect(connectUrl,connectLogin,connectPasscode,stompConnectSuccess);
		}else{
			self.log("error:the connect info not conform to the format");
		}
	}
	function stompConnectSuccess(frame){
		self.log("success connect to stomp server");
		if(subscribeTopic && subscribeCallback){
			stompSubscribe(subscribeTopic,subscribeCallback);
		}
		if(registerTopic && registerHeader && registerValue){
			stompSend(registerTopic,registerHeader,registerValue);
		}
	}
	
	function stompCSSI(stompUrl,stompUser,stompPassword,measureList,onMessageCallback){
		//console.log("ddddddddddddddd");
	    var registerTopic = '/topic/register';
	    var resourceTopicArray = [];
	    var registerValue,resourceTopic;
	    if(measureList.constructor == Array){
		    for (var i in measureList) {
		        var resourceId = measureList[i];
		        rsTp = '/topic/new' + resourceId;
		        resourceTopicArray.push(rsTp);
		    }
		    registerValue = measureList.join(',');
		    resourceTopic = resourceTopicArray.join(',');
	    }else{
	    	registerValue = measureList;
	    	resourceTopic = '/topic/new' + measureList;
	    }

	    var stompInfo = {
	        connect: {
	            url: stompUrl,
	            user: stompUser,
	            password: stompPassword
	        },
	        send: {
	            topic: registerTopic,
	            value: registerValue
	        },
	        subscribe: {
	            topic: resourceTopic,
	            onmessage: onMessageCallback
	        },
	        debug: true
	    };
	    stompPackage.stompIntegrate(stompInfo);
	}
	stompPackage.stompConnect=stompConnect;
	stompPackage.stompSubscribe=stompSubscribe;
	stompPackage.stompSend=stompSend;
	stompPackage.stompIntegrate=stompIntegrate;
	stompPackage.stompCSSI=stompCSSI;
	stompPackage.stompResourceSubscribe=stompResourceSubscribe;
	
	
	if (typeof window !== "undefined" && window !== null) {
		window.stompPackage = stompPackage;
	} else if (typeof exports !== "undefined" && exports !== null) {
		exports.stompPackage = stompPackage;
	} else {
		self.stompPackage = stompPackage;
	}
}).call(this);