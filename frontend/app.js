const API = 'http://127.0.0.1:8000/api';

// ── NAVEGAÇÃO ──────────────────────────────────────────────
function navegarPara(pagina) {
  document.querySelectorAll('.pagina').forEach(p => p.classList.add('oculto'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  document.getElementById('pagina-' + pagina).classList.remove('oculto');
  document.querySelector(`[data-pagina="${pagina}"]`).classList.add('active');

  if (pagina === 'produtos') carregarProdutos();
  if (pagina === 'categorias') carregarCategorias();
  if (pagina === 'movimentacoes') carregarMovimentacoes();
}

// ── TOAST ──────────────────────────────────────────────────
function mostrarToast(msg, tipo = 'sucesso') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + tipo;
  t.classList.remove('oculto');
  setTimeout(() => t.classList.add('oculto'), 3000);
}

// ── MODAL ──────────────────────────────────────────────────
function fecharModal() {
  document.getElementById('modal').classList.add('oculto');
}

function fecharModalFora(e) {
  if (e.target.id === 'modal') fecharModal();
}

function abrirModal(titulo, htmlCorpo) {
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-corpo').innerHTML = htmlCorpo;
  document.getElementById('modal').classList.remove('oculto');
}

// ── PRODUTOS ───────────────────────────────────────────────
async function carregarProdutos() {
  const tbody = document.getElementById('tabela-produtos');
  const resumo = document.getElementById('resumo-produtos');
  tbody.innerHTML = '<tr><td colspan="7" class="vazio">Carregando...</td></tr>';

  try {
    const res = await fetch(`${API}/produtos/`);
    const produtos = await res.json();

    const total = produtos.length;
    const baixo = produtos.filter(p => p.quantidade > 0 && p.quantidade <= p.estoque_min).length;
    const zerado = produtos.filter(p => p.quantidade === 0).length;

    resumo.innerHTML = `
      <div class="card-resumo">
        <div class="label">total de produtos</div>
        <div class="valor">${total}</div>
      </div>
      <div class="card-resumo alerta">
        <div class="label">estoque baixo</div>
        <div class="valor">${baixo}</div>
      </div>
      <div class="card-resumo critico">
        <div class="label">sem estoque</div>
        <div class="valor">${zerado}</div>
      </div>
    `;

    if (!produtos.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="vazio">Nenhum produto cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = produtos.map(p => {
      let badge, status;
      if (p.quantidade === 0) { badge = 'badge-zerado'; status = 'zerado'; }
      else if (p.quantidade <= p.estoque_min) { badge = 'badge-baixo'; status = 'baixo'; }
      else { badge = 'badge-ok'; status = 'ok'; }

      return `
        <tr>
          <td>${p.nome}</td>
          <td><span class="sku">${p.sku}</span></td>
          <td>R$ ${Number(p.preco_custo).toFixed(2)}</td>
          <td>${p.quantidade}</td>
          <td>${p.estoque_min}</td>
          <td><span class="badge ${badge}">${status}</span></td>
          <td>
            <button class="btn-danger" onclick="deletarProduto(${p.id})">deletar</button>
          </td>
        </tr>`;
    }).join('');

  } catch {
    tbody.innerHTML = '<tr><td colspan="7" class="vazio">Erro ao conectar com a API.</td></tr>';
  }
}

function abrirFormProduto() {
  abrirModal('novo produto', `
    <div class="form-grupo">
      <label>Nome</label>
      <input type="text" id="f-nome" placeholder="ex: Água mineral 500ml">
    </div>
    <div class="form-grupo">
      <label>SKU</label>
      <input type="text" id="f-sku" placeholder="ex: BEB-001">
    </div>
    <div class="form-grupo">
      <label>Preço de custo (R$)</label>
      <input type="number" id="f-preco" step="0.01" placeholder="0.00">
    </div>
    <div class="form-grupo">
      <label>Quantidade inicial</label>
      <input type="number" id="f-qtd" placeholder="0">
    </div>
    <div class="form-grupo">
      <label>Estoque mínimo</label>
      <input type="number" id="f-min" placeholder="0">
    </div>
    <div class="form-grupo">
      <label>Categoria ID</label>
      <input type="number" id="f-cat" placeholder="1">
    </div>
    <div class="form-acoes">
      <button class="btn-secundario" onclick="fecharModal()">cancelar</button>
      <button class="btn-primary" onclick="salvarProduto()">salvar produto</button>
    </div>
  `);
}

async function salvarProduto() {
  const body = {
    nome: document.getElementById('f-nome').value,
    sku: document.getElementById('f-sku').value,
    preco_custo: parseFloat(document.getElementById('f-preco').value),
    quantidade: parseInt(document.getElementById('f-qtd').value),
    estoque_min: parseInt(document.getElementById('f-min').value),
    categoria_id: parseInt(document.getElementById('f-cat').value),
  };

  try {
    const res = await fetch(`${API}/produtos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error();
    fecharModal();
    mostrarToast('Produto criado com sucesso!');
    carregarProdutos();
  } catch {
    mostrarToast('Erro ao criar produto.', 'erro');
  }
}

async function deletarProduto(id) {
  if (!confirm('Deletar este produto?')) return;
  try {
    await fetch(`${API}/produtos/${id}`, { method: 'DELETE' });
    mostrarToast('Produto deletado.');
    carregarProdutos();
  } catch {
    mostrarToast('Erro ao deletar.', 'erro');
  }
}

// ── CATEGORIAS ─────────────────────────────────────────────
async function carregarCategorias() {
  const tbody = document.getElementById('tabela-categorias');
  tbody.innerHTML = '<tr><td colspan="4" class="vazio">Carregando...</td></tr>';

  try {
    const res = await fetch(`${API}/categorias/`);
    const cats = await res.json();

    if (!cats.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="vazio">Nenhuma categoria cadastrada.</td></tr>';
      return;
    }

    tbody.innerHTML = cats.map(c => `
      <tr>
        <td><span class="sku">${c.id}</span></td>
        <td>${c.nome}</td>
        <td style="color: var(--text2)">${c.descricao || '—'}</td>
        <td>
          <button class="btn-danger" onclick="deletarCategoria(${c.id})">deletar</button>
        </td>
      </tr>`
    ).join('');

  } catch {
    tbody.innerHTML = '<tr><td colspan="4" class="vazio">Erro ao conectar com a API.</td></tr>';
  }
}

function abrirFormCategoria() {
  abrirModal('nova categoria', `
    <div class="form-grupo">
      <label>Nome</label>
      <input type="text" id="f-cat-nome" placeholder="ex: Bebidas">
    </div>
    <div class="form-grupo">
      <label>Descrição (opcional)</label>
      <input type="text" id="f-cat-desc" placeholder="ex: Refrigerantes, sucos e água">
    </div>
    <div class="form-acoes">
      <button class="btn-secundario" onclick="fecharModal()">cancelar</button>
      <button class="btn-primary" onclick="salvarCategoria()">salvar categoria</button>
    </div>
  `);
}

async function salvarCategoria() {
  const body = {
    nome: document.getElementById('f-cat-nome').value,
    descricao: document.getElementById('f-cat-desc').value || null,
  };

  try {
    const res = await fetch(`${API}/categorias/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error();
    fecharModal();
    mostrarToast('Categoria criada com sucesso!');
    carregarCategorias();
  } catch {
    mostrarToast('Erro ao criar categoria.', 'erro');
  }
}

async function deletarCategoria(id) {
  if (!confirm('Deletar esta categoria?')) return;
  try {
    await fetch(`${API}/categorias/${id}`, { method: 'DELETE' });
    mostrarToast('Categoria deletada.');
    carregarCategorias();
  } catch {
    mostrarToast('Erro ao deletar.', 'erro');
  }
}

// ── MOVIMENTAÇÕES ──────────────────────────────────────────
async function carregarMovimentacoes() {
  const tbody = document.getElementById('tabela-movimentacoes');
  tbody.innerHTML = '<tr><td colspan="5" class="vazio">Carregando...</td></tr>';

  try {
    const res = await fetch(`${API}/movimentacoes/`);
    const movs = await res.json();

    if (!movs.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="vazio">Nenhuma movimentação registrada.</td></tr>';
      return;
    }

    tbody.innerHTML = movs.map(m => {
      const data = m.criado_em ? new Date(m.criado_em).toLocaleString('pt-BR') : '—';
      const badgeClass = m.tipo === 'entrada' ? 'badge-entrada' : 'badge-saida';
      return `
        <tr>
          <td><span class="sku">#${m.produto_id}</span></td>
          <td><span class="badge ${badgeClass}">${m.tipo}</span></td>
          <td>${m.quantidade}</td>
          <td style="color: var(--text2)">${m.motivo || '—'}</td>
          <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text3)">${data}</td>
        </tr>`;
    }).join('');

  } catch {
    tbody.innerHTML = '<tr><td colspan="5" class="vazio">Erro ao conectar com a API.</td></tr>';
  }
}

function abrirFormMovimentacao() {
  abrirModal('registrar movimentação', `
    <div class="form-grupo">
      <label>Produto ID</label>
      <input type="number" id="f-mov-prod" placeholder="1">
    </div>
    <div class="form-grupo">
      <label>Tipo</label>
      <select id="f-mov-tipo">
        <option value="entrada">entrada</option>
        <option value="saida">saída</option>
      </select>
    </div>
    <div class="form-grupo">
      <label>Quantidade</label>
      <input type="number" id="f-mov-qtd" placeholder="0">
    </div>
    <div class="form-grupo">
      <label>Motivo (opcional)</label>
      <input type="text" id="f-mov-motivo" placeholder="ex: Compra de fornecedor">
    </div>
    <div class="form-acoes">
      <button class="btn-secundario" onclick="fecharModal()">cancelar</button>
      <button class="btn-primary" onclick="salvarMovimentacao()">registrar</button>
    </div>
  `);
}

async function salvarMovimentacao() {
  const body = {
    produto_id: parseInt(document.getElementById('f-mov-prod').value),
    tipo: document.getElementById('f-mov-tipo').value,
    quantidade: parseInt(document.getElementById('f-mov-qtd').value),
    motivo: document.getElementById('f-mov-motivo').value || null,
  };

  try {
    const res = await fetch(`${API}/movimentacoes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error();
    fecharModal();
    mostrarToast('Movimentação registrada!');
    carregarMovimentacoes();
  } catch {
    mostrarToast('Erro ao registrar movimentação.', 'erro');
  }
}

// ── INIT ───────────────────────────────────────────────────
carregarProdutos();
