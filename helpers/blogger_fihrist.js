// Blogger için (ya da başka html içinde) h2,h3,h4 elemanlarına 
// id değeri ekleyen ve oraya yönlendiren kod

const h_all = document.querySelectorAll("h2,h3,h4");
Array.from(h_all).forEach(el => {
    el.setAttribute("id", el.innerText);
});

var top_ol = document.createElement("ol");
top_ol.setAttribute("style", "display: none;");
fihrist.append(top_ol);

fill_list();

adjust_links();

// Listeyi topla verilen url'lerdeki h1,h2,h3,h4 elemanları topla
function fill_list() {
    const fihrist = document.getElementById("fihrist");
    var urls = fihrist.getAttribute("urls").split(",");
    var list_index = 0;
    var url_index = 0;
    var liste = [];

    for(ix=0; ix<urls.length; ix++){
        var url = urls[ix];
        
        fetch(url)
        .then(res => {
            return res.text();//[res.text(), res.url];
        })
        .then(arry => {
            var source = document.createElement("html");
            source.innerHTML = arry;
            var els = source.getElementsByClassName("post-body")[0].getElementsByTagName("*");
    
            var isim_url = source.getElementsByTagName("isim_url")[0].innerHTML;
    
            var link = isim_url;
            url_index++;
            for(i=0; i<els.length; i++){
                var tn = els[i].tagName;
                if(["H1","H2","H3","H4"].includes(tn)){
                    if(tn != "H1")
                        link += `#${encodeURIComponent(els[i].innerText)}`; //.replaceAll("\"", "&quot;").replaceAll(" ","%20")}`;
                    liste.push([tn, els[i].innerText, link, urls.indexOf(isim_url)]);
                    list_index++;
                    link = isim_url;
                }
            };
            // TÜM LİSTE OLUŞTU
            if(url_index == urls.length){
                var tn_ex = "H";
                var content = ""; // direk innerHTML basarsan her işlem sonu açık tagler kapanıyor
                //console.log(document.URL);
                // listeyi sayfalara göre sırala
                liste.sort((x,y) => {return x[3]-y[3];});
                liste.forEach( x => {
                    //console.log(x[2]); 
                    if(x[0] == "H1"){
                        if(tn_ex == "H1")
                            content += "</li>";
                        if(tn_ex == "H2")
                            content += "</li></ol></li>";
                        if(tn_ex == "H3")
                            content += "</li></ol></li></ol></li>";
                        if(tn_ex == "H4")
                            content += "</li></ol></li></ol></li></ol></li>";
                        if(x[2] == document.URL)
                            content += `<li><a style="color: black; font-weight: bold;" href="${x[2]}">${x[1]}</a>`;
                        else
                            content += `<li><a href="${x[2]}">${x[1]}</a>`;
                    }
                    if(x[0] == "H2"){
                        if(tn_ex == "H1")
                            content += `<ol>`;
                        if(tn_ex == "H2")
                            content += `</li>`;
                        if(tn_ex == "H3")
                            content += "</li></ol></li>";
                        if(tn_ex == "H4")
                            content += "</li></ol></li></ol></li>";
                        if(x[2] == document.URL)
                            content += `<li><a style="color: black; font-weight: bold;" href="${x[2]}">${x[1]}</a>`;
                        else
                            content += `<li><a href="${x[2]}">${x[1]}</a>`;
                    }
                    if(x[0] == "H3"){
                        if(tn_ex == "H1")
                            content += `<ol><li><ol>`;
                        if(tn_ex == "H2")
                            content += `<ol>`;
                        if(tn_ex == "H3")
                            content += "</li>";
                        if(tn_ex == "H4")
                            content += "</li></ol></li>";
                        if(x[2] == document.URL)
                            content += `<li><a style="color: black; font-weight: bold;" href="${x[2]}">${x[1]}</a>`;
                        else
                            content += `<li><a href="${x[2]}">${x[1]}</a>`;
                    }
                    if(x[0] == "H4"){
                        if(tn_ex == "H1")
                            content += `<ol><li><ol><li><ol>`;
                        if(tn_ex == "H2")
                            content += `<ol><li><ol>`;
                        if(tn_ex == "H3")
                            content += `<ol>`;
                        if(tn_ex == "H4")
                            content += "</li>";
                        if(x[2] == document.URL)
                            content += `<li><a style="color: black; font-weight: bold;" href="${x[2]}">${x[1]}</a>`;
                        else
                            content += `<li><a href="${x[2]}">${x[1]}</a>`;
                    }
    
                    tn_ex = x[0];
                });
                // içerik tamam , yerine koyalım
                //console.log(content);
                top_ol.innerHTML += content;
            }
        });
    }
}


// header tıklanınca açıksa-kapalıysa
//var fh = document.getElementById("fihrist_header");
//fh.onclick = (ev) => fh_onclick(ev);
function fh_onclick(el, ev) {
    yazı = el.innerText;
    if(yazı.slice(-1) == "+"){
        yazı = yazı.slice(0,-1) + "-";
        el.innerHTML = yazı;
        top_ol.setAttribute("style", "padding-inline-start: 20px; display: auto;");
    }else{
        yazı = yazı.slice(0,-1) + "+";
        el.innerHTML = yazı;
        top_ol.setAttribute("style", "padding-inline-start: 20px; display: none;");
    }
};

navigation.addEventListener("navigate", e => {
    //console.log(e.destination.url);
    top_ol.innerHTML = "";
    fill_list();
});

// navi div içindeki önceki ve sonraki linkleri
function adjust_links(){
    const fihrist = document.getElementById("fihrist");
    var urls = fihrist.getAttribute("urls").split(",");
    const isim_el = isim_url = document.getElementsByTagName("isim_url")
    var isim_url = document.getElementsByTagName("isim_url")[0].innerHTML;
    var ind = urls.indexOf(isim_url);
    var navis = document.querySelectorAll(".navi");
    navis.forEach( n => {
      if(ind == 0){
        n.children[0].style.display = "none";      
      }else{
        n.children[0].setAttribute("href", urls[ind - 1]);
      }
      if(ind == urls.length - 1){
        n.children[1].style.display = "none";      
      }else{
        n.children[1].setAttribute("href", urls[ind + 1]);
      }
    });
}