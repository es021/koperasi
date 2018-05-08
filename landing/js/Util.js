String.prototype.replaceAll = function (search, replace) {
    return this.replace(new RegExp(search, 'g'), replace);
};

var UtilClass = function () {
    this.PAGE_DEFAULT = "laman-utama";
};

UtilClass.prototype._GET = function (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    var toRet = null;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            toRet = sParameterName[1] === undefined ? true : sParameterName[1];
            break;
        }
    }

    if (sParam == "page" && !toRet) {
        toRet = this.PAGE_DEFAULT;
    }

    return toRet;
}

UtilClass.prototype.commentStyle = function (data) {
    //comment out styling
    data = data.replace("<style>", "<style>/*");
    data = data.replace('<style type="text/css">', "<style>/*");
    data = data.replace("<style type='text/css'>", "<style>/*");
    data = data.replace('<style type="text/css" media="screen">', "<style>/*");
    data = data.replace("</style>", "*/</style>");
    return data;
}

UtilClass.prototype.replaceRootPath = function (data) {
    data = data.replaceAll("{{IMAGE_ROOT}}", IMAGE_ROOT);
    data = data.replaceAll("{{SITE_ROOT}}", SITE_ROOT);
    return data;
}

var Util = new UtilClass();
