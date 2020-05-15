(function() {
    'use strict';
    var h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").appendTo(h).text("文字列を画像データに変換します。");
    var h1 = $("<div>").appendTo(h),
        h2 = $("<div>").appendTo(h);
    yaju1919.addTab(h,{
        list: {
            "文字列→画像": h1,
            "画像→文字列": h2
        }
    });
    $("<button>",{
        text: "変換するボタン"
    }).appendTo(h1).click(main);
    var h_result = $("<div>").appendTo(h1);
    var input_str = yaju1919.addInputText(h1,{
        title: "input",
        placeholder: "ここに変換したい文字列を入力",
        textarea: true
    });
    function main(){
        var hex = toHex(input_str());
        var width = Math.ceil(Math.sqrt(hex.length / 8));
        var HEX = (hex + yaju1919.repeat('0', width)).slice(0, width * width );
        var cv = $("<canvas>").attr({
            width: width,
            height: width
        });
        var ctx = cv[0].getContext("2d");
        var imgData = ctx.getImageData(0, 0, width, width);
        var px = imgData.data;
        for(var i = 0; i < hex.length; i++){
            imgData[i] = parseInt(HEX.slice(i * 2, i * 2 + 1), 16);
        }
        ctx.putImageData(imgData, 0, 0);
        h_result.empty();
        $("<button>",{text:"ダウンロード"}).click(function(){
            var a = $("<a>",{
                href: cv[0].toDataURL("image/png"),
                download: "data.png"
            })[0].click();
        }).appendTo(h_result.empty());
        h_result.append("<br>").append(cv);
    }
    function toHex(str){ // 文字列→16進数
        return str.split('').map(function(c){
            return str.charCodeAt().toString(16);
        }).join('');
    }
    function toStr(str){ // 16進数→文字列
        return str.match(/.{4}/g).map(function(s){
            String.fromCharCode(parseInt(s, 16));
        }).join('');
    }
    $("<button>").appendTo(h2).text("画像選択").click(function(){
        inputFile.val('');
        inputFile.click();
    });
    var h_result2 = $("<div>").appendTo(h2);
    var inputFile = $("<input>").attr({
        type: "file"
    }).change(loadImg);
    function loadImg(e){
        var file = e.target.files[0];
        if(!file) return;
        var blobUrl = window.URL.createObjectURL(file);
        var img = new Image();
        img.onload = function(){
            main2(img);
        };
        img.src = blobUrl;
    }
    function main2(img){
        var width = img.width,
            height = img.height;
        var cv = $("<canvas>").attr({
            width: width,
            height: height
        });
        var ctx = cv.get(0).getContext('2d');
        var imgData = ctx.getImageData(0, 0, width, width);
        var px = imgData.data;
        ctx.drawImage(img,0,0);
        var hex = '';
        for(var i = 0; i < px.length; i++){
            hex += px[i].toString(16);
        }
        yaju1919.addInputText(h_result2.empty(),{
            title: "output",
            value: toStr(hex).replace(/\0+$/,''),
            textarea: true,
            readonly: true
        });
    }
})();
