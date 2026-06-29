const API_BASE_URL = "http://localhost:3000";

// Armazena em cache o array bruto retornado pela API para agilizar o preenchimento da edição
let cachedDiscounts = [];

async function loadAdminDiscounts() {
    const tbody = document.getElementById('admin-discounts-rows');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--color-text-secondary);">Carregando promoções...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/discounts/admin/list`);
        if (!response.ok) throw new Error();

        cachedDiscounts = await response.json();
        tbody.innerHTML = '';

        if (cachedDiscounts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--color-text-secondary);">Nenhuma promoção ativa configurada.</td></tr>`;
            return;
        }

        cachedDiscounts.forEach(disc => {
            const tr = document.createElement('tr');
            
            // Tratamento estético para exibir datas mantendo o alinhamento da tabela
            tr.innerHTML = `
                <td><strong>${disc.code}</strong> ${disc.description ? `<br><small style="color: var(--color-text-secondary);">${disc.description}</small>` : ''}</td>
                <td>${disc.startsAt}</td>
                <td>${disc.endsAt}</td>
                <td style="font-family: monospace;">R$ ${disc.minAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style="color: #00ff88; font-weight: bold;">${disc.percent}%</td>
                <td style="text-align: right;">
                    <button type="button" class="btn-edit-action" data-id="${disc.id}">Editar</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });

        // Vincula eventos nos botões de edição recém-criados
        document.querySelectorAll('.btn-edit-action').forEach(btn => {
            btn.addEventListener('click', handleOpenEditModal);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--theme-primary); font-weight: 600;">Falha ao carregar a listagem.</td></tr>`;
    }
}

// Abre o formulário limpo configurado para Criação (POST)
function handleOpenCreateModal() {
    const modal = document.getElementById('promoModal');
    document.getElementById('promoForm').reset();
    document.getElementById('form-promo-id').value = ""; // Sem ID indica Modo Criação
    document.getElementById('modal-title-text').textContent = "Nova Promoção";
    modal.showModal();
}

// Abre o formulário preenchido configurado para Edição (PUT)
function handleOpenEditModal(event) {
    const promoId = event.target.getAttribute('data-id');
    const item = cachedDiscounts.find(d => d.id == promoId);
    if (!item) return;

    const modal = document.getElementById('promoModal');
    
    // Injeta os valores atuais nos campos de entrada
    document.getElementById('form-promo-id').value = item.id;
    document.getElementById('form-code').value = item.code;
    document.getElementById('form-description').value = item.description || "";
    document.getElementById('form-amount').value = item.minAmount;
    document.getElementById('form-percent').value = item.percent;

    // Converte datas PT-BR (DD/MM/YYYY) de volta para o padrão HTML5 (YYYY-MM-DD)
    const convertDateToInput = (dateStr) => {
        if (!dateStr || dateStr.includes('--')) return '';
        const [d, m, y] = dateStr.split('/');
        return `${y}-${m}-${d}`;
    };
    
    document.getElementById('form-starts-at').value = convertDateToInput(item.startsAt);
    document.getElementById('form-ends-at').value = convertDateToInput(item.endsAt);

    document.getElementById('modal-title-text').textContent = "Editar Promoção";
    modal.showModal();
}

// Envia os dados para a API (Criando ou Atualizando dependendo do estado do ID)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const promoId = document.getElementById('form-promo-id').value;
    const payload = {
        code: document.getElementById('form-code').value.trim(),
        description: document.getElementById('form-description').value.trim() || null,
        startsAt: document.getElementById('form-starts-at').value,
        endsAt: document.getElementById('form-ends-at').value,
        amount: parseFloat(document.getElementById('form-amount').value),
        percent: parseInt(document.getElementById('form-percent').value, 10)
    };

    const isEdit = promoId !== "";
    const url = isEdit ? `${API_BASE_URL}/discounts/${promoId}` : `${API_BASE_URL}/discounts`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('promoModal').close();
            loadAdminDiscounts(); // Recarrega a tabela
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error(error);
        alert('Não foi possível salvar as alterações no servidor.');
    }
}

// Vincula todos os escutadores de ação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadAdminDiscounts();

    document.getElementById('btn-open-create').addEventListener('click', handleOpenCreateModal);
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('promoModal').close();
    });
    document.getElementById('promoForm').addEventListener('submit', handleFormSubmit);
});
