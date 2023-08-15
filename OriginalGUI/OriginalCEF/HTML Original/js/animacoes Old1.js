/**
 * 
 */
//Dimensões em pixels
mesa = { 'imagem': 'img/nova.png', 'altura_total': '490', 'largura_total': '623', 'centro': { 'x': 0.5, 'y': 0.37 } } //{ 'imagem': 'images/fundo.png', 'altura_total': '1400', 'largura_total': '1742' } //{ 'imagem': 'images/fundo.png', 'altura_total': '700', 'largura_total': '871' }

imagem_jogador = { 'altura_original': '190', 'largura_original': '197' };
imagem_carta = { 'altura_original': '78', 'largura_original': '55' };
proporcao_altura_mesa_jogador = 0.20 //Percentual em número - exemplo: 75% = 0.75
proporcao_centro_jogador_altura_jogador = 0.65 //Calibração de posição do centro, em percentuais em relação à altura total, considerando o y=0 no topo.
proporcao_centro_jogador_largura_jogador = 0.50 //Calibração de posição do centro, em percentuais em relação à largura total, considerando o x=0 à esquerda.
proporcao_altura_mesa_carta = 0.18

board_geral = {
    'altura_total': mesa.altura_total * proporcao_altura_mesa_carta,
    'largura_total': ((mesa.altura_total * proporcao_altura_mesa_carta * imagem_carta.largura_original) / imagem_carta.altura_original),
    'esquerda': { 'x': mesa.largura_total * proporcao_altura_mesa_carta * 0.3, 'y': mesa.altura_total * proporcao_altura_mesa_carta * 0.65 }
}

jogador_geral = {
        'altura_total': mesa.altura_total * proporcao_altura_mesa_jogador,
        'largura_total': ((mesa.altura_total * proporcao_altura_mesa_jogador * imagem_jogador.largura_original) / imagem_jogador.altura_original),
        'centro_jogador': { 'x': mesa.largura_total * proporcao_altura_mesa_jogador * 0.5, 'y': mesa.altura_total * proporcao_altura_mesa_jogador * 0.65 }
    } //Percentual de proporção


digitos_por_jogador = [];
limite_digitos = { 'pot': { 'maximo': 16, 'minimo': 1, 'atual': 16 }, 'fichas': { 'maximo': 16, 'minimo': 1, 'atual': 16 } };

texto = {

    'nome_jogador': {
        'posicao': { 'x': jogador_geral.largura_total * 0.08, 'y': jogador_geral.altura_total * 0.66 },
        'dimensoes': { 'altura': jogador_geral.altura_total * 0.16, 'largura': jogador_geral.largura_total * 0.85 }
    },

    'valor_jogador': {
        'posicao': { 'x': jogador_geral.largura_total * 0.8, 'y': jogador_geral.altura_total * 0.92 },
        'dimensoes': { 'altura': jogador_geral.altura_total * 0.18, 'largura': jogador_geral.largura_total * 0.97 },
        'digito': { 'largura': (1.05 / 2) * jogador_geral.altura_total * 0.18, 'altura': jogador_geral.altura_total * 0.18, 'qtde_inicial': 4 }
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
            'principal': { 'x': 0.06, 'y': 0.99 },
            'secundaria': { 'x': 0.09, 'y': 0.9 }
        },
        'segunda': {
            'principal': { 'x': 0.33, 'y': 0.99 },
            'secundaria': { 'x': 0.3, 'y': 0.9 }
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
            'proporcao': 0.9,
            'imagem': 'avatar/1.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.9 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.58, 'y': mesa.altura_total * 0.65 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 1, 'fichas': 10 },
            'direcao': { 'pot': 0, 'fichas': 0 },
            'anima_principal': { 'rodando': false, 'tipo_movimento': 'nenhum' }
        },
        {
            'id': 1,
            'nome': 'ANDERSEN',
            'proporcao': 0.75,
            'imagem': 'avatar/2.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.10, 'y': mesa.altura_total * 0.71 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.30, 'y': mesa.altura_total * 0.60 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 1, 'fichas': 10 },
            'direcao': { 'pot': 0, 'fichas': 0 },
            'anima_principal': { 'rodando': false, 'tipo_movimento': '' }
        },
        {
            'id': 2,
            'nome': 'ANDREY',
            'proporcao': 0.65,
            'imagem': 'avatar/3.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.10, 'y': mesa.altura_total * 0.38 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.32, 'y': mesa.altura_total * 0.32 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 1, 'fichas': 10 },
            'direcao': { 'pot': 0, 'fichas': 0 },
            'anima_principal': { 'rodando': false, 'tipo_movimento': '' }
        },
        {
            'id': 3,
            'nome': 'ALEXANDER',
            'proporcao': 0.55,
            'imagem': 'avatar/4.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.20 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.50, 'y': mesa.altura_total * 0.30 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 1, 'fichas': 10 },
            'direcao': { 'pot': 0, 'fichas': 0 },
            'anima_principal': { 'rodando': false, 'tipo_movimento': '' }
        },
        {
            'id': 4,
            'nome': 'ANDERSEN',
            'imagem': 'avatar/5.png',
            'proporcao': 0.65,
            'posicao_centro': { 'x': mesa.largura_total * 0.90, 'y': mesa.altura_total * 0.37 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.68, 'y': mesa.altura_total * 0.35 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 1, 'fichas': 10 },
            'direcao': { 'pot': 0, 'fichas': 0 },
            'anima_principal': { 'rodando': false, 'tipo_movimento': '' }
        },
        {
            'id': 5,
            'nome': 'TONERA',
            'proporcao': 0.75,
            'imagem': 'avatar/6.png',
            'posicao_centro': { 'x': mesa.largura_total * 0.90, 'y': mesa.altura_total * 0.71 },
            'posicao_ficha': { 'x': mesa.largura_total * 0.70, 'y': mesa.altura_total * 0.58 - Math.round(ficha.dimensoes.altura / 2) },
            'valor': { 'pot': 1, 'fichas': 10 },
            'direcao': { 'pot': 0, 'fichas': 0 },
            'anima_principal': { 'rodando': false, 'tipo_movimento': '' }

        },

    ] //O posicionamento dos jogadores é proporcional ao tamanho da imagem do fundo, portanto varia de 0,0 - canto superior direito a 1,1 - canto inferior direito. 




//posicao da carta é o valor de 0 a 1 entre a esquerda e a direita da imagem do jogador. 

variavel_jogador = 0;
tempo_muda_digito = parametros_animacao.muda_digito.velocidade;
limite_minimo_digitos = 0;
demo_animacao_atual = 0;
limitante_jogadores_demo = 0;



function init() {


    document.getElementById('mesa').style.cssText = "overflow:hidden;position:absolute;background-image: url(\"" + mesa.imagem + "\");background-repeat: no-repeat;background-size: " + mesa.largura_total + "px " + mesa.altura_total + "px;height:" + mesa.altura_total + "px;width:" + mesa.largura_total + "px;margin-top:0px;margin-left:0px";
    /*html_mesa = "<div id=\'mesa\' style=\'overflow:hidden;position:absolute;background-image: url(\"" + mesa.imagem + "\");background-repeat: no-repeat;background-size: " + mesa.largura_total + "px " + mesa.altura_total + "px;height:" + mesa.altura_total + "px;width:" + mesa.largura_total + "px;margin-top:0px;margin-left:0px\'>";
    //html_mesa = html_mesa + "<div>";

    html_mesa = html_mesa + '<div id="board"  unselectable="on" onselectstart="return false;" onmousedown="return false;">'
    html_mesa = html_mesa + '<div class="board-card c2c" id="boardC1" style="visibility:hidden;"></div>'
    html_mesa = html_mesa + '<div class="board-card c2d" id="boardC2" style="visibility:hidden;"></div>'
    html_mesa = html_mesa + '<div class="board-card c2h" id="boardC3" style="visibility:hidden;"></div>'
    html_mesa = html_mesa + '<div class="board-card c2s" id="boardC4" style="visibility:hidden;"></div>'
    html_mesa = html_mesa + '<div class="board-card c2c" id="boardC5" style="visibility:hidden;"></div>'
    html_mesa = html_mesa + '</div>';
    html_mesa = html_mesa + "</div>";*/

    tamanho_digito = 12;
    //document.getElementById('table').innerHTML = html_mesa + document.getElementById('table').innerHTML;




    /*for (sitPosition = 0; sitPosition < conjunto_jogadores.length; sitPosition++) {
        margin_left = (conjunto_jogadores[sitPosition].posicao_centro.x - jogador_geral.largura_total * proporcao_centro_jogador_largura_jogador * conjunto_jogadores[sitPosition].proporcao)
        margin_top = (conjunto_jogadores[sitPosition].posicao_centro.y - jogador_geral.altura_total * proporcao_centro_jogador_altura_jogador);
        html = "<div id='seat" + sitPosition + "' style='position:absolute;z-index:3;margin-left:" + margin_left + "px;margin-top:" + (margin_top * 1 - (texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao)) + "px'><img id='avSeat" + sitPosition + "' src='" + conjunto_jogadores[sitPosition].imagem + "' style='width:" + jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px'></div>";
        //html = html + "<div style='position:absolute;z-index: 2;width:" + 1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + ";margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px'>";
        html = html + "<div style='position:absolute;z-index:7;background: #394052;width:" + 1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + 1.4 * texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.85 * texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px'></div>";
        html = html + "<div style='position:absolute;z-index:5;background: #343A4A;width:" + 1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + 2.2 * texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.85 * (texto.nome_jogador.posicao.y + 1.4 * texto.nome_jogador.dimensoes.altura) * conjunto_jogadores[sitPosition].proporcao) + "px;'></div>";
        html = html + "<div style='position:absolute;z-index:7;height:" + 5 * conjunto_jogadores[sitPosition].proporcao + "px;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.85 * (texto.nome_jogador.posicao.y + 3.6 * texto.nome_jogador.dimensoes.altura) * conjunto_jogadores[sitPosition].proporcao) + "px;border:solid 1px #343A4A;background:#2b303d;'></div>";
        html = html + "<div style='position:absolute;z-index:8;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div style='display:block;overflow-y:hidden;overflow-x:hidden;float:left;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:left;margin-top:" + (texto.valor_jogador.posicao.y + texto.valor_jogador.digito.altura + 12) * conjunto_jogadores[sitPosition].proporcao + "px;'><div  id='timerSeat" + sitPosition + "' style='background-image:url(\"images/barra_tempo.png\");background-size: cover;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px;height:" + 5 * conjunto_jogadores[sitPosition].proporcao + "px'></div></div></div>";
        //html = html + "</div>";
        html = html + "<div id='seatName" + sitPosition + "' style='position:absolute;z-index:7;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.9 * texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px;color:white;height:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;font-size:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px'>" + conjunto_jogadores[sitPosition].nome + "</div>";
        //***TOTALPOT original*** html = html + "<div style='position:absolute;z-index:4;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div id='campopot" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;margin-top:" + texto.valor_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao + "px;'><div id='totalpot" + sitPosition + "' style='font-family:sans-serif;'></div></div></div>";

        html = html + "<div style='position:absolute;z-index:8;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 4) + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + 2) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div id='campopot" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;padding:0px 2px 0px 0px;margin-top:" + 1.04 * texto.valor_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao + "px;'><div id='totalpot" + sitPosition + "' style=''></div></div></div>";

        html = html + "<div id='caixa_fichas_jogador" + sitPosition + "' style='position:absolute;display:none;opacity:0;overflow-y:hidden;overflow-x:hidden;width:" + ficha.caixa_fichas.largura + "px;height:" + ficha.dimensoes.altura + "px;margin-top:" + conjunto_jogadores[sitPosition].posicao_ficha.y + "px;margin-left:" + (conjunto_jogadores[sitPosition].posicao_ficha.x - (ficha.caixa_fichas.largura / 2)) + "px'></div>";
        html = html + "<div style='position:absolute;z-index:4;width:" + texto.fichas.dimensoes.largura + "px;margin-left:" + (conjunto_jogadores[sitPosition].posicao_ficha.x - texto.fichas.dimensoes.largura / 2) + "px;'><div id='betAmount" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.fichas.digito.altura + "px;background-color:gray;color:white;opacity:0%;border:3px solid gray;border-radius:3px;font-size:" + texto.fichas.digito.altura + "px;text-align:right;margin-top:" + (conjunto_jogadores[sitPosition].posicao_ficha.y * 1 + (ficha.dimensoes.altura / 2) - texto.fichas.digito.altura) + "px;z-index:4'><div id='totalfichas" + sitPosition + "' style='float:right'></div></div></div>";
        html = html + "<div id='playerCards" + sitPosition + "' style='position:absolute;overflow-y:hidden;overflow-x:hidden;width:" + jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px;margin-top:" + margin_top + "px;margin-left:" + margin_left + "px'>";
        html = html + "<div class='cardback' id='card1Seat" + sitPosition + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;z-index:6;height:" + carta.dimensoes.altura_total * conjunto_jogadores[sitPosition].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px'></div>";
        html = html + "<div class='cardback' id='card2Seat" + sitPosition + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;z-index:6;height:" + carta.dimensoes.altura_total * conjunto_jogadores[sitPosition].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (carta.posicao.segunda.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px'></div></div>";

        html = html + "<div id='pisca" + sitPosition + "' class='piscaPisca' style='width:" + 1.8 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + 1.8 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;z-index:2;margin-left:" + (margin_left * 1 - 0.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 - 0.8 * (texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao)) + "px'></div>"

        //html = html + "<div id='marca_centro' style='position:absolute;background-color:red;z-index:20;height:3px;width:3px;margin-left:" + mesa.largura_total * mesa.centro.x + "px;margin-top:" + mesa.largura_total * mesa.centro.y + "px'></div></div>";
        //html = html + "<div id='marca_posicao_ficha" + sitPosition + "' style='position:absolute;background-color:blue;z-index:20;height:3px;width:3px;margin-left:" + conjunto_jogadores[sitPosition].posicao_ficha.x + "px;margin-top:" + conjunto_jogadores[sitPosition].posicao_ficha.y + "px'></div></div>";

        digitos_por_jogador[sitPosition] = { 'pot': { 'maximo': 0, 'minimo': 0, 'atual': 0 }, 'fichas': { 'maximo': 0, 'minimo': 0, 'atual': 0 } };
        inicializa_digitos_max_min(sitPosition, 'todos');

        document.getElementById('mesa').innerHTML = document.getElementById('mesa').innerHTML + html;
        inicializa_digitos_valores(sitPosition, 'fichas');
        inicializa_digitos_valores(sitPosition, 'pot');


    }*/
    /*html = "<div id='title-bar' unselectable='on' onselectstart='return false;' onmousedown='return false;'>";
    html = html + "<h1>Helenos III - $0.10/$0.20 NLH</h1>";
    html = html + "</div>";

    html = html + "<div id='icons-container' unselectable='on' onselectstart='return false;' onmousedown='return false;'>";
    html = html + "<div class='iconl' id='ico-replay'>";
    html = html + "<a title='Replay'></a>";
    html = html + "</div>";
    html = html + "<div class='iconl' id='ico-tables' onclick='fOrganizerTables()'>";
    html = html + "<a title='Ajustar mesas'></a>";
    html = html + "</div>";
    html = html + "<div class='iconl' id='ico-config'>";
    html = html + "<a title='Ajustes'></a>";
    html = html + "</div>";
    html = html + "<div class='iconl' id='ico-cash'>";
    html = html + "<a title='Depositar'></a>";
    html = html + "</div>";

    html = html + "<div class='iconr' id='ico-close' onclick='fFechar()'>";
    html = html + "<a title='Fechar'></a>";
    html = html + "</div>";
    html = html + "<div class='iconr' id='ico-minimize' onclick='fMinimizar()'>";
    html = html + "<a title='Minimizar'></a>";
    html = html + "</div>";
    html = html + "</div>";
    document.getElementById('mesa').innerHTML = document.getElementById('mesa').innerHTML + html;*/
    variavel_jogador = 0;
    //proxima_animacao_demo(1000);
}


var requiredText = '$';
var oldBetSliderVal = 0;
var raiseSliderMouseDownVal = 0;
var mouseMovedOnSlider = false;
var mouseDragging = false;
var mouseDownOnSlider = false;
var mouseSliderPos = 0;
var mouseDownOnSliderStartTime = 0;
var timtOutFunc;


$(document).ready(function() {
    console.log('carregou!')
        $('#raiseAmount').on('input', function() {
            if (String($(this).val()).indexOf(requiredText) == -1) {
                $(this).val(requiredText + $(this).val());
            }
        });
        $(window).bind('mousewheel', function(e) {
            if (e.originalEvent.wheelDelta / 120 > 0) {
                if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) + globalBB <= globalMaxBet) {
                    $('#raiseSlider').val(parseFloat($('#raiseSlider').val()) + globalBB);
                    $('#raiseAmount').val(parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) + globalBB);
                } else {
                    $('#raiseSlider').val(globalMaxBet);
                    $('#raiseAmount').val(globalMaxBet);
                }
                //$('#raiseAmount').val($('#raiseAmount').val().substring(1,$('#raiseAmount').val().length)+globalBB);
            } else {
                if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) - globalBB >= globalMinBet) {
                    $('#raiseSlider').val(parseFloat($('#raiseSlider').val()) - globalBB);
                    $('#raiseAmount').val(parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) - globalBB);
                } else {
                    $('#raiseSlider').val(globalMinBet);
                    $('#raiseAmount').val(globalMinBet);
                }
            }
            $('#raiseAmount').val("$" + parseFloat($('#raiseAmount').val()).toFixed(2));
            document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + $('#raiseAmount').val();
        });
        $('#raiseSlider').on('mousedown', function() {
            //console.log(`mouseDownVal:${parseFloat($(this).val())}`)
            console.log('mousedown')
            raiseSliderMouseDownVal = parseFloat($(this).val());
            mouseDownOnSlider = true;
            var d = new Date();
            mouseDownOnSliderStartTime = d.getTime();
            var slider = document.getElementById("raiseSlider");
            var output = document.getElementById('raiseAmount');
            output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
            document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
            timeOutFunc = window.setTimeout('fUpdateSliderTimeout()', 500);
        });
        $('#raiseSlider').on('mouseup', function() {
            console.log('mouseup')
            clearTimeout(timeOutFunc);
            var slider = document.getElementById("raiseSlider");
            var output = document.getElementById('raiseAmount');
            output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
            document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
            //console.log(`mouseUpVal:${parseFloat($(this).val())}`)
            if (mouseDragging == false) {
                if (parseFloat($(this).val()) > raiseSliderMouseDownVal) {
                    if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) + globalBB <= globalMaxBet) {
                        $(this).val(parseFloat(raiseSliderMouseDownVal) + globalBB);
                    } else {
                        $(this).val(parseFloat(globalMaxBet).toFixed(2));
                    }
                    //$('#raiseAmount').val($('#raiseAmount').val().substring(1,$('#raiseAmount').val().length)+globalBB);
                } else if (parseFloat($(this).val()) < raiseSliderMouseDownVal) {
                    if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)).toFixed(2) - globalBB >= globalMinBet) {
                        $(this).val(parseFloat(raiseSliderMouseDownVal) - globalBB);
                    } else {
                        $(this).val(parseFloat(globalMinBet).toFixed(2));
                    }
                }
                $('#raiseAmount').val("$" + parseFloat($(this).val()).toFixed(2).replace(".", globalDecimalSeparator))
                document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
            }
            mouseDragging = false;
            mouseMovedOnSlider = false;
            mouseDownOnSlider = false;
        });
        $('#raiseSlider').on('mousemove', function() {
            //console.log(`mouseMove:${parseFloat($(this).val())}`)
            console.log('mousemove')
            if (mouseDownOnSlider == true) {
                var d = new Date();
                if (raiseSliderMouseDownVal == parseFloat($(this).val())) {
                    mouseDragging = true;
                }
                if (mouseDragging == true) {
                    var slider = document.getElementById("raiseSlider");
                    var output = document.getElementById('raiseAmount');
                    output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
                    document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
                    mouseMovedOnSlider = true;
                }
            }
        });
    init();
    window.setTimeout(function() { initBetControl() }, 300);
    window.setTimeout(function() { fUpdateHtmlLoadedState() }, 500);
   // window.setTimeout(function() { fInitGameTest() }, 1000);
});

var globalTableSize = 6;
var reservedSits = [];
var totalPots = 6;
var rotatePos = 0;
var globalAmountToCall = 0;
var globalMinBet = 0;
var globalMaxBet = 0;
var globalBB = 2;
var globalDecimalSeparator = ",";

function fInitGameTest() {
    fSitPlayer(0, "Alexander", 1);
    fSitPlayer(1, "Andersen", 2);
    fSitPlayer(2, "Andrey", 3);
    fSitPlayer(3, "Alexander", 4);
    fSitPlayer(4, "Andersen", 5);
    fSitPlayer(5, "TONERA", 6);

    initBetControl();


    //window.setTimeout('fAddCardToSlot(\'card1\', 0, \'As\')', 2 * 1000);
    //window.setTimeout('fAddCardToSlot(\'card2\', 0, \'Kd\')', 4 * 1000);
    fAddCardToSlot('card1', 0, "Ts");
    fAddCardToSlot('card2', 0, "Kd");
    window.setTimeout('fCardsDown(0)', 2000);
    window.setTimeout('fCardsUp(0)', 2100);
    
    fAddCardToSlot('card1', 1, "Th");
    fAddCardToSlot('card2', 1, "Jc");
    fAddCardToSlot('card1', 2, "9h");
    fAddCardToSlot('card2', 2, "9s");
    fAddCardToSlot('card1', 3, "card");
    fAddCardToSlot('card2', 3, "card");
    fAddCardToSlot('card1', 4, "card");
    fAddCardToSlot('card2', 4, "card");
    fAddCardToSlot('card1', 5, "card");
    fAddCardToSlot('card2', 5, "card");
    fAddCardToBoard(boardC1, 'Qh');
    fAddCardToBoard(boardC2, 'Ts');
    fAddCardToBoard(boardC3, '5h');
    fAddCardToBoard(boardC4, '4h');
    fAddCardToBoard(boardC5, '5s');
    fUpdatePlayerTurn(0, '5.00');
    //window.setTimeout('fUpdatePlayerTurn(0, \'15.00\')', 1 * 1000);
    window.setTimeout('fUpdatePlayerTurn(1, \'15.00\')', 16 * 1000);
    window.setTimeout('fUpdatePlayerTurn(2, \'15.00\')', 32 * 1000);
    window.setTimeout('fUpdatePlayerTurn(3, \'15.00\')', 48 * 1000);
    window.setTimeout('fUpdatePlayerTurn(4, \'15.00\')', 64 * 1000);
    window.setTimeout('fUpdatePlayerTurn(5, \'15.00\')', 80 * 1000);
    window.setTimeout('fFoldPlayerCards(2)', 32 * 1000);
    
    /*window.setTimeout('fUpdatePlayerBet(0,3456789)', 6 * 1000);
    window.setTimeout('fUpdatePlayerBet(1,4567890)', 12 * 1000);
    window.setTimeout('fUpdatePlayerBet(2,5678901)', 18 * 1000);
    window.setTimeout('fUpdatePlayerBet(3,6789012)', 24 * 1000);
    window.setTimeout('fUpdatePlayerBet(4,7890123)', 30 * 1000);
    window.setTimeout('fUpdatePlayerBet(5,8901234)', 36 * 1000);
    window.setTimeout('fUpdatePotAmount(0,3456789)', 6 * 1000);
    window.setTimeout('fUpdatePotAmount(1,4567890)', 12 * 1000);
    window.setTimeout('fUpdatePotAmount(2,5678901)', 18 * 1000);
    window.setTimeout('fUpdatePotAmount(3,6789012)', 24 * 1000);
    window.setTimeout('fUpdatePotAmount(4,7890123)', 30 * 1000);
    window.setTimeout('fUpdatePotAmount(5,8901234)', 36 * 1000);
    window.setTimeout('fClearPots()', 42 * 1000);*/
    

    fLocalPlayerTurn('2.00', '4.00', '201.00', ['FOLD', 'CALL', 'RAISE'], '30.00');
};

function initBetControl() {
    $('#raiseAmount').on('input', function() {
        if (String($(this).val()).indexOf(requiredText) == -1) {
            $(this).val(requiredText + $(this).val());
        }
    });
    $(window).bind('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) + globalBB <= globalMaxBet) {
                $('#raiseSlider').val(parseFloat($('#raiseSlider').val()) + globalBB);
                $('#raiseAmount').val(parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) + globalBB);
            } else {
                $('#raiseSlider').val(globalMaxBet);
                $('#raiseAmount').val(globalMaxBet);
            }
            //$('#raiseAmount').val($('#raiseAmount').val().substring(1,$('#raiseAmount').val().length)+globalBB);
        } else {
            if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) - globalBB >= globalMinBet) {
                $('#raiseSlider').val(parseFloat($('#raiseSlider').val()) - globalBB);
                $('#raiseAmount').val(parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) - globalBB);
            } else {
                $('#raiseSlider').val(globalMinBet);
                $('#raiseAmount').val(globalMinBet);
            }
        }
        $('#raiseAmount').val("$" + parseFloat($('#raiseAmount').val()).toFixed(2));
        document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + $('#raiseAmount').val();
    });
    $('#raiseSlider').on('mousedown', function() {
        //console.log(`mouseDownVal:${parseFloat($(this).val())}`)

        raiseSliderMouseDownVal = parseFloat($(this).val());
        mouseDownOnSlider = true;
        var d = new Date();
        mouseDownOnSliderStartTime = d.getTime();
        var slider = document.getElementById("raiseSlider");
        var output = document.getElementById('raiseAmount');
        output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
        document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
        timeOutFunc = window.setTimeout('fUpdateSliderTimeout()', 500);
    });
    $('#raiseSlider').on('mouseup', function() {

        clearTimeout(timeOutFunc);
        var slider = document.getElementById("raiseSlider");
        var output = document.getElementById('raiseAmount');
        output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
        document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
        //console.log(`mouseUpVal:${parseFloat($(this).val())}`)
        if (mouseDragging == false) {
            if (parseFloat($(this).val()) > raiseSliderMouseDownVal) {
                if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)) + globalBB <= globalMaxBet) {
                    $(this).val(parseFloat(raiseSliderMouseDownVal) + globalBB);
                } else {
                    $(this).val(parseFloat(globalMaxBet).toFixed(2));
                }
                //$('#raiseAmount').val($('#raiseAmount').val().substring(1,$('#raiseAmount').val().length)+globalBB);
            } else if (parseFloat($(this).val()) < raiseSliderMouseDownVal) {
                if (parseFloat($('#raiseAmount').val().substring(1, $('#raiseAmount').val().length)).toFixed(2) - globalBB >= globalMinBet) {
                    $(this).val(parseFloat(raiseSliderMouseDownVal) - globalBB);
                } else {
                    $(this).val(parseFloat(globalMinBet).toFixed(2));
                }
            }
            $('#raiseAmount').val("$" + parseFloat($(this).val()).toFixed(2).replace(".", globalDecimalSeparator))
            document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
        }
        mouseDragging = false;
        mouseMovedOnSlider = false;
        mouseDownOnSlider = false;
    });
    $('#raiseSlider').on('mousemove', function() {
        //console.log(`mouseMove:${parseFloat($(this).val())}`)

        if (mouseDownOnSlider == true) {
            var d = new Date();
            if (raiseSliderMouseDownVal == parseFloat($(this).val())) {
                mouseDragging = true;
            }
            if (mouseDragging == true) {
                var slider = document.getElementById("raiseSlider");
                var output = document.getElementById('raiseAmount');
                output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
                document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
                mouseMovedOnSlider = true;
            }
        }
    });
}

function fUpdateSliderTimeout() {
    console.log("fUpdateSliderTimeout");
    console.log(mouseDragging);
    console.log(mouseDownOnSlider);
    if (!mouseDragging && mouseDownOnSlider) {
        console.log("entrouIf");

        var slider = document.getElementById("raiseSlider");
        var output = document.getElementById('raiseAmount');
        output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator);
        document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
        mouseDragging = true;
    }
};
async function fFechar() {
    console.log(`fFechar()`);

    //await CefSharp.BindObjectAsync("buttonEvents");
    //buttonEvents.fEnterTable(parseInt(tableId));

    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fFechar();

}
async function fUpdateHtmlLoadedState() {
    console.log(`fUpdateHtmlLoadedState() da mesa`);

    //await CefSharp.BindObjectAsync("buttonEvents");
    //buttonEvents.fEnterTable(parseInt(tableId));

    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fUpdateHtmlLoadedState();

}
async function fActivateTable() {
    console.log(`fActivateTable()`);

    //await CefSharp.BindObjectAsync("buttonEvents");
    //buttonEvents.fEnterTable(parseInt(tableId));

    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fActivateTable();

}

async function fMinimizar() {
    console.log(`fMinimizar()`);

    //await CefSharp.BindObjectAsync("buttonEvents");
    //buttonEvents.fEnterTable(parseInt(tableId));

    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fMinimizar();

}

async function fButtonAction(action, amount = 0) {
    //console.log("action: " + action);
    //console.log("amount: " + amount);
    fDisableActionButtons();
    clearTimeout(timeOutAct);
    await CefSharp.BindObjectAsync("buttonEvents");
    if (action == "FOLD") {
        buttonEvents.fFold();
    } else if (action == "CHECK") {
        buttonEvents.fCheck();
    } else if (action.includes("CALL")) {
        buttonEvents.fCall();
    } else if (action == "RAISE") {
        buttonEvents.fRaise(amount);
    }
    //The default is to camel case method names (the first letter of the method name is changed to lowercase)
}

async function fNotFunds() {
    alert(`You don't have money to continue.`);
    fFechar();
}

async function fConnect(host) {
    //console.log("host: " + host)
    await CefSharp.BindObjectAsync("buttonEvents");
    if (host != "") {
        buttonEvents.fConnect(host);

    }
}

async function fReserveSit(position) {
    //console.log(`Seat Pos: ${position}`);
    document.getElementById(`buttonSeat${position}`).disabled = "true";
    reservedSits.push(position);

    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fReserveSit(parseInt(position));
}

async function fEnterTable(tableId) {
    fToggleHideTable();
    //console.log(`Enter Table: ${tableId}`);

    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fEnterTable(parseInt(tableId));
}

async function fEnterPool(stackAmount) {
    fToggleHideTable();
    //console.log(`Enter Pool: ${stackAmount}`);
    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fEnterPool(parseFloat(stackAmount));
}

async function fOrganizerTables() {
    await CefSharp.BindObjectAsync("buttonEvents");
    buttonEvents.fOrganizerTables();
}
function fSetSitOutNexHand(checked){
	document.getElementById('chkSitOutNHand').checked = checked;
}
async function fSitOutNextHand()
{
	//console.log(`fSitOutNextHand: ${document.getElementById('sitOutNextHand').checked}`);
		
	//await CefSharp.BindObjectAsync("buttonEvents");
	//buttonEvents.fEnterTable(parseInt(tableId));

    console.log(document.getElementById('chkSitOutNHand'));
	await CefSharp.BindObjectAsync("buttonEvents");
	if (document.getElementById('chkSitOutNHand').checked){
		buttonEvents.fSitOutNextHand(1);
	} else {
		buttonEvents.fSitOutNextHand(0);
	}		
	return false;
}
function fSetSitOutNexBB(checked){
	document.getElementById('chkSitOutNBig').checked = checked;
}
async function fSitOutNextBlind()
{
	//console.log(`fSitOutNextBlind: ${document.getElementById('chkSitOutNBig').checked}`);
		
	//await CefSharp.BindObjectAsync("buttonEvents");
	//buttonEvents.fEnterTable(parseInt(tableId));

	await CefSharp.BindObjectAsync("buttonEvents");
	if (document.getElementById('chkSitOutNBig').checked==true){
		buttonEvents.fSitOutNextBB(1);
	} else {
		buttonEvents.fSitOutNextBB(0);
	}		
	return false;
		
}

function fSetDecimalSeparator(separator) {
    globalDecimalSeparator = separator;
}

function fCreateTable(tableSize) {
    //console.log(`fCreateTable ${tableSize}`)
    globalTableSize = parseInt(tableSize);
    var i;
    for (i = 0; i <= tableSize - 1; i++) {
        fCreateSit(i);
    }

}

function fToggleHideTable() {
    //console.log("fToggleHideTable")

    var x = document.getElementById("tableDiv");
    if (x.style.visibility = "hidden") {
        x.style.visibility = "visible";
    } else {
        x.style.visibility = "hidden";
    }
}

function fShowPlayerPool() {
    playerPool = document.createElement('I');
    playerPool.innerHTML = "";
    playerPool.id = "playerPool";
}

function fHideEmptySeats(Sit = -1) {
    console.log(`fHideEmptySeats(${Sit})`)
    var i;
    //console.log(`reservedSits: ${reservedSits}`)
    if (Sit == -1) {
        for (i = 0; i <= globalTableSize - 1; i++) {
            //var element = document.getElementById(`buttonSeat${i}`);
            //element.parentNode.removeChild(element);
            if (!reservedSits.includes(i)) {
                //console.log(`hiding seat: ${i}`)
                sitPosition = fTransformSitPos(i);
                document.getElementById(`seat${sitPosition}`).style.visibility = "hidden";
            }

        }
    } else {
        if (!reservedSits.includes(Sit)) {
            //console.log(`hiding seat: ${Sit}`)
            sitPosition = fTransformSitPos(Sit);
            document.getElementById(`seat${sitPosition}`).style.visibility = "hidden";
        }
    }
}


function fRemovePlayer(sitPosition) {
    ////console.log(`fRemovePlayer ${position}`)
    var element = document.getElementById(`seat${sitPosition}`);
    element.parentNode.removeChild(element);
    //fCreateSit(position);
    //reservedSits.pop(position);
    //fHideEmptySeats(position);
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function isNumberOrDecSepKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode == 44) {
        if (globalDecimalSeparator == ",") {
            if ($('#raiseAmount').val().indexOf(globalDecimalSeparator) != -1) {
                return false
            }
            return true;
        } else {
            return false;
        }
    } else if (charCode == 46) {
        if (globalDecimalSeparator == ".") {
            if ($('#raiseAmount').val().indexOf(globalDecimalSeparator) != -1) {
                return false
            }
            return true;
        } else {
            return false;
        }
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function fUpdateValueOnSliderChange() {
    var slider = document.getElementById("raiseSlider");
    var output = document.getElementById('raiseAmount');
    output.value = "$" + parseFloat(slider.value).toFixed(2).replace(".", globalDecimalSeparator); // Display the default slider value
    document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + output.value;
    oldBetSliderVal = parseFloat(slider.value);

    // Update the current slider value (each time you drag the slider handle)
    //slider.oninput = function() {
    //  output.value = "$" + this.value;
    //}
}

function fUpdateValueOnSliderInput() {
    //var slider = document.getElementById("raiseSlider");
    //var output = document.getElementById('raiseAmount');
    //output.value = "$" + slider.value;
    //return output.value;
    //if (true) {}
    //output.value = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    //slider.oninput = function() {
    //  output.innerHTML = this.value;
    //}
}

function fCountDecimals(value) {
    if (value.toString().split(globalDecimalSeparator).length > 1)
        return value.toString().split(globalDecimalSeparator)[1].length || 0;
    return 0;
}

function fUpdateSliderOnValueChange() {
    var input = document.getElementById("raiseAmount");
    var output = document.getElementById('raiseSlider');
    if (fCountDecimals(input.value.substring(1, input.value.length)) > 2)
        input.value = "$" + parseFloat(input.value.substring(1, input.value.length).replace(globalDecimalSeparator, ".")).toFixed(2).replace(".", globalDecimalSeparator);
    if (parseFloat(input.value.substring(1, input.value.length).replace(globalDecimalSeparator, ".")) > globalMaxBet)
        input.value = "$" + globalMaxBet.toFixed(2).replace(".", globalDecimalSeparator);
    output.value = parseFloat(input.value.substring(1, input.value.length).replace(globalDecimalSeparator, ".")).toFixed(2); // Display the default slider value
    document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + input.value;
    // Update the current slider value (each time you drag the slider handle)
}

function fClearPots() {
    var i;
    for (i = totalPots - 1; i >= 0; i--) {
        /*console.log(`limpando pot${i}`);
        document.getElementById(`pot${i}Amount`).innerHTML = "$0";
        if (i != 0) {
            document.getElementById(`pot${i}Amount`).style.visibility = "hidden";
        }*/
        fUpdatePotAmount(i, 0);
    }
    console.log("limpou os potes");
}

function fClearTable() {
    //TODO limpar a mesa
    //console.log("fClearTable");
    var i;
    //limpa os betsizes, cartas
    for (i = 0; i <= globalTableSize - 1; i++) {
        if(document.getElementById(`betAmount${i}`)!=null){
            document.getElementById(`betAmount${i}`).innerHTML = "$0";
            document.getElementById(`betAmount${i}`).style.visibility = "hidden";
            document.getElementById(`card1Seat${i}`).className = "";
            document.getElementById(`card1Seat${i}`).style.visibility = "hidden";
            document.getElementById(`card2Seat${i}`).className = "";
            document.getElementById(`card2Seat${i}`).style.visibility = "hidden";
            document.getElementById(`timerSeat${i}`).style.visibility = "hidden";
            document.getElementById(`seat${i}`).style.visibility = "hidden";
            document.getElementById(`seatName${i}`).style.visibility = "hidden";
            document.getElementById(`playerCards${i}`).style.visibility = "hidden";
            if(document.getElementById(`dealer${i}`)!=null)
                document.getElementById(`dealer${i}`).style.visibility = "hidden";
            $(`#divPlayer${i}`).remove();
        }
    }
    console.log("limpou os jogadores");
    //limpa os potes
    fClearPots();
    //limpa o bordo
    for (i = 1; i <= 5; i++) {
        document.getElementById(`boardC${i}`).className = "";
        document.getElementById(`boardC${i}`).style.visibility = "hidden";
    }
    console.log("limpou o bordo");
}

function fResetTable() {
    //TODO Atualiza as informacoes da nova mao
    //console.log("fResetTable");
    reservedSits = [];
    fClearTable()
    console.log("limpou a mesa");
    fHideEmptySeats()
    console.log("escondeu os assentos vazios");
}

function fNewHand(handNumber, smallBlind, bigBlind, ante = 0) {
    //TODO Atualiza as informacoes da nova mao
    console.log("fNewHand");
    globalBB = bigBlind;
}

//****** Aumentar fichas
function fShowWinner(sitPosition, wonAmount) {
    //TODO paga o vencedor
    console.log(`fShowWinner position: ${sitPosition} amount: ${wonAmount}`);
    sitPosition = fTransformSitPos(sitPosition);
    fClearPots();
    document.getElementById(`betAmount${sitPosition}`).innerHTML = `+$${wonAmount}`;
    document.getElementById(`betAmount${sitPosition}`).style.visibility = `visible`;

}

//******Substituir por anima_principal(sitPosition, "abaixar")
function fFoldPlayerCards(sitPosition) {
    //TODO Folda as cartas do jogador
    console.log(`fFoldPlayerCards position ${sitPosition}`);
    sitPosition = fTransformSitPos(sitPosition);
    fCardsDown(sitPosition);
}

function fDisableActionButtons() {
    try {
        console.log("fDisableActionButtons");
        document.getElementById(`buttons-container`).style.visibility = "hidden";
        document.getElementById(`range-container`).style.visibility = "hidden";
        document.getElementById(`value-container`).style.visibility = "hidden";
        document.getElementById(`betbar-container`).style.visibility = "hidden";
        document.getElementById('buttonFOLD').style.visibility = "hidden"
        document.getElementById('buttonCHECKorCALL').style.visibility = "hidden"
        document.getElementById('buttonRAISE').style.visibility = "hidden"
        document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO </br>$0"
        document.getElementById('raiseSlider').style.visibility = "hidden"
        document.getElementById('raiseSlider').value = 0
        oldBetSliderVal = 0;
        document.getElementById('raiseAmount').style.visibility = "hidden"
        document.getElementById('raiseAmount').value = "$0.00"
        document.getElementById(`shortcuts-container`).style.visibility = "hidden";
        document.getElementById(`timerSeat0`).style.visibility = 'hidden';
    } catch (err) {
        console.log(`Error on fDisableActionButtons: ${err}`);
    }
}

//******Alterado
function fAddCardToSlot(cardSlot, sitPosition = 0, card) {
    //TODO Mostra as cartas do jogador
    console.log(`fAddCardToSlot slot: ${cardSlot} Pos: ${sitPosition} card: ${card}`);
    sitPosition = fTransformSitPos(sitPosition);
    //cardSlot = cardSlot + "Seat" + sitPosition;
    cardSlotElement = document.getElementById(`${cardSlot + "Seat" + sitPosition}`)
    cardSlotElement.style.visibility = "visible";

    console.log(cardSlotElement.id);
    if (cardSlotElement.id.includes("card1")) {
        if (card == "card") {
            cardSlotElement.className = "cardback";
        } else {
            cardSlotElement.className = "c" + card;
        }

        //anima_principal(sitPosition, 'levantar->secundaria', cardSlot);
    } else if (cardSlotElement.id.includes("card2")) {
        if (card == "card") {
            cardSlotElement.className = "cardback";
        } else {
            cardSlotElement.className = "c" + card;
        }
    }
    //fCardsUp(sitPosition,cardSlot);
    fCardsUp(sitPosition);


    //alert(`fAddCardToSlot slot: ${cardSlot.id} card: ${card}` + cardSlot.style.display);
}

function fAddCardToBoard(cardSlot, card) {
    //TODO Mostra as cartas do jogador
    console.log(`fAddCardToBoard slot: ${cardSlot.id} card: ${card}`);
    cardSlot.className = "board-card c" + card;
    cardSlot.style.visibility = "visible";
    //alert(`fAddCardToSlot slot: ${cardSlot.id} card: ${card}` + cardSlot.style.display);
}

//******Alterado
function fUpdatePotAmount(potNumber, potAmount) {
    console.log(`fUpdatePotAmount(${potNumber}, ${potAmount})`);

    valor_inicial = conjunto_jogadores[potNumber].valor.pot;
    conjunto_jogadores[potNumber].valor.pot = potAmount;
    muda_digito("pot", potNumber, potAmount, valor_inicial)


    /*//TODO
    if (document.getElementById(`pot${potNumber}Amount`) != null) {
        document.getElementById(`pot${potNumber}Amount`).innerHTML = "$" + potAmount;
        document.getElementById(`pot${potNumber}Amount`).style.visibility = "visible";
    }
    potAmount = parseFloat(potAmount);
    if (potNumber != 0 && potAmount == 0) {
        document.getElementById(`pot${potNumber}Amount`).style.visibility = "hidden";
    }*/

}

//******Muda de posicao
function fTransformSitPos(sitPosition) {
    var newSitPos = sitPosition - rotatePos;
    if (newSitPos < 0) {
        newSitPos += globalTableSize;
    }
    return newSitPos;
}

//******Inicialização
function fSitPlayer(sitPosition, playerName, idAvatar) {
    console.log(`fSitPlayer(${sitPosition}, ${playerName})`);
    sitPosition = fTransformSitPos(sitPosition);
    reservedSits.push(sitPosition);
    /* document.getElementById(`seat${sitPosition}`).style.visibility = "visible";
     document.getElementById(`card1Seat${sitPosition}`).style.visibility = "hidden";
     document.getElementById(`card2Seat${sitPosition}`).style.visibility = "hidden";
     //document.getElementById(`buttonSeat${sitPosition}`).disabled = "true";
     //document.getElementById(`buttonSeat${sitPosition}`).style.visibility = "hidden";
     document.getElementById(`seatName${sitPosition}`).innerHTML = `${playerName}`;
     document.getElementById(`avSeat${sitPosition}`).style.backgroundImage = "url(avatar/" + idAvatar + ".png)";*/
    margin_left = (conjunto_jogadores[sitPosition].posicao_centro.x - jogador_geral.largura_total * proporcao_centro_jogador_largura_jogador * conjunto_jogadores[sitPosition].proporcao)
    margin_top = (conjunto_jogadores[sitPosition].posicao_centro.y - jogador_geral.altura_total * proporcao_centro_jogador_altura_jogador);
    conjunto_jogadores[sitPosition].imagem = 'avatar/' + idAvatar + '.png'
    html = "<div id='divPlayer" + sitPosition + "' style='position:absolute;height:" + mesa.altura_total + "px;width:" + mesa.largura_total + "px'>";
    html = html + "<div id='seat" + sitPosition + "' style='position:absolute;z-index:3;margin-left:" + margin_left + "px;margin-top:" + (margin_top * 1 - (texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao)) + "px'><img id='avSeat" + sitPosition + "' src='" + conjunto_jogadores[sitPosition].imagem + "' style='width:" + jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px'></div>";
    //html = html + "<div style='position:absolute;z-index: 2;width:" + 1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + ";margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px'>";
    html = html + "<div style='position:absolute;z-index:7;background: #394052;width:" + 1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + 1.4 * texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.85 * texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px'></div>";
    html = html + "<div style='position:absolute;z-index:5;background: #343A4A;width:" + 1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + 2.2 * texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.85 * (texto.nome_jogador.posicao.y + 1.4 * texto.nome_jogador.dimensoes.altura) * conjunto_jogadores[sitPosition].proporcao) + "px;'></div>";
    html = html + "<div style='position:absolute;z-index:7;height:" + 5 * conjunto_jogadores[sitPosition].proporcao + "px;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.85 * (texto.nome_jogador.posicao.y + 3.6 * texto.nome_jogador.dimensoes.altura) * conjunto_jogadores[sitPosition].proporcao) + "px;border:solid 1px #343A4A;background:#2b303d;'></div>";
    html = html + "<div style='position:absolute;z-index:8;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div style='display:block;overflow-y:hidden;overflow-x:hidden;float:left;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:left;margin-top:" + (texto.valor_jogador.posicao.y + texto.valor_jogador.digito.altura + 12) * conjunto_jogadores[sitPosition].proporcao + "px;'><div  id='timerSeat" + sitPosition + "' style='visibility: hidden;background-image:url(\"images/barra_tempo.png\");background-size: cover;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px;height:" + 5 * conjunto_jogadores[sitPosition].proporcao + "px'></div></div></div>";
    //html = html + "</div>";
    html = html + "<div id='seatName" + sitPosition + "' style='position:absolute;text-transform: uppercase;z-index:7;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 + 0.9 * texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao) + "px;color:white;height:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;font-size:" + texto.nome_jogador.dimensoes.altura * conjunto_jogadores[sitPosition].proporcao + "px'>" + playerName + "</div>";
    //***TOTALPOT original*** html = html + "<div style='position:absolute;z-index:4;width:" + texto.valor_jogador.dimensoes.largura * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (margin_left * 1) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div id='campopot" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-style:sans-serif;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;margin-top:" + texto.valor_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao + "px;'><div id='totalpot" + sitPosition + "' style='font-family:sans-serif;'></div></div></div>";
    conjunto_jogadores[sitPosition].nome = playerName;


    html = html + "<div style='position:absolute;z-index:8;width:" + (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 4) + "px;margin-left:" + (margin_left * 1 - 0.2 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + 2) + "px;margin-top:" + (margin_top * 1 - texto.valor_jogador.dimensoes.altura * 0.8 * conjunto_jogadores[sitPosition].proporcao) + "px;'><div id='campopot" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;color:white;font-size:" + texto.valor_jogador.digito.altura * conjunto_jogadores[sitPosition].proporcao + "px;text-align:right;padding:0px 2px 0px 0px;margin-top:" + 1.04 * texto.valor_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao + "px;'><div id='totalpot" + sitPosition + "' style=''></div></div></div>";

    html = html + "<div id='caixa_fichas_jogador" + sitPosition + "' style='position:absolute;display:none;opacity:0;overflow-y:hidden;overflow-x:hidden;width:" + ficha.caixa_fichas.largura + "px;height:" + ficha.dimensoes.altura + "px;margin-top:" + conjunto_jogadores[sitPosition].posicao_ficha.y + "px;margin-left:" + (conjunto_jogadores[sitPosition].posicao_ficha.x - (ficha.caixa_fichas.largura / 2)) + "px'></div>";
    html = html + "<div style='position:absolute;z-index:4;width:" + texto.fichas.dimensoes.largura + "px;margin-left:" + (conjunto_jogadores[sitPosition].posicao_ficha.x - texto.fichas.dimensoes.largura / 2) + "px;'><div id='betAmount" + sitPosition + "' style='display:block;overflow-y:hidden;overflow-x:hidden;float:right;height:" + texto.fichas.digito.altura + "px;background-color:gray;color:white;opacity:0%;border:3px solid gray;border-radius:3px;font-size:" + texto.fichas.digito.altura + "px;text-align:right;margin-top:" + (conjunto_jogadores[sitPosition].posicao_ficha.y * 1 + (ficha.dimensoes.altura / 2) - texto.fichas.digito.altura) + "px;z-index:4'><div id='totalfichas" + sitPosition + "' style='float:right'></div></div></div>";
    html = html + "<div id='playerCards" + sitPosition + "' style='position:absolute;overflow-y:hidden;overflow-x:hidden;width:" + jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px;margin-top:" + margin_top + "px;margin-left:" + margin_left + "px'>";
    html = html + "<div class='cardback' id='card1Seat" + sitPosition + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;z-index:6;height:" + carta.dimensoes.altura_total * conjunto_jogadores[sitPosition].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px'></div>";
    html = html + "<div class='cardback' id='card2Seat" + sitPosition + "'style='position:absolute;border-radius:3px;background-repeat:no-repeat;background-position:center;background-size:contain;z-index:6;height:" + carta.dimensoes.altura_total * conjunto_jogadores[sitPosition].proporcao + "px;width:" + carta.dimensoes.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;margin-left:" + (carta.posicao.segunda.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + jogador_geral.altura_total * 0.665 * conjunto_jogadores[sitPosition].proporcao + "px'></div></div>";

    html = html + "<div id='pisca" + sitPosition + "' class='piscaPisca' style='width:" + 1.8 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;height:" + 1.8 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao + "px;z-index:2;margin-left:" + (margin_left * 1 - 0.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao) + "px;margin-top:" + (margin_top * 1 - 0.8 * (texto.nome_jogador.posicao.y * conjunto_jogadores[sitPosition].proporcao)) + "px'></div>"

    //html = html + "<div id='marca_centro' style='position:absolute;background-color:red;z-index:20;height:3px;width:3px;margin-left:" + mesa.largura_total * mesa.centro.x + "px;margin-top:" + mesa.largura_total * mesa.centro.y + "px'></div></div>";
    //html = html + "<div id='marca_posicao_ficha" + sitPosition + "' style='position:absolute;background-color:blue;z-index:20;height:3px;width:3px;margin-left:" + conjunto_jogadores[sitPosition].posicao_ficha.x + "px;margin-top:" + conjunto_jogadores[sitPosition].posicao_ficha.y + "px'></div></div>";
    html = html + "</div>";

    digitos_por_jogador[sitPosition] = { 'pot': { 'maximo': 0, 'minimo': 0, 'atual': 0 }, 'fichas': { 'maximo': 0, 'minimo': 0, 'atual': 0 } };
    inicializa_digitos_max_min(sitPosition, 'todos');

    document.getElementById('mesa').innerHTML = document.getElementById('mesa').innerHTML + html;
    inicializa_digitos_valores(sitPosition, 'fichas');
    inicializa_digitos_valores(sitPosition, 'pot');
}

//******Verificar
function fSitHero(sitPosition, playerName, idAvatar) {
    console.log(`fSitHero(${sitPosition}, ${playerName})`);
    try {
        rotatePos = sitPosition;
        reservedSits.push(sitPosition);
        fSitPlayer(sitPosition, playerName, idAvatar);
        //document.getElementById(`seat${0}`).style.visibility = "visible";
        //document.getElementById(`card1Seat${0}`).style.visibility = "hidden";
        //document.getElementById(`card2Seat${0}`).style.visibility = "hidden";
        ////document.getElementById(`buttonSeat${sitPosition}`).disabled = "true";
        ////document.getElementById(`buttonSeat${sitPosition}`).style.visibility = "hidden";
        //document.getElementById(`seatName${0}`).innerHTML = `${playerName}`;
        //document.getElementById("avSeat0").style.backgroundImage = "url(avatar/" + idAvatar + ".png)";
        ////document.getElementById(`seatName${sitPosition}`).style.textDecoration = 'underline';        
    } catch (err) {
        console.log(`Error on fSitHero(${sitPosition}, ${playerName}): ${err}`);
    }
}

function fSitOut(sitPosition) {
    //console.log(`fSitOut(${sitPosition})`);
    if (reservedSits.includes(sitPosition)) {
        document.getElementById(`sitOut${sitPosition}`).style.visibility = "visible"
    }
}

function fSitIn(sitPosition) {
    //console.log(`fSitIn(${sitPosition})`);
    if (reservedSits.includes(sitPosition)) {
        document.getElementById(`sitOut${sitPosition}`).style.visibility = "hidden"
    }
}

//******Alterado
function fUpdatePlayerBet(sitPosition, betAmount) {
    console.log(`fUpdatePlayerBet(${sitPosition}, ${betAmount})`);
    //TODO
    sitPosition = fTransformSitPos(sitPosition);

    /*document.getElementById(`betAmount${sitPosition}`).innerHTML = "$" + betAmount;
    //document.getElementById(`betSeat${sitPosition}`).style.visibility = "visible";
    betAmount = parseFloat(betAmount);*/
    if (betAmount == 0) {
        //document.getElementById(`betAmount${sitPosition}`).style.visibility = "hidden";
        anima_opacity('betAmount' + sitPosition, 'diminui', '0.0', 0.8)
    } else {
        anima_opacity('betAmount' + sitPosition, 'aumenta', '0.6', 0);
        //document.getElementById(`betAmount${sitPosition}`).style.visibility = "visible";
    }
    valor_inicial = conjunto_jogadores[sitPosition].valor.fichas;
    conjunto_jogadores[sitPosition].valor.fichas = betAmount;
    muda_digito("fichas", sitPosition, betAmount, valor_inicial)


}

function fUpdatePlayerStack(sitPosition, stackAmount) {
    console.log(`fUpdatePlayerStack(${sitPosition}, ${stackAmount})`);
    sitPosition = fTransformSitPos(sitPosition);
    document.getElementById(`stackAmountSeat${sitPosition}`).innerHTML = "$" + stackAmount;
    //document.getElementById(`stackSeat${sitPosition}`).style.visibility = "visible";
    //document.getElementById(`stackAmountSeat${sitPosition}`).style.visibility = "visible";
}

function fUpdatePlayerTurn(sitPosition, timetoAct) {
    //TODO Atualiza de qual oponente é a vez
    //mostrar em negrito
    console.log(`fUpdatePlayerTurn pos ${sitPosition}`);
    var i;
    sitPosition = fTransformSitPos(sitPosition);
    document.getElementById(`seatName${sitPosition}`).style.fontWeight = "bold";
    anima_principal(sitPosition, 'levantar->principal');
    for (i = 0; i <= globalTableSize - 1; i++) {
        document.getElementById(`seatName${i}`).style.fontWeight = "normal";
        document.getElementById(`timerSeat${i}`).style.visibility = 'hidden';
        if ((document.getElementById(`pisca${i}`).style.visibility == 'visible') && (sitPosition != i)) {
            document.getElementById(`pisca${i}`).style.visibility = 'hidden';
            anima_principal(i, 'principal->secundaria');
        }
    }

    fActivateTimer(sitPosition, timetoAct)
}

function fLocalPlayerTurn(amountToCall, minBet, maxBet, validActions, timetoAct) {
    //TODO Atualiza informacoes e habilita os botoes para o jogador agir
    globalAmountToCall = parseFloat(amountToCall);
    globalMinBet = parseFloat(minBet);
    globalMaxBet = parseFloat(maxBet);

    console.log(`fLocalPlayerTurn args: amtToCall: ${globalAmountToCall}, minBet ${globalMinBet}, maxBet ${globalMaxBet}, actions: ${validActions}, timetoAct: ${timetoAct}`);
    document.getElementById('buttonFOLD').style.visibility = "hidden"
    document.getElementById('buttonCHECKorCALL').style.visibility = "hidden"
    document.getElementById('buttonRAISE').style.visibility = "hidden"
    document.getElementById('raiseSlider').style.visibility = "hidden"
    document.getElementById('raiseAmount').style.visibility = "hidden"

    if (globalAmountToCall == 0) {
        document.getElementById('buttonCHECKorCALLSpan').innerHTML = `CHECK`;
    } else {
        document.getElementById('buttonCHECKorCALLSpan').innerHTML = `CALL $${globalAmountToCall.toFixed(2).replace(".", globalDecimalSeparator)}`;
    }
    document.getElementById('raiseSlider').min = globalMinBet;
    document.getElementById('raiseSlider').max = globalMaxBet;
    document.getElementById('raiseSlider').value = globalMinBet;
    document.getElementById('raiseAmount').value = "$" + globalMinBet.toFixed(2).replace(".", globalDecimalSeparator);
    document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + document.getElementById('raiseAmount').value;
    console.log(validActions)
    validActions.forEach(function(action) {
        console.log(action)
        if (action == "CHECK" || action == "CALL") {
            document.getElementById('buttonCHECKorCALL').style.visibility = "visible"
        } else {
            document.getElementById(`button${action}`).style.visibility = "visible";
        }
        if (action == "RAISE" && globalMinBet != globalMaxBet) {
            document.getElementById(`range-container`).style.visibility = "visible";
            document.getElementById(`value-container`).style.visibility = "visible";
            document.getElementById(`betbar-container`).style.visibility = "visible";
            document.getElementById('raiseSlider').style.visibility = "visible"
            document.getElementById('raiseAmount').style.visibility = "visible"
            document.getElementById(`shortcuts-container`).style.visibility = "visible";
        }
        if (action == "RAISE" && globalMinBet == globalAmountToCall) {
            document.getElementById('buttonCHECKorCALL').style.visibility = "hidden"
        }
        if (action == "RAISE" && globalMinBet == globalMaxBet) {
            document.getElementById('buttonRAISESpan').innerHTML = "ALL-IN"
        }
    });
    document.getElementById('buttons-container').style.visibility = "visible";
    document.getElementById(`timerSeat0`).style.visibility = 'visible';
    document.getElementById(`pisca0`).style.visibility = 'visible';
    fActivateTable();
    fActivateTimer(0, timetoAct);
    timeOutAct = window.setTimeout('fDisableActionButtons()', timetoAct * 1000);
}

//****** Substituir por anima_principal(sitPosition, 'levantar->secundaria');
function fCardsUp(sitPosition, cardSlot = '') {
    //console.log(`fCardsUp Pos: ${sitPosition} ` + document.getElementById(`playerCards${sitPosition}`).style.marginTop);
    //Identifica se a carta está na posição do jogador secundário e levanta a carta
    /*$(`#playerCards${sitPosition}`).stop();
    document.getElementById("playerCards" + sitPosition).style.marginTop = '70px';
    $(`#playerCards${sitPosition}`).animate({
        'margin-top': "0px"
    }, 700);*/
    anima_principal(sitPosition, 'levantar->secundaria', cardSlot);

    //document.getElementById("card1Seat" + sitPosition).style.marginTop = '0px';
    //document.getElementById("card2Seat" + sitPosition).style.marginTop = '0px';

    //if ((document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1) > 0) {
    //    document.getElementById("card1Seat" + sitPosition).style.marginTop = (document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 - 1) + 'px';
    //    document.getElementById("card2Seat" + sitPosition).style.marginTop = (document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 - 1) + 'px';
    //    setTimeout(function() { fCardsUp(sitPosition) }, 10);
    //}
}

//****** Substituir por anima_principal(sitPosition, 'abaixar');
function fCardsDown(sitPosition, cardSlot = '') {
    //console.log(`fCardsDown Pos: ${sitPosition} Margin: ` + document.getElementById("card1Seat" + sitPosition).style.marginTop);
    //Identifica se a carta está na posição do jogador secundário e levanta a carta

    /*$(`#playerCards${sitPosition}`).stop();
    document.getElementById("playerCards" + sitPosition).style.marginTop = '0px';
    $(`#playerCards${sitPosition}`).animate({
        'margin-top': "70px"
    }, 700);*/
    anima_principal(sitPosition, 'abaixar', cardSlot);

    //document.getElementById("card1Seat" + sitPosition).transform({'marginTop':'70px'}, 500);
    //document.getElementById("card2Seat" + sitPosition).transform({'marginTop':'70px'}, 500);
    //if ((document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1) < 70) {
    //    document.getElementById("card1Seat" + sitPosition).style.marginTop = (document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + 1) + 'px';
    //    document.getElementById("card2Seat" + sitPosition).style.marginTop = (document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + 1) + 'px';
    //    setTimeout(function() { fCardsDown(sitPosition) }, 10);
    //}
    //else{			
    //	document.getElementById(`card1Seat${sitPosition}`).className = "";
    //	document.getElementById(`card1Seat${sitPosition}`).style.visibility = "hidden";
    //	document.getElementById(`card2Seat${sitPosition}`).className = "";
    //	document.getElementById(`card2Seat${sitPosition}`).style.visibility = "hidden";
    //}
}

function fDisableTime(sitPosition) {
    sitPosition = fTransformSitPos(sitPosition);
    $(`#timerSeat${sitPosition}`).stop();
    document.getElementById(`timerSeat${sitPosition}`).style.visibility = 'hidden';
    document.getElementById(`timerSeat${sitPosition}`).style.width = '100%';
}

function fActivateTimer(sitPosition, timeLeft) {
    //TODO Atualiza a posicao do dealer
    console.log(`fActivateTimer(Pos:${sitPosition} Time Left: ${timeLeft})`);
    $(`#timerSeat${sitPosition}`).stop();
    document.getElementById(`timerSeat${sitPosition}`).style.visibility = 'visible';
    document.getElementById(`timerSeat${sitPosition}`).style.width = (1.4 * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao - 2) + "px"; //'100%';
    document.getElementById(`pisca${sitPosition}`).style.visibility = 'visible';
    console.log(`timerSeat${sitPosition}`);
    $(`#timerSeat${sitPosition}`).animate({
        width: '0px' //"1%"
    }, timeLeft * 1000);
}

function fUpdateDealerPosition(sitPosition) {
    //TODO Atualiza a posicao do dealer
    console.log(`fUpdateDealerPosition(${sitPosition})`);
    var i;
    sitPosition = fTransformSitPos(sitPosition);
    for (i = 0; i <= globalTableSize - 1; i++) {
        document.getElementById(`dealer${i}`).style.visibility = "hidden";
    }
    document.getElementById(`dealer${sitPosition}`).style.visibility = "visible";
}

function fBtnBetPerc(perc) {
    console.log(`fBtnBetPerc(${perc})`);
    var totalPot = 0;
    var currentBet = 0;
    /*
    Desabilitado temporariamente para avaliação de range
    for (i = 0; i < globalTableSize; i++) {
        totalPot += parseFloat(document.getElementById(`betAmount${i}`).innerHTML.substring(1, document.getElementById(`betAmount${i}`).innerHTML.length));
        if (i > 0) {
            if (parseFloat(document.getElementById(`betAmount${i}`).innerHTML.substring(1, document.getElementById(`betAmount${i}`).innerHTML.length)) > currentBet) {
                currentBet = parseFloat(document.getElementById(`betAmount${i}`).innerHTML.substring(1, document.getElementById(`betAmount${i}`).innerHTML.length));
            }
        }
    }    
    
    for (i = 0; i < totalPots - 1; i++) {
        totalPot += parseFloat(document.getElementById(`pot${i}Amount`).innerHTML.substring(1, document.getElementById(`pot${i}Amount`).innerHTML.length));
    }
    console.log(`fBtnBetPerc(${perc}) - totalPot:${totalPot}`);
    console.log(`fBtnBetPerc(${perc}) - currentBet:${currentBet}`);
    console.log(`fBtnBetPerc(${perc}) - globalAmountToCall:${globalAmountToCall}`);
    console.log(`fBtnBetPerc(${perc}) - betAmount0:${parseFloat(betAmount0.innerHTML.substring(1, betAmount0.innerHTML.length))}`);*/
    //raiseSize = ((parseFloat(globalAmountToCall) - parseFloat(betAmount0.innerHTML.substring(1, betAmount0.innerHTML.length)) + parseFloat(totalPot)) * parseFloat(perc)/100) + parseFloat(globalAmountToCall);
    for (i = 0; i < globalTableSize; i++) {
        totalPot += conjunto_jogadores[i].valor.fichas; //parseFloat(document.getElementById(`betAmount${i}`).innerHTML.substring(1, document.getElementById(`betAmount${i}`).innerHTML.length));
        if (i > 0) {
            if (conjunto_jogadores[i].valor.fichas > currentBet) {
                currentBet = conjunto_jogadores[i].valor.fichas;
            }
        }
    }

    for (i = 0; i < totalPots - 1; i++) {
        totalPot += conjunto_jogadores[i].valor.pot;
    }
    console.log(`fBtnBetPerc(${perc}) - totalPot:${totalPot}`);
    console.log(`fBtnBetPerc(${perc}) - currentBet:${currentBet}`);
    console.log(`fBtnBetPerc(${perc}) - globalAmountToCall:${globalAmountToCall}`);
    //console.log(`fBtnBetPerc(${perc}) - betAmount0:${parseFloat(betAmount0.innerHTML.substring(1, betAmount0.innerHTML.length))}`);
    console.log(`fBtnBetPerc(${perc}) - betAmount0:${parseFloat(conjunto_jogadores[0].valor.pot)}`);
    //raiseSize = parseFloat(currentBet) + ((parseFloat(totalPot) + parseFloat(currentBet) - parseFloat(betAmount0.innerHTML.substring(1, betAmount0.innerHTML.length))) * parseFloat(perc) / 100)
    raiseSize = parseFloat(currentBet) + ((parseFloat(totalPot) + parseFloat(currentBet) - parseFloat(conjunto_jogadores[0].valor.pot)) * parseFloat(perc) / 100)
    console.log(`fBtnBetPerc(${perc}) - raiseSize:${raiseSize}`);
    if (raiseSize < globalMinBet) {
        raiseSize = globalMinBet;
    } else if (raiseSize > globalMaxBet) {
        raiseSize = globalMaxBet;
    }
    document.getElementById('raiseSlider').value = raiseSize;
    oldBetSliderVal = raiseSize;
    document.getElementById('raiseAmount').value = "$" + raiseSize.toFixed(2).replace(".", globalDecimalSeparator);
    document.getElementById('buttonRAISESpan').innerHTML = "RAISE TO</br>" + document.getElementById('raiseAmount').value;
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

        anima_opacity('betAmount' + variavel_jogador, 'aumenta', '0.6', 0);
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
        anima_opacity('betAmount' + variavel_jogador, 'diminui', '0.0', 0.8)

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
        anima_principal(variavel_jogador, 'levantar->secundaria');


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
        anima_principal(variavel_jogador, 'principal->secundaria');


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
        anima_principal(variavel_jogador, 'secundaria->principal');

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
function conta_tempo_barra(sitPosition, init = true, tempo = 0) {

    if (init) {
        tempo = parametros_animacao.barra_tempo.tempo_em_segundos * 100;
        document.getElementById('barra_tempo' + sitPosition).style.display = 'block';
        document.getElementById('barra_tempo' + sitPosition).style.width = (texto.valor_jogador.dimensoes.largura - 4) * conjunto_jogadores[sitPosition].proporcao + 'px'
        init = false;
    }

    if ((document.getElementById('barra_tempo' + sitPosition).style.width.replace('px', '') * 1) >= 0) {

        document.getElementById('barra_tempo' + sitPosition).style.width = ((texto.valor_jogador.dimensoes.largura - 4) * conjunto_jogadores[sitPosition].proporcao * (tempo / (parametros_animacao.barra_tempo.tempo_em_segundos * 100))) + 'px';
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

function anima_principal(sitPosition, tipo_movimento, cardSlot = '') {

    console.log(tipo_movimento);
    console.log(conjunto_jogadores[sitPosition].anima_principal.tipo_movimento);
    console.log(conjunto_jogadores[sitPosition].anima_principal.rodando);
    //Ou o movimento é igual ao anterior ou está parado. Se um movimento for atualizado, ele para a animação
    if ((conjunto_jogadores[sitPosition].anima_principal.tipo_movimento == '') || (conjunto_jogadores[sitPosition].anima_principal.tipo_movimento == tipo_movimento) || !conjunto_jogadores[sitPosition].anima_principal.rodando) {
        conjunto_jogadores[sitPosition].anima_principal.rodando = true;
        conjunto_jogadores[sitPosition].anima_principal.tipo_movimento = tipo_movimento;
        console.log("Tipo movimento=" + tipo_movimento);
        //Movimento de fichas ao centro
        if (tipo_movimento == 'fichas->centro') {

            //Define ponto de destino das fichas nas duas coordenadas
            centro_horizontal = mesa.largura_total * mesa.centro.x;
            centro_vertical = mesa.altura_total * mesa.centro.y + (ficha.dimensoes.altura / 2);

            //Define uma margem para parar a animação antes do centro para deixar o passo da animação mais livre. Caso contrário, o passo da animação deverá alcançar exatamente o centro.
            //Sob o risco de, em caso de bug em arredondamento do próprio navegador, causar um efeito tremido. Visualmente não causa impacto.
            margem_centro = parametros_animacao.anima_principal.margem_centro;

            //Define ponto de origem das fichas nas duas coordenadas
            margin_left = conjunto_jogadores[sitPosition].posicao_ficha.x;
            margin_top = conjunto_jogadores[sitPosition].posicao_ficha.y;


            //Definições dos parâmetros a e b da equação da reta y=a*x+b por onde as fichas irão percorrer
            a = (margin_top - centro_vertical) / (margin_left - centro_horizontal);
            b = margin_top - a * margin_left;
            anima = true;


            //O passo da animação de caminhada sobre a equação da reta deverá ser o mesmo para todas as fichas, independentemente do ângulo. Porém, como y é definido em função de x,
            //é feito o rebatimento da reta no eixo x e o step_x será step_reta*(cosseno do ângulo entre o eixo x e a reta)
            step_x = parametros_animacao.anima_carta.movimento_carta_step * (margin_left - centro_horizontal) / Math.sqrt((centro_horizontal - margin_left) * (centro_horizontal - margin_left) + (centro_vertical - margin_top) * (centro_vertical - margin_top));

            //Se as fichas estiverem à direita do centro.


            if ((document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2)) > (centro_horizontal + margem_centro)) {

                //Bloco movimento
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1 - step_x) + 'px';
                x = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1) + Math.round(ficha.caixa_fichas.largura / 2);
                y = a * x + b;

                document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop = y + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade
                taxa_reducao = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2) - centro_horizontal) / (margin_left - centro_horizontal);

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            }
            //Se as fichas estiverem à esquerda do centro.
            else if ((document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2)) < (centro_horizontal - margem_centro)) {

                //Bloco movimento
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1 - step_x) + 'px';

                x = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1) + Math.round(ficha.caixa_fichas.largura / 2);
                y = a * x + b;
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop = y + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade            
                taxa_reducao = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginLeft.replace('px', '') * 1 + Math.round(ficha.caixa_fichas.largura / 2) - centro_horizontal) / (margin_left - centro_horizontal);

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.            
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            }
            //Para os casos em que as fichas não possuem deslocamento em x e estão localizadas abaixo do centro
            else if ((document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop.replace('px', '') * 1) > (centro_vertical + margem_centro)) {

                //Bloco movimento
                step = (parametros_animacao.anima_carta.movimento_carta_velocidade);
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop = ((document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop.replace('px', '') * 1) - step) + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                    
                taxa_reducao = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            }
            //Para os casos em que as fichas não possuem deslocamento em x e estão localizadas acima do centro
            else if ((document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop.replace('px', '') * 1) < (centro_vertical - margem_centro)) {

                //Bloco movimento
                step = (parametros_animacao.anima_carta.movimento_carta_velocidade);
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop = ((document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop.replace('px', '') * 1) + step) + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                        
                taxa_reducao = (document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
                document.getElementById('caixa_fichas_jogador' + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
            } else {
                anima = false;
                conjunto_jogadores[sitPosition].anima_principal.rodando = false;
            }

            if (anima)
                setTimeout(function() { anima_principal(sitPosition, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }

        //Movimento de cartas ao centro. As cartas estão dentro de um compartimento chamado playerCards. É ela quem anda sobre a reta.    
        if (tipo_movimento == 'cartas->centro') {

            largura_caixa_cartas = document.getElementById('playerCards' + sitPosition).style.width.replace('px', '') * 1;
            altura_caixa_cartas = document.getElementById('playerCards' + sitPosition).style.height.replace('px', '') * 1;

            //Define ponto de destino das fichas nas duas coordenadas        
            centro_horizontal = mesa.largura_total * mesa.centro.x - (largura_caixa_cartas / 2);
            centro_vertical = mesa.altura_total * mesa.centro.y + (altura_caixa_cartas / 4);

            //Define uma margem para parar a animação antes do centro para deixar o passo da animação mais livre. Caso contrário, o passo da animação deverá alcançar exatamente o centro.
            //Sob o risco de, em caso de bug em arredondamento do próprio navegador, causar um efeito tremido. Visualmente não causa impacto.
            margem_centro = 1;

            //Define ponto de origem das fichas nas duas coordenadas        
            margin_left = (conjunto_jogadores[sitPosition].posicao_centro.x - jogador_geral.largura_total * proporcao_centro_jogador_largura_jogador);
            margin_top = (conjunto_jogadores[sitPosition].posicao_centro.y - jogador_geral.altura_total * proporcao_centro_jogador_altura_jogador); //Se alterar em init, alterar aqui também.                        


            //Definições dos parâmetros a e b da equação da reta y=a*x+b por onde as fichas irão percorrer        
            a = (margin_top - centro_vertical) / (margin_left - centro_horizontal);
            b = margin_top - a * margin_left;
            anima = true;

            if ((document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1) > centro_horizontal + margem_centro) {
                //Bloco movimento
                document.getElementById('playerCards' + sitPosition).style.marginLeft = ((document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1) - parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                x = (document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1);
                y = a * x + b;
                document.getElementById('playerCards' + sitPosition).style.marginTop = y + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                    
                taxa_reducao = (document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1 - centro_horizontal) / (margin_left - centro_horizontal);

                //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
                document.getElementById("card1Seat" + sitPosition).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card1Seat" + sitPosition).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card2Seat" + sitPosition).style.height = document.getElementById("card1Seat" + sitPosition).style.height;
                document.getElementById("card2Seat" + sitPosition).style.width = document.getElementById("card1Seat" + sitPosition).style.width;

                //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
                document.getElementById("card1Seat" + sitPosition).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';
                document.getElementById("card2Seat" + sitPosition).style.marginLeft = document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
                document.getElementById("card1Seat" + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
                document.getElementById("card2Seat" + sitPosition).style.opacity = document.getElementById("card1Seat" + sitPosition).style.opacity;
            } else if ((document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1) < centro_horizontal - margem_centro) {
                //Bloco movimento
                document.getElementById('playerCards' + sitPosition).style.marginLeft = ((document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1) + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                x = (document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1);
                y = a * x + b;
                document.getElementById('playerCards' + sitPosition).style.marginTop = y + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                                
                taxa_reducao = (document.getElementById('playerCards' + sitPosition).style.marginLeft.replace('px', '') * 1 - centro_horizontal) / (margin_left - centro_horizontal);

                //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                                   
                document.getElementById("card1Seat" + sitPosition).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card1Seat" + sitPosition).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card2Seat" + sitPosition).style.height = document.getElementById("card1Seat" + sitPosition).style.height;
                document.getElementById("card2Seat" + sitPosition).style.width = document.getElementById("card1Seat" + sitPosition).style.width;

                //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
                document.getElementById("card1Seat" + sitPosition).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';
                document.getElementById("card2Seat" + sitPosition).style.marginLeft = document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';

                document.getElementById("card1Seat" + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
                document.getElementById("card2Seat" + sitPosition).style.opacity = document.getElementById("card1Seat" + sitPosition).style.opacity;
            } else if ((document.getElementById('playerCards' + sitPosition).style.marginTop.replace('px', '') * 1) > centro_vertical + margem_centro) {
                //Bloco movimento
                document.getElementById('playerCards' + sitPosition).style.marginTop = ((document.getElementById('playerCards' + sitPosition).style.marginTop.replace('px', '') * 1) - parametros_animacao.anima_carta.movimento_carta_step) + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                                
                taxa_reducao = (document.getElementById('playerCards' + sitPosition).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

                //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                                   
                document.getElementById("card1Seat" + sitPosition).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card1Seat" + sitPosition).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card2Seat" + sitPosition).style.height = document.getElementById("card1Seat" + sitPosition).style.height;
                document.getElementById("card2Seat" + sitPosition).style.width = document.getElementById("card1Seat" + sitPosition).style.width;

                //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
                document.getElementById("card1Seat" + sitPosition).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';
                document.getElementById("card2Seat" + sitPosition).style.marginLeft = document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
                document.getElementById("card1Seat" + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
                document.getElementById("card2Seat" + sitPosition).style.opacity = document.getElementById("card1Seat" + sitPosition).style.opacity;
            } else if ((document.getElementById('playerCards' + sitPosition).style.marginTop.replace('px', '') * 1) < centro_vertical - margem_centro) {
                //Bloco movimento
                document.getElementById('playerCards' + sitPosition).style.marginTop = ((document.getElementById('playerCards' + sitPosition).style.marginTop.replace('px', '') * 1) + parametros_animacao.anima_carta.movimento_carta_step) + 'px';

                //A taxa de redução é um valor que varia entre 0 e 1 da origem para o destino, pode ser usado para controlar escala ou opacidade                                                
                taxa_reducao = (document.getElementById('playerCards' + sitPosition).style.marginTop.replace('px', '') * 1 - centro_vertical) / (margin_top - centro_vertical);

                //Variação de tamanho das cartas, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                                   
                document.getElementById("card1Seat" + sitPosition).style.height = carta.dimensoes.altura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card1Seat" + sitPosition).style.width = carta.dimensoes.largura_total * (carta.escala_ao_centro.minimo + (carta.escala_ao_centro.maximo - carta.escala_ao_centro.minimo) * taxa_reducao) + 'px';
                document.getElementById("card2Seat" + sitPosition).style.height = document.getElementById("card1Seat" + sitPosition).style.height;
                document.getElementById("card2Seat" + sitPosition).style.width = document.getElementById("card1Seat" + sitPosition).style.width;

                //Ajuste da posição das cartas para ficarem no meio da caixa e se manterem próximas, uma da outra, durante a mudança de tamanho
                document.getElementById("card1Seat" + sitPosition).style.marginLeft = (largura_caixa_cartas / 2) - document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';
                document.getElementById("card2Seat" + sitPosition).style.marginLeft = document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + document.getElementById("card1Seat" + sitPosition).style.width.replace('px', '') * 1 + 'px';

                //Variação de opacidade, de acordo com a caminhada origem->destino. Parâmetros máxmo e mínimo controlados nas variáveis globais.                       
                document.getElementById("card1Seat" + sitPosition).style.opacity = (carta.opacidade_ao_centro.minimo + (carta.opacidade_ao_centro.maximo - carta.opacidade_ao_centro.minimo) * taxa_reducao);
                document.getElementById("card2Seat" + sitPosition).style.opacity = document.getElementById("card1Seat" + sitPosition).style.opacity;
            } else {
                anima = false;
                conjunto_jogadores[sitPosition].anima_principal.rodando = false;
            }
            if (anima)
                setTimeout(function() { anima_principal(sitPosition, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }

        if ((tipo_movimento == 'levantar->secundaria') || (tipo_movimento == 'levantar->principal')) {
            secundaria_principal = tipo_movimento.split('->')[1];
            //Identifica se a carta está na posição do jogador secundário e levanta a carta
            animacarta = false;
            conjunto_jogadores[sitPosition].anima_principal.rodando = false;
            if ((cardSlot == 'card1') || (cardSlot == '')) {

                if (((document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1) < (Math.ceil(carta.posicao.primeira[secundaria_principal].x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao)))) {
                    console.log("Antes1:" + document.getElementById("card1Seat" + sitPosition).style.marginLeft)
                    document.getElementById("card1Seat" + sitPosition).style.marginLeft = Math.ceil((document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step)) + 'px';
                    console.log("Depois1:" + document.getElementById("card1Seat" + sitPosition).style.marginLeft)
                    animacarta = true;
                }

                if ((document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1) > Math.floor((1 - carta.posicao.primeira[secundaria_principal].y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)) {
                    document.getElementById("card1Seat" + sitPosition).style.marginTop = Math.floor(document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                    animacarta = true;
                }
            }

            if ((cardSlot == 'card2') || (cardSlot == '')) {
                if (((document.getElementById("card2Seat" + sitPosition).style.marginLeft.replace('px', '') * 1) < Math.ceil(carta.posicao.segunda[secundaria_principal].x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao))) {
                    document.getElementById("card2Seat" + sitPosition).style.marginLeft = Math.ceil((document.getElementById("card2Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step)) + 'px';
                    animacarta = true;
                }

                if ((document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1) > Math.floor((1 - carta.posicao.segunda[secundaria_principal].y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)) {

                    document.getElementById("card2Seat" + sitPosition).style.marginTop = Math.floor(document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                    animacarta = true;
                }
            }
            if (animacarta)
                setTimeout(function() { anima_principal(sitPosition, tipo_movimento, cardSlot) }, parametros_animacao.anima_carta.movimento_carta_velocidade);

        }

        if (tipo_movimento == 'abaixar') {
            //abaixa a carta até o 'pé' do compartimento de cartas (playerCards)
            animacarta = false;
            conjunto_jogadores[sitPosition].anima_principal.rodando = false;
            if ((cardSlot == 'card1') || (cardSlot == '')) {
                if ((document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1) < Math.round(document.getElementById('playerCards' + sitPosition).style.height.replace('px', ''))) {
                    document.getElementById("card1Seat" + sitPosition).style.marginTop = Math.round(document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                    animacarta = true;
                }
            }
            if ((cardSlot == 'card2') || (cardSlot == '')) {
                if ((document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1) < Math.round(document.getElementById('playerCards' + sitPosition).style.height.replace('px', ''))) {
                    document.getElementById("card2Seat" + sitPosition).style.marginTop = Math.round(document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                    animacarta = true;
                }
            }
            if (animacarta)
                setTimeout(function() { anima_principal(sitPosition, tipo_movimento, cardSlot) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }

        //Se o movimento for da posição de cartas do jogador principal para o secundário e as cartas estiverem entre a posição primária e secundária, anima.
        if ((tipo_movimento == 'principal->secundaria')) { // && (((document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1) < ((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)))) {
            console.log(tipo_movimento)
            animacarta = false;
            conjunto_jogadores[sitPosition].anima_principal.rodando = false;
            if (document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 < Math.ceil(carta.posicao.primeira.secundaria.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao)) {
                console.log("card1Seatx:" + document.getElementById("card1Seat" + sitPosition).style.marginLeft);
                document.getElementById("card1Seat" + sitPosition).style.marginLeft = Math.ceil(((document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1) + parametros_animacao.anima_carta.movimento_carta_step)) + 'px';
                animacarta = true;
            }
            if (document.getElementById("card2Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 > Math.floor(carta.posicao.segunda.secundaria.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao)) {
                console.log("card2Seatx:" + document.getElementById("card2Seat" + sitPosition).style.marginLeft);
                console.log(Math.round(carta.posicao.segunda.secundaria.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao));
                document.getElementById("card2Seat" + sitPosition).style.marginLeft = Math.floor(document.getElementById("card2Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 - parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                animacarta = true;
            }
            if (document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 < Math.ceil((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)) {
                console.log("card1Seaty" + sitPosition + ":" + document.getElementById("card1Seat" + sitPosition).style.marginTop);
                console.log(Math.round((1 - carta.posicao.primeira.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao));
                console.log("Parte 1:" + document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1);
                console.log("Parte 2:" + (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step);
                document.getElementById("card1Seat" + sitPosition).style.marginTop = Math.ceil(document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + 1 * (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';

                console.log("MarginTop:" + document.getElementById("card1Seat" + sitPosition).style.marginTop);
                animacarta = true;
            }
            if (document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 < Math.ceil((1 - carta.posicao.segunda.secundaria.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)) {
                console.log("card2Seaty:" + document.getElementById("card2Seat" + sitPosition).style.marginTop);
                document.getElementById("card2Seat" + sitPosition).style.marginTop = Math.ceil(document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                animacarta = true;
            }

            if (animacarta)
                setTimeout(function() { anima_principal(sitPosition, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }

        //Se o movimento for da posição de cartas do jogador secundário para o principal e as cartas estiverem entre a posição primária e secundária, anima.
        if ((tipo_movimento == 'secundaria->principal')) { //&& (((document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1) > ((1 - carta.posicao.primeira.principal.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)))) { // && (document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 > (document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 + (carta.dimensoes.altura_total / carta.dimensoes.largura_total)))) {
            animacarta = false;
            conjunto_jogadores[sitPosition].anima_principal.rodando = false;
            if (document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 > Math.floor(carta.posicao.primeira.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao)) {
                document.getElementById("card1Seat" + sitPosition).style.marginLeft = Math.floor(document.getElementById("card1Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 - parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                animacarta = true;
            }
            if (document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 > Math.floor((1 - carta.posicao.primeira.principal.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)) {
                document.getElementById("card1Seat" + sitPosition).style.marginTop = Math.floor(document.getElementById("card1Seat" + sitPosition).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                animacarta = true;
            }
            if (document.getElementById("card2Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 < Math.ceil(carta.posicao.segunda.principal.x * jogador_geral.largura_total * conjunto_jogadores[sitPosition].proporcao)) {
                document.getElementById("card2Seat" + sitPosition).style.marginLeft = Math.ceil(document.getElementById("card2Seat" + sitPosition).style.marginLeft.replace('px', '') * 1 + parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                animacarta = true;
            }
            if (document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 > Math.floor((1 - carta.posicao.segunda.principal.y) * jogador_geral.altura_total * conjunto_jogadores[sitPosition].proporcao)) {
                document.getElementById("card2Seat" + sitPosition).style.marginTop = Math.floor(document.getElementById("card2Seat" + sitPosition).style.marginTop.replace('px', '') * 1 - (carta.dimensoes.altura_total / carta.dimensoes.largura_total) * parametros_animacao.anima_carta.movimento_carta_step) + 'px';
                animacarta = true;
            }
            if (animacarta)
                setTimeout(function() { anima_principal(sitPosition, tipo_movimento) }, parametros_animacao.anima_carta.movimento_carta_velocidade);
        }
    } else {
        conjunto_jogadores[sitPosition].anima_principal.rodando = false;
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
function revela_cartas(sitPosition, primeira_valor, primeira_naipe, segunda_valor, segunda_naipe) {
    document.getElementById("card1Seat" + sitPosition).style.backgroundImage = "url('images/" + primeira_valor + primeira_naipe + ".png')";
    document.getElementById("card2Seat" + sitPosition).style.backgroundImage = "url('images/" + segunda_valor + segunda_naipe + ".png')";
}

/**
 * Função: ESCONDE_CARTAS
 * Objetivo: esconder valor das cartas.
 * Como: montando imagem de background com a imagem das costas das cartas. 
 * Observações: 
 */
function esconde_cartas(sitPosition) {
    document.getElementById("card1Seat" + sitPosition).style.backgroundImage = "url('images/Back.png')";
    document.getElementById("card2Seat" + sitPosition).style.backgroundImage = "url('images/Back.png')";
}

/**
 * Função: OPERAÇÃO
 * Objetivo: realizar operações matemáticas nos elementos pot e fichas.
 * Como:
 * 1. Realiza as operações matemáticas com o valor inicial, valor da operação e atualiza o valor final.
 * 2. Chama a função muda_digito para rolar os dígitos de acordo com o resultado da operação. 
 *  
 */

function operacao(sitPosition, ficha_ou_pot, operacao, valor_operacao) {
    valor_atual = conjunto_jogadores[sitPosition].valor[ficha_ou_pot];
    if (operacao == 'adicao')
        valor_final = valor_atual + valor_operacao;
    else if (operacao == 'subtracao')
        valor_final = valor_atual - valor_operacao;
    else if (operacao == 'multiplicacao')
        valor_final = valor_atual * valor_operacao;
    else if (operacao == 'divisao')
        valor_final = Math.floor(valor_atual / valor_operacao);
    conjunto_jogadores[sitPosition].valor[ficha_ou_pot] = valor_final;
    muda_digito(ficha_ou_pot, sitPosition, valor_final, valor_atual);
}




/**
 * Função: MUDA_DIGITO
 * Objetivo: realizar animações de deslocamento de dígitos e comandos sobre os dígitos a serem rolados nos espaços ficha e pot.
 * Como: comentários no corpo da função
 * Observações: dependendo do local do usuário, localeString muda, trocando . por , e vice-versa.
 * 
 */
//Muda digito, monta número, deslocando à esquerda - Apenas deslocar a diferença entre valor inicial e final. Se valor final tiver mais dígitos que o inicial, movimenta à esquerda. Se tiver menos, movimenta à direita.
function muda_digito(fichas_ou_pot, sitPosition, valor_final, valor_inicial, tira_digito = false, qtde_digitos_adicionais = 0) {


    if (parseInt((valor_final + '').replace(/\D/g, ''), 10) > parseInt((valor_inicial + '').replace(/\D/g, ''), 10)) {
        conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot] = "para baixo";
    } else {
        conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot] = "para cima";
    }

    //Converte número em texto com . e , corretos.
    valor_final = valor_final.toLocaleString();
    valor_inicial = valor_inicial.toLocaleString();

    if (valor_final.length < valor_inicial.length) {
        zeros = "000.000.000.000.000.000.000";

        if ((tira_digito == false) && (digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] <= (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - parseInt((valor_final + '').replace(/\D/g, ''), 10).toLocaleString().length))) {
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
        condicao1 = (digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] > (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo']) - valor_final.length);

    } else if (valor_final.length == valor_inicial.length) {
        direcao_deslocamento = 0;
        condicao1 = ((digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] > (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo']) - valor_final.length));

    } else {
        direcao_deslocamento = -1;
        condicao1 = ((digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] > (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo']) - valor_inicial.length));
    }


    if (condicao1) {
        setTimeout(function() {
            //Mostra primeiro dígito            
            document.getElementById(fichas_ou_pot + "jogador" + sitPosition + "digito" + (digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] * 1)).style.display = 'block';

            if ((valor_final.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_final.length) - 1) == '.') &&
                (valor_inicial.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1) == '.')) {
                roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'], '.', '.', conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot], tira_digito, qtde_digitos_adicionais);
                tempo_muda_digito = 0;
            }
            //Se na rolagem o primeiro dígito ficar em branco, onde o tamanho do valor final é menor que do inicial, esconde o elemento do dígito, reduzindo o tamanho do div e seu fundo.
            else if ((valor_final.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_final.length) - 1) == '')) {
                tempo_muda_digito = 0;
            }
            //Se o valor final for maior que o inicial e a posição for de ., solicita rotação do dígito de $ para .            
            else if ((valor_final.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_final.length) - 1) == '.') &&
                (valor_inicial.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1) != '.')) {
                roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'], '$', '.', conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot]);
                tempo_muda_digito = 0;
            } else if ((valor_final.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_final.length) - 1) != '.') && (valor_inicial.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1) == '.')) {
                document.getElementById(fichas_ou_pot + "jogador" + sitPosition + "digito" + (digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] * 1 - 1)).innerHTML = "<div id='" + fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] + "teste' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>.</div>";
                tempo_muda_digito = 0; //Quando for '.', já passa para outro dígito sem esperar o tempo de rodagem de número.
            } else {
                //Se o tamanho do valor final for menor que o inicial, tira dígitos
                if ((valor_final.length < valor_inicial.length) && (digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] > (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_inicial.length) && digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] <= (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_final.length))) {

                    roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'], valor_inicial.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1), -1, conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot]);
                    tempo_muda_digito = 0;
                }
                //Se o tamanho do valor final for maior que o inicial e não for '.', roda o dígito para o número desejado
                else {
                    valor_inicial_digito = valor_inicial.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_inicial.length) - 1);
                    valor_final_digito = valor_final.charAt(digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] - (digitos_por_jogador[sitPosition][fichas_ou_pot]['maximo'] - valor_final.length) - 1);


                    if (valor_inicial_digito == '') {
                        valor_inicial_digito = 0
                    }

                    i = valor_inicial_digito;
                    if ((valor_final_digito < valor_inicial_digito) && (conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot] == "para baixo"))
                        valor_final_digito = valor_final_digito * 1 + 10 * 1;

                    if ((valor_final_digito > valor_inicial_digito) && (conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot] == "para cima")) {
                        valor_inicial_digito = valor_inicial_digito * 1 + 10 * 1;
                    }

                    document.getElementById(fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual']).innerHTML = "<div id='" + fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'] + "cifrao' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>" + i * 1 + "</div>";
                    if (conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot] == "para baixo")
                        document.getElementById(fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual']).style.marginTop = '0px';

                    roda_digito(fichas_ou_pot, fichas_ou_pot + "jogador" + sitPosition + "digito" + digitos_por_jogador[sitPosition][fichas_ou_pot]['atual'], valor_inicial_digito * 1, valor_final_digito, conjunto_jogadores[sitPosition]['direcao'][fichas_ou_pot], tira_digito, qtde_digitos_adicionais);
                    tempo_muda_digito = parametros_animacao.muda_digito.velocidade;;

                }
            }
            //Desloca cursor do dígito para a esquerda
            digitos_por_jogador[sitPosition][fichas_ou_pot]['atual']--;
            if (qtde_digitos_adicionais > 0)
                qtde_digitos_adicionais--;
            muda_digito(fichas_ou_pot, sitPosition, parseInt((valor_final + '').replace(/\D/g, ''), 10), parseInt((valor_inicial + '').replace(/\D/g, ''), 10), tira_digito, qtde_digitos_adicionais);
        }, tempo_muda_digito);
    } else {
        //Finalizada a rolagem, reinicializa cursor do dígito
        inicializa_digitos_max_min(sitPosition, fichas_ou_pot);
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

function monta_pilha_fichas(sitPosition, array_fichas) {
    html = "";
    tamanho_pilha = 0;

    for (indice_valor_ficha = 0; indice_valor_ficha < array_fichas.length; indice_valor_ficha++) {
        if (array_fichas[indice_valor_ficha] > 0) {
            for (qtde_fichas_por_valor = 0; qtde_fichas_por_valor < array_fichas[indice_valor_ficha]; qtde_fichas_por_valor++) {
                tamanho_pilha++;
                html = html + "<div id='ficha" + tamanho_pilha + "jogador" + sitPosition + "' style='position:absolute;height:1vw;width:1vw;margin-left:" + (ficha.caixa_fichas.largura / 2 - ficha.dimensoes.largura / 2) + "px;margin-top:" + (tamanho_pilha * parametros_animacao.anima_fichas.distancia_entre_fichas) + "px;z-index:" + (100 - tamanho_pilha) + "'><img src='" + ficha_valores[indice_valor_ficha].imagem + "' /></div>";
            }
        }
    }

    //Inclui as fichas em um compartimento.
    document.getElementById('caixa_fichas_jogador' + sitPosition).style.height = (tamanho_pilha * parametros_animacao.anima_fichas.distancia_entre_fichas + ficha.dimensoes.altura) + 'px';
    document.getElementById('caixa_fichas_jogador' + sitPosition).innerHTML = html;
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

function anima_fichas(sitPosition, array_fichas, init = true, movimento = 0) {

    if (init) {
        tamanho_pilha = monta_pilha_fichas(sitPosition, array_fichas);
        chao = -1 * (ficha.dimensoes.altura / 2);
        counter1 = parametros_animacao.anima_fichas.inicio_queda;

    }

    document.getElementById('caixa_fichas_jogador' + sitPosition).style.display = 'block';

    if (movimento < parametros_animacao.anima_fichas2.length) {

        if (movimento % 2 == 0) //Movimento de descida
        {
            document.getElementById('caixa_fichas_jogador' + sitPosition).style.opacity = document.getElementById('caixa_fichas_jogador' + sitPosition).style.opacity * 1 + 0.02;

            if (counter1 < chao)
                counter1 += parametros_animacao.anima_fichas2[movimento].velocidade;
            else {
                movimento++;
                for (posicao_pilha = 1; posicao_pilha <= tamanho_pilha; posicao_pilha++) {
                    //Quando chegar no chão, espalha as fichas em um movimento aleatório                                    
                    aleatorio = (Math.random() - 0.5) * 1; //A variação é entre um leve deslocamento à direita e esquerda. Caso deseje aumentar a distância entre fichas, basta aumentar o valor onde está 0.5
                    document.getElementById("ficha" + posicao_pilha + "jogador" + sitPosition).style.marginLeft = (document.getElementById("ficha" + posicao_pilha + "jogador" + sitPosition).style.marginLeft.replace('px', '') * 1 + aleatorio) + 'px'; //aleatorio + 'px'; //(conjunto_jogadores[sitPosition].posicao_ficha.x * 1 + Math.random() * 10) + 'px';
                }
            }
        } else //Movimento de subida
        {
            if (counter1 >= -parametros_animacao.anima_fichas2[movimento].posicao + chao)
                counter1 -= parametros_animacao.anima_fichas2[movimento].velocidade;
            else
                movimento++;
        }
        document.getElementById('caixa_fichas_jogador' + sitPosition).style.marginTop = (conjunto_jogadores[sitPosition].posicao_ficha.y + counter1) + 'px';
        setTimeout(function() { anima_fichas(sitPosition, array_fichas, false, movimento) }, parametros_animacao.anima_fichas.velocidade);
    }


}

/**
 * Função: INICIALIZA_DIGITOS_MAX_MIN
 * Objetivo: inicializar jogador com a quantidade máxima de dígitos para os espaços pot e fichas. Zerar o cursor do dígito que está sendo percorrido.
 * Como: 
 * Observações: 
 * 
 */
function inicializa_digitos_max_min(sitPosition, ficha_ou_pot) {
    if (ficha_ou_pot == 'todos') {
        digitos_por_jogador[sitPosition]['pot']['maximo'] = limite_digitos['pot']['maximo'];
        digitos_por_jogador[sitPosition]['pot']['atual'] = limite_digitos['pot']['atual'];
        digitos_por_jogador[sitPosition]['pot']['minimo'] = limite_digitos['pot']['minimo'];
        digitos_por_jogador[sitPosition]['fichas']['maximo'] = limite_digitos['fichas']['maximo'];
        digitos_por_jogador[sitPosition]['fichas']['atual'] = limite_digitos['fichas']['atual'];
        digitos_por_jogador[sitPosition]['fichas']['minimo'] = limite_digitos['fichas']['minimo'];
    } else {
        digitos_por_jogador[sitPosition][ficha_ou_pot]['maximo'] = limite_digitos[ficha_ou_pot]['maximo'];
        digitos_por_jogador[sitPosition][ficha_ou_pot]['atual'] = limite_digitos[ficha_ou_pot]['atual'];
        digitos_por_jogador[sitPosition][ficha_ou_pot]['minimo'] = limite_digitos[ficha_ou_pot]['minimo'];
    }

}

/**
 * Função: INICIALIZA_DIGITOS_VALORES
 * Objetivo: criar lista de números a serem rolados. O total de dígitos é a quatidade que o placar suporta. 1 a 0, $ e . Total:12 digitos.
 * Como: um elemento div é encaixado em cima do outro com os seguintes dígitos $, .,0(se for o primeiro dígito)/espaço (para os demais dígitos),1,2,3,4,5,6,7,8,9,0.
 * Observações: 
 * 
 */

function inicializa_digitos_valores(sitPosition, fichas_ou_pot) {

    total_digitos = limite_digitos[fichas_ou_pot]['maximo'];

    if (fichas_ou_pot == 'fichas') {

        tamanho_digito = texto.fichas.digito.altura;
        largura_numero = texto.fichas.digito.largura;
        borda = 0;
        margem_superior = 0 //-1 * (tamanho_digito + 2 * borda) // * 12;
    } else {

        tamanho_digito = Math.ceil(texto.valor_jogador.dimensoes.altura);
        largura_numero = texto.valor_jogador.digito.largura * conjunto_jogadores[sitPosition].proporcao;
        borda = 0;
        margem_superior = 0 //-1 * (tamanho_digito + 2 * borda) // * 12;


    }
    html = "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>$</div></div>";

    for (digito = 1; digito <= total_digitos; digito++) {
        htmlnumeros = '';
        htmlnumeros = htmlnumeros + "<div id='" + fichas_ou_pot + "jogador" + sitPosition + "digito" + digito + "cifrao' style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'></div>";
        html = html + "<div id='" + fichas_ou_pot + "jogador" + sitPosition + "digito" + digito + "' style='float:left;margin-top:" + margem_superior + "px;display:none'>" + htmlnumeros + "</div>";
    }
    html = html + "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>,</div></div>";
    html = html + "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>0</div></div>";
    html = html + "<div style='float:left'><div style='text-align:center;height:" + tamanho_digito + "px;width:" + largura_numero + "px;'>0</div></div>";

    document.getElementById('total' + fichas_ou_pot + sitPosition).innerHTML = html;
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