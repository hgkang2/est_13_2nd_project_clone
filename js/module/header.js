export function renderHeader() {
  const header = document.querySelector("#header");

  header.innerHTML = `
    <div class="header-wrapper">
        <div class="header-left">
          <h1 class="logo">
            <a href="index.html">
              <img src="./img/LOGO-img.png" alt="ROUNZ" />
              <span class="blind">ROUNZ 로고</span>
            </a>
          </h1>
          <nav class="gnb">
            <ul class="gnb-list">
              <li><a href="#">안경</a></li>
              <li><a href="#">선글라스</a></li>
              <li><a href="#">AI TRY-ON</a></li>
              <li><a href="support.html">고객센터</a></li>
            </ul>
          </nav>
        </div>

        <div class="header-actions">
          <a href="#">
            <span class="material-symbols-outlined">search</span>
            <span class="blind">검색</span>
          </a>
          <a href="login.html">
            <span class="material-symbols-rounded">person</span>
            <span class="blind">마이페이지</span>
          </a>
          <a href="#">
            <span class="material-symbols-rounded">local_mall</span>
            <span class="blind">장바구니</span>
          </a>
        </div>
        <button type="button" class="menu-btn" aria-label="메뉴 열기">
          <span class="material-symbols-rounded">menu</span>
        </button>
      </div>
      <nav class="mobile-menu">
        <ul>
          <li><a href="#">안경</a></li>
          <li><a href="#">선글라스</a></li>
          <li><a href="#">AI TRY-ON</a></li>
          <li><a href="support.html">고객센터</a></li>
          <li><a href="#">검색</a></li>
          <li><a href="login.html">마이페이지</a></li>
          <li><a href="#">장바구니</a></li>
        </ul>
      </nav>
  `;

  const menuBtn = header.querySelector(".menu-btn");
  const mobileMenu = header.querySelector(".mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("is-open");
  });
}
