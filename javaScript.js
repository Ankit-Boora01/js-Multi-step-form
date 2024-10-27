const formSteps = document.querySelectorAll('.form-Step');
  const stepCounts = document.querySelectorAll('.step-count');
  const arcade = document.getElementById('arcade');
  const advanced = document.getElementById('advanced');
  const pro = document.getElementById('pro');
  const switchToggle = document.querySelector("#toggleSwitch");
  const yearly = document.querySelector("#yearly");
  const monthly = document.querySelector("#monthly");
  const plan = document.querySelectorAll(".plan");
  const rateArcade = document.querySelector('#rateArcade');
  const rateAdvanced = document.querySelector('#rateAdvanced');
  const ratePro = document.querySelector('#ratePro');
  const pick_up = document.getElementsByClassName('pick-up');
  const addons_Price = document.querySelectorAll('#addons-price');
  const os_Pickup = document.getElementById('OS-pickup');
  const lg_Pickup = document.getElementById('LG-pickup');
  const cp_Pickup = document.getElementById('CP-pickup');
  const final_details = document.querySelector('.final-detials');
  const finalPlan = document.querySelector('#finalPlan');
  const planName = document.getElementById('planName');
  const planType = document.getElementById('planType');
  const total_Amount = document.getElementById('total_Amount');
  const finalType = document.getElementById('finalType');
  const thank_you = document.getElementsByClassName('thankyou');

  let planSelected = null;
  let billingType = 'monthly'; 
  let currentStep = 0;
  let os_Amount = 0;
  let lg_Amount = 0;
  let cp_Amount = 0;
  let plan_Amount = 0;
  let addons_priceList;

  stepCounts[currentStep].classList.add('onStep');
  formSteps[currentStep].classList.add('active');

  

  const prices = {
    arcade: { monthly: 9, yearly: 90 },
    advanced: { monthly: 12, yearly: 120 },
    pro: { monthly: 15, yearly: 150 }
  };

  rateArcade.innerHTML = `<span id="rateArcade">$${prices.arcade[billingType]}/mo</span>`;
  rateAdvanced.innerHTML = `<span id="rateAdvanced">$${prices.advanced[billingType]}/mo</span>`;
  ratePro.innerHTML = `<span id="ratePro">$${prices.pro[billingType]}/mo</span>`;

  function addOns(){
    let addons_priceList = switchToggle.checked ? [10, 20, 20] : [1, 2, 2];
    let addons_type = switchToggle.checked ? 'yr' : 'mo';
  
  // Update the addon prices in the DOM
  addons_Price.forEach((ad_pr, i) => {
    ad_pr.innerHTML = `+$${addons_priceList[i++]}/${addons_type}`; 
  });
  return addons_priceList;
  }

  window.addEventListener('DOMContentLoaded', addOns);

  function handlePickupChange() {
  const addOnData = [
    { id: 'final-addons', checkbox: os_Pickup, name: 'Online Service', priceIndex: 0, amountRef: { get: () => os_Amount, set: (value) => { os_Amount = value; } }},
    { id: 'final-addons-lg', checkbox: lg_Pickup, name: 'Larger Storage', priceIndex: 1, amountRef: { get: () => lg_Amount, set: (value) => { lg_Amount = value; } }},
    { id: 'final-addons-cp', checkbox: cp_Pickup, name: 'Customizable Profile', priceIndex: 2, amountRef: { get: () => cp_Amount, set: (value) => { cp_Amount = value; } }}
  ];

  let amounts = addOns();

  addOnData.forEach((addOn, index) => {
    let addOnElement = document.getElementById(addOn.id);
    
    if (addOn.checkbox.checked) {
      if (!addOnElement) {
        // Create and append add-on div if not already added
        const div = document.createElement('div');
        div.id = addOn.id;
        final_details.appendChild(div);
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = addOn.name;
        div.appendChild(nameSpan);
        
        const priceSpan = document.createElement('span');
        priceSpan.textContent = addons_Price[addOn.priceIndex].textContent;
        div.appendChild(priceSpan);
        
        addOn.amountRef.set(amounts[index]);  // Update the correct amount
        console.log(`Added: ${addOn.name}, Amount: ${addOn.amountRef.get()}`);  // Log the added amount
      }
    } else if (addOnElement) {
      // Remove add-on div if checkbox is unchecked
      final_details.removeChild(addOnElement);
      addOn.amountRef.set(0);  // Set amount to 0 when unchecked
      console.log(`Removed: ${addOn.name}, Amount: ${addOn.amountRef.get()}`);  // Log the removed amount
    }
  });

  totalAmount(os_Amount, lg_Amount, cp_Amount, plan_Amount);
}


  


  // Function to handle plan selection and pricing update
  function selectPlan(planId) {
    plan.forEach(p => p.classList.remove('selected'));
    document.getElementById(planId).classList.add('selected');
    planSelected = prices[planId][billingType]; 
    finalPlan.innerHTML =  planSelected < 16 ? `<p id="finalPlan">$${planSelected}/mo</p>` :  `<p id="finalPlan">$${planSelected}/yr</p>`;
    plan_Amount =  planSelected;
    planName.innerHTML = `<p id="planName">${captialLetter(planId)} (<span id="plantype">${captialLetter(billingType)}</span>)
            </p>` ;
            handlePickupChange();
  }

  // Add event listeners to plans
  arcade.addEventListener('click', () => selectPlan('arcade'));
  advanced.addEventListener('click', () => selectPlan('advanced'));
  pro.addEventListener('click', () => selectPlan('pro'));

  function captialLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function toggleBillingType() {
    billingType = switchToggle.checked ? 'yearly' : 'monthly'; 
    yearly.style.opacity = switchToggle.checked ? "1" : "0.6";
    monthly.style.opacity = switchToggle.checked ? "0.6" : "1";


    if (switchToggle.checked){
    rateArcade.innerHTML = `<span id="rateArcade">$${prices.arcade[billingType]}/yr</span>`;
    rateAdvanced.innerHTML = `<span id="rateAdvanced">$${prices.advanced[billingType]}/yr</span>`;
    ratePro.innerHTML = `<span id="ratePro">$${prices.pro[billingType]}/yr</span>`;
    }else{
      rateArcade.innerHTML = `<span id="rateArcade">$${prices.arcade[billingType]}/mo</span>`;
    rateAdvanced.innerHTML = `<span id="rateAdvanced">$${prices.advanced[billingType]}/mo</span>`;
    ratePro.innerHTML = `<span id="ratePro">$${prices.pro[billingType]}/mo</span>`;
    }
    

    plan.forEach((p) => {
      if (billingType === 'yearly' && !p.querySelector('#free-months')) {
        const spanTag = document.createElement('span');
        spanTag.textContent = "2 months free";
        spanTag.id = "free-months";
        p.appendChild(spanTag);
       
      } else if (billingType === 'monthly' && p.querySelector('#free-months')) {
        p.querySelector('#free-months').remove();
       
      }
      addOns()
    });

    
  }

  // Add event listener to the toggle switch
  switchToggle.addEventListener("change", toggleBillingType);

  function totalAmount(a,b,c,d){
    let amount = a + b + c + d ;
    if(amount < 22){
    total_Amount.innerHTML  =`<span id="total_Amount">$${amount}/mo</span>`;
    finalType.textContent = ' month'
  } else {
    total_Amount.innerHTML  =`<span id="total_Amount">$${amount}/yr</span>`;
    finalType.textContent = ' year'

  }}

  function thankyou() {
    // Hide the confirmation step
    document.getElementById('confirmation-step').style.display = 'none';
    // Show the thank you step
    document.getElementById('thankyou-step').style.display = 'block';
}

  

  // Handle next button click
  document.querySelectorAll('#nxt-btn').forEach((nextBtn) => {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      if (currentStep < formSteps.length - 1) {
        stepCounts[currentStep].classList.remove('onStep');
        formSteps[currentStep].classList.remove('active');
        currentStep++;
        stepCounts[currentStep].classList.add('onStep');
        formSteps[currentStep].classList.add('active');
      }
    });
  });

  // Handle back button click
  document.querySelectorAll('#bck-btn').forEach((backBtn) => {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      if (currentStep > 0) {
        stepCounts[currentStep].classList.remove('onStep');
        formSteps[currentStep].classList.remove('active');
        currentStep--;
        stepCounts[currentStep].classList.add('onStep');
        formSteps[currentStep].classList.add('active');
      }
    });
  });
