const axios = require('axios');

export const fiapPedidosApiClient = {
  atualizarStatusPedido: async (id, status) => {
    return (
      await axios.patch(
        (process.env.PEDIDOS_ENDPOINT || 'http://fiap-pedidos-api.com') +
          '/pedidos/' +
          id,{
            status
          }
      )
    ).data;
  },
};
