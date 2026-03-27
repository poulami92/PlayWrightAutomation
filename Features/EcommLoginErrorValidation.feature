Feature:  Ecommerce Validation

@ErrorValidation @foo
Scenario Outline: Placing Order

Given login with "<UserEmail>" and "<Password>"
Then verify error message is displayed

Examples:

| UserEmail     | Password  |
| Gpd@gmail.com | Kolkata@2 |
| Gpd@gmail.com | Kolkata@3 |



