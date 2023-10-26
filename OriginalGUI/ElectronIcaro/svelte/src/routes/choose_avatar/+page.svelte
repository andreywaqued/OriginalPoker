<script>
    import { onMount } from 'svelte';
  
    let selectedAvatar;
  
    onMount(() => {
      const avatarInputs = document.querySelectorAll('input[name="avatar"]');
      avatarInputs.forEach(input => {
        input.addEventListener('change', updateButtonTooltip);
      });
  
      updateButtonTooltip();
    });
  
    function updateButtonTooltip() {
      const saveButton = document.getElementById('saveAvatarButton');
  
      if (!selectedAvatar) {
        saveButton.setAttribute('disabled', 'disabled');
        saveButton.setAttribute('title', 'Selecione um avatar para habilitar este botão');
      } else {
        saveButton.removeAttribute('disabled');
        saveButton.setAttribute('title', 'Clique para salvar o avatar selecionado');
      }
    }
  </script>
  
  <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 1200px;
        margin: 50px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .avatars-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .avatar-item {
        position: relative;
    }

    .avatar-item input[type="radio"] {
        display: none;
    }

    .avatar-item label {
        display: block;
        cursor: pointer;
        outline: none; /* Remove o outline padrão */
    }

    .avatar-item input[type="radio"]:checked + label img {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Sombra mais escura e maior para destacar */
        transform: scale(1.30); /* Aumenta a imagem em 15% quando selecionada */
        border: 3px solid #333; /* Adiciona uma borda ao redor do avatar selecionado */
    }

    button {
        display: block;
        background-color: #333;
        color: #fff;
        border: none;
        padding: 10px 20px;
        margin: 20px auto;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #555;
    }

    .avatar-item img {
        width: 150px;  /* Largura da imagem */
        height: 150px; /* Altura da imagem */
        border-radius: 50%; /* Arredonda os cantos da imagem, tornando-a um círculo */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave em torno da imagem para um efeito elevado */
        transition: transform 0.2s ease; /* Efeito de transição para o hover */
    }

    .avatar-item img:hover {
        transform: scale(1.1); /* Aumenta a imagem em 10% quando o mouse passa por cima */
    }

    button[disabled] {
        background-color: #cccccc; /* Cor de fundo cinza claro */
        color: #888888; /* Cor de texto cinza escuro */
        cursor: not-allowed; /* Muda o cursor para indicar que a ação não é permitida */
    }

    button[disabled]:hover {
        background-color: #cccccc; /* Mantém a cor de fundo cinza claro no hover */
        color: #888888; /* Mantém a cor de texto cinza escuro no hover */
    }

    .flash {
        background-color: #dff0d8;
        border-color: #d6e9c6;
        color: #3c763d;
        padding: 10px;
        margin: 20px;
        border-radius: 5px;
        text-align: center;
    }

    .flash.success {
        background-color: #dff0d8;
        border-color: #d6e9c6;
        color: #3c763d;
    }


  </style>
  
  <div class="container">
    <h2>Escolha seu Avatar</h2>
    <form action="/update_avatar" method="post">
      <div class="avatars-grid">
        {#each Array(32) as _, i}
          <div class="avatar-item">
            <input type="radio" bind:group={selectedAvatar} id="avatar{i + 1}" name="avatar" value="avatar{i + 1}.png">
            <label for="avatar{i + 1}">
              <img src="/public/avatars/avatar{i + 1}.png" alt="Avatar {i + 1}">
            </label>
          </div>
        {/each}
      </div>
      <button type="submit" id="saveAvatarButton" disabled={!selectedAvatar}>Salvar Avatar</button>
    </form>
  </div>
  