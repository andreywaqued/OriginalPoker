<script>
    export let userName, avatarUrl
</script>

<style lang="scss">
  * {
    margin: 0;
  }

  .profileDiv {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 94%;
    padding: 2% 3%;
    background-color: rgb(24, 24, 24);
    gap: 2em;
    letter-spacing: 0.1em;
  }

  .profileDiv .upper {
    display: flex;
    gap: 2em;
    justify-content: space-between;
    height: 50%;
  }

  .profileDiv .lower {
    width: 100%;
    margin: auto 0;
  }

  .profileDiv .caixa {
  }

  .profileDiv .caixa > * + * {
    margin-top: 0.5em;
  }

  .profileDiv .caixa h2 {
    text-transform: uppercase;
    font-size: 1em;
  }

  .profileDiv .caixa .container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5em;
  }

  .profileDiv .caixa h3 {
    font-weight: unset;
    text-transform: uppercase;
    color: gray;
    font-size: 0.6em;
  }

  .profileDiv .caixa .item p {
    font-size: 0.6em;
  }

  .profileDiv .caixa .item > * {
    margin-top: 0.5em;
  }

  .profileDiv .caixa .item:nth-of-type(2) {
    text-align: right;
  }

  .profileDiv .caixa .item:nth-of-type(3)  {
    border: 0;
    padding-top: 0.5em;
    border-top-width: 3px;
    border-style: solid;
    border-color: gray;
    grid-column: span 2 / span 2;
  }

  .profileDiv .caixa .item:nth-of-type(4) {
    grid-column: span 2 / span 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5em;
  }

  .profileDiv .historico {
    grid-column: span 2 / span 2;
    width: 70%;
  }

  .profileDiv .historico h2 {
    text-transform: uppercase;
    font-size: 1em;
  }

  .profileDiv .historico .container {
    height: 90%;
    overflow: auto;
  }

  .profileDiv .historico table {
    margin-top: 0.5em;
    width: 100%;
    text-align: center;
    border-radius: 10px;
    background-color: rgb(49, 49, 49);
  }

  .profileDiv .historico table th {
    font-size: 0.6em;
    height: 2em;
  }

  .profileDiv .historico table td {
    font-size: 0.6em;
    height: 2.4em;
  }

  .profileDiv .jogador {
    margin-top: auto;
    column-span: 2;
    display: flex;
    justify-content: space-between;
    gap: 0.5em;
  }

  .profileDiv .jogador .container:nth-of-type(1) {
    display: flex;
    align-items: end;
    gap: 0.5em;
  }

  .profileDiv .jogador .container:nth-of-type(2) {
    width: 60%;
    display: grid;
    justify-content: end;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5em;
  }

  .profileDiv .jogador .item > * {
    margin-top: 0.5em;
  }

  .profileDiv .jogador .container .item h2 {
    text-transform: uppercase;
    color: gray;
    font-weight: unset;
    font-size: 0.6em;
  }

  .profileDiv .jogador .container .item .bigText {
    color: white;
    font-size: 2em;
  }

  .profileDiv .jogador .container .item h3 {
    text-transform: uppercase;
    font-weight: unset;
    color: gray;
    font-size: 0.6em;
  }

  .profileDiv .jogador .container .item p {
    color: white;
    font-size: 0.6em;
  }

  .profileDiv .jogador .container .item:last-of-type {
  }
</style>

<div class="profileDiv">
  <div class="upper">
    <div class="caixa">
      <h2>
        Cashier
      </h2>
      <div class="container">
        <div class="item">
          <h3>
              Available
          </h3>
          <p>
            $numero
          </p>
        </div>
        <div class="item">
          <h3>
              In-game
          </h3>
          <p>
            $numero
          </p>
        </div>
        <div class="item">
          <h3>
              Total
          </h3>
          <p>
            $numero
          </p>
        </div>
        <div class="item">
          <button>Deposit</button>
          <button>Withdraw</button>
        </div>
      </div>
    </div>
    <div class="historico">
      <h2>
        Player history
      </h2>
      <div class="container">
        <table rules=rows>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>From</th>
            <th>Resultado</th>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
          <tr>
            <td>$Data</td>
            <td>$Hora</td>
            <td>$From</td>
            <td>$Resultado</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="lower">
    <div class="jogador">
      <div class="container">
        <img height=150 width=150 src={avatarUrl} />
        <div class="item">
          <h2>
            User
          </h2>
          <p class="bigText">
            {userName}
          </p>
        </div>
      </div>
      <div class="container">
        <div class="item">
          <h3>
              Full Name
          </h3>
          <p>
            $Nome
          </p>
        </div>
        <div class="item">
          <h3>
              Birthday
          </h3>
          <p>
            $Data
          </p>
        </div>
        <div class="item">
          <h3>
              E-mail
          </h3>
          <p>
            $Email
          </p>
        </div>
        <div class="item">
          <h3>
              Telephone
          </h3>
          <p>
            $Celular
          </p>
        </div>
        <div class="item">
          <h3>
              Address
          </h3>
          <p>
            $Endereco
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

