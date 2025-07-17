const produtos = [{'id': 1, 'nome': 'Camiseta Oversized Unissex', 'descricao': 'Conforto e estilo para o dia a dia.', 'imagem': 'imagens/camisetas.png', 'preco': 89.9}, {'id': 2, 'nome': 'Óculos de Sol Estilo Retrô', 'descricao': 'Proteção UV com muito estilo.', 'imagem': 'imagens/oculos.png', 'preco': 129.0}, {'id': 3, 'nome': 'Boné Aba Curva Preto Minimalista', 'descricao': 'Design clean que combina com tudo.', 'imagem': 'imagens/bone.png', 'preco': 69.9}, {'id': 4, 'nome': 'Pulseira Masculina Couro Trançado', 'descricao': 'Estilo autêntico com acabamento premium.', 'imagem': 'imagens/pulseira.png', 'preco': 49.9}];


if (document.getElementById("lista-produtos")) {
  const lista = document.getElementById("lista-produtos");
  const busca = document.getElementById("busca");

  function renderProdutos(filtro = "") {
    lista.innerHTML = "";
    produtos.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
      .forEach(p => {
        const div = document.createElement("div");
        div.className = "produto";
        div.innerHTML = `
          <img src="${p.imagem}" alt="${p.nome}">
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <p><strong>R$ ${p.preco.toFixed(2)}</strong></p>
          <button onclick="adicionarCarrinho(${p.id})">Adicionar ao carrinho</button>
        `;
        lista.appendChild(div);
      });
  }

  busca.addEventListener("input", () => renderProdutos(busca.value));
  renderProdutos();
}

function adicionarCarrinho(id) {
  const item = produtos.find(p => p.id === id);
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(item);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

if (document.getElementById("itens-carrinho")) {
  const itens = JSON.parse(localStorage.getItem("carrinho")) || [];
  const container = document.getElementById("itens-carrinho");
  const total = document.getElementById("total");

  let soma = 0;
  container.innerHTML = "";
  itens.forEach((item, i) => {
    soma += item.preco;
    container.innerHTML += `
      <div>
        ${item.nome} - R$ ${item.preco.toFixed(2)}
        <button onclick="removerItem(${i})">Remover</button>
      </div>
    `;
  });
  total.innerText = "Total: R$ " + soma.toFixed(2);
}

function removerItem(i) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(i, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  location.reload();
}

if (document.getElementById("form-checkout")) {
  document.getElementById("form-checkout").addEventListener("submit", e => {
    e.preventDefault();
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const mensagem = carrinho.map(p => `• ${p.nome} - R$ ${p.preco.toFixed(2)}`).join("\n");
    window.open(`https://wa.me/5514998640372?text=Pedido:%0A${mensagem}`);
  });
}
