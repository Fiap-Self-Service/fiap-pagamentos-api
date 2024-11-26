Funcionalidade: Consulta de Intenção de Pagamento por Id

Cenário: Buscar Intenção de Pagamento cadastrada por ID
  Dado que seja informado um ID já cadastrado
  Quando realizado a busca do Intenção de Pagamento por ID
  Então os dados da Intenção de Pagamento cadastrada devem ser retornados

Cenário: Buscar Intenção de Pagamento cadastrada por ID não cadastrado
  Dado que seja informado um ID não cadastrado
  Quando realizado a busca do Intenção de Pagamento por ID
  Então deve retornar que a Intenção de Pagamento não foi encontrada
