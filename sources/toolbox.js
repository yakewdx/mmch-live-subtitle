//  以下選択されたファイルをいじりたい場合はnode.jsのfsが使える
window.$ = window.jQuery = require('jquery');
var remote = require('electron').remote;
var {dialog} = require('electron').remote;
var {BrowserWindow} = require('electron').remote;

//  以下選択されたファイルをいじりたい場合はnode.jsのfsが使える
var fs = require('fs');

$(function () {
    // ボタンが押されたときの挙動
    $('#readXmlTags').on('click', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();

        dialog.showOpenDialog(focusedWindow, {
            properties: ['openFile'],
            filters: [{
                name: '标签文件',
                extensions: ['xml']
            }]
        }, function (files) {
            files.forEach(function (file) {
                getList(file);
            });
        });
    });

    $('#folderSelect').on('click', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        dialog.showOpenDialog(focusedWindow, {
            properties: ['openDirectory']
        }, function (directories) {
            if (directories != undefined)
                directories.forEach(function (directory) {
                    console.log(directory);
                });
        });
    });

    $('#saveXmlTags').on('click', function () {
        dialog.showSaveDialog({
            title: '保存文件',
            filters: [
                { name: '标签文件', extensions: ['xml'] }
            ]
        }, function (filePath) {
            createXMLFile($('#category-root').get(0), filePath);
        });
    });

    setRMenu($('.tag'));

});

// ------------------- begin of haloContext ------------------
/*
 * HaloContext - jQuery plugin for right-click halo context menus
 *
 * Author: Josh Hundley
 * Parts inspired by Chris Domigan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

var active = false;

$.fn.haloContext = function (bindings) {
    $(this).bind("contextmenu", function (e) {
        if (active) hide();
        display(this, bindings['bindings'], e);
        return false;
    });
    return this;
};

function display(trigger, binds, e) {
    active = true; // context active
    c = 0; // bind count
    for (var name in binds) {
        $('body').append('<div id="hb' + c + '" class="hct">' + name + '</div>');
        $('#hb' + c).click({ subject: trigger }, binds[name]);
        c++;
    }

    x = e.pageX - 5;
    y = e.pageY - 5;
    r = (48 * (1 / (Math.tan(Math.PI / c))) / 2); // fun math!

    $('body').append('<div id="hpt"></div>');
    $('#hpt').css("left", e.pageX).css("top", e.pageY).toggle(); // stupid hack

    ang = (360 / c);
    for (i = 0; i < c; i++) {
        temp = $('#hb' + i);
        temp.css("left", x + Math.cos(((ang * i * Math.PI) / 180)) * r);
        temp.css("top", y + Math.sin(((ang * i * Math.PI) / 180)) * r);
        temp.fadeIn("fast");
    }
    $(document).one("click", hide);
    $('#hpt').one("contextmenu", hide);
}

function hide() {
    $('div').remove('#hpt');
    $('div').remove('.hct');
    active = false;
    return false;
}


function removeContent(id) {
    document.getElementById(id).innerHTML = "";
}

// ------------------------- end of haloContext -------------------- 

function setRMenu(jQueryObject) {
    jQueryObject.haloContext({
        bindings: {
            "-": function (e) {
                $(e.data.subject).remove();
            },
            "+": function (e) {
                $(trigger).remove();
            },
            "*": function (e) {
                $(trigger).remove();
            },
            "I": function (e) {
                $(trigger).remove();
            },
            //"I":function(){window.confirm("googleを開きますか？")?location.href="http://www.google.co.jp/":""},
        }
    })
}

// 将文本插入当前光标处
function insertText(str) {
    //var text = str;
    var doc = codeMirror.doc;
    var cursor = doc.getCursor();
    doc.replaceRange(str, cursor, cursor);
    codeMirror.scrollIntoView(cursor);
    codeMirror.focus();
}

// 从文件中获得标签列表
function getList(filename) {
    text = fs.readFileSync(filename, 'utf8');
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text, "text/xml");

    // documentElement always represents the root node
    txt = "";
    x = xmlDoc.documentElement;
    parse_xml(x);
    document.getElementById("name_list").innerHTML = txt;
    $('.category').first().attr("id", "category-root");
    setRMenu($('.tag'));
}


function addNode(domElement) {
    $(domElement).append("<form class=\"newtag\"> \
        <input class=\"newtag_input w-input\" type=\"txt\" name=\"tagName\" id=\"tagName\" placeholder=\"标签名称\" />  \
        <input class=\"newtag_input w-input\" type=\"txt\" name=\"description\" id=\"description\" placeholder=\"描述\"/>  \
        <input class=\"newtag_button w-button\" type=\"button\" value=\"OK\" onclick=\" createTag(this.parentNode)\"> \
        <input class=\"newtag_button w-button\" type=\"button\" value=\"取消\" onclick=\" $(this).parent().remove()\"> \
        </form>"
    );
}

function createTag(formNode) {
    var rootNode = formNode.parentNode;
    $(rootNode).append(tagNameStr($("input[name='tagName']").val(), $("input[name='description']").val()));
    $(formNode).remove();
    setRMenu($('.tag'));
}

function tagNameStr(name, description) {
    if (name !== undefined) {
        if (description === undefined) {
            return '<div class=\"tag\" onclick=\"insertText(this.innerHTML)\">' + name + '</div>'; // onclick=insertText(this.innerHTML)\"
        } else {
            return "<div class=\"tag\" title = \"" + description + "\" onclick=\"insertText(this.innerHTML)\">" + name + "</div>"
        }
    }
}

// 添加分类按钮 C 
function addCategory(domElement) {
    $(domElement).append(
        "<form class=\"newtag\"> \
        <input class=\"newtag_input w-input\" type=\"txt\" name=\"categoryName\" id=\"categoryName\" placeholder=\"类别名称\" />  \
        <input class=\"newtag_button w-button\" type=\"button\" value=\"OK\" onclick=\" createCategory(this.parentNode)\"> \
        <input class=\"newtag_button w-button\" type=\"button\" value=\"取消\" onclick=\" $(this).parent().remove()\"> \
        </form>"
    );
}

// 新建一个分类
function createCategory(formNode) {
    var rootNode = formNode.parentNode;


    txt = "<a class=\"functional_button\" onclick=\"addNode(this.parentNode.parentNode)\">+</a>" +
        "<a class=\"functional_button\" onclick=\"addCategory(this.parentNode.parentNode)\">C</a>" + "</div>";

    $(rootNode).append("<div class=\"category\"><div class=\"category-name\" ><a class=\"category-name-content\" onclick=\"insertText(this.innerHTML)\">" +
        $("input[name='categoryName']").val() + txt + "</div>");
    $(formNode).remove();
}

// 将顶层 category 元素解析为 xml 并保存。
function createXMLFile(domElement, filename) {
    xmlText = "";
    var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\r';
    convert2XMLTree(domElement, 0);
    var xmlDocText = xmlHeader + xmlText;
    fs.writeFile(filename, xmlDocText, function (err) {
        if (err) throw err;
        console.log("File Saved !"); //文件被保存
    });
}

function spaces(num) {
    var spaces = "";
    for (var i = 0; i < num; ++i) {
        spaces += "    ";
    }
    return spaces;
}

function convert2XMLTree(domElement, level) {
    if ($(domElement).attr("class") == "category") {
        xmlText += spaces(level) + '<category name="' + $(domElement).find("a").first().text() + '">\n';
        for (var i = 1; i < domElement.childNodes.length; ++i) {
            convert2XMLTree(domElement.childNodes[i], Number(level) + 1);
        }
        xmlText += spaces(level) + '</category>\n';
    } else if ($(domElement).attr("class") == "tag") {
        xmlText += spaces(level) + '<item name="' + $(domElement).text() + '">\n';
        xmlText += spaces(level + 1) + '<description>';
        if ($(domElement).attr("title") != undefined) {
            xmlText += $(domElement).attr("title");
        } else {
            xmlText += "暂无";
        }
        xmlText += '</description>\n';
        xmlText += spaces(level) + '</item>\n';
    }
}

function parse_xml(xmlNode) {
    if (xmlNode.nodeName == "category") {
        //$("#name_list").append("<div class=\"category\">ctg");
        txt += "<div class=\"category\"><div class=\"category-name\" ><a class=\"category-name-content\" onclick=\"insertText(this.innerHTML)\">" + xmlNode.getAttribute("name") + "</a>";
        txt += "<a class=\"functional_button\" onclick=\"addNode(this.parentNode.parentNode)\">+</a>";
        txt += "<a class=\"functional_button\" onclick=\"addCategory(this.parentNode.parentNode)\">C</a>" + "</div>";
        x = xmlNode.childNodes;
        for (i = 1; i < x.length - 1; i += 2) {
            if (x[i].nodeName == "category") {
                parse_xml(x[i]);
            }
            else {
                children = x[i].childNodes;
                var description = undefined;
                for (j = 1; j < children.length - 1; j += 2) {
                    if (children[j].nodeName == "description") {
                        description = children[j].innerHTML;
                    }
                }
                txt += tagNameStr(x[i].getAttribute("name"), description);
            }
        }
        txt += "</div>"
    }
}
