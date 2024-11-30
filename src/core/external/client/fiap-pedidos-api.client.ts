const axios = require('axios');

export const fiapPedidosApiClient = {
  atualizarStatusPedido: async (id, status) => {
    return (
      await axios.patch(
        (process.env.PEDIDOS_ENDPOINT || 'http://fiap-pedidos-api.com') +
          '/pedidos/webhook/pagamento/' +
          id,{
            status
          },
          {
            headers: {
              'Content-Type': 'application/json', // Garante que o body seja interpretado como JSON
            },
          }
      )
    ).data;
  },
};
