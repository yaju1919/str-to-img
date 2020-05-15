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
        var str = input_str();
        var width = Math.ceil(Math.sqrt(str.length / 1.5));
        var cv = $("<canvas>").attr({
            width: width,
            height: width
        });
        var ctx = cv[0].getContext("2d");
        var imgData = ctx.getImageData(0, 0, width, width);
        var hex = [];
        str.split('').forEach(function(c,i){
            var ar = ("0000" + c.charCodeAt().toString(16)).slice(-4).match(/.{2}/g);
            hex.push(ar[0]);
            hex.push(ar[1]);
        });
        var ww4 = width * width * 4;
        for(var i = 0; i < ww4; i += 4){
            for(var o = 0; o < 3; o++){
                imgData.data[i + o] = parseInt(hex.shift(), 16) || 0;
            }
            imgData.data[i + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
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
        var blobUrl = URL.createObjectURL(file);
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
        ctx.drawImage(img,0,0);
        var imgData = ctx.getImageData(0, 0, width, height),
            data = imgData.data;
        var wh4 = width * height * 4, hex = [];
        for(var i = 0; i < wh4; i += 4){
            for(var o = 0; o < 3; o++){
                hex.push(('00' + imgData.data[i + o].toString(16)).slice(-2));
            }
        }
        var str = '';
        while(hex.length){
            str += String.fromCharCode(parseInt(hex.shift() + hex.shift(),16));
        }
        yaju1919.addInputText(h_result2.empty(),{
            title: "output",
            value: str.replace(/\0+$/,''),
            textarea: true,
            readonly: true
        });
    }
})();
