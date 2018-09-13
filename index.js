const fs = require('fs');     //модуль, содержащий ф-ции для работы с файлами и директориями
const path = require('path');   //предоставляет утилиты для работы с путями к файлам и директориям
let pat = process.argv[2];
let copyright;

copyright = JSON.parse(fs.readFileSync("./myjson.json")).cop;

let script='const fs = require(\'fs\');\n' +
    'const path = require(\'path\');\n' +
    '\n' +
    '(function getFiles(baseDir) {\n' +
    '    fs.readdir(baseDir, function (err, files){\n' +
    '        for (let i in files) {\n' +
    '            let currentDir = baseDir + path.sep + files[i];\n' +
    '            fs.stat(currentDir, (err, stats) => {\n' +
    '                    if (stats.isDirectory()) {\n' +
    '                        getFiles(currentDir);\n' +
    '                    } else {\n' +
    '                        console.log(path.relative(__dirname, currentDir));\n' +
    '                    }\n' +
    '                }\n' +
    '            );\n' +
    '        }\n' +
    '    });\n' +
    '})(__dirname, null);\n';

if(pat)
{
    fs.stat(pat,function (error, statistics) {
        if(error){console.log('Ошибка пути');}
        else{
            create_summary(pat); //создание файла summary js
            make_dir(pat);
            watchDir(pat);
        }
    })
}

function create_summary(pat)
{
    fs.writeFile(pat + '\\Summary.js', script, function (error) {
            if (error) console.log('Ошибка создания файла.');
            else console.log('Summary создан.');
        }
    );
}

function make_dir(pat)
{
    let dir_for_make=pat + '\\' + path.basename(pat);
    fs.mkdir(dir_for_make, function(err)
    {
        if(err) console.log("Ошибка при создании директория.");
        else console.log("Директорий создан.");
    });
    writefile(pat,dir_for_make);
}

function writefile(pat, made_dir)
{
    fs.readdir(pat, function(err, files)
        {if(err) console.log("Ошибка при чтении директория.");
        else
        {
            for(let i in files)
            {
                let files_or_directories = pat+'\\'+files[i];
                if(fs.statSync(files_or_directories).isDirectory())
                    writefile(files_or_directories,made_dir);
                else
                {
                    if(path.extname(files_or_directories)===".txt") // !!!!!!!!!!!!!!!!!!!!!
                    {
                        fs.readFile(files_or_directories,'utf8' ,(err, data)=>{
                                if(err)console.log("Ошибка чтения файла.");
                                else
                                {
                                    fs.writeFile(made_dir+'\\'+files[i], copyright+'\r\n'+data+'\r\n'+copyright );
                                }
                            }
                        );
                    }
                }
            }
        }
        }
    );
}

function watchDir(dirForTxt) {
    fs.watch(dirForTxt, (eventType, filename) => {
        console.log(`event type is: ${eventType}`);
        if (filename) {
            console.log(`filename provided: ${filename}`);
        } else {
            console.log('filename not provided');
        }
    });
}