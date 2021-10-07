import * as Papaparse from "papaparse";
import SkyFiles from "skyfiles";

(async () => {

    const properties: string[] = ["AGE", "MURDER TOOL", "CLOTHE", "SHOES", "HEADWEAR", "ACCESSORY", "JOB", "TIME", "PLACE", "SOUND", "TRACE"];
    const infos: any[] = [];

    const caseProperties = await SkyFiles.readText("caseProperties.csv");
    for (const texts of Papaparse.parse<string[]>(caseProperties).data) {
        const attributes: any[] = [];
        for (const [index, property] of properties.entries()) {
            const value = texts[index];
            if (value !== "") {
                attributes.push({ trait_type: property, value });
            }
        }
        infos.push({ attributes });
    }

    const caseSentences = [
        "캠퍼스 옥상 입구에서 노숙을 하는 사람이었어요.\n\n",
        "옥상으로 가는 문은 늘 잠겨 있었고,\n\n",
        "옥상 입구는 2평 정도 밖에 되지 않아서, 사람이 다니질 않았죠.\n\n",
        "나이는 ", "{}", " 정도로 보였어요.\n\n",
        "그(그녀)는 ", "{}", "을(를) 가지고 있었습니다.\n\n",
        "그걸 왜 가지고 있냐고 물으니, 자신에게 일종의 행운의 부적같은 거라고 말하더군요.\n\n",
        "보통 옷은 ", "{}", "을(를) 입고 있었고\n\n",
        "신발은 정확하진 않지만, 음.. ", "{}", "(이)였던 것 같아요.\n\n",
        "제가 그(그녀)를 만났을 땐, ", "{}", "이었(였)습니다.\n\n",
        "{}", "을(를) 하고 다녔던 것도 기억이 나는군요.\n\n",
        "원래 직업은 ", "{}", "(이)라고 했어요.\n\n",
        "이번 사건과는 상관없이 그(그녀)의 신발에 몰래 도청 장치를 설치한 적이 있습니다.\n\n",
        "쫓아내진 못하겠고, 가만히 두자니 제가 너무 불안해서요.\n\n",
        "어느 날 한번 확인을 해보니, ", "{}", " 밖에 녹음이 되지 않았더군요.\n\n",
        "마지막으로 본 건 ", "{}", " ", "{}", "이었(였)어요.\n\n",
        "어제도 그(그녀)를 찾으러 옥상 입구로 갔었지만\n\n",
        "{}", " 말고는 아무 것도 남아 있지 않았습니다.",
    ]

    const cases = await SkyFiles.readText("cases.csv");
    for (const [id, texts] of Papaparse.parse<string[]>(cases).data.entries()) {
        let text = "";
        let html = "";
        for (const [index, caseSentence] of caseSentences.entries()) {
            if (caseSentence === "{}") {
                text += `**${texts[index]}**`;
                html += `<span>${texts[index]}</span>`;
            } else {
                text += caseSentence;
                html += caseSentence;
            }
        }
        const info = infos[id];
        info.text = text;
        info.html = html;
    }

    await SkyFiles.write("database.json", JSON.stringify(infos));
})();