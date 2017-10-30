function getopts(args, opts) {
  var result = opts.default || {};
  args.replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function($0, $1, $2, $3) { result[$1] = $3; });
  return result;
}

var args = getopts(location.search, {
  default: {
      //流媒体服务器地址
    ws_uri: 'ws://10.167.13.10:8888/kurento',
    ice_servers: undefined
  }
});

if (args.ice_servers) {
  kurentoUtils.WebRtcPeer.prototype.server.iceServers = JSON.parse(args.ice_servers);
} else {
  null;
}
function setStart(rtsp){
    window.addEventListener('load', function(){
  //获取播放组件id
  var videoOutput = document.getElementById('videoOutput');
  //获取输入框组件id
  var address = document.getElementById('address');
  //设置输入框初始值
  address.value = rtsp;
  console.log(address.value);
    start();
  var pipeline;
  var rtcPeer;
    function start() {
    //判断URL是否为空
  	if(!address.value){
  	  window.alert("你必须先设置视频源URL");
  	  return;
  	}
  	//输入框设为不可编辑状态
  	address.disabled = true;

      //改变加载状态
  	showSpinner(videoOutput);
    var options = {
      remoteVideo : videoOutput
    };

    rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
      function(error){
        if(error){
          return null;
        }
        rtcPeer.generateOffer(onOffer);
        rtcPeer.peerConnection.addEventListener('iceconnectionstatechange', function(event){
          if(rtcPeer && rtcPeer.peerConnection){
              null;
          }
        });
    });
  }
  function onOffer(error, sdpOffer){
    if(error) return onError(error);
    kurentoClient(args.ws_uri, function(error, kurentoClient) {
        if(error) return onError(error);

        kurentoClient.create("MediaPipeline", function(error, p) {
            if(error) return onError(error);

            pipeline = p;

            pipeline.create("PlayerEndpoint", {uri: address.value}, function(error, player){
              if(error) return onError(error);

              pipeline.create("WebRtcEndpoint", function(error, webRtcEndpoint){
                if(error) return onError(error);

          setIceCandidateCallbacks(webRtcEndpoint, rtcPeer, onError);

                webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer){
                    if(error) return onError(error);

            webRtcEndpoint.gatherCandidates(onError);

                    rtcPeer.processAnswer(sdpAnswer);
                });

                player.connect(webRtcEndpoint, function(error){
                    if(error) return onError(error);

                    player.play(function(error){
                      if(error) return onError(error);
                        null;
                    });
                });
            });
            });
        });
    });
  }
  function stop() {
    address.disabled = false;
    if (rtcPeer) {
      rtcPeer.dispose();
      rtcPeer = null;
    }
    if(pipeline){
      pipeline.release();
      pipeline = null;
    }
    hideSpinner(videoOutput);
  }
  //获取id，并添加事件侦听器
  startButton = document.getElementById('start');
  startButton.addEventListener('click', start);
  //获取id，并添加事件侦听器
  stopButton = document.getElementById('stop');
  stopButton.addEventListener('click', stop);
   //开始播放的方法


})
};

function setIceCandidateCallbacks(webRtcEndpoint, rtcPeer, onError){
  rtcPeer.on('icecandidate', function(candidate){
    candidate = kurentoClient.register.complexTypes.IceCandidate(candidate);
    webRtcEndpoint.addIceCandidate(candidate, onError);
  });
  webRtcEndpoint.on('OnIceCandidate', function(event){
    var candidate = event.candidate;
    rtcPeer.addIceCandidate(candidate, onError);
  });
}

//发生错误时调用
function onError(error) {
  if(error) {
    stop();
  }
}

//开始后显示加载状态
function showSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = 'img/transparent-1px.png';
		arguments[i].style.background = "center transparent url('img/spinner.gif') no-repeat";
	}
}

//停止后还原加载状态
function hideSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].src = '';
		arguments[i].poster = 'img/playStop.png';
		arguments[i].style.background = '';
	}
}

$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});
$(function () {
    $("#videoOutput").width($("#camera_container").width())
    $.ajax({
        url:"../../static/data/cameraList.json",
        success:function (response) {
            var sn=window.location.href.split("?")[1];
            console.log(window.location.href)
            var cameras=response.data;
            for(var i=0;i<cameras.length;i++){
                if(cameras[i].sn==sn){
                    var rtsp = cameras[i].stream_address;
                    setStart(rtsp)
                    $("#camera_name").text(cameras[i].name)
                }
            }
        }
    });
})