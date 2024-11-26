Funcionalidade: Atualizar Intenção de Pagamento por Id

Cenário: Atualizar Intenção de Pagamento cadastrada por ID
  Dado que seja informado um ID já cadastrado
  Quando realizado a atualização de Intenção de Pagamento por ID
  Então os dados da Intenção de Pagamento cadastrada atualizados devem ser retornados

Cenário: Atualizar Intenção de Pagamento cadastrado por ID não cadastrado
  Dado que seja informado um ID não cadastrado
  Quando realizado a atualização de Intenção de Pagamento por ID
  Então uma exceção informando que o Intenção de Pagamento não foi encontrada deve ser lançada
