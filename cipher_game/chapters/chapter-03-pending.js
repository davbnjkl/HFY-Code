(function () {
    function makePendingNode(id) {
        return {
            chapter: "???",
            code: `PARK-${id}`,
            title: `??${id}`,
            speaker: "????",
            role: "???",
            recordLabel: "????",
            dialogue: [
                `?????? ${id} ????????`,
                "????????????????????? storytxt/2 ?????? 086 ???",
                "???????????????????????????????????"
            ],
            cipher: "?????",
            choices: [
                { label: "??????????", next: "park_086", tone: "normal" },
                { label: "????", next: "park_001", tone: "alert" }
            ]
        };
    }

    const nodes = {
        park_087: makePendingNode("087"),
        park_088: makePendingNode("088"),
        park_089: makePendingNode("089"),
        park_090: makePendingNode("090"),
        park_091: makePendingNode("091"),
        park_092: makePendingNode("092"),
        park_093: makePendingNode("093"),
        park_094: makePendingNode("094"),
        park_095: makePendingNode("095"),
        park_096: makePendingNode("096"),
        park_097: makePendingNode("097"),
        park_098: makePendingNode("098"),
        park_099: makePendingNode("099"),
        park_100: makePendingNode("100"),
        park_101: makePendingNode("101"),
        park_102: makePendingNode("102"),
        park_103: makePendingNode("103"),
        park_104: makePendingNode("104"),
        park_105: makePendingNode("105"),
        park_106: makePendingNode("106"),
        park_107: makePendingNode("107"),
        park_108: makePendingNode("108"),
        park_109: makePendingNode("109"),
        park_110: makePendingNode("110"),
        park_111: makePendingNode("111"),
        park_112: makePendingNode("112"),
        park_113: makePendingNode("113"),
        park_114: makePendingNode("114"),
        park_115: makePendingNode("115"),
        park_116: makePendingNode("116"),
        park_117: makePendingNode("117"),
        park_118: makePendingNode("118"),
        park_119: makePendingNode("119"),
        park_120: makePendingNode("120"),
        park_121: makePendingNode("121"),
        park_122: makePendingNode("122"),
        park_123: makePendingNode("123"),
        park_124: makePendingNode("124"),
        park_125: makePendingNode("125"),
        park_126: makePendingNode("126"),
        park_127: makePendingNode("127"),
        park_128: makePendingNode("128"),
        park_129: makePendingNode("129"),
        park_130: makePendingNode("130"),
        park_131: makePendingNode("131"),
        park_132: makePendingNode("132"),
        park_133: makePendingNode("133"),
        park_134: makePendingNode("134"),
        park_135: makePendingNode("135"),
        park_136: makePendingNode("136"),
        park_137: makePendingNode("137"),
        park_138: makePendingNode("138"),
        park_139: makePendingNode("139"),
        park_140: makePendingNode("140"),
        park_141: makePendingNode("141"),
        park_142: makePendingNode("142"),
        park_143: makePendingNode("143"),
        park_144: makePendingNode("144"),
        park_145: makePendingNode("145"),
        park_146: makePendingNode("146"),
        park_147: makePendingNode("147"),
        park_148: makePendingNode("148"),
        park_149: makePendingNode("149"),
        park_150: makePendingNode("150"),
        park_151: makePendingNode("151"),
        park_152: makePendingNode("152"),
        park_153: makePendingNode("153"),
        park_154: makePendingNode("154"),
        park_155: makePendingNode("155")
    };

    window.storyChapters = window.storyChapters || [];
    window.storyChapters.push({
        id: "chapter-03-pending",
        nodes
    });
})();
