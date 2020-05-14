(function() {
    'use strict';
    var h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").appendTo(h).text("文字列を画像データに変換します。");
    var input_str = yaju1919.addInputText(h,{
        title: "input",
        placeholder: "ここに変換したい文字列を入力",
        textarea: true
    });
    $("<button>",{
        text: "変換するボタン"
    }).appendTo(h).click(main);
    var h_result = $("<div>").appendTo(h);
    function main(){
        var ar = toASCII_array(escape256(input_str()));
        var width = Math.ceil(Math.sqrt(ar.length / 4));
        var cv = $("<canvas>").attr({
            width: width,
            height: width
        });
        var ctx = cv[0].getContext("2d");
        for(var i = 0; i < ar.length; i += 4){
            var x = (i / 4) % width,
                y = Math.floor((i / 4) / width);
            var rgba = [ar[i],ar[i+1],ar[i+2],ar[i+3]].map(function(v){
                return v ? v : 0;
            });
            ctx.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
            ctx.fillRect(x, y, 1, 1);
        }
        h_result.empty();
        $("<button>",{text:"ダウンロード"}).click(function(){
            var a = $("<a>",{
                href: cv[0].toDataURL("image/png"),
                download: "data.png"
            })[0].click();
        }).appendTo(h_result.empty());
        h_result.append("<br>").append(cv);
    }
    function escape256(str){
        return str.split('').map(function(c){
            return 255 < c.charCodeAt() ? escape(c) : c;
        }).join('');
    }
    function unescape256(str){
        return str.replace(/%u[0-9A-F]{4}/g,function(s){
            return unescape(s);
        });
    }
    function toASCII_array(str){
        return str.split('').map(function(c){
            return c.charCodeAt();
        });
    }
    function toASCII_str(array){
        return array.map(function(n){
            return String.fromCharCode(n);
        });
    }
    $("<h1>").appendTo(h).text("画像データを文字列に変換します。");
    $("<button>").appendTo(h).text("画像選択").click(function(){
        inputFile.val('');
        inputFile.click();
    });
    var h_result2 = $("<div>").appendTo(h);
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
        yaju1919.addInputText(h_result2.empty(),{
            id: "output",
            title: "output",
            value: unescape256(toASCII_str(ctx.getImageData(0, 0, width, height).data)),
            textarea: true,
            readonly: true
        });
    }
})();
