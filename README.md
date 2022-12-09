# TASK TIME NEST

## DATABASE

Para o banco de dados será necessário a utilização do docker através de uma imagem. Rodar o seguinte comando após iniciado o docker:

```
    docker run --name taskTime -p 3306:3306 -e MYSQL_ROOT_PASSWORD=toor -e MYSQL_DATABASE=taskTime -d mysql:latest
```

Por se tratar de um banco local voltado apenas para testes o mesmo utiliza o usuário root.
Após criado a imagem e dado o start na mesma com o docker já podemos conectar nela através da aplicação ou de uma ferramenta qualquer de banco de dados.
