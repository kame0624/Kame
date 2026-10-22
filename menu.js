// 全ページ共通のメニュー(左上のサイト名 + 右上の甲羅ボタン)
// メニューの項目を変えたいときは、下の ITEMS だけ編集すれば全ページに反映されます。
(function () {
  var ITEMS = [
    { href: "index.html#top",   label: "ホーム",     page: "index.html" },
    { href: "index.html#about", label: "自己紹介" },
    { href: "index.html#works", label: "作ったもの" },
    { href: "blog.html",        label: "ブログ",     page: "blog.html" },
    { href: "maimai.html",      label: "maimai",     page: "maimai.html" },
    { href: "favorites.html",   label: "好きなもの", page: "favorites.html" },
    { href: "gadgets.html",     label: "ガジェット", page: "gadgets.html" },
    "-",
    { href: "https://x.com/Kamekun242", label: "X (Twitter)", ext: true },
    { href: "https://maiscore.net/user/kameeeee", label: "maiscore", ext: true },
    "-",
    { href: "admin.html",       label: "管理",       page: "admin.html" }
  ];

  var current = location.pathname.split("/").pop() || "index.html";
  var links = ITEMS.map(function (it) {
    if (it === "-") return "<hr>";
    var attrs = it.ext ? ' target="_blank" rel="noopener"' : "";
    if (it.page && it.page === current) attrs += ' aria-current="page"';
    return '<a href="' + it.href + '"' + attrs + ">" + it.label + "</a>";
  }).join("");

  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<a class="brand" href="index.html#top">Kameのホームページ</a>' +
    '<nav class="menu" id="menu">' +
      '<button class="menu-btn" id="menuBtn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="menuPanel">' +
        '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#2ee6b6" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">' +
        '<polygon points="50,6 88,28 88,72 50,94 12,72 12,28"/>' +
        '<polygon class="core" points="50,32 68,42 68,62 50,72 32,62 32,42"/>' +
        '<path d="M50 6v26M88 28L68 42M88 72L68 62M50 94V72M12 72l20-10M12 28l20 14"/></g></svg>' +
      "</button>" +
      '<div class="menu-panel" id="menuPanel" hidden>' + links + "</div>" +
    "</nav>";

  var main = document.querySelector("main");
  while (wrap.firstChild) main.parentNode.insertBefore(wrap.firstChild, main);

  var menuBtn = document.getElementById("menuBtn"), panel = document.getElementById("menuPanel");
  function setMenu(open) {
    panel.hidden = !open;
    document.documentElement.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  }
  menuBtn.addEventListener("click", function () { setMenu(panel.hidden); });
  panel.addEventListener("click", function (e) { if (e.target === panel || e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", function (e) { if (!e.target.closest("#menu")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
})();
