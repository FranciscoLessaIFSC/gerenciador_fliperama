const API_BASE_URL = "http://localhost:3000";
let cachedProducts = [];

async function loadAdminProducts() {
    const tbody = document.getElementById('admin-products-rows');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--color-text-secondary);">Carregando inventário...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/products/admin/list`);
        if (!response.ok) throw new Error();

        cachedProducts = await response.json();
        tbody.innerHTML = '';

        if (cachedProducts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--color-text-secondary);">Nenhum produto cadastrado no estoque.</td></tr>`;
            return;
        }

        cachedProducts.forEach(prod => {
            const tr = document.createElement('tr');
            
            let stockStyle = "font-weight: 600;";
            if (prod.stock === 0) stockStyle += " color: #ff5252;";
            else if (prod.stock < 5) stockStyle += " color: #ffeb3b;";
            else stockStyle += " color: #00ff88;";

            // Inclui o botão de Editar passando o ID correto como parâmetro relacional
            tr.innerHTML = `
                <td><strong>${prod.name}</strong></td>
                <td><code style="letter-spacing: 0.05em;">${prod.sku}</code></td>
                <td><span style="${stockStyle}">${prod.stock} un</span></td>
                <td style="text-align: right;">
                    <button type="button" class="btn-edit-action" data-id="${prod.id}">Editar</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });

        // Event listener dos botões dinâmicos de edição
        document.querySelectorAll('.btn-edit-action').forEach(btn => {
            btn.addEventListener('click', handleOpenEditModal);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--theme-primary); font-weight: 600;">Falha ao carregar o inventário da API.</td></tr>`;
    }
}

// Reseta e abre formulário para Criação (POST /products)
function handleOpenCreateModal() {
    const modal = document.getElementById('stockModal');
    document.getElementById('stockForm').reset();
    document.getElementById('form-product-id').value = ""; // Vazio indica criação
    document.getElementById('form-sku').disabled = false;   // Permite digitar novo SKU
    document.getElementById('modal-title-text').textContent = "Novo Produto";
    modal.showModal();
}

// Reseta, popula e abre formulário para Edição (PUT /products/:id)
function handleOpenEditModal(event) {
    const productId = event.target.getAttribute('data-id');
    const item = cachedProducts.find(p => p.id == productId);
    if (!item) return;

    const modal = document.getElementById('stockModal');
    
    document.getElementById('form-product-id').value = item.id;
    document.getElementById('form-name').value = item.name;
    document.getElementById('form-sku').value = item.sku;
    document.getElementById('form-stock').value = item.stock;
    document.getElementById('form-price').value = item.price || 5.00; // Fallback se preço não vier mapeado na lista rápida

    document.getElementById('modal-title-text').textContent = "Editar Produto";
    modal.showModal();
}

// Envio assíncrono para os endpoints existentes informados
async function handleFormSubmit(event) {
    event.preventDefault();

    const productId = document.getElementById('form-product-id').value;
    const payload = {
        name: document.getElementById('form-name').value.trim(),
        sku: document.getElementById('form-sku').value.trim(),
        stock: parseInt(document.getElementById('form-stock').value, 10),
        price: parseFloat(document.getElementById('form-price').value)
    };

    const isEdit = productId !== "";
    // Endpoints fornecidos por você adaptados dinamicamente na URL
    const url = isEdit ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Operação realizada com sucesso!');
            document.getElementById('stockModal').close();
            loadAdminProducts();
        } else {
            alert(`Erro: ${data.error || 'Falha na validação dos dados.'}`);
        }
    } catch (error) {
        console.error(error);
        alert('Não foi possível salvar as alterações no banco de dados.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminProducts();

    document.getElementById('btn-open-create').addEventListener('click', handleOpenCreateModal);
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('stockModal').close();
    });
    document.getElementById('stockForm').addEventListener('submit', handleFormSubmit);
});
