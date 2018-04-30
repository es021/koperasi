class ImageMenu {

    // data = {label,desc,url,img_url}

    constructor(parent, data, size = "") {
        this.parent = parent;
        this.data = data;
        this.size = size;

        var OBJ = this;
        
        this.parent.load(TEMPLATE_ROOT + "/ImageMenu.html?v=" + MASTER_VER, function (res) {
            OBJ.template = OBJ.parent.find("#jim-item-template");
            OBJ.template.hide();
            OBJ.init();
        });
    }

    init() {
        this.parent.addClass("jpn-img-menu");
        this.parent.addClass(this.size);
        this.data.map((d, i) => {
            var t = this.template.clone(true, true);
            var label = t.find(".label");
            var desc = t.find(".desc");

            desc.html(d.desc);
            label.html(d.label);

            t.attr("href", d.url);
            t.css("background-image", "url('" + d.img_url + "')");
            t.show();
            this.parent.append(t);
        });
    }

}