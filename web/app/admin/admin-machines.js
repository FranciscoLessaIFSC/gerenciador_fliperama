const API_BASE_URL = "http://localhost:3000";

// Renderiza o gráfico do Chart.js com os estilos escuros do tema administrativo
function renderMachinesChart(chartData) {
const existingChart = Chart.getChart("dailyMachines"); 
  
  if (existingChart) {
    existingChart.destroy();
  }
    const ctx = document.getElementById('dailyMachines').getContext('2d');
    
    const labels = chartData.map(d => d.hour);
    const values = chartData.map(d => d.count);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Partidas iniciadas',
                data: values,
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8fa0dd' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8fa0dd' } }
            }
        }
    });
}

async function loadMachinesDashboard() {
    const tbody = document.getElementById('admin-machines-rows');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Carregando status das máquinas...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/machines/admin/dashboard`);
        if (!response.ok) throw new Error('Não foi possível obter os dados do servidor.');

        const data = await response.json();

        // 1. Atualiza o KPI de Jogos executados hoje
        document.getElementById('total-games-today').textContent = data.totalGamesToday.toLocaleString('pt-BR');

        // 2. Monta as linhas da tabela de status
        tbody.innerHTML = '';
        if (data.machines.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhuma máquina registrada no sistema.</td></tr>`;
            return;
        }

        data.machines.forEach(mac => {
            const tr = document.createElement('tr');
            
            // Adiciona classe de status ou cor inline baseada no estado online/manutenção
            const statusStyle = mac.status === 'Online' 
                ? 'color: #00ff88; font-weight: 600;' 
                : 'color: #ff5252; font-weight: 600;';

            tr.innerHTML = `
                <td>${mac.name}</td>
                <td>${mac.location}</td>
                <td style="${statusStyle}">${mac.status}</td>
                <td>${mac.lastUseDate}</td>
                <td>${mac.lastUseTime}</td>
                <td style="font-family: monospace;">${mac.revenue}</td>
            `;
            tbody.appendChild(tr);
        });

        // 3. Desenha o gráfico de comportamento temporal
        renderMachinesChart(data.chartData);

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Erro na conexão com a API.</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', loadMachinesDashboard);