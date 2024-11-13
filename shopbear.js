// Funções e eventos comuns do Mercado Livre
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrinho de compras
    initShoppingCart();
  
    // Adicionar evento de clique aos botões de compra
    var buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        addToCart(this.dataset.productId, this.dataset.productName, this.dataset.productPrice);
      });
    });
  
    // Evento de clique no ícone de carrinho
    var cartIcon = document.getElementById('cart-icon');
    cartIcon.addEventListener('click', toggleCart);
  
    // Evento de clique fora do carrinho para fechá-lo
    document.addEventListener('click', function(event) {
      var cart = document.getElementById('cart');
      if (cart && !cart.contains(event.target) && !cartIcon.contains(event.target)) {
        cart.classList.add('hidden');
      }
    });
  });
  
  // Função para inicializar o carrinho de compras
  function initShoppingCart() {
    // Carregar itens do carrinho do armazenamento local
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartUI(cart);
  
    // Observar mudanças no carrinho e atualizar o armazenamento local
    var cartItems = document.getElementById('cart-items');
    var observer = new MutationObserver(function() {
      var updatedCart = Array.from(cartItems.children).map(function(item) {
        return {
          id: item.dataset.productId,
          name: item.querySelector('.product-name').textContent,
          price: parseFloat(item.querySelector('.product-price').textContent)
        };
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    });
    observer.observe(cartItems, { childList: true });
  }
  
  // Função para adicionar um item ao carrinho
  function addToCart(id, name, price) {
    var cartItems = document.getElementById('cart-items');
    var existingItem = cartItems.querySelector(`[data-product-id="${id}"]`);
  
    if (existingItem) {
      // Atualizar a quantidade do item existente
      var quantityElement = existingItem.querySelector('.product-quantity');
      var quantity = parseInt(quantityElement.textContent);
      quantityElement.textContent = quantity + 1;
    } else {
      // Criar um novo item no carrinho
      var cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.dataset.productId = id;
      cartItem.innerHTML = `
        <div class="product-image" style="background-image: url('/api/placeholder/100/100')"></div>
        <div class="product-info">
          <h3 class="product-name">${name}</h3>
          <p class="product-price">R$ ${price.toFixed(2)}</p>
          <div class="product-quantity">1</div>
          <button class="remove-button">Remover</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
  
      // Adicionar evento de clique ao botão de remoção
      var removeButton = cartItem.querySelector('.remove-button');
      removeButton.addEventListener('click', function() {
        cartItem.remove();
      });
    }
  
    updateCartUI();
  }
  
  // Função para atualizar a interface do carrinho
  function updateCartUI(cart) {
    var cartItems = document.getElementById('cart-items');
    var totalPrice = 0;
  
    // Limpar itens anteriores do carrinho
    cartItems.innerHTML = '';
  
    // Adicionar novos itens ao carrinho
    (cart || []).forEach(function(item) {
      var cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.dataset.productId = item.id;
      cartItem.innerHTML = `
        <div class="product-image" style="background-image: url('/api/placeholder/100/100')"></div>
        <div class="product-info">
          <h3 class="product-name">${item.name}</h3>
          <p class="product-price">R$ ${item.price.toFixed(2)}</p>
          <div class="product-quantity">1</div>
          <button class="remove-button">Remover</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
  
      // Adicionar evento de clique ao botão de remoção
      var removeButton = cartItem.querySelector('.remove-button');
      removeButton.addEventListener('click', function() {
        cartItem.remove();
      });
  
      totalPrice += item.price;
    });
  
    // Atualizar o preço total do carrinho
    var cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = `Total: R$ ${totalPrice.toFixed(2)}`;
  }
  
  // Função para alternar a visibilidade do carrinho
  function toggleCart() {
    var cart = document.getElementById('cart');
    cart.classList.toggle('hidden');
  }