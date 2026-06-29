const API_BASE_URL = "http://localhost:3000";
let cachedEmployees = [];

// Mapeamento reverso para traduzir o texto exibido de volta para o Enum do Prisma
const inverseRoleMap = {
    'Caixa': 'CASHIER',
    'Operador / Técnico': 'OPERATOR',
    'Gerente': 'MANAGER',
    'Administrador': 'ADMIN'
};

async function loadAdminEmployees() {
    const tbody = document.getElementById('admin-employees-rows');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--color-text-secondary);">Carregando listagem de funcionários...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/employees/admin/list`);
        if (!response.ok) throw new Error();

        cachedEmployees = await response.json();
        tbody.innerHTML = '';

        if (cachedEmployees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--color-text-secondary);">Nenhum funcionário ativo registrado.</td></tr>`;
            return;
        }

        cachedEmployees.forEach(emp => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td><strong>${emp.name}</strong></td>
                <td><span style="font-weight: 500;">${emp.role}</span></td>
                <td style="text-align: right;">
                    <button type="button" class="btn-edit-action" data-id="${emp.id}">Editar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Vincula evento de edição nos botões dinâmicos
        document.querySelectorAll('.btn-edit-action').forEach(btn => {
            btn.addEventListener('click', handleOpenEditModal);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--theme-primary); font-weight: 600;">Não foi possível carregar os funcionários da API.</td></tr>`;
    }
}

// Configura o modal para o Modo Criação (POST)
function handleOpenCreateModal() {
    const modal = document.getElementById('empModal');
    document.getElementById('empForm').reset();
    document.getElementById('form-emp-id').value = "";
    document.getElementById('form-email').required = true;
    document.getElementById('email-field-wrapper').style.display = "block"; // Exibe e-mail
    document.getElementById('modal-title-text').textContent = "Novo Funcionário";
    modal.showModal();
}

// Configura o modal para o Modo Edição (PUT)
function handleOpenEditModal(event) {
    const empId = event.target.getAttribute('data-id');
    const item = cachedEmployees.find(e => e.id == empId);
    if (!item) return;

    const modal = document.getElementById('empModal');
    
    document.getElementById('form-emp-id').value = item.id;
    document.getElementById('form-name').value = item.name;
    document.getElementById('form-email').required = false;
    document.getElementById('email-field-wrapper').style.display = "none"; // Oculta e-mail na edição
    
    // Converte o nome legível de volta para o Enum correspondente no <select>
    document.getElementById('form-role').value = inverseRoleMap[item.role] || "CASHIER";

    document.getElementById('modal-title-text').textContent = "Editar Funcionário";
    modal.showModal();
}

// Submete os dados dinamicamente com base na presença do ID
async function handleFormSubmit(event) {
    event.preventDefault();

    const empId = document.getElementById('form-emp-id').value;
    const isEdit = empId !== "";

    const payload = {
        name: document.getElementById('form-name').value.trim(),
        role: document.getElementById('form-role').value
    };

    // Adiciona e-mail apenas se for um novo registro
    if (!isEdit) {
        payload.email = document.getElementById('form-email').value.trim();
    }

    const url = isEdit ? `${API_BASE_URL}/employees/${empId}` : `${API_BASE_URL}/employees`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('empModal').close();
            loadAdminEmployees(); // Recarrega a tabela limpa
        } else {
            alert(`Erro: ${data.error || 'Falha ao salvar.'}`);
        }
    } catch (error) {
        console.error(error);
        alert('Não foi possível salvar os dados no servidor.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminEmployees();

    document.getElementById('btn-open-create').addEventListener('click', handleOpenCreateModal);
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('empModal').close();
    });
    document.getElementById('empForm').addEventListener('submit', handleFormSubmit);
});