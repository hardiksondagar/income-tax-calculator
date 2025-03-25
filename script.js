document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const incomeInput = document.getElementById('income');
    const incomeSlider = document.getElementById('income-slider');
    const sliderTooltip = document.getElementById('slider-tooltip');
    const tooltipValue = document.getElementById('tooltip-value');
    const isSalariedCheckbox = document.getElementById('is-salaried');
    const resultsSection = document.getElementById('results');
    const taxAmountSpan = document.getElementById('tax-amount');
    const taxBreakdownDiv = document.getElementById('tax-breakdown');
    const taxChart = document.getElementById('tax-chart');
    const toggleTaxDetailsBtn = document.getElementById('toggle-tax-details');
    const taxDetailsSection = document.getElementById('tax-details-section');
    const taxSlabDetailsDiv = document.getElementById('tax-slab-details');
    const exampleCardsContainer = document.getElementById('example-cards-container');
    const monthlySalarySpan = document.getElementById('monthly-salary');
    const annualTakeHomeSpan = document.getElementById('annual-take-home');
    
    // Tax regime selector elements
    const financialYearSelect = document.getElementById('financial-year');
    const taxRegimeSelect = document.getElementById('tax-regime');
    const standardDeductionText = document.getElementById('standard-deduction-text');
    const regimeTypeText = document.getElementById('regime-type-text');
    const taxSlabsTable = document.getElementById('tax-slabs-table');
    const taxSlabsRegimeYear = document.getElementById('tax-slabs-regime-year');
    const newRegimeDeductions = document.getElementById('new-regime-deductions');
    const oldRegimeDeductions = document.getElementById('old-regime-deductions');
    
    // Current regime and financial year state
    let currentFinancialYear = financialYearSelect.value;
    let currentRegime = taxRegimeSelect.value;
    
    // Deduction elements
    const toggleDeductionsBtn = document.getElementById('toggle-deductions-btn');
    const deductionsSection = document.getElementById('deductions-section');
    const hasFamilyPensionCheckbox = document.getElementById('has-family-pension');
    const familyPensionAmountWrapper = document.getElementById('family-pension-amount-wrapper');
    const familyPensionAmountInput = document.getElementById('family-pension-amount');
    const hasEducationLoanCheckbox = document.getElementById('has-education-loan');
    const educationLoanAmountWrapper = document.getElementById('education-loan-amount-wrapper');
    const educationLoanAmountInput = document.getElementById('education-loan-amount');
    const hasEmployerContributionCheckbox = document.getElementById('has-employer-contribution');
    const employerContributionWrapper = document.getElementById('employer-contribution-wrapper');
    const employerContributionAmountInput = document.getElementById('employer-contribution-amount');
    
    // Old regime deduction elements
    const hasSection80CCheckbox = document.getElementById('has-section-80c');
    const section80CAmountWrapper = document.getElementById('section-80c-amount-wrapper');
    const section80CAmountInput = document.getElementById('section-80c-amount');
    const hasSection80DCheckbox = document.getElementById('has-section-80d');
    const section80DAmountWrapper = document.getElementById('section-80d-amount-wrapper');
    const section80DSelfAmountInput = document.getElementById('section-80d-self-amount');
    const section80DParentsAmountInput = document.getElementById('section-80d-parents-amount');
    const hasHomeLoanInterestCheckbox = document.getElementById('has-home-loan-interest');
    const homeLoanInterestWrapper = document.getElementById('home-loan-interest-wrapper');
    const homeLoanInterestAmountInput = document.getElementById('home-loan-interest-amount');

    // Example income values in lakhs
    const exampleIncomes = [
        { value: 12 },
        { value: 12.75 },
        { value: 15 },
        { value: 20 },
        { value: 25 },
        { value: 30 },
        { value: 35 },
        { value: 40 },
        { value: 45 },
        { value: 50 },
        { value: 75 },
        { value: 100 }
    ];

    // Tax regime data for different financial years
    const taxRegimeData = {
        "2025-26": {
            "new": {
                "slabs": [
                    { min: 0, max: 400000, rate: 0 },
                    { min: 400000, max: 800000, rate: 0.05 },
                    { min: 800000, max: 1200000, rate: 0.10 },
                    { min: 1200000, max: 1600000, rate: 0.15 },
                    { min: 1600000, max: 2000000, rate: 0.20 },
                    { min: 2000000, max: 2400000, rate: 0.25 },
                    { min: 2400000, max: Infinity, rate: 0.30 }
                ],
                "deductions": {
                    "standard_deduction": 75000,
                    "family_pension": 25000,
                    "education_loan": true,
                    "employer_contribution": 0.1
                },
                "rebate": {
                    "limit": 1200000,
                    "max": 60000
                }
            },
            "old": {
                "slabs": [
                    { min: 0, max: 250000, rate: 0 },
                    { min: 250000, max: 500000, rate: 0.05 },
                    { min: 500000, max: 1000000, rate: 0.20 },
                    { min: 1000000, max: Infinity, rate: 0.30 }
                ],
                "deductions": {
                    "standard_deduction": 50000,
                    "section_80c": 150000,
                    "section_80d_self": 25000,
                    "section_80d_parents": 50000,
                    "home_loan_interest": 200000
                },
                "rebate": {
                    "limit": 500000,
                    "max": 12500
                }
            }
        },
        "2024-25": {
            "new": {
                "slabs": [
                    { min: 0, max: 300000, rate: 0 },
                    { min: 300000, max: 600000, rate: 0.05 },
                    { min: 600000, max: 900000, rate: 0.10 },
                    { min: 900000, max: 1200000, rate: 0.15 },
                    { min: 1200000, max: 1500000, rate: 0.20 },
                    { min: 1500000, max: 1800000, rate: 0.25 },
                    { min: 1800000, max: Infinity, rate: 0.30 }
                ],
                "deductions": {
                    "standard_deduction": 50000,
                    "family_pension": 25000,
                    "education_loan": true,
                    "employer_contribution": 0.1
                },
                "rebate": {
                    "limit": 700000,
                    "max": 25000
                }
            },
            "old": {
                "slabs": [
                    { min: 0, max: 250000, rate: 0 },
                    { min: 250000, max: 500000, rate: 0.05 },
                    { min: 500000, max: 1000000, rate: 0.20 },
                    { min: 1000000, max: Infinity, rate: 0.30 }
                ],
                "deductions": {
                    "standard_deduction": 50000,
                    "section_80c": 150000,
                    "section_80d_self": 25000,
                    "section_80d_parents": 50000,
                    "home_loan_interest": 200000
                },
                "rebate": {
                    "limit": 500000,
                    "max": 12500
                }
            }
        }
    };

    // Constants
    const LAKH_VALUE = 100000; // 1 lakh = 100,000
    const MAX_FAMILY_PENSION_DEDUCTION = 25000; // Max deduction for family pension
    const STANDARD_DEDUCTION = 75000;
    const REBATE_LIMIT = 1200000;
    const MAX_REBATE = 60000;
    const EMPLOYER_CONTRIBUTION_LIMIT_PERCENTAGE = 0.1; // 10% of salary limit for employer contribution

    // Debounce function for input fields
    function debounce(func, wait = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Generate and update example tax preview cards
    function updateExampleCards() {
        // Clear previous cards
        exampleCardsContainer.innerHTML = '';
        
        // Get current tax regime data
        const regimeData = getCurrentTaxRegimeData();
        
        // Get salaried status
        const isSalaried = isSalariedCheckbox.checked;
        
        // Generate cards for each example income
        exampleIncomes.forEach(income => {
            // Calculate taxable income and tax
            const incomeInRupees = income.value * LAKH_VALUE;
            
            // For example cards, only consider standard deduction to keep it simple
            const standardDeduction = isSalaried ? regimeData.deductions.standard_deduction : 0;
            const taxableIncome = Math.max(0, incomeInRupees - standardDeduction);
            const tax = calculateTaxAmount(taxableIncome);
            const effectiveRate = incomeInRupees > 0 ? (tax / incomeInRupees * 100).toFixed(1) : 0;
            
            // Calculate monthly take-home
            const annualTakeHome = incomeInRupees - tax;
            const monthlyTakeHome = annualTakeHome / 12;
            
            // Determine card style class
            let cardClass = 'preview-card';
            if (tax === 0) {
                cardClass += ' zero-tax';
            } else if (income.value >= 30) {
                cardClass += ' high-tax';
            }
            
            // Create card element
            const card = document.createElement('div');
            card.className = cardClass;
            card.innerHTML = `
                <div class="income">${formatAmount(income.value)}</div>
                <div class="tax">${formatCurrency(tax)}</div>
                <div class="percentage">${effectiveRate}% of income</div>
                <div class="monthly-salary text-sm text-green-600">${formatCurrencyShort(monthlyTakeHome)}/month</div>
            `;
            
            // Add click event to set income to this example
            card.addEventListener('click', function() {
                incomeInput.value = income.value;
                incomeSlider.value = Math.min(income.value, parseFloat(incomeSlider.max));
                updateSliderValue(incomeSlider.value);
                calculateTax();
            });
            
            exampleCardsContainer.appendChild(card);
        });
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

    // Toggle deductions section
    toggleDeductionsBtn.addEventListener('click', function() {
        const isHidden = deductionsSection.classList.contains('hidden');
        
        if (isHidden) {
            deductionsSection.classList.remove('hidden');
            this.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Hide Additional Deductions
            `;
        } else {
            deductionsSection.classList.add('hidden');
            this.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Show Additional Deductions
            `;
        }
    });
    
    // Toggle family pension amount input
    hasFamilyPensionCheckbox.addEventListener('change', function() {
        familyPensionAmountWrapper.classList.toggle('hidden', !this.checked);
        if (this.checked && !familyPensionAmountInput.value) {
            familyPensionAmountInput.value = '100000'; // Default value
        }
        calculateTax();
    });
    
    // Toggle education loan amount input
    hasEducationLoanCheckbox.addEventListener('change', function() {
        educationLoanAmountWrapper.classList.toggle('hidden', !this.checked);
        if (this.checked && !educationLoanAmountInput.value) {
            educationLoanAmountInput.value = '50000'; // Default value
        }
        calculateTax();
    });
    
    // Toggle employer contribution amount input
    hasEmployerContributionCheckbox.addEventListener('change', function() {
        employerContributionWrapper.classList.toggle('hidden', !this.checked);
        if (this.checked && !employerContributionAmountInput.value) {
            employerContributionAmountInput.value = '75000'; // Default value
        }
        calculateTax();
    });
    
    // Add input event listeners to deduction amount inputs
    familyPensionAmountInput.addEventListener('input', debounce(calculateTax));
    educationLoanAmountInput.addEventListener('input', debounce(calculateTax));
    employerContributionAmountInput.addEventListener('input', debounce(calculateTax));

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

    // Slider functionality
    function initSlider() {
        // Set initial slider value if income input has a value
        if (incomeInput.value) {
            incomeSlider.value = parseFloat(incomeInput.value);
            updateSliderValue(incomeSlider.value);
        }

        // Update slider when income input changes
        incomeInput.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            // Cap at the slider's max value
            const cappedValue = Math.min(value, parseFloat(incomeSlider.max));
            incomeSlider.value = cappedValue;
            updateSliderValue(cappedValue);
        });

        // Update income input when slider changes
        incomeSlider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            incomeInput.value = value;
            updateSliderValue(value);
        });

        // Show tooltip when dragging slider
        incomeSlider.addEventListener('mousedown', function() {
            updateTooltipPosition();
            sliderTooltip.classList.add('visible');
        });

        incomeSlider.addEventListener('mousemove', function(e) {
            if (e.buttons === 1) { // Only if mouse button is pressed
                updateTooltipPosition();
            }
        });

        incomeSlider.addEventListener('touchstart', function() {
            updateTooltipPosition();
            sliderTooltip.classList.add('visible');
        });

        incomeSlider.addEventListener('touchmove', function() {
            updateTooltipPosition();
        });

        // Hide tooltip when releasing mouse
        window.addEventListener('mouseup', function() {
            sliderTooltip.classList.remove('visible');
        });

        window.addEventListener('touchend', function() {
            sliderTooltip.classList.remove('visible');
        });
    }

    // Update the slider value display
    function updateSliderValue(value) {
        tooltipValue.textContent = formatAmount(value);
    }

    // Update tooltip position
    function updateTooltipPosition() {
        const slider = incomeSlider;
        const percent = (slider.value - slider.min) / (slider.max - slider.min);
        const sliderWidth = slider.offsetWidth;
        const thumbPosition = percent * sliderWidth;
        
        // Position tooltip above the thumb
        sliderTooltip.style.left = thumbPosition + 'px';
    }

    // Auto-calculate tax on input changes - with debounce for text inputs
    const debouncedCalculate = debounce(function() {
        calculateTax();
        // Scroll to results if there's a valid income
        if (parseFloat(incomeInput.value) > 0) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    incomeInput.addEventListener('input', debouncedCalculate);
    
    // Immediate calculate for checkbox changes and update example cards
    isSalariedCheckbox.addEventListener('change', function() {
        calculateTax();
        updateExampleCards();
        // Scroll to results if there's a valid income
        if (parseFloat(incomeInput.value) > 0) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Income slider handling should also trigger calculation
    incomeSlider.addEventListener('change', function() {
        debouncedCalculate();
    });

    // Initial calculation when page loads
    window.addEventListener('load', function() {
        // Only calculate if there's an income value (to avoid showing 0 on initial load)
        if (incomeInput.value) {
            calculateTax();
        } else {
            // Generate the tax chart anyway for the initial view
            generateTaxChart();
        }
    });

    // Load calculation from URL parameters
    function loadCalculationFromURL() {
        if (window.location.search) {
            const params = new URLSearchParams(window.location.search);
            
            // Load financial year and regime if set
            if (params.has('fy')) {
                const fy = params.get('fy');
                if (taxRegimeData.hasOwnProperty(fy)) {
                    currentFinancialYear = fy;
                    financialYearSelect.value = fy;
                }
            }
            
            if (params.has('regime')) {
                const regime = params.get('regime');
                if (regime === 'new' || regime === 'old') {
                    currentRegime = regime;
                    taxRegimeSelect.value = regime;
                }
            }
            
            // Update UI based on regime and year
            updateUIForRegime();
            
            // Load income and salaried status
            if (params.has('income')) {
                incomeInput.value = params.get('income');
                incomeSlider.value = Math.min(parseFloat(params.get('income')), parseFloat(incomeSlider.max));
                updateSliderValue(incomeSlider.value);
            }
            
            if (params.has('salaried')) {
                isSalariedCheckbox.checked = params.get('salaried') === 'true';
            }
            
            // Load deduction parameters based on regime
            if (currentRegime === 'new') {
                // Load family pension parameters
                if (params.has('fp') && params.get('fp') === 'true') {
                    hasFamilyPensionCheckbox.checked = true;
                    familyPensionAmountWrapper.classList.remove('hidden');
                    
                    if (params.has('fpAmount')) {
                        familyPensionAmountInput.value = params.get('fpAmount');
                    }
                }
                
                // Load education loan parameters
                if (params.has('el') && params.get('el') === 'true') {
                    hasEducationLoanCheckbox.checked = true;
                    educationLoanAmountWrapper.classList.remove('hidden');
                    
                    if (params.has('elAmount')) {
                        educationLoanAmountInput.value = params.get('elAmount');
                    }
                }
                
                // Load employer contribution parameters
                if (params.has('ec') && params.get('ec') === 'true') {
                    hasEmployerContributionCheckbox.checked = true;
                    employerContributionWrapper.classList.remove('hidden');
                    
                    if (params.has('ecAmount')) {
                        employerContributionAmountInput.value = params.get('ecAmount');
                    }
                }
            } else {
                // Load Section 80C parameters
                if (params.has('80c') && params.get('80c') === 'true') {
                    hasSection80CCheckbox.checked = true;
                    section80CAmountWrapper.classList.remove('hidden');
                    
                    if (params.has('80cAmount')) {
                        section80CAmountInput.value = params.get('80cAmount');
                    }
                }
                
                // Load Section 80D parameters
                if (params.has('80d') && params.get('80d') === 'true') {
                    hasSection80DCheckbox.checked = true;
                    section80DAmountWrapper.classList.remove('hidden');
                    
                    if (params.has('80dSelf')) {
                        section80DSelfAmountInput.value = params.get('80dSelf');
                    }
                    
                    if (params.has('80dParents')) {
                        section80DParentsAmountInput.value = params.get('80dParents');
                    }
                }
                
                // Load home loan interest parameters
                if (params.has('hli') && params.get('hli') === 'true') {
                    hasHomeLoanInterestCheckbox.checked = true;
                    homeLoanInterestWrapper.classList.remove('hidden');
                    
                    if (params.has('hliAmount')) {
                        homeLoanInterestAmountInput.value = params.get('hliAmount');
                    }
                }
            }
            
            // Show deductions section if any deduction is checked
            if (
                hasFamilyPensionCheckbox.checked || 
                hasEducationLoanCheckbox.checked || 
                hasEmployerContributionCheckbox.checked ||
                hasSection80CCheckbox.checked ||
                hasSection80DCheckbox.checked ||
                hasHomeLoanInterestCheckbox.checked
            ) {
                deductionsSection.classList.remove('hidden');
            }
            
            // Calculate tax with loaded parameters
            calculateTax();
        }
    }
    
    // Update URL with calculation parameters
    function updateURLWithCalculation(income, isSalaried, taxAmount) {
        // Create URL parameters
        const params = new URLSearchParams();
        params.set('income', income);
        params.set('salaried', isSalaried);
        params.set('tax', Math.round(taxAmount));
        params.set('fy', currentFinancialYear);
        params.set('regime', currentRegime);
        
        // Add deduction parameters based on regime
        if (currentRegime === 'new') {
            if (hasFamilyPensionCheckbox.checked) {
                params.set('fp', 'true');
                params.set('fpAmount', familyPensionAmountInput.value);
            }
            
            if (hasEducationLoanCheckbox.checked) {
                params.set('el', 'true');
                params.set('elAmount', educationLoanAmountInput.value);
            }
            
            if (hasEmployerContributionCheckbox.checked) {
                params.set('ec', 'true');
                params.set('ecAmount', employerContributionAmountInput.value);
            }
        } else {
            if (hasSection80CCheckbox.checked) {
                params.set('80c', 'true');
                params.set('80cAmount', section80CAmountInput.value);
            }
            
            if (hasSection80DCheckbox.checked) {
                params.set('80d', 'true');
                params.set('80dSelf', section80DSelfAmountInput.value);
                params.set('80dParents', section80DParentsAmountInput.value);
            }
            
            if (hasHomeLoanInterestCheckbox.checked) {
                params.set('hli', 'true');
                params.set('hliAmount', homeLoanInterestAmountInput.value);
            }
        }
        
        // Update URL without reloading the page
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.replaceState(null, '', newUrl);
    }

    // Calculate tax function
    function calculateTax() {
        // Get income in lakhs and convert to rupees
        const incomeInLakhs = parseFloat(incomeInput.value) || 0;
        const income = incomeInLakhs * LAKH_VALUE;
        
        // Update slider if it doesn't match (e.g., if set programmatically)
        if (incomeSlider.value != incomeInLakhs) {
            incomeSlider.value = Math.min(incomeInLakhs, parseFloat(incomeSlider.max));
            updateSliderValue(incomeSlider.value);
        }
        
        // Get current tax regime data
        const regimeData = getCurrentTaxRegimeData();
        
        // Get standard deduction if applicable
        const isSalaried = isSalariedCheckbox.checked;
        const standardDeduction = isSalaried ? regimeData.deductions.standard_deduction : 0;
        
        // Get additional deductions based on regime
        let totalDeductions = standardDeduction;
        
        if (currentRegime === 'new') {
            // Family Pension Deduction (up to ₹25,000 or 1/3 of pension, whichever is less)
            let familyPensionDeduction = 0;
            if (hasFamilyPensionCheckbox.checked) {
                const familyPensionAmount = parseFloat(familyPensionAmountInput.value) || 0;
                const oneThirdPension = familyPensionAmount / 3;
                familyPensionDeduction = Math.min(oneThirdPension, regimeData.deductions.family_pension);
                totalDeductions += familyPensionDeduction;
            }
            
            // Education Loan Interest Deduction (Section 80E)
            let educationLoanDeduction = 0;
            if (hasEducationLoanCheckbox.checked && regimeData.deductions.education_loan) {
                educationLoanDeduction = parseFloat(educationLoanAmountInput.value) || 0;
                totalDeductions += educationLoanDeduction;
            }
            
            // Employer Contribution Deduction (up to 10% of salary)
            let employerContributionDeduction = 0;
            if (hasEmployerContributionCheckbox.checked) {
                const contributionAmount = parseFloat(employerContributionAmountInput.value) || 0;
                const maxContribution = income * regimeData.deductions.employer_contribution;
                employerContributionDeduction = Math.min(contributionAmount, maxContribution);
                totalDeductions += employerContributionDeduction;
            }
            
            // Calculate taxable income (with all applicable deductions)
            const taxableIncome = Math.max(0, income - totalDeductions);
            
            // Calculate tax amount
            const taxAmount = calculateTaxAmount(taxableIncome);
            
            // Display result and breakdown with new regime deductions
            updateTaxDisplay(taxAmount, income, taxableIncome, standardDeduction, {
                familyPension: familyPensionDeduction,
                educationLoan: educationLoanDeduction,
                employerContribution: employerContributionDeduction
            });
        } else {
            // Old Regime deductions
            
            // Section 80C deductions
            let section80CDeduction = 0;
            if (hasSection80CCheckbox.checked) {
                section80CDeduction = Math.min(
                    parseFloat(section80CAmountInput.value) || 0,
                    regimeData.deductions.section_80c
                );
                totalDeductions += section80CDeduction;
            }
            
            // Section 80D deductions (health insurance)
            let section80DSelfDeduction = 0;
            let section80DParentsDeduction = 0;
            if (hasSection80DCheckbox.checked) {
                section80DSelfDeduction = Math.min(
                    parseFloat(section80DSelfAmountInput.value) || 0,
                    regimeData.deductions.section_80d_self
                );
                
                section80DParentsDeduction = Math.min(
                    parseFloat(section80DParentsAmountInput.value) || 0,
                    regimeData.deductions.section_80d_parents
                );
                
                totalDeductions += section80DSelfDeduction + section80DParentsDeduction;
            }
            
            // Home loan interest deduction
            let homeLoanInterestDeduction = 0;
            if (hasHomeLoanInterestCheckbox.checked) {
                homeLoanInterestDeduction = Math.min(
                    parseFloat(homeLoanInterestAmountInput.value) || 0,
                    regimeData.deductions.home_loan_interest
                );
                totalDeductions += homeLoanInterestDeduction;
            }
            
            // Calculate taxable income (with all applicable deductions)
            const taxableIncome = Math.max(0, income - totalDeductions);
            
            // Calculate tax amount
            const taxAmount = calculateTaxAmount(taxableIncome);
            
            // Display result and breakdown with old regime deductions
            updateTaxDisplay(taxAmount, income, taxableIncome, standardDeduction, {
                section80C: section80CDeduction,
                section80DSelf: section80DSelfDeduction,
                section80DParents: section80DParentsDeduction,
                homeLoanInterest: homeLoanInterestDeduction
            });
        }
    }
    
    // Helper function to update tax display
    function updateTaxDisplay(taxAmount, income, taxableIncome, standardDeduction, deductions) {
        // Calculate effective tax rate
        const effectiveRate = income > 0 ? (taxAmount / income * 100).toFixed(2) : 0;
        
        // Calculate annual and monthly take-home salary
        const annualTakeHome = income - taxAmount;
        const monthlyTakeHome = annualTakeHome / 12;
        
        // Display result
        taxAmountSpan.textContent = formatCurrency(taxAmount);
        document.getElementById('effective-rate').textContent = effectiveRate + '% effective rate';
        
        // Display monthly and annual take-home salary
        monthlySalarySpan.textContent = formatCurrency(monthlyTakeHome);
        annualTakeHomeSpan.textContent = formatCurrency(annualTakeHome) + ' annually';
        
        // Show tax breakdown
        generateTaxBreakdown(taxableIncome, standardDeduction, income, deductions);
        
        // Generate tax slabs details
        generateTaxSlabDetails(taxableIncome);
        
        // Generate and display tax chart
        generateTaxChart();
        
        // Show results section if income is entered
        if (income > 0) {
            resultsSection.classList.remove('hidden');
            
            // Update URL with calculation parameters
            updateURLWithCalculation(parseFloat(incomeInput.value), isSalariedCheckbox.checked, taxAmount);
            
            // Add share button if not already present
            if (!document.getElementById('share-result-btn')) {
                addShareButton();
            }
        } else {
            resultsSection.classList.add('hidden');
        }
    }
    
    // Calculate tax amount based on taxable income
    function calculateTaxAmount(taxableIncome) {
        // Get current tax regime data
        const regimeData = getCurrentTaxRegimeData();
        const slabs = regimeData.slabs;
        const rebate = regimeData.rebate;
        
        let tax = 0;
        
        // Calculate tax based on slabs
        for (const slab of slabs) {
            if (taxableIncome > slab.min) {
                const slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
                tax += slabIncome * slab.rate;
            }
        }
        
        // Apply rebate under Section 87A
        if (taxableIncome <= rebate.limit) {
            tax = Math.max(0, tax - rebate.max);
        }
        
        // Add health and education cess (4%)
        tax = tax + (tax * 0.04);
        
        return tax;
    }
    
    // Generate tax breakdown
    function generateTaxBreakdown(taxableIncome, standardDeduction, income, deductions) {
        // Clear previous breakdown
        taxBreakdownDiv.innerHTML = '';
        
        // Add income and deduction details
        let breakdownHTML = `
            <div class="flex justify-between font-semibold mb-2">
                <span>Income & Deductions</span>
            </div>
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
                    <span class="text-green-600">- ${formatCurrency(standardDeduction)}</span>
                </div>
            `;
        }
        
        // Add specific deductions based on regime
        if (currentRegime === 'new') {
            // Family Pension Deduction
            if (deductions.familyPension > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Family Pension Deduction:</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.familyPension)}</span>
                    </div>
                `;
            }
            
            // Education Loan Interest
            if (deductions.educationLoan > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Education Loan Interest (80E):</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.educationLoan)}</span>
                    </div>
                `;
            }
            
            // Employer Contribution
            if (deductions.employerContribution > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Employer Contribution to PF/NPS:</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.employerContribution)}</span>
                    </div>
                `;
            }
        } else {
            // Section 80C
            if (deductions.section80C > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Section 80C Investments:</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.section80C)}</span>
                    </div>
                `;
            }
            
            // Section 80D - Self
            if (deductions.section80DSelf > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Health Insurance - Self (80D):</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.section80DSelf)}</span>
                    </div>
                `;
            }
            
            // Section 80D - Parents
            if (deductions.section80DParents > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Health Insurance - Parents (80D):</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.section80DParents)}</span>
                    </div>
                `;
            }
            
            // Home Loan Interest
            if (deductions.homeLoanInterest > 0) {
                breakdownHTML += `
                    <div class="flex justify-between">
                        <span>Home Loan Interest (Sec 24):</span>
                        <span class="text-green-600">- ${formatCurrency(deductions.homeLoanInterest)}</span>
                    </div>
                `;
            }
        }
        
        // Add net taxable income
        breakdownHTML += `
            <div class="flex justify-between mt-2 font-medium border-t border-gray-200 pt-2">
                <span>Net Taxable Income:</span>
                <span>${formatCurrency(taxableIncome)}</span>
            </div>
            
            <div class="flex justify-between font-semibold mb-2 mt-4 border-t border-gray-200 pt-3">
                <span>Tax Calculation</span>
            </div>
        `;
        
        // Get regime data
        const regimeData = getCurrentTaxRegimeData();
        
        // Calculate tax on each slab
        let totalTax = 0;
        let appliedRebate = 0;
        
        for (const slab of regimeData.slabs) {
            if (taxableIncome > slab.min) {
                const slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
                const slabTax = slabIncome * slab.rate;
                
                if (slabTax > 0) {
                    const slabRangeText = slab.max === Infinity 
                        ? `Above ${formatCurrency(slab.min)}`
                        : `${formatCurrency(slab.min)} to ${formatCurrency(slab.max)}`;
                    
                    breakdownHTML += `
                        <div class="flex justify-between text-sm">
                            <span>${slabRangeText} @ ${slab.rate * 100}%:</span>
                            <span>${formatCurrency(slabTax)}</span>
                        </div>
                    `;
                    
                    totalTax += slabTax;
                }
            }
        }
        
        // Add rebate information if applicable
        if (taxableIncome <= regimeData.rebate.limit && totalTax > 0) {
            appliedRebate = Math.min(totalTax, regimeData.rebate.max);
            breakdownHTML += `
                <div class="flex justify-between text-sm text-green-600">
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
                <div class="flex justify-between text-sm">
                    <span>Health & Education Cess @ 4%:</span>
                    <span>${formatCurrency(cess)}</span>
                </div>
            `;
        }
        
        // Add total tax
        const finalTax = totalTax + cess;
        breakdownHTML += `
            <div class="flex justify-between mt-2 font-medium border-t border-gray-200 pt-2">
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
        // Get current tax regime data
        const regimeData = getCurrentTaxRegimeData();
        
        // Generate data points for the chart
        const dataPoints = [];
        const maxIncomeInLakhs = 100; // 1 crore
        const step = 2.5; // 2.5 lakh
        
        for (let incomeInLakhs = 0; incomeInLakhs <= maxIncomeInLakhs; incomeInLakhs += step) {
            const income = incomeInLakhs * LAKH_VALUE;
            // Use current checkbox state if user has entered income, otherwise assume salaried for default view
            const isSalariedForGraph = incomeInput.value ? isSalariedCheckbox.checked : true;
            const standardDeduction = isSalariedForGraph ? regimeData.deductions.standard_deduction : 0;
            
            // For chart, only consider standard deduction to keep it simple and clear
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
        
        // Create chart data
        const chartData = {
            labels: dataPoints.map(point => '₹' + point.incomeInLakhs + 'L'),
            datasets: [
                {
                    label: 'Tax Amount',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 3,
                    data: dataPoints.map(point => point.tax),
                    yAxisID: 'y',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }
            ]
        };
        
        // Chart options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Annual Income (₹)',
                        color: 'rgba(107, 114, 128, 1)'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tax Amount (₹)',
                        color: 'rgba(79, 70, 229, 1)'
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrencyShort(value);
                        }
                    },
                    grid: {
                        drawBorder: false,
                    },
                    position: 'left',
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const dataIndex = context.dataIndex;
                            return 'Tax: ' + formatCurrency(dataPoints[dataIndex].tax);
                        },
                        title: function(tooltipItems) {
                            return 'Income: ' + tooltipItems[0].label;
                        },
                        afterBody: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            return 'Taxable: ' + formatCurrency(dataPoints[dataIndex].taxableIncome);
                        }
                    }
                },
                title: {
                    display: false
                },
                legend: {
                    display: false
                }
            }
        };
        
        // Destroy existing chart if it exists
        if (window.taxChart instanceof Chart) {
            window.taxChart.destroy();
        }
        
        // Create new chart
        window.taxChart = new Chart(taxChart.getContext('2d'), {
            type: 'line',
            data: chartData,
            options: chartOptions
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
        // Get current tax regime data
        const regimeData = getCurrentTaxRegimeData();
        
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
        
        for (const slab of regimeData.slabs) {
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
        if (taxableIncome <= regimeData.rebate.limit && totalSlabTax > 0) {
            rebate = Math.min(totalSlabTax, regimeData.rebate.max);
            totalSlabTax = Math.max(0, totalSlabTax - rebate);
            
            detailsHTML += `
                <tr class="bg-green-50">
                    <td class="px-3 py-2" colspan="2">Rebate u/s 87A (for income up to ${formatCurrency(regimeData.rebate.limit)})</td>
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
        
        // Add total tax
        const totalTax = totalSlabTax + cess;
        detailsHTML += `
            <tr class="font-semibold bg-gray-50">
                <td class="px-3 py-2" colspan="2">Total Tax Liability</td>
                <td class="px-3 py-2 text-right">${formatCurrency(totalTax)}</td>
            </tr>
            </tbody>
        </table>`;
        
        taxSlabDetailsDiv.innerHTML = detailsHTML;
    }

    // Add share button to results
    function addShareButton() {
        // Create share section div
        const shareSection = document.createElement('div');
        shareSection.className = 'mt-6 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 bg-indigo-50 p-4 rounded-lg';
        
        // Create share text
        const shareText = document.createElement('div');
        shareText.className = 'text-sm text-indigo-800';
        shareText.textContent = 'Share this calculation with others:';
        
        // Create share button
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-result-btn';
        shareBtn.className = 'bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors shadow-md flex items-center space-x-2';
        shareBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share Result</span>
        `;
        
        // Handle share button click
        shareBtn.addEventListener('click', shareResult);
        
        // Add elements to share section
        shareSection.appendChild(shareText);
        shareSection.appendChild(shareBtn);
        
        // Add share section to results section
        resultsSection.appendChild(shareSection);
    }
    
    // Share result function - handles both copy to clipboard and native sharing
    function shareResult() {
        const income = parseFloat(incomeInput.value) || 0;
        const isSalaried = isSalariedCheckbox.checked;
        const tax = taxAmountSpan.textContent;
        
        // Format income using our function
        const formattedIncome = formatAmount(income).replace('₹', '');
        
        const shareText = `My income of ${formattedIncome} would result in a tax of ${tax} under the ${currentRegime} tax regime for FY ${currentFinancialYear}. Calculate yours:`;
        
        // Get current URL from the browser (with parameters already set by updateURLWithCalculation)
        const shareUrl = window.location.href;
        
        // Combine text and URL
        const fullShareText = `${shareText} ${shareUrl}`;
        
        // Try to use the Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'Income Tax Calculation',
                text: shareText,
                url: shareUrl
            }).catch(err => {
                // Fallback if share fails
                copyToClipboard(fullShareText);
            });
        } else {
            // Fallback to clipboard copy on desktop
            copyToClipboard(fullShareText);
        }
    }
    
    // Copy URL to clipboard and show feedback
    function copyToClipboard(text) {
        const shareBtn = document.getElementById('share-result-btn');
        const originalText = shareBtn.innerHTML;
        
        // Try to use the modern Clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showCopySuccess(shareBtn, originalText);
                })
                .catch(() => {
                    // Fallback to the older method if Clipboard API fails
                    fallbackCopyToClipboard(text, shareBtn, originalText);
                });
        } else {
            // Use fallback for browsers without Clipboard API
            fallbackCopyToClipboard(text, shareBtn, originalText);
        }
    }
    
    // Fallback method for copying to clipboard
    function fallbackCopyToClipboard(text, shareBtn, originalText) {
        try {
            // Create a temporary input element
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.opacity = 0;
            input.value = text;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, 99999); // For mobile devices
            
            // Copy the text
            const successful = document.execCommand('copy');
            document.body.removeChild(input);
            
            if (successful) {
                showCopySuccess(shareBtn, originalText);
            } else {
                console.error('Failed to copy');
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
    
    // Show copy success feedback
    function showCopySuccess(shareBtn, originalText) {
        // Add the class for animation
        shareBtn.classList.add('copied');
        
        // Change button text and icon
        shareBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>URL Copied!</span>
        `;
        
        // Reset button after 2 seconds
        setTimeout(() => {
            shareBtn.innerHTML = originalText;
            shareBtn.classList.remove('copied');
        }, 2000);
    }

    // Helper function to get current tax regime data
    function getCurrentTaxRegimeData() {
        return taxRegimeData[currentFinancialYear][currentRegime];
    }
    
    // Helper function to update UI elements based on selected regime
    function updateUIForRegime() {
        // Update regime text
        regimeTypeText.textContent = currentRegime === 'new' ? 'New' : 'Old';
        
        // Update standard deduction text
        const stdDeduction = getCurrentTaxRegimeData().deductions.standard_deduction;
        standardDeductionText.textContent = '₹' + formatIndianRupees(stdDeduction);
        
        // Update tax slabs display
        taxSlabsRegimeYear.textContent = `${currentRegime === 'new' ? 'New' : 'Old'} Regime, FY ${currentFinancialYear}`;
        updateTaxSlabsTable();
        
        // Show/hide appropriate deduction sections
        if (currentRegime === 'new') {
            newRegimeDeductions.classList.remove('hidden');
            oldRegimeDeductions.classList.add('hidden');
        } else {
            newRegimeDeductions.classList.add('hidden');
            oldRegimeDeductions.classList.remove('hidden');
        }
        
        // Recalculate tax
        calculateTax();
    }
    
    // Function to update tax slabs table
    function updateTaxSlabsTable() {
        const slabs = getCurrentTaxRegimeData().slabs;
        const tbody = taxSlabsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        slabs.forEach(slab => {
            const row = document.createElement('tr');
            
            let rangeText;
            if (slab.max === Infinity) {
                rangeText = `Above ${formatIndianRupees(slab.min)}`;
            } else {
                rangeText = `${formatIndianRupees(slab.min)} - ${formatIndianRupees(slab.max)}`;
            }
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${rangeText}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${slab.rate * 100}%</td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    // Helper function to format currency in Indian format (e.g., 1,00,000)
    function formatIndianRupees(amount) {
        amount = Math.round(amount);
        let result = amount.toString();
        
        let lastThree = result.substring(result.length - 3);
        let otherNumbers = result.substring(0, result.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        
        let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        return formatted;
    }

    // Setup event listeners for regime and financial year changes
    financialYearSelect.addEventListener('change', function() {
        currentFinancialYear = this.value;
        updateUIForRegime();
    });
    
    taxRegimeSelect.addEventListener('change', function() {
        currentRegime = this.value;
        updateUIForRegime();
    });
    
    // Setup event listeners for additional deduction checkboxes
    // New regime deductions
    hasFamilyPensionCheckbox.addEventListener('change', function() {
        familyPensionAmountWrapper.classList.toggle('hidden', !this.checked);
        calculateTax();
    });
    
    hasEducationLoanCheckbox.addEventListener('change', function() {
        educationLoanAmountWrapper.classList.toggle('hidden', !this.checked);
        calculateTax();
    });
    
    hasEmployerContributionCheckbox.addEventListener('change', function() {
        employerContributionWrapper.classList.toggle('hidden', !this.checked);
        calculateTax();
    });
    
    // Old regime deductions
    hasSection80CCheckbox.addEventListener('change', function() {
        section80CAmountWrapper.classList.toggle('hidden', !this.checked);
        calculateTax();
    });
    
    hasSection80DCheckbox.addEventListener('change', function() {
        section80DAmountWrapper.classList.toggle('hidden', !this.checked);
        calculateTax();
    });
    
    hasHomeLoanInterestCheckbox.addEventListener('change', function() {
        homeLoanInterestWrapper.classList.toggle('hidden', !this.checked);
        calculateTax();
    });
    
    // Add input event listeners for deduction amounts
    familyPensionAmountInput.addEventListener('input', debounce(calculateTax));
    educationLoanAmountInput.addEventListener('input', debounce(calculateTax));
    employerContributionAmountInput.addEventListener('input', debounce(calculateTax));
    section80CAmountInput.addEventListener('input', debounce(calculateTax));
    section80DSelfAmountInput.addEventListener('input', debounce(calculateTax));
    section80DParentsAmountInput.addEventListener('input', debounce(calculateTax));
    homeLoanInterestAmountInput.addEventListener('input', debounce(calculateTax));
    
    // Initialize the calculator
    initSlider();
    updateUIForRegime(); // Initialize UI based on selected regime
    updateExampleCards();
    loadCalculationFromURL();
    updateTaxSlabsTable(); // Initialize tax slabs table

    // Function to format amount in lakhs or crores
    function formatAmount(amount) {
        if (amount >= 100) {
            return `${(amount/100).toFixed(2)} Cr`;
        } else if (amount > 0) {
            return `₹${amount} Lakhs`;
        } else {
            return '₹0';
        }
    }
}); 