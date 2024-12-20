        // フォーム送信イベントの処理
        document.getElementById('dataForm').addEventListener('submit', async function (e) {
          e.preventDefault(); // デフォルトのフォーム送信を無効化

          const inputText = document.getElementById('inputText').value;

          // サーバーにデータを送信
          const response = await fetch('/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inputText })
          });

          const data = await response.json(); // JSONデータを取得
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '';

          // メッセージを表示
          data.messages.forEach(message => {
              const p = document.createElement('p');
              p.textContent = message;
              resultDiv.appendChild(p);
          });
      });