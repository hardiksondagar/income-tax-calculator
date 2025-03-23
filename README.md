# Income Tax Calculator (FY 2025-26)

A modern, responsive income tax calculator for the new tax regime in India for the financial year 2025-26 (assessment year 2026-27).

## Features

- **Simple & Modern UI**: Clean, intuitive interface with smooth animations and responsive design.
- **Tax Calculation**: Calculate tax liability based on the new tax regime slabs.
- **Income in Lakhs**: Input your income in lakhs for easier entry of large numbers.
- **Standard Deduction**: Automatic ₹75,000 deduction for salaried employees.
- **Visual Representation**: Interactive graph showing tax liability vs. income.
- **Detailed Breakdown**: Itemized breakdown of tax calculations across different slabs.
- **Rebate Consideration**: Automatic application of rebate under Section 87A (up to ₹60,000).
- **Financial Summary**: Combined view of tax liability and monthly take-home salary.
- **Example Calculations**: Quick reference tax examples at different income levels.
- **Interactive FAQ Section**: Common questions about income tax calculation.
- **Responsive Design**: Works on mobile, tablet, and desktop devices.

## Tax Slabs (FY 2025-26)

| Income Range (₹) | Tax Rate |
|------------------|----------|
| 0 - 4,00,000 | 0% |
| 4,00,001 - 8,00,000 | 5% |
| 8,00,001 - 12,00,000 | 10% |
| 12,00,001 - 16,00,000 | 15% |
| 16,00,001 - 20,00,000 | 20% |
| 20,00,001 - 24,00,000 | 25% |
| Above 24,00,000 | 30% |

## Other Considerations

- **Standard Deduction**: ₹75,000 for salaried individuals.
- **Rebate**: Up to ₹60,000 under Section 87A if taxable income is less than or equal to ₹12,00,000.
- **Health & Education Cess**: 4% on the calculated tax amount.

## Available Deductions Under New Regime

- **Standard Deduction**: Automatic ₹75,000 for salaried individuals.

*Note: This simplified calculator currently only implements the standard deduction for salaried employees. The full version of the new tax regime allows for additional specific deductions which may be added in future updates.*

## How to Use

1. Enter your annual income in lakhs (e.g., enter 12.75 for ₹12,75,000).
2. Check/uncheck the salaried employee option (applies ₹75,000 standard deduction).
3. Click "Calculate Tax" to view your tax liability and breakdown.
4. Review the visual graph to understand how tax changes with income.
5. Explore example calculations and tax slabs for reference.
6. Check the FAQ section for answers to common questions.

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS framework)
- JavaScript (Vanilla JS)
- Chart.js for data visualization
- Google Fonts (Inter)

## Disclaimer

This calculator is for informational purposes only and should not be considered as tax advice. Tax laws are subject to change, and you should consult a tax professional for specific advice. 

## Planned Features

- [x] Income slider with visual feedback alongside numerical input
- [ ] Net income visualization - pie chart showing tax vs take-home amount
- [x] Monthly take-home calculator showing post-tax monthly salary
- [ ] Old vs new tax regime comparison tool
- [ ] Tax saving recommendations based on income bracket
- [ ] Dark mode toggle for better accessibility
- [ ] Salary structure optimizer - suggest optimal CTC breakdown
- [ ] Save or share calculation results (via URL parameters or export)
- [ ] Local storage to remember user's last calculation
- [ ] Progressive disclosure - hide advanced features until needed
- [ ] Mobile-optimized compact view with simplified controls 