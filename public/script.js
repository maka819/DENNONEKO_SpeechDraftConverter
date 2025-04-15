document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll("textarea");

  textareas.forEach(textarea => {
    // --- textareaの自動リサイズ処理 ---
    const resize = () => {
      textarea.style.height = "auto"; // 一旦リセット
      textarea.style.height = textarea.scrollHeight + "px"; // 内容に合わせて再設定
    };

    // 初期状態でフィット
    resize();

     // 入力中もリアルタイムでフィット
    textarea.addEventListener("input", resize);

    // --- textareaフォーカス時のハイライト処理 ---
    const parent = textarea.closest(".wrap"); //textareaから一番近い.wrapを取得
    if (parent) {
      textarea.addEventListener("focus", () => {
        parent.classList.add("is-focused");
      });

      textarea.addEventListener("blur", () => {
        parent.classList.remove("is-focused");
      });
    }
  });
});

// クリップボードにコピー
function copyToClipboard(button) {
  const textarea = button.closest(".terminal").querySelector(".copy-target");
  textarea.select();
  document.execCommand("copy");

   // パスを差し替える（チェックマーク）
  const path = button.querySelector("svg path");
  const originalD = path.getAttribute("d");
  const checkD = "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4";
  path.setAttribute("d", checkD);
  path.style.stroke = "#00ffcc";

    // copy-textのテキストを変更
    const copyTextEl = button.querySelector(".copy-text");
    const originalText = copyTextEl.textContent;
    copyTextEl.textContent = "Copied!";

    // 1秒後に元に戻す
    setTimeout(() => {
      path.setAttribute("d", originalD);
      path.style.stroke = "currentColor";
      copyTextEl.textContent = originalText;
    }, 1000);
}