import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    // Defina a largura e altura com base nas dimensões da tela, com limites máximos
    final containerMaxWidth = screenWidth * 0.8; // 80% da largura da tela
    final containerMaxHeight = screenHeight * 0.8; // 80% da altura da tela

    // Defina limites máximos para largura e altura
    final maxWidth = 700.0; // Largura máxima desejada
    final maxHeight = 800.0; // Altura máxima desejada

    final containerWidth =
        containerMaxWidth < maxWidth ? containerMaxWidth : maxWidth;
    final containerHeight =
        containerMaxHeight < maxHeight ? containerMaxHeight : maxHeight;

    return MaterialApp(
      home: Scaffold(
        backgroundColor: Color(0xFF1A1A1A),
        appBar: AppBar(
          backgroundColor: Color(0xFF1A1A1A),
          title: Text('mangafever'),
        ),
        body: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: containerWidth,
              maxHeight: containerHeight,
            ),
            child: Container(
              width: double.infinity,
              height: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: Color(0xFF222222),
                border: Border.all(
                  color: Colors.white,
                  width: 0.5,
                ),
              ),
              child: Column(
                children: <Widget>[
                  textoTitulo(),
                  campoTexto(descricao: 'Nome de usuário'),
                  campoTexto(
                    descricao: 'Senha',
                    obscureText: true,
                  ),
                  Container(
                    child: Column(
                      children: [
                        SizedBox(
                            height:
                                20), // Espaço entre campos de texto e botões
                        botaoEntrar(),
                        SizedBox(height: 300),
                        botaoEsqSenha(),
                      ],
                    ),
                  ),
                  Container(
                    child: TextButton(
                      onPressed: () {
                        // Adicione o que deseja fazer quando o botão for pressionado aqui
                      },
                      child: Text(
                        'Criar conta',
                        style: TextStyle(
                          color: Color(0xFFFFFFFF), // Cor do texto
                          fontSize: 13, // Tamanho do texto
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class textoTitulo extends StatelessWidget {
  const textoTitulo({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.topCenter,
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 16),
      child: Text(
        'Login',
        style: TextStyle(
          fontFamily: 'Roboto',
          fontSize: 20,
          color: Colors.white,
        ),
      ),
    );
  }
}

class botaoEntrar extends StatelessWidget {
  const botaoEntrar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      child: ElevatedButton(
        onPressed: () {
          // Adicione o que deseja fazer quando o botão for pressionado aqui
        },
        style: ButtonStyle(
          textStyle: MaterialStateProperty.all<TextStyle>(
            TextStyle(fontSize: 25), // Tamanho do texto
          ),
          minimumSize: MaterialStateProperty.all<Size>(Size(250, 60)),
          backgroundColor: MaterialStateProperty.all<Color>(
            Color(0xFFE6810B),
          ), // Substitua "Colors.blue" pela cor desejada
        ),
        child: Text('Entrar'),
      ),
    );
  }
}

class botaoEsqSenha extends StatelessWidget {
  const botaoEsqSenha({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      child: TextButton(
        onPressed: () {
          // Adicione o que deseja fazer quando o botão for pressionado aqui
        },
        child: Text(
          'Esqueceu a senha?',
          style: TextStyle(
            color: Color(0xFFAEAEAE), // Cor do texto
            fontSize: 16, // Tamanho do texto
          ),
        ),
      ),
    );
  }
}

class campoTexto extends StatelessWidget {
  final String descricao;
  final bool obscureText;

  const campoTexto({
    Key? key,
    required this.descricao,
    this.obscureText = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 60, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.only(left: 8, bottom: 20),
            child: Text(
              descricao,
              style: TextStyle(
                fontSize: 16,
                color: Colors.white,
              ),
              textAlign: TextAlign.left,
            ),
          ),
          ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 600),
            child: TextField(
              obscureText: obscureText,
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: Color(0xFFE6810B),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: Color(0xFFE6810B),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
