(function () {
    const chapters = Array.isArray(window.storyChapters) ? window.storyChapters : [];
    const story = {
        title: "sy历险记",
        subtitle: "闭园后的游乐园里，广播、出口和规则都开始变得不可信。",
        startNode: "park_001",
        nodes: {}
    };

    chapters.forEach(function (chapter) {
        if (!chapter || typeof chapter !== "object") {
            return;
        }

        if (chapter.title) {
            story.title = chapter.title;
        }

        if (chapter.subtitle) {
            story.subtitle = chapter.subtitle;
        }

        if (chapter.startNode) {
            story.startNode = chapter.startNode;
        }

        Object.assign(story.nodes, chapter.nodes || {});
    });

    window.storyData = story;
})();
