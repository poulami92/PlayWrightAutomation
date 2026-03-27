Feature:  Ecommerce Validation

@Regression
Scenario: Placing Order

Given login with "Gpd@gmail.com" and "Kolkata@1"
Then verify login success message is displayed
When add product "ZARA1" to cart
Then Verify product "ZARA" is displayed in cart
When enter valid details and place the Order
Then verify order is present in order history page


