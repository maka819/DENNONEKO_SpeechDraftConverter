// 入力データをオブジェクト形式に変換
function parseData(input) {
    if (!input) {
        throw new Error("データが入力されていません。");
    }

    const instances = {};
    const instanceBlocks = input.split("--------------------------------------------").filter(block => block.trim());

    instanceBlocks.forEach(block => {
        const [header, ...roles] = block.split("\n").map(line => line.trim()).filter(line => line);
        const instanceNameMatch = header.match(/【(.+?)】/);

        if (instanceNameMatch) {
            const instanceName = instanceNameMatch[1];
            instances[instanceName] = { "パフォーマー": [], "ウェイター": [], "バーテンダー": [] };

            let currentRole = null;
            roles.forEach(line => {
                if (line.endsWith(":")) {
                    currentRole = line.replace(":", "");
                } else if (currentRole && line) {
                    instances[instanceName][currentRole].push(line);
                }
            });
        }
    });

    return instances;
}

// メッセージテンプレートを生成するヘルパー関数
function buildMessage(template, data) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => data[key] || "");
}

// 共通テンプレート
const templates = {
    noPerformers: `
        皆様本日はご来店いただき誠にありがとうございます。
        ご来場の皆様に、注意事項をお知らせいたします。
        本日は合計3インスタンスでの営業となり、こちらは【${"instanceName"}】インスタンスです。
        ゲストによるDJとダンス、弾き語りは他のインスタンスでの実施となります。ご了承ください。
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。
        それでは、ごゆっくりお過ごしください。
    `,
    fukoMaybe: `
        皆様本日はご来店いただき誠にありがとうございます。
        ご来場の皆様に、注意事項をお知らせいたします。
        本日は合計3インスタンスでの営業となり、こちらは【${"instanceName"}】インスタンスです。
        通常ルームでは FukoMaybeさんに弾き語りをご披露いただきます。
        23:15頃のスタートを予定しており、準備が整いましたら再度アナウンスさせていただきます。
        ゲストの FukoMaybeさん はお客様の方で、Showアバターをしていただき、
        フォールバックではなく本来の姿をお楽しみいただければと思います。
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。
        それでは、ごゆっくりお過ごしください。
    `,
    monodayo: `
        皆様本日はご来店いただき誠にありがとうございます。
        ご来場の皆様に、注意事項をお知らせいたします。
        本日は合計3インスタンスでの営業となり、こちらは【${"instanceName"}】インスタンスです。
        通常ルームでは ものさん によるDJをお楽しみいただけます。
        ものさーん！
        (ものさんのパフォーマンスが入る)
        VIPルームでは ${"performer2"}さん によるダンスをお楽しみいただけます。
        VIPルームのダンサーさんにつきましては、お客様からお手を触れないようお願いいたします。
        ゲストの ${"performer1"}さん と ${"performer2"}さん はお客様の方で、Showアバターをしていただき、
        フォールバックではなく本来の姿をお楽しみいただければと思います。
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。
        それでは、ごゆっくりお過ごしください。
    `,
    default: `
        皆様本日はご来店いただき誠にありがとうございます。
        ご来場の皆様に、注意事項をお知らせいたします。
        本日は合計3インスタンスでの営業となり、こちらは【${"instanceName"}】インスタンスです。
        通常ルームでは ${"performer1"}さん によるDJをお楽しみいただけます。
        VIPルームでは ${"performer2"}さん によるダンスをお楽しみいただけます。
        VIPルームのダンサーさんにつきましては、お客様からお手を触れないようお願いいたします。
        ゲストの ${"performer1"}さん と ${"performer2"}さん はお客様の方で、Showアバターをしていただき、
        フォールバックではなく本来の姿をお楽しみいただければと思います。
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。
        それでは、ごゆっくりお過ごしください。
    `
};

// メッセージ生成関数
function generateMessage(instanceName, performers) {
    if (performers.length === 0) {
        return buildMessage(templates.noPerformers, { instanceName });
    }
    if (performers.includes("FukoMaybe")) {
        return buildMessage(templates.fukoMaybe, { instanceName });
    }
    if (performers.includes("monodayo")) {
        return buildMessage(templates.monodayo, {
            instanceName,
            performer1: performers[0],
            performer2: performers[1] || "該当なし"
        });
    }
    return buildMessage(templates.default, {
        instanceName,
        performer1: performers[0],
        performer2: performers[1] || "該当なし"
    });
}

// モジュールとしてエクスポート
module.exports = {
    parseData,
    generateMessage
};
