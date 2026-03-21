class ApiUtils
{
    constructor(apiContext,loginPayload)
    {
      this.apiContext=apiContext;
      this.loginPayload=loginPayload;
    }

    async getToken()
    {
      const loginResponse=await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
      {
        data:this.loginPayload
      });

   const loginResponseJson=await loginResponse.json();
   const token=loginResponseJson.token;
   return token;
   }

    async createOrder(createOrderPayload,token)
    {
       const createOrderResponse= await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',
       {
         data:createOrderPayload,
         headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        const createOrderResponseJson= await createOrderResponse.json();
        const orderId=createOrderResponseJson.orders[0];
        return orderId;
    }
}

module.exports = { ApiUtils };