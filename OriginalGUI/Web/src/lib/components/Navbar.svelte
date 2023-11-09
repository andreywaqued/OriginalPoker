<script>
    import { navItems } from "$lib/stores";
</script>

<div class="bg-slate-600 w-full h-10 flex overflow-auto items-center px-2 gap-x-2">
    {#each $navItems as item}
        <div class="bg-black h-fit rounded-md text-blue-300 py-1 px-2 uppercase font-bold text-sm">
            <p>
                {item}
            </p>
            <p />
        </div>
    {/each}
</div>
