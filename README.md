#キャストに応じてテキストを出力するWebツールです。

目的:

    Webフォームにデータを入力し、入力されたデータから条件に応じてテキストを生成する。

要件: 

    1. WebUIから次項の入力フォーマットのデータを入力する

    2. 入力データをjsonデータに整形する

    3. jsonデータから条件に応じてテキストをWebページの一部分に出力する

その他の要件:

    node.js環境で構築

入力フォーマット: 
```
第一インスタンス【Night】:
    ウェイター:
        こまり
    バーテンダー:
        すらまぐ
        7chi
        いっさん
        あいびー
        nami

    パフォーマー:
        monodayo
        さんぷるす
--------------------------------------------
第二インスタンス【Twilight】:
    ウェイター:
        ゆうなぎ
    バーテンダー:
        アスタ
        Rau Celestite
        S1R0
        KuRo_Ir0

    パフォーマー:
        DEAD WALK
        べるちゃそ
-------------------------------------------- 
第三インスタンス【Daybreak】:
    ウェイター:
        ちゃともこもこ
    バーテンダー:
        MAKARONIAN
        LUCIA-JP
        ふあむ
        みつる
        Luna00x

    パフォーマー:
        FukoMaybe
--------------------------------------------
```
更新履歴：

    2025/01/08 ブラウザ環境でmoduleを読み込まなくなっていたので、サーバー側で処理するように変更 パフォーマーがダンサーのみの場合の条件分岐を追加

    2025/04/12 indexから不要な結果表示を削除。CSSを調整。

    2025/04/12 EJSテンプレート化。