const axios = require('axios');

// Shopify API key and Pipedrive API key
const SHOPIFY_API_KEY = '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';
const PIPEDRIVE_API_KEY = 'b9914497004bc1851bc9cadca83aca295bd6caf7';

// Function to get Shopify order details
async function getShopifyOrder(orderId) {
    try {
        const response = await axios.get(`https://07b36d-7.myshopify.com/admin/api/2022-01/orders/${orderId}.json`, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_API_KEY
            }
        });
        return response.data.order;
    } catch (error) {
        console.error('Error fetching Shopify order:', error.response.data);
        throw new Error('Shopify order not found');
    }
}

// Function to find or create a person in Pipedrive
async function findOrCreatePerson(email) {
    try {
        // Check if person exists in Pipedrive
        const response = await axios.get(`https://api.pipedrive.com/v1/persons/find?term=${email}&api_token=${PIPEDRIVE_API_KEY}`);
        if (response.data.data.length > 0) {
            // Person found
            return response.data.data[0];
        } else {
            // Person not found, create new person
            const newPerson = {
                name: email,
                email: [{ value: email }],
                phone: [{ value: '' }] // Add phone number if available
            };
            const createResponse = await axios.post(`https://api.pipedrive.com/v1/persons?api_token=${PIPEDRIVE_API_KEY}`, newPerson);
            return createResponse.data.data;
        }
    } catch (error) {
        console.error('Error finding/creating person in Pipedrive:', error.response.data);
        throw new Error('Failed to find/create person in Pipedrive');
    }
}

// Function to find or create a product in Pipedrive
async function findOrCreateProduct(sku) {
    try {
        // Check if product exists in Pipedrive
        const response = await axios.get(`https://api.pipedrive.com/v1/products/find?term=${sku}&api_token=${PIPEDRIVE_API_KEY}`);
        if (response.data.data.length > 0) {
            // Product found
            return response.data.data[0];
        } else {
            // Product not found, create new product
            const newProduct = {
                name: sku,
                sku: sku,
                prices: [{ price: 0 }] // Add price if available
            };
            const createResponse = await axios.post(`https://api.pipedrive.com/v1/products?api_token=${PIPEDRIVE_API_KEY}`, newProduct);
            return createResponse.data.data;
        }
    } catch (error) {
        console.error('Error finding/creating product in Pipedrive:', error.response.data);
        throw new Error('Failed to find/create product in Pipedrive');
    }
}

// Function to create a deal in Pipedrive
async function createDeal(personId, productId) {
    try {
        const newDeal = {
            title: 'New Deal',
            person_id: personId,
            products_count: 1, // Number of products attached to the deal
            product_id: productId
        };
        const response = await axios.post(`https://api.pipedrive.com/v1/deals?api_token=${PIPEDRIVE_API_KEY}`, newDeal);
        console.log('Deal created successfully in Pipedrive:', response.data.data);
        return 'success';
    } catch (error) {
        console.error('Error creating deal in Pipedrive:', error.response.data);
        return 'failure';
    }
}

// Main function to orchestrate the integration
async function integrateShopifyPipedrive(orderId) {
    try {
        // Step 1: Get Shopify order details
        const order = await getShopifyOrder(orderId);
        console.log('order', order);

        // Step 2: Find or create person in Pipedrive
        const person = await findOrCreatePerson(order.email);

        // // Step 3: Find or create product in Pipedrive
        const product = await findOrCreateProduct(order.line_items[0].sku);

        // // Step 4: Create deal in Pipedrive
        const result = await createDeal(person.id, product.id);

        return result;
    } catch (error) {
        console.error('Integration failed:', error.message);
        return 'failure';
    }
}

// Usage example
const orderId = '5478844530900'; // Replace with the actual order ID
integrateShopifyPipedrive(orderId);
