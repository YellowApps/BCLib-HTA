//BCLib JavaScript Library
//by pixels4tech@gmail.com


document.body.style.fontFamily = "sans-serif"
document.body.style.backgroundImage = "url('images/bg.png')"
document.body.style.backgroundRepeat = "no-repeat"

try{
      document.getElementsByTagName("style")[0].innerHTML += "*{cursor: url(\"images/cursor.cur\"), default;}"
}catch(e){
      document.head.innerHTML += "<style></style>";
      document.getElementsByTagName("style")[0].innerHTML += "*{cursor: url(\"images/cursor.cur\"), default;}"
}
if(!desktop) document.body.innerHTML += "<div id='desktop'></div>";
if(!windows) document.body.innerHTML += "<div id='windows'></div>";

var bclib = {
      CLI: {
        createCLIWindow: function(t, state){
          createWindow(t, "<div id='clishell' style='background: black; color: white; font-family: Courier, monospace; "+ (state ? "width: 300px; height: 200px;" : "") + "'></div>")
        },
        echo: function(txt){
          clishell.innerHTML += txt+"<br>"
        },
        clear: function(){
          clishell.innerHTML = ""
        },
        input: function(todo){
          clishell.innerHTML += "<input type='text' id='inp' style='color: white; background: black; font-family: monospace;'><br><button style='color: white; background: black;' onclick='bclib.temp.inputValue = inp.value; "+todo+"'>OK</button><br>"
        }
      },
      util: {
        installApp: function(file){

        },
        utilmgr: function(object){
          createWindow("Utility Manager", "<input type='text' id='obj' placeholder='Адрес объекта' value='bclib.util'> <button id='ok'>OK</button><hr style='margin:0px;'><div id='list'></div><input type='text' id='params' placeholder='Параметры'>")

          ok.onclick = function(){
            list.innerHTML = ""
            for(var i in eval(obj.value)){
                if(typeof(eval(obj.value)[i]) == "function"){
                    list.innerHTML += "<img src='images/run.png' width=16 height=16> <code onclick='eval(\""+obj.value+"."+i+"(\"+params.value+\")"+"\")'>" + i +"</code><hr style='margin:0px;'>"
                }
            }
          }

          if(object){
            obj.value = object
            ok.click()
          }
        },
        yedit: function(object){
          createWindow("YEditor", "<input type='text' id='obj' placeholder='Адрес объекта' value='bclib.util'> <button id='ok'>OK</button><hr style='margin:0px;'><div id='list'></div><button id='del_'>Удалить</button> <button id='new_'>Создать</button>")

          ok.onclick = function(){
            list.innerHTML = ""
            for(var i in eval(obj.value)){
                list.innerHTML += "<img src='images/file-js.png' width=16 height=16> <code onclick='bclib.util.edit(\""+obj.value+"."+i+"\")'>" + i +"</code><hr style='margin:0px;'>"
            }
          }

          del_.onclick = function(){
            createWindow("Удалить", "<input id='todel'> <button id='okdel'>OK</button>");
            okdel.onclick = function(){eval("delete " + obj.value + "." + todel.value)}
          }

          new_.onclick = function(){
            createWindow("Создать", "<input id='tonew'> <button id='oknew'>OK</button>")
            oknew.onclick = function(){eval(obj.value + "." + tonew.value + " = ''")}
          }

          if(object){
            obj.value = object
            ok.click()
          }
        },
        run: function(tr){
          try{
            return eval(tr)
          }catch(e){
            return e
          }
        },
        close: function(){
          windows.innerHTML = ""
        },
        reboot: function(){
          window.location.reload()
        },
        showMessage: function(title, text, btn, click){
          createWindow(title, text + "<br><button onclick='"+click+"'>"+btn+"</button>")
        },
        addApp: function(file, url, width, height){
          bclib.storage[file] = "createWindow('"+file+"', '<iframe style=\"overflow: auto; resize: both;\" src=\""+url+"\" width="+width+" height="+height+"></iframe>')"
        },
        openPage: function(page){
          createWindow(page, "<iframe style='overflow: auto; resize: both;' src='"+page+"' width=400 height=300></iframe>")
        },
        mediaplayer: function(file, state){
          var fileJSON = JSON.parse(bclib.storage[file])
          if(state == "get"){
            return fileJSON
          }
          var out = "<h1>Error</h1>Incorrect mediafile."
          switch(fileJSON.type){
            case("video"):
              out = "<video width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"' controls></video>"
              createWindow(file + " - Mediaplayer", out)
              break
            case("audio"):
              out = "<audio width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"' controls></audio>"
              break
              case("image"):
              out = "<img width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"'>"
              createWindow(file + " - Mediaplayer", out)
              break
            case("canvas"):
              out = "<canvas id='cnv' width="+fileJSON.width+" height="+fileJSON.height+" ></canvas>"
              createWindow(file + " - Mediaplayer", out)
              bclib.temp.ctx = document.getElementById("cnv").getContext("2d")
              eval(fileJSON.code)
              break
          }

        },
        varexp: function(obj){
          createWindow("Variables Explorer", "<div id='varexp' style='color: white; background: black; font-family: monospace;'></div>")
          varexp.innerHTML += "Name&nbsp;&nbsp;&nbsp;Type&nbsp;&nbsp;&nbsp;Value<br><br>"
          var value = ""
          for(var i in window[obj]){
            switch(typeof(window[obj][i])){
            case("object"):
              value = Object.keys(window[obj][i]).join(", ")
              break
            case("function"):
              break
            default:
              value = window[obj][i]
            }
          varexp.innerHTML += (i + "&nbsp;&nbsp;&nbsp;" + typeof(window[obj][i]) + "&nbsp;&nbsp;&nbsp;" + value + "<br>")
          }
        },
        cmd: function(state){
			bclib.CLI.createCLIWindow('Command Line', state); bclib.CLI.input('bclib.CLI.echo(bclib.util.run(bclib.temp.inputValue))')
        },
        bpf: {
          pack: function(fn, name, files){
            var fc = files.length, del = "~~~BCLIB BPF FILE~~~";
            var obj = {name: name, files: files, data: ""};

            for(var i in files){
              obj.data += bclib.file.read(files[i]) + del;
            }

            bclib.file.write(fn, JSON.stringify(obj));
          },
          unpack: function(filename){
            var content = JSON.parse(bclib.file.read(filename));

            content.data = content.data.replaceAll("\\r", "\r").replaceAll("\\n", "\n");
            content.data = content.data.split("~~~BCLIB BPF FILE~~~");
            content.data.pop();

            for(var i in content.files){
              bclib.file.write(content.name + "." + content.files[i], content.data[i]);
            }
          }
        },
        filemgr: function(){
			var txt = "";
			  
			window.getFileList = function(){
				var fconf = bclib.file.read("files.conf").replaceAll("\r", "").split("\n");
				for(var i in fconf){
					fconf[i] = fconf[i].split(":");
				}
				txt = "";
				for(var file in bclib.storage){
					if(file.split(".")[0] == "hidden") continue;
	
					var cconf = "notFound";
					var ext = file.split(".")[file.split(".").length-1];
					
					for(var f in fconf){
						if(fconf[f][0] == ext){
							cconf = fconf[f];
							break;
						}
					}
						
					if(cconf != "notFound"){
						txt += "<img src='"+cconf[2]+"' width=20 height=22><code title='"+cconf[1]+"' oncontextmenu=\""+cconf[4].replaceAll("FILE", file)+";return false;\" onclick=\""+cconf[3].replaceAll("FILE", file)+"\">"+file+"</code><hr style='margin: 0px;'>"
					}else{
						txt += "<img src='images/file.png' width=20 height=22><code title='Файл' oncontextmenu='bclib.file.edit(\""+file+"\");return false' onclick='bclib.file.edit(\""+file+"\");'>"+file+"</code><hr style='margin: 0px'>"
					}
				}
				filelist.innerHTML = txt;
			}
			  
			  //txt += "<img src='images/"+file+"' width=20 height=22><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick='"+click+"' >" + i + "</code><hr style='margin: 0px;'>"
			
		  createWindow("File Manager", "<div id='filelist'></div><button onclick='bclib.temp.del()'>Удалить файл</button> <button onclick='bclib.temp.new()'>Новый файл</button>")
			getFileList();
			
			bclib.temp.del = function(){
			  createWindow("Удалить","<input id='todel'> <button onclick='bclib.temp.deletedFiles[todel.value] = bclib.storage[todel.value]; delete bclib.storage[todel.value]; getFileList();'>OK</button>")
			}
			bclib.temp.new = function(){
			  createWindow("Создать","<input id='fn'> <button onclick='bclib.file.write(fn.value, \"\"); getFileList();'>OK</button>")
			}
        },
        edit: function(v){
          createWindow(v, "<textarea id=TA rows=7 cols=22>"+eval(v)+"</textarea><br><button id=BTN>OK</button>")
          BTN.onclick = function(){eval(v + " = " + "'" + TA.value + "'")}
        },
        ythemer: function(){
          createWindow("YThemer", "\
          <fieldset><legend>Фон</legend>\
          <input id='clr' type='color' value='#ff0000'><button onclick='bclib.temp.chclr()' style='float: right;'>OK</button></fieldset>\
          <fieldset><legend>Окна</legend>\
          <div style='clear: both;'>windowStyle <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.windowStyle\")'>Открыть</button></div>\
          <div style='clear: both;'>windowHeaderStyle <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.windowHeaderStyle\")'>Открыть</button></div>\
          <div style='clear: both;'>closeButtonStyle <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.closeButtonStyle\")'>Открыть</button></div>\
          <div style='clear: both;'>closeButtonText <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.closeButtonText\")'>Открыть</button></div></fieldset>");

          bclib.temp.chclr = function(){
          delete document.body.style.backgroundImage;
          document.body.style.background = clr.value;
          }
        },
      },
        file: {
          write: function(filename, text){
            bclib.storage[filename] = text
          },
          add: function(filename, text){
            bclib.storage[filename] += text
          },
          read: function(filename){
            return bclib.storage[filename]
          },
          edit: function(filename, state){
            if(state){
              createWindow(filename, "<div id=TA contenteditable style=\"outline: none;\">" + bclib.storage[filename] + "</div><hr style=\"margin: 0px;\"><button id=BTN>OK</button>")
            }else{
              createWindow(filename, "<textarea rows=7 cols=22 id=TA>"+bclib.storage[filename]+"</textarea><br><button id=BTN>OK</button>")
            }
            BTN.onclick = function(){bclib.storage[filename] = TA.value || TA.innerHTML}
          },
          run: function(filename){
            try{
              return eval(bclib.storage[filename])
            }catch(e){
              return e
            }
          },
          delete: function(filename){
            delete bclib.storage[filename]
          },
          download: function(filename, link, cb){
			var xhr = WScript.CreateObject("Microsoft.XMLHTTP");
			xhr.Open("GET", link + ((link.indexOf("?") > 0)?"&":"?") + "rand=" + new Date().getTime(), false);
			xhr.Send(null);
			bclib.file.write(filename, xhr.responseText);
			if(cb) cb();
          },
		  dump: function(obj){
			if(!obj) obj = bclib.storage;

			var r = "Dumping " + obj + " to FS...<br>";
			try{
				var fs = WScript.CreateObject("Scripting.FileSystemObject");
				var fls = Object.keys(bclib.storage);
				for(var i in bclib.storage){
					var f = fs.CreateTextFile("files\\" + i, 1, 0);
					f.Write(bclib.storage[i]);
					f.Close();
					r += "Dumped bclib.storage[\"" + i + "\"] to FS.<br>";
				}
				r += "Dumped bclib.storage to FS.";
			}catch(e){
				r += "Dump failed: " + e;
			}
			return r;
		  },
		  load: function(){
			var r = "Loading files to bclib.storage...<br>";
			bclib.storage = {}

			var fs = WScript.CreateObject("Scripting.FileSystemObject");
			var files = fs.GetFolder("files");

			for(var e = new Enumerator(files.Files); !e.atEnd(); e.moveNext()){
				try{bclib.storage[e.item().Name] = fs.OpenTextFile(e.item().Path).ReadAll();}catch(e){}
				r += "Loaded " + e.item().Name + " to bclib.storage.<br>"
			}
			r += "Loaded files to bclib.storage.";
			return r;
		  },
          open: function(filename){
            createWindow(filename, "<div>" + bclib.util.file.read(filename) + "</div>")
          }
        },
		data: {
			open: function(filename, w, h){
				var file = JSON.parse(bclib.file.read(filename));
				
				createWindow(filename, "<iframe width="+w+" height="+h+" src='data:"+file.type+","+(file.base64?"base64":"")+";"+file.data+"'></iframe>")
				
			},
			create: function(filename, type, base64, data){
				
			}
		},
      system: {
        shell: WScript.CreateObject("WScript.Shell"),
        fs: WScript.CreateObject("Scripting.FileSystemObject"),
        wnd: app,
        setWndTitle: function(newttl){
          ttl.innerHTML = newttl;
        },
        setWndIcon: function(nwicon){
          app.icon = nwicon;
        },
        setWndSize: function(x, y){
          window.resizeTo(x, y);
        },
        setWndLocation: function(){
          window.moveTo(x, y);
        },
        setWndBgColor: function(clr){
          document.body.style.backgroundColor = clr;
        }
      },
      temp: {
        windowStyle: "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
        closeButtonStyle: "float: right; background: white; border: solid 1px black;",
        windowHeaderStyle: "",

        closeButtonText: " X ",

        deletedFiles: {},

      },
      themes: {
            normal: function(){
                 bclib.temp.windowStyle = "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
                 bclib.temp.closeButtonStyle = "float: right; background: white; border: solid 1px black;",
                 bclib.temp.windowHeaderStyle = "",
                 createWindow("", "<h1>Done.</h1>");
            },
            padding: function(){
                 bclib.temp.windowStyle = "padding: 3px; padding-top: 0px; overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
                 bclib.temp.closeButtonStyle = "float: right; background: white; border: solid 1px black;",
                 bclib.temp.windowHeaderStyle = "",
                 createWindow("", "<h1>Done.</h1>");
            },
            dark: function(){
                 delete document.body.style.backgroundImage;
                 document.body.style.background = "#000000";
                 bclib.temp.closeButtonStyle = "float: right; background: black; color: white; border: solid 1px white;";
                 bclib.temp.windowStyle += "background: black; color: white; border: solid 1px white;";
                 bclib.util.close();
                 createWindow("", "<h1>Done.</h1>");
            },
            winxp: function(){
                  bclib.temp.windowStyle = "overflow: auto; resize: both; background: white; display: inline-block; border: solid 2px blue; margin: 2px; position: absolute; border-radius: 5px;",
                  bclib.temp.closeButtonStyle = "float: right; background: red; color: white; padding-left: 5px; padding-right: 5px; font-weight: bold; border-radius: 5px;",
                  bclib.temp.windowHeaderStyle = "background: blue; color: white;"
            },
            secret: function(){
                  delete document.body.style.backgroundImage;
                  document.body.style.background = "#39ff14";
                  document.body.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
                  bclib.temp.windowHeaderStyle = "background: green; color: deepPink; font-size: 300%;";
                  bclib.temp.closeButtonStyle = "float: right; background: aqua; font-size: 100%;"
                  bclib.temp.closeButtonText = " # ";
                  bclib.temp.windowStyle += "background: red; color: blue;"
                  bclib.util.close();
                  createWindow("", "<h1>Done.</h1>");
            }
      },
      desktop: function(){
        var dconf = bclib.file.read("desktop.conf").replaceAll("\r", "").replaceAll("\\n","<br>").replaceAll("[Options]\n", "").split("[Icons]\n");
		eval(dconf[0]);
		
		var icons = dconf[1].split("\n");
		for(var i in icons){
			icons[i] = icons[i].split(":");
			var icn = icons[i];
			
			if(i % icons_per_row == 0 && i != 0) desktop.innerHTML += "<br>";
			desktop.innerHTML += "<div style='display: inline-block; margin: 30px' onclick='"+icn[2]+"'><img width=50 height=50 src='"+icn[1]+"'><br><span style='color: white'>"+icn[0]+"</span></div>";
		}
      },
      json: {
          load: function(file){
              try{
                  bclib.json[file.replace(".json", "")] = JSON.parse(bclib.storage[file]);
              }catch(e){
                  createWindow("JSON", "<pre>" + e + "</pre>");
              }
          }
      },
      task: {
		  kill: function(name){
			  bclib.util.run(bclib.task[name].onclose);
			  delete bclib.task[name];
		  }
	  },
	  pkg: {
		  install: function(name){
			  var pkg;
			  try{
				pkg = JSON.parse(bclib.file.read(name));
			  }catch(e){
				  return "Incorrect package.";
			  }
			  if(pkg.bclibver > bclib.ver) return "Incorrect BCLib version.";
			  var r = "Installing package '" + name + "'...<br>";
			  for(var file in pkg.files){
				  r += "Downloading file '" + file + "'...<br>";
				  bclib.file.download(pkg.name + "." + file, pkg.files[file]);
				  r += "Downloaded file '" + file + "'.<br>";
			  }
			  if(bclib.file.read(pkg.name + ".setup.js")){
				  bclib.file.run(pkg.name + ".setup.js");
				  bclib.file.delete(pkg.name + ".setup.js");
				  r += "Setup.JS found, executing...<br>"
			  }
			  r += "Installed package '" + name + "'";
			  return r;
		  },
		  installFromList: function(name){
			var pkglist = JSON.parse(bclib.file.read("pkglist.json")), pkg;
			for(var i in pkglist){
				if(pkglist[i].name == name) pkg = pkglist[i];
			}
			
			bclib.file.download(pkg.name+".pkg", pkg.link);
			bclib.pkg.install(pkg.name+".pkg");
			bclib.file.delete(pkg.name+".pkg");
		  },
		  updateList: function(){
			bclib.file.download("pkglist.json", "https://raw.githubusercontent.com/yellowapps/bclib-hta/main/files/pkglist.json");  
		  },
		  manager: function(){			  
			  window.getPkglist = function(){
				var pkglist = JSON.parse(bclib.file.read("pkglist.json"));
				pkgs.innerHTML = "";
				  for(var i in pkglist){
					  var pkg = pkglist[i];
					  pkgs.innerHTML += "<div style='border: solid 1px black; padding: 7px; margin: 3px; font-size: 170%' title='"+pkg.description+"'>"+pkg.name+"<button id='install_"+pkg.name+"' style='border: solid 1px black; float: right; margin: 3px; padding: 5px; background: green;' onclick='bclib.pkg.installFromList(\""+pkg.name+"\");install_"+pkg.name+".innerHTML = \"Установлено\";install_"+pkg.name+".disabled = true;'>Установить</button>";
				  }
			  }
			  createWindow("Менеджер пакетов&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "<div id='pkgs'></div><br><div style='border: solid 1px black; margin: 3px; padding: 7px; background: yellow;' onclick='bclib.pkg.updateList();getPkglist();'>Обновить список пакетов</div>");
			  getPkglist();
		  },
		  uninstall: function(name){
			  var r = "Uninstalling package '" + name + "'<br>";
			  for(var i in bclib.storage){
				  if(i.includes(name)){
					  r += "Deleting file '" + i + "'...<br>";
					  delete bclib.storage[i];
					  r += "Deleted file: " + i + "<br>";
				  }
			  }
			  r += "Uninstalled package '" + name + "'."
			  return r;
		  }
	  },
    update: function(){
		bclib.pkg.updateList();
		
      var fs = bclib.system.fs, shell = bclib.system.shell;

      var xhr = WScript.CreateObject("Microsoft.XMLHTTP");
      xhr.Open("GET", "https://raw.githubusercontent.com/yellowapps/bclib-hta/main/doc.txt?r=" + new Date().getTime(), false);
      xhr.Send(null);

      var xhr2 = WScript.CreateObject("Microsoft.XMLHTTP");
      xhr2.Open("GET", "https://raw.githubusercontent.com/yellowapps/bclib-hta/main/bclib.hta?r=" + new Date().getTime(), false);
      xhr2.Send(null);

      var xhr3 = WScript.CreateObject("Microsoft.XMLHTTP");
      xhr3.Open("GET", "https://raw.githubusercontent.com/yellowapps/bclib-hta/main/bclib.js?r=" + new Date().getTime(), false);
      xhr3.Send(null);

      if(xhr.status == 200 && xhr2.status == 200 && xhr3.status == 200){
        var fl = fs.OpenTextFile("./doc.new.txt", 2, true, -1);
        fl.Write(xhr.responseText);
        fl.Close();

        var fl2 = fs.OpenTextFile("./bclib.new.hta", 2, true, -2);
        fl2.Write(xhr2.responseText);
        fl2.Close();

        var fl3 = fs.OpenTextFile("./bclib.new.js", 2, true, -2);
        fl3.Write(xhr3.responseText);
        fl3.Close();

        shell.Run("bclibd update", 0);
      }
    },
      winOffset: {x: 300, y: 300},
      storage: {},
      version: "BCLib v4.10.2 HTA (02.06.2022)",
      ver: 4.10
  }
var wnd = 0
      function createWindow(title, html){
        wnd++
        var left = Math.floor(Math.random()*(window.innerWidth - bclib.winOffset.x))
        var top = Math.floor(Math.random()*(window.innerHeight - bclib.winOffset.y))
        windows.innerHTML += "<div draggable='true' id='w"+wnd+"' style='"+bclib.temp.windowStyle+"'> <div id='header' style='"+bclib.temp.windowHeaderStyle+"'>" +
        title + " <button tabindex='-1' onclick='windows.removeChild(document.getElementById(\"w"+wnd+"\")); delete bclib.task[\""+title+"\"]' title=\"Закрыть\" style='"+bclib.temp.closeButtonStyle+"'>" + bclib.temp.closeButtonText + "</button></div> " +
          "<hr style='margin: 0px; clear: both; background: black;'>" + html + "</div>"
        document.getElementById("w"+wnd).style.left = left+"px"
        document.getElementById("w"+wnd).style.top = top+"px"
        document.getElementById("w"+wnd).ondragend = function(e){
          e.preventDefault()
          var dx = e.pageX
          var dy = e.pageY
          document.getElementById("w"+wnd).style.left = dx+"px"
          document.getElementById("w"+wnd).style.top = dy+"px"
          //console.log(dx+" "+dy)
          //console.log(document.getElementById("w"+window.wnd)+" "+document.getElementById("w"+window.wnd))
        }
        document.getElementById("w"+wnd).ondrag = function(e){
          e.preventDefault()
        }
        bclib.task[title] = {
          name: title,
          onclose: 'windows.removeChild(document.getElementById("w'+wnd+'")); delete bclib.task["'+title+'"]'
        }

      }

String.prototype.includes = function(search, start){
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
}

bclib.util.tmp = bclib.temp;
bclib.util.file = bclib.file;


window.oncontextmenu = function(){return false}
window.ondragover = function(e){e.preventDefault()}

window.onkeydown = function(e){
    if(e.key == "F2"){
      bclib.util.cmd(1);
    }
}

bclib.file.load();

bclib.temp.fsdumpID = setInterval(function(){
	bclib.file.dump();
}, 1000);

bclib.task.fsdump = {
	name: "fsdump",
	onclose: "clearInterval(bclib.temp.fsdumpID)"
}
