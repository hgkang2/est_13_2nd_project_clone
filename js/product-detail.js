const API = "./data/product.json";

// 0. 토스트 메시지
function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// URL에서 id로 상품 찾아서 정보 적용
async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  if (!productId) {
    console.error("URL에 id 파라미터가 없습니다.");
    return;
  }

  const res = await fetch(API);
  const { products } = await res.json();
  const product = products.find(p => p.id === productId);

  if (!product) {
    console.error("해당 상품을 찾을 수 없습니다. id:", productId);
    return;
  }

  // 메인 이미지 교체
  const mainImg = document.querySelector(".main-img");
  if (mainImg) {
    mainImg.src = product.thumbnail;
    mainImg.alt = product.title;
  }

  // 첫 번째 썸네일 이미지 교체
  const firstThumbnailImg = document.querySelector(
    ".thumbnail-item:first-child img",
  );
  if (firstThumbnailImg) {
    firstThumbnailImg.src = product.thumbnail;
    firstThumbnailImg.alt = product.title;
  }

  // 브랜드명
  const brandName = document.querySelector(".brand-name");
  if (brandName) brandName.textContent = product.brand;

  // 상품명 (breadcrumb + 타이틀)
  const productTitle = document.querySelector(".product-title");
  if (productTitle) productTitle.textContent = product.title;

  const breadcrumbCurrent = document.querySelector(
    ".breadcrumb [aria-current='page']",
  );
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.title;

  // 가격 (sale 관련 .original-price, .discount-rate 는 건드리지 않음)
  const currentPrice = document.querySelector(".current-price");
  if (currentPrice)
    currentPrice.textContent = `${product.price.toLocaleString()}원`;

  // 페이지 타이틀
  document.title = `ROUNZ | ${product.title}`;
}

function initProductDetail() {
  // 1. 하트 버튼 초기화
  const wishBtn = document.querySelector(".btn-wish");
  const heartIcon = wishBtn?.querySelector(".heart-icon");

  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      const isActive = wishBtn.classList.toggle("is-active");
      if (heartIcon) {
        heartIcon.textContent = isActive ? "favorite" : "favorite_border";
      }
      showToast(
        isActive
          ? "즐겨찾기에 추가되었습니다."
          : "즐겨찾기에서 해제되었습니다.",
      );
    });
  }

  // 2. 갤러리 썸네일 기능
  const mainImg = document.querySelector(".main-img");
  const thumbnails = document.querySelectorAll(".thumbnail-item");

  if (mainImg && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener("click", () => {
        document
          .querySelector(".thumbnail-item.active")
          ?.classList.remove("active");
        thumbnail.classList.add("active");
        const newImgSrc = thumbnail.querySelector("img").getAttribute("src");
        if (newImgSrc) {
          mainImg.setAttribute("src", newImgSrc);
        }
      });
    });
  }

  // 3. 컬러 칩 선택 기능
  const colorChips = document.querySelectorAll(".chip");
  if (colorChips.length > 0) {
    colorChips.forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelector(".chip.active")?.classList.remove("active");
        chip.classList.add("active");
        const colorName = chip.classList.contains("chip-grey")
          ? "그레이"
          : chip.classList.contains("chip-yellow")
            ? "옐로우"
            : "블랙";
        console.log(`선택된 컬러: ${colorName}`);
      });
    });
  }

  // 4. 액션 버튼 그룹 기능
  const tryOnBtn = document.querySelector(".btn-try-on");
  const cartBtn = document.querySelector(".btn-cart");
  const buyBtn = document.querySelector(".btn-buy");
  const modal = document.querySelector("#tryon-modal");
  const closeModalBtn = document.querySelector(".close-modal");

  tryOnBtn?.addEventListener("click", () => {
    modal?.classList.add("open");
  });

  closeModalBtn?.addEventListener("click", () => {
    modal?.classList.remove("open");
  });

  cartBtn?.addEventListener("click", () => {
    showToast("장바구니에 상품이 담겼습니다.");
  });

  buyBtn?.addEventListener("click", () => {
    console.log("구매 페이지로 이동 로직 실행");
  });
}

// DOMContentLoaded에서 둘 다 실행
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail(); // 비동기: 상품 정보 로드
  initProductDetail(); // 동기: 이벤트 리스너 등록
});
