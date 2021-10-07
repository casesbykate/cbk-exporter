import * as Papaparse from "papaparse";
import SkyFiles from "skyfiles";

(async () => {

    const caseSentences = [
        "캠퍼스 옥상 입구에서 노숙을 하는 사람이었어요.\n",
        "옥상으로 가는 문은 늘 잠겨 있었고,\n",
        "옥상 입구는 2평 정도 밖에 되지 않아서, 사람이 다니질 않았죠.\n",
        "나이는 ", "{}", " 정도로 보였어요.\n",
        "그(그녀)는 ", "{}", "을(를) 가지고 있었습니다.\n",
        "그걸 왜 가지고 있냐고 물으니, 자신에게 일종의 행운의 부적같은 거라고 말하더군요.\n",
        "보통 옷은 ", "{}", "을(를) 입고 있었고\n",
        "신발은 정확하진 않지만, 음.. ", "{}", "(이)였던 것 같아요.\n",
        "제가 그(그녀)를 만났을 땐, ", "{}", "이었(였)습니다.\n",
        "{}", "을(를) 하고 다녔던 것도 기억이 나는군요.\n",
        "원래 직업은 ", "{}", "(이)라고 했어요.\n",
        "이번 사건과는 상관없이 그(그녀)의 신발에 몰래 도청 장치를 설치한 적이 있습니다.\n",
        "쫓아내진 못하겠고, 가만히 두자니 제가 너무 불안해서요.\n",
        "어느 날 한번 확인을 해보니, ", "{}", " 밖에 녹음이 되지 않았더군요.\n",
        "마지막으로 본 건 ", "{}", " ", "{}", "이었(였)어요.\n",
        "어제도 그(그녀)를 찾으러 옥상 입구로 갔었지만\n",
        "{}", " 말고는 아무 것도 남아 있지 않았습니다.\n",
    ]

    const cases = await SkyFiles.readText("cases.csv");
    const numbers: { [category: string]: { [value: string]: number } } = {};
    for (const [id, texts] of Papaparse.parse<string[]>(cases).data.entries()) {
        let text = "";
        for (const [index, caseSentence] of caseSentences.entries()) {
            if (caseSentence === "{}") {
                const value = texts[index].trim();
                if (numbers[index] === undefined) {
                    numbers[index] = {};
                }
                if (numbers[index][value] === undefined) {
                    numbers[index][value] = 0;
                }
                numbers[index][value] += 1;
            }
        }
    }

    let result: any[] = [];
    for (const [i, numbs] of Object.entries(numbers)) {
        result = result.concat(Object.entries(numbs));
    }

    await SkyFiles.write("numbers.csv", Papaparse.unparse(result));
})();