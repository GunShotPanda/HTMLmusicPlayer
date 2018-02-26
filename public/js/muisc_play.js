;(function(global){
    var __INFO__ = {
        plugins: "MusicPlayer",
        version: "0.0.2",
        author: "perry",
        website: "http://imudges.com"
    };
    var defualts = {
        audioList: "",
        el: "",
        position: "",
        buttonImgSrc: "",
        htmls: `<audio autoplay loop style="width:0px;">
                    <source src="" type="audio/mpeg" />
                </audio>
                <a style="width:32px;height:32px;display:inline-block;"></a>
                <select>
                </select>`
    };
    var PlayCode = function(options) {
        var settings = Object.assign({}, defualts, options);//缺省值合并
        var audioDom = settings.el ? document.getElementById(settings.el) : document.body;//获得用户传入的节点
        if(!audioDom) audioDom = document.body;

        var audioBox = document.createElement("div");
        audioBox.id = "musicControl";
        audioBox.style = "opacity:0.5;overflow:hidden;position:absolute;z-index:999;" + settings.position;
        audioBox.innerHTML = settings.htmls;
        //插入节点
        audioDom.appendChild(audioBox);

        var audioButton = audioBox.querySelectorAll("a")[0];
        var audioList = audioBox.querySelectorAll("select")[0];
        var audioTag = audioBox.querySelectorAll("audio")[0];

        //更换播放按钮图片
        if(!settings.buttonImgSrc) {
            console.log(1)
            audioButton.style.backgroundSize = "32px";
            audioButton.style.height = "32px";
            audioButton.style.backgroundPosition = "0px 0px";
            audioButton.style.backgroundImage =  'url(img/musicon.png)';
        }else{
            audioButton.style.backgroundImage = 'url('+settings.buttonImgSrc+')';
        }

        audioButton.state = true;

        var _urlType = toString.apply(settings.audioList);
        if(_urlType === '[object Object]'){
            var _temp = [];
            _temp.push(settings.audioList);
            settings.audioList = _temp;
        }

        if(!settings.audioList.length){
            console.error(__INFO__.plugins + '无音乐资源启动失败，请添加音乐资源 audioList');
            return;
        }

        if(typeof settings.audioList === 'object'){
            audioTag.src = settings.audioList[0].source;
            for(var i=0; i<settings.audioList.length; i++){
                var _option = new Option(settings.audioList[i].title, settings.audioList[i].source);
                audioList.add(_option);
            }
        }else{
            audioTag.src = settings.audioList;
            audioList.style.display = 'none';
        }

        var audioFn = {
            play: function(url) {
                if(url) audioTag.src = url;
                audioButton.style.backgroundImage="url(img/musicon.png)";
                audioButton.style.backgroundPosition = "0";
                audioTag.play();
            },
            stop: function() {
                audioButton.style.backgroundImage="url(img/musicoff.png)";
                audioButton.style.backgroundPosition = "32px 0px";
                audioTag.pause();
            }
        };

        var _device = (/Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent));
        var clickEvtName = _device ? "touchstart" : "mousedown";

        //给按钮绑定事件
        audioButton.addEventListener(clickEvtName, function(e){
            //判断播放状态
            if(this.state) {
                this.state = false;
                audioFn.stop();
            }else{
                this.state = true;
                audioFn.play();
            }
        });

        //从下拉列表选择歌曲播放
        audioList.addEventListener("change", function(e){
            var muiscName = this.options[this.selectedIndex].value;
            audioFn.play(muiscName);
            audioButton.state = true;
        });

        //判断是否是微信
        if(navigator.userAgent.toLowerCase().match(/micromessenger/i)) {
            document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){
                WeixinJSBridge.invoke("getNetworkType", {}, function(e){
                    audioFn.play();
                });
            });
        }
    };
    
    global[__INFO__.plugins] = PlayCode;
})(typeof window !== 'undefined' ? window : this);