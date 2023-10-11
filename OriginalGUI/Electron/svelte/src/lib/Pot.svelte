<script>
    /**
     * @type {Number}
    */
    export let potAmount
</script>
{#if potAmount != 0}
    <div class="pot"><span>{potAmount}</span></div>
{/if}

<style>
    .pot {
        transform: translateX(-10%);
    }
    span{
        background-color: rgba(77,77,77,0.25);
        width: 100%;
        padding: 5% 10%;
        border-radius: 5px;
        color: white;
        font-size: 0.8em;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    span::before{
      content: "$";
      padding-right: 5%;
      /* font-size: 0.9em; */
    }
</style>