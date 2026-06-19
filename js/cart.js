document.addEventListener("DOMContentLoaded", () => {
  let cartItems = [];

  const cartEmpty = document.getElementById("cartEmpty");
  const cartFilled = document.getElementById("cartFilled");
  const itemList = document.getElementById("itemList");
  const selectAll = document.getElementById("selectAll");
  const checkedCountEl = document.getElementById("checkedCount");
  const totalCountEl = document.getElementById("totalCount");
  const subtotalEl = document.getElementById("subtotalValue");
  const discountEl = document.getElementById("discountValue");
  const totalEl = document.getElementById("totalValue");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function render() {
    if (cartItems.length === 0) {
      cartEmpty.classList.remove("hidden");
      cartFilled.classList.add("hidden");
      return;
    }
    cartEmpty.classList.add("hidden");
    cartFilled.classList.remove("hidden");

    itemList.innerHTML = cartItems
      .map(
        item => `
      <div class="cart-item" data-id="${item.id}">
        <input class="cart-item__checkbox item-check" type="checkbox" data-id="${item.id}" ${item.checked ? "checked" : ""} />
        <img class="cart-item__image" src="${item.image}" alt="${item.name}" />
        <div class="cart-item__info">
          <span class="cart-item__brand">${item.brand}</span>
          <span class="cart-item__name">${item.name}</span>
          <a class="cart-item__link" href="#">${item.link}</a>
          <span class="cart-item__price">${item.price.toLocaleString()}원</span>
          <div class="cart-item__qty">
            <button data-action="dec" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button data-action="inc" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item__remove" data-remove="${item.id}" title="삭제">
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `,
      )
      .join("");

    const checked = cartItems.filter(i => i.checked);
    checkedCountEl.textContent = checked.length;
    totalCountEl.textContent = cartItems.length;
    selectAll.checked = checked.length === cartItems.length;
    selectAll.indeterminate =
      checked.length > 0 && checked.length < cartItems.length;

    const subtotal = checked.reduce((s, i) => s + i.price * i.qty, 0);
    subtotalEl.textContent = subtotal.toLocaleString() + "원";
    discountEl.textContent = "-0원";
    totalEl.textContent = subtotal.toLocaleString() + "원";
    checkoutBtn.textContent = `${checked.length}개 상품 주문하기`;
  }

  itemList.addEventListener("change", e => {
    if (e.target.classList.contains("item-check")) {
      const id = e.target.dataset.id;
      cartItems = cartItems.map(i =>
        i.id === id ? { ...i, checked: e.target.checked } : i,
      );
      render();
    }
  });

  itemList.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (btn) {
      const id = btn.dataset.id;
      const act = btn.dataset.action;
      cartItems = cartItems.map(i => {
        if (i.id !== id) return i;
        const qty = act === "inc" ? i.qty + 1 : Math.max(1, i.qty - 1);
        return { ...i, qty };
      });
      localStorage.setItem("cart", JSON.stringify(cartItems));
      render();
      return;
    }

    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      const id = removeBtn.dataset.remove;
      cartItems = cartItems.filter(i => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      render();
    }
  });

  selectAll.addEventListener("change", e => {
    cartItems = cartItems.map(i => ({ ...i, checked: e.target.checked }));
    render();
  });

  document.getElementById("deleteSelected").addEventListener("click", () => {
    cartItems = cartItems.filter(i => !i.checked);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    render();
  });

  document.getElementById("goShoppingBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  checkoutBtn.addEventListener("click", () => {
    const cnt = cartItems.filter(i => i.checked).length;
    if (cnt === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }
    alert(`${cnt}개 상품을 주문합니다.`);
  });

  // ── 초기화 (localStorage에서 불러오기) ───────────
  const saved = localStorage.getItem("cart");
  if (saved) {
    const parsed = JSON.parse(saved);
    cartItems = parsed.map(item => ({
      id: String(item.id), // 문자열로 통일
      brand: item.brand ?? "ROUNZ",
      name: item.name ?? item.title ?? "",
      link: item.link ?? "관련항목에서 더보기",
      price: item.price,
      qty: item.qty ?? item.quantity ?? 1,
      checked: item.checked ?? true,
      image: item.image ?? item.thumbnail ?? "",
    }));
  }

  render();
});
