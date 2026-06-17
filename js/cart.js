// ── 샘플 데이터 ──────────────────────────────
const SAMPLE_ITEMS = [
  {
    id: 1,
    brand: "Rounz",
    name: "Classic Aviator",
    link: "관련항목에서 더보기",
    price: 189000,
    qty: 1,
    checked: true,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=160&h=160&fit=crop",
  },
];

let cartItems = [];

// ── DOM refs ────────────────────────────────
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

// ── Render ──────────────────────────────────
function render() {
  if (cartItems.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartFilled.classList.add("hidden");
    return;
  }
  cartEmpty.classList.add("hidden");
  cartFilled.classList.remove("hidden");

  // Item cards
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

  // Header counts
  const checked = cartItems.filter(i => i.checked);
  checkedCountEl.textContent = checked.length;
  totalCountEl.textContent = cartItems.length;
  selectAll.checked = checked.length === cartItems.length;
  selectAll.indeterminate =
    checked.length > 0 && checked.length < cartItems.length;

  // Summary
  const subtotal = checked.reduce((s, i) => s + i.price * i.qty, 0);
  subtotalEl.textContent = subtotal.toLocaleString() + "원";
  discountEl.textContent = "-0원";
  totalEl.textContent = subtotal.toLocaleString() + "원";
  checkoutBtn.textContent = `${checked.length}개 상품 주문하기`;

  bindEvents();
}

// ── Event binding ────────────────────────────
function bindEvents() {
  // 개별 체크박스
  document.querySelectorAll(".item-check").forEach(cb => {
    cb.addEventListener("change", e => {
      const id = +e.target.dataset.id;
      cartItems = cartItems.map(i =>
        i.id === id ? { ...i, checked: e.target.checked } : i,
      );
      render();
    });
  });

  // 수량 버튼
  document.querySelectorAll(".cart-item__qty button").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = +e.currentTarget.dataset.id;
      const act = e.currentTarget.dataset.action;
      cartItems = cartItems.map(i => {
        if (i.id !== id) return i;
        const qty = act === "inc" ? i.qty + 1 : Math.max(1, i.qty - 1);
        return { ...i, qty };
      });
      render();
    });
  });

  // 개별 삭제 버튼
  document.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = +e.currentTarget.dataset.remove;
      cartItems = cartItems.filter(i => i.id !== id);
      render();
    });
  });
}

// ── 전체 선택 ────────────────────────────────
selectAll.addEventListener("change", e => {
  cartItems = cartItems.map(i => ({ ...i, checked: e.target.checked }));
  render();
});

// ── 선택 삭제 ────────────────────────────────
document.getElementById("deleteSelected").addEventListener("click", () => {
  cartItems = cartItems.filter(i => !i.checked);
  render();
});

// ── 쇼핑 계속하기 (빈 화면 → 샘플 데이터 추가) ──
document.getElementById("goShoppingBtn").addEventListener("click", () => {
  cartItems = [...SAMPLE_ITEMS];
  render();
});

// ── 주문하기 ─────────────────────────────────
checkoutBtn.addEventListener("click", () => {
  const cnt = cartItems.filter(i => i.checked).length;
  if (cnt === 0) {
    alert("주문할 상품을 선택해주세요.");
    return;
  }
  alert(`${cnt}개 상품을 주문합니다.`);
});

// ── 초기화 (빈 상태로 시작) ──────────────────
render();
