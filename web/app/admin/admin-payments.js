const API_BASE_URL = "http://localhost:3000";
let cachedRows = [];

async function loadAdminPayments() {
    const tbody = document.getElementById('admin-payments-rows');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--color-text-secondary);">Calculando folha e banco de horas...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/financial-transactions/admin/payments`);
        if (!response.ok) throw new Error();

        cachedRows = await response.json();
        tbody.innerHTML = '';

        if (cachedRows.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhum funcionário ativo para gerenciamento de folha.</td></tr>`;
            return;
        }

        cachedRows.forEach(row => {
            const tr = document.createElement('tr');
            
            // Verifica se já existe um holerite lançado para o funcionário
            const hasPaid = row.lastSalaryAmount > 0;
            const actionButtonText = hasPaid ? "Editar Valor" : "Pagar Salário";
            const deleteButton = hasPaid 
                ? `<button type="button" class="btn-row-action btn-row-delete" data-tx-id="${row.transactionId}">Estornar</button>` 
                : '';

            tr.innerHTML = `
                <td><strong>${row.name}</strong></td>
                <td style="font-family: monospace; color: ${hasPaid ? '#00ff88' : 'var(--color-text-secondary)'};">
                    ${hasPaid ? `R$ ${row.lastSalaryAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'R$ --,--'}
                </td>
                <td><code style="font-size:0.9rem;">${row.bankInfo}</code></td>
                <td>${row.hoursWorked}</td>
                <td style="color: ${row.absences > 2 ? '#ff5252' : 'inherit'}; font-weight: 500;">${row.absences}</td>
                <td style="text-align: right;">
                    <button type="button" class="btn-row-action btn-trigger-pay" data-emp-id="${row.employeeId}">${actionButtonText}</button>
                    ${deleteButton}
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Vincula escutadores nos botões gerados
        document.querySelectorAll('.btn-trigger-pay').forEach(btn => btn.addEventListener('click', handleOpenPayModal));
        document.querySelectorAll('.btn-row-delete').forEach(btn => btn.addEventListener('click', handleDeletePayment));

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: red;">Erro ao computar folha da API.</td></tr>`;
    }
}

function handleOpenPayModal(event) {
    const empId = event.target.getAttribute('data-emp-id');
    const row = cachedRows.find(r => r.employeeId == empId);
    if (!row) return;

    const modal = document.getElementById('payModal');
    document.getElementById('form-employee-id').value = row.employeeId;
    document.getElementById('form-transaction-id').value = row.transactionId || "";
    document.getElementById('form-emp-name').value = row.name;
    document.getElementById('form-amount').value = row.lastSalaryAmount > 0 ? row.lastSalaryAmount : "";
    
    document.getElementById('modal-title-text').textContent = row.lastSalaryAmount > 0 ? "Modificar Pagamento" : "Lançar Novo Pagamento";
    modal.showModal();
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const txId = document.getElementById('form-transaction-id').value;
    const employeeId = parseInt(document.getElementById('form-employee-id').value, 10);
    const amount = parseFloat(document.getElementById('form-amount').value);

    const isEdit = txId !== "";
    const url = isEdit ? `${API_BASE_URL}/financial-transactions/admin/payments/${txId}` : `${API_BASE_URL}/financial-transactions/admin/payments`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isEdit ? { amount } : { employeeId, amount })
        });

        if (response.ok) {
            document.getElementById('payModal').close();
            loadAdminPayments();
        } else {
            alert('Falha ao registrar transação.');
        }
    } catch (error) {
        console.error(error);
    }
}

async function handleDeletePayment(event) {
    const txId = event.target.getAttribute('data-tx-id');
    if (!confirm('Deseja realmente estornar e remover este registro de pagamento do caixa?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/financial-transactions/admin/payments/${txId}`, { method: 'DELETE' });
        if (response.ok) loadAdminPayments();
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminPayments();
    document.getElementById('btn-close-modal').addEventListener('click', () => document.getElementById('payModal').close());
    document.getElementById('payForm').addEventListener('submit', handleFormSubmit);
});