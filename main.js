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
        textarea: true,
        hankaku: false
    });
    function main(){
        var ar = [];
        input_str().split('').forEach(function(c){
            var n = c.charCodeAt();
            if(n < 128) {
                ar.push(n);
            }
            else {
                ar.push(128);
                ar.push((0xff00 & n) >> 8); // 前
                ar.push((0xff & n)); // 後
            }
        });
        var width = Math.ceil(Math.sqrt(ar.length / 3));
        var cv = $("<canvas>").attr({
            width: width,
            height: width
        });
        var ctx = cv[0].getContext("2d");
        var imgData = ctx.getImageData(0, 0, width, width),
            cnt = 0;
        for(var i = 0; i < ar.length; i++){
            var i4 = i * 4;
            for(var o = 0; o < 3; o++){
                imgData.data[i4 + o] = ar[cnt++] || 0;
            }
            imgData.data[i4 + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
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
        ctx.drawImage(img,0,0);
        var data = ctx.getImageData(0, 0, width, height).data;
        var ar = [];
        for(var i = 0; i < data.length; i++){
            var i4 = i * 4;
            for(var o = 0; o < 3; o++){
                ar.push(data[i4 + o]);
            }
        }
        var str = '';
        for(var p = 0; p < ar.length; p++){
            var n = ar[p];
            if(n < 128){
                str += String.fromCharCode(n);
            }
            else if(n === 128){
                str += String.fromCharCode((ar[p + 1] << 8) + ar[p + 2]);
                p += 2;
            }
        }
        yaju1919.addInputText(h_result2.empty(),{
            title: "output",
            value: str.replace(/\0+$/,''),
            textarea: true,
            readonly: true,
            hankaku: false
        });
    }
})();
