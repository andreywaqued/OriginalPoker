<script>
    import { onMount } from 'svelte';
  
    export let onClose;
    let api;
  
    let selectedAvatar;
  
    onMount(() => {
      const avatarInputs = document.querySelectorAll('input[name="avatar"]');
      avatarInputs.forEach(input => {
        input.addEventListener('change', updateButtonTooltip);
      });
  
      updateButtonTooltip();

      if (window.api) {
            api = window.api
        }
    });
  
    function updateButtonTooltip() {
      const saveButton = document.getElementById('saveAvatarButton');
  
      if (!selectedAvatar) {
        saveButton.setAttribute('disabled', 'disabled');
        saveButton.setAttribute('title', 'Selecione um avatar para habilitar este botão');
      } else {
        saveButton.removeAttribute('disabled');
        saveButton.setAttribute('title', 'Clique para salvar o avatar selecionado');
        scrollToSaveButton();
      }
    }
  
    function scrollToSaveButton() {
      const saveButton = document.getElementById('saveAvatarButton');
      saveButton.scrollIntoView({ behavior: 'smooth' });
    }
  
    function saveAvatar() {
        onClose(selectedAvatar);
    }
  </script>
  
    
  <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #2a2a2a; /* Fundo escuro */
        margin: 0;
        padding: 0;
    }
  
    .container {
        max-width: 80vw;
        margin: 0 auto;
        background-color: #333;
        padding: 20px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        overflow-y: auto;
        height: 500px;
        border-radius: 10px;
    }

  
    h2 {
        text-align: center;
        margin-bottom: 40px;
        color: #979797; /* Texto branco para o título */
    }
  
    .avatars-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 40px;
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
        outline: none;
    }
  
    .avatar-item input[type="radio"]:checked + label img {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        transform: scale(1.30);
        border: 3px solid #555; /* Bordas mais claras para o avatar selecionado */
    }
  
    button {
        display: block;
        background-color: #555; /* Fundo mais claro para o botão */
        color: #fff;
        border: none;
        padding: 10px 20px;
        margin: 40px auto 20px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
  
    button:hover {
        background-color: #777; /* Fundo mais claro para o hover */
    }
  
    .avatar-item img {
        width: 120px;
        height: 145px;
        border-radius: 50%;
        box-shadow: 0 30px 8px rgba(0, 0, 0, 0.2); /* Sombra sutil */
        transition: transform 0.2s ease;
    }
  
    .avatar-item img:hover {
        transform: scale(1.1);
    }
  
    button[disabled] {
        background-color: #444; /* Fundo mais claro para o botão desativado */
        color: #666; /* Texto mais claro para o botão desativado */
        cursor: not-allowed;
    }
  
    button[disabled]:hover {
        background-color: #444; /* Mantém a cor de fundo para o hover */
        color: #666; /* Mantém a cor de texto para o hover */
    }

  </style>
    
  <div class="container">
    <h2>Choose your Avatar</h2>
    <form action="/update_avatar" method="post">
      <div class="avatars-grid">
        {#each Array(32) as _, i}
          <div class="avatar-item">
            <input type="radio" bind:group={selectedAvatar} id="avatar{i}" name="avatar" value="{i}.png">
            <label for="avatar{i}">
              <img src="./avatar/{i}.png" alt="Avatar {i}">
            </label>
          </div>
        {/each}
      </div>
      <button type="submit" id="saveAvatarButton" disabled={!selectedAvatar} on:click={saveAvatar}>Save Avatar</button>
    </form>
  </div>