const API_BASE_URL = "http://localhost:3000";

async function loadAdminReports() {
    const tbody = document.getElementById('admin-reports-rows');
    
    if (!tbody) {
        console.error("Alvo #admin-reports-rows não localizado no DOM.");
        return;
    }

    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--color-text-secondary);">Calculando indicadores do dia...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/reports/admin/daily`);
        
        if (!response.ok) {
            throw new Error('Erro ao obter os indicadores.');
        }

        const metrics = await response.json();
        tbody.innerHTML = '';

        if (!metrics || metrics.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--color-text-secondary);">Nenhum dado operacional registrado hoje.</td></tr>`;
            return;
        }

        metrics.forEach(row => {
            const tr = document.createElement('tr');
            
            // Define a cor de acordo com a variação operacional
            const variationStyle = row.isPositive 
                ? "color: #00ff88; font-weight: 600;" 
                : "color: #ff5252; font-weight: 600;";

            tr.innerHTML = `
                <td><strong>${row.indicator}</strong></td>
                <td style="font-family: monospace; font-weight: 500;">${row.value}</td>
                <td style="${variationStyle}">${row.variation}</td>
            `;
            
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro na compilação do relatório analítico:", error);
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--theme-primary); font-weight: 600;">Falha ao carregar o relatório consolidado da API.</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', loadAdminReports);