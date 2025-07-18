// script.js atualizado para funcionar em todas as páginas

// Lista de produtos
const produtos = [
  {
    id: 1,
    nome: "Camiseta Oversized Unissex",
    descricao: "Conforto e estilo para o dia a dia.",
    imagem: "imagens/camisetas.png",
    preco: 89.9,
  },
  {
    id: 2,
    nome: "Óculos de Sol Estilo Retrô",
    descricao: "Proteção UV com muito estilo.",
    imagem: "imagens/oculos.png",
    preco: 129.0,
  },
  {
    id: 3,
    nome: "Boné Aba Curva Preto Minimalista",
    descricao: "Design clean que combina com tudo.",
    imagem: "imagens/bone.png",
    preco: 69.9,
  },
  {
    id: 4,
    nome: "Pulseira Masculina Couro Trançado",
    descricao: "Estilo autêntico com acabamento premium.",
    imagem: "imagens/pulseira.png",
    preco: 49.9,
  },
];

// Utilitários
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const carrinhoStr = localStorage.getItem("carrinho");
  return carrinhoStr ? JSON.parse(carrinhoStr) : [];
}

function atualizarContador() {
  const contadorEl = document.getElementById("contador-carrinho");
  if (contadorEl) {
    const carrinho = carregarCarrinho();
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contadorEl.textContent = total;
  }
}

function adicionarAoCarrinho(idProduto) {
  let carrinho = carregarCarrinho();
  const itemIndex = carrinho.findIndex(item => item.id === idProduto);
  if (itemIndex > -1) {
    carrinho[itemIndex].quantidade += 1;
  } else {
    carrinho.push({ id: idProduto, quantidade: 1 });
  }
  salvarCarrinho(carrinho);
  atualizarContador();
  alert("Produto adicionado ao carrinho!");
}

function renderizarProdutos(filtro = "") {
  const listaEl = document.getElementById("lista-produtos");
  const buscaEl = document.getElementById("busca");
  if (!listaEl || !buscaEl) return;

  listaEl.innerHTML = "";
  const textoFiltro = filtro.toLowerCase();
  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(textoFiltro)
  );

  if (produtosFiltrados.length === 0) {
    listaEl.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  produtosFiltrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}" />
      <h3>${prod.nome}</h3>
      <p>${prod.descricao}</p>
      <p><strong>R$ ${prod.preco.toFixed(2)}</strong></p>
      <button data-id="${prod.id}">Adicionar ao Carrinho</button>
    `;
    listaEl.appendChild(div);
  });

  listaEl.querySelectorAll("button").forEach(botao => {
    botao.addEventListener("click", () => {
      adicionarAoCarrinho(parseInt(botao.dataset.id));
    });
  });

  buscaEl.addEventListener("input", e => {
    renderizarProdutos(e.target.value);
  });
}

function renderizarCarrinho() {
  const itensEl = document.getElementById("itens-carrinho");
  const totalEl = document.getElementById("total");
  if (!itensEl || !totalEl) return;

  const carrinho = carregarCarrinho();
  itensEl.innerHTML = "";
  let soma = 0;

  carrinho.forEach((item, i) => {
    const produto = produtos.find(p => p.id === item.id);
    const subtotal = produto.preco * item.quantidade;
    soma += subtotal;

    const div = document.createElement("div");
    div.innerHTML = `
      ${produto.nome} - R$ ${produto.preco.toFixed(2)} x ${item.quantidade} = R$ ${subtotal.toFixed(2)}
      <button onclick="removerItem(${i})">Remover</button>
    `;
    itensEl.appendChild(div);
  });

  totalEl.textContent = `Total: R$ ${soma.toFixed(2)}`;
}

function removerItem(index) {
  let carrinho = carregarCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  location.reload();
}

function enviarPedidoWhatsApp() {
  const form = document.getElementById("form-checkout");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const carrinho = carregarCarrinho();
    const mensagem = carrinho.map(item => {
      const p = produtos.find(prod => prod.id === item.id);
      return `• ${p.nome} x ${item.quantidade} - R$ ${(p.preco * item.quantidade).toFixed(2)}`;
    }).join("%0A");

    window.open(`https://wa.me/5514998640372?text=Pedido:%0A${mensagem}`);
  });
}

// Inicialização global
window.addEventListener("DOMContentLoaded", () => {
  atualizarContador();
  renderizarProdutos();
  renderizarCarrinho();
  enviarPedidoWhatsApp();
});
