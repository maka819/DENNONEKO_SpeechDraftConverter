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

// メッセージ生成関数
function generateMessage(instanceName, performers) {
    // デバッグ用
    console.log("Instance Name:", instanceName);
    console.log("Performers:", performers);
    if (performers.length === 0) {
        return buildMessage(templates.noPerformers, { instanceName });
    }
    if (performers.includes("FukoMaybe")) {
        return buildMessage(templates.fukoMaybe, { instanceName });
    }
    if (performers.includes("monodayo")) {
        if (performers.length === 1) {
            return buildMessage(templates.noDancer, {
            instanceName,
            performer1: performers[0]
            });
        }
        return buildMessage(templates.monodayo, {
            instanceName,
            performer1: performers[0],
            performer2: performers[1] || "該当なし"
        });
    }
    if (performers.length === 1) {
        return buildMessage(templates.noDancer, {
             instanceName,
             performer1: performers[0]
            });
    }
    return buildMessage(templates.default, {
        instanceName,
        performer1: performers[0],
        performer2: performers[1] || "該当なし"
    });
}

// 共通テンプレート
const commonHeader = `
    皆様本日はご来店いただき誠にありがとうございます。<br/>
    ご来場の皆様に、注意事項をお知らせいたします。<br/>
    本日は合計3インスタンスでの営業となり、こちらは【\${instanceName}】インスタンスです。<br/>
`;

const templates = {
    noPerformers: `
        ${commonHeader}
        ゲストによるDJとダンス、弾き語りは他のインスタンスでの実施となります。ご了承ください。<br/>
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。<br/>
        それでは、ごゆっくりお過ごしください。<br/>
    `,
    fukoMaybe: `
        ${commonHeader}
        通常ルームでは FukoMaybeさんに弾き語りをご披露いただきます。<br/>
        23:15頃のスタートを予定しており、準備が整いましたら再度アナウンスさせていただきます。<br/>
        ゲストの FukoMaybeさん はお客様の方で、Showアバターをしていただき、<br/>
        フォールバックではなく本来の姿をお楽しみいただければと思います。<br/>
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。<br/>
        それでは、ごゆっくりお過ごしください。<br/>
    `,
    monodayo: `
        ${commonHeader}
        通常ルームでは ものさん によるDJをお楽しみいただけます。<br/>
        ものさーん！<br/>
        (ものさんのパフォーマンスが入る)<br/>
        VIPルームでは \${performer2}さん によるダンスをお楽しみいただけます。<br/>
        VIPルームのダンサーさんにつきましては、お客様からお手を触れないようお願いいたします。<br/>
        ゲストの \${performer1}さん と \${performer2}さん はお客様の方で、Showアバターをしていただき、<br/>
        フォールバックではなく本来の姿をお楽しみいただければと思います。<br/>
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。<br/>
        それでは、ごゆっくりお過ごしください。
    `,
    default: `
        ${commonHeader}
        通常ルームでは \${performer1}さん によるDJをお楽しみいただけます。<br/>
        VIPルームでは \${performer2}さん によるダンスをお楽しみいただけます。<br/>
        VIPルームのダンサーさんにつきましては、お客様からお手を触れないようお願いいたします。<br/>
        ゲストの \${performer1}さん と \${performer2}さん はお客様の方で、Showアバターをしていただき、<br/>
        フォールバックではなく本来の姿をお楽しみいただければと思います。<br/>
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。<br/>
        それでは、ごゆっくりお過ごしください。
    `,
    noDancer: `
        ${commonHeader}
        通常ルームでは \${performer1}さん によるDJをお楽しみいただけます。<br/>
        ゲストの \${performer1}さん はお客様の方で、Showアバターをしていただき、<br/>
        フォールバックではなく本来の姿をお楽しみいただければと思います。<br/>
        また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。<br/>
        それでは、ごゆっくりお過ごしください。
    `
};

// モジュールとしてエクスポート
module.exports = {
    parseData,
    generateMessage
};