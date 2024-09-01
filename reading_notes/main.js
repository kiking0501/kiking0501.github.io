        
$( document ).ready(function() {
    display_book_covers();
    display_graph();
    $("#nav_pills_display").find("li").on('click', function(){change_nav_pill(this)});
    $("#display_graph").click();

    var init_pos = order[0];
    load_book(init_pos);
})


function change_nav_pill(obj) {
    $("#nav_pills_display").find("li").removeClass("active");
    $(obj).addClass("active");

    $(".display_tab").hide();
    if ($(obj).attr('id') == "display_standard") {$("#section_book_cover").show();}
    if ($(obj).attr('id') == "display_graph") {$("#section_graph").show();}
}

import * as THREE from '//unpkg.com/three/build/three.module.js';
import SpriteText from "//unpkg.com/three-spritetext/dist/three-spritetext.mjs";

function display_graph() {

    function getImgSprite(book_key) {
        var title = reading_info[book_key]['title'];
        var imgElement = $("#cover_" + title).find("img")[0];

        const imgTexture = new THREE.TextureLoader().load(imgElement.src);
        imgTexture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: imgTexture });
        const sprite = new THREE.Sprite(material);

        var discountFactor = 0.5
        sprite.scale.set(
            imgElement.width / discountFactor,
            imgElement.height * (imgElement.width / imgElement.naturalWidth) / discountFactor
        );
        return sprite;
    }

    function getTextSprite(title, color) {
        const sprite = new SpriteText(title);
        sprite.material.depthWrite = false; // make sprite background transparent
        sprite.color = color;
        sprite.textHeight = 15;
        sprite.strokeColor = 'black';
        sprite.strokeWidth = 3;

        return sprite;
    }


    const graph_file = './graph/complete_graph.json'
    var highlightLinks = new Set();

    const Graph = ForceGraph3D({ controlType: 'orbit' })(document.getElementById('section_graph'))
      .width(750)
      .height(1200)
      .backgroundColor('black')
      .showNavInfo(true)
      .jsonUrl(graph_file)
      .dagMode('zin')  //    .zoomToFit(20, 100, node => true)
      .linkColor((link) => {
        if (link.type == "contains") { return reading_info[link.source[0]]['color'] };
        if (link.type == "related") { return 'red'}
        if (link.type == "read_sequence") { return 'lightgrey' }
      })
      .linkOpacity(.5)
      .linkWidth((link)=> {
        var hlWidth = highlightLinks.has(link)? 2:0
        if (link.type == "contains") { return 0 + hlWidth};
        if (link.type == "related") { return 3 + hlWidth};
        if (link.type == "read_sequence") { return 0 + hlWidth}; 
      })
      .nodeThreeObject((node) => {
        if (node.type == "img") {
            return getImgSprite(node.book_key);
        }
        if (node.type == "text") {
            return getTextSprite(node.title, reading_info[node.book_key]['color']);
        }
      })
      .onNodeClick((node) => {
        if (node.type == "text") {
            load_book(node.book_key, node.bookmark_page)
        } else {
            load_book(node.book_key);
        }
      })
      .onLinkHover(link=> {
        // highlightLinks.clear();
        // if (link) { 
        //     highlightLinks.add(link);
        //     Graph.linkWidth(Graph.linkWidth());
        // }
      });
      Graph.d3Force('charge').strength(-300);
}


function display_book_covers() {
    var section_book_covers = $("#section_book_cover")
    section_book_covers.html("");
    for (let i = 0; i < order.length; i++) {
        var book_key = order[i];
        var book_cover = $("#template_book_cover").clone();

        var title = reading_info[book_key]['title'];
        var glink = reading_info[book_key]['glink'];
        book_cover.find(".book_cover").attr("id", "cover_" + title);
        
        var img = book_cover.find("img")[0];
        $(img).attr("id", "img_" + title);
        $(img).attr("src","./media/covers/cover_" + title + ".jpg");
        $(img).attr("title", $("#description_" + title).text());
        $(img).attr("onclick", "load_book(" + book_key + ")");
        section_book_covers.append(book_cover.html());
    }
}


