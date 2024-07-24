const whatsappServiceCosts = {
    "Argentina": 0.0316,
    "Brazil": 0.0300,
    "Chile": 0.0454,
    "Colombia": 0.0060,
    "Egypt": 0.0644,
    "France": 0.0859,
    "Germany": 0.0819,
    "India": 0.0040,
    "Indonesia": 0.0190,
    "Israel": 0.0180,
    "Italy": 0.0386,
    "Malaysia": 0.0220,
    "Mexico": 0.0105,
    "Netherlands": 0.0891,
    "Nigeria": 0.0310,
    "Pakistan": 0.0142,
    "Peru": 0.0179,
    "Russia": 0.0398,
    "Saudi Arabia": 0.0195,
    "South Africa": 0.0168,
    "Spain": 0.0369,
    "Turkey": 0.0030,
    "United Arab Emirates": 0.0190,
    "United Kingdom": 0.0388,
    "North America": 0.0088,
    "Rest of Africa": 0.0363,
    "Rest of Asia Pacific": 0.0224,
    "Rest of Central & Eastern Europe": 0.0250,
    "Rest of Latin America": 0.0423,
    "Rest of Middle East": 0.0218,
    "Rest of Western Europe": 0.0397,
    "Other": 0.0145
};

const defaultMarket = "North America";

let selectedService = '';

function selectService(service) {
    selectedService = service;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    if (service === 'whatsapp') {
        document.getElementById('countrySelector').style.display = 'block';
    } else {
        document.getElementById('countrySelector').style.display = 'none';
    }
    window.scrollTo(0, 0);
}

function goToStep2() {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
}

function goBack() {
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
    document.getElementById('resultContainer').style.display = 'none'; // Hide result container
    window.scrollTo(0, 0);
}


function showDiscount() {
    const offerMessage = 'Book your free 1-hour consultation call today to discuss how we can help your business with our advanced automation and AI solutions.';
    document.getElementById('discount-offer').textContent = offerMessage;
    document.getElementById('discount-section').style.display = 'block';
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
}


function updateChatValue(value) {
    document.getElementById('chatValue').textContent = value;
    document.getElementById('userChatsInput').value = value;
    formChanged(); // Trigger formChanged when chat value changes
}

function updateChatSlider(value) {
    document.getElementById('chatValue').textContent = value;
    document.getElementById('userChatsSlider').value = value;
    formChanged(); // Trigger formChanged when chat slider changes
}

function formChanged() {
    document.getElementById('resultContainer').style.display = 'none'; // Hide result container
}

function calculateWhatsAppCost(chats, costPerChat) {
    const freeLimit = 1000;
    const chargeableChats = Math.max(chats - freeLimit, 0);
    return chargeableChats * costPerChat;
}

function calculateCost() {
    document.getElementById('resultContainer').style.display = 'block'; // Show result container

    const userChats = parseInt(document.getElementById('userChatsInput').value);
    const automationOption = document.getElementById('automationOption').value;
    const selectedCountry = document.getElementById('countrySelect').value || defaultMarket;

    const tokensPerChat = 10000; // 20 messages * 500 tokens per message
    const tokenCostPer1000 = 0.02; // $0.02 per 1000 tokens
    const botpressAlwaysAlive = 5; // $5/month
    const freeCredits = 5; // $5/month free credits
    const developmentCostMin = 150;
    const developmentCostMax = 700;
   
    if (automationOption === 'crm') {
        developmentCost = 400; // Adjust for CRM integration
    }

    let totalTokens = userChats * tokensPerChat;
    let totalTokenCost = (totalTokens / 1000) * tokenCostPer1000;
    let botpressTokenSpend = Math.max(totalTokenCost - freeCredits, 0);
    let monthlyCostWithoutAI = botpressAlwaysAlive;
    let monthlyCostWithAI = botpressAlwaysAlive + botpressTokenSpend;
    let initialCostWithoutAI = monthlyCostWithoutAI + developmentCostMin;
    let initialCostWithAI = monthlyCostWithAI + developmentCostMin;

    // WhatsApp specific cost
    const whatsappCostPerChat = whatsappServiceCosts[selectedCountry];
    const whatsappCost = calculateWhatsAppCost(userChats, whatsappCostPerChat);
    const whatsappMonthlyCostWithAI = monthlyCostWithAI + whatsappCost;
    const whatsappMonthlyCostWithoutAI = monthlyCostWithoutAI + whatsappCost;
    const whatsappInitialCostWithAI = initialCostWithAI + whatsappCost;
    const whatsappInitialCostWithoutAI = initialCostWithoutAI + whatsappCost;

    // WhatsApp cost without applying the free limit
    const whatsappCostWithoutFreeLimit = userChats * whatsappCostPerChat;
    const whatsappMonthlyCostWithAIWithoutFreeLimit = monthlyCostWithAI + whatsappCostWithoutFreeLimit;
    const whatsappMonthlyCostWithoutAIWithoutFreeLimit = monthlyCostWithoutAI + whatsappCostWithoutFreeLimit;
    const whatsappInitialCostWithAIWithoutFreeLimit = initialCostWithAI + whatsappCostWithoutFreeLimit;
    const whatsappInitialCostWithoutAIWithoutFreeLimit = initialCostWithoutAI + whatsappCostWithoutFreeLimit;

    // ManyChat Pricing for Instagram and Facebook
    const manyChatPricing = 15; // $15/month
    if (selectedService === 'instagram' || selectedService === 'facebook') {
        monthlyCostWithoutAI += manyChatPricing;
        initialCostWithoutAI += manyChatPricing;
        monthlyCostWithAI += manyChatPricing;
        initialCostWithAI += manyChatPricing;
    }

    // Automation costs
    let automationCost = 0;
    let automationDescription = '';
    if (automationOption === 'googleSheet') {
        automationDescription = 'Saving leads in Google Sheets';
    } else if (automationOption === 'crm') {
        automationCost = 10; // Basic plan for CRM
        automationDescription = 'AI responses based on leads';
    }

    // Update detailed cost tables for WhatsApp
    let detailedCostWithFreeLimit = '';
    let detailedCostWithoutFreeLimit = '';
    if (selectedService === 'whatsapp') {
        detailedCostWithFreeLimit = `
            <tr>
                <td>Total Chats</td>
                <td>${userChats}</td>
            </tr>
            <tr>
                <td>WhatsApp Free Limit</td>
                <td>1000 chats</td>
            </tr>
            <tr>
                <td>Chargeable Chats</td>
                <td>${Math.max(userChats - 1000, 0)} chats</td>
            </tr>
            <tr>
                <td>WhatsApp Cost</td>
                <td>$${whatsappCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Botpress Always Alive</td>
                <td>$${botpressAlwaysAlive}/month</td>
            </tr>
            <tr>
                <td>One-Time Development Cost</td>
                <td>$${developmentCostMin} - $${developmentCostMax}</td>
            </tr>
        `;

        detailedCostWithoutFreeLimit = `
            <tr>
                <td>Total Chats</td>
                <td>${userChats}</td>
            </tr>
            <tr>
                <td>Chargeable Chats</td>
                <td>${userChats} chats</td>
            </tr>
            <tr>
                <td>WhatsApp Cost</td>
                <td>$${whatsappCostWithoutFreeLimit.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Botpress Always Alive</td>
                <td>$${botpressAlwaysAlive}/month</td>
            </tr>
            <tr>
                <td>One-Time Development Cost</td>
                <td>$${developmentCostMin} - $${developmentCostMax}</td>
            </tr>
        `;

        document.getElementById('result').innerHTML = `
            <h2>Cost for ${selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}</h2>
            <h3>Within Free Limit</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Cost Component</th>
                            <th>Estimated Cost (Without AI)</th>
                            <th>Estimated Cost (With AI)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detailedCostWithFreeLimit}
                        <tr>
                            <td>Total Initial Cost</td>
                            <td>$${initialCostWithoutAI.toFixed(2)}</td>
                            <td>$${initialCostWithAI.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total Monthly Cost (After Initial)</td>
                            <td>$${monthlyCostWithoutAI.toFixed(2)}</td>
                            <td>$${monthlyCostWithAI.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>Exceeding Free Limit</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Cost Component</th>
                            <th>Estimated Cost (Without AI)</th>
                            <th>Estimated Cost (With AI)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detailedCostWithoutFreeLimit}
                        <tr>
                            <td>Total Initial Cost</td>
                            <td>$${whatsappInitialCostWithoutAIWithoutFreeLimit.toFixed(2)}</td>
                            <td>$${whatsappInitialCostWithAIWithoutFreeLimit.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total Monthly Cost (After Initial)</td>
                            <td>$${whatsappMonthlyCostWithoutAIWithoutFreeLimit.toFixed(2)}</td>
                            <td>$${whatsappMonthlyCostWithAIWithoutFreeLimit.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="note">
                Note: Development cost can vary between $${developmentCostMin} and $${developmentCostMax} depending on the requirements.
            </div>
            <div id="consultationButtons" class="text-center mt-4">
                <a href="https://tidycal.com/hammadshahzad/free-30-min" target="_blank" class="btn btn-success">Book 30-Minute Call for Free</a>
                <a href="https://tidycal.com/hammadshahzad/1-hour-consultation" target="_blank" class="btn btn-primary ml-3">Book 1-Hour Call for $50 USD</a>
            </div>
        `;
    } else {
        // Handle other services without the "Exceeding Free Limit" section
        detailedCostWithFreeLimit = `
            <tr>
                <td>Total Tokens</td>
                <td>${totalTokens.toLocaleString()} tokens</td>
            </tr>
            <tr>
                <td>AI Token Cost</td>
                <td>$${totalTokenCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Botpress Always Alive</td>
                <td>$${botpressAlwaysAlive}/month</td>
            </tr>
            <tr>
                <td>Botpress AI Token Spend (after $5 free credit)</td>
                <td>$${botpressTokenSpend.toFixed(2)}</td>
            </tr>
            <tr>
                <td>One-Time Development Cost</td>
                <td>$${developmentCostMin} - $${developmentCostMax}</td>
            </tr>
            ${selectedService === 'instagram' || selectedService === 'facebook' ? `
            <tr>
                <td>ManyChat Pricing</td>
                <td>$${manyChatPricing}/month</td>
            </tr>` : ''}
        `;

        document.getElementById('result').innerHTML = `
        <h2>Cost for ${selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}</h2>
        <h3>Within Free Limit</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Cost Component</th>
                        <th>Estimated Cost (Without AI)</th>
                        <th>Estimated Cost (With AI)</th>
                    </tr>
                </thead>
                <tbody>
                    ${detailedCostWithFreeLimit}
                    <tr>
                        <td>Total Initial Cost</td>
                        <td>$${initialCostWithoutAI.toFixed(2)}</td>
                        <td>$${initialCostWithAI.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Monthly Cost (After Initial)</td>
                        <td>$${monthlyCostWithoutAI.toFixed(2)}</td>
                        <td>$${monthlyCostWithAI.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="note">
            Note: Development cost can vary between $${developmentCostMin} and $${developmentCostMax} depending on the requirements.
        </div>
        <div id="consultationButtons" class="text-center mt-4">
            <a href="https://tidycal.com/hammadshahzad/free-30-min" target="_blank" class="btn btn-success">Book 30-Minute Call for Free</a>
            <a href="https://tidycal.com/hammadshahzad/1-hour-consultation" target="_blank" class="btn btn-primary ml-3">Book 1-Hour Call for $50 USD</a>
        </div>
    `;
    }
}


function showToolInfo(toolId) {
    const toolInfo = {
        wordpressInfo: `
            <h4>WordPress Case Studies</h4>
            <p><strong>Case Study 1: Automated Content Publishing</strong></p>
            <p>Goal: Automate content publishing.<br>
            Solution: Integrate WordPress with Zapier.<br>
            Outcome: Automated content scheduling and publishing saved 5 hours per week, ensuring timely updates and consistent content flow.</p>
            <p><strong>Case Study 2: Enhanced Customer Engagement</strong></p>
            <p>Goal: Improve customer engagement.<br>
            Solution: Integrate WordPress with HubSpot CRM.<br>
            Outcome: Personalized customer interactions and targeted marketing campaigns increased user engagement by 30%.</p>
            <p><strong>Case Study 3: Streamlined E-commerce Operations</strong></p>
            <p>Goal: Streamline e-commerce operations.<br>
            Solution: Integrate WordPress with WooCommerce and Google Sheets.<br>
            Outcome: Automated inventory updates and order tracking reduced manual tasks by 50%, improving efficiency.</p>
        `,
        shopifyInfo: `
            <h4>Shopify Case Studies</h4>
            <p><strong>Case Study 1: Automated Order Fulfillment</strong></p>
            <p>Goal: Automate order fulfillment.<br>
            Solution: Integrate Shopify with Zapier.<br>
            Outcome: Orders are automatically sent to fulfillment centers, reducing processing time by 40% and improving customer satisfaction.</p>
            <p><strong>Case Study 2: Personalized Marketing</strong></p>
            <p>Goal: Personalize marketing campaigns.<br>
            Solution: Integrate Shopify with Mailchimp.<br>
            Outcome: Personalized email campaigns based on customer behavior increased sales by 25%.</p>
            <p><strong>Case Study 3: Inventory Management</strong></p>
            <p>Goal: Automate inventory management.<br>
            Solution: Integrate Shopify with Google Sheets.<br>
            Outcome: Real-time inventory updates reduced stockouts and overstock situations by 30%.</p>
        `,
        wixInfo: `
            <h4>Wix Case Studies</h4>
            <p><strong>Case Study 1: Automated Booking System</strong></p>
            <p>Goal: Automate appointment bookings.<br>
            Solution: Integrate Wix with Google Calendar.<br>
            Outcome: Customers book appointments directly through the website, reducing administrative work by 50%.</p>
            <p><strong>Case Study 2: Enhanced Customer Communication</strong></p>
            <p>Goal: Improve customer communication.<br>
            Solution: Integrate Wix with HubSpot CRM.<br>
            Outcome: Automated follow-up emails and notifications improved customer engagement and retention by 20%.</p>
            <p><strong>Case Study 3: E-commerce Automation</strong></p>
            <p>Goal: Automate e-commerce operations.<br>
            Solution: Integrate Wix with Shopify.<br>
            Outcome: Streamlined order processing and inventory management reduced manual tasks by 30%, increasing operational efficiency.</p>
        `,
        airtableInfo: `
            <h4>Airtable Case Studies</h4>
            <p><strong>Case Study 1: Project Management</strong></p>
            <p>Goal: Improve project management.<br>
            Solution: Integrate Airtable with Trello.<br>
            Outcome: Automated task creation and updates improved project tracking and team collaboration by 25%.</p>
            <p><strong>Case Study 2: Event Planning</strong></p>
            <p>Goal: Streamline event planning.<br>
            Solution: Integrate Airtable with Google Calendar.<br>
            Outcome: Automated scheduling and reminders reduced planning time by 40%.</p>
            <p><strong>Case Study 3: Customer Relationship Management</strong></p>
            <p>Goal: Enhance CRM.<br>
            Solution: Integrate Airtable with Mailchimp.<br>
            Outcome: Automated contact management and email marketing campaigns improved customer engagement by 35%.</p>
        `,
        hubspotInfo: `
            <h4>HubSpot CRM Case Studies</h4>
            <p><strong>Case Study 1: Lead Nurturing</strong></p>
            <p>Goal: Automate lead nurturing.<br>
            Solution: Integrate HubSpot CRM with Mailchimp.<br>
            Outcome: Automated email sequences increased lead engagement and conversion rates by 20%.</p>
            <p><strong>Case Study 2: Sales Automation</strong></p>
            <p>Goal: Improve sales automation.<br>
            Solution: Integrate HubSpot CRM with Salesforce.<br>
            Outcome: Automated data sync and lead scoring reduced manual data entry by 50%, increasing sales productivity.</p>
            <p><strong>Case Study 3: Customer Support</strong></p>
            <p>Goal: Enhance customer support.<br>
            Solution: Integrate HubSpot CRM with Zendesk.<br>
            Outcome: Automated ticket creation and tracking improved response times by 30% and customer satisfaction by 15%.</p>
        `,
        salesforceInfo: `
            <h4>Salesforce Case Studies</h4>
            <p><strong>Case Study 1: Sales Forecasting</strong></p>
            <p>Goal: Improve sales forecasting.<br>
            Solution: Integrate Salesforce with Google Sheets.<br>
            Outcome: Automated data sync and reporting improved sales forecasting accuracy by 25%.</p>
            <p><strong>Case Study 2: Marketing Automation</strong></p>
            <p>Goal: Enhance marketing automation.<br>
            Solution: Integrate Salesforce with HubSpot CRM.<br>
            Outcome: Automated campaign management and lead tracking increased marketing efficiency by 30%.</p>
            <p><strong>Case Study 3: Customer Service</strong></p>
            <p>Goal: Improve customer service.<br>
            Solution: Integrate Salesforce with Zendesk.<br>
            Outcome: Automated ticket management and reporting reduced response times by 20%, improving customer satisfaction.</p>
        `,
        kartraInfo: `
            <h4>Kartra Case Studies</h4>
            <p><strong>Case Study 1: Membership Site</strong></p>
            <p>Goal: Create a membership site.<br>
            Solution: Use Kartra to build and manage a membership site.<br>
            Outcome: Automated membership management and content delivery increased member retention by 30%.</p>
            <p><strong>Case Study 2: Sales Funnel</strong></p>
            <p>Goal: Build a sales funnel.<br>
            Solution: Integrate Kartra with Zapier.<br>
            Outcome: Automated lead capture and email sequences increased conversions by 25%.</p>
            <p><strong>Case Study 3: Email Marketing</strong></p>
            <p>Goal: Automate email marketing.<br>
            Solution: Integrate Kartra with Mailchimp.<br>
            Outcome: Automated email campaigns improved engagement by 20% and sales by 15%.</p>
        `,
        gohighlevelInfo: `
            <h4>GoHighLevel Case Studies</h4>
            <p><strong>Case Study 1: Client Management</strong></p>
            <p>Goal: Improve client management.<br>
            Solution: Use GoHighLevel to manage client interactions and tasks.<br>
            Outcome: Automated follow-ups and task assignments improved client satisfaction by 25%.</p>
            <p><strong>Case Study 2: Marketing Automation</strong></p>
            <p>Goal: Automate marketing campaigns.<br>
            Solution: Integrate GoHighLevel with Facebook Ads.<br>
            Outcome: Automated lead generation and follow-up increased campaign ROI by 30%.</p>
            <p><strong>Case Study 3: Sales Automation</strong></p>
            <p>Goal: Streamline sales processes.<br>
            Solution: Integrate GoHighLevel with Salesforce.<br>
            Outcome: Automated lead tracking and reporting improved sales efficiency by 20%.</p>
        `,
        zapierInfo: `
            <h4>Zapier Case Studies</h4>
            <p><strong>Case Study 1: Workflow Automation</strong></p>
            <p>Goal: Automate workflows.<br>
            Solution: Integrate Slack with Trello using Zapier.<br>
            Outcome: Automated task updates and notifications improved team collaboration and reduced manual tasks by 30%.</p>
            <p><strong>Case Study 2: Data Integration</strong></p>
            <p>Goal: Integrate data across platforms.<br>
            Solution: Integrate Google Sheets with HubSpot CRM using Zapier.<br>
            Outcome: Automated data sync improved data accuracy and reduced manual data entry by 50%.</p>
            <p><strong>Case Study 3: Marketing Automation</strong></p>
            <p>Goal: Automate marketing campaigns.<br>
            Solution: Integrate Mailchimp with Facebook Ads using Zapier.<br>
            Outcome: Automated lead generation and email sequences increased engagement and conversions by 25%.</p>
        `,
        makeInfo: `
            <h4>Make.com (formerly Integromat) Case Studies</h4>
            <p><strong>Case Study 1: Workflow Automation</strong></p>
            <p>Goal: Automate data processing.<br>
            Solution: Integrate Google Sheets with Slack using Make.com.<br>
            Outcome: Automated data updates and notifications improved efficiency by 40%.</p>
            <p><strong>Case Study 2: CRM Integration</strong></p>
            <p>Goal: Sync CRM data.<br>
            Solution: Integrate HubSpot CRM with Google Sheets using Make.com.<br>
            Outcome: Automated data sync improved data accuracy and reduced manual entry by 50%.</p>
            <p><strong>Case Study 3: Social Media Automation</strong></p>
            <p>Goal: Automate social media posts.<br>
            Solution: Integrate Facebook with Twitter using Make.com.<br>
            Outcome: Automated posts increased social media engagement by 20%.</p>
        `,
        pabblyInfo: `
            <h4>Pabbly Connect Case Studies</h4>
            <p><strong>Case Study 1: Email Marketing Automation</strong></p>
            <p>Goal: Automate email campaigns.<br>
            Solution: Integrate Pabbly Connect with Mailchimp.<br>
            Outcome: Automated email sequences improved engagement and conversion rates by 25%.</p>
            <p><strong>Case Study 2: Lead Generation</strong></p>
            <p>Goal: Streamline lead generation.<br>
            Solution: Integrate Pabbly Connect with Facebook Lead Ads.<br>
            Outcome: Automated lead capture and follow-up increased lead conversion by 20%.</p>
            <p><strong>Case Study 3: CRM Data Sync</strong></p>
            <p>Goal: Sync CRM data.<br>
            Solution: Integrate Pabbly Connect with Salesforce.<br>
            Outcome: Automated data sync improved data accuracy and reduced manual entry by 50%.</p>
        `,
        googleSheetsInfo: `
            <h4>Google Sheets Case Studies</h4>
            <p><strong>Case Study 1: Project Management</strong></p>
            <p>Goal: Improve project management.<br>
            Solution: Integrate Google Sheets with Trello.<br>
            Outcome: Automated task creation and updates improved project tracking and team collaboration by 25%.</p>
            <p><strong>Case Study 2: Data Analysis</strong></p>
            <p>Goal: Enhance data analysis.<br>
            Solution: Integrate Google Sheets with Google Data Studio.<br>
            Outcome: Automated data visualization improved decision-making and reporting by 30%.</p>
            <p><strong>Case Study 3: CRM Data Management</strong></p>
            <p>Goal: Streamline CRM data management.<br>
            Solution: Integrate Google Sheets with HubSpot CRM.<br>
            Outcome: Automated data sync and updates improved data accuracy and reduced manual tasks by 40%.</p>
        `,
        stackAIInfo: `
            <h4>Stack AI Case Studies</h4>
            <p><strong>Case Study 1: Customer Support Automation</strong></p>
            <p>Goal: Automate customer support.<br>
            Solution: Integrate Stack AI with Zendesk.<br>
            Outcome: Automated responses and ticket routing reduced response times by 30% and improved customer satisfaction by 20%.</p>
            <p><strong>Case Study 2: Sales Process Automation</strong></p>
            <p>Goal: Streamline sales processes.<br>
            Solution: Integrate Stack AI with Salesforce.<br>
            Outcome: Automated lead scoring and follow-up increased sales productivity by 25%.</p>
            <p><strong>Case Study 3: Marketing Personalization</strong></p>
            <p>Goal: Personalize marketing campaigns.<br>
            Solution: Integrate Stack AI with Mailchimp.<br>
            Outcome: Automated campaign personalization improved engagement and conversion rates by 20%.</p>
        `,
        voiceflowInfo: `
            <h4>Voiceflow Case Studies</h4>
            <p><strong>Case Study 1: Voice-Activated Customer Support</strong></p>
            <p>Goal: Automate customer support.<br>
            Solution: Integrate Voiceflow with Amazon Alexa.<br>
            Outcome: Automated voice-activated customer support reduced response times by 40% and improved customer satisfaction by 25%.</p>
            <p><strong>Case Study 2: Voice-Activated Sales Assistant</strong></p>
            <p>Goal: Enhance sales processes.<br>
            Solution: Integrate Voiceflow with Salesforce.<br>
            Outcome: Automated voice-activated sales assistant improved lead management and follow-up efficiency by 30%.</p>
            <p><strong>Case Study 3: Voice-Activated Marketing</strong></p>
            <p>Goal: Automate marketing campaigns.<br>
            Solution: Integrate Voiceflow with Mailchimp.<br>
            Outcome: Automated voice-activated campaign management increased engagement and conversion rates by 20%.</p>
        `,
        botpressInfo: `
            <h4>Botpress Case Studies</h4>
            <p><strong>Case Study 1: AI-Powered Customer Support Chatbot</strong></p>
            <p>Goal: Improve customer support efficiency.<br>
            Solution: Integrate Botpress with Zendesk.<br>
            Outcome: The AI-powered chatbot handled common customer inquiries, reducing support ticket volume by 40% and improving response times.</p>
            <p><strong>Case Study 2: Lead Generation Chatbot</strong></p>
            <p>Goal: Automate lead generation.<br>
            Solution: Integrate Botpress with HubSpot CRM.<br>
            Outcome: The chatbot captured and qualified leads through conversational forms, increasing lead conversion rates by 25%.</p>
            <p><strong>Case Study 3: Employee Onboarding Automation</strong></p>
            <p>Goal: Streamline employee onboarding.<br>
            Solution: Integrate Botpress with Slack and Google Sheets.<br>
            Outcome: Automated onboarding tasks and documentation collection reduced HR workload by 50% and improved new employee experience.</p>
            <p><strong>Case Study 4: Internal IT Support Automation</strong></p>
            <p>Goal: Improve internal IT support.<br>
            Solution: Integrate Botpress with ServiceNow.<br>
            Outcome: The chatbot automated routine IT support tasks, such as password resets and software requests, reducing IT staff workload by 35% and speeding up resolution times.</p>
        `
    };

    document.getElementById('toolInfoModalBody').innerHTML = toolInfo[toolId];
}