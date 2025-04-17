const fs = require('fs');
const path = require('path');

// パフォーマーのデータのjsonを読み込み
const performerData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'performers.json'), 'utf-8')
);

// 名前から役職を取得する関数
function getRoleByName(name) {
    const match = performerData.find(entry => entry.name === name);
    return match ? match.role : 'Unknown'; // デフォルトで「Unknown」
}

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

    // パフォーマーと役職を紐づける
    Object.keys(instances).forEach(instanceName => {
        const performers = instances[instanceName]["パフォーマー"];
        const roleInfo = {}; // ここでロール情報用のオブジェクトを用意
        
        performers.forEach(name => {
            const role = getRoleByName(name) || "不明";
            if (!roleInfo[role]) {
            roleInfo[role] = [];
            }
            roleInfo[role].push(name);
        });
        
        instances[instanceName]["ロール情報"] = roleInfo;
    });

    return instances;
}

// メッセージテンプレートを生成するヘルパー関数
function buildMessage(template, data) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => data[key] || "");
}

// メッセージ生成関数
function generateMessage(instanceName, performers, performerRoles, waiters) {
    
    // デバッグ用
    // console.log("インスタンス名:", instanceName); 
    // console.log("パフォーマー名:", performers);
    // console.log("ロール情報:", roleInfo);
    const djsRaw = performerRoles["DJ"] || [];
    const dancersRaw = performerRoles["ダンサー"] || [];
    const guitarRaw = performerRoles["弾き語り"] || [];
    const waiterRaw = waiters || "";
    // ロールごとに名前に「さん」をつけて格納、該当者が居なければ「該当なし」を挿入
    const djs = djsRaw.length > 0 ? djsRaw.map(name => `${name}さん`).join(" ") : "該当なし";
    const dancers = dancersRaw.length > 0 ? dancersRaw.map(name => `${name}さん`).join(" ") : "該当なし";
    const guitar = guitarRaw.length > 0 ? guitarRaw.map(name => `${name}さん`).join(" ") : "該当なし";
    
    // デバッグ用
    // console.log("DJ:",djs);
    // console.log("ダンサー:",dancers);
    // console.log("弾き語り:",guitar);
    
    const waiterName = waiterRaw.length > 0 ? waiterRaw.map(name => `${name}さん`).join(" ") : "該当なし";
    const waiterMessage = waiterName !== "該当なし"
    ? `初来店で何をすればよいかわからないというお客様は、ウェイターの ${waiterName} にお声がけください`
    : "";
    if (performers.length === 0) {
        return buildMessage(templates.noPerformers, { instanceName, waiterMessage });
    }
    if (guitar.includes("FukoMaybe") && dancers.includes("べるちゃそ")) {
        return buildMessage(templates.fukoAndBeru, { instanceName, waiterMessage });
    }
    if (performers.includes("FukoMaybe" )) {
        return buildMessage(templates.fukoMaybe, { instanceName, waiterMessage });
    }
    if (performers.includes("monodayo") || performers.includes("もの")) {
        const DJMessage = `通常ルームでは ものさん によるDJをお楽しみいただけます。\nものさーん！(ものさんに呼びかけ音楽を流してもらう)`
        if (performers.length === 1) {
            return buildMessage(templates.default, {
            instanceName,
            waiterMessage,
            DJMessage,
            dancerMessage: "",
            djs: djs,
            dancers: dancers
            });
        }
        const dancerMessage = `VIPルームでは ${dancers} によるダンスをお楽しみいただけます。\nVIPルームのダンサーさんにつきましては、お客様からお手を触れないようお願いいたします。`
        return buildMessage(templates.default, {
            instanceName,
            waiterMessage,
            DJMessage,
            dancerMessage,
            dancers: dancers,
            djs: djs,
            dancers: dancers
        });
    }
    const DJMessage = `通常ルームでは ${djs} によるDJをお楽しみいただけます。`
    if (performers.length === 1) {
        return buildMessage(templates.default, {
             instanceName,
             waiterMessage,
             DJMessage,
             dancerMessage: "",
             djs: djs,
             dancers: dancers
            });
    }
    const dancerMessage = `VIPルームでは ${dancers} によるダンスをお楽しみいただけます。\nVIPルームのダンサーさんにつきましては、お客様からお手を触れないようお願いいたします。`
    return buildMessage(templates.default, {
        instanceName,
        waiterMessage,
        DJMessage,
        dancerMessage,
        djs: djs,
        dancers: dancers
    });
}

// アナウンス原稿用テンプレート
const commonHeader = `皆様本日はご来店いただき誠にありがとうございます。
ご来場の皆様に、注意事項をお知らせいたします。
本日は合計3インスタンスでの営業となり、こちらは【\${instanceName}】インスタンスです。`;

const commonFooter = `また奥のVIPルームは現在無料開放中です。扉をuseで開きますので、ご自由にご入室ください。
\${waiterMessage}
それでは、ごゆっくりお過ごしください。`;

const templates = {
noPerformers: `${commonHeader}
ゲストによるDJとダンス、弾き語りは他のインスタンスでの実施となります。ご了承ください。
${commonFooter}`,

fukoAndBeru: `${commonHeader}
通常ルームでは FukoMaybeさんに弾き語りを、べるちゃそさんにダンスをご披露いただきます
23:15頃のスタートを予定しており、準備が整いましたら再度アナウンスさせていただきます。
ゲストの FukoMaybeさん べるちゃそさんはお客様の方で、Showアバターをしていただき、
フォールバックではなく本来の姿をお楽しみいただければと思います。
${commonFooter}`,

fukoMaybe: `${commonHeader}
通常ルームでは FukoMaybeさん に弾き語りをご披露いただきます。
23:15頃のスタートを予定しており、準備が整いましたら再度アナウンスさせていただきます。
ゲストの FukoMaybeさん はお客様の方で、Showアバターをしていただき、
フォールバックではなく本来の姿をお楽しみいただければと思います。
${commonFooter}`,

default: `${commonHeader}
\${DJMessage}
\${dancerMessage}
ゲストの \${djs} \${dancers} はお客様の方で、Showアバターをしていただき、
フォールバックではなく本来の姿をお楽しみいただければと思います。
${commonFooter}`
};

// モジュールとしてエクスポート
module.exports = {
    parseData,
    generateMessage
};