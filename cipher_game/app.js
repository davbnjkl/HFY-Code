(function () {
    const story = window.storyData;
    const TYPEWRITER_SPEED = 128;
    const BLOCK_PAUSE_MS = 28;

    if (!story || !story.nodes || !story.startNode) {
        return;
    }

    const elements = {
        gameTitle: document.getElementById("gameTitle"),
        chapterValue: document.getElementById("chapterValue"),
        sceneCode: document.getElementById("sceneCode"),
        sceneTitle: document.getElementById("sceneTitle"),
        locationText: document.getElementById("locationText"),
        speakerName: document.getElementById("speakerName"),
        speakerRole: document.getElementById("speakerRole"),
        statusLine: document.getElementById("statusLine"),
        storyCard: document.getElementById("storyCard"),
        dialogueBlock: document.getElementById("dialogueBlock"),
        cipherPanel: document.getElementById("cipherPanel"),
        cipherLabel: document.getElementById("cipherLabel"),
        cipherText: document.getElementById("cipherText"),
        storyNote: document.getElementById("storyNote"),
        choicesHint: document.getElementById("choicesHint"),
        choicesGrid: document.getElementById("choicesGrid"),
        restartButton: document.getElementById("restartButton"),
        entryModal: document.getElementById("entryModal"),
        playerNameInput: document.getElementById("playerNameInput"),
        nameError: document.getElementById("nameError"),
        startGameButton: document.getElementById("startGameButton")
    };
    elements.gameShell = document.querySelector(".game-shell");
    elements.choicesCard = document.querySelector(".choices-card");

    let currentNodeId = story.startNode;
    let renderToken = 0;
    let skipTyping = false;
    let isTyping = false;
    let playerName = "";
    let hauntTimer = 0;

    function normalizeDialogue(dialogue) {
        if (Array.isArray(dialogue)) {
            return dialogue;
        }

        if (typeof dialogue === "string" && dialogue.trim()) {
            return [dialogue];
        }

        return [];
    }

    function wait(ms, token) {
        return new Promise(function (resolve) {
            window.setTimeout(function () {
                resolve(token === renderToken);
            }, ms);
        });
    }

    function clampName(value) {
        return Array.from(value || "").slice(0, 6).join("");
    }

    function resolveText(text) {
        if (typeof text !== "string") {
            return "";
        }

        return text.replace(/\{\{playerName\}\}/g, playerName || "访客");
    }

    function pulseHaunt(target) {
        if (!target) {
            return;
        }

        target.classList.remove("haunt-burst");
        void target.offsetWidth;
        target.classList.add("haunt-burst");

        window.setTimeout(function () {
            target.classList.remove("haunt-burst");
        }, 260);
    }

    function scheduleHauntPulse() {
        window.clearTimeout(hauntTimer);

        if (document.body.classList.contains("modal-open")) {
            hauntTimer = window.setTimeout(scheduleHauntPulse, 1800);
            return;
        }

        hauntTimer = window.setTimeout(function () {
            const pool = [elements.storyCard, elements.choicesCard, elements.gameShell].filter(Boolean);
            const target = pool[Math.floor(Math.random() * pool.length)];
            pulseHaunt(target);
            scheduleHauntPulse();
        }, 2600 + Math.random() * 3600);
    }

    function typeText(target, text, token) {
        return new Promise(function (resolve) {
            const content = text || "";
            const totalLength = content.length;

            target.textContent = "";

            if (!totalLength || token !== renderToken) {
                resolve(token === renderToken);
                return;
            }

            const startedAt = performance.now();

            function frame(now) {
                if (token !== renderToken) {
                    resolve(false);
                    return;
                }

                if (skipTyping) {
                    target.textContent = content;
                    resolve(true);
                    return;
                }

                const visibleCount = Math.min(
                    totalLength,
                    Math.ceil(((now - startedAt) / 1000) * TYPEWRITER_SPEED)
                );

                target.textContent = content.slice(0, visibleCount);

                if (visibleCount >= totalLength) {
                    resolve(true);
                    return;
                }

                window.requestAnimationFrame(frame);
            }

            window.requestAnimationFrame(frame);
        });
    }

    function createChoiceButton(choice) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-btn";
        button.dataset.tone = choice.tone || "normal";

        const main = document.createElement("span");
        main.className = "choice-main";
        main.textContent = resolveText(choice.label || "继续");

        const sub = document.createElement("span");
        sub.className = "choice-sub";
        sub.textContent = resolveText(choice.detail || "进入下一段剧情。");

        button.append(main, sub);
        button.addEventListener("click", function () {
            if (choice.next && story.nodes[choice.next]) {
                currentNodeId = choice.next;
                renderNode();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        return button;
    }

    async function renderNarrative(node, token) {
        const lines = normalizeDialogue(node.dialogue);

        elements.dialogueBlock.innerHTML = "";
        elements.dialogueBlock.classList.toggle("is-typing", true);
        elements.storyCard.classList.toggle("is-typing", true);

        for (const line of lines) {
            if (token !== renderToken) {
                return;
            }

            const paragraph = document.createElement("p");
            paragraph.className = "typed-line";
            elements.dialogueBlock.appendChild(paragraph);

            await typeText(paragraph, resolveText(line), token);

            if (token !== renderToken) {
                return;
            }

            paragraph.classList.remove("typed-line");
            await wait(BLOCK_PAUSE_MS, token);
        }

        elements.dialogueBlock.classList.toggle("is-typing", false);
        elements.storyCard.classList.toggle("is-typing", false);

        if (node.cipher) {
            elements.cipherPanel.hidden = false;
            elements.cipherLabel.textContent = resolveText(node.recordLabel || "异常记录");
            elements.cipherText.classList.add("typed-line");
            await typeText(elements.cipherText, resolveText(node.cipher), token);
            elements.cipherText.classList.remove("typed-line");
            await wait(BLOCK_PAUSE_MS, token);
        } else {
            elements.cipherText.textContent = "";
            elements.cipherPanel.hidden = true;
        }

        elements.storyNote.classList.add("typed-line");
        await typeText(elements.storyNote, resolveText(node.note || ""), token);
        elements.storyNote.classList.remove("typed-line");
    }

    async function renderNode() {
        const node = story.nodes[currentNodeId];

        if (!node) {
            return;
        }

        renderToken += 1;
        skipTyping = false;
        isTyping = true;
        const token = renderToken;

        elements.gameTitle.textContent = resolveText(story.title || "sy历险记");
        elements.chapterValue.textContent = node.chapter || "未知";
        elements.sceneCode.textContent = resolveText(node.code || "");
        elements.sceneTitle.textContent = resolveText(node.title || "未命名段落");
        elements.locationText.textContent = resolveText(node.location || "位置未记录");
        elements.speakerName.textContent = resolveText(node.speaker || "未知来源");
        elements.speakerRole.textContent = resolveText(node.role || "");
        elements.statusLine.textContent = resolveText(node.statusLine || "");
        elements.choicesHint.textContent = "讯息正在高速展开，点击文本区可立即显示。";
        elements.choicesGrid.innerHTML = "";
        elements.choicesGrid.classList.add("is-waiting");
        elements.storyNote.textContent = "";
        elements.cipherText.textContent = "";
        elements.cipherPanel.hidden = !node.cipher;

        await renderNarrative(node, token);

        if (token !== renderToken) {
            return;
        }

        elements.choicesGrid.innerHTML = "";
        (node.choices || []).forEach(function (choice) {
            elements.choicesGrid.appendChild(createChoiceButton(choice));
        });

        elements.choicesHint.textContent = resolveText(node.choicesHint || "请选择下一步。");
        elements.choicesGrid.classList.remove("is-waiting");
        isTyping = false;
    }

    elements.storyCard.addEventListener("click", function () {
        if (isTyping) {
            skipTyping = true;
        }
    });

    elements.restartButton.addEventListener("click", function () {
        currentNodeId = story.startNode;
        renderNode();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    elements.playerNameInput.addEventListener("input", function () {
        const limitedValue = clampName(elements.playerNameInput.value);

        if (elements.playerNameInput.value !== limitedValue) {
            elements.playerNameInput.value = limitedValue;
        }

        elements.nameError.hidden = true;
    });

    function startGame() {
        const enteredName = clampName(elements.playerNameInput.value.trim());

        if (!enteredName) {
            elements.nameError.hidden = false;
            return;
        }

        playerName = enteredName;
        elements.playerNameInput.value = enteredName;
        elements.entryModal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");
        renderNode();
        scheduleHauntPulse();
    }

    elements.startGameButton.addEventListener("click", startGame);
    elements.playerNameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            startGame();
        }
    });

    document.body.classList.add("modal-open");
    elements.playerNameInput.focus();
})();
