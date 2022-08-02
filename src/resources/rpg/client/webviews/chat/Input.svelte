<script lang="ts">
    export let message = ""
</script>

<style>
    .author {
        
    }
    .author:after {
        content: ": ";
    }
    .message {

    }
</style>

<input value:bind={message}/>