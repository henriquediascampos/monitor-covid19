const { app, BrowserWindow, ipcMain }=require('electron');
const path=require('path');
const download=require('download-html');
// const bd = require('bd.json');
const fs=require('fs');

function createWin() {
    const win=new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    console.log(__dirname);


    win.loadURL(path.join('file://', __dirname, '/index.html'))
}

app.on('ready', () => {
    // // createWin();
    // download.downloadHtml('http://rotasul.net/corona')
    //     .then(result => {
    //         //   console.log(result);
    //         const html = getlistHtml(html);
    //         console.log(html);
    //         // fs.writeFileSync('bd.json', result.data, 'utf8');
    //     });

    const teste = `
    <div>
        <input id="mksld" type='checkbox' />
    </div>
    <div class="patos"> teste </div>

    <div> 
        <p>oto teste1</p>
        <p>oto teste2</p>
        <p>oto teste3</p>
        <div> 
            <label>rizotp</label> 
            <div>
                <div> 
                    <div>
                        <i>*</i>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    
    const html = getlistHtml(teste);
    console.log(html);
    
});

function getlistHtml(data, html = []) {
    while (next(data)) {
        const {data__, tag} = extraiTag(data);
        data = data__;        
        html = [...html, tag];
    }

    return html;
}

function extraiTag(data) {
    if (data.trim().indexOf('<') == 0 && existeTagInterna(data)) {

        const tagName = data.substring(data.indexOf('<')+1, data.indexOf('>'));
        data = removeTagOfData(data);

        let {valor, data_} = extraiValorSimpres(data);
        // const classes = extraiPropriedadesTag(tagName)
        const tagExterna = montaOnbjetoSimples(tagName, valor);

        while (existeTagInterna(data_)) {
            const { data__, tag} = extraiTag(data_);
            data_ = data__;
            tagExterna.push(tag);
            if (!existeTagInterna(data_)) {
                removeTagOfData(data_);
            }
        }
        const data__ = removeTagOfData(data_);
        const tag = tagExterna;
        return {data__ , tag};
    } 
}

function removeTagOfData(data) {
    return data.substring(data.indexOf('>')+1, data.length);
}

function extraiValorSimpres(data) {
    let valor;
    if (existeTagInterna(data)) 
        valor = data.substring(0, data.indexOf('<'));
    else 
        valor = data.substring(0, data.indexOf('</'));

    const data_ = data.replace(valor, "");
    return {valor, data_};
}

function next(data) {
    return data.length > 0
}

function existeTagInterna(data) {
    const abretag = data.indexOf('<');
    const fechatag = data.indexOf('</');
    if ( abretag != -1 && abretag < fechatag)
        return true;
    else
        return false;
}

function montaOnbjetoSimples(tag, valor) {
    let obj = {}
    if (typeof valor === "string")
        obj[tag] =  valor.trim().length ? {"texto": valor} : "";
    else
        obj[tag] =  valor;

    return obj;
}

function extraiPropriedadesTag(tag) {
    // tag.split()
}

Object.prototype.push = function (property) {
    const name = Object.getOwnPropertyNames(this)[0];
    const propertyName = Object.getOwnPropertyNames(property)[0];
    const propertyValue = property[propertyName];

    if (this[name] && this[name][propertyName]) {
        const value = this[name][propertyName];
        return this[name][propertyName] = Array.isArray(value) ? [...value, propertyValue] : [value, propertyValue];
    } else {
        return this[name] = this[name] ?
            Object.assign(this[name],  montaOnbjetoSimples(propertyName, propertyValue))
            : montaOnbjetoSimples(propertyName, propertyValue);
    }
}