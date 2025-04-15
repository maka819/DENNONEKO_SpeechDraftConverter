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
