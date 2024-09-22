document.addEventListener('DOMContentLoaded', function() {
    let trades = [];

    const tradesBody = document.getElementById('tradesBody');
    const addTradeBtn = document.getElementById('addTradeBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const totalCapitalInput = document.getElementById('totalCapital');
    const riskPercentageInput = document.getElementById('riskPercentage');

    function renderTrades() {
        tradesBody.innerHTML = '';
        trades.forEach((trade, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${trade.name}" class="trade-name" data-index="${index}"></td>
                <td><input type="number" value="${trade.entry_price}" class="entry-price" data-index="${index}"></td>
                <td><input type="number" value="${trade.stop_loss}" class="stop-loss" data-index="${index}"></td>
                <td>
                    <button class="deleteTrade" data-index="${index}">Delete</button>
                </td>
            `;
            tradesBody.appendChild(row);
        });
    }

    addTradeBtn.addEventListener('click', () => {
        trades.push({
            name: `Trade ${trades.length + 1}`,
            entry_price: 0,
            stop_loss: 0
        });
        renderTrades();
    });

    tradesBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('deleteTrade')) {
            const index = e.target.getAttribute('data-index');
            trades.splice(index, 1);
            renderTrades();
        }
    });

    tradesBody.addEventListener('change', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('trade-name')) {
            trades[index].name = e.target.value;
        }
        if (e.target.classList.contains('entry-price')) {
            trades[index].entry_price = parseFloat(e.target.value);
        }
        if (e.target.classList.contains('stop-loss')) {
            trades[index].stop_loss = parseFloat(e.target.value);
        }
    });

    calculateBtn.addEventListener('click', () => {
        const totalCapital = parseFloat(totalCapitalInput.value);
        const totalRiskPercent = parseFloat(riskPercentageInput.value);
        const totalRisk = totalCapital * (totalRiskPercent / 100);
        const numberOfTrades = trades.length;
        const riskPerTrade = totalRisk / numberOfTrades;
        let resultHTML = '';

        trades.forEach(trade => {
            const riskPerShare = trade.entry_price - trade.stop_loss;
            if (riskPerShare > 0) {
                const positionSize = Math.floor(riskPerTrade / riskPerShare);
                const tradeLoss = positionSize * riskPerShare; // Total loss in rupees for this trade
                resultHTML += `
                    <p>${trade.name}: Buy ${positionSize} shares at ₹${trade.entry_price} per share.</p>
                    <p>Potential Loss for ${trade.name}: ₹${tradeLoss.toFixed(2)}</p>
                `;
            } else {
                resultHTML += `<p>${trade.name}: Invalid Stop Loss or Entry Price!</p>`;
            }
        });

        resultsDiv.innerHTML = resultHTML;
    });

    renderTrades();
});
