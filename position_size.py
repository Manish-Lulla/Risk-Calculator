def calculate_position_sizes(capital, total_risk_percent, trades):
    total_risk = capital * (total_risk_percent / 100)  # Calculate total risk (e.g., 10k)
    total_loss = 0  # To keep track of total loss
    positions = []  # List to store the positions for each trade
    
    # Loop through each trade and calculate the position size
    for trade in trades:
        entry_price = trade['entry_price']
        stop_loss = trade['stop_loss']
        
        # Risk per share is the difference between entry price and stop loss
        risk_per_share = entry_price - stop_loss
        
        if risk_per_share <= 0:
            raise ValueError(f"Stop loss should be less than the entry price for trade {trade}")
        
        # Allocate an equal portion of the total risk to each trade
        risk_for_this_trade = total_risk / len(trades)  # Equal split of risk for all trades
        
        # Calculate number of shares you can buy based on the risk for this trade
        position_size = risk_for_this_trade / risk_per_share
        
        # Calculate the amount to invest in this trade
        investment = position_size * entry_price
        
        # Store the results
        positions.append({
            'trade': trade['name'],
            'position_size': position_size,
            'investment': investment,
            'risk': risk_for_this_trade
        })
        
        total_loss += risk_for_this_trade  # Add this trade's risk to the total risk used
    
    return positions


# Example usage:
capital = 500000  # Total capital
total_risk_percent = 2  # 2% of capital is risked
trades = [
    {'name': 'Trade1', 'entry_price': 470, 'stop_loss': 455.4},
    {'name': 'Trade2', 'entry_price': 1846, 'stop_loss': 1817.9},
    {'name': 'Trade3', 'entry_price': 1758.15, 'stop_loss': 1723}
]

positions = calculate_position_sizes(capital, total_risk_percent, trades)
for position in positions:
    print(position)
