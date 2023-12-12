<script lang="ts">
	// reference https://svelte.dev/examples/modal

	let className: string;
	export { className as class };

	export let showModal: boolean | undefined;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) {
		dialog.showModal();
	} else if (dialog && showModal === false) {
		dialog.close();
		showModal = false;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class={className}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="relative flex h-full w-full flex-col">
		<!-- svelte-ignore a11y-autofocus -->
		<button class="absolute right-0 bg-red-500 h-6 rounded-bl aspect-square" autofocus on:click={() => dialog.close()}
			>X</button
		>
		<slot />
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.7);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
