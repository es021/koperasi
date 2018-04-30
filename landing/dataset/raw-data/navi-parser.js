// localhost/test-e/dataset/raw-data/navi.html

$ = jQuery;


$(document).ready(function () {

    function parseUrusniagaUtama() {
        var body = $("tbody");
        var GRP_NAME_COLOR = ["#70AD47", "#92D050"];

        var HAS_DUPLICATE = ["selenggara", "cetakan", "senarai-kerja", "pendaftaran-perkahwinan", "pendaftaran-pengangkatan-mahkamah"];

        var ORI_PARENT = {
            "Kelahiran": {
                grandMasterIndex: null
            },
            "Kematian": {
                grandMasterIndex: null
            },
            "Pengangkatan eJPN": {
                grandMasterIndex: 0
            },
            "Pengangkatan iJPN": {
                grandMasterIndex: null
            },
            "Pengurusan Cawangan eJPN": {
                grandMasterIndex: 1
            },
            "Perkahwinan dan Penceraian eJPN": {
                grandMasterIndex: 2
            },
            "Perkahwinan dan Penceraian iJPN": {
                grandMasterIndex: null
            },
            "Warganegara": {
                grandMasterIndex: null
            },
            "Kad Pengenalan": {
                grandMasterIndex: null
            },
            "Siasatan dan Penguatkuasaan": {
                grandMasterIndex: null
            },
            "Senarai Hitam": {
                grandMasterIndex: null
            },
            "Kutipan Hasil iJPN": {
                grandMasterIndex: null
            },
            "Pengujudan dan Pengesahan Rekod": {
                grandMasterIndex: null
            },
            "AFIS": {
                grandMasterIndex: null
            },
            "myIDENTITY": {
                grandMasterIndex: null
            },
            "iDATA": {
                grandMasterIndex: null
            },
        }

        function getLabelFromOriParent(index) {
            for (var label in ORI_PARENT) {
                var obj = ORI_PARENT[label];

                if (obj.grandMasterIndex == index) {
                    return label;
                }
            }
        }


        function createNormalCase(label) {
            var arr = label.split(" ");

            var r = "";
            for (var i in arr) {
                var firstLetter = arr[i][0].toUpperCase();
                var rest = arr[i].substr(1, arr[i].length).toLowerCase()

                if (i > 0) {
                    r += " ";
                }
                r += firstLetter + rest;
            }

            return r;
        }



        function replaceAllWithoutRegex(text, search, replace) {
            while (text.indexOf(search) >= 0) {
                text = text.replace(search, replace);
            }
            return text;
        }

        function createIdFromLabel(label, parentID = "") {
            label = replaceAllWithoutRegex(label, ".", "");
            label = replaceAllWithoutRegex(label, "(", "");
            label = replaceAllWithoutRegex(label, ")", "");
            label = label.replace(new RegExp(' ', 'g'), "-").toLowerCase();
            label = label.replace(new RegExp('/', 'g'), "-");

            if (HAS_DUPLICATE.indexOf(label) >= 0) {
                label = parentID + "-" + label;
            }
            return label;
        }
        function getTextFromTd(el) {
            var raw = $(el).html();
            if (raw.indexOf("font") <= -1) {
                return raw;
            }

            var text = $(el).find("font").html();
            text = text.replace(new RegExp('<br>', 'g'), ' ');
            text = text.replace(new RegExp('\n', 'g'), ' ');
            text = text.replace(new RegExp('\t', 'g'), ' ');
            //text = text.replace(new RegExp('\s', 'g'), ' ');
            let arr = text.split(' ')

            let label = "";
            let isFirst = true;
            arr.map((d, i) => {
                if (d == "") {
                    return;
                }

                if (!isFirst) {
                    label += " ";
                }
                label += d;
                isFirst = false;
            })
            return label;
        }

        var grandMaster = [];
        $.each(body, function (tableIndex, b) {

            var topLabel = "";
            var topId = "";
            var grandMasterID = "";

            topLabel = getLabelFromOriParent(tableIndex);
            grandMasterID = createIdFromLabel(topLabel);
            // if (tableIndex == 0) {
            //     topLabel = "Pengangkatan";
            //     grandMasterID = createIdFromLabel("PENGANGKATAN");

            // } else if (tableIndex == 1) {
            //     topLabel = "SPC";
            //     grandMasterID = createIdFromLabel("SPC");

            // } else if (tableIndex == 2) {
            //     topLabel = "Kahwin Cerai";
            //     grandMasterID = createIdFromLabel("KAHWIN CERAI");

            // }


            var master = [];

            let elB = $(b);
            let row = elB.find("tr");
            var curGroup = "";
            var curGroupIndex = -1;

            $.each(row, function (i, r) {
                if (i < 3) {
                    return;
                }
                let elR = $(r);
                let col = elR.find("td");

                var child = {};
                var startLabel = 1;

                $.each(col, function (k, c) {
                    let elC = $(c);
                    let bgcolor = elC.attr("bgcolor");
                    //grouping green bg
                    if (GRP_NAME_COLOR.indexOf(bgcolor) >= 0) {
                        startLabel = 2;
                        let grpName = getTextFromTd(elC);
                        if (curGroup != grpName) {
                            curGroupIndex++;
                            var id = createIdFromLabel(grpName, grandMasterID);
                            var arr = {
                                id: id,
                                label: createNormalCase(grpName),
                                url: null,
                                children: []
                            };
                            master[curGroupIndex] = arr;
                        }
                    } else {

                        //name
                        if (k == startLabel) {
                            child["label"] = getTextFromTd(elC);
                        }
                        //kod transaksi - branch
                        if (k == startLabel + 1) {
                            child["code"] = getTextFromTd(elC);
                        }

                        // aras pengguna
                        if (k == startLabel + 2) {
                            child["auth"] = getTextFromTd(elC);
                            child["id"] = createIdFromLabel(child["label"], master[curGroupIndex]["id"]);
                            master[curGroupIndex].children.push(child);
                        }
                    }
                });
            });

            var arr = {
                id: grandMasterID,
                label: topLabel,
                url: null,
                //isParent: true,
                children: master
            };

            grandMaster.push(arr);
        });

        var superGrandData = [];
        for (var label in ORI_PARENT) {
            var obj = ORI_PARENT[label];
            var arr = null;
            if (obj.grandMasterIndex == null) {
                arr = {
                    id: createIdFromLabel(label),
                    label: label,
                    url: null,
                    //isParent: true,
                    children: null
                };
            } else {
                arr = grandMaster[obj.grandMasterIndex];
            }

            superGrandData.push(arr);
        }
        return superGrandData;
    }


    function getMapNavi(naviRoot) {
        var master = {};
        function getMapObj(n, parent) {
            return {
                label: n.label,
                parent: parent
            }
        }

        function allDescendants(node, parent = null) {
            if (!Array.isArray(node)) {
                node = [node];
            }
            for (var i in node) {
                var n = node[i];
                master[n.id] = getMapObj(n, parent);
                if (n.children != null) {
                    //parents.push(n.id);
                    for (var j in n.children) {
                        var child = n.children[j];
                        var mapObj = getMapObj(child, n.id);
                        master[child.id] = mapObj;
                        allDescendants(child, n.id);
                    }
                }
            }
        }

        allDescendants(naviRoot);
        return master;
    }

    //$("body").html(JSON.stringify(superGrandData));

    var body = $("body");

    $.get("http://localhost/test-e/dataset/navi-utama.json", function (res) {
        var ROOT = JSON.parse(res);
        for (var i in ROOT) {
            if (ROOT[i].id == "urusniaga-utama") {
                ROOT[i].children = parseUrusniagaUtama();
            }
        }

        body.html(JSON.stringify(ROOT));

        console.log(ROOT)

        body.append("<br><br><br><hr><hr><br><br><br>");

        body.append(JSON.stringify(getMapNavi(ROOT)));

    })

});