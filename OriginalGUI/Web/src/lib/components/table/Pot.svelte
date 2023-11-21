<script>
	/**
	 * @type {Number}
	 */
	export let potAmount;
	export let showValuesInBB = false;
</script>

{#if potAmount != 0}
	<div class="pot">
		<span class:value={!showValuesInBB} class:valueInBB={showValuesInBB}
			>{showValuesInBB ? '' : '$ '}{potAmount}{showValuesInBB ? ' BB' : ''}</span
		>
	</div>
{/if}

<style>
	.pot {
		color: white;
		width: 100%;
	}
	span {
		background-color: rgba(77, 77, 77, 0.25);
		width: 100%;
		padding: 5% 10%;
		border-radius: 5px;
		font-size: 2vh;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	/* .value::before{
      content: "$ ";
      padding-right: 5%;
    }
    .valueInBB::after{
      content: " BB";
      padding-right: 5%;
    } */
</style>
