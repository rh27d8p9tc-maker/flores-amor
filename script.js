const products = [
 {id:1,name:"Пудровое утро",category:"Нежные",price:3900,tag:"Бестселлер",image: "images/pudrovoe-utro.jpg",tone:"#ead8d2",desc:"Нежная композиция в пастельных оттенках"},
 {id:2,name:"Розовый рассвет",category:"Нежные",price:4500,tag:"Новинка",image: "images/rozovyi-rassvet.jpg",tone:"#f0d9dc",desc:"Романтичный букет с мягкими оттенками"},
 {id:3,name:"Солнечный день",category:"Яркие",price:3200,tag:"Яркий выбор",image: "images/solnechnyi-den.jpg",tone:"#eee2bd",desc:"Тёплое настроение в каждом цветке"},
 {id:4,name:"Красная классика",category:"Классика",price:5200,tag:"Классика",image: "images/krasnaya-klassika.jpg",tone:"#e8c9c5",desc:"Выразительный букет для особенного повода"},
 {id:5,name:"Лавандовый сон",category:"Нежные",price:4100,tag:"Нежность",image: "images/lavandovyi-son.jpg",tone:"#ddd6e9",desc:"Спокойная композиция в сиреневых тонах"},
 {id:6,name:"Цветочный микс",category:"Яркие",price:3600,tag:"Разноцветный",image: "images/cvetochniy-mix.jpg",tone:"#f0d7c9",desc:"Сочетание ярких оттенков и фактур"},
 {id:7,name:"Белое облако",category:"Классика",price:4800,tag:"Элегантно",image: "images/beloe-oblako.jpg",tone:"#e9e7df",desc:"Лаконичная композиция в светлой гамме"},
 {id:8,name:"Дикая нежность",category:"Авторские",price:5600,tag:"Авторский",image: "images/dikaya-nezhnost.jpg",tone:"#e6d3c9",desc:"Свободная форма и выразительные детали"},
 {id:9,name:"Персиковый сад",category:"Авторские",price:4900,tag:"Авторский",image: "images/persikovyi-sad.jpg",tone:"#efd8c3",desc:"Мягкая палитра с солнечными акцентами"},
 {id:10,name:"Малиновый акцент",category:"Яркие",price:4300,tag:"Смелый выбор",image: "images/malinovyi-akcent.jpg",tone:"#e9c6ce",desc:"Насыщенные оттенки для ярких эмоций"},
 {id:11,name:"Тихая история",category:"Нежные",price:3700,tag:"Минимализм",image: "images/tihaya-istoriya.jpg",tone:"#dce3d7",desc:"Сдержанная природная композиция"},
 {id:12,name:"Вечерний сад",category:"Авторские",price:6100,tag:"Премиум",image: "images/vecherniy-sad.jpg",tone:"#d8c8c8",desc:"Объёмный букет с выразительным характером"}
];
let cart = JSON.parse(localStorage.getItem("floresCart") || "[]");
const money = n => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
const $ = id => document.getElementById(id);
function saveCart(){localStorage.setItem("floresCart",JSON.stringify(cart));updateCartCount();}
function updateCartCount(){$("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);}
function productCard(p){
 return `
  <article class="product-card">
    <div class="product-art" style="--tone:${p.tone}">
     <span class="product-tag">${p.tag}</span> 
      <img
        src="${p.image}"
        alt="${p.name}"
        class="bouquet-photo"
        loading="lazy"
      >
    </div>
    <div class="product-info">
     <h3>${p.name}</h3>
    <div class="product-meta">
     <span>${p.category}</span>
     <strong>${money(p.price)}</strong>
    </div>
    <button class="add-btn" data-add="${p.id}">
     Добавить в корзину +
    </button>
   </div>
  </article>
 `;
}
function renderCatalog(){
 const q=$("searchInput").value.trim().toLowerCase(),cat=$("categoryFilter").value,sort=$("sortFilter").value;
 let list=products.filter(p=>(p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q))&&(cat==="all"||p.category===cat));
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
 $("catalogProducts").innerHTML=list.map(productCard).join("");$("resultsCount").textContent=`Найдено букетов: ${list.length}`;$("emptyState").classList.toggle("hidden",list.length!==0);
}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();toast("Букет добавлен в корзину");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function renderCart() {
   const items = cart.map(x => ({
    ...products.find(p => p.id === x.id),
    qty: x.qty
})).filter(x => x.id);
$("cartItems").innerHTML = items.map(p => `
    <div class="cart-row">
        <div class="cart-thumb" style="--tone:${p.tone}">
            <img src="${p.name}" alt="${p.name}">
        </div>

        <div>
            <h3>${p.name}</h3>
            <small>${money(p.price)} за букет</small>
        </div>

        <div class="quantity">
            <button data-qty="${p.id}" data-delta="-1">−</button>
            <span>${p.qty}</span>
            <button data-qty="${p.id}" data-delta="1">+</button>
        </div>

        <button class="remove-btn" data-remove="${p.id}">
            Удалить
        </button>
    </div>
`).join("");

const total = items.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
);

$("cartTotal").textContent = money(total);

$("cartEmpty").classList.toggle(
    "hidden",
    items.length !== 0
);

$("checkoutBtn").disabled = !items.length;
$("checkoutBtn").style.opacity = items.length ? 1 : 0.5;

renderCheckoutSummary();
}
function renderCheckoutSummary(){
 const items=cart.map(x=>({...products.find(p=>p.id===x.id),qty:x.qty})).filter(x=>x.id);
 $("checkoutSummary").innerHTML=items.map(p=>`<div class="order-line"><span>${p.name} × ${p.qty}</span><b>${money(p.price*p.qty)}</b></div>`).join("");
 $("checkoutTotal").textContent=money(items.reduce((s,p)=>s+p.price*p.qty,0));
}
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll(".main-nav a").forEach(a=>a.classList.toggle("current",a.getAttribute("href")==="#"+id));$("mainNav").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false");if(id==="cart")renderCart();if(id==="checkout")renderCheckoutSummary();window.scrollTo({top:0,behavior:"smooth"});}
function navigate(){
 const id=location.hash.slice(1) || "home";
 showPage(document.getElementById(id) ? id:"home");
}
let toastTimer;function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200);}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
 const qty=e.target.closest("[data-qty]");if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));saveCart();renderCart();}
});
$("searchInput").addEventListener("input",renderCatalog);$("categoryFilter").addEventListener("change",renderCatalog);$("sortFilter").addEventListener("change",renderCatalog);
$("cartOpen").addEventListener("click",()=>location.hash="cart");
$("checkoutBtn").addEventListener("click",()=>{if(cart.length)location.hash="checkout";});
$("menuToggle").addEventListener("click",()=>{const open=$("mainNav").classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".main-nav a,.hero-actions a,.section-heading a,.offer-card a,.site-footer .logo,.success-page a").forEach(a=>a.addEventListener("click",()=>{const id=a.getAttribute("href").slice(1);if(id)showPage(id);}));
$("contactForm").addEventListener("submit",e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;$("contactStatus").textContent="Спасибо! Форма заполнена корректно (демонстрационная отправка).";e.currentTarget.reset();});
$("checkoutForm").addEventListener("submit",e=>{e.preventDefault();if(!cart.length){location.hash="catalog";return;}if(!e.currentTarget.reportValidity())return;cart=[];saveCart();e.currentTarget.reset();location.hash="success";});
$("year").textContent=new Date().getFullYear();
$("featuredProducts").innerHTML=products.slice(0,4).map(productCard).join("");
renderCatalog();updateCartCount();window.addEventListener("hashchange",navigate);navigate();