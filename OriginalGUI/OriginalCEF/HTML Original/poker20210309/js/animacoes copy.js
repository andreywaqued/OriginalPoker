/**
 * 
 */
//Dimensões em pixels
mesa = { 'imagem': 'images/fundo.png', 'altura_total': '700', 'largura_total': '871', 'centro': { 'x': 0.5, 'y': 0.37 } } //{ 'imagem': 'images/fundo.png', 'altura_total': '1400', 'largura_total': '1742' } //{ 'imagem': 'images/fundo.png', 'altura_total': '700', 'largura_total': '871' }
imagem_jogador = { 'altura_original': '190', 'largura_original': '197' };
imagem_carta = { 'altura_original': '88', 'largura_original': '63' };
proporcao_altura_mesa_jogador = 0.20 //Percentual em número - exemplo: 75% = 0.75
proporcao_centro_jogador_altura_jogador = 0.65 //Calibração de posição do centro, em percentuais em relação à altura total, considerando o y=0 no topo.
proporcao_centro_jogador_largura_jogador = 0.50 //Calibração de posição do centro, em percentuais em relação à largura total, considerando o x=0 à esquerda.
proporcao_altura_mesa_carta = 0.12

jogador_geral = {
        'altura_total': mesa.altura_total * proporcao_altura_mesa_jogador,
        'largura_total': ((mesa.altura_total * proporcao_altura_mesa_jogador * imagem_jogador.largura_original) / imagem_jogador.altura_original),
        'centro_jogador': { 'x': mesa.largura_total * proporcao_altura_mesa_jogador * 0.5, 'y': mesa.altura_total * proporcao_altura_mesa_jogador * 0.65 }
    } //Percentual de proporção


digitos_por_jogador = [];
limite_digitos = { 'pot': { 'maximo': 16, 'minimo': 1, 'atual': 16 }, 'fichas': { 'maximo': 16, 'minimo': 1, 'atual': 16 } };

texto = {

    'nome_jogador': {
        'posicao': { 'x': jogador_geral.largura_total * 0.08, 'y': jogador_geral.altura_total * 0.69 },
        'dimensoes': { 'altura': jogador_geral.altura_total * 0.11, 'largura': jogador_geral.largura_total * 0.85 }
    },

    'valor_jogador': {
        'posicao': { 'x': jogador_geral.largura_total * 0.8, 'y': jogador_geral.altura_total * 0.96 },
        'dimensoes': { 'altura': jogador_geral.altura_total * 0.14, 'largura': jogador_geral.largura_total * 0.97 },
        'digito': { 'largura': (1.05 / 2) * jogador_geral.altura_total * 0.14, 'altura': jogador_geral.altura_total * 0.14, 'qtde_inicial': 4 }
    },
    'fichas': {
        'dimensoes': { 'largura': (limite_digitos.fichas.maximo + 4) * (1.05 / 2) * 12 },
        'digito': { 'largura': (1.05 / 2) * 12, 'altura': 12, 'qtde_inicial': 4 }
    } //A quantidade inicial $0,00 possui 4 dígitos

}

carta = {
    'dimensoes': {
        'altura_total': mesa.altura_total * proporcao_altura_mesa_carta,
        'largura_total': ((mesa.altura_total * proporcao_altura_mesa_carta * imagem_carta.largura_original) / imagem_carta.altura_original),
    },
    'posicao': {
        'primeira': {
            'principal': { 'x': 0.12, 'y': 0.79 },
            'secundaria': { 'x': 0.15, 'y': 0.7 }
        },
        'segunda': {
            'principal': { 'x': 0.48, 'y': 0.79 },
            'secundaria': { 'x': 0.45, 'y': 0.7 }
        }
    },
    'figura': {
        'valete': { 'simbolo': 'J', 'valor': 11 },
        'dama': { 'simbolo': 'Q', 'valor': 12 },
        'rei': { 'simbolo': 'K', 'valor': 13 },
        'as': { 'simbolo': 'A', 'valor': 14 }
    },
    'naipe': { 'ouros': 'd', 'espadas': 's', 'copas': 'h', 'paus': 'c' },
    'escala_ao_centro': { 'minimo': 0.4, 'maximo': 0.6 },
    'opacidade_ao_centro': { 'minimo': 0.0, 'maximo': 0.8 },
};

ficha = {
    'dimensoes': {
        'altura': 21,
        'largura': 27
    },
    'caixa_fichas': {
        'largura': 80
    }
}

ficha_valores = [{
        'valor': 500,
        'imagem': 'images/1.png'
    }, {
        'valor': 100,
        'imagem': 'images/2.png'
    }, {
        'valor': 25,
        'imagem': 'images/3.png'
    }, {
        'valor': 5,
        'imagem': 'images/4.png'
    }, {
        'valor': 1,
        'imagem': 'images/5.png'
    }] //Ordenar sempre do maior valor para o menor



parametros_animacao = {
    'anima_opacity': { 'fator': 0.1, 'tempo': 30 },
    'muda_digito': { 'velocidade': 100 },
    'roda_digito': { 'velocidade_rolagem': 3 },
    'anima_carta': { 'movimento_carta_velocidade': 1, 'movimento_carta_step': 1 },
    'anima_fichas': { 'limite_fichas': 10, 'distancia_entre_fichas': 4, 'inicio_queda': -50, 'velocidade': 0.1 },
    'anima_fichas2': [{
            'posicao': 40,
            'velocidade': 1
        },
        {
            'posicao': 15,
            'velocidade': 1
        }, {
            'posicao': 15,
            'velocidade': 1
        }, {
            'posicao': 5,
            'velocidade': 1
        },
        {
            'posicao': 5,
            'velocidade': 1
        }
    ],
    'anima_principal': { 'margem_centro': 1 },
    'barra_tempo': { 'tempo_em_segundos': 10 }

}

conjunto_jogadores = [{
            'id': 0,
            'nome': 'Tony Balada',
            'proporcao': 1.1,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.15 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.30 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 1,
            'nome': 'Maria Maçã',
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'proporcao': 1,
            'posicao_centro': { 'x': mesa.largura_total * 0.85, 'y': mesa.altura_total * 0.33 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.68, 'y': mesa.altura_total * 0.35 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 2,
            'nome': 'Maria Maçã',
            'proporcao': 0.9,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.85, 'y': mesa.altura_total * 0.66 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.70, 'y': mesa.altura_total * 0.58 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 3,
            'nome': 'Tony Balada',
            'proporcao': 0.8,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.80 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.58, 'y': mesa.altura_total * 0.65 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 4,
            'nome': 'Maria Maçã',
            'proporcao': 0.7,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.15, 'y': mesa.altura_total * 0.66 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.30, 'y': mesa.altura_total * 0.60 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 5,
            'nome': 'Maria Maçã',
            'proporcao': 0.6,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.15, 'y': mesa.altura_total * 0.33 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.32, 'y': mesa.altura_total * 0.32 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
    ] //O posicionamento dos jogadores é proporcional ao tamanho da imagem do fundo, portanto varia de 0,0 - canto superior direito a 1,1 - canto inferior direito. 


//posicao da carta é o valor de 0 a 1 entre a esquerda e a direita da imagem do jogador. 

variavel_jogador = 0;
tempo_muda_digito = parametros_animacao.muda_digito.velocidade;
limite_minimo_digitos = 0;
demo_animacao_atual = 0;
limitante_jogadores_demo = 0;



function init() {
    html_mesa = "<div id=\'mesa\' style=\'background-image: url(\"" + mesa.imagem + "\");background-repeat: no-repeat;background-size: " + mesa.largura_total + "px " + mesa.altura_total + "px;height:" + mesa.altura_total + "px;width:" + mesa.largura_total + "px;\'></div>";

    tamanho_digito = 12;
    document.getElementById('body').innerHTML = html_mesa;
    html = '';
    for (num_jogador = 0; num_jogador < conjunto_jogadores.length; num_jogador++) {
        margin_left = (conjunto_jogadores[num_jogador].posicao_centro.x - jogador_geral.largura_total * proporcao_centro_jogador_largura_jogador * conjunto_jogadores[num_jogador].proporcao)
        margin_top = (conjunto_jogadores[num_jogador].posicao_centro.y - jogador_geral.altura_total * proporcao_centro_jogador_altura_jogador);
        html = "<div style='position:absolute;z-index:2;margin-left:" + margin_left + "px;margin-top:" + margin_top + "px'><img src='" + conjunto_jogadores[num_jogador].imagem + "' style='width:" + jogador_geral.largura_total * conjunto_jogadores[num_jogador].proporcao + "px'></div>";
        html = html + "<div style='position:absolute;z-index:3;margin-left:" + (margin_left * 1 + texto.nome_jogador.posicao.x * conjunto_jogadores[num_jogador].proporcao) + "px;margin-top:" + (margin_top * 1 + texto.nome_jogador.posicao.y * conjunto_jogadores[num_jogador].proporcao) + "px;color:white;font-weight:bold;width:" + texto.nome_jogador.dimensoes.largura * conjunto_jogadores[num_jogador].proporcao + "px;height:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[num_jogador].proporcao + "px;text-align:right;font-family:sans-serif;font-size:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[num_jogador].proporcao + "px'>" + conjunto_jogadores[num_jogador].nome + "</div>";
        html = html + "<div style='position:absolute;z-index:4;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[num_jogador].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[num_jogador].proporcao) + "px;'><div id='campopot" + num_jogador + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[num_jogador].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[num_jogador].proporcao + "px;text-align:right;margin-top:" + texto.valor_jogador.posicao.y * conjunto_jogadores[num_jogador].proporcao + "px;'><div id='totalpot" + num_jogador + "' style='font-family:sans-serif;'></div></div></div>";
        html = html + "<div style='position:absolute;z-index:5;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[num_jogador].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[num_jogador].proporcao) + "px;'><div style='display:block;overflow-y:hidden;overflow-x:hidden;float:left;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[num_jogador].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[num_jogador].proporcao + "px;text-align:left;margin-top:" + (texto.valor_jogador.posicao.y + texto.valor_jogador.digito.altura + 5) * conjunto_jogadores[num_jogador].proporcao + "px;background'><div  id='barra_tempo" + num_jogador + "' style='background-image:url(\"images/barra_tempo.png\");width:" + (texto.valor_jogador.dimensoes.largura - 4) * conjunto_jogadores[num_jogador].proporcao + "px;height:" + 5 * conjunto_jogadores[num_jogador].proporcao + "px'></div></div></div>";
        html = html + "<div id='caixa_fichas_jogador" + num_jogador + "' style='position:absolute;display:none;opacity:0;overflow-y:hidden;overflow-x:hidden;width:" + ficha.caixa_fichas.largura + "px;height:" + ficha.dimensoes.altura + "px;margin-top:" + conjunto_jogadores[num_jogador].posicao_ficha.y + "px;margin-left:" + (conjunto_jogadores[num_jogador].posicao_ficha.x - (ficha.caixa_fichas.largura / 2)) + "px'></div>";
        html = html + "<div style='position:absolute;z-index:4;width:" + texto.fichas.dimensoes.largura + "px;margin-left:" + (conjunto_jogadores[num_jogador].posicao_ficha.x - texto.fichas.dimensoes.largura / 2) + "px;'><div id='campofichas" + num_jogador + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.fichas.digito.altura + "px;background-color:gray;color:white;opacity:0%;border:3px solid gray;border-radius:3px;font-family:sans-serif;font-size:" + texto.fichas.digito.altura + "px;text-align:right;margin-top:" + (conjunto_jogadores[num_jogador].posicao_ficha.y * 1 + (ficha.dimensoes.altura / 2) - texto.fichas.digito.altura) + "px;z-index:4'><div id='totalfichas" + num_jogador + "' style='float:right'></div></div></div>";
        html = html + "<div id='caixa_cartas_jogador" + num_jogador + "' style='position:absolute;overflow-y:hidden;overflow-x:hidden;width:" + jogador_geral.largura_total * conjunto_jogadores[num_jogador].proporcao + "px;height:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[num_jogador].proporcao + "px;margin-top:" + margin_top + "px;margin-left:" + margin_left + "px'>";
        html = html + "<div id='carta1_jogador" + num_jogador + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;background-image:url(\"images/Back.png\");z-index:6;height:" + carta.dimensoes.altura_total * conjunto_jogadores[num_jogador].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[num_jogador].proporcao + "px;margin-left:" + (carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[num_jogador].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[num_jogador].proporcao + "px'></div>";
        html = html + "<div id='carta2_jogador" + num_jogador + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;background-image:url(\"images/Back.png\");z-index:7;height:" + carta.dimensoes.altura_total * conjunto_jogadores[num_jogador].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[num_jogador].proporcao + "px;margin-left:" + (carta.posicao.segunda.principal.x * jogador_geral.largura_total * conjunto_jogadores[num_jogador].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[num_jogador].proporcao + "px'></div></div>";

        //html = html + "<div id='marca_centro' style='position:absolute;background-color:red;z-index:20;height:3px;width:3px;margin-left:" + mesa.largura_total * mesa.centro.x + "px;margin-top:" + mesa.largura_total * mesa.centro.y + "px'></div></div>";
        //html = html + "<div id='marca_posicao_ficha" + num_jogador + "' style='position:absolute;background-color:blue;z-index:20;height:3px;width:3px;margin-left:" + conjunto_jogadores[num_jogador].posicao_ficha.x + "px;margin-top:" + conjunto_jogadores[num_jogador].posicao_ficha.y + "px'></div></div>";

        digitos_por_jogador[num_jogador] = { 'pot': { 'maximo': 0, 'minimo': 0, 'atual': 0 }, 'fichas': { 'maximo': 0, 'minimo': 0, 'atual': 0 } };
        inicializa_digitos_max_min(num_jogador, 'todos');

        document.getElementById('mesa').innerHTML = document.getElementById('mesa').innerHTML + html;
        inicializa_digitos_valores(num_jogador, 'fichas');
        inicializa_digitos_valores(num_jogador, 'pot');


    }
    variavel_jogador = 0;
    proxima_animacao_demo(5000);
}

/*
    BLOCO DE CHAMADA DE DEMONSTRAÇÕES DE USO DOS MÉTODOS. AS EXPLICAÇÕES ESTÃO NOS MÉTODOS CHAMADOS
*/

function proxima_animacao_demo(velocidade) {
    switch (demo_animacao_atual) {
        case 0:
            alert("Demo primeira vez");
            demo_primeira_vez(velocidade);
            break;
        case 1:
            alert("Demo operações - Subtração");
            demo_operacoes_subtracao(velocidade);
            break;
        case 2:
            alert("Demo operações - Soma");
            demo_operacoes_adicao(velocidade);
            break;
        case 3:
            alert("Demo números aleatórios");
            demo_numeros_aleatorios(velocidade);
            break;
        case 4:
            alert("Demo anima fichas - Valor entrada:1.262 - 2 fichas de cada em 5");
            demo_anima_fichas(velocidade);
            break;
        case 5:
            alert("Demo fichas -> centro");
            demo_fichas_centro(velocidade);
            break;
        case 6:
            alert("Demo anima cartas - Levantar cartas -> principal");
            demo_cartas_levantar_principal(velocidade);
            break;
        case 7:
            alert("Demo anima cartas - Jogador Principal -> Jogador Secundário");
            demo_cartas_principal_secundario(velocidade);
            break;
        case 8:
            alert("Demo anima cartas - Abaixar cartas");
            demo_cartas_abaixar(velocidade);
            break;
        case 9:
            alert("Demo anima cartas - Levantar cartas -> secundario");
            demo_cartas_levantar_secundario(velocidade);
            break;
        case 10:
            alert("Demo anima cartas - Jogador Secundário -> Jogador Principal");
            demo_cartas_secundario_principal(velocidade);
            break;
        case 11:
            alert("Demo anima cartas - Revelar cartas");
            demo_cartas_revelar(velocidade);
            break;
        case 12:
            alert("Demo anima cartas - Cartas ao centro");
            demo_cartas_centro(velocidade);
            break;
        case 13:
            alert("Demo barra tempo - 10s");
            demo_barra_tempo(velocidade);
            break;
        case 14:
            alert("Fim das demonstrações");
            break;
    }
    demo_animacao_atual++;
}


function demo_primeira_vez(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {

        anima_opacity('campofichas' + variavel_jogador, 'aumenta', '0.6', 0);
        valor_atual = conjunto_jogadores[variavel_jogador].valor['pot'];
        valor_final = 9000000;
        conjunto_jogadores[variavel_jogador].valor['pot'] = valor_final;
        muda_digito('pot', variavel_jogador, valor_final, valor_atual);

        valor_atual = conjunto_jogadores[variavel_jogador].valor['fichas'];
        valor_final = 200870543;
        conjunto_jogadores[variavel_jogador].valor['fichas'] = valor_final;
        muda_digito('fichas', variavel_jogador, valor_final, valor_atual);

        setTimeout(function() {
            variavel_jogador++;
            demo_primeira_vez(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(10000);
    }
}

function demo_operacoes_adicao(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {

        operacao(variavel_jogador, 'pot', 'adicao', 9001234);

        operacao(variavel_jogador, 'fichas', 'subtracao', 9001234);

        setTimeout(function() {
            variavel_jogador++;
            demo_operacoes_adicao(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(3000);
    }
}

function demo_operacoes_subtracao(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {

        operacao(variavel_jogador, 'pot', 'subtracao', 8906789);

        operacao(variavel_jogador, 'fichas', 'adicao', 8906789);

        setTimeout(function() {
            variavel_jogador++;
            demo_operacoes_subtracao(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(3000);
    }
}

function demo_numeros_aleatorios(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        valor_atual = conjunto_jogadores[variavel_jogador].valor['pot'];
        valor_final = Math.round((Math.random() * valor_atual));
        conjunto_jogadores[variavel_jogador].valor['pot'] = valor_final;
        muda_digito('pot', variavel_jogador, valor_final, valor_atual);

        valor_atual = conjunto_jogadores[variavel_jogador].valor['fichas'];
        valor_final = Math.round((Math.random() * valor_atual));
        conjunto_jogadores[variavel_jogador].valor['fichas'] = valor_final;
        muda_digito('fichas', variavel_jogador, valor_final, valor_atual);

        setTimeout(function() {
            variavel_jogador++;
            demo_numeros_aleatorios(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_cartas_levantar_principal(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'levantar->principal');


        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_levantar_principal(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_cartas_centro(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'cartas->centro');


        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_centro(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(11000);
    }
}

function demo_anima_fichas(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_opacity('campofichas' + variavel_jogador, 'diminui', '0.0', 0.8)

        //grupos_fichas = valor_em_fichas(conjunto_jogadores[variavel_jogador].valor['fichas'])
        grupos_fichas = valor_em_fichas(1262);
        anima_fichas(variavel_jogador, grupos_fichas);
        setTimeout(function() {
            variavel_jogador++;
            demo_anima_fichas(velocidade);
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(3000);
    }
}

function demo_fichas_centro(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'fichas->centro');
        setTimeout(function() {
            variavel_jogador++;
            demo_fichas_centro(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_cartas_levantar_secundario(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'levantar->secundario');


        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_levantar_secundario(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}


function demo_cartas_principal_secundario(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'principal->secundario');


        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_principal_secundario(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_cartas_secundario_principal(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'secundario->principal');

        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_secundario_principal(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_cartas_revelar(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        revela_cartas(variavel_jogador, 'A', 'c', 'K', 'h');


        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_revelar(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_cartas_abaixar(velocidade) {

    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {
        anima_principal(variavel_jogador, 'abaixar');

        setTimeout(function() {
            variavel_jogador++;
            demo_cartas_abaixar(velocidade)
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}

function demo_barra_tempo(velocidade) {
    if (variavel_jogador < conjunto_jogadores.length - limitante_jogadores_demo) {

        conta_tempo_barra(variavel_jogador, true);
        setTimeout(function() {
            variavel_jogador++;
            demo_barra_tempo(velocidade);
        }, velocidade);
    } else {
        variavel_jogador = 0;
        proxima_animacao_demo(1000);
    }
}


/**
 * Função: CONTA_TEMPO_BARRA
 * Objetivo: animação da barra de contagem de tempo
 * Como: diminui o tamanho do DIV conforme o tempo passa com um background fixo com gradiente de cores para esse DIV.
 * Observações:
 * 
 */
function conta_tempo_barra(num_jogador, init = true, tempo = 0) {

    if (init) {
        tempo = parametros_animacao.barra_tempo.tempo_em_segundos * 100;
        document.getElementById('barra_tempo' + num_jogador).style.display = 'block';
        document.getElementById('barra_tempo' + num_jogador).style.width = (texto.valor_jogador.dimensoes.largura - 4) * conjunto_jogadores[num_jogador].proporcao + 'px'
        init = false;
    }

    if ((document.getElementById('barra_tempo' + num_jogador).style.width.replace('px', '') * 1) >= 0) {

        document.getElementById('barra_tempo' + num_jogador).style.width = ((texto.valor_jogador.dimensoes.largura - 4) * conjunto_jogadores[num_jogador].proporcao * (tempo / (parametros_animacao.barra_tempo.tempo_em_segundos * 100))) + 'px';
        tempo--;


        setTimeout(function() {
            conta_tempo_barra(variavel_jogador, init, tempo);
        }, 10);
    }
}



/**
 * Função: ANIMA_PRINCIPAL
 * Objetivo: animações de cartas e fichas
 * Como: comentários no corpo da função.
 * Observações:
 * 
 */

function anima_principal(jogador, tipo_movimento) {

    //Movimento de fichas ao centro
    if (tipo_movimento == 'fichas->centro') {

        //Define ponto de destino das fichas nas duas coordenadas
        centro_horizontal = mesa.largura_total * mesa.centro.x;
        centro_vertical = mesa.altura_total * mesa.centro.y + (ficha.dimensoes.altura / 2);

        //Define uma margem para parar a animação antes do centro para deixar o passo da animação mais livre. Caso contrário, o passo da animação deverá alcançar exatamente o centro.
        //Sob o risco de, em caso de bug em arredondamento do próprio navegador, causar um efeito tremido. Visualmente não causa impacto.
        margem_centro = parametros_animacao.anima_principal.margem_centro;

        //Define ponto de origem das fichas nas duas coordenadas
        margin_left = conjunto_jogadores[jogador].posicao_ficha.x;
        margin_top = conjunto_jogadores[jogador].posicao_ficha.y;


        //Definições dos parâmetros a e b da equação da reta y=a*x+b por onde as fichas irão percorrer
        a = (margin_top - centro_vertical) / (margin_left - centro_horizontal);
        b = margin_top - a * margin_left;
        anima = true;


        //O passo da animação de caminhada sobre a equação da reta deverá ser o mesmo para todas as fichas, independentemente do ângulo. Porém, como y é definido em função de x,
        //é feito o rebatimento da reta no eixo x e o step_x será step_reta*(cosseno do ângulo entre o eixo x e a reta)
        step_x = parametros_animacao.anima_carta.movimento_carta_step * (margin_left - centro_horizontal) / Math.sqrt((centro_horizontal - margin_left) * (centro_horizontal - margin_left) + (centro_vertical - margin_top) * (centro_vertical - margin_top));

        //Se as fichas estiverem à direita do centro.


        if ((document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2)) > (centro_horizontal + margem_centro)) {

            //Bloco movimento
            document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 - step_x) + 'px';
            x = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1) + Math.round(ficha.caixa_fichas.largura / 2);
            y = a * x + b;

            document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop = y + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade
            taxa_reducao = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2) - centro_horizontal) / (margin_left - centro_horizontal);

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.
            document.getElementById('caixa_fichas_jogador' + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
        }
        //Se as fichas estiverem à esquerda do centro.
        else if ((document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2)) < (centro_horizontal - margem_centro)) {

            //Bloco movimento
            document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 - step_x) + 'px';

            x = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1) + Math.round(ficha.caixa_fichas.largura / 2);
            y = a * x + b;
            document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop = y + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade            
            taxa_reducao = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2) - centro_horizontal) / (margin_left - centro_horizontal);

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.            
            document.getElementById('caixa_fichas_jogador' + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
        }
        //Para os casos em que as fichas não possuem deslocamento em x e estão localizadas abaixo do centro
        else if ((document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop.replace('px', '') * 1) > (centro_vertical + margem_centro)) {

            //Bloco movimento
            step = (parametros_animacao.anima_carta.movimento_carta_velocidade);
            document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop = ((document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop.replace('px', '') * 1) - step) + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                    
            taxa_reducao = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
            document.getElementById('caixa_fichas_jogador' + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
        }
        //Para os casos em que as fichas não possuem deslocamento em x e estão localizadas acima do centro
        else if ((document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop.replace('px', '') * 1) < (centro_vertical - margem_centro)) {

            //Bloco movimento
            step = (parametros_animacao.anima_carta.movimento_carta_velocidade);
            document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop = ((document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop.replace('px', '') * 1) + step) + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                        
            taxa_reducao = (document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
            document.getElementById('caixa_fichas_jogador' + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
        } else {
            anima = false;
        }

        if (anima)
            setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
    }


    //Movimento de cartas ao centro. As cartas estão dentro de um compartimento chamado caixa_cartas_jogador. É ela quem anda sobre a reta.    
    if (tipo_movimento == 'cartas->centro') {

        largura_caixa_cartas = document.getElementById('caixa_cartas_jogador' + jogador).style.width.replace('px', '') * 1;
        altura_caixa_cartas = document.getElementById('caixa_cartas_jogador' + jogador).style.height.replace('px', '') * 1;

        //Define ponto de destino das fichas nas duas coordenadas        
        centro_horizontal = mesa.largura_total * mesa.centro.x - (largura_caixa_cartas / 2);
        centro_vertical = mesa.altura_total * mesa.centro.y + (altura_caixa_cartas / 4);

        //Define uma margem para parar a animação antes do centro para deixar o passo da animação mais livre. Caso contrário, o passo da animação deverá alcançar exatamente o centro.
        //Sob o risco de, em caso de bug em arredondamento do próprio navegador, causar um efeito tremido. Visualmente não causa impacto.
        margem_centro = 1;

        //Define ponto de origem das fichas nas duas coordenadas        
        margin_left = (conjunto_jogadores[jogador].posicao_centro.x - jogador_geral.largura_total * proporcao_centro_jogador_largura_jogador);
        margin_top = (conjunto_jogadores[jogador].posicao_centro.y - jogador_geral.altura_total * proporcao_centro_jogador_altura_jogador); //Se alterar em init, alterar aqui também.                        


        //Definições dos parâmetros a e b da equação da reta y=a*x+b por onde as fichas irão percorrer        
        a = (margin_top - centro_vertical) / (margin_left - centro_horizontal);
        b = margin_top - a * margin_left;
        anima = true;

        if ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1) > centro_horizontal + margem_centro) {
            //Bloco movimento
            document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft = ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1) - parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            x = (document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1);
            y = a * x + b;
            document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop = y + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                    
            taxa_reducao = (document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 - centro_horizontal) / (margin_left - centro_horizontal);

            //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
            document.getElementById("carta1_jogador" + jogador).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta1_jogador" + jogador).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta2_jogador" + jogador).style.height = document.getElementById("carta1_jogador" + jogador).style.height;
            document.getElementById("carta2_jogador" + jogador).style.width = document.getElementById("carta1_jogador" + jogador).style.width;

            //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
            document.getElementById("carta1_jogador" + jogador).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';
            document.getElementById("carta2_jogador" + jogador).style.marginLeft = document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 + document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
            document.getElementById("carta1_jogador" + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            document.getElementById("carta2_jogador" + jogador).style.opacity = document.getElementById("carta1_jogador" + jogador).style.opacity;
        } else if ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1) < centro_horizontal - margem_centro) {
            //Bloco movimento
            document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft = ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1) + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            x = (document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1);
            y = a * x + b;
            document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop = y + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                                
            taxa_reducao = (document.getElementById('caixa_cartas_jogador' + jogador).style.marginLeft.replace('px', '') * 1 - centro_horizontal) / (margin_left - centro_horizontal);

            //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                                   
            document.getElementById("carta1_jogador" + jogador).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta1_jogador" + jogador).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta2_jogador" + jogador).style.height = document.getElementById("carta1_jogador" + jogador).style.height;
            document.getElementById("carta2_jogador" + jogador).style.width = document.getElementById("carta1_jogador" + jogador).style.width;

            //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
            document.getElementById("carta1_jogador" + jogador).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';
            document.getElementById("carta2_jogador" + jogador).style.marginLeft = document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 + document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';

            document.getElementById("carta1_jogador" + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            document.getElementById("carta2_jogador" + jogador).style.opacity = document.getElementById("carta1_jogador" + jogador).style.opacity;
        } else if ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop.replace('px', '') * 1) > centro_vertical + margem_centro) {
            //Bloco movimento
            document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop = ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop.replace('px', '') * 1) - parametros_animacao.anima_carta.movimento_carta_step) + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                                
            taxa_reducao = (document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

            //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                                   
            document.getElementById("carta1_jogador" + jogador).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta1_jogador" + jogador).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta2_jogador" + jogador).style.height = document.getElementById("carta1_jogador" + jogador).style.height;
            document.getElementById("carta2_jogador" + jogador).style.width = document.getElementById("carta1_jogador" + jogador).style.width;

            //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
            document.getElementById("carta1_jogador" + jogador).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';
            document.getElementById("carta2_jogador" + jogador).style.marginLeft = document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 + document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
            document.getElementById("carta1_jogador" + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            document.getElementById("carta2_jogador" + jogador).style.opacity = document.getElementById("carta1_jogador" + jogador).style.opacity;
        } else if ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop.replace('px', '') * 1) < centro_vertical - margem_centro) {
            //Bloco movimento
            document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop = ((document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop.replace('px', '') * 1) + parametros_animacao.anima_carta.movimento_carta_step) + 'px';

            //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                                
            taxa_reducao = (document.getElementById('caixa_cartas_jogador' + jogador).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

            //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                                   
            document.getElementById("carta1_jogador" + jogador).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta1_jogador" + jogador).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
            document.getElementById("carta2_jogador" + jogador).style.height = document.getElementById("carta1_jogador" + jogador).style.height;
            document.getElementById("carta2_jogador" + jogador).style.width = document.getElementById("carta1_jogador" + jogador).style.width;

            //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
            document.getElementById("carta1_jogador" + jogador).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';
            document.getElementById("carta2_jogador" + jogador).style.marginLeft = document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 + document.getElementById("carta1_jogador" + jogador).style.width.replace('px', '') * 1 + 'px';

            //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
            document.getElementById("carta1_jogador" + jogador).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            document.getElementById("carta2_jogador" + jogador).style.opacity = document.getElementById("carta1_jogador" + jogador).style.opacity;
        } else {
            anima = false;
        }
        if (anima)
            setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
    }

    if (tipo_movimento == 'levantar->secundario') {
        //Identifica se a carta está na posição do jogador secundário e levanta a carta
        if (((document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1) >= (Math.round(10000 * carta.posicao.primeira.secundaria.x * jogador_geral.largura_total * conjunto_jogadores[jogador].proporcao)) / 10000) && ((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))) {
            if ((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))
                document.getElementById("carta1_jogador" + jogador).style.marginTop = (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            if ((document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.segunda.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))
                document.getElementById("carta2_jogador" + jogador).style.marginTop = (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }

    }


    if (tipo_movimento == 'levantar->principal') {
        //Identifica se a carta está na posição do jogador secundário e levanta a carta
        if (((document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1) <= (Math.round(10000 * carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[jogador].proporcao)) / 10000) && ((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.primeira.principal.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))) {
            if ((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.primeira.principal.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao)) {
                document.getElementById("carta1_jogador" + jogador).style.marginTop = (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            }
            if ((document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.segunda.principal.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))
                document.getElementById("carta2_jogador" + jogador).style.marginTop = (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }
    }


    if (tipo_movimento == 'abaixar') {
        //abaixa a carta até o 'pé' do compartimento de cartas (caixa_cartas_jogador)
        if ((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) < (document.getElementById('caixa_cartas_jogador' + jogador).style.height.replace('px', ''))) {
            document.getElementById("carta1_jogador" + jogador).style.marginTop = (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            document.getElementById("carta2_jogador" + jogador).style.marginTop = (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
            setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }
    }

    //Se o movimento for da posição de cartas do jogador principal para o secundário e as cartas estiverem entre a posição primária e secundária, anima.
    if ((tipo_movimento == 'principal->secundario') && (((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) < ((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao)))) {

        if (document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 < (carta.posicao.primeira.secundaria.x * jogador_geral.largura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta1_jogador" + jogador).style.marginLeft = ((document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1) + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
        if (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 < ((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao)) {
            document.getElementById("carta1_jogador" + jogador).style.marginTop = ((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) + (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
        }
        if (document.getElementById("carta2_jogador" + jogador).style.marginLeft.replace('px', '') * 1 > (carta.posicao.segunda.secundaria.x * jogador_geral.largura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta2_jogador" + jogador).style.marginLeft = ((document.getElementById("carta2_jogador" + jogador).style.marginLeft.replace('px', '') * 1) - parametros_animacao.anima_carta.movimento_carta_step) + 'px';
        if (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 < ((1 - carta.posicao.segunda.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta2_jogador" + jogador).style.marginTop = ((document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1) + (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';

        setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
    }

    //Se o movimento for da posição de cartas do jogador secundário para o principal e as cartas estiverem entre a posição primária e secundária, anima.
    if ((tipo_movimento == 'secundario->principal') && (((document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.primeira.principal.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao)))) { // && (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 > (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 + (carta.dimensoes.altura_total / carta.dimensoes.largura_total)))) {

        if (document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 > (carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta1_jogador" + jogador).style.marginLeft = (document.getElementById("carta1_jogador" + jogador).style.marginLeft.replace('px', '') * 1 - parametros_animacao.anima_carta.movimento_carta_step) + 'px';
        if (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 > ((1 - carta.posicao.primeira.principal.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta1_jogador" + jogador).style.marginTop = (document.getElementById("carta1_jogador" + jogador).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
        if (document.getElementById("carta2_jogador" + jogador).style.marginLeft.replace('px', '') * 1 < (carta.posicao.segunda.principal.x * jogador_geral.largura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta2_jogador" + jogador).style.marginLeft = (document.getElementById("carta2_jogador" + jogador).style.marginLeft.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
        if (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 > ((1 - carta.posicao.segunda.principal.y) * jogador_geral.altura_total * conjunto_jogadores[jogador].proporcao))
            document.getElementById("carta2_jogador" + jogador).style.marginTop = (document.getElementById("carta2_jogador" + jogador).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';

        setTimeout(function() { anima_principal(jogador, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
    }

}


/**
 * Função: REVELA_CARTAS
 * Objetivo: mostrar cartas.
 * Como: montando imagem de background com a composição do nome do símbolo e do naipe.
 * Observações:
 * 1. todas as combinações devem estar na pasta de imagens.
 * 2. O valor e naipe estão como entrada para que venham do servidor no ato da apresentação
 */
function revela_cartas(jogador, primeira_valor, primeira_naipe, segunda_valor, segunda_naipe) {
    document.getElementById("carta1_jogador" + jogador).style.backgroundImage = "url('images/" + primeira_valor + primeira_naipe + ".png')";
    document.getElementById("carta2_jogador" + jogador).style.backgroundImage = "url('images/" + segunda_valor + segunda_naipe + ".png')";
}

/**
 * Função: ESCONDE_CARTAS
 * Objetivo: esconder valor das cartas.
 * Como: montando imagem de background com a imagem das costas das cartas. 
 * Observações: 
 */
function esconde_cartas(jogador) {
    document.getElementById("carta1_jogador" + jogador).style.backgroundImage = "url('images/Back.png')";
    document.getElementById("carta2_jogador" + jogador).style.backgroundImage = "url('images/Back.png')";
}

/**
 * Função: OPERAÇÃO
 * Objetivo: realizar operações matemáticas nos elementos pot e fichas.
 * Como:
 * 1. Realiza as operações matemáticas com o valor inicial, valor da operação e atualiza o valor final.
 * 2. Chama a função muda_digito para rolar os dígitos de acordo com o resultado da operação. 
 *  
 */

function operacao(jogador, ficha_ou_pot, operacao, valor_operacao) {
    valor_atual = conjunto_jogadores[jogador].valor[ficha_ou_pot];
    if (operacao == 'adicao')
        valor_final = valor_atual + valor_operacao;
    else if (operacao == 'subtracao')
        valor_final = valor_atual - valor_operacao;
    else if (operacao == 'multiplicacao')
        valor_final = valor_atual * valor_operacao;
    else if (operacao == 'divisao')
        valor_final = Math.floor(valor_atual / valor_operacao);
    conjunto_jogadores[jogador].valor[ficha_ou_pot] = valor_final;
    muda_digito(ficha_ou_pot, jogador, valor_final, valor_atual);
}




/**
 * Função: MUDA_DIGITO
 * Objetivo: realizar animações de deslocamento de dígitos e comandos sobre os dígitos a serem rolados nos espaços ficha e pot.
 * Como: comentários no corpo da função
 * Observações: dependendo do local do usuário, localeString muda, trocando . por , e vice-versa.
 * 
 */
//Muda digito, monta número, deslocando à esquerda - Apenas deslocar a diferença entre valor inicial e final. Se valor final tiver mais dígitos que o inicial, movimenta à esquerda. Se tiver menos, movimenta à direita.
function muda_digito(fichas_ou_pot, jogador, valor_final, valor_inicial, tira_digito = false, qtde_digitos_adicionais = 0) {


    if (parseInt((valor_final + '').replace(/\D/g, ''), 10) > parseInt((valor_inicial + '').replace(/\D/g, ''), 10)) {
        conjunto_jogadores[jogador]['direcao'][fichas_ou_pot] = "para baixo";
    } else {
        conjunto_jogadores[jogador]['direcao'][fichas_ou_pot] = "para cima";
    }

    //Converte número em texto com . e , corretos.
    valor_final = valor_final.toLocaleString();
    valor_inicial = valor_inicial.toLocaleString();

    if (valor_final.length < valor_inicial.length) {
        zeros = "000.000.000.000.000.000.000";

        if ((tira_digito == false) && (digitos_por_jogador[jogador][fichas_ou_pot]['atual'] <= (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - parseInt((valor_final + '').replace(/\D/g, ''), 10).toLocaleString().length))) {
            qtde_digitos_adicionais = zeros.substring(zeros.length - valor_inicial.length, zeros.length - valor_final.length).length;
            tira_digito = true;
        }

        valor_final = zeros.substring(zeros.length - valor_inicial.length, zeros.length - valor_final.length) + "" + valor_final
    }


    if (valor_inicial == undefined)
        valor_inicial = '';

    //A condição de rolagem muda dependendo da diferença de tamanho entre o valor inicial e final. 
    if (valor_final.length > valor_inicial.length) {
        direcao_deslocamento = 1;
        condicao1 = (digitos_por_jogador[jogador][fichas_ou_pot]['atual'] > (digitos_por_jogador[jogador][fichas_ou_pot]['maximo']) - valor_final.length);

    } else if (valor_final.length == valor_inicial.length) {
        direcao_deslocamento = 0;
        condicao1 = ((digitos_por_jogador[jogador][fichas_ou_pot]['atual'] > (digitos_por_jogador[jogador][fichas_ou_pot]['maximo']) - valor_final.length));

    } else {
        direcao_deslocamento = -1;
        condicao1 = ((digitos_por_jogador[jogador][fichas_ou_pot]['atual'] > (digitos_por_jogador[jogador][fichas_ou_pot]['maximo']) - valor_inicial.length));
    }


    if (condicao1) {
        setTimeout(function() {
            //Mostra primeiro dígito            
            document.getElementById(fichas_ou_pot + "jogador" + jogador + "digito" + (digitos_por_jogador[jogador][fichas_ou_pot]['atual'] * 1)).style.display = 'block';

            if ((valor_final.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_final.length) - 1) == '.') &&
                (valor_inicial.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1) == '.')) {
                roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual'], '.', '.', conjunto_jogadores[jogador]['direcao'][fichas_ou_pot], tira_digito, qtde_digitos_adicionais);
                tempo_muda_digito = 0;
            }
            //Se na rolagem o primeiro dígito ficar em branco, onde o tamanho do valor final é menor que do inicial, esconde o elemento do dígito, reduzindo o tamanho do div e seu fundo.
            else if ((valor_final.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_final.length) - 1) == '')) {
                tempo_muda_digito = 0;
            }
            //Se o valor final for maior que o inicial e a posição for de ., solicita rotação do dígito de $ para .            
            else if ((valor_final.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_final.length) - 1) == '.') &&
                (valor_inicial.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1) != '.')) {
                roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual'], '$', '.', conjunto_jogadores[jogador]['direcao'][fichas_ou_pot]);
                tempo_muda_digito = 0;
            } else if ((valor_final.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_final.length) - 1) != '.') && (valor_inicial.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1) == '.')) {
                document.getElementById(fichas_ou_pot + "jogador" + jogador + "digito" + (digitos_por_jogador[jogador][fichas_ou_pot]['atual'] * 1 - 1)).innerHTML = "<div id='" + fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual'] + "teste' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>.</div>";
                tempo_muda_digito = 0; //Quando for '.', já passa para outro dígito sem esperar o tempo de rodagem de número.
            } else {
                //Se o tamanho do valor final for menor que o inicial, tira dígitos
                if ((valor_final.length < valor_inicial.length) && (digitos_por_jogador[jogador][fichas_ou_pot]['atual'] > (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_inicial.length) && digitos_por_jogador[jogador][fichas_ou_pot]['atual'] <= (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_final.length))) {

                    roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual'], valor_inicial.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1), -1, conjunto_jogadores[jogador]['direcao'][fichas_ou_pot]);
                    tempo_muda_digito = 0;
                }
                //Se o tamanho do valor final for maior que o inicial e não for '.', roda o dígito para o número desejado
                else {
                    valor_inicial_digito = valor_inicial.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1);
                    valor_final_digito = valor_final.charAt(digitos_por_jogador[jogador][fichas_ou_pot]['atual'] - (digitos_por_jogador[jogador][fichas_ou_pot]['maximo'] - valor_final.length) - 1);


                    if (valor_inicial_digito == '') {
                        valor_inicial_digito = 0
                    }

                    i = valor_inicial_digito;
                    if ((valor_final_digito < valor_inicial_digito) && (conjunto_jogadores[jogador]['direcao'][fichas_ou_pot] == "para baixo"))
                        valor_final_digito = valor_final_digito * 1 + 10 * 1;

                    if ((valor_final_digito > valor_inicial_digito) && (conjunto_jogadores[jogador]['direcao'][fichas_ou_pot] == "para cima")) {
                        valor_inicial_digito = valor_inicial_digito * 1 + 10 * 1;
                    }

                    document.getElementById(fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual']).innerHTML = "<div id='" + fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual'] + "cifrao' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>" + i * 1 + "</div>";
                    if (conjunto_jogadores[jogador]['direcao'][fichas_ou_pot] == "para baixo")
                        document.getElementById(fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual']).style.marginTop = '0px';

                    roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + jogador + "digito" + digitos_por_jogador[jogador][fichas_ou_pot]['atual'], valor_inicial_digito * 1, valor_final_digito, conjunto_jogadores[jogador]['direcao'][fichas_ou_pot], tira_digito, qtde_digitos_adicionais);
                    tempo_muda_digito = parametros_animacao.muda_digito.velocidade;;

                }
            }
            //Desloca cursor do dígito para a esquerda
            digitos_por_jogador[jogador][fichas_ou_pot]['atual']--;
            if (qtde_digitos_adicionais > 0)
                qtde_digitos_adicionais--;
            muda_digito(fichas_ou_pot, jogador, parseInt((valor_final + '').replace(/\D/g, ''), 10), parseInt((valor_inicial + '').replace(/\D/g, ''), 10), tira_digito, qtde_digitos_adicionais);
        }, tempo_muda_digito);
    } else {
        //Finalizada a rolagem, reinicializa cursor do dígito
        inicializa_digitos_max_min(jogador, fichas_ou_pot);
    }
}

/**
 * Função: RODA_DIGITO
 * Objetivo: realizar animações de rolagem nos espaços ficha e pot.
 * Como: dependendo da direção adiciona um dígito acima ou abaixo na hora que o visível iniciar a saída da zona visível
 * Observações: 
 * 
 */
function roda_digito(fichas_ou_pot, elemento, valor_inicial, valor_final, direcao, tira_digito = false, qtde_digitos_adicionais = 0) {

    if (fichas_ou_pot == 'fichas') {
        tamanho_digito = texto.fichas.digito.altura;
        largura_digito = texto.fichas.digito.largura;
        borda = 0;
        velocidade_rolagem = parametros_animacao.roda_digito.velocidade_rolagem;
    } else {
        tamanho_digito = Math.ceil(texto.valor_jogador.dimensoes.altura);
        largura_digito = 10;
        borda = 0;
        velocidade_rolagem = parametros_animacao.roda_digito.velocidade_rolagem;
    }

    if (valor_final == -1) {
        document.getElementById(elemento).innerHTML = ' ';
    } else if (valor_final == '.') {
        document.getElementById(elemento).innerHTML = "<div id='" + elemento + "ponto' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>.</div>";

        if (tira_digito && (qtde_digitos_adicionais > 0)) {
            document.getElementById(elemento).innerHTML = ' ';
        }
    } else if (direcao == "para baixo") {

        if (valor_final != valor_inicial - 1) {
            if (document.getElementById(elemento).style.marginTop.replace('px', '') * 1 < 0) {
                document.getElementById(elemento).style.marginTop = (document.getElementById(elemento).style.marginTop.replace('px', '') * 1 + velocidade_rolagem) + "px"
                setTimeout(function() {
                    roda_digito(fichas_ou_pot, elemento, valor_inicial, valor_final, direcao, tira_digito, qtde_digitos_adicionais)
                }, 20);
            } else {
                var list = document.getElementById(elemento);
                var newItem = document.createElement("DIV");

                if (list.childNodes.length > 1) {
                    list.removeChild(list.childNodes[list.childNodes.length - 1]);
                }

                if (valor_inicial >= 9)
                    i = valor_inicial - 10 + 1;
                else
                    i = valor_inicial + 1;
                var textnode = document.createTextNode(i.toString());
                newItem.appendChild(textnode);
                list.insertBefore(newItem, list.childNodes[0]);
                list.childNodes[0].style.height = tamanho_digito + 'px'
                document.getElementById(elemento).style.marginTop = -tamanho_digito + 'px'

                setTimeout(function() {
                    roda_digito(fichas_ou_pot, elemento, valor_inicial + 1, valor_final, direcao, tira_digito, qtde_digitos_adicionais)
                }, 20);

            }
        }

    } else {
        var list = document.getElementById(elemento);
        if (valor_final != valor_inicial + 1) {
            if ((document.getElementById(elemento).style.marginTop.replace('px', '') * 1 > -tamanho_digito) && (list.childNodes.length > 1)) {
                document.getElementById(elemento).style.marginTop = (document.getElementById(elemento).style.marginTop.replace('px', '') * 1 - velocidade_rolagem) + "px"
                setTimeout(function() {
                    roda_digito(fichas_ou_pot, elemento, valor_inicial, valor_final, direcao, tira_digito, qtde_digitos_adicionais)
                }, 20);
            } else {

                var newItem = document.createElement("DIV");

                if (list.childNodes.length > 1) {

                    list.removeChild(list.childNodes[0]);
                }

                if (valor_inicial < 9)
                    i = valor_inicial + 10 - 1;
                else
                    i = valor_inicial - 1;

                if (i >= 10)
                    i -= 10;
                var textnode = document.createTextNode(i.toString());
                newItem.appendChild(textnode);
                list.appendChild(newItem);
                list.childNodes[0].style.height = tamanho_digito + 'px'

                document.getElementById(elemento).style.marginTop = '0px'

                setTimeout(function() {
                    roda_digito(fichas_ou_pot, elemento, valor_inicial - 1, valor_final, direcao, tira_digito, qtde_digitos_adicionais)
                }, 20);

            }
        } else if (tira_digito && (qtde_digitos_adicionais > 0)) {
            document.getElementById(elemento).innerHTML = ' ';
        }

    }

}

/**
 * Função: VALOR_EM_FICHAS
 * Objetivo: converter valor total de fichas em grupos de fichas por valor.
 * Como: comentários no corpo da função
 * Observações: 
 * 
 * 
 */

function valor_em_fichas(total_fichas) {

    fichas_temp = [];

    //Divide o valor total nos grupos de fichas sem contar o limite.
    //A repetição de loop é proposital para facilitar o entendimento das contas feitas para a divisão por grupos.
    //No loop seguinte, reconta até o limite.
    for (valor_ficha_unitaria = 0; valor_ficha_unitaria < ficha_valores.length; valor_ficha_unitaria++) {
        fichas_temp[valor_ficha_unitaria] = Math.floor(total_fichas / ficha_valores[valor_ficha_unitaria].valor);
        total_fichas = (total_fichas % ficha_valores[valor_ficha_unitaria].valor);
    }

    //recontar de acordo com limite para fins de animação
    pilha_fichas = parametros_animacao.anima_fichas.limite_fichas;

    for (valor_ficha_unitaria = 0; valor_ficha_unitaria < fichas_temp.length; valor_ficha_unitaria++) {
        if (fichas_temp[valor_ficha_unitaria] < pilha_fichas) {
            pilha_fichas = pilha_fichas - fichas_temp[valor_ficha_unitaria];
        } else {
            fichas_temp[valor_ficha_unitaria] = pilha_fichas;
            pilha_fichas = 0;
        }
    }

    return fichas_temp;
}

/**
 * Função: MONTA_PILHA_FICHAS
 * Objetivo: constrói html com fichas empilhadas.
 * Como: pega o array das fichas agrupadas por valor e adiciona um DIV com a imagem correspodente àquele valor, definida nos parâmetros ficha_valores
 * Observações: 
 * 1.O movimento de queda das fichas é do compartimento caixa_fichas_jogador
 * 
 */

function monta_pilha_fichas(jogador, array_fichas) {
    html = "";
    tamanho_pilha = 0;

    for (indice_valor_ficha = 0; indice_valor_ficha < array_fichas.length; indice_valor_ficha++) {
        if (array_fichas[indice_valor_ficha] > 0) {
            for (qtde_fichas_por_valor = 0; qtde_fichas_por_valor < array_fichas[indice_valor_ficha]; qtde_fichas_por_valor++) {
                tamanho_pilha++;
                html = html + "<div id='ficha" + tamanho_pilha + "jogador" + jogador + "' style='position:absolute;height:1vw;width:1vw;margin-left:" + (ficha.caixa_fichas.largura / 2 - ficha.dimensoes.largura / 2) + "px;margin-top:" + (tamanho_pilha * parametros_animacao.anima_fichas.distancia_entre_fichas) + "px;z-index:" + (100 - tamanho_pilha) + "'><img src='" + ficha_valores[indice_valor_ficha].imagem + "' /></div>";
            }
        }
    }

    //Inclui as fichas em um compartimento.
    document.getElementById('caixa_fichas_jogador' + jogador).style.height = (tamanho_pilha * parametros_animacao.anima_fichas.distancia_entre_fichas + ficha.dimensoes.altura) + 'px';
    document.getElementById('caixa_fichas_jogador' + jogador).innerHTML = html;
    return tamanho_pilha;

}

/**
 * Função: ANIMA_FICHAS
 * Objetivo: realiza animação de queda das fichas.
 * Como: depois das fichas montadas desloca as fichas e ao chegar embaixo, realiza a subida instantânea em determinado nível
 * simulando um pequeno salto
 * Observações:
 * 1. movimento é o momento em que ele está: 1 - descendo, 2 - quicando
 * 2. tempo_percurso:É o tempo de duração do movimento 
 * 3. altura percurso: É a altura do percurso 
 * 
 */

function anima_fichas(jogador, array_fichas, init = true, movimento = 0) {

    if (init) {
        tamanho_pilha = monta_pilha_fichas(jogador, array_fichas);
        chao = -1 * (ficha.dimensoes.altura / 2);
        counter1 = parametros_animacao.anima_fichas.inicio_queda;

    }

    document.getElementById('caixa_fichas_jogador' + jogador).style.display = 'block';

    if (movimento < parametros_animacao.anima_fichas2.length) {

        if (movimento % 2 == 0) //Movimento de descida
        {
            document.getElementById('caixa_fichas_jogador' + jogador).style.opacity = document.getElementById('caixa_fichas_jogador' + jogador).style.opacity * 1 + 0.02;

            if (counter1 < chao)
                counter1 += parametros_animacao.anima_fichas2[movimento].velocidade;
            else {
                movimento++;
                for (posicao_pilha = 1; posicao_pilha <= tamanho_pilha; posicao_pilha++) {
                    //Quando chegar no chão, espalha as fichas em um movimento aleatório                                    
                    aleatorio = (Math.random() - 0.5) * 1; //A variação é entre um leve deslocamento à direita e esquerda. Caso deseje aumentar a distância entre fichas, basta aumentar o valor onde está 0.5
                    document.getElementById("ficha" + posicao_pilha + "jogador" + jogador).style.marginLeft = (document.getElementById("ficha" + posicao_pilha + "jogador" + jogador).style.marginLeft.replace('px', '') * 1 + aleatorio) + 'px'; //aleatorio + 'px'; //(conjunto_jogadores[jogador].posicao_ficha.x * 1 + Math.random() * 10) + 'px';
                }
            }
        } else //Movimento de subida
        {
            if (counter1 >= -parametros_animacao.anima_fichas2[movimento].posicao + chao)
                counter1 -= parametros_animacao.anima_fichas2[movimento].velocidade;
            else
                movimento++;
        }
        document.getElementById('caixa_fichas_jogador' + jogador).style.marginTop = (conjunto_jogadores[jogador].posicao_ficha.y + counter1) + 'px';
        setTimeout(function() { anima_fichas(jogador, array_fichas, false, movimento) }, parametros_animacao.anima_fichas.velocidade);
    }


}

/**
 * Função: INICIALIZA_DIGITOS_MAX_MIN
 * Objetivo: inicializar jogador com a quantidade máxima de dígitos para os espaços pot e fichas. Zerar o cursor do dígito que está sendo percorrido.
 * Como: 
 * Observações: 
 * 
 */
function inicializa_digitos_max_min(num_jogador, ficha_ou_pot) {
    if (ficha_ou_pot == 'todos') {
        digitos_por_jogador[num_jogador]['pot']['maximo'] = limite_digitos['pot']['maximo'];
        digitos_por_jogador[num_jogador]['pot']['atual'] = limite_digitos['pot']['atual'];
        digitos_por_jogador[num_jogador]['pot']['minimo'] = limite_digitos['pot']['minimo'];
        digitos_por_jogador[num_jogador]['fichas']['maximo'] = limite_digitos['fichas']['maximo'];
        digitos_por_jogador[num_jogador]['fichas']['atual'] = limite_digitos['fichas']['atual'];
        digitos_por_jogador[num_jogador]['fichas']['minimo'] = limite_digitos['fichas']['minimo'];
    } else {
        digitos_por_jogador[num_jogador][ficha_ou_pot]['maximo'] = limite_digitos[ficha_ou_pot]['maximo'];
        digitos_por_jogador[num_jogador][ficha_ou_pot]['atual'] = limite_digitos[ficha_ou_pot]['atual'];
        digitos_por_jogador[num_jogador][ficha_ou_pot]['minimo'] = limite_digitos[ficha_ou_pot]['minimo'];
    }

}

/**
 * Função: INICIALIZA_DIGITOS_VALORES
 * Objetivo: criar lista de números a serem rolados. O total de dígitos é a quatidade que o placar suporta. 1 a 0, $ e . Total:12 digitos.
 * Como: um elemento div é encaixado em cima do outro com os seguintes dígitos $, .,0(se for o primeiro dígito)/espaço (para os demais dígitos),1,2,3,4,5,6,7,8,9,0.
 * Observações: 
 * 
 */

function inicializa_digitos_valores(jogador, fichas_ou_pot) {

    total_digitos = limite_digitos[fichas_ou_pot]['maximo'];

    if (fichas_ou_pot == 'fichas') {

        tamanho_digito = texto.fichas.digito.altura;
        largura_numero = texto.fichas.digito.largura;
        borda = 0;
        margem_superior = 0 //-1 * (tamanho_digito + 2 * borda) // * 12;
    } else {

        tamanho_digito = Math.ceil(texto.valor_jogador.dimensoes.altura);
        largura_numero = texto.valor_jogador.digito.largura * conjunto_jogadores[num_jogador].proporcao;
        borda = 0;
        margem_superior = 0 //-1 * (tamanho_digito + 2 * borda) // * 12;


    }
    html = "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>$</div></div>";

    for (digito = 1; digito <= total_digitos; digito++) {
        htmlnumeros = '';
        htmlnumeros = htmlnumeros + "<div id='" + fichas_ou_pot + "jogador" + jogador + "digito" + digito + "cifrao' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'></div>";
        html = html + "<div id='" + fichas_ou_pot + "jogador" + jogador + "digito" + digito + "' style='float:left;margin-top:" + margem_superior + "px;display:none'>" + htmlnumeros + "</div>";
    }
    html = html + "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>,</div></div>";
    html = html + "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>0</div></div>";
    html = html + "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>0</div></div>";

    document.getElementById('total' + fichas_ou_pot + jogador).innerHTML = html;
}


/**
 * Função: ANIMA_OPACITY
 * Objetivo: efeito de aumento ou diminuição de opacidade de forma animada.
 * Como: contagem é o momento em que o efeito está e limite é até que valor irá aumentar ou diminuir.
 * Observações: existe um método em javascript que faz essa animação. Entretanto para maior compatibilidade, optou-se por este.
 * 
 */
function anima_opacity(elemento, aumenta_diminui, limite, contagem) {

    fator = parametros_animacao.anima_opacity.fator;
    tempo = parametros_animacao.anima_opacity.tempo;

    if (aumenta_diminui == 'aumenta') {

        if (contagem <= limite) {
            document.getElementById(elemento).style.opacity = document.getElementById(elemento).style.opacity * 1.0 + fator;
            nova_contagem = contagem + fator;
            setTimeout(function() {
                anima_opacity(elemento, aumenta_diminui, limite, nova_contagem);
            }, tempo);
        }
    } else {
        if (contagem >= limite) {
            document.getElementById(elemento).style.opacity = document.getElementById(elemento).style.opacity * 1.0 - fator;
            nova_contagem = contagem - fator;
            setTimeout(function() {
                anima_opacity(elemento, aumenta_diminui, limite, nova_contagem);
            }, tempo);
        }
    }
}