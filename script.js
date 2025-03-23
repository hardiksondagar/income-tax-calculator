document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const incomeInput = document.getElementById('income');
    const isSalariedCheckbox = document.getElementById('is-salaried');
    const resultsSection = document.getElementById('results');
    const taxAmountSpan = document.getElementById('tax-amount');
    const taxBreakdownDiv = document.getElementById('tax-breakdown');
    const taxChart = document.getElementById('tax-chart');
    const toggleTaxDetailsBtn = document.getElementById('toggle-tax-details');
    const taxDetailsSection = document.getElementById('tax-details-section');
    const taxSlabDetailsDiv = document.getElementById('tax-slab-details');

    // Tax slabs for FY 2025-26
    const taxSlabs = [
        { min: 0, max: 400000, rate: 0 },
        { min: 400000, max: 800000, rate: 0.05 },
        { min: 800000, max: 1200000, rate: 0.10 },
        { min: 1200000, max: 1600000, rate: 0.15 },
        { min: 1600000, max: 2000000, rate: 0.20 },
        { min: 2000000, max: 2400000, rate: 0.25 },
        { min: 2400000, max: Infinity, rate: 0.30 }
    ];

    // Constants
    const STANDARD_DEDUCTION = 75000;
    const REBATE_LIMIT = 1200000;
    const MAX_REBATE = 60000;
    const LAKH_VALUE = 100000; // 1 lakh = 100,000

    // Debounce function for input fields
    function debounce(func, wait = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Toggle tax details section
    toggleTaxDetailsBtn.addEventListener('click', function() {
        const isHidden = taxDetailsSection.classList.contains('hidden');
        
        if (isHidden) {
            taxDetailsSection.classList.remove('hidden');
            setTimeout(() => taxDetailsSection.classList.add('show'), 10);
            this.textContent = 'Hide Details';
        } else {
            taxDetailsSection.classList.remove('show');
            setTimeout(() => taxDetailsSection.classList.add('hidden'), 300);
            this.textContent = 'Show Details';
        }
    });

    // Set up FAQ toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isHidden = answer.classList.contains('hidden');
            
            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(el => {
                if (el !== answer) {
                    el.classList.add('hidden');
                }
            });
            
            document.querySelectorAll('.faq-question').forEach(el => {
                if (el !== this) {
                    el.classList.remove('active');
                }
            });
            
            // Toggle this answer
            answer.classList.toggle('hidden', !isHidden);
            this.classList.toggle('active', isHidden);
        });
    });

    // Auto-calculate tax on input changes - with debounce for text inputs
    const debouncedCalculate = debounce(calculateTax);
    incomeInput.addEventListener('input', debouncedCalculate);
    
    // Immediate calculate for checkbox changes
    isSalariedCheckbox.addEventListener('change', calculateTax);

    // Initial calculation when page loads
    window.addEventListener('load', function() {
        // Only calculate if there's an income value (to avoid showing 0 on initial load)
        if (incomeInput.value) {
            calculateTax();
        } else {
            // Generate initial chart even without input
            generateTaxChart();
        }
    });

    // Calculate tax function
    function calculateTax() {
        // Get income in lakhs and convert to rupees
        const incomeInLakhs = parseFloat(incomeInput.value) || 0;
        const income = incomeInLakhs * LAKH_VALUE;
        
        // Get standard deduction if applicable
        const isSalaried = isSalariedCheckbox.checked;
        const standardDeduction = isSalaried ? STANDARD_DEDUCTION : 0;
        
        // Calculate taxable income (only standard deduction)
        const taxableIncome = Math.max(0, income - standardDeduction);
        
        // Calculate tax amount
        const taxAmount = calculateTaxAmount(taxableIncome);
        
        // Calculate effective tax rate
        const effectiveRate = income > 0 ? (taxAmount / income * 100).toFixed(2) : 0;
        
        // Display result
        taxAmountSpan.textContent = formatCurrency(taxAmount);
        document.getElementById('effective-rate').textContent = effectiveRate + '% effective rate';
        
        // Show tax breakdown
        generateTaxBreakdown(taxableIncome, standardDeduction, income);
        
        // Generate tax slabs details
        generateTaxSlabDetails(taxableIncome);
        
        // Generate and display tax chart
        generateTaxChart();
        
        // Show results section if income is entered
        if (income > 0) {
            resultsSection.classList.remove('hidden');
        } else {
            resultsSection.classList.add('hidden');
        }
    }
    
    // Calculate tax amount based on taxable income
    function calculateTaxAmount(taxableIncome) {
        let tax = 0;
        
        // Calculate tax based on slabs
        for (const slab of taxSlabs) {
            if (taxableIncome > slab.min) {
                const slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
                tax += slabIncome * slab.rate;
            }
        }
        
        // Apply rebate under Section 87A
        if (taxableIncome <= REBATE_LIMIT) {
            tax = Math.max(0, tax - MAX_REBATE);
        }
        
        // Add health and education cess (4%)
        tax = tax + (tax * 0.04);
        
        return tax;
    }
    
    // Generate tax breakdown
    function generateTaxBreakdown(taxableIncome, standardDeduction, income) {
        // Clear previous breakdown
        taxBreakdownDiv.innerHTML = '';
        
        // Add income and deduction details
        let breakdownHTML = `
            <div class="flex justify-between">
                <span>Total Income:</span>
                <span class="font-medium">${formatCurrency(income)}</span>
            </div>
        `;
        
        // Add standard deduction if applicable
        if (standardDeduction > 0) {
            breakdownHTML += `
                <div class="flex justify-between">
                    <span>Standard Deduction:</span>
                    <span class="font-medium text-green-600">- ${formatCurrency(standardDeduction)}</span>
                </div>
            `;
        }
        
        // Add taxable income
        breakdownHTML += `
            <div class="flex justify-between font-semibold">
                <span>Taxable Income:</span>
                <span>${formatCurrency(taxableIncome)}</span>
            </div>
            <div class="border-t border-gray-200 my-2"></div>
        `;
        
        // Calculate tax for each slab
        let totalTax = 0;
        let appliedRebate = 0;
        
        for (const slab of taxSlabs) {
            if (taxableIncome > slab.min) {
                const slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
                const slabTax = slabIncome * slab.rate;
                
                if (slabTax > 0) {
                    const slabRangeText = slab.max === Infinity 
                        ? `Above ${formatCurrency(slab.min)}`
                        : `${formatCurrency(slab.min)} to ${formatCurrency(slab.max)}`;
                    
                    breakdownHTML += `
                        <div class="flex justify-between text-xs">
                            <span>${slabRangeText} @ ${slab.rate * 100}%:</span>
                            <span>${formatCurrency(slabTax)}</span>
                        </div>
                    `;
                    
                    totalTax += slabTax;
                }
            }
        }
        
        // Add rebate information if applicable
        if (taxableIncome <= REBATE_LIMIT && totalTax > 0) {
            appliedRebate = Math.min(totalTax, MAX_REBATE);
            breakdownHTML += `
                <div class="flex justify-between text-xs text-green-600">
                    <span>Rebate u/s 87A:</span>
                    <span>- ${formatCurrency(appliedRebate)}</span>
                </div>
            `;
            totalTax = Math.max(0, totalTax - appliedRebate);
        }
        
        // Add health and education cess
        const cess = totalTax * 0.04;
        
        if (totalTax > 0) {
            breakdownHTML += `
                <div class="flex justify-between text-xs">
                    <span>Health & Education Cess @ 4%:</span>
                    <span>${formatCurrency(cess)}</span>
                </div>
            `;
        }
        
        // Add total tax
        const finalTax = totalTax + cess;
        breakdownHTML += `
            <div class="border-t border-gray-200 my-2"></div>
            <div class="flex justify-between font-semibold">
                <span>Total Tax Liability:</span>
                <span>${formatCurrency(finalTax)}</span>
            </div>
        `;
        
        // Add effective tax rate
        if (income > 0) {
            const effectiveTaxRate = (finalTax / income * 100).toFixed(2);
            breakdownHTML += `
                <div class="flex justify-between text-xs text-indigo-600 mt-1">
                    <span>Effective Tax Rate:</span>
                    <span>${effectiveTaxRate}%</span>
                </div>
            `;
        }
        
        taxBreakdownDiv.innerHTML = breakdownHTML;
    }
    
    // Generate tax chart - simplified to only use income with standard deduction
    function generateTaxChart() {
        // Generate data points for the chart
        const dataPoints = [];
        const maxIncomeInLakhs = 30; // 30 lakhs
        const step = 1; // 1 lakh
        
        for (let incomeInLakhs = 0; incomeInLakhs <= maxIncomeInLakhs; incomeInLakhs += step) {
            const income = incomeInLakhs * LAKH_VALUE;
            // Use current checkbox state if user has entered income, otherwise assume salaried for default view
            const isSalariedForGraph = incomeInput.value ? isSalariedCheckbox.checked : true;
            const standardDeduction = isSalariedForGraph ? STANDARD_DEDUCTION : 0;
            
            const taxableIncome = Math.max(0, income - standardDeduction);
            const tax = calculateTaxAmount(taxableIncome);
            
            dataPoints.push({
                income: income,
                incomeInLakhs: incomeInLakhs,
                tax: tax,
                taxableIncome: taxableIncome,
                effectiveTaxRate: income > 0 ? (tax / income * 100) : 0
            });
        }
        
        // Create chart
        const ctx = taxChart.getContext('2d');
        
        // Destroy previous chart if exists
        if (window.taxLineChart instanceof Chart) {
            window.taxLineChart.destroy();
        }
        
        // Create new chart
        window.taxLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.map(point => point.incomeInLakhs.toFixed(1) + ' L'),
                datasets: [{
                    label: 'Tax Amount',
                    data: dataPoints.map(point => point.tax),
                    borderColor: 'rgba(79, 70, 229, 1)',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: 'rgba(79, 70, 229, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: 'Inter'
                        },
                        bodyFont: {
                            size: 13,
                            family: 'Inter'
                        },
                        padding: 12,
                        cornerRadius: 6,
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                const index = tooltipItems[0].dataIndex;
                                return `Income: ${formatCurrency(dataPoints[index].income)}`;
                            },
                            label: function(tooltipItem) {
                                return `Tax: ${formatCurrency(tooltipItem.raw)}`;
                            },
                            afterLabel: function(tooltipItem) {
                                const index = tooltipItem.dataIndex;
                                const point = dataPoints[index];
                                let lines = [
                                    `Taxable Income: ${formatCurrency(point.taxableIncome)}`,
                                    `Effective Tax Rate: ${point.effectiveTaxRate.toFixed(2)}%`
                                ];
                                return lines;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Annual Income (₹ in Lakhs)',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Tax Amount (₹)',
                            font: {
                                size: 12
                            }
                        },
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrencyShort(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // FORMAT CURRENCY FUNCTION - Formatting numbers as currency with commas for thousands
    function formatCurrency(amount) {
        // Round to 2 decimal places
        amount = Math.round(amount * 100) / 100;
        
        // Format with comma separators for Indian numbering system
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        return formatter.format(amount);
    }

    // Helper function to format currency in short form
    function formatCurrencyShort(amount) {
        if (amount >= 10000000) {
            return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
        } else if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(1) + 'L';
        } else if (amount >= 1000) {
            return '₹' + (amount / 1000).toFixed(1) + 'K';
        } else {
            return '₹' + amount;
        }
    }

    // Generate detailed tax slab breakdown
    function generateTaxSlabDetails(taxableIncome) {
        let detailsHTML = '<table class="w-full text-sm">';
        detailsHTML += `
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Income Range</th>
                    <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tax Amount</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        let totalSlabTax = 0;
        
        for (const slab of taxSlabs) {
            let slabIncome = 0;
            let slabTax = 0;
            
            if (taxableIncome > slab.min) {
                slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
                slabTax = slabIncome * slab.rate;
                totalSlabTax += slabTax;
            }
            
            const slabRangeText = slab.max === Infinity 
                ? `Above ${formatCurrency(slab.min)}`
                : `${formatCurrency(slab.min)} to ${formatCurrency(slab.max)}`;
            
            const activeClass = (taxableIncome > slab.min && taxableIncome <= slab.max) ? 'bg-indigo-50' : '';
            
            detailsHTML += `
                <tr class="${activeClass}">
                    <td class="px-3 py-2 whitespace-nowrap">${slabRangeText}</td>
                    <td class="px-3 py-2 text-center">${(slab.rate * 100)}%</td>
                    <td class="px-3 py-2 text-right">${formatCurrency(slabTax)}</td>
                </tr>
            `;
        }
        
        // Apply rebate under Section 87A
        let rebate = 0;
        if (taxableIncome <= REBATE_LIMIT && totalSlabTax > 0) {
            rebate = Math.min(totalSlabTax, MAX_REBATE);
            totalSlabTax = Math.max(0, totalSlabTax - rebate);
            
            detailsHTML += `
                <tr class="bg-green-50">
                    <td class="px-3 py-2" colspan="2">Rebate u/s 87A (for income up to ₹12L)</td>
                    <td class="px-3 py-2 text-right text-green-600">- ${formatCurrency(rebate)}</td>
                </tr>
            `;
        }
        
        // Add health and education cess
        const cess = totalSlabTax * 0.04;
        detailsHTML += `
            <tr>
                <td class="px-3 py-2" colspan="2">Health & Education Cess @ 4%</td>
                <td class="px-3 py-2 text-right">${formatCurrency(cess)}</td>
            </tr>
        `;
        
        // Total tax liability
        const totalTax = totalSlabTax + cess;
        detailsHTML += `
            </tbody>
            <tfoot>
                <tr class="bg-gray-50">
                    <td class="px-3 py-2 font-medium" colspan="2">Total Tax Liability</td>
                    <td class="px-3 py-2 text-right font-medium">${formatCurrency(totalTax)}</td>
                </tr>
            </tfoot>
        `;
        
        detailsHTML += '</table>';
        
        taxSlabDetailsDiv.innerHTML = detailsHTML;
    }
}); 