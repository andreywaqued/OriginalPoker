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
            'nome': 'ALEXANDER',
            'proporcao': 1,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.15 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.30 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 1,
            'nome': 'ANDERSEN',
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'proporcao': 1,
            'posicao_centro': { 'x': mesa.largura_total * 0.85, 'y': mesa.altura_total * 0.33 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.68, 'y': mesa.altura_total * 0.35 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 2,
            'nome': 'TONERA',
            'proporcao': 1,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.85, 'y': mesa.altura_total * 0.66 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.70, 'y': mesa.altura_total * 0.58 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 3,
            'nome': 'ALEXANDER',
            'proporcao': 1.2,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.80 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.58, 'y': mesa.altura_total * 0.65 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 4,
            'nome': 'ANDERSEN',
            'proporcao': 1,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.15, 'y': mesa.altura_total * 0.66 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.30, 'y': mesa.altura_total * 0.60 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
        {
            'id': 5,
            'nome': 'ANDREY',
            'proporcao': 1,
            'imagem': 'images/hero_novalues_transp_sem_contador.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.15, 'y': mesa.altura_total * 0.33 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.32, 'y': mesa.altura_total * 0.32 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 0, 'fichas': 0 },
            'direcao': { 'pot': 0, 'fichas': 0 }
        },
    ] //O posicionamento dos jogadores é proporcional ao tamanho da imagem do fundo, portanto varia de 0,0 - canto superior direito a 1,1 - canto inferior direito. 

function init() {

    html = '';
    for (num_jogador = 0; num_jogador < conjunto_jogadores.length; num_jogador++) {
        html = html + '<div class="player-display" id="seat' + num_jogador + '" style="visibility:hidden;"  unselectable="on" onselectstart="return false;" onmousedown="return false;">';
        html = html + '<div id="pisca' + num_jogador + '" class="piscaPisca"></div>';
        html = html + '<div class="avatar" id="avSeat' + num_jogador + '"></div>';
        html = html + '<div class="player-cards">';
        html = html + '<div class="player-cardsContainer" id="playerCards' + num_jogador + '">';
        html = html + '<div class="c1 cAs" id="card1Seat' + num_jogador + '"></div>';
        html = html + '<div class="c2 c9d" id="card2Seat' + num_jogador + '"></div>';
        html = html + '</div>';
        html = html + '</div>';

        html = html + '<div class="player-block">';
        html = html + '<div class="display-name" id="seatName' + num_jogador + '">' + conjunto_jogadores[num_jogador].nome + '</div>';
        html = html + '<div class="display-stack" id="stackAmountSeat' + num_jogador + '">' + conjunto_jogadores[num_jogador].valor.fichas + '</div>';
        html = html + '</div>';
        html = html + '<div class="time">';
        html = html + '<div class="timer" id="timerSeat' + num_jogador + '" style="visibility: hidden;"></div>';
        html = html + '</div>';
        html = html + '</div>';
    }
    document.getElementById('players').innerHTML = html;

}

function init2() {
    html_mesa = "<div id=\'mesa\' style=\'background-image: url(\"" + mesa.imagem + "\");background-repeat: no-repeat;background-size: " + mesa.largura_total + "px " + mesa.altura_total + "px;height:" + mesa.altura_total + "px;width:" + mesa.largura_total + "px;\'></div>";

    tamanho_digito = 12;
    document.getElementById('body').innerHTML = html_mesa;
    html = '';
    for (sitPosition = 0; sitPosition < conjunto_jogadores.length; sitPosition++) {
        margin_left = (conjunto_jogadores[sitPosition].posicao_centro.x - jogador_geral.largura_total * proporcao_centro_jogador_largura_jogador * conjunto_jogadores[sitPosition].proporcao)
        margin_top = (conjunto_jogadores[sitPosition].posicao_centro.y - jogador_geral.altura_total * proporcao_centro_jogador_altura_jogador);
        html = "<div id='seat" + sitPosition + "' style='position:absolute;z-index:2;margin-left:" + margin_left + "px;margin-top:" + margin_top + "px'><img id='avSeat" + sitPosition + "' src='" + conjunto_jogadores[sitPosition].imagem + "' style='width:" + jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px'></div>";
        html = html + "<div id='seatName" + sitPosition + "' style='position:absolute;z-index:3;margin-left:" + (margin_left * 1 + texto.nome_jogador.posicao.x * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px;color:white;font-weight:bold;width:" + texto.nome_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;height:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;font-family:sans-serif;font-size:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px'>" + conjunto_jogadores[sitPosition].nome + "</div>";
        //***TOTALPOT original*** html = html + "<div style='position:absolute;z-index:4;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div id='campopot" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;margin-top:" + texto.valor_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao + "px;'><div id='totalpot" + sitPosition + "' style='font-family:sans-serif;'></div></div></div>";
        html = html + "<div style='position:absolute;z-index:4;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div id='campopot" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;margin-top:" + texto.valor_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao + "px;'><div id='totalpot" + sitPosition + "' style='font-family:sans-serif;'></div></div></div>";
        html = html + "<div style='position:absolute;z-index:5;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div style='display:block;overflow-y:hidden;overflow-x:hidden;float:left;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:left;margin-top:" + (texto.valor_jogador.posicao.y + texto.valor_jogador.digito.altura + 5) * conjunto_jogadores[sitPosition].proporcao + "px;background'><div  id='timerSeat" + sitPosition + "' style='background-image:url(\"images/barra_tempo.png\");width:" + (texto.valor_jogador.dimensoes.largura - 4) * conjunto_jogadores[num_jogador].proporcao + "px;height:" + 5 * conjunto_jogadores[num_jogador].proporcao + "px'></div></div></div>";
        html = html + "<div id='caixa_fichas_jogador" + sitPosition + "' style='position:absolute;display:none;opacity:0;overflow-y:hidden;overflow-x:hidden;width:" + ficha.caixa_fichas.largura + "px;height:" + ficha.dimensoes.altura + "px;margin-top:" + conjunto_jogadores[sitPosition].posicao_ficha.y + "px;margin-left:" + (conjunto_jogadores[sitPosition].posicao_ficha.x - (ficha.caixa_fichas.largura / 2)) + "px'></div>";
        html = html + "<div style='position:absolute;z-index:4;width:" + texto.fichas.dimensoes.largura + "px;margin-left:" + (conjunto_jogadores[sitPosition].posicao_ficha.x - texto.fichas.dimensoes.largura / 2) + "px;'><div id='campofichas" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.fichas.digito.altura + "px;background-color:gray;color:white;opacity:0%;border:3px solid gray;border-radius:3px;font-family:sans-serif;font-size:" + texto.fichas.digito.altura + "px;text-align:right;margin-top:" + (conjunto_jogadores[sitPosition].posicao_ficha.y * 1 + (ficha.dimensoes.altura / 2) - texto.fichas.digito.altura) + "px;z-index:4'><div id='totalfichas" + sitPosition + "' style='float:right'></div></div></div>";
        html = html + "<div id='playerCards" + sitPosition + "' style='position:absolute;overflow-y:hidden;overflow-x:hidden;width:" + jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px;margin-top:" + margin_top + "px;margin-left:" + margin_left + "px'>";
        html = html + "<div id='card1Seat" + sitPosition + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;background-image:url(\"images/Back.png\");z-index:6;height:" + carta.dimensoes.altura_total * conjunto_jogadores[sitPosition].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px'></div>";
        html = html + "<div id='card2Seat" + sitPosition + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;background-image:url(\"images/Back.png\");z-index:7;height:" + carta.dimensoes.altura_total * conjunto_jogadores[sitPosition].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (carta.posicao.segunda.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px'></div></div>";

        //html = html + "<div id='marca_centro' style='position:absolute;background-color:red;z-index:20;height:3px;width:3px;margin-left:" + mesa.largura_total * mesa.centro.x + "px;margin-top:" + mesa.largura_total * mesa.centro.y + "px'></div></div>";
        //html = html + "<div id='marca_posicao_ficha" + sitPosition + "' style='position:absolute;background-color:blue;z-index:20;height:3px;width:3px;margin-left:" + conjunto_jogadores[sitPosition].posicao_ficha.x + "px;margin-top:" + conjunto_jogadores[sitPosition].posicao_ficha.y + "px'></div></div>";

        digitos_por_jogador[sitPosition] = { 'pot': { 'maximo': 0, 'minimo': 0, 'atual': 0 }, 'fichas': { 'maximo': 0, 'minimo': 0, 'atual': 0 } };
        inicializa_digitos_max_min(sitPosition, 'todos');

        document.getElementById('mesa').innerHTML = document.getElementById('mesa').innerHTML + html;
        inicializa_digitos_valores(sitPosition, 'fichas');
        inicializa_digitos_valores(sitPosition, 'pot');


    }
    variavel_jogador = 0;
    proxima_animacao_demo(5000);
}