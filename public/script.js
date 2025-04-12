document.addEventListener("DOMContentLoaded", function () {
    const textareas = document.querySelectorAll("textarea");
  
    textareas.forEach(textarea => {
      const resize = () => {
        textarea.style.height = "auto"; // 一旦リセット
        textarea.style.height = textarea.scrollHeight + "px"; // 内容に合わせて再設定
      };
  
      // 初期状態でフィット
      resize();
  
      // 入力中もリアルタイムでフィット
      textarea.addEventListener("input", resize);
    });
  });